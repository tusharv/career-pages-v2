import { useId } from "react";
import Image from "next/image";
import type { ToolGuide } from "@/lib/tools";
import { cn } from "@/lib/utils";

function CursorMark({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

function SupabaseMark({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const g0 = `cp-tool-supabase-p0-${uid}`;
  const g1 = `cp-tool-supabase-p1-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 109 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill={`url(#${g0})`}
      />
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill={`url(#${g1})`}
        fillOpacity={0.2}
      />
      <path
        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient
          id={g0}
          x1="53.9738"
          y1="54.974"
          x2="94.1635"
          y2="71.8295"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id={g1}
          x1="36.1558"
          y1="30.578"
          x2="54.4844"
          y2="65.0806"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ToolMark({
  tool,
  size,
  className,
}: {
  tool: Pick<ToolGuide, "name" | "logo">;
  size: number;
  className?: string;
}) {
  if (tool.logo.type === "cursor") {
    return <CursorMark size={size} className={className} />;
  }
  if (tool.logo.type === "supabase") {
    return <SupabaseMark size={size} className={className} />;
  }

  return (
    <Image
      width={size}
      height={size}
      src={tool.logo.src}
      alt={tool.logo.alt}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden={tool.logo.alt === ""}
    />
  );
}

export function ToolLogo({
  tool,
  size = 16,
  framed = false,
  className,
}: {
  tool: Pick<ToolGuide, "name" | "logo">;
  size?: number;
  framed?: boolean;
  className?: string;
}) {
  const box = framed ? size + 24 : size;

  if (tool.logo.type === "image" && tool.logo.fill) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 overflow-hidden shadow-sm",
          framed ? "rounded-2xl" : "rounded-lg",
          className,
        )}
        style={{ width: box, height: box }}
      >
        <Image
          width={box}
          height={box}
          src={tool.logo.src}
          alt={tool.logo.alt}
          className="h-full w-full object-cover"
          aria-hidden={tool.logo.alt === ""}
        />
      </span>
    );
  }

  const mark = <ToolMark tool={tool} size={size} />;

  if (!framed) {
    return (
      <span className={cn("inline-flex shrink-0 text-foreground", className)}>
        {mark}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-sm",
        className,
      )}
      style={{ width: box, height: box }}
    >
      {mark}
    </span>
  );
}
