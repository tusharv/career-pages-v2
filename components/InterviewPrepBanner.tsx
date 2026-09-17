import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

type InterviewPrepBannerProps = {
  context?: "home" | "remote";
};

export function InterviewPrepBanner({
  context = "home",
}: InterviewPrepBannerProps) {
  const isRemote = context === "remote";

  return (
    <section className="border-b border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Mic className="h-3.5 w-3.5" aria-hidden />
              Interview prep
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
              {isRemote
                ? "Heading into a micro1 interview?"
                : "Prepare before you apply"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              {isRemote
                ? "Roles here go through an AI interview with Zara. Read how it works, then take a free practice round."
                : "Remote micro1 roles use an AI interview. Company jobs still run a recruiter and hiring-manager loop. Here is how to prepare for both."}
            </p>
          </div>

          <Button
            asChild
            className="h-11 w-full shrink-0 gap-1.5 bg-[hsl(var(--ring))] px-5 font-semibold text-[hsl(222_58%_10%)] shadow-sm hover:bg-[hsl(var(--ring)/0.9)] hover:text-[hsl(222_58%_10%)] sm:w-auto"
          >
            <Link href="/interview-prep">
              Interview prep
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
