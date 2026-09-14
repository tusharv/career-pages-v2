import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import { JsonLd } from "@/components/JsonLd";
import { buildWebSiteJsonLd, homeMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  ...homeMetadata,
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <HomePageClient />
    </>
  );
}
