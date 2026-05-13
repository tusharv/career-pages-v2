/**
 * Seeds `companies` from public/data.json using the service role key (bypasses RLS).
 *
 * Loads `.env` / `.env.local` from the project root (same as Next.js).
 */

import "./load-env";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

type DataJsonEntry = {
  name: string;
  url: string;
  blog?: string;
};

function slugify(raw: string): string {
  const s = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "company";
}

function uniqueSlug(name: string, used: Set<string>): string {
  const base = slugify(name);
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let n = 2;
  let candidate = `${base}-${n}`;
  while (used.has(candidate)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  used.add(candidate);
  return candidate;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment."
    );
    process.exit(1);
  }

  const dataPath = resolve(process.cwd(), "public/data.json");
  const raw = readFileSync(dataPath, "utf-8");
  const entries = JSON.parse(raw) as DataJsonEntry[];

  const usedSlugs = new Set<string>();
  const rows = entries.map((e) => ({
    slug: uniqueSlug(e.name, usedSlugs),
    name: e.name,
    careers_url: e.url,
    blog_url: e.blog ?? null,
  }));

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const batchSize = 200;
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const { error } = await supabase.from("companies").upsert(chunk, {
      onConflict: "slug",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error("Upsert error:", error);
      process.exit(1);
    }
    console.log(`Upserted ${Math.min(i + batchSize, rows.length)} / ${rows.length}`);
  }

  console.log("Done.");
}

main();
