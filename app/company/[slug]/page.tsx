import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  ExternalLink,
  Link2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getCompanyPageData } from "@/lib/data/company-page";
import { getCompanyLogoSrc } from "@/lib/company-logo";

export const revalidate = 3600;

type PageProps = { params: { slug: string } };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const data = await getCompanyPageData(params.slug);
  if (!data) {
    return { title: "Company not found | Career Pages" };
  }
  const { company } = data;
  const title = `${company.name} — openings & careers | Career Pages`;
  const description = `Careers, engineering blog, and job links for ${company.name}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const data = await getCompanyPageData(params.slug);
  if (!data) {
    notFound();
  }

  const { company, openings } = data;
  const logoSrc = getCompanyLogoSrc(company.careers_url);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6 -ml-2 gap-1" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            All companies
          </Link>
        </Button>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              {logoSrc ? (
                <Image
                  width={28}
                  height={28}
                  src={logoSrc}
                  alt=""
                  className="rounded-none shrink-0"
                />
              ) : null}
              {company.name}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="default" className="gap-1">
                <a href={company.careers_url} target="_blank" rel="noreferrer">
                  <Briefcase className="h-4 w-4" />
                  Careers site
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              </Button>
              {company.blog_url ? (
                <Button asChild variant="outline" className="gap-1">
                  <a href={company.blog_url} target="_blank" rel="noreferrer">
                    <BookOpen className="h-4 w-4" />
                    Engineering blog
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </Button>
              ) : null}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Openings
              </h2>
              {openings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No individual job links are listed yet. Use the careers site
                  button above to browse all roles.
                </p>
              ) : (
                <ul className="space-y-2">
                  {openings.map((o) => (
                    <li key={o.id}>
                      <a
                        href={o.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1.5"
                      >
                        {o.title || o.url}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
