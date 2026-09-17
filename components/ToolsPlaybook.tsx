import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ToolLogo } from "@/components/ToolLogo";
import { getRelatedTools, type ToolGuide } from "@/lib/tools";

export function ToolsPlaybook({ tool }: { tool: ToolGuide }) {
  const related = getRelatedTools(tool);
  return (
    <div className="container mx-auto max-w-5xl px-4">
      <nav
        aria-label="Guide sections"
        className="flex flex-wrap gap-x-6 gap-y-3 border-b border-border py-6 text-sm"
      >
        {[
          ["features", "Features"],
          ["uses", "How it can help"],
          ["try", "Try this"],
          ["tips", "Tips"],
          ["resources", "Resources"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {label}
          </a>
        ))}
      </nav>
      <section
        id="features"
        className="scroll-mt-24 border-b border-border py-12 md:py-16"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {tool.kind === "event" ? "Ways to take part" : "Useful features"}
        </h2>
        <dl className="mt-8 grid gap-8 md:grid-cols-3">
          {tool.features.map((item) => (
            <div key={item.title}>
              <dt className="font-semibold">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section
        id="uses"
        className="scroll-mt-24 border-b border-border py-12 md:py-16"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          How it can help while you job hunt
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {tool.uses.map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="try"
        className="scroll-mt-24 border-b border-border py-12 md:py-16"
      >
        <div className="rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {tool.activity}
          </h2>
          <ol className="mt-8 space-y-7">
            {tool.playbook.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section
        id="tips"
        className="scroll-mt-24 border-b border-border py-12 md:py-16"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Tips and things to know
        </h2>
        <div className="mt-8 space-y-7">
          {tool.tips.map((item) => (
            <div key={item.title} className="max-w-prose">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="resources"
        className="scroll-mt-24 border-b border-border py-12 md:py-16"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Before you get started
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          {tool.cost}
        </p>
        <h3 className="mt-8 font-semibold">Official resources</h3>
        <ul className="mt-4 space-y-3">
          {tool.resources.map((resource) => (
            <li key={resource.url}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {resource.title}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="py-12 md:py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          You might also find useful
        </h2>
        <p className="mt-3 text-muted-foreground">
          Explore these if they fit what you want to do next.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/tools/${item.slug}`}
              className="rounded-xl border border-border p-5 transition-colors hover:bg-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="flex items-center gap-3 font-semibold">
                <ToolLogo tool={item} size={28} />
                {item.name}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.tagline}
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/tools"
          className="mt-8 inline-flex items-center gap-2 rounded-sm text-sm font-medium underline underline-offset-4"
        >
          Browse all tools
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
