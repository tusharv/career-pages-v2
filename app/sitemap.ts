import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { getSitemapCompanies } from "@/lib/data/sitemap-companies";
import { TOOLS } from "@/lib/tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const companies = await getSitemapCompanies();
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/remote-jobs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${base}/interview-prep`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...TOOLS.map((tool) => ({
      url: `${base}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...companies.map((company) => ({
      url: `${base}/company/${company.slug}`,
      lastModified: company.updated_at
        ? new Date(company.updated_at)
        : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
