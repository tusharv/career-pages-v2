import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ToolLogo } from "@/components/ToolLogo";
import { TOOLS, type ToolSlug } from "@/lib/tools";
import {
  buildToolsBreadcrumbJsonLd,
  buildToolsJsonLd,
  buildToolsMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildToolsMetadata();

const groups: {
  id: string;
  title: string;
  description: string;
  slugs: ToolSlug[];
}[] = [
  {
    id: "learn",
    title: "Learn and practise",
    description: "Work on a skill you want to feel more confident using.",
    slugs: ["scrimba"],
  },
  {
    id: "build",
    title: "Build a portfolio project",
    description:
      "Explore an idea, improve an interface, or practise working with code and data. Choose the pieces your project needs.",
    slugs: ["v0", "shadcn", "cursor", "supabase"],
  },
  {
    id: "share",
    title: "Share your work",
    description:
      "Make a web project easy for someone else to open and explore.",
    slugs: ["vercel"],
  },
  {
    id: "community",
    title: "Meet and learn with like-minded people",
    description:
      "Find events near your city, learn with others, and build connections through shared interests.",
    slugs: ["meetup", "luma", "hacktoberfest"],
  },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={buildToolsJsonLd()} />
      <JsonLd data={buildToolsBreadcrumbJsonLd()} />
      <section className="bg-hero-energy relative overflow-hidden py-14 md:py-20">
        <div
          className="hero-field-lines pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="container relative z-[1] mx-auto px-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-white/70"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-sm hover:text-white"
            >
              <Home className="h-3.5 w-3.5" aria-hidden />
              Companies
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">Tools</span>
          </nav>
          <div className="mt-8 max-w-3xl">
            <h1 className="text-pretty text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
              Find a useful tool for your next step.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              Guides for learning skills, building a portfolio, and connecting
              with other developers while you look for work.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
              This collection focuses on developer roles. Start with what you
              need help with; you can use any of these on its own.
            </p>
          </div>
          <nav
            aria-label="Browse tools by purpose"
            className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
          >
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="shrink-0 rounded-full border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                {group.title}
              </a>
            ))}
          </nav>
        </div>
      </section>
      <div className="container mx-auto px-4">
        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="scroll-mt-24 border-b border-border/60 py-12 md:py-16"
          >
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {group.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {group.description}
            </p>
            <div
              className={
                group.slugs.length > 1
                  ? "mt-8 grid gap-5 md:grid-cols-2"
                  : "mt-8 grid max-w-2xl gap-5"
              }
            >
              {group.slugs
                .map((slug) => TOOLS.find((tool) => tool.slug === slug)!)
                .map((tool) => (
                  <article
                    key={tool.slug}
                    className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <ToolLogo tool={tool} size={44} framed />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {tool.kind === "event"
                            ? "Community event"
                            : tool.purpose}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      {tool.tagline}
                    </p>
                    <p className="mt-4 flex-grow text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Best for:{" "}
                      </span>
                      {tool.bestFor}
                    </p>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      Read the {tool.name} guide
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </article>
                ))}
            </div>
          </section>
        ))}
        <p className="max-w-2xl py-10 text-sm leading-relaxed text-muted-foreground">
          Already have tools that work for you? There is no need to switch.
          These guides are here to help you choose when you need something new.
        </p>
      </div>
    </>
  );
}
