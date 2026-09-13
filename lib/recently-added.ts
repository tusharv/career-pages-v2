/** Slugs for companies highlighted as recently added on the home page. */
export const RECENTLY_ADDED_SLUGS = [
  "ringg-ai",
  "runable",
  "airbound",
  "carbonstrong",
  "algofet",
  "wippi",
  "ayati-devices-pvt-ltd",
  "river",
  "sarvam-ai",
  "superleap-ai-crm",
  "profound-me",
  "revspot",
  "mandrake-bio",
  "switchon-inc",
  "emergent",
] as const;

const RECENTLY_ADDED_SET = new Set<string>(RECENTLY_ADDED_SLUGS);

export function isRecentlyAddedSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return RECENTLY_ADDED_SET.has(slug);
}
