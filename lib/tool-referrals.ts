import type { ToolSlug } from "@/lib/tools";

const FALLBACK_URLS: Record<ToolSlug, string> = {
  meetup: "https://www.meetup.com/",
  luma: "https://luma.com/discover",
  v0: "https://v0.dev",
  shadcn: "https://ui.shadcn.com",
  cursor: "https://cursor.com",
  supabase: "https://supabase.com",
  vercel: "https://vercel.com",
  hacktoberfest: "https://hacktoberfest.com",
  scrimba: "https://scrimba.com/?via=u412d258",
};

const ENV_KEYS: Partial<Record<ToolSlug, string>> = {
  v0: "V0_REFERRAL_URL",
  shadcn: "SHADCN_REFERRAL_URL",
  cursor: "CURSOR_REFERRAL_URL",
  supabase: "SUPABASE_REFERRAL_URL",
  vercel: "VERCEL_REFERRAL_URL",
  hacktoberfest: "HACKTOBERFEST_REFERRAL_URL",
  scrimba: "SCRIMBA_REFERRAL_URL",
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** Uses an optional referral URL; otherwise the official site. */
export function getToolReferralUrl(slug: ToolSlug): string {
  const key = ENV_KEYS[slug];
  const raw = key ? process.env[key]?.trim() : undefined;
  if (raw && isHttpUrl(raw)) return raw;
  return FALLBACK_URLS[slug];
}

export function hasToolReferral(slug: ToolSlug): boolean {
  const key = ENV_KEYS[slug];
  const raw = key ? process.env[key]?.trim() : undefined;
  return (
    slug === "scrimba" ||
    Boolean(raw && isHttpUrl(raw) && raw !== FALLBACK_URLS[slug])
  );
}
