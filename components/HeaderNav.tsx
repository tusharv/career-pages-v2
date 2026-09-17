"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Globe2, Wrench, Menu, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/",
    label: "Companies",
    icon: Building2,
    isActive: (path: string) => path === "/",
  },
  {
    href: "/remote-jobs",
    label: "Remote jobs",
    icon: Globe2,
    isActive: (path: string) => path.startsWith("/remote-jobs"),
  },
  {
    href: "/tools",
    label: "Tools",
    icon: Wrench,
    isActive: (path: string) => path.startsWith("/tools"),
  },
  {
    href: "/interview-prep",
    label: "Interview prep",
    icon: Mic,
    isActive: (path: string) => path.startsWith("/interview-prep"),
  },
] as const;

function navLinkClass(active: boolean, featured: boolean, mobile: boolean) {
  if (featured) {
    return cn(
      "inline-flex items-center justify-center gap-1.5 font-semibold text-[hsl(222_58%_10%)] shadow-sm",
      "bg-[hsl(var(--ring))] hover:bg-[hsl(var(--ring)/0.9)] hover:text-[hsl(222_58%_10%)]",
      mobile ? "w-full rounded-xl px-4 py-3 text-base" : "rounded-lg px-3.5 py-2 text-sm",
      active && "ring-2 ring-foreground/20 ring-offset-2 ring-offset-background"
    );
  }

  return cn(
    "inline-flex items-center gap-1.5 rounded-lg font-medium outline-none ring-offset-background transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    mobile ? "px-3 py-3 text-base" : "px-3 py-2 text-sm",
    active
      ? "bg-muted/80 text-foreground"
      : "text-muted-foreground hover:text-foreground"
  );
}

export function HeaderNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overlayTop, setOverlayTop] = useState(64);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;

    const header = toggleRef.current?.closest("header");
    setOverlayTop(header?.getBoundingClientRect().bottom ?? 64);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const renderLinks = (mobile: boolean) =>
    links.map((link) => {
      const active = link.isActive(pathname);
      const Icon = link.icon;
      const featured = link.href === "/interview-prep";

      return (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active ? "page" : undefined}
          className={navLinkClass(active, featured, mobile)}
          onClick={() => {
            if (active) setOpen(false);
          }}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          {link.label}
        </Link>
      );
    });

  return (
    <div className="flex shrink-0 items-center">
      <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
        {renderLinks(false)}
      </nav>

      <Button
        ref={toggleRef}
        type="button"
        variant="outline"
        size="icon"
        className="lg:hidden"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </Button>

      {open
        ? createPortal(
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="fixed inset-x-0 bottom-0 z-30 bg-foreground/40 lg:hidden"
              style={{ top: overlayTop }}
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
            />,
            document.body
          )
        : null}

      {open ? (
        <nav
          ref={panelRef}
          id={menuId}
          aria-label="Main"
          className="absolute inset-x-0 top-full z-50 border-b border-border bg-background p-4 shadow-lg lg:hidden"
        >
          <div className="flex flex-col gap-1">{renderLinks(true)}</div>
        </nav>
      ) : null}
    </div>
  );
}
