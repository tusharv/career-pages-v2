"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  COMPANY_LOGOS_BUCKET,
  getCareersHostname,
} from "@/lib/company-logo";

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
  revalidateTag("companies");
  revalidateTag("openings");
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

export type UploadCompanyLogoState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function uploadCompanyLogo(
  _prev: UploadCompanyLogoState,
  formData: FormData
): Promise<UploadCompanyLogoState> {
  try {
    const supabase = await requireAdminSupabase();
    const slug = String(formData.get("company_slug") ?? "").trim();
    const file = formData.get("logo");

    if (!slug) {
      return { status: "error", message: "Missing company." };
    }
    if (!file || !(file instanceof File) || file.size === 0) {
      return { status: "error", message: "Choose an image file." };
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      return { status: "error", message: "File must be 2MB or smaller." };
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return {
        status: "error",
        message: "Use a JPEG, PNG, WebP, or GIF image.",
      };
    }

    const { data: row, error: loadErr } = await supabase
      .from("companies")
      .select("careers_url, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (loadErr || !row) {
      return {
        status: "error",
        message: loadErr?.message ?? "Company not found.",
      };
    }

    const host = getCareersHostname(row.careers_url);
    if (!host) {
      return {
        status: "error",
        message:
          "Careers URL must be a valid URL with a hostname (used as the logo filename).",
      };
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const sharp = (await import("sharp")).default;
    let webp: Buffer;
    try {
      webp = await sharp(buf)
        .rotate()
        .resize(512, 512, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88 })
        .toBuffer();
    } catch {
      return {
        status: "error",
        message: "Could not process that image. Try a different file.",
      };
    }

    const key = `${host}.webp`;
    const { error: upErr } = await supabase.storage
      .from(COMPANY_LOGOS_BUCKET)
      .upload(key, webp, {
        contentType: "image/webp",
        upsert: true,
      });

    if (upErr) {
      return { status: "error", message: upErr.message };
    }

    revalidateCompanyPaths(row.slug);
    return { status: "success" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed.";
    if (msg === "Unauthorized" || msg === "Forbidden") {
      throw e;
    }
    return { status: "error", message: msg };
  }
}
