import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolsTeaser() {
  return (
    <section className="border-b border-border/60">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Wrench className="h-3.5 w-3.5" aria-hidden />
              Tools
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
              Find a useful tool for your next step
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Explore practical guides for learning developer skills, building a
              portfolio, and meeting other developers.
            </p>
          </div>

          <Button asChild variant="outline" className="h-11 w-full shrink-0 gap-1.5 sm:w-auto">
            <Link href="/tools">
              See the tools
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
