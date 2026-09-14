import type { Metadata } from "next";
import { metaPresent } from "@/lib/company-meta";
import { getCompanyLogoSrc } from "@/lib/company-logo";
import type { CompanyRow } from "@/lib/types/company";

const DEFAULT_SITE_URL = "https://careerpages.co.in";

export const siteConfig = {
  name: "Career Pages",
  legalName: "careerpages.co.in",
  tagline: "Your shortcut to real career pages.",
  defaultDescription:
    "Browse 490+ tech companies with direct links to careers pages, engineering blogs, funding news, and company context — no more tab-hopping.",
  defaultKeywords: [
    "career pages",
    "tech jobs India",
    "startup careers",
    "engineering blogs",
    "Bengaluru startups",
    "company careers directory",
    "job search",
    "hiring",
  ],
  locale: "en_IN",
  twitterHandle: "@careerpages",
  defaultOgImagePath: "/social.png",
} as const;

/** Production origin; uses NEXT_PUBLIC_SITE_URL when set. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return raw || DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

type OgImageInput =
  | string
  | { url: string; width?: number; height?: number; alt?: string };

function resolveOgImage(
  image: OgImageInput | undefined,
  alt: string
): Array<{ url: string; width?: number; height?: number; alt?: string } | string> {
  const fallback = {
    url: absoluteUrl(siteConfig.defaultOgImagePath),
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} — ${siteConfig.tagline}`,
  };

  if (!image) return [fallback];

  if (typeof image === "string") {
    return [
      {
        url: absoluteUrl(image),
        width: 1200,
        height: 630,
        alt,
      },
    ];
  }

  return [
    {
      url: absoluteUrl(image.url),
      width: image.width ?? 1200,
      height: image.height ?? 630,
      alt: image.alt ?? alt,
    },
  ];
}

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  /** Path starting with `/`, e.g. `/company/acme`. Omit for homepage canonical. */
  path?: string;
  ogImage?: OgImageInput;
  keywords?: string[];
  noIndex?: boolean;
};

/** Shared Metadata builder for public pages (OG, Twitter, canonical, robots). */
export function buildPageMetadata({
  title,
  description,
  path,
  ogImage,
  keywords,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = path ? absoluteUrl(path) : absoluteUrl("/");
  const images = resolveOgImage(ogImage, title);

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.defaultKeywords],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) =>
        typeof img === "string" ? img : img.url
      ),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const homeMetadata: Metadata = buildPageMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.defaultDescription,
  path: "/",
  keywords: [
    ...siteConfig.defaultKeywords,
    "recently funded startups",
    "Ringg AI careers",
    "Bengaluru tech hiring",
  ],
});

export function buildCompanyMetadata(company: CompanyRow): Metadata {
  const meta = company.company_meta;
  const domain = metaPresent(meta?.domain);
  const hq = metaPresent(meta?.hq);
  const funding = metaPresent(meta?.others?.funding);
  const core = metaPresent(meta?.about?.core_products_services);

  const snippet =
    domain ||
    (core
      ? core.length > 120
        ? `${core.slice(0, 117)}…`
        : core
      : null);

  const locationPart = hq ? ` Based in ${hq}.` : "";
  const fundingPart = funding ? ` ${funding}.` : "";

  const description = snippet
    ? `${snippet}.${locationPart}${fundingPart} Careers page, engineering blog, and company profile on ${siteConfig.name}.`
    : `Careers page, engineering blog, and company profile for ${company.name} on ${siteConfig.name}.`;

  const title = `${company.name} — Careers & Company Info`;
  const logoSrc = getCompanyLogoSrc(
    company.careers_url,
    metaPresent(meta?.website)
  );

  const keywords = [
    company.name,
    `${company.name} careers`,
    `${company.name} jobs`,
    domain,
    hq,
    "Bengaluru startups",
    "tech careers India",
  ].filter((k): k is string => Boolean(k && k.trim()));

  return buildPageMetadata({
    title,
    description,
    path: `/company/${company.slug}`,
    ogImage: logoSrc ?? siteConfig.defaultOgImagePath,
    keywords,
  });
}

export function buildRemoteJobsMetadata(): Metadata {
  return buildPageMetadata({
    title: "Remote technical jobs",
    description:
      "Open remote engineering, AI/ML, data, and security roles at micro1 — apply directly with flexible hours and hourly pay.",
    path: "/remote-jobs",
    keywords: [
      "remote jobs",
      "remote engineering jobs",
      "AI ML remote",
      "work from home tech",
      "India remote jobs",
    ],
  });
}

export const adminMetadata: Metadata = buildPageMetadata({
  title: "Admin",
  description: "Career Pages administration.",
  noIndex: true,
});

/** WebSite JSON-LD for the home page. */
export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Organization JSON-LD for company detail pages. */
export function buildCompanyJsonLd(company: CompanyRow) {
  const meta = company.company_meta;
  const website = metaPresent(meta?.website);
  const domain = metaPresent(meta?.domain);
  const hq = metaPresent(meta?.hq);
  const logo = getCompanyLogoSrc(
    company.careers_url,
    website
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: website ?? company.careers_url,
    description: domain ?? undefined,
    logo: logo ?? undefined,
    address: hq
      ? {
          "@type": "PostalAddress",
          addressLocality: hq,
          addressCountry: "IN",
        }
      : undefined,
    sameAs: [company.careers_url, company.blog_url].filter(Boolean),
  };
}
