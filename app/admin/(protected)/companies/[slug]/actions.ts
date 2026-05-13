"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdminSupabase() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    throw new Error("Forbidden");
  }
  return supabase;
}

function revalidateCompanyPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/companies/${slug}`);
  revalidatePath(`/company/${slug}`);
}

export async function updateCompany(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const prevSlug = String(formData.get("prev_slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const careers_url = String(formData.get("careers_url") ?? "").trim();
  const blogRaw = String(formData.get("blog_url") ?? "").trim();
  const blog_url = blogRaw === "" ? null : blogRaw;

  if (!prevSlug || !name || !slug || !careers_url) {
    throw new Error("Name, slug, and careers URL are required.");
  }

  const { error } = await supabase
    .from("companies")
    .update({ name, slug, careers_url, blog_url })
    .eq("slug", prevSlug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompanyPaths(prevSlug);
  if (slug !== prevSlug) {
    revalidateCompanyPaths(slug);
  }

  if (slug !== prevSlug) {
    redirect(`/admin/companies/${slug}`);
  }
}

export async function createOpening(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const company_id = String(formData.get("company_id") ?? "").trim();
  const company_slug = String(formData.get("company_slug") ?? "").trim();
  const titleRaw = String(formData.get("title") ?? "").trim();
  const title = titleRaw === "" ? null : titleRaw;
  const url = String(formData.get("url") ?? "").trim();

  if (!company_id || !company_slug || !url) {
    throw new Error("Job URL is required.");
  }

  const { data: maxRows, error: maxErr } = await supabase
    .from("openings")
    .select("sort_order")
    .eq("company_id", company_id)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (maxErr) {
    throw new Error(maxErr.message);
  }

  const maxSort =
    maxRows && maxRows.length > 0 && typeof maxRows[0].sort_order === "number"
      ? maxRows[0].sort_order
      : -1;

  const { error } = await supabase.from("openings").insert({
    company_id,
    title,
    url,
    sort_order: maxSort + 1,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompanyPaths(company_slug);
}

export async function updateOpening(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const company_slug = String(formData.get("company_slug") ?? "").trim();
  const titleRaw = String(formData.get("title") ?? "").trim();
  const title = titleRaw === "" ? null : titleRaw;
  const url = String(formData.get("url") ?? "").trim();
  const sortRaw = String(formData.get("sort_order") ?? "").trim();
  const sort_order = sortRaw === "" ? 0 : Number.parseInt(sortRaw, 10);

  if (!id || !company_slug || !url || Number.isNaN(sort_order)) {
    throw new Error("Invalid opening fields.");
  }

  const { error } = await supabase
    .from("openings")
    .update({ title, url, sort_order })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompanyPaths(company_slug);
}

export async function deleteOpening(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const company_slug = String(formData.get("company_slug") ?? "").trim();

  if (!id || !company_slug) {
    throw new Error("Invalid delete request.");
  }

  const { error } = await supabase.from("openings").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCompanyPaths(company_slug);
}
