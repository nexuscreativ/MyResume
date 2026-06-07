#!/usr/bin/env node
// scripts/optimize-avatar.mjs
// One-shot: takes a source headshot, generates 3 pre-sized, square-cropped
// variants (JPEG + WebP), an Apple-touch variant, and a 1200x630 social card.
// If public/og-source.{jpg,jpeg,png,webp} exists, it is used for the social card
// instead of cropping from the avatar source — useful when the avatar source is
// portrait and you want a wider landscape shot for social previews.
//
// Usage:
//   1. Save your headshot as public/avatar-source.{jpg,jpeg,png,webp}
//   2. (Optional) Save a wider landscape shot as public/og-source.{jpg,...}
//   3. Run: npm run optimize:avatar

import { readFile, writeFile, access, constants } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "..", "public");

const AVATAR_SIZES = [64, 128, 256];
const FORMATS = [
  { ext: "jpg", opts: { quality: 82, mozjpeg: true } },
  { ext: "webp", opts: { quality: 80 } },
];

const AVATAR_SOURCES = [
  "avatar-source.jpg",
  "avatar-source.jpeg",
  "avatar-source.png",
  "avatar-source.webp",
];

const OG_SOURCES = [
  "og-source.jpg",
  "og-source.jpeg",
  "og-source.png",
  "og-source.webp",
];

async function findSource(candidates) {
  for (const name of candidates) {
    const p = join(PUBLIC_DIR, name);
    try {
      await access(p, constants.R_OK);
      return p;
    } catch {}
  }
  return null;
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function processSquare(raw, size) {
  // Attention-based crop: keeps the most visually salient area (faces have
  // strong edge features so they usually win over background complexity).
  return sharp(raw)
    .rotate()
    .resize(size, size, {
      fit: "cover",
      position: sharp.strategy.attention,
    });
}

async function processOg(raw) {
  const meta = await sharp(raw).metadata();
  const isPortrait = (meta.height ?? 0) > (meta.width ?? 0);
  // For portrait source, gravity 'top' keeps the face in frame;
  // for landscape or square, attention still works well.
  return sharp(raw)
    .rotate()
    .resize(1200, 630, {
      fit: "cover",
      position: isPortrait
        ? sharp.gravity.north
        : sharp.strategy.attention,
    });
}

async function main() {
  const avatarPath = await findSource(AVATAR_SOURCES);
  if (!avatarPath) {
    console.error(
      "✖ No avatar source image found in public/. Expected one of:\n" +
        AVATAR_SOURCES.map((n) => "  - public/" + n).join("\n")
    );
    process.exit(1);
  }

  const ogPath = (await findSource(OG_SOURCES)) ?? avatarPath;

  console.log("→ Avatar source:", avatarPath.replace(process.cwd(), "."));
  if (ogPath !== avatarPath) {
    console.log("→ OG source:    ", ogPath.replace(process.cwd(), "."));
  } else {
    const meta = await sharp(avatarPath).metadata();
    if ((meta.height ?? 0) > (meta.width ?? 0)) {
      console.log(
        "→ OG source:    (using avatar source; portrait — top of frame is kept)"
      );
      console.log(
        "  💡 For a better social card, also drop a landscape image as public/og-source.jpg"
      );
    } else {
      console.log("→ OG source:    (using avatar source)");
    }
  }

  const avatarRaw = await readFile(avatarPath);
  const ogRaw = await readFile(ogPath);
  const results = [];

  // Square avatar variants (multiple sizes x multiple formats)
  for (const size of AVATAR_SIZES) {
    const pipeline = await processSquare(avatarRaw, size);
    for (const { ext, opts } of FORMATS) {
      const buf = await pipeline
        .clone()
        .toFormat(ext === "jpg" ? "jpeg" : ext, opts)
        .toBuffer();
      const outPath = join(PUBLIC_DIR, `avatar-${size}.${ext}`);
      await writeFile(outPath, buf);
      results.push({
        label: `avatar-${size}.${ext}`,
        size,
        bytes: buf.length,
      });
    }
  }

  // Apple touch icon (180x180)
  const applePipeline = await processSquare(avatarRaw, 180);
  const appleBuf = await applePipeline
    .clone()
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  await writeFile(join(PUBLIC_DIR, "avatar-apple.jpg"), appleBuf);
  results.push({ label: "avatar-apple.jpg", size: 180, bytes: appleBuf.length });

  // Social card (1200x630)
  const ogPipeline = await processOg(ogRaw);
  const ogBuf = await ogPipeline
    .clone()
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  await writeFile(join(PUBLIC_DIR, "og-image.jpg"), ogBuf);
  results.push({ label: "og-image.jpg", size: "1200x630", bytes: ogBuf.length });

  // WebP variants of the two non-square outputs
  const appleWebp = await applePipeline
    .clone()
    .webp({ quality: 82 })
    .toBuffer();
  await writeFile(join(PUBLIC_DIR, "avatar-apple.webp"), appleWebp);
  results.push({ label: "avatar-apple.webp", size: 180, bytes: appleWebp.length });

  const ogWebp = await ogPipeline
    .clone()
    .webp({ quality: 82 })
    .toBuffer();
  await writeFile(join(PUBLIC_DIR, "og-image.webp"), ogWebp);
  results.push({
    label: "og-image.webp",
    size: "1200x630",
    bytes: ogWebp.length,
  });

  // Pretty output
  const maxLabel = Math.max(...results.map((r) => r.label.length));
  console.log("\n✓ Generated avatar variants:");
  for (const r of results) {
    const padded = r.label.padEnd(maxLabel + 2);
    const sizeStr = String(r.size).padStart(7);
    console.log(`  ${padded} ${sizeStr}  ${fmtKb(r.bytes).padStart(9)}`);
  }

  const totalKb = results.reduce((s, r) => s + r.bytes, 0) / 1024;
  console.log(
    `\nTotal: ${totalKb.toFixed(1)} KB across ${results.length} files.`
  );
  console.log(
    "Next: commit the public/avatar-* and public/og-image.* files and rebuild.\n"
  );
}

main().catch((err) => {
  console.error("✖", err.message);
  process.exit(1);
});
