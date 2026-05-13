import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CompanyRow } from "@/lib/types/company";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyLogoMark } from "@/components/admin/CompanyLogoMark";
import { ExternalLink, Pencil } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: companies, error } = await supabase
    .from("companies")
    .select("id, slug, name, careers_url, blog_url")
    .order("name", { ascending: true });

  if (error) {
    return (
      <Card className="max-w-lg border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Could not load companies</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const rows = (companies ?? []) as CompanyRow[];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-0">
      <div className="space-y-2 border-b border-border/60 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="max-w-2xl text-muted-foreground text-[15px] leading-relaxed">
              Manage company profiles and job listing links. Logos match the public
              site when uploaded to storage.
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 px-3 py-1 text-sm font-normal">
            {rows.length} {rows.length === 1 ? "company" : "companies"}
          </Badge>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No companies yet</CardTitle>
            <CardDescription>
              Seed the database or add companies from Supabase to see them here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/30 px-6 py-5 sm:px-8">
            <CardTitle className="text-lg">All companies</CardTitle>
            <CardDescription className="text-base">
              Open the public page or edit records and openings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/80">
              {rows.map((c) => (
                <li
                  key={c.id}
                  className="group flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <CompanyLogoMark name={c.name} careersUrl={c.careers_url} />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div>
                        <p className="truncate font-semibold leading-snug tracking-tight text-foreground">
                          {c.name}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                          {c.slug}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <Link
                          href={`/company/${c.slug}`}
                          className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Public page
                          <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                        </Link>
                        <a
                          href={c.careers_url}
                          className="max-w-[min(100%,280px)] truncate text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Careers site
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 sm:pl-2">
                    <Button asChild size="sm" className="w-full gap-1.5 sm:w-auto">
                      <Link href={`/admin/companies/${c.slug}`}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
