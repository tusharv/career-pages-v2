/** Matches scripts/upload-company-logos.ts and Supabase migration bucket id */
export const COMPANY_LOGOS_BUCKET = "company-logos";

export function getCareersHostname(careersUrl: string): string | null {
  try {
    return new URL(careersUrl).hostname;
  } catch {
    return null;
  }
}

/** Job-board / third-party hosts where the careers URL hostname is not the company brand. */
function isGenericCareersHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "www.linkedin.com" || h === "linkedin.com") return true;
  if (h.endsWith(".notion.site") || h === "www.notion.so") return true;
  if (h.endsWith(".zohorecruit.in") || h.endsWith(".zohorecruit.com")) return true;
  if (h.endsWith(".myworkdayjobs.com") || h.endsWith(".workable.com")) return true;
  if (h === "apply.workable.com") return true;
  return false;
}

function logoPathForHost(host: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${COMPANY_LOGOS_BUCKET}/${host}.webp`;
  }
  return `/logo-cache/${host}.webp`;
}

/**
 * Public URL for a company logo WebP in Supabase Storage when
 * `NEXT_PUBLIC_SUPABASE_URL` is set; otherwise the local `/logo-cache/` path.
 *
 * When careers pages sit on generic job boards (LinkedIn, Notion, etc.),
 * pass the company website URL so the correct brand logo is used.
 */
export function getCompanyLogoSrc(
  careersUrl: string,
  websiteUrl?: string | null
): string | null {
  const careersHost = getCareersHostname(careersUrl);
  const websiteHost = websiteUrl ? getCareersHostname(websiteUrl) : null;

  const host =
    careersHost && !isGenericCareersHost(careersHost)
      ? careersHost
      : websiteHost ?? careersHost;

  if (!host) return null;
  return logoPathForHost(host);
}
