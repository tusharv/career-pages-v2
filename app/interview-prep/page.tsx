import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ExternalLink,
  Globe2,
  Home,
  Mic,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterviewPlaybook } from "@/components/InterviewPlaybook";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import {
  MICRO1_AI_INTERVIEW_GUIDE_URL,
  MICRO1_INTERVIEW_PREP_URL,
} from "@/lib/interview-prep";
import {
  buildInterviewPrepBreadcrumbJsonLd,
  buildInterviewPrepJsonLd,
  buildInterviewPrepMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildInterviewPrepMetadata();

const AI_QUESTION_TYPES = [
  {
    title: "Open-ended technical questions",
    body: "Tied to the role you picked. Expect to explain trade-offs, not recite definitions.",
  },
  {
    title: "Scenario questions",
    body: "How you think, debug, and communicate when the problem is messy.",
  },
  {
    title: "Coding challenge",
    body: "For technical roles. Talk through your approach while you write.",
  },
  {
    title: "Human data exercise",
    body: "For annotator roles. Follow instructions closely and stay consistent.",
  },
] as const;

export default function InterviewPrepPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <JsonLd data={buildInterviewPrepJsonLd()} />
      <JsonLd data={buildInterviewPrepBreadcrumbJsonLd()} />

      <Header />

      <main className="flex-grow">
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
                href="/remote-jobs"
                className="inline-flex items-center gap-1.5 rounded-md outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Globe2 className="h-3.5 w-3.5" aria-hidden />
                Remote jobs
              </Link>
              <span aria-hidden className="text-white/35">
                /
              </span>
              <span className="text-white">Interview prep</span>
            </nav>

            <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
              <div className="max-w-xl text-left">
                <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
                  Interview prep for remote roles and company jobs.
                </h1>
                <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                  micro1 uses an AI interviewer. Company roles still run a
                  classic loop. Work the round in three parts.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary" className="gap-1.5">
                    <Link
                      href={MICRO1_INTERVIEW_PREP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Practice interview
                      <ExternalLink
                        className="h-3.5 w-3.5 opacity-80"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                  >
                    <Link
                      href={MICRO1_AI_INTERVIEW_GUIDE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      AI interview guide
                      <ExternalLink
                        className="ml-1.5 h-3.5 w-3.5 opacity-80"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                </div>
              </div>

              <aside className="hidden lg:block">
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-md">
                  <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/60">
                    The loop
                  </p>
                  <p className="mt-4 text-2xl font-bold tracking-tight text-white">
                    Before, during, and after the round.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Get ready, show up well, then close the loop. Works for
                    micro1 and company interviews.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60">
          <div className="container mx-auto grid gap-8 px-4 py-12 md:py-16 lg:grid-cols-2">
            <article className="rounded-2xl border border-border/80 border-l-[3px] border-l-[hsl(var(--ring))] bg-card p-6 shadow-sm md:p-8">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mic className="h-4 w-4" aria-hidden />
                Remote jobs at micro1
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                You talk with Zara, on your schedule.
              </h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                Every candidate completes an on-demand AI interview. It is
                conversational, scored against micro1 certification criteria,
                and available anytime.
              </p>
              <Button asChild variant="outline" className="mt-6 gap-1.5">
                <Link href="/remote-jobs">
                  Browse remote jobs
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </article>

            <article className="rounded-2xl border border-border/80 bg-muted/20 p-6 md:p-8">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Briefcase className="h-4 w-4" aria-hidden />
                Company jobs
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                You still interview with people.
              </h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                Roles on company career pages usually start with a recruiter
                screen, then a technical round, then a loop. Use this index to
                reach the hiring site and the engineering blog first.
              </p>
              <Button asChild variant="outline" className="mt-6 gap-1.5">
                <Link href="/">
                  Browse companies
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </article>
          </div>
        </section>

        <section className="border-b border-border/60 bg-card/40">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How the micro1 AI interview works
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              The interview is designed to test real-world skill in a structured
              format. You get a result as soon as you finish.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {AI_QUESTION_TYPES.map((item) => (
                <div key={item.title} className="max-w-prose">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              If you meet the bar, you are certified. If you do not, you can
              request feedback. Full walkthrough:{" "}
              <Link
                href={MICRO1_AI_INTERVIEW_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                micro1 AI interview guide
              </Link>.
            </p>
          </div>
        </section>

        <InterviewPlaybook />

        <section>
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to apply?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Jump back to the company directory or the live remote board.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="gap-1.5">
                <Link href="/">
                  <Home className="h-4 w-4" aria-hidden />
                  Companies
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-1.5">
                <Link href="/remote-jobs">
                  <Globe2 className="h-4 w-4" aria-hidden />
                  Remote jobs
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
