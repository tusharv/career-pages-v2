"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompanyLogoSrc } from "@/lib/company-logo";
import { cn } from "@/lib/utils";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Props = {
  name: string;
  careersUrl: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "h-9 w-9 text-[10px]",
  md: "h-11 w-11 text-xs",
  lg: "h-14 w-14 text-sm",
} as const;

export function CompanyLogoMark({ name, careersUrl, className, size = "md" }: Props) {
  const logoSrc = getCompanyLogoSrc(careersUrl);
  const initials = initialsFromName(name);

  return (
    <Avatar
      className={cn(
        "shrink-0 rounded-lg border bg-background shadow-sm",
        sizeClass[size],
        className
      )}
    >
      {logoSrc ? (
        <AvatarImage
          src={logoSrc}
          alt={`${name} logo`}
          className="object-contain p-1.5"
        />
      ) : null}
      <AvatarFallback className="rounded-lg bg-muted font-semibold text-muted-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
