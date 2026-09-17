import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Home, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { ToolLogo } from "@/components/ToolLogo";
import { ToolsPlaybook } from "@/components/ToolsPlaybook";
import { getTool, TOOL_SLUGS } from "@/lib/tools";
import { getToolReferralUrl, hasToolReferral } from "@/lib/tool-referrals";
import {
  buildToolBreadcrumbJsonLd,
  buildToolJsonLd,
  buildToolMetadata,
} from "@/lib/seo";

export const dynamicParams = false;

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return TOOL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getTool(params.slug);
  if (!tool) {
    return {
      title: "Tool not found",
      robots: { index: false, follow: false },
    };
  }
  return buildToolMetadata(tool);
}

export default function ToolGuidePage({ params }: PageProps) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const referralUrl = getToolReferralUrl(tool.slug);
  const hasReferral = hasToolReferral(tool.slug);

  return (
    <>
      <JsonLd data={buildToolJsonLd(tool)} />
      <JsonLd data={buildToolBreadcrumbJsonLd(tool)} />

      <section className="bg-hero-energy relative overflow-hidden py-14 md:py-20">
        <div
          className="hero-field-lines pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="container relative z-[1] mx-auto px-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/70"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Home className="h-3.5 w-3.5" aria-hidden />
              Companies
            </Link>
            <span aria-hidden className="text-white/35">
              /
            </span>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 rounded-md outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Wrench className="h-3.5 w-3.5" aria-hidden />
              Tools
            </Link>
            <span aria-hidden className="text-white/35">
              /
            </span>
            <span className="text-white">{tool.name}</span>
          </nav>

          <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div className="max-w-xl text-left">
              <ToolLogo tool={tool} size={56} framed />
              <p className="mt-5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                {tool.purpose}
              </p>
              <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
                {tool.name}
              </h1>
              <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                {tool.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary" className="gap-1.5">
                  <Link
                    href={referralUrl}
                    target="_blank"
                    rel={
                      hasReferral
                        ? "sponsored noopener noreferrer"
                        : "noopener noreferrer"
                    }
                  >
                    Visit {tool.name}
                    <ExternalLink
                      className="h-3.5 w-3.5 opacity-80"
                      aria-hidden
                    />
                  </Link>
                </Button>
              </div>
              {hasReferral ? (
                <p className="mt-4 max-w-lg text-xs leading-relaxed text-white/70">
                  This is a referral link. Career Pages may receive a benefit if
                  you sign up through it. Direct official links are also listed
                  below.
                </p>
              ) : null}
            </div>

            <aside>
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-md">
                <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/60">
                  Is it a fit for you?
                </p>
                <p className="mt-4 text-2xl font-bold tracking-tight text-white">
                  Best for
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {tool.bestFor}
                </p>
                <p className="mt-6 font-semibold text-white">
                  You may not need it if…
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {tool.skipIf}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ToolsPlaybook tool={tool} />
    </>
  );
}
