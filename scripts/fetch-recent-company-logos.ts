/**
 * Downloads favicons for recently added companies into public/logo-cache/*.webp
 * Uses Google favicon API + sharp (same pipeline as admin logo upload).
 */

import "./load-env";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import sharp from "sharp";

/** Save under these storage keys (hostname.webp). */
const LOGO_TARGETS: {
  host: string;
  domain: string;
  logoUrl?: string;
}[] = [
  { host: "www.ringg.ai", domain: "ringg.ai" },
  { host: "runable.com", domain: "runable.com" },
  { host: "www.airbound.com", domain: "airbound.com" },
  { host: "carbonstrong.in", domain: "carbonstrong.in", logoUrl: "https://carbonstrong.in/wp-content/uploads/2024/09/CS-Logo_prev_ui.png" },
  { host: "algofet.com", domain: "algofet.com" },
  { host: "wippi.com", domain: "wippi.com" },
  { host: "ayatidevices.com", domain: "ayatidevices.com" },
  { host: "ayatidevices.zohorecruit.in", domain: "ayatidevices.com" },
  { host: "www.rideriver.com", domain: "rideriver.com" },
  { host: "www.sarvam.ai", domain: "sarvam.ai" },
  { host: "www.superleap.com", domain: "superleap.com" },
  { host: "profound.me", domain: "profound.me" },
  { host: "revspot.ai", domain: "revspot.ai" },
  { host: "www.revspot.in", domain: "revspot.ai" },
  { host: "mandrakebio.com", domain: "mandrakebio.com" },
  { host: "mandrakebio.notion.site", domain: "mandrakebio.com" },
  { host: "switchon.io", domain: "switchon.io" },
  { host: "emergent.sh", domain: "emergent.sh" },
];

async function fetchLogo(target: {
  host: string;
  domain: string;
  logoUrl?: string;
}): Promise<Buffer> {
  if (target.logoUrl) {
    const res = await fetch(target.logoUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${target.logoUrl}`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
  const url = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(target.domain)}&sz=128`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${target.domain}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function toWebp(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(512, 512, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer();
}

async function main() {
  const dir = join(process.cwd(), "public/logo-cache");
  mkdirSync(dir, { recursive: true });

  let ok = 0;
  let failed = 0;

  for (const target of LOGO_TARGETS) {
    const outPath = join(dir, `${target.host}.webp`);
    try {
      const raw = await fetchLogo(target);
      const webp = await toWebp(raw);
      writeFileSync(outPath, webp);
      console.log(`✓ ${target.host}.webp (${target.logoUrl ?? target.domain})`);
      ok += 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`✗ ${target.host}.webp — ${msg}`);
      failed += 1;
    }
  }

  console.log(`Done. Saved: ${ok}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

void main();
