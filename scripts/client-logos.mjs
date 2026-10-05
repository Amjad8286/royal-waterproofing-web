#!/usr/bin/env node
/**
 * Downloads the client logos shown in the home page's "Our clients" section,
 * strips editor metadata and trims each logo to its artwork (so every logo
 * sizes consistently), and saves them in public/images/clients/.
 *
 *   npm run images:clients          # skips files that already exist
 *   npm run images:clients -- --force
 *
 * Only official marks of unambiguous organisations are used: Wikimedia Commons
 * files whose source is the company's own website, or the logo the company
 * publishes on its own website (the version for light backgrounds). Vector
 * files are preferred; raster ones are kept at their published resolution,
 * never enlarged. They remain trademarks — show them only for confirmed
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

const commons = (path, file) => `https://upload.wikimedia.org/wikipedia/commons/${path}/${file}`;

const logos = [
  // Wikimedia Commons (each sourced from the company's website)
  { out: "adani", title: "Adani", url: commons("d/d4", "Adani_logo_2012.svg") },
  { out: "tata", title: "Tata", url: commons("8/8e", "Tata_logo.svg") },
  { out: "godrej-boyce", title: "Godrej & Boyce", url: commons("7/74", "GnB-logo.svg") },
  { out: "mahindra", title: "Mahindra", url: commons("1/16", "Mahindra_Rise_New_Logo.svg") },

  // The company's own website
  { out: "capacite", title: "Capacit'e Infraprojects", url: "https://capacite.in/wp-content/uploads/2024/06/logo.svg" },
  { out: "chandak", title: "Chandak Group", url: "https://www.chandakgroup.com/assets/images/Chandak-Group-Final-Logo.svg" },
  {
    out: "hinduja-hospital",
    title: "P. D. Hinduja Hospital & Medical Research Centre",
    url: "https://www.hindujahospital.com/static/Logo-3570dad3506eee206a594d7e761b3a4a.svg",
  },
  { out: "rustomjee", title: "Rustomjee", url: "https://www.rustomjee.com/_next/static/media/header-logo.0789e56b.svg" },
  {
    out: "mj-shah",
    title: "MJ Shah Group",
    url: "https://mjshahgroup.com/images/MJ-Shah-logo-white.svg",
    // The site's only vector file is the white version for its dark header; it's
    // coloured in the blue of the site's colour logo (/images/MJ-Shah.png).
    recolor: { white: "#006092" },
  },
  { out: "piramal", title: "Piramal", url: "https://www.piramal.com/assets/images/piramal-logo.png" },
  { out: "navneet", title: "Navneet", url: "https://navneet.com/wp-content/uploads/2018/03/Navneet-Logo-Name_2-1.png" },
  { out: "spjimr", title: "SPJIMR", url: "https://www.spjimr.org/wp-content/uploads/2022/07/footer-logo.png" },
  {
    out: "parsvnath",
    title: "Parsvnath Developers",
    url: "https://www.parsvnath.com/wp-content/themes/storefront/assets/icon/logo-parsvnaths.png",
  },
  { out: "dosti", title: "Dosti Realty", url: "https://assets.dostirealty.com/uploads/dosti_full_logo_1a122c7082.png" },
  { out: "kolte-patil", title: "Kolte-Patil Developers", url: "https://www.koltepatil.com/assets/dist/images/logo.jpg" },
  {
    out: "chandigarh-university",
    title: "Chandigarh University",
    url: "https://www.cuchd.in/includes/assets/images/header-footer/cu-logo-dark-new.webp",
  },
];

/** Every vector logo is saved 100 units tall, so the manifest's sizes compare directly. */
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
  // Embedded bitmaps reference xlink:href; keep the namespace when the root declared it.
  const xlink = /xmlns:xlink=/.test(root[0]) ? ` xmlns:xlink="http://www.w3.org/1999/xlink"` : "";
  const inner = s.slice(root.index + root[0].length, s.lastIndexOf("</svg>"));
  return { viewBox, inner, xlink };
}

/** Replaces fill and stroke colours, e.g. { white: "#006092" }. */
function recolor(inner, colors) {
  return inner.replace(/(fill|stroke)="([^"]+)"/g, (match, attr, value) =>
    colors[value.toLowerCase()] ? `${attr}="${colors[value.toLowerCase()]}"` : match,
  );
}

/** The artwork's bounding box in SVG units, measured by rendering it and trimming the empty margin. */
async function artworkBox([x, y, width, height], inner, xlink) {
  const scale = 8;
  const probe = `<svg xmlns="http://www.w3.org/2000/svg"${xlink} viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}">${inner}</svg>`;
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

async function saveSvg(logo, text) {
  const target = join(outDir, `${logo.out}.svg`);
  const { viewBox, inner: raw, xlink } = clean(text);
  const inner = logo.recolor ? recolor(raw, logo.recolor) : raw;
  const box = (await artworkBox(viewBox, inner, xlink)).map((v) => Math.round(v * 1000) / 1000);
  const width = Math.round((HEIGHT * box[2]) / box[3]);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg"${xlink} viewBox="${box.join(" ")}" width="${width}" height="${HEIGHT}">` +
    `<title>${escape(logo.title)}</title>${inner}</svg>\n`;
  writeFileSync(target, svg);
  return `${width}×${HEIGHT}`;
}

/**
 * Makes a logo on an opaque white background transparent: the exact inverse of
 * compositing over white, so it looks identical on white and keeps its colours.
 */
async function whiteToAlpha(input) {
  const { data, info } = await sharp(input).flatten({ background: "#ffffff" }).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    const alpha = Math.max(255 - data[p], 255 - data[p + 1], 255 - data[p + 2]) / 255;
    if (alpha < 0.04) continue; // paper-white noise and JPEG fringes
    for (let j = 0; j < 3; j++) out[q + j] = Math.max(0, Math.min(255, Math.round(255 - (255 - data[p + j]) / alpha)));
    out[q + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/** Trims a bitmap logo to its artwork (on white or transparent) plus a 1% margin, at its own resolution, as PNG with transparency. */
async function savePng(logo, buffer) {
  const target = join(outDir, `${logo.out}.png`);
  const { hasAlpha } = await sharp(buffer).metadata();
  const input = hasAlpha ? buffer : await whiteToAlpha(buffer);
  const { data, info } = await sharp(input).trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
  const margin = Math.round(0.01 * Math.max(info.width, info.height));
  await sharp(data)
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(target);
  return `${info.width + 2 * margin}×${info.height + 2 * margin}`;
}

mkdirSync(outDir, { recursive: true });

for (const logo of logos) {
  const isSvg = logo.url.endsWith(".svg");
  const file = `${logo.out}.${isSvg ? "svg" : "png"}`;
  if (existsSync(join(outDir, file)) && !force) {
    console.log(`skip ${file} (exists)`);
    continue;
  }
  const response = await fetch(logo.url, { headers: { "User-Agent": "RoyalWaterproofingWebsite/1.0 (build script)" } });
  if (!response.ok) throw new Error(`${logo.url}: HTTP ${response.status}`);
  const size = isSvg
    ? await saveSvg(logo, await response.text())
    : await savePng(logo, Buffer.from(await response.arrayBuffer()));
  console.log(`${file}  ${size}  from ${logo.url}`);
}
