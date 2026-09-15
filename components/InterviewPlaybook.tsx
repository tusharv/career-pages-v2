import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Ban,
  BookOpen,
  Building2,
  CalendarCheck,
  Check,
  ClipboardList,
  Clock,
  Compass,
  CornerDownRight,
  Cpu,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Globe,
  Handshake,
  HelpCircle,
  Linkedin,
  Mail,
  MessageCircleOff,
  MessageSquareText,
  PauseCircle,
  Quote,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Timer,
  UserRoundX,
  Users,
  Video,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MICRO1_INTERVIEW_PREP_URL } from "@/lib/interview-prep";
import { cn } from "@/lib/utils";

type PlaybookItem = {
  title: string;
  body: string;
  icon: LucideIcon;
  avoid?: readonly string[];
  reframe?: string;
};

type ClusterItem = {
  title: string;
  body: string;
  icon: LucideIcon;
};

const PHASES = [
  { href: "#before-the-call", label: "Before" },
  { href: "#during-the-call", label: "During" },
  { href: "#after-the-call", label: "After" },
] as const;

const MATERIALS: ClusterItem[] = [
  {
    title: "Make the public record match the CV",
    body: "GitHub, LinkedIn, and a personal site should tell the same story as the resume. Pin two or three projects you can actually walk through.",
    icon: Github,
  },
  {
    title: "Know every line you submitted",
    body: "Read the CV until each bullet has a story, a metric, and a boundary. If you cannot explain it, cut it before someone else asks.",
    icon: FileText,
  },
  {
    title: "Get a hard review from a peer",
    body: "Ask someone who will be honest, not kind, to mark weak claims, missing impact, and anything that sounds inflated.",
    icon: Users,
  },
  {
    title: "Keep LinkedIn current",
    body: "Headline, about, and featured work should match the role you want, not the last title you held out of habit.",
    icon: Linkedin,
  },
];

const REHEARSAL: ClusterItem[] = [
  {
    title: "Use AI to find the gaps, not to sit the round",
    body: "Share the job description and your CV with an AI tool. Ask for missing skills, a short study plan, and which stories map to which requirements.",
    icon: Sparkles,
  },
  {
    title: "Get quizzed off your own resume",
    body: "Have the same tool interview you from the CV. Answer out loud. Note where you stall and rewrite those stories.",
    icon: MessageSquareText,
  },
  {
    title: "Build four or five proof points",
    body: "For each JD requirement, keep one example with a number: what changed in speed, cost, quality, or users.",
    icon: ClipboardList,
  },
  {
    title: "Rehearse in the real setting",
    body: "Do a timed coding or design drill with the camera on. For micro1, take the free practice interview before the scored one.",
    icon: Video,
  },
];

const COMPANY: ClusterItem[] = [
  {
    title: "Learn the product and the culture",
    body: "Read the careers page, engineering blog, and a recent note about the company. You want specifics, not a generic compliment.",
    icon: Building2,
  },
  {
    title: "Write questions for the panel",
    body: "Prepare three questions you cannot google in thirty seconds: how the team ships, what failed last quarter, what this role owns in the first six months.",
    icon: HelpCircle,
  },
  {
    title: "Ask for an intro if you have one",
    body: "A referral from someone inside the company is worth more before you apply than after you have already stalled in the process.",
    icon: Handshake,
  },
  {
    title: "Open the real hiring site",
    body: "Use this directory to reach the careers URL and blog, then apply there. Do not rely on a third-party listing as the source of truth.",
    icon: Search,
  },
];

const LOGISTICS: ClusterItem[] = [
  {
    title: "Confirm the boring details",
    body: "Timezone, meeting link, ID, and the coding environment. Put a backup hotspot and a charger within reach.",
    icon: CalendarCheck,
  },
  {
    title: "Clear the room around you",
    body: "Mute notifications, close extra tabs, and keep water nearby. The setup should disappear so the conversation can start on time.",
    icon: Wifi,
  },
];

const DOS: PlaybookItem[] = [
  {
    title: "Arrive a few minutes early",
    body: "Log in 5 to 10 minutes before the start so you can confirm audio, video, and the meeting link. Walking in late is noticed, and many hiring teams only open a handful of times.",
    icon: Clock,
  },
  {
    title: "Protect the booking",
    body: "Interview windows are scarce. Move other commitments, treat the round as your only chance that day, and give it full focus.",
    icon: CalendarCheck,
  },
  {
    title: "Lock in a reliable setup",
    body: "Sit somewhere quiet, with steady internet and a well-lit face. Run a mic and camera check before the interviewer joins.",
    icon: Wifi,
  },
  {
    title: "Be fluent in your own resume",
    body: "You should be able to talk through each project, number, and claim without hesitation.",
    icon: FileText,
    avoid: ["I can't recall that work.", "That piece wasn't really mine."],
    reframe:
      "If you built it with others, name your slice clearly: “We shipped this as a team. I owned X and Y.”",
  },
  {
    title: "Answer with a calm structure",
    body: "A short pause before you speak is fine. Walk through what you did, why you chose it, how you built it, and what changed as a result. In coding and design, your reasoning counts more than flawless syntax.",
    icon: MessageSquareText,
  },
];

const DONTS: PlaybookItem[] = [
  {
    title: "Keep AI tools off the call",
    body: "Prep with them. Do not open ChatGPT, Copilot, or similar helpers while you are being interviewed. Sessions are often watched, and using those tools can end the process.",
    icon: Cpu,
  },
  {
    title: "Do not step away from your CV",
    body: "Stand behind the work you listed. If a project was shared, say exactly what you owned instead of shrinking from it.",
    icon: UserRoundX,
    avoid: ["That was someone else's work.", "I wasn't really involved."],
  },
  {
    title: "Do not speed through a stall",
    body: "When you hit a blank, talk through the problem out loud. Interviewers are listening for how you think, not whether you memorized an answer.",
    icon: PauseCircle,
  },
  {
    title: "Do not ramble off-topic",
    body: "Keep each answer tight. Extra context is useful only when the interviewer asks for it.",
    icon: MessageCircleOff,
  },
];

const IN_THE_ROOM: (ClusterItem & { tone: IconTone })[] = [
  {
    title: "Catch the question",
    body: "Repeat it back or jot it down. A ten-second pause to frame the answer beats a fast, messy start.",
    icon: ClipboardList,
    tone: "gold",
  },
  {
    title: "Clarify before you build",
    body: "Ask who the user is, what success looks like, and which constraints are real. Then name your approach out loud.",
    icon: HelpCircle,
    tone: "navy",
  },
  {
    title: "Watch the clock",
    body: "Leave a few minutes at the end for their questions. A strong close matters as much as the first coding pass.",
    icon: Timer,
    tone: "muted",
  },
  {
    title: "Talk to the camera",
    body: "Look at the lens when you make a point, use people's names, and keep your notes off-screen unless they asked you to share.",
    icon: Eye,
    tone: "gold",
  },
];

const AFTER: (ClusterItem & { tone: IconTone })[] = [
  {
    title: "Write the round down while it is fresh",
    body: "Capture the questions, where you stalled, and what you would do next time. Do this the same day, before the details fade.",
    icon: ClipboardList,
    tone: "gold",
  },
  {
    title: "Turn the notes into practice",
    body: "Pick one weak spot and start on it that week: a system-design drill, a CV rewrite, or a gap from the JD. Waiting for a yes is not a study plan.",
    icon: BookOpen,
    tone: "navy",
  },
  {
    title: "Send a short thank-you if you can",
    body: "If you have a name and an email, one note that cites a specific part of the conversation is enough. Do not recap your entire resume.",
    icon: Mail,
    tone: "muted",
  },
  {
    title: "Wait the window they named",
    body: "If they said Friday, give them Friday. Checking every hour does not move the decision.",
    icon: Clock,
    tone: "gold",
  },
  {
    title: "Follow up once, then keep going",
    body: "If that date has passed, send one polite check-in. After that, assume they moved on. Silence is often the answer, even when it stings.",
    icon: Send,
    tone: "navy",
  },
  {
    title: "Do not freeze the rest of the search",
    body: "Stay positive by staying in motion. Apply, practice, and talk to the next company. One round is data, not a verdict on you.",
    icon: RefreshCw,
    tone: "muted",
  },
];

type IconTone = "gold" | "danger" | "navy" | "muted";

function IconMark({
  icon: Icon,
  tone,
  size = "md",
}: {
  icon: LucideIcon;
  tone: IconTone;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-12 w-12",
        tone === "gold" &&
          "bg-[hsl(var(--ring)/0.18)] text-[hsl(var(--chart-5))]",
        tone === "danger" && "bg-destructive/10 text-destructive",
        tone === "navy" && "bg-primary text-primary-foreground",
        tone === "muted" && "bg-muted text-foreground"
      )}
    >
      <Icon
        className={cn(size === "lg" ? "h-6 w-6" : "h-5 w-5")}
        aria-hidden
      />
    </span>
  );
}

function AvoidLines({ lines }: { lines: readonly string[] }) {
  return (
    <div className="mt-3 rounded-lg border border-border/70 bg-background/80 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Quote className="h-3.5 w-3.5" aria-hidden />
        Skip lines like
      </p>
      <ul className="mt-2 space-y-1.5">
        {lines.map((line) => (
          <li
            key={line}
            className="text-sm italic leading-relaxed text-muted-foreground"
          >
            “{line}”
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlaybookList({
  items,
  tone,
}: {
  items: PlaybookItem[];
  tone: "gold" | "danger";
}) {
  return (
    <ul className="mt-6 space-y-6">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <IconMark icon={item.icon} tone={tone} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold tracking-tight">{item.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
            {item.avoid ? <AvoidLines lines={item.avoid} /> : null}
            {item.reframe ? (
              <p className="mt-3 flex gap-2 rounded-lg bg-[hsl(var(--ring)/0.12)] px-3 py-2.5 text-sm leading-relaxed text-foreground">
                <CornerDownRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--chart-5))]"
                  aria-hidden
                />
                {item.reframe}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Cluster({
  title,
  icon,
  tone,
  items,
  accent,
  children,
}: {
  title: string;
  icon: LucideIcon;
  tone: IconTone;
  items: ClusterItem[];
  accent?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 md:p-7",
        accent
          ? "border-border/80 border-l-[3px] border-l-[hsl(var(--ring))] shadow-sm"
          : "border-border/70"
      )}
    >
      <h3 className="flex items-center gap-3 text-lg font-bold tracking-tight">
        <IconMark icon={icon} tone={tone} />
        {title}
      </h3>
      <ul className="mt-5 space-y-5">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3">
            <item.icon
              className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--chart-5))]"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="font-semibold tracking-tight">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

export function InterviewPlaybook() {
  return (
    <section className="border-b border-border/60 bg-[hsl(var(--ring)/0.04)]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <nav
          aria-label="Interview stages"
          className="mb-8 flex gap-1 overflow-x-auto"
        >
          {PHASES.map((phase) => (
            <a
              key={phase.href}
              href={phase.href}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground outline-none ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {phase.label}
            </a>
          ))}
        </nav>

        <div id="before-the-call" className="scroll-mt-24">
          <div className="flex items-start gap-4">
            <IconMark icon={BookOpen} tone="gold" size="lg" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Before the call
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Get the materials honest, the stories sharp, and the logistics
                boring. AI is useful here. It is not useful once the interviewer
                is on the line.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Cluster
              title="Your public surface"
              icon={Globe}
              tone="gold"
              items={MATERIALS}
              accent
            />
            <Cluster
              title="Rehearse with a tool, then close it"
              icon={Sparkles}
              tone="navy"
              items={REHEARSAL}
            >
              <Button asChild className="mt-6 gap-1.5">
                <Link
                  href={MICRO1_INTERVIEW_PREP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Practice on micro1
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                </Link>
              </Button>
            </Cluster>
            <Cluster
              title="The company you are walking into"
              icon={Building2}
              tone="muted"
              items={COMPANY}
            />
            <Cluster
              title="The last-mile setup"
              icon={Wifi}
              tone="gold"
              items={LOGISTICS}
              accent
            />
          </div>
        </div>

        <div id="during-the-call" className="mt-16 scroll-mt-24 md:mt-20">
          <div className="flex items-start gap-4">
            <IconMark icon={Video} tone="gold" size="lg" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                During the live round
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                This is the part they remember: how you enter, how you think,
                and whether you own the work on the page in front of them.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/80 border-l-[3px] border-l-[hsl(var(--ring))] bg-card p-6 shadow-sm md:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--ring)/0.2)] text-[hsl(var(--chart-5))]">
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </span>
                Do
              </h3>
              <PlaybookList items={DOS} tone="gold" />
            </div>

            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6 md:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <Ban className="h-4 w-4" aria-hidden />
                </span>
                Don&apos;t
              </h3>
              <PlaybookList items={DONTS} tone="danger" />
            </div>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {IN_THE_ROOM.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-xl border border-border/70 bg-card p-5"
              >
                <IconMark icon={item.icon} tone={item.tone} />
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div id="after-the-call" className="mt-16 scroll-mt-24 md:mt-20">
          <div className="flex items-start gap-4">
            <IconMark icon={RefreshCw} tone="gold" size="lg" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                After you hang up
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                The round is useful even when the answer is no. Capture it,
                improve one thing, then keep the search moving.
              </p>
            </div>
          </div>

          <ol className="relative mt-8 ml-5 border-l border-border/80">
            {AFTER.map((item) => (
              <li key={item.title} className="relative pb-8 pl-10 last:pb-0">
                <span className="absolute -left-5 top-0 bg-[hsl(var(--ring)/0.04)]">
                  <IconMark icon={item.icon} tone={item.tone} />
                </span>
                <p className="pt-1.5 font-semibold tracking-tight">{item.title}</p>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex gap-4 rounded-2xl border border-[hsl(var(--ring)/0.35)] bg-card p-6 shadow-sm md:gap-5 md:p-8">
          <IconMark icon={Compass} tone="gold" size="lg" />
          <blockquote className="min-w-0">
            <p className="text-lg font-semibold tracking-tight md:text-xl">
              One round is practice with an audience. The next one is the point.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              If you do not know an answer, describe the steps you would take to
              find one. Hiring teams weigh how you communicate, take ownership,
              and stay composed alongside the technical bar.
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
