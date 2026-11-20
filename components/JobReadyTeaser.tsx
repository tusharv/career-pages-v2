import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/ToolLogo";
import { getTool } from "@/lib/tools";

const points = [
  "Employers open a link to the CV design you chose.",
  "Your fit review, practice plan, and chat stay off that page.",
  "Download a fact-checked PDF when the resume is ready to send.",
];

export function JobReadyTeaser() {
  const tool = getTool("jobready");
  if (!tool) return null;

  return (
    <section className="border-b border-border/60">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid items-center gap-8 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-10">
          <ToolLogo tool={tool} size={56} />
          <div className="min-w-0">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Resumes
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Share a polished resume with employers
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Job Ready compares your experience with one role, then lets you
              publish a fact-checked CV. Send employers the link on{" "}
              <a
                href="https://jobready.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                jobready.tech
              </a>
              .
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1b6b45]"
                    aria-hidden
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto">
            <Button asChild className="h-11 gap-1.5 bg-[#1b6b45] text-white hover:bg-[#165a3a]">
              <a href="https://jobready.tech/" target="_blank" rel="noopener noreferrer">
                Share with employers
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
            <Button asChild variant="outline" className="h-11 gap-1.5">
              <Link href="/tools/jobready">
                See the guide
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
