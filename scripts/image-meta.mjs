#!/usr/bin/env node
/**
 * Reads every image in public/images and writes its dimensions (and, for
 * photos, a tiny blur placeholder and how bright their light areas are) to
 * src/content/generated/image-meta.json.
 *
 * Run after adding or replacing images:  npm run images:meta
 */
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = join(root, "public/images");
const outFile = join(root, "src/content/generated/image-meta.json");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(imagesDir)
  .filter((file) => exts.has(extname(file).toLowerCase()))
  .sort();

/** sRGB channel (0–255) → linear light. */
const linear = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** 90th-percentile relative luminance (0–1): how bright the light areas are. Text over photos uses it. */
async function highlights(file) {
  const { data } = await sharp(file).resize(64).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const values = [];
  for (let i = 0; i < data.length; i += 3) {
    values.push(0.2126 * linear(data[i]) + 0.7152 * linear(data[i + 1]) + 0.0722 * linear(data[i + 2]));
  }
  values.sort((a, b) => a - b);
  return Math.round(values[Math.floor(values.length * 0.9)] * 1000) / 1000;
}

const meta = {};
for (const file of files) {
  const src = `/${relative(join(root, "public"), file).split(sep).join("/")}`;
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const entry = { width, height };
  if (extname(file).toLowerCase() !== ".svg") {
    const blur = await sharp(file).resize(12).webp({ quality: 40 }).toBuffer();
    entry.blurDataURL = `data:image/webp;base64,${blur.toString("base64")}`;
    entry.highlights = await highlights(file);
  }
  meta[src] = entry;
}

mkdirSync(join(root, "src/content/generated"), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`Wrote metadata for ${files.length} images to ${relative(root, outFile)}`);
