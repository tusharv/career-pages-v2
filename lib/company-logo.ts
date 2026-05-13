/** Matches scripts/upload-company-logos.ts and Supabase migration bucket id */
export const COMPANY_LOGOS_BUCKET = "company-logos";

export function getCareersHostname(careersUrl: string): string | null {
  try {
    return new URL(careersUrl).hostname;
  } catch {
    return null;
  }
}

/**
 * Public URL for a company logo WebP in Supabase Storage when
 * `NEXT_PUBLIC_SUPABASE_URL` is set; otherwise the local `/logo-cache/` path.
 */
export function getCompanyLogoSrc(careersUrl: string): string | null {
  const host = getCareersHostname(careersUrl);
  if (!host) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${COMPANY_LOGOS_BUCKET}/${host}.webp`;
  }

  return `/logo-cache/${host}.webp`;
}
