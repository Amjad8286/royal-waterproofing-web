#!/usr/bin/env node
/**
 * Rasterises the app icon (src/app/icon.svg) into the files browsers and
 * phones still need as bitmaps:
 *   src/app/apple-icon.png             180×180, square corners (iOS rounds them itself)
 *   src/app/favicon.ico                16, 32 and 48 px, for browsers without SVG favicons
 *   public/icons/icon-192.png          web app manifest
 *   public/icons/icon-512.png          web app manifest
 *   public/icons/icon-maskable-512.png web app manifest, for Android's adaptive icon masks
 *
 *   npm run brand:icons
 *
 * Run it after changing src/app/icon.svg. The icon is a navy tile (`#tile`)
 * with the mark (`#mark`): the script "R" from the logo over the logo's two
 * waves. It's drawn for the square, not cropped from the wide logo.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const appDir = join(process.cwd(), "src/app");
const iconsDir = join(process.cwd(), "public/icons");
const svg = readFileSync(join(appDir, "icon.svg"), "utf8");
if (!svg.includes('id="tile"') || !svg.includes('<g id="mark">')) {
  throw new Error('src/app/icon.svg needs a <rect id="tile" rx="…"> and a <g id="mark">');
}

const render = (source, size) => sharp(Buffer.from(source), { density: 600 }).resize(size, size).png().toBuffer();

// iOS and Android mask the icon with their own shapes and fill transparency with
// black, so those get a full-bleed square tile.
const square = svg.replace(/(<rect id="tile"[^>]*?) rx="[^"]*"/, "$1");
// Android's masks can cut into anything outside the central 80% circle, so the
// maskable version shrinks the mark to fit inside it.
const maskable = square.replace('<g id="mark">', '<g id="mark" transform="translate(256 256) scale(0.72) translate(-256 -256)">');

writeFileSync(join(appDir, "apple-icon.png"), await render(square, 180));

mkdirSync(iconsDir, { recursive: true });
writeFileSync(join(iconsDir, "icon-192.png"), await render(svg, 192));
writeFileSync(join(iconsDir, "icon-512.png"), await render(svg, 512));
writeFileSync(join(iconsDir, "icon-maskable-512.png"), await render(maskable, 512));

// ICO container holding PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((size) => render(svg, size)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const entry = 6 + 16 * i;
  header.writeUInt8(size, entry); // width
  header.writeUInt8(size, entry + 1); // height
  header.writeUInt8(0, entry + 2); // palette colours
  header.writeUInt8(0, entry + 3); // reserved
  header.writeUInt16LE(1, entry + 4); // colour planes
  header.writeUInt16LE(32, entry + 6); // bits per pixel
  header.writeUInt32LE(pngs[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += pngs[i].length;
});
writeFileSync(join(appDir, "favicon.ico"), Buffer.concat([header, ...pngs]));

console.log("Wrote src/app/apple-icon.png, src/app/favicon.ico and public/icons/*.png from src/app/icon.svg");
