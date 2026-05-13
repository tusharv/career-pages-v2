import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CompanyRow, OpeningRow } from "@/lib/types/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyLogoMark } from "@/components/admin/CompanyLogoMark";
import {
  createOpening,
  deleteOpening,
  updateCompany,
  updateOpening,
} from "./actions";
import { ArrowLeft, ExternalLink } from "lucide-react";

type PageProps = { params: { slug: string } };

export default async function AdminCompanyEditPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient();
  const { data: company, error } = await supabase
    .from("companies")
    .select("id, slug, name, careers_url, blog_url")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error || !company) {
    notFound();
  }

  const row = company as CompanyRow;

  const { data: openingsData, error: openingsError } = await supabase
    .from("openings")
    .select("id, company_id, title, url, sort_order")
    .eq("company_id", row.id)
    .order("sort_order", { ascending: true });

  if (openingsError) {
    console.error(openingsError);
  }

  const openings = (openingsData ?? []) as OpeningRow[];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-0">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Dashboard
          </Link>
        </Button>

        <div className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-5">
            <CompanyLogoMark name={row.name} careersUrl={row.careers_url} size="lg" />
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">Edit company</h1>
                <Badge variant="outline" className="font-mono text-xs font-normal">
                  {row.slug}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Update the public profile and job links shown on the company page.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 gap-2 self-start sm:self-auto">
            <Link href={`/company/${row.slug}`} target="_blank" rel="noreferrer">
              View public page
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-6 py-5 sm:px-8">
          <CardTitle className="text-lg">Company details</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Changing the slug updates the public URL at{" "}
            <span className="font-mono text-foreground">/company/&lt;slug&gt;</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-8 sm:px-8">
          <form action={updateCompany} className="mx-auto max-w-2xl space-y-6">
            <input type="hidden" name="prev_slug" value={row.slug} />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">
                  Name
                </label>
                <Input id="name" name="name" required defaultValue={row.name} className="h-11" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium leading-none" htmlFor="slug">
                  Slug
                </label>
                <Input id="slug" name="slug" required defaultValue={row.slug} className="h-11 font-mono text-sm" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium leading-none" htmlFor="careers_url">
                  Careers URL
                </label>
                <Input
                  id="careers_url"
                  name="careers_url"
                  type="url"
                  required
                  defaultValue={row.careers_url}
                  className="h-11"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium leading-none" htmlFor="blog_url">
                  Blog URL <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="blog_url"
                  name="blog_url"
                  type="url"
                  defaultValue={row.blog_url ?? ""}
                  className="h-11"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" size="lg" className="min-w-[140px]">
                Save company
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Job listings</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Each row is a linked opening on the public company page. Lower sort order
            appears first.
          </p>
        </div>

        <div className="space-y-5">
          {openings.map((o) => (
            <Card key={o.id} className="overflow-hidden shadow-sm">
              <CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
                <CardTitle className="text-base font-medium">Opening</CardTitle>
                <CardDescription className="truncate font-mono text-xs">
                  {o.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-5 py-6 sm:px-6">
                <form action={updateOpening} className="space-y-5">
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="company_slug" value={row.slug} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium" htmlFor={`title-${o.id}`}>
                        Title
                      </label>
                      <Input id={`title-${o.id}`} name="title" defaultValue={o.title ?? ""} className="h-11" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium" htmlFor={`url-${o.id}`}>
                        Job URL
                      </label>
                      <Input
                        id={`url-${o.id}`}
                        name="url"
                        type="url"
                        required
                        defaultValue={o.url}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2 sm:max-w-[140px]">
                      <label className="text-sm font-medium" htmlFor={`sort-${o.id}`}>
                        Sort order
                      </label>
                      <Input
                        id={`sort-${o.id}`}
                        name="sort_order"
                        type="number"
                        required
                        defaultValue={o.sort_order}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="gap-1.5">
                    Save opening
                  </Button>
                </form>
                <Separator />
                <form action={deleteOpening}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="company_slug" value={row.slug} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete opening
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}

          <Card className="border-dashed bg-muted/20 shadow-sm">
            <CardHeader className="px-5 pb-2 pt-6 sm:px-6">
              <CardTitle className="text-base font-medium">Add opening</CardTitle>
              <CardDescription>Append a new job link for this company.</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-6 sm:px-6">
              <form action={createOpening} className="mx-auto max-w-2xl space-y-5">
                <input type="hidden" name="company_id" value={row.id} />
                <input type="hidden" name="company_slug" value={row.slug} />
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="new-title">
                    Title <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input id="new-title" name="title" className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="new-url">
                    Job URL
                  </label>
                  <Input id="new-url" name="url" type="url" required className="h-11" />
                </div>
                <Button type="submit" size="sm">
                  Add opening
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
