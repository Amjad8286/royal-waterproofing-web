#!/usr/bin/env node
/**
 * Downloads the client logos shown in the home page's "Our clients" section
 * from Wikimedia Commons, strips editor metadata and trims each SVG's viewBox
 * to the artwork (so every logo sizes consistently), and saves them in
 * public/images/clients/.
 *
 *   npm run images:clients          # skips files that already exist
 *   npm run images:clients -- --force
 *
 * Only official marks of unambiguous organisations are used: Commons files
 * whose source is the company's own website. They're public domain as simple
 * text logos, but they remain trademarks — show them only for confirmed
 * clients, with permission (see `pendingFacts` in src/config/site.ts). Every
 * other client is shown by name. To add a logo you've been given, save it in
 * public/images/clients/, add it to src/content/images.ts and run
 * `npm run images:meta`.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const outDir = join(process.cwd(), "public/images/clients");
const force = process.argv.includes("--force");

const logos = [
  { out: "adani", title: "Adani", file: "Adani_logo_2012.svg", path: "d/d4" },
  { out: "tata", title: "Tata", file: "Tata_logo.svg", path: "8/8e" },
  { out: "godrej-boyce", title: "Godrej & Boyce", file: "GnB-logo.svg", path: "7/74" },
];

/** Every logo is saved 100 units tall, so the manifest's sizes compare directly. */
const HEIGHT = 100;

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Removes editor cruft (Inkscape/Illustrator metadata, comments, DOCTYPE entities) and returns the root's viewBox and inner markup. */
function clean(svg) {
  // Illustrator declares namespace entities in the DOCTYPE; expand them before dropping it.
  const entities = Object.fromEntries([...svg.matchAll(/<!ENTITY\s+(\w+)\s+"([^"]*)">/g)].map(([, name, value]) => [name, value]));
  let s = svg.replace(/&(\w+);/g, (match, name) => entities[name] ?? match);
  s = s
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?(\]>|>)/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/g, "")
    .replace(/<sodipodi:namedview[\s\S]*?(\/>|<\/sodipodi:namedview>)/g, "")
    .replace(/\s(?:inkscape|sodipodi):[\w-]+="[^"]*"/g, "")
    .replace(/\s(?:enable-background|xml:space|data-name)="[^"]*"/g, "")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
  const root = s.match(/<svg\b[^>]*>/);
  if (!root) throw new Error("No <svg> root");
  const viewBox = root[0].match(/viewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
  if (!viewBox || viewBox.length !== 4) throw new Error("No viewBox");
  const inner = s.slice(root.index + root[0].length, s.lastIndexOf("</svg>"));
  return { viewBox, inner };
}

/** The artwork's bounding box in SVG units, measured by rendering it and trimming the empty margin. */
async function artworkBox([x, y, width, height], inner) {
  const scale = 8;
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}">${inner}</svg>`;
  // Two passes: sharp trims before it flattens, whatever order they're called in.
  const flat = await sharp(Buffer.from(probe), { density: 72 * scale }).flatten({ background: "#ffffff" }).png().toBuffer();
  const { info } = await sharp(flat).trim({ background: "#ffffff", threshold: 8 }).toBuffer({ resolveWithObject: true });
  const margin = 0.01 * Math.max(info.width, info.height);
  return [
    x + (-info.trimOffsetLeft - margin) / scale,
    y + (-info.trimOffsetTop - margin) / scale,
    (info.width + 2 * margin) / scale,
    (info.height + 2 * margin) / scale,
  ];
}

mkdirSync(outDir, { recursive: true });

for (const logo of logos) {
  const target = join(outDir, `${logo.out}.svg`);
  if (existsSync(target) && !force) {
    console.log(`skip ${logo.out}.svg (exists)`);
    continue;
  }
  const url = `https://upload.wikimedia.org/wikipedia/commons/${logo.path}/${logo.file}`;
  const response = await fetch(url, { headers: { "User-Agent": "RoyalWaterproofingWebsite/1.0 (build script)" } });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const { viewBox, inner } = clean(await response.text());
  const box = (await artworkBox(viewBox, inner)).map((v) => Math.round(v * 1000) / 1000);
  const width = Math.round((HEIGHT * box[2]) / box[3]);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(" ")}" width="${width}" height="${HEIGHT}">` +
    `<title>${escape(logo.title)}</title>${inner}</svg>\n`;
  writeFileSync(target, svg);
  console.log(`${logo.out}.svg  ${width}×${HEIGHT}  from https://commons.wikimedia.org/wiki/File:${logo.file}`);
}
