import type { Metadata } from "next";
import { metaPresent } from "@/lib/company-meta";
import { getCompanyLogoSrc } from "@/lib/company-logo";
import type { CompanyRow } from "@/lib/types/company";
import { TOOLS, type ToolGuide } from "@/lib/tools";

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

/** Declared on every public page so tab / home-screen icons never drop out of nested metadata. */
export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/logo.svg", type: "image/svg+xml" },
    { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  shortcut: "/favicon.ico",
};

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
    icons: siteIcons,
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

export function buildInterviewPrepMetadata(): Metadata {
  return buildPageMetadata({
    title: "Interview prep for remote and company jobs",
    description:
      "Prepare for micro1 AI interviews and traditional company screens. Practice with Zara, then apply through career pages in this directory.",
    path: "/interview-prep",
    keywords: [
      "interview prep",
      "AI interview",
      "micro1 interview",
      "remote job interview",
      "tech interview guide",
      "practice interview",
    ],
  });
}

/** HowTo JSON-LD for the interview prep guide. */
export function buildInterviewPrepJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Interview prep for remote and company jobs",
    description:
      "How to prepare for micro1 AI interviews and traditional company hiring loops.",
    url: `${siteUrl}/interview-prep`,
    step: [
      {
        "@type": "HowToStep",
        name: "Pick the interview type",
        text: "Remote micro1 roles use an on-demand AI interview. Company jobs listed on Career Pages follow a recruiter and hiring-manager loop.",
      },
      {
        "@type": "HowToStep",
        name: "Get ready before the call",
        text: "Polish GitHub, LinkedIn, and your CV. Use AI tools only in prep to find skill gaps and drill resume questions. Research the company, seek a referral, and confirm logistics.",
      },
      {
        "@type": "HowToStep",
        name: "Handle the live round well",
        text: "Arrive a few minutes early, confirm your setup, walk through your resume, keep AI tools closed, and talk through your reasoning.",
      },
      {
        "@type": "HowToStep",
        name: "Close the loop after you hang up",
        text: "Write down what happened, start one improvement, wait for the stated timeline, follow up once if silent, and keep applying.",
      },
    ],
  };
}

export function buildToolsMetadata(): Metadata {
  return buildPageMetadata({
    title: "Tools and resources for your developer job search",
    description:
      "Find tools for learning developer skills, building and sharing portfolio projects, and meeting other developers. Practical guides, tips, and small activities.",
    path: "/tools",
    keywords: [
      "job search tools",
      "Cursor portfolio",
      "v0.dev",
      "shadcn/ui",
      "Supabase",
      "Vercel deploy",
      "Hacktoberfest",
      "Scrimba",
      "tech job hunt",
    ],
  });
}

export function buildToolMetadata(tool: ToolGuide): Metadata {
  return buildPageMetadata({
    title: tool.metaTitle,
    description: tool.metaDescription,
    path: `/tools/${tool.slug}`,
    keywords: [...tool.keywords],
  });
}

/** ItemList JSON-LD for the tools hub. */
export function buildToolsJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tools and resources for your developer job search",
    description:
      "Guides for using v0, shadcn/ui, Cursor, Supabase, Vercel, Scrimba, Meetup, Luma, and Hacktoberfest while job hunting.",
    url: `${siteUrl}/tools`,
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteUrl}/tools/${tool.slug}`,
      description: tool.tagline,
    })),
  };
}

export function buildToolsBreadcrumbJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Companies",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${siteUrl}/tools`,
      },
    ],
  };
}

/** WebPage JSON-LD for a guide with multiple selectable exercises. */
export function buildToolJsonLd(tool: ToolGuide) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tool.metaTitle,
    description: tool.metaDescription,
    url: `${getSiteUrl()}/tools/${tool.slug}`,
  };
}

export function buildToolBreadcrumbJsonLd(tool: ToolGuide) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Companies",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${siteUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `${siteUrl}/tools/${tool.slug}`,
      },
    ],
  };
}

/** Breadcrumb JSON-LD for the interview prep guide. */
export function buildInterviewPrepBreadcrumbJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Companies",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Remote jobs",
        item: `${siteUrl}/remote-jobs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interview prep",
        item: `${siteUrl}/interview-prep`,
      },
    ],
  };
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
