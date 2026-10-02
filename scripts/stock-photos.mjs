#!/usr/bin/env node
/**
 * Downloads the licensed stock photos used on the site (Pexels licence: free for
 * commercial use, no attribution required), crops them to the layout's aspect
 * ratios and saves them as WebP in public/images/photos/.
 *
 *   npm run images:stock          # skips files that already exist
 *   npm run images:stock -- --force
 *
 * Stock photos illustrate services and Mumbai. They are never presented as the
 * company's own projects, and none of them show people (each crop was checked at
 * full size). Replace them with your own photos when you can
 * (docs/PHOTO_SHOT_LIST.md), then run `npm run images:meta`.
 */
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const outDir = join(process.cwd(), "public/images/photos");
const force = process.argv.includes("--force");

/**
 * Pexels photo id → output file, crop aspect ratio, focal point (0–1) and output
 * width. `region` ([x, y, width, height] as fractions) crops an exact area instead.
 * `download` fetches a larger original when a crop needs more pixels (default 2400).
 */
const photos = [
  // Home hero slides: 16:9 for wide screens, 4:5 for phones held upright.
  // The skyline is cropped above the road at the bottom of the original so no traffic or pedestrians are visible.
  { id: 34634289, out: "mumbai-monsoon-skyline", region: [0, 0.147, 1, 0.422], width: 2400 },
  { id: 34634289, out: "mumbai-monsoon-skyline-portrait", region: [0.116, 0, 0.607, 0.569], width: 1280 },
  { id: 27566315, out: "terrace-water-tanks-wide", region: [0.135, 0.27, 0.865, 0.73], width: 2400, download: 6000 },
  { id: 27566315, out: "terrace-water-tanks-portrait", region: [0.505, 0.194, 0.43, 0.806], width: 1280, download: 6000 },
  { id: 9998140, out: "crack-seepage-stains-wide", aspect: 16 / 9, focus: [0.5, 0.5], width: 2400, download: 4032 },
  { id: 9998140, out: "crack-seepage-stains-portrait", aspect: 4 / 5, focus: [0.55, 0.5], width: 1280, download: 4032 },
  { id: 21374999, out: "basement-parking-puddles-wide", aspect: 16 / 9, focus: [0.5, 0.5], width: 2400 },
  { id: 21374999, out: "basement-parking-puddles-portrait", aspect: 4 / 5, focus: [0.5, 0.5], width: 1280 },
  { id: 6764266, out: "coating-roller-pails-wide", aspect: 16 / 9, focus: [0.5, 0.5], width: 2400 },
  { id: 6764266, out: "coating-roller-pails-portrait", aspect: 4 / 5, focus: [0.55, 0.5], width: 1280 },
  // Mumbai and buildings
  // Replaced Pexels 32809620 (Mumbai rooftops with tarpaulins): at full size it shows people on a balcony and in a window.
  { id: 27566315, out: "terrace-water-tanks", region: [0.33, 0.246, 0.67, 0.754], width: 1800, download: 6000 },
  { id: 14756146, out: "mumbai-housing-society", aspect: 4 / 3, focus: [0.5, 0.62], width: 1600 },
  { id: 38179316, out: "mumbai-society-building", aspect: 4 / 3, focus: [0.5, 0.6], width: 1600 },
  { id: 35469883, out: "mumbai-office-towers", aspect: 4 / 3, focus: [0.5, 0.42], width: 1600 },
  { id: 30331589, out: "mumbai-towers-crane", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  // Problems, surfaces and sites
  { id: 10647626, out: "damp-peeling-wall", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  { id: 9998140, out: "crack-seepage-stains", aspect: 4 / 3, focus: [0.56, 0.5], width: 1600 },
  { id: 16001335, out: "basement-concrete-wall", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  { id: 21374999, out: "basement-parking-puddles", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  { id: 5768318, out: "bathroom-floor-drain", aspect: 4 / 3, focus: [0.5, 0.42], width: 1600 },
  { id: 22589689, out: "bathroom-tiled-corner", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  { id: 15206136, out: "leaking-pipe-joint", aspect: 4 / 3, focus: [0.5, 0.4], width: 1600 },
  { id: 17732213, out: "industrial-roof-aerial", aspect: 4 / 3, focus: [0.5, 0.62], width: 1600 },
  { id: 2093640, out: "concrete-frame-construction", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  // Tools and materials
  { id: 7937319, out: "site-plans-level-helmet", aspect: 4 / 3, focus: [0.5, 0.5], width: 1600 },
  { id: 8470842, out: "plans-tape-helmet", aspect: 4 / 3, focus: [0.5, 0.45], width: 1600 },
  { id: 6764266, out: "coating-roller-pails", aspect: 4 / 3, focus: [0.55, 0.5], width: 1600 },
];

/** Largest crop of the given aspect ratio, centred on the focal point and kept inside the image. */
function cropBox(width, height, aspect, [fx, fy]) {
  let w = width;
  let h = Math.round(width / aspect);
  if (h > height) {
    h = height;
    w = Math.round(height * aspect);
  }
  const left = Math.min(Math.max(Math.round(fx * width - w / 2), 0), width - w);
  const top = Math.min(Math.max(Math.round(fy * height - h / 2), 0), height - h);
  return { left, top, width: w, height: h };
}

mkdirSync(outDir, { recursive: true });

for (const photo of photos) {
  const file = join(outDir, `${photo.out}.webp`);
  if (existsSync(file) && !force) {
    console.log(`skip  ${photo.out}.webp (exists)`);
    continue;
  }
  const url = `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=${photo.download ?? 2400}`;
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`Download failed for Pexels photo ${photo.id}: HTTP ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const { width, height } = await sharp(input).metadata();
  const box = photo.region
    ? {
        left: Math.round(photo.region[0] * width),
        top: Math.round(photo.region[1] * height),
        width: Math.round(photo.region[2] * width),
        height: Math.round(photo.region[3] * height),
      }
    : cropBox(width, height, photo.aspect, photo.focus);
  await sharp(input)
    .extract(box)
    .resize({ width: photo.width, withoutEnlargement: true })
    .webp({ quality: 74, effort: 6 })
    .toFile(file);
  console.log(`saved ${photo.out}.webp  (pexels.com/photo/${photo.id})`);
}
console.log("Done. Run `npm run images:meta` to refresh image dimensions and blur placeholders.");
