// app/blog/[slug]/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  BookOpen,
  Search,
  Newspaper,
  Handshake,
  Bug,
} from "lucide-react";

interface ICompany {
  name: string;
  url: string;
  blog?: string;
  id?: number;
  [key: string]: string | number | undefined;
}

function getCompanies(): ICompany[] {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// ✅ SSG paths
export async function generateStaticParams() {
  const companies = getCompanies();
  return companies.map((company) => ({ slug: company.name }));
}

// ✅ Add dynamic metadata for each company
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const companies = getCompanies();
  const company = companies.find((p) => p.name === decodeURIComponent(params.slug).trim());

  if (!company) {
    return {
      title: "Company Not Found",
      description: "This company does not exist in our records.",
    };
  }

  const logoUrl = `/logo-cache/${new URL(company.url).hostname}.webp`;
  const title = `${company.name} | Company Profile`;
  const description = company.blog
    ? `Explore ${company.name}'s career page, blog, and updates.`
    : `Explore ${company.name}'s career page and company insights.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: company.url,
      siteName: company.name,
      images: [logoUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logoUrl],
    },
  };
}

export const revalidate = 60;

// ✅ SSG page component
export default async function Page({ params }: { params: { slug: string } }) {
  const companies = getCompanies();
  const company = companies.find((p) => p.name === decodeURIComponent(params.slug).trim());

  if (!company) {
    return <div className="p-10 text-center text-red-500">Company not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Avatar
              className="mr-2 rounded-none"
              style={{ width: "22px", height: "22px" }}
            >
              <AvatarImage
                src={`/logo-cache/${new URL(company.url).hostname}.webp`}
                alt={`${company.name} logo`}
              />
              <AvatarFallback>
                {company.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {company.name}
          </CardTitle>
        </CardHeader>

        <Separator className="mb-4" />

        <CardContent>
          <div className="flex flex-col gap-3">
            {/* Links */}
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <Link
                href={company.url}
                target="_blank"
                className="flex items-center text-primary hover:underline"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Jobs
              </Link>
              {company.blog && (
                <Link
                  href={company.blog}
                  target="_blank"
                  className="flex items-center text-primary hover:underline"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Blog
                </Link>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <Link
                href={`https://www.google.com/search?q=${company.name}`}
                target="_blank"
                className="flex items-center text-primary hover:underline"
              >
                <Search className="w-4 h-4 mr-1" />
                Search
              </Link>
              <Link
                href={`https://news.google.com/search?q=${company.name}`}
                target="_blank"
                className="flex items-center text-primary hover:underline"
              >
                <Newspaper className="w-4 h-4 mr-1" />
                News
              </Link>
              <Link
                href={`https://google.com/search?q=site:theorg.com ${company.name}&btnI=I`}
                target="_blank"
                className="flex items-center text-primary hover:underline"
              >
                <Handshake className="w-4 h-4 mr-1" />
                People <sup>[βeta]</sup>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <Link
                href={`https://github.com/tusharv/career-pages-v2/issues/new?template=bug_report.yml&&title=bug:${encodeURIComponent(
                  company.name
                )}`}
                target="_blank"
                className="flex items-center text-primary hover:underline"
              >
                <Bug className="w-4 h-4 mr-1" />
                Report Issue
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
