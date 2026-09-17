import Link from "next/link";
import { RandomPracticePicker } from "@/components/RandomPracticePicker";
import { TOOL_EXAMPLES } from "@/lib/tool-examples";
import { ArrowRight, ExternalLink, PencilLine } from "lucide-react";
import { ToolLogo } from "@/components/ToolLogo";
import { getRelatedTools, type ToolGuide } from "@/lib/tools";

export function ToolsPlaybook({ tool }: { tool: ToolGuide }) {
  const related = getRelatedTools(tool);

  return (
    <div className="container mx-auto px-4">
      <nav
        aria-label="Guide sections"
        className="-mx-4 flex gap-x-6 gap-y-3 overflow-x-auto border-b border-border px-4 py-6 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
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
            className="shrink-0 whitespace-nowrap rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
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
          {tool.kind === "event"
            ? "Find your way in"
            : "What’s in the toolbox?"}
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
          Where it fits into your job search
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
        <div className="rounded-2xl border border-border bg-muted/20 p-6 md:p-10">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PencilLine className="h-4 w-4" aria-hidden /> A little room to
            experiment
          </p>
          <RandomPracticePicker
            items={TOOL_EXAMPLES[tool.slug]}
            label={
              tool.slug === "scrimba"
                ? `${TOOL_EXAMPLES[tool.slug].length} courses and paths to explore`
                : `${TOOL_EXAMPLES[tool.slug].length} portfolio ideas to explore`
            }
            buttonLabel={
              tool.slug === "v0"
                ? "Try another prompt"
                : tool.slug === "shadcn"
                  ? "Try another challenge"
                  : tool.slug === "scrimba"
                    ? "Explore another course"
                    : "Try another example"
            }
            cardLabel={
              tool.slug === "v0"
                ? "A prompt to play with"
                : tool.slug === "shadcn"
                  ? "A tiny design challenge"
                  : tool.slug === "scrimba"
                    ? "A course to learn from"
                    : "Something worth building"
            }
          />
        </div>
      </section>
      <section
        id="tips"
        className="scroll-mt-24 border-b border-border py-12 md:py-16"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          A few things worth trying
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {tool.tips.map((item) => (
            <div
              key={item.title}
              className="max-w-prose border-t-2 border-[hsl(var(--ring))] pt-5"
            >
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
          Follow your curiosity
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
