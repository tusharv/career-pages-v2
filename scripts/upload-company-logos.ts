/**
 * Uploads `public/logo-cache/*.webp` to Supabase Storage bucket `company-logos`.
 *
 * Loads `.env` / `.env.local` from the project root (same as Next.js).
 * You can still override with inline env vars when invoking the script.
 */

import "./load-env";
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { COMPANY_LOGOS_BUCKET } from "../lib/company-logo";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment."
    );
    process.exit(1);
  }

  const dir = join(process.cwd(), "public/logo-cache");
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const concurrency = 8;
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (file) => {
        const body = readFileSync(join(dir, file));
        const { error } = await supabase.storage
          .from(COMPANY_LOGOS_BUCKET)
          .upload(file, body, {
            contentType: "image/webp",
            upsert: true,
          });
        if (error) {
          console.error(file, error.message);
          failed += 1;
        } else {
          ok += 1;
        }
      })
    );
    console.log(
      `Progress: ${Math.min(i + concurrency, files.length)} / ${files.length}`
    );
  }

  console.log(`Done. Uploaded: ${ok}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main();
