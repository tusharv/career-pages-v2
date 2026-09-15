"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/",
    label: "Companies",
    isActive: (path: string) => path === "/",
  },
  {
    href: "/remote-jobs",
    label: "Remote jobs",
    shortLabel: "Remote",
    isActive: (path: string) => path.startsWith("/remote-jobs"),
  },
  {
    href: "/interview-prep",
    label: "Interview prep",
    shortLabel: "Prep",
    isActive: (path: string) => path.startsWith("/interview-prep"),
  },
] as const;

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
      {links.map((link) => {
        const active = link.isActive(pathname);
        const isInterviewPrep = link.href === "/interview-prep";
        const label = "shortLabel" in link ? (
          <>
            <span className="sm:hidden">{link.shortLabel}</span>
            <span className="hidden sm:inline">{link.label}</span>
          </>
        ) : (
          link.label
        );

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-2 py-2 text-sm font-medium outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3",
              isInterviewPrep
                ? cn(
                    "inline-flex items-center gap-1.5 bg-[hsl(var(--ring))] px-2.5 font-semibold text-[hsl(222_58%_10%)] shadow-sm hover:bg-[hsl(var(--ring)/0.9)] hover:text-[hsl(222_58%_10%)] sm:px-3.5",
                    active && "ring-2 ring-foreground/20 ring-offset-2 ring-offset-background"
                  )
                : active
                  ? "bg-muted/80 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isInterviewPrep ? (
              <Mic className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : null}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
