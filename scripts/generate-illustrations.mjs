#!/usr/bin/env node
/**
 * Generates the sample before/after illustrations in public/images/illustrations.
 *
 *   npm run images:illustrations
 *
 * They are used only by the sample projects and gallery (preview mode), as
 * stand-ins for the company's own before/after photos. Scenes show buildings
 * and surfaces only — never people. Scenes are drawn as SVG, then rasterised
 * to WebP so they go through next/image exactly like real photos.
 *
 * Replace them using docs/PHOTO_SHOT_LIST.md, then run `npm run images:meta`.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public/images/illustrations");
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => String(Math.round(n * 10) / 10);
const pts = (arr) => arr.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const attrs = (o = {}) =>
  Object.entries(o)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
const rect = (x, y, w, h, fill, o) =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${attrs(o)}/>`;
const poly = (p, fill, o) => `<polygon points="${pts(p)}" fill="${fill}" ${attrs(o)}/>`;
const path = (d, fill, o) => `<path d="${d}" fill="${fill}" ${attrs(o)}/>`;
const circle = (cx, cy, r, fill, o) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${attrs(o)}/>`;
const ellipse = (cx, cy, rx, ry, fill, o) =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${attrs(o)}/>`;
const line = (x1, y1, x2, y2, stroke, w, o) =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" ${attrs(o)}/>`;
const polyline = (p, stroke, w, o) =>
  `<polyline points="${pts(p)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${attrs(o)}/>`;
const g = (content, o) => `<g ${attrs(o)}>${content}</g>`;

const linear = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join("")}</linearGradient>`;
const radial = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join("")}</radialGradient>`;

const doc = (W, H, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>\n`;

function smoothClosed(p) {
  const n = p.length;
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d}Z`;
}

function blob(R, cx, cy, rx, ry, n = 11, jitter = 0.32) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 - jitter + R() * jitter * 2;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smoothClosed(p);
}

function crackPoints(R, x1, y1, x2, y2, seg = 10, amp = 9) {
  const p = [[x1, y1]];
  for (let i = 1; i < seg; i++) {
    const t = i / seg;
    p.push([x1 + (x2 - x1) * t + (R() - 0.5) * amp * 2, y1 + (y2 - y1) * t + (R() - 0.5) * amp * 2]);
  }
  p.push([x2, y2]);
  return p;
}

/** A crack with a couple of short branches. */
function crack(R, x1, y1, x2, y2, { color = "#4E473F", width = 3, seg = 10, amp = 9, branches = 2 } = {}) {
  const main = crackPoints(R, x1, y1, x2, y2, seg, amp);
  let out = polyline(main, color, width);
  for (let b = 0; b < branches; b++) {
    const i = 2 + Math.floor(R() * (main.length - 4));
    const [bx, by] = main[i];
    const ang = Math.atan2(y2 - y1, x2 - x1) + (R() > 0.5 ? 1 : -1) * (0.5 + R() * 0.6);
    const len = 40 + R() * 70;
    out += polyline(crackPoints(R, bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len, 4, amp * 0.6), color, width * 0.6);
  }
  return out;
}

function noise(id, R, { color = "#000", size = 56, count = 34, opacity = 0.09 } = {}) {
  let c = "";
  for (let i = 0; i < count; i++) {
    c += circle(R() * size, R() * size, 0.5 + R() * 1.7, color, { opacity: (opacity * (0.4 + R())).toFixed(3) });
  }
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${c}</pattern>`;
}

const P = {
  navy: "#0B1A2E",
  navy2: "#14263D",
  navy3: "#1E3452",
  royal: "#1E40AF",
  royal2: "#3557C4",
  amber: "#F5A524",
  amberDark: "#D4870C",
  amberSoft: "#FFE3A8",
  sky1: "#C9D8EA",
  sky2: "#EBF1F7",
  city1: "#B2C1D3",
  city2: "#A3B4C8",
  city3: "#C2CFDD",
  concrete: "#CBC5BA",
  concreteDark: "#B2AB9F",
  concreteLight: "#DED9D0",
  oldFloor: "#9B9386",
  oldJoint: "#7F776B",
  stain: "#6E665B",
  water: "#8FA8C1",
  waterLight: "#C3D3E3",
  coat: "#E4E9EE",
  coatLight: "#F3F6F9",
  coatEdge: "#CDD5DD",
  moss: "#6B8650",
  rust: "#94471B",
  rust2: "#B9692F",
  tile: "#EEF2F5",
  tile2: "#E5EAEF",
  groutClean: "#CCD4DB",
  groutDirty: "#4F5A52",
  paint: "#EFE9DF",
  paintShade: "#E1D9CC",
  damp: "#D5C6A7",
  dampEdge: "#B9A47D",
  plaster: "#C2BBAF",
  mould: "#3F4A42",
  wood: "#BF946A",
  woodDark: "#A57D55",
  metal: "#AEB6BF",
  metalLight: "#C8CFD6",
  metalDark: "#949DA7",
  membrane: "#7D96AE",
  skin: "#2E4058",
};

/* ------------------------------------------------------------------ */
/* Shared scenery                                                      */
/* ------------------------------------------------------------------ */

function skyDefs(id = "sky", top = P.sky1, bottom = P.sky2) {
  return linear(id, [
    [0, top],
    [1, bottom],
  ]);
}

function clouds(R, W, maxY, n = 4) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const cx = R() * W;
    const cy = 40 + R() * (maxY * 0.45);
    const w = 90 + R() * 150;
    out += g(
      ellipse(cx, cy, w * 0.5, 16 + R() * 10, "#FFFFFF") +
        ellipse(cx - w * 0.22, cy - 10, w * 0.28, 18, "#FFFFFF") +
        ellipse(cx + w * 0.16, cy - 14, w * 0.24, 20, "#FFFFFF"),
      { opacity: (0.55 + R() * 0.3).toFixed(2) },
    );
  }
  return out;
}

const windowPattern = `<pattern id="win" width="20" height="26" patternUnits="userSpaceOnUse"><rect x="5" y="7" width="9" height="11" fill="#E6EDF4" opacity="0.8"/></pattern>`;

function skyline(R, W, baseY, maxH, { colors = [P.city1, P.city2, P.city3], gap = 10 } = {}) {
  let out = "";
  let x = -30;
  while (x < W + 30) {
    const w = 60 + R() * 120;
    const h = maxH * (0.35 + R() * 0.65);
    const c = colors[Math.floor(R() * colors.length)];
    out += rect(x, baseY - h, w, h + 40, c);
    if (R() > 0.3) out += rect(x + 8, baseY - h + 10, w - 16, h - 10, "url(#win)");
    if (R() > 0.7) out += rect(x + w * 0.3, baseY - h - 18, 10, 18, c);
    if (R() > 0.8) out += line(x + w * 0.7, baseY - h, x + w * 0.7, baseY - h - 34, c, 3);
    x += w + gap * (R() - 0.3);
  }
  return out;
}

/** Perspective floor joints converging on a vanishing point. */
function floorGrid({ W, H, top, vp, spacing = 150, rows = 7, stroke, width = 2, opacity = 1 }) {
  let out = "";
  const s = (top - vp[1]) / (H - vp[1]);
  for (let xb = -W; xb <= W * 2; xb += spacing) {
    const xt = vp[0] + s * (xb - vp[0]);
    out += line(xt, top, xb, H, stroke, width, { opacity });
  }
  for (let i = 1; i <= rows; i++) {
    const y = top + (H - top) * Math.pow(i / rows, 1.7);
    out += line(0, y, W, y, stroke, width, { opacity });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Scene: terrace / flat roof                                          */
/* ------------------------------------------------------------------ */

function terrace({ W = 1200, H = 900, state = "after", seed = 1, cool = false, variant = "home" }) {
  const R = mulberry32(seed);
  const floorTop = H * 0.5;
  const parTop = floorTop - H * 0.082;
  const vp = [W * 0.5, floorTop - H * 0.2];
  const defs = [
    skyDefs(),
    windowPattern,
    noise("grain", R, { opacity: 0.1 }),
    linear("sheen", [
      [0, "#FFFFFF", 0],
      [0.45, "#FFFFFF", 0.5],
      [0.6, "#FFFFFF", 0],
    ], 0, 0, 1, 1),
    linear("floorShade", [
      [0, "#000000", 0.08],
      [1, "#000000", 0],
    ]),
    `<clipPath id="floor"><rect x="0" y="${f(floorTop)}" width="${W}" height="${f(H - floorTop)}"/></clipPath>`,
  ].join("");

  let body = rect(0, 0, W, floorTop, "url(#sky)");
  body += clouds(R, W, floorTop, 4);
  body += skyline(R, W, parTop + 30, H * 0.26);

  // Parapet wall + coping
  body += rect(0, parTop, W, floorTop - parTop, P.concrete);
  body += rect(0, parTop, W, floorTop - parTop, "url(#grain)");
  body += rect(0, parTop - 10, W, 14, P.concreteLight);
  body += rect(0, parTop + 4, W, 5, "#000000", { opacity: 0.08 });

  if (variant === "home") {
    // Stair room on the right
    const sx = W * 0.69;
    const sw = W * 0.17;
    const sTop = parTop - H * 0.2;
    body += rect(sx, sTop, sw, floorTop - sTop + H * 0.02, P.concreteLight);
    body += rect(sx, sTop, sw, floorTop - sTop + H * 0.02, "url(#grain)");
    body += rect(sx - 10, sTop - 12, sw + 20, 16, P.concrete);
    body += rect(sx + sw * 0.3, sTop + H * 0.1, sw * 0.32, floorTop - sTop - H * 0.08, P.navy3);
    body += rect(sx + sw * 0.34, sTop + H * 0.12, sw * 0.24, H * 0.05, "#5C7290", { opacity: 0.6 });
    body += rect(sx + sw * 0.72, sTop + H * 0.06, sw * 0.16, H * 0.05, "#7E93AC");
    // Water tank on top
    body += rect(sx + sw * 0.18, sTop - H * 0.1, sw * 0.42, H * 0.1, "#DCE3EA");
    body += ellipse(sx + sw * 0.39, sTop - H * 0.1, sw * 0.21, H * 0.018, "#EEF2F6");
    body += rect(sx + sw * 0.18, sTop - H * 0.06, sw * 0.42, 4, "#C3CDD7");

    // HVAC unit on the left
    const hx = W * 0.12;
    const hy = floorTop - H * 0.012;
    body += rect(hx, hy - H * 0.085, W * 0.12, H * 0.085, "#D8DDE2");
    body += rect(hx, hy - H * 0.085, W * 0.12, 8, "#C3CAD1");
    body += circle(hx + W * 0.04, hy - H * 0.042, H * 0.03, "#9AA5B1");
    body += circle(hx + W * 0.04, hy - H * 0.042, H * 0.012, "#C3CAD1");
    body += rect(hx + W * 0.08, hy - H * 0.07, W * 0.03, H * 0.05, "#C9D0D7");
  } else {
    // Commercial roof: guard rail, lift machine room, rooftop plant
    for (let x = 0; x < W; x += 60) body += line(x, parTop - 10, x, parTop - 52, "#8C98A5", 3);
    body += line(0, parTop - 52, W, parTop - 52, "#8C98A5", 4) + line(0, parTop - 30, W, parTop - 30, "#8C98A5", 2);
    const mx = W * 0.62;
    body += rect(mx, parTop - H * 0.16, W * 0.26, H * 0.16 + (floorTop - parTop) + 10, P.concreteLight);
    body += rect(mx, parTop - H * 0.16, W * 0.26, H * 0.16 + (floorTop - parTop) + 10, "url(#grain)");
    for (let i = 0; i < 6; i++) body += rect(mx + 20 + i * 44, parTop - H * 0.12, 30, H * 0.09, "#B9C2CB");
    for (const [ux, uw] of [[0.06, 0.16], [0.26, 0.12]]) {
      body += rect(W * ux, floorTop - H * 0.11, W * uw, H * 0.11, "#D8DDE2");
      body += rect(W * ux, floorTop - H * 0.11, W * uw, 8, "#C3CAD1");
      body += circle(W * (ux + uw * 0.3), floorTop - H * 0.055, H * 0.035, "#9AA5B1");
      body += circle(W * (ux + uw * 0.72), floorTop - H * 0.055, H * 0.035, "#9AA5B1");
    }
  }

  // Rainwater outlet at the parapet base
  const ox = W * 0.035;
  const outlet = (coated) =>
    rect(ox, floorTop - 22, 40, 22, "#3B3F44") +
    line(ox + 8, floorTop - 20, ox + 8, floorTop, "#6B7076", 3) +
    line(ox + 20, floorTop - 20, ox + 20, floorTop, "#6B7076", 3) +
    line(ox + 32, floorTop - 20, ox + 32, floorTop, "#6B7076", 3) +
    (coated ? rect(ox - 8, floorTop - 26, 56, 4, P.coatLight) : "");

  const oldFloor = () => {
    let o = rect(0, floorTop, W, H - floorTop, P.oldFloor);
    o += rect(0, floorTop, W, H - floorTop, "url(#grain)");
    o += floorGrid({ W, H, top: floorTop, vp, stroke: P.oldJoint, width: 2.5, opacity: 0.8 });
    for (let i = 0; i < 9; i++) {
      const y = floorTop + 30 + R() * (H - floorTop - 40);
      const k = (y - floorTop) / (H - floorTop);
      o += path(blob(R, R() * W, y, 60 + k * 160, 12 + k * 50), P.stain, { opacity: (0.2 + R() * 0.25).toFixed(2) });
    }
    for (let i = 0; i < 6; i++) {
      const y = floorTop + 50 + R() * (H - floorTop - 80);
      const k = (y - floorTop) / (H - floorTop);
      const x = R() * W;
      const rx = 50 + k * 150;
      const ry = 8 + k * 34;
      o += path(blob(R, x, y, rx, ry, 12, 0.22), P.water, { opacity: 0.85 });
      o += path(blob(R, x - rx * 0.1, y - ry * 0.15, rx * 0.7, ry * 0.55, 10, 0.2), P.waterLight, { opacity: 0.55 });
      o += line(x - rx * 0.4, y - ry * 0.3, x - rx * 0.05, y - ry * 0.45, "#FFFFFF", 3, { opacity: 0.6, "stroke-linecap": "round" });
    }
    for (let i = 0; i < 4; i++) {
      const y = floorTop + 40 + R() * (H - floorTop - 60);
      const x = R() * W;
      o += crack(R, x, y, x + (R() - 0.5) * 320, y + 40 + R() * 120, { color: "#4F483F", width: 3 });
    }
    for (let i = 0; i < 26; i++) {
      o += circle(R() * W, floorTop + 4 + R() * 14, 3 + R() * 5, P.moss, { opacity: 0.75 });
    }
    return o;
  };

  const newFloor = () => {
    let o = rect(0, floorTop, W, H - floorTop, cool ? "#F1F4F7" : P.coat);
    o += rect(0, floorTop, W, H - floorTop, "url(#floorShade)");
    o += rect(0, floorTop, W, H - floorTop, "url(#sheen)");
    // faint roller passes
    for (let i = 0; i < 26; i++) {
      const y = floorTop + (H - floorTop) * Math.pow(R(), 0.8);
      const x = R() * W;
      o += line(x, y, x + 120 + R() * 200, y + (R() - 0.5) * 6, "#FFFFFF", 2 + R() * 3, { opacity: 0.35 });
    }
    // coving + coated upstand
    o += rect(0, floorTop - 26, W, 26, cool ? "#F6F8FA" : P.coatLight);
    o += rect(0, floorTop - 2, W, 6, P.coatEdge, { opacity: 0.6 });
    return o;
  };

  if (state === "before") {
    body += oldFloor() + outlet(false);
    body += rect(0, parTop + 18, W, floorTop - parTop - 18, P.stain, { opacity: 0.14 });
  } else if (state === "after") {
    body += newFloor() + outlet(true);
  } else {
    // progress: left half old, right half coated, diagonal wet edge
    const a = [W * 0.42, floorTop];
    const b = [W * 0.3, H];
    body += oldFloor();
    body += `<clipPath id="newSide"><polygon points="${pts([a, [W, floorTop - 30], [W, H], b])}"/></clipPath>`;
    body += g(newFloor(), { "clip-path": "url(#newSide)" });
    body += polyline([a, b], "#FFFFFF", 4, { opacity: 0.7 });
    body += outlet(false);
  }

  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: bathroom / wet area                                          */
/* ------------------------------------------------------------------ */

function bathroom({ W = 1200, H = 900, state = "after", seed = 2 }) {
  const R = mulberry32(seed);
  const floorY = 600;
  const cornerX = 880;
  const vp = [620, 300];
  const dirty = state === "before";
  const grout = dirty ? "#69736C" : P.groutClean;
  const defs = [
    noise("grain", R, { opacity: 0.06 }),
    linear("glass", [
      [0, "#DDEBF5", 0.5],
      [1, "#B9D2E6", 0.3],
    ], 0, 0, 1, 0),
    linear("wallShade", [
      [0, "#000000", 0.0],
      [1, "#000000", 0.06],
    ]),
    `<clipPath id="back"><rect x="0" y="0" width="${cornerX}" height="${floorY}"/></clipPath>`,
    `<clipPath id="side"><polygon points="${pts([[cornerX, 0], [W, 0], [W, 690], [cornerX, floorY]])}"/></clipPath>`,
    `<clipPath id="floorClip"><polygon points="${pts([[0, floorY], [cornerX, floorY], [W, 690], [W, H], [0, H]])}"/></clipPath>`,
  ].join("");

  const membraneLine = state === "progress" ? floorY - 150 : null;

  // Back wall tiles (60 x 120 landscape)
  let back = rect(0, 0, cornerX, floorY, P.tile);
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 3 === 0) back += rect(c * 120, r * 60, 120, 60, P.tile2);
    }
  }
  for (let y = 60; y < floorY; y += 60) back += line(0, y, cornerX, y, grout, dirty ? 3 : 2);
  for (let x = 120; x < cornerX; x += 120) back += line(x, 0, x, floorY, grout, dirty ? 3 : 2);
  back += rect(0, 0, cornerX, floorY, "url(#grain)");
  // Niche with bottles
  back += rect(540, 270, 140, 90, "#D4DCE3");
  back += rect(540, 270, 140, 10, "#C3CCD4");
  back += rect(560, 302, 18, 56, P.royal, { rx: 3 }) + rect(586, 316, 16, 42, P.amber, { rx: 3 }) + rect(610, 296, 20, 62, "#FFFFFF", { rx: 3 });
  // Shower
  back += rect(760, 120, 9, 330, "#B7C1CB") + rect(758, 120, 13, 6, "#97A3AF");
  back += path("M764,130 Q764,96 720,96 L700,96", "none", { stroke: "#B7C1CB", "stroke-width": 9, "stroke-linecap": "round" });
  back += ellipse(690, 104, 34, 9, "#9DA9B5") + ellipse(690, 101, 34, 7, "#C7D0D8");
  back += circle(764, 430, 16, "#C7D0D8") + rect(764, 426, 30, 8, "#9DA9B5", { rx: 4 });

  // Side wall
  let side = poly([[cornerX, 0], [W, 0], [W, 690], [cornerX, floorY]], P.tile2);
  for (let k = 1; k < 10; k++) {
    const yb = k * 60;
    side += line(cornerX, yb, W, yb + (yb / floorY) * 90, grout, dirty ? 3 : 1.8);
  }
  for (const x of [960, 1060, 1180]) side += line(x, 0, x, floorY + ((x - cornerX) / (W - cornerX)) * 90, grout, dirty ? 3 : 1.8);
  side += poly([[cornerX, 0], [W, 0], [W, 690], [cornerX, floorY]], "url(#wallShade)");

  // Floor
  let floor = poly([[0, floorY], [cornerX, floorY], [W, 690], [W, H], [0, H]], "#DCE2E8");
  floor += floorGrid({ W, H, top: floorY, vp, spacing: 130, rows: 5, stroke: grout, width: dirty ? 3 : 2 });
  floor += rect(0, floorY, W, H - floorY, "url(#grain)");
  // Drain
  floor += poly([[560, 740], [680, 740], [700, 790], [540, 790]], "#9AA6B2");
  for (let i = 0; i < 6; i++) floor += line(566 + i * 22, 746, 560 + i * 26, 784, "#6E7A86", 4);

  let fx = "";
  if (state === "before") {
    // mould along joints, damp patch on side wall, cracked tile, puddle
    for (let i = 0; i < 70; i++) fx += circle(R() * cornerX, floorY - 4 - R() * 40 * R(), 1.5 + R() * 3.5, P.mould, { opacity: (0.35 + R() * 0.5).toFixed(2) });
    fx += g(path(blob(R, 1010, 470, 170, 150, 12, 0.3), "#C4B08B", { opacity: 0.5 }) + path(blob(R, 1000, 500, 120, 100, 10, 0.3), "#A58E64", { opacity: 0.35 }), { "clip-path": "url(#side)" });
    fx += crack(R, 250, 190, 330, 290, { color: "#55605A", width: 2.5, seg: 6, amp: 6, branches: 1 });
    fx += rect(240, 482, 120, 60, "#A9B0AE") + rect(240, 482, 120, 60, "url(#grain)");
    fx += g(path(blob(R, 620, 790, 230, 44, 12, 0.2), P.water, { opacity: 0.75 }) + path(blob(R, 600, 784, 140, 20, 10, 0.2), P.waterLight, { opacity: 0.6 }), { "clip-path": "url(#floorClip)" });
    fx += line(0, floorY, cornerX, floorY, "#2F3631", 5) + line(cornerX, floorY, W, 690, "#2F3631", 5);
    fx += ellipse(706, 140, 4, 7, P.water) + ellipse(700, 190, 3.5, 6, P.water, { opacity: 0.8 });
  } else if (state === "after") {
    fx += line(0, floorY, cornerX, floorY, "#FFFFFF", 6) + line(cornerX, floorY, W, 690, "#FFFFFF", 6);
    fx += line(cornerX, 0, cornerX, floorY, "#FFFFFF", 4, { opacity: 0.8 });
    fx += line(80, floorY + 40, 420, floorY + 40, "#FFFFFF", 3, { opacity: 0.5 });
  } else {
    // progress: tiles removed to membraneLine on walls and across the floor, membrane applied
    fx += rect(0, membraneLine, cornerX, floorY - membraneLine, P.membrane);
    fx += g(poly([[cornerX, membraneLine], [W, membraneLine + 20], [W, 690], [cornerX, floorY]], "#6F889F"), {});
    fx += g(poly([[0, floorY], [cornerX, floorY], [W, 690], [W, H], [0, H]], P.membrane), {});
    fx += rect(0, membraneLine, W, 6, "#8FA6BC");
    fx += line(0, floorY, cornerX, floorY, "#C9D7E4", 18, { opacity: 0.8 }) + line(cornerX, floorY, W, 690, "#C9D7E4", 18, { opacity: 0.8 });
    fx += line(cornerX, membraneLine, cornerX, floorY, "#C9D7E4", 18, { opacity: 0.8 });
    fx += poly([[560, 740], [680, 740], [700, 790], [540, 790]], "#5E6C79") + ellipse(620, 765, 90, 30, "#C9D7E4", { opacity: 0.6 }) + poly([[580, 750], [660, 750], [672, 780], [568, 780]], "#5E6C79");
    fx += g(rect(-6, -70, 12, 70, "#C08A52", { rx: 3 }) + rect(-14, -96, 28, 30, "#4A5563", { rx: 3 }), { transform: "translate(300 868) rotate(-28)" });
    // stacked tiles
    fx += rect(980, 760, 150, 18, "#F2F5F8") + rect(990, 742, 150, 18, "#E6EBEF") + rect(984, 724, 150, 18, "#F2F5F8");
  }

  // Glass partition (in front of everything on the left)
  const glass =
    state === "progress"
      ? ""
      : poly([[470, 30], [470, floorY], [290, 760], [290, -60]], "#D6E6F2", { opacity: 0.32 }) +
        line(470, floorY, 290, 760, "#9AA6B2", 7) +
        line(290, -60, 290, 760, "#FFFFFF", 4, { opacity: 0.85 }) +
        line(470, 30, 470, floorY, "#B8C7D4", 3) +
        line(420, 120, 340, 260, "#FFFFFF", 6, { opacity: 0.45, "stroke-linecap": "round" }) +
        line(440, 160, 372, 280, "#FFFFFF", 3, { opacity: 0.4, "stroke-linecap": "round" });

  const body = g(back, { "clip-path": "url(#back)" }) + side + floor + fx + glass;
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: interior wall (damp, peeling paint, efflorescence)           */
/* ------------------------------------------------------------------ */

function interiorWall({ W = 1200, H = 900, state = "after", seed = 3, meter = false }) {
  const R = mulberry32(seed);
  const skirtY = 700;
  const floorY = 728;
  const defs = [
    noise("grain", R, { opacity: 0.07 }),
    skyDefs("sky", "#BFD1E6", "#E9F0F7"),
    windowPattern,
    linear("light", [
      [0, "#FFFFFF", 0.35],
      [1, "#FFFFFF", 0],
    ], 1, 0, 0, 0),
    linear("dampGrad", [
      [0, P.damp, 0.95],
      [1, "#C8B58F", 0.95],
    ]),
    `<clipPath id="wall"><rect x="120" y="0" width="${W - 120}" height="${skirtY}"/></clipPath>`,
    `<clipPath id="winclip"><rect x="0" y="0" width="254" height="352"/></clipPath>`,
  ].join("");

  let body = rect(0, 0, W, skirtY, P.paint) + rect(0, 0, W, skirtY, "url(#grain)");
  // Left return wall in shade
  body += poly([[0, 0], [120, 0], [120, skirtY], [0, skirtY + 44]], P.paintShade);
  // Window with sky + city
  body += rect(800, 140, 290, 390, "#F7F5F0") + rect(800, 520, 290, 8, "#000000", { opacity: 0.08 });
  body += rect(818, 158, 254, 352, "url(#sky)");
  body += g(skyline(R, 254, 350, 160) , { transform: "translate(818 158)", "clip-path": "url(#winclip)" });
  body += rect(818, 158, 254, 352, "#FFFFFF", { opacity: 0.12 });
  body += rect(941, 158, 8, 352, "#F7F5F0");
  body += rect(786, 526, 318, 16, "#E8E3D9") + rect(786, 540, 318, 6, "#000000", { opacity: 0.07 });
  // Framed print
  body += rect(300, 210, 230, 170, P.navy) + rect(312, 222, 206, 146, "#F4F0E8");
  body += circle(380, 290, 38, P.amber, { opacity: 0.9 }) + rect(410, 260, 80, 80, P.royal, { opacity: 0.85 }) + rect(330, 330, 150, 10, P.navy3);
  // Socket
  body += rect(230, 590, 46, 46, "#F7F5F0", { stroke: "#D8D1C4", "stroke-width": 2, rx: 3 }) + circle(246, 613, 3, "#9A9285") + circle(260, 613, 3, "#9A9285");
  // Skirting + floor
  body += rect(120, skirtY, W - 120, floorY - skirtY, "#D9CFBF") + rect(120, skirtY, W - 120, 4, "#FFFFFF", { opacity: 0.5 });
  body += poly([[0, skirtY + 44], [120, floorY], [W, floorY], [W, H], [0, H]], P.wood);
  for (let i = 0; i < 14; i++) {
    const xb = -400 + i * 150;
    const xt = 600 + ((floorY - 260) / (H - 260)) * (xb - 600);
    body += line(xt, floorY, xb, H, P.woodDark, 2.5, { opacity: 0.8 });
  }
  body += rect(0, floorY, W, H - floorY, "url(#light)");

  let fx = "";
  if (state === "before" || meter) {
    // Rising damp: wettest at the floor, a salty tide mark at the top, tapered ends
    const top = [];
    const x0 = 130;
    const x1 = 780;
    for (let x = x0; x <= x1; x += 26) {
      const t = (x - x0) / (x1 - x0);
      const taper = Math.min(1, Math.sin(Math.PI * t) * 2.6);
      top.push([x, skirtY - (20 + taper * (140 + Math.sin(x / 37) * 14 + R() * 18))]);
    }
    const band = `M${x0 - 30},${skirtY} L${top.map(([x, y]) => `${f(x)},${f(y)}`).join(" L")} L${x1 + 30},${skirtY} Z`;
    fx += g(
      path(band, "url(#dampGrad)") + polyline(top, "#A08A63", 3, { opacity: 0.8 }),
      { "clip-path": "url(#wall)" },
    );
    for (let i = 0; i < 140; i++) {
      const [tx, ty] = top[Math.floor(R() * top.length)];
      fx += circle(tx + (R() - 0.5) * 30, ty + 2 + R() * 26, 0.9 + R() * 2.2, "#FFFFFF", { opacity: (0.5 + R() * 0.5).toFixed(2) });
    }
    if (!meter) {
      for (let i = 0; i < 16; i++) {
        const [tx, ty] = top[2 + Math.floor(R() * (top.length - 4))];
        const cx = tx + (R() - 0.5) * 36;
        const cy = ty + 14 + R() * 70;
        const flake = [];
        const n = 6 + Math.floor(R() * 3);
        for (let k = 0; k < n; k++) {
          const a = (k / n) * Math.PI * 2;
          const r = (6 + R() * 16) * (0.55 + R() * 0.45);
          flake.push([cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r]);
        }
        fx += poly(flake.map(([x, y]) => [x + 2, y + 2]), "#8F8573", { opacity: 0.5 });
        fx += poly(flake, "#CDC4B4");
        fx += polyline(flake.slice(0, Math.ceil(n / 2)), "#FBF8F2", 1.6, { opacity: 0.9 });
      }
      for (let i = 0; i < 90; i++) {
        const a = R() * Math.PI * 2;
        const d = R() * 70;
        fx += circle(170 + Math.cos(a) * d * 1.4, 70 + Math.sin(a) * d * 0.6, 1.2 + R() * 3.8, P.mould, { opacity: (0.3 + R() * 0.6).toFixed(2) });
      }
      fx += crack(R, 800, 530, 690, 640, { color: "#9C9282", width: 2.2, seg: 6, amp: 5, branches: 1 });
      fx += path("M830,546 L846,546 L842,640 L834,640 Z", "#B9A88A", { opacity: 0.5 });
    }
  }
  body += fx;

  if (meter) {
    // Handheld moisture meter with gloved hand
    body += g(
      [
        rect(-70, -120, 140, 230, P.navy, { rx: 18 }),
        rect(-52, -98, 104, 70, "#CFE3F2", { rx: 6 }),
        rect(-40, -82, 22, 40, P.royal, { rx: 2 }),
        rect(-12, -70, 22, 28, P.royal, { rx: 2 }),
        rect(16, -88, 22, 46, P.amber, { rx: 2 }),
        circle(-26, 0, 13, "#2E4565"),
        circle(26, 0, 13, "#2E4565"),
        rect(-30, 36, 60, 12, "#2E4565", { rx: 6 }),
        rect(-48, -150, 10, 34, "#C8CFD6"),
        rect(38, -150, 10, 34, "#C8CFD6"),
      ].join(""),
      { transform: "translate(520 600) rotate(-8)" },
    );
  }
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: exterior facade (cracks, rain streaks)                       */
/* ------------------------------------------------------------------ */

function facade({ W = 1200, H = 900, state = "after", seed = 4, sealant = false }) {
  const R = mulberry32(seed);
  const wallColor = state === "before" ? "#DCD2C1" : "#E9E2D4";
  const defs = [skyDefs(), noise("grain", R, { opacity: 0.09 }), linear("glassF", [[0, "#5E7898"], [1, "#2C4462"]], 0, 0, 1, 1), linear("streak", [[0, "#7E7464", 0.5], [1, "#7E7464", 0]])].join("");
  let body = rect(0, 0, W, 120, "url(#sky)");
  body += rect(0, 96, W, H - 96, wallColor) + rect(0, 96, W, H - 96, "url(#grain)");
  body += rect(0, 86, W, 16, "#D2C9B9");
  const cols = [150, 520, 890];
  const rows = [210, 520];
  let fx = "";
  for (const wy of rows) {
    for (const wx of cols) {
      body += rect(wx - 20, wy - 34, 210, 18, "#CFC5B3") + rect(wx - 20, wy - 16, 210, 6, "#000000", { opacity: 0.09 });
      body += rect(wx, wy, 170, 200, "#F2EEE6") + rect(wx + 10, wy + 10, 150, 180, "url(#glassF)");
      body += line(wx + 85, wy + 10, wx + 85, wy + 190, "#F2EEE6", 6) + line(wx + 10, wy + 100, wx + 160, wy + 100, "#F2EEE6", 6);
      body += path(`M${wx + 20},${wy + 20} L${wx + 60},${wy + 20} L${wx + 20},${wy + 80} Z`, "#FFFFFF", { opacity: 0.18 });
      body += rect(wx - 14, wy + 200, 198, 14, "#D6CCBA") + rect(wx - 14, wy + 214, 198, 5, "#000000", { opacity: 0.09 });
      if (state === "before") {
        for (let s = 0; s < 3; s++) {
          const sx = wx + 10 + R() * 150;
          fx += rect(sx, wy + 219, 10 + R() * 18, 60 + R() * 90, "url(#streak)");
        }
        if (R() > 0.35) fx += crack(R, wx, wy + 200, wx - 70 - R() * 50, wy + 270 + R() * 50, { color: "#7A6F60", width: 2.6, seg: 7, amp: 6, branches: 1 });
        if (R() > 0.5) fx += crack(R, wx + 170, wy, wx + 230 + R() * 40, wy - 70, { color: "#7A6F60", width: 2.2, seg: 6, amp: 5, branches: 0 });
      } else {
        body += line(wx - 14, wy + 219, wx + 184, wy + 219, "#8C8273", 2, { opacity: 0.5 });
      }
    }
  }
  // AC unit + downpipe
  body += rect(560, 760, 150, 96, "#E8EBEE") + circle(610, 808, 34, "#B8C0C8") + circle(610, 808, 12, "#D6DCE1") + rect(660, 772, 38, 72, "#D1D7DC");
  body += rect(1120, 96, 22, H, "#B8BEC5") + rect(1114, 300, 34, 10, "#9AA2AB") + rect(1114, 600, 34, 10, "#9AA2AB");
  body += rect(0, H - 40, W, 40, "#BDB4A4");
  if (state === "before") {
    fx += path(blob(R, 1060, 650, 90, 180, 12, 0.3), "#BFAF92", { opacity: 0.5 });
    fx += path(blob(R, 640, 880, 60, 50, 10, 0.3), "#6E7F5A", { opacity: 0.4 });
    fx += crack(R, 420, 96, 470, 520, { color: "#6F6556", width: 3.4, seg: 14, amp: 8, branches: 2 });
    fx += path(blob(R, 330, 760, 60, 30, 9, 0.4), "#C8BCA8");
  }
  if (sealant) {
    // Close-up: zoom into one window bay, then draw the crack and gun at screen scale
    body = g(body + fx, { transform: "translate(-260 -330) scale(1.9)" });
    const pc = crackPoints(R, 300, -10, 820, 910, 20, 14);
    const half = Math.floor(pc.length * 0.5);
    fx = polyline(pc.slice(half - 1), "#4F473C", 9) + polyline(pc.slice(half - 1), "#7A6F60", 3);
    fx += polyline(pc.slice(0, half), "#F7F7F5", 16) + polyline(pc.slice(0, half), "#DCE1E6", 5);
    const [gx, gy] = pc[half - 1];
    fx += g(
      [
        path("M0,0 L44,-8 L44,8 Z", "#E3E8EC", { stroke: "#B9C3CC", "stroke-width": 1.5 }),
        line(40, -22, 238, -22, "#7D8894", 5),
        line(40, 22, 238, 22, "#7D8894", 5),
        rect(44, -17, 190, 34, "#F6F8FA", { rx: 5, stroke: "#C5CDD5", "stroke-width": 2 }),
        rect(110, -17, 54, 34, P.royal, { opacity: 0.9 }),
        rect(232, -28, 16, 56, P.navy, { rx: 3 }),
        path("M214,22 L232,22 L246,104 L226,108 Z", P.amber),
        path("M240,22 L264,22 L282,126 L254,130 Z", P.navy),
        line(248, 0, 340, 0, "#8E98A3", 6),
        rect(336, -12, 9, 24, "#8E98A3", { rx: 2 }),
      ].join(""),
      { transform: `translate(${f(gx)} ${f(gy)}) rotate(-28) scale(1.15)` },
    );
  }
  body += fx;
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: ceiling corner (leaks from above, thermal camera)            */
/* ------------------------------------------------------------------ */

function ceiling({ W = 1200, H = 900, state = "after", seed = 5, thermal = false }) {
  const R = mulberry32(seed);
  const C = [700, 420];
  const defs = [noise("grain", R, { opacity: 0.05 }), radial("lamp", [[0, "#FFFFFF", 0.9], [1, "#FFFFFF", 0]]), linear("thermalBg", [[0, "#3B1C6B"], [0.5, "#B23A5B"], [1, "#F5A524"]], 0, 0, 1, 1), radial("cold", [[0, "#1B3FA0"], [0.6, "#2C6BC9", 0.9], [1, "#3B1C6B", 0]])].join("");
  let body = poly([[0, 0], [W, 0], [W, 300], C, [0, 330]], "#F2F0EB");
  body += poly([[0, 330], C, [C[0], H], [0, H]], "#E8E1D5");
  body += poly([C, [W, 300], [W, H], [C[0], H]], "#DBD2C3");
  body += rect(0, 0, W, H, "url(#grain)");
  body += polyline([[0, 330], C, [W, 300]], "#FFFFFF", 8, { opacity: 0.6 });
  body += line(C[0], C[1], C[0], H, "#CFC5B4", 3);
  body += ellipse(330, 170, 70, 22, "#FFFFFF") + ellipse(330, 168, 56, 14, "#F5F3EE") + ellipse(330, 190, 200, 90, "url(#lamp)");
  body += rect(140, 470, 220, 160, P.navy, { transform: "skewY(4)" }) + rect(152, 482, 196, 136, "#EFE9DD", { transform: "skewY(4)" });
  body += circle(230, 556, 34, P.amber, { opacity: 0.85 }) + rect(260, 520, 60, 70, P.royal, { opacity: 0.8, transform: "skewY(4)" });
  body += rect(980, 560, 40, 60, "#F5F2EC", { transform: "skewY(-12)", stroke: "#D6CCBC", "stroke-width": 2 });
  if (state === "before" || thermal) {
    const cx = 760;
    const cy = 250;
    body += path(blob(R, cx, cy, 210, 90, 13, 0.25), "#E2D3B4", { opacity: 0.85 });
    body += path(blob(R, cx, cy, 210, 90, 13, 0.25), "none", { stroke: "#B99D6E", "stroke-width": 5, opacity: 0.8 });
    body += path(blob(R, cx + 20, cy + 6, 130, 58, 11, 0.25), "#D3BE93", { opacity: 0.8 });
    body += path(blob(R, cx + 30, cy + 10, 70, 30, 9, 0.25), "#BFA171", { opacity: 0.75 });
    body += path(blob(R, C[0], 560, 40, 150, 9, 0.3), "#CDBD9C", { opacity: 0.55 });
    body += path("M780,300 Q776,318 780,326 Q784,318 780,300 Z", P.water) + ellipse(780, 372, 6, 10, P.water, { opacity: 0.9 });
  }
  if (thermal) {
    body += g(
      [
        rect(-200, -150, 400, 300, P.navy, { rx: 22 }),
        rect(-180, -130, 360, 240, "url(#thermalBg)", { rx: 8 }),
        path(blob(R, 30, -40, 130, 70, 12, 0.3), "url(#cold)"),
        path(blob(R, 20, -40, 70, 34, 10, 0.3), "#0F2A7A", { opacity: 0.7 }),
        line(-10, -40, 50, -40, "#FFFFFF", 3) + line(20, -70, 20, -10, "#FFFFFF", 3),
        circle(20, -40, 18, "none", { stroke: "#FFFFFF", "stroke-width": 3 }),
        rect(-170, 80, 70, 20, "#FFFFFF", { opacity: 0.85, rx: 3 }),
        path("M-40,150 L40,150 L60,330 L-60,330 Z", P.navy2),
        rect(-30, 170, 20, 50, P.amber, { rx: 4 }),
      ].join(""),
      { transform: "translate(860 610) rotate(-6)" },
    );
  }
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: basement / tank / concrete wall                              */
/* ------------------------------------------------------------------ */

function basement({ W = 1200, H = 900, state = "after", seed = 6, variant = "basement" }) {
  const R = mulberry32(seed);
  const wallTop = variant === "tank" ? 0 : 70;
  const floorY = 640;
  const vp = [560, 300];
  const coated = state === "after";
  const defs = [noise("grain", R, { opacity: 0.12 }), linear("streakB", [[0, "#5E5A52", 0.55], [1, "#5E5A52", 0]]), linear("topLight", [[0, "#FFFFFF", 0.35], [1, "#FFFFFF", 0]]), `<clipPath id="wallB"><rect x="0" y="${wallTop}" width="${W}" height="${floorY - wallTop}"/></clipPath>`].join("");

  const wallFill = coated ? (variant === "tank" ? "#C9D6DF" : "#CDD2D6") : "#B4AFA5";
  let body = rect(0, wallTop, W, floorY - wallTop, wallFill) + rect(0, wallTop, W, floorY - wallTop, "url(#grain)");
  if (!coated) {
    for (let x = 200; x < W; x += 200) body += line(x, wallTop, x, floorY, "#9C978D", 2);
    body += line(0, 360, W, 360, "#9C978D", 2);
  }
  const ties = [];
  for (let x = 100; x < W; x += 200) for (const y of [210, 500]) ties.push([x, y]);
  for (const [x, y] of ties) body += circle(x, y, 9, coated ? "#BCC3C9" : "#6F6A61") + (coated ? "" : circle(x, y, 4, "#4F4B45"));

  if (variant === "basement") {
    body += rect(0, 0, W, wallTop, "#8F8A81") + rect(0, wallTop - 6, W, 6, "#77736B");
    body += rect(0, 28, W, 8, "#C7CCD1") + rect(0, 44, W, 6, P.amber, { opacity: 0.85 });
    body += rect(380, wallTop, 260, 12, "#E9EEF2") + rect(380, wallTop + 12, 260, 6, "#FFFFFF") + ellipse(510, wallTop + 70, 220, 60, "url(#topLight)");
  } else {
    body += rect(0, 0, W, 30, "#9E9A92");
    for (let i = 0; i < 6; i++) body += path(`M960,${130 + i * 70} L960,${150 + i * 70} L1030,${150 + i * 70} L1030,${130 + i * 70}`, "none", { stroke: "#7C8590", "stroke-width": 7 });
    body += circle(240, 160, 46, "#8D8F92") + circle(240, 160, 34, "#5E6166");
    body += line(0, 180, W, 180, coated ? "#AEBCC6" : "#8F8A80", 3, { opacity: 0.6 });
  }

  // Column (basements only)
  if (variant === "basement") {
    body += rect(980, wallTop, 110, H - wallTop, coated ? "#D9DDE0" : "#C2BDB3") + rect(1090, wallTop, 30, H - wallTop, coated ? "#C2C8CD" : "#A7A298");
  }

  // Floor
  body += rect(0, floorY, W, H - floorY, coated ? "#B7C1CA" : "#A6A094");
  const shelf = (x) =>
    [360, 470, 580].map((y) => rect(x, y, 230, 10, "#8E98A3")).join("") +
    rect(x, 330, 12, floorY - 320, P.navy3) + rect(x + 218, 330, 12, floorY - 320, P.navy3) +
    rect(x + 20, 318, 70, 42, "#C69C6D") + rect(x + 100, 326, 60, 34, P.royal, { opacity: 0.85 }) +
    rect(x + 30, 426, 90, 44, "#D6B07F") + rect(x + 130, 432, 70, 38, P.amber, { opacity: 0.9 }) +
    rect(x + 24, 536, 120, 44, "#C69C6D") + rect(x + 150, 540, 54, 40, "#9FB1C5");
  body += floorGrid({ W, H, top: floorY, vp, spacing: 300, rows: 3, stroke: coated ? "#A4AFB9" : "#8E887D", width: 2.5 });
  body += rect(0, floorY, W, H - floorY, "url(#grain)");
  if (coated) {
    body += rect(0, floorY - 18, W, 22, variant === "tank" ? "#D6E1E8" : "#DCE0E3");
    body += path(`M0,${floorY + 60} L${W},${floorY + 20} L${W},${floorY + 70} L0,${floorY + 130} Z`, "#FFFFFF", { opacity: 0.18 });
  }

  let fx = "";
  const crackPts = crackPoints(R, 640, wallTop + 40, 560, floorY, 14, 10);
  const shelfLayer = variant === "basement" ? shelf(30) : "";
  if (state === "before") {
    for (const [x, y] of ties) if (R() > 0.25) fx += rect(x - 10 - R() * 6, y, 18 + R() * 16, 80 + R() * 150, "url(#streakB)");
    fx += polyline(crackPts, "#3F3B35", 4);
    for (let i = 3; i < crackPts.length; i += 3) fx += rect(crackPts[i][0] - 10, crackPts[i][1], 22, 120, "url(#streakB)");
    for (let i = 0; i < 160; i++) fx += circle(R() * W, floorY - 6 - R() * 30, 1.2 + R() * 3, "#FFFFFF", { opacity: (0.4 + R() * 0.5).toFixed(2) });
    fx += path(blob(R, 470, 760, 330, 70, 14, 0.25), P.water, { opacity: 0.7 });
    fx += path(blob(R, 450, 752, 200, 34, 10, 0.25), P.waterLight, { opacity: 0.55 });
    fx += ellipse(600, floorY - 70, 5, 9, P.water) + ellipse(598, floorY - 28, 4, 7, P.water);
  } else if (state === "progress") {
    fx += polyline(crackPts, "#3F3B35", 4);
    for (let i = 1; i < crackPts.length - 1; i += 2) {
      const [x, y] = crackPts[i];
      fx += rect(x - 3, y - 18, 6, 18, "#8E98A3") + circle(x, y - 22, 8, P.amber);
    }
    const [hx, hy] = crackPts[5];
    fx += path(`M${hx},${hy - 26} C${hx + 160},${hy - 120} ${hx + 260},${floorY + 40} ${hx + 380},${floorY + 120}`, "none", { stroke: P.navy, "stroke-width": 7 });
    fx += g(rect(-60, -50, 120, 70, P.navy3, { rx: 8 }) + rect(-44, -36, 50, 20, "#9DB0C6", { rx: 3 }) + circle(36, -26, 10, P.amber), { transform: `translate(${hx + 420} ${floorY + 160})` });
    fx += g(rect(0, wallTop, 380, floorY - wallTop, "#CDD2D6") + rect(0, wallTop, 380, floorY - wallTop, "url(#grain)"), { "clip-path": "url(#wallB)" });
    fx += rect(374, wallTop, 8, floorY - wallTop, "#FFFFFF", { opacity: 0.6 });
  } else {
    fx += polyline(crackPts, "#BAC1C7", 5);
  }
  body += fx + shelfLayer;
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: excavation / new construction                                */
/* ------------------------------------------------------------------ */

function excavation({ W = 1200, H = 900, state = "after", seed = 7, crane = false }) {
  const R = mulberry32(seed);
  const defs = [skyDefs(), windowPattern, noise("grain", R, { opacity: 0.12 }), linear("soil", [[0, "#9C7B5B"], [1, "#7C5F45"]])].join("");
  let body = rect(0, 0, W, 380, "url(#sky)") + clouds(R, W, 380, 3);
  if (crane) {
    body += rect(150, 60, 22, 340, P.navy3);
    for (let y = 70; y < 390; y += 26) body += line(150, y, 172, y + 26, "#3B5373", 3);
    body += rect(60, 54, 640, 16, P.amber) + rect(40, 48, 60, 30, P.navy3) + line(161, 30, 161, 60, P.navy3, 6) + line(161, 30, 640, 60, "#5D6B7C", 2) + line(161, 30, 60, 54, "#5D6B7C", 2);
    body += line(520, 70, 520, 200, "#5D6B7C", 2) + rect(500, 200, 40, 26, P.navy3);
  }
  // Building frame under construction
  const bx = 330;
  for (let lvl = 0; lvl < 4; lvl++) {
    const y = 330 - lvl * 70;
    body += rect(bx, y, 560, 14, "#C9C5BD");
    for (let c = 0; c < 5; c++) body += rect(bx + 10 + c * 135, y + 14, 16, 56, "#B9B4AA");
  }
  body += rect(bx + 400, 104, 160, 20, "#C08A52") + rect(bx + 420, 124, 6, 60, "#A57A4A");
  body += rect(bx - 10, 344, 580, 36, "#BFBAB0");
  // Ground + excavation section
  body += rect(0, 380, W, 40, "#8C7A63") + rect(0, 380, W, 8, "#6E8B4E");
  body += rect(0, 420, 120, H - 420, "url(#soil)") + rect(0, 420, 120, H - 420, "url(#grain)");
  body += rect(W - 90, 420, 90, H - 420, "url(#soil)");
  // Retaining wall
  body += rect(120, 420, 60, H - 420, "#B9B4AA") + rect(120, 420, 60, H - 420, "url(#grain)");
  body += rect(180, 420, W - 270, H - 420, "#C9C4BA") + rect(180, 420, W - 270, H - 420, "url(#grain)");
  for (let x = 330; x < W - 90; x += 220) body += line(x, 420, x, H, "#ADA79B", 2);
  for (let y = 560; y < H; y += 150) body += line(180, y, W - 90, y, "#ADA79B", 2);
  if (state !== "before") {
    const until = state === "progress" ? 720 : W - 90;
    body += rect(180, 440, until - 180, H - 500, "#2E3540");
    for (let x = 180; x < until; x += 160) body += line(x, 440, x, H - 60, "#465060", 4);
    body += rect(180, 440, until - 180, 8, "#4C5666");
    if (state === "after") {
      body += rect(180, 640, until - 180, H - 700, "#3F6189", { opacity: 0.92 });
      for (let x = 180; x < until; x += 120) body += line(x, 640, x, H - 60, "#35557A", 3);
    }
    body += rect(180, H - 60, W - 270, 60, "#9C9488");
    body += rect(200, H - 52, until - 200, 26, "#2C4A80", { rx: 13 });
    for (let x = 220; x < until - 20; x += 40) body += circle(x, H - 39, 3.5, "#9DB0C6");
  } else {
    body += rect(180, H - 60, W - 270, 60, "#9C9488");
  }
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: industrial metal roof                                        */
/* ------------------------------------------------------------------ */

function metalRoof({ W = 1200, H = 900, state = "after", seed = 8 }) {
  const R = mulberry32(seed);
  const defs = [skyDefs(), noise("grain", R, { opacity: 0.08 })].join("");
  let body = rect(0, 0, W, 330, "url(#sky)") + clouds(R, W, 300, 3);
  // Distant sheds and trees
  body += poly([[0, 300], [180, 250], [360, 300]], "#A9B6C4") + rect(0, 300, 360, 40, "#B6C2CF");
  body += poly([[760, 290], [980, 240], [1200, 290]], "#A9B6C4") + rect(760, 290, 440, 50, "#B6C2CF");
  for (let i = 0; i < 9; i++) body += circle(380 + i * 44, 300 + R() * 10, 26 + R() * 12, i % 2 ? "#7F9A68" : "#6E8B59");
  const ridge = (x) => 330 - (x / W) * 50;
  const n = 34;
  const edgeX = (i) => -60 + (i / n) * (W + 120);
  const footX = (i) => -360 + (i / n) * (W + 720);
  const coatedFrom = state === "progress" ? 0.52 : state === "after" ? -1 : 2;
  for (let i = 0; i < n; i++) {
    const a = [edgeX(i), ridge(edgeX(i))];
    const b = [edgeX(i + 1), ridge(edgeX(i + 1))];
    const c = [footX(i + 1), H];
    const d = [footX(i), H];
    const isCoated = i / n >= coatedFrom;
    const light = i % 2 === 0;
    const fill = isCoated ? (light ? "#F1F4F6" : "#DCE2E7") : light ? P.metalLight : P.metal;
    body += poly([a, b, c, d], fill);
  }
  body += rect(0, 0, W, H, "url(#grain)", { opacity: 0.6 });
  body += poly([[-60, ridge(-60) - 18], [W + 60, ridge(W + 60) - 18], [W + 60, ridge(W + 60) + 6], [-60, ridge(-60) + 6]], state === "before" ? "#8C949D" : "#E6EAEE");
  // Skylights
  for (const [i0, len] of [[6, 3], [19, 3]]) {
    for (let i = i0; i < i0 + len; i++) {
      const tY = 470;
      const bY = 640;
      const xAt = (ii, y) => edgeX(ii) + ((y - ridge(edgeX(ii))) / (H - ridge(edgeX(ii)))) * (footX(ii) - edgeX(ii));
      body += poly([[xAt(i, tY), tY], [xAt(i + 1, tY), tY], [xAt(i + 1, bY), bY], [xAt(i, bY), bY]], "#DDEAF4", { opacity: 0.9 });
    }
  }
  // Purlin fastener rows
  for (const y of [420, 560, 740]) {
    for (let i = 0; i <= n; i++) {
      const x = edgeX(i) + ((y - ridge(edgeX(i))) / (H - ridge(edgeX(i)))) * (footX(i) - edgeX(i));
      body += circle(x, y, 3.2, state === "after" ? "#FFFFFF" : "#6B737C");
      if (state === "before" && R() > 0.72) {
        body += circle(x, y, 7 + R() * 5, P.rust, { opacity: 0.55 });
        body += rect(x - 1.5, y + 6, 3, 50 + R() * 90, P.rust, { opacity: 0.3 });
      }
    }
  }
  if (state === "before") {
    for (let i = 0; i < 7; i++) body += path(blob(R, R() * W, 400 + R() * 440, 30 + R() * 60, 40 + R() * 70, 12, 0.35), P.rust2, { opacity: 0.28 });
    body += poly([[edgeX(26), ridge(edgeX(26)) + 260], [edgeX(28), ridge(edgeX(28)) + 260], [edgeX(28) + 40, 760], [edgeX(26) + 40, 760]], "#8E9AA6");
  }
  if (state === "progress") {
    const i = Math.floor(n * 0.52);
    body += line(edgeX(i), ridge(edgeX(i)), footX(i), H, "#FFFFFF", 5, { opacity: 0.8 });
  }
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: podium / parking deck                                        */
/* ------------------------------------------------------------------ */

function deck({ W = 1200, H = 900, state = "after", seed = 9 }) {
  const R = mulberry32(seed);
  const top = 380;
  const vp = [600, 250];
  const coated = state === "after";
  const defs = [skyDefs(), windowPattern, noise("grain", R, { opacity: 0.12 }), linear("deckSheen", [[0, "#FFFFFF", 0], [0.5, "#FFFFFF", 0.22], [1, "#FFFFFF", 0]], 0, 0, 1, 1)].join("");
  let body = rect(0, 0, W, top, "url(#sky)") + clouds(R, W, top, 3);
  // Residential towers behind
  for (const [x, w, h, c] of [[40, 220, 300, P.city2], [300, 180, 250, P.city1], [820, 240, 320, P.city2], [1080, 160, 230, P.city3]]) {
    body += rect(x, top - h, w, h, c) + rect(x + 10, top - h + 12, w - 20, h - 20, "url(#win)");
    for (let y = top - h + 40; y < top; y += 52) body += rect(x, y, w, 6, "#FFFFFF", { opacity: 0.35 });
  }
  // Parapet + planters
  body += rect(0, top - 40, W, 40, "#CFC9BE") + rect(0, top - 46, W, 8, "#E2DED6");
  for (let i = 0; i < 6; i++) {
    const x = 60 + i * 200;
    body += rect(x, top - 70, 120, 34, "#9D978B");
    for (let k = 0; k < 4; k++) body += circle(x + 18 + k * 28, top - 76 - R() * 10, 18 + R() * 8, k % 2 ? "#6E8B59" : "#7F9A68");
  }
  // Deck surface
  body += rect(0, top, W, H - top, coated ? "#8D9AAA" : "#A7A39A");
  body += rect(0, top, W, H - top, "url(#grain)");
  if (coated) body += rect(0, top, W, H - top, "url(#deckSheen)");
  const s = (y) => (y - vp[1]) / (H - vp[1]);
  const xAt = (xb, y) => vp[0] + s(y) * (xb - vp[0]);
  const lineColor = coated ? "#FFFFFF" : "#D9D5CC";
  const lineOpacity = coated ? 1 : 0.5;
  const dash = coated ? "none" : "26 18";
  // Aisle edges (converge on the vanishing point) and bay ends
  for (const xb of [330, 870]) body += line(xAt(xb, top), top, xb, H, lineColor, coated ? 6 : 4, { opacity: lineOpacity, "stroke-dasharray": dash });
  for (const xb of [-900, 2100]) body += line(xAt(xb, top), top, xb, H, lineColor, coated ? 5 : 3, { opacity: lineOpacity * 0.8, "stroke-dasharray": dash });
  // Bay separators: perpendicular to the aisle, so they stay horizontal
  for (let k = 1; k <= 6; k++) {
    const y = top + (H - top) * Math.pow(k / 6.4, 1.6);
    const w = coated ? 2 + k * 1.1 : 1.5 + k * 0.8;
    body += line(xAt(-900, y), y, xAt(330, y), y, lineColor, w, { opacity: lineOpacity, "stroke-dasharray": dash });
    body += line(xAt(870, y), y, xAt(2100, y), y, lineColor, w, { opacity: lineOpacity, "stroke-dasharray": dash });
  }
  // Wheel stops near the outer end of a few bays
  for (const [xb, y] of [[-520, 520], [-560, 700], [1720, 520], [1760, 700]]) {
    const x = xAt(xb, y);
    body += rect(x - 46, y - 7, 92, 14, coated ? "#F5A524" : "#B8B2A6", { rx: 3 });
  }
  // Expansion joint
  const jy = 640;
  body += rect(0, jy, W, 16, coated ? "#1F2833" : "#6E685E");
  if (!coated) {
    body += crack(R, 0, jy + 8, W, jy + 8, { color: "#3D3832", width: 3, seg: 24, amp: 4, branches: 4 });
    for (let i = 0; i < 6; i++) body += path(blob(R, R() * W, 450 + R() * 420, 50 + R() * 90, 12 + R() * 30, 10, 0.3), "#5E594F", { opacity: 0.3 });
    body += path(blob(R, 420, jy + 60, 260, 40, 12, 0.25), P.water, { opacity: 0.7 }) + path(blob(R, 410, jy + 56, 160, 18, 10, 0.25), P.waterLight, { opacity: 0.6 });
    for (let i = 0; i < 5; i++) {
      const x = R() * W;
      const y = 420 + R() * 440;
      body += crack(R, x, y, x + (R() - 0.5) * 300, y + 80 + R() * 120, { color: "#5C564D", width: 2.5 });
    }
  } else {
    body += rect(0, jy - 4, W, 4, "#C9D2DC") + rect(0, jy + 16, W, 4, "#C9D2DC");
    body += path(`M560,${H - 40} L600,${H - 120} L640,${H - 40} L616,${H - 40} L616,${H} L584,${H} L584,${H - 40} Z`, "#F5A524", { opacity: 0.95 });
  }
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Scene: commercial kitchen floor                                     */
/* ------------------------------------------------------------------ */

function kitchen({ W = 1200, H = 900, state = "after", seed = 10 }) {
  const R = mulberry32(seed);
  const counterTop = 300;
  const floorY = 600;
  const vp = [600, 260];
  const dirty = state === "before";
  const defs = [noise("grain", R, { opacity: 0.08 }), linear("steel", [[0, "#DDE3E8"], [1, "#AEB8C2"]]), linear("shineK", [[0, "#FFFFFF", 0], [0.5, "#FFFFFF", 0.25], [1, "#FFFFFF", 0]], 0, 0, 1, 1)].join("");
  let body = rect(0, 0, W, counterTop, "#F4F6F7");
  for (let y = 0; y < counterTop; y += 36) {
    const off = (y / 36) % 2 ? 0 : 45;
    body += line(0, y, W, y, "#D5DCE1", 2);
    for (let x = off; x < W; x += 90) body += line(x, y, x, y + 36, "#D5DCE1", 2);
  }
  body += rect(120, 40, 360, 160, "#C3CBD2") + rect(130, 50, 340, 140, "url(#steel)");
  body += rect(0, counterTop, W, 20, "#E8ECEF") + rect(0, counterTop + 20, W, 220, "url(#steel)");
  for (let x = 0; x < W; x += 300) body += rect(x + 10, counterTop + 40, 280, 180, "none", { stroke: "#9AA4AE", "stroke-width": 3 }) + rect(x + 130, counterTop + 120, 40, 8, "#8E98A2", { rx: 4 });
  body += rect(0, counterTop + 240, W, floorY - counterTop - 240, "#5F6873");
  const tileA = "#B87656";
  body += rect(0, floorY, W, H - floorY, tileA);
  body += floorGrid({ W, H, top: floorY, vp, spacing: 120, rows: 6, stroke: dirty ? "#3B302A" : "#E4D8CE", width: dirty ? 5 : 3 });
  body += rect(0, floorY, W, H - floorY, "url(#grain)");
  // Drain channel
  body += poly([[565, floorY], [635, floorY], [700, H], [500, H]], "#9AA4AE");
  for (let y = floorY + 10; y < H; y += 20) {
    const k = (y - floorY) / (H - floorY);
    body += line(565 - k * 65 + 6, y, 635 + k * 65 - 6, y, "#6F7983", 3 + k * 3);
  }
  if (dirty) {
    for (let i = 0; i < 9; i++) body += path(blob(R, R() * W, floorY + 40 + R() * 240, 40 + R() * 80, 10 + R() * 26, 10, 0.35), "#3E2F28", { opacity: 0.35 });
    body += path(blob(R, 600, 780, 300, 60, 13, 0.25), P.water, { opacity: 0.6 }) + path(blob(R, 590, 772, 180, 26, 10, 0.25), P.waterLight, { opacity: 0.55 });
    body += line(0, floorY, W, floorY, "#2C2622", 7);
    body += poly([[220, 700], [330, 700], [340, 760], [210, 760]], "#7A5444");
  } else {
    body += rect(0, floorY - 14, W, 18, "#D9D1C8", { rx: 6 }) + rect(0, floorY, W, H - floorY, "url(#shineK)");
  }
  return doc(W, H, defs, body);
}

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

// Before/after pairs: same seed for both states keeps framing identical.
const pairs = {
  "terrace-home": (state) => terrace({ state, seed: 101 }),
  "bathroom-apartment": (state) => bathroom({ state, seed: 102 }),
  "basement-villa": (state) => basement({ state, seed: 103 }),
  "office-roof": (state) => terrace({ state, seed: 104, cool: true, variant: "commercial" }),
  "warehouse-roof": (state) => metalRoof({ state, seed: 105 }),
  "rising-damp": (state) => interiorWall({ state, seed: 106 }),
  "podium-deck": (state) => deck({ state, seed: 107 }),
  "facade-cracks": (state) => facade({ state, seed: 108 }),
  "ceiling-leak": (state) => ceiling({ state, seed: 109 }),
  "new-build-basement": (state) => excavation({ state, seed: 110 }),
  "kitchen-floor": (state) => kitchen({ state, seed: 111 }),
  "fire-water-tank": (state) => basement({ state, seed: 112, variant: "tank" }),
};

async function save(name, svg) {
  await sharp(Buffer.from(svg), { density: 144 }).resize(1600).webp({ quality: 80, effort: 6 }).toFile(join(OUT, `${name}.webp`));
}

const jobs = [];
for (const [name, make] of Object.entries(pairs)) {
  jobs.push(save(`${name}-before`, make("before")), save(`${name}-after`, make("after")));
}
await Promise.all(jobs);
console.log(`Wrote ${jobs.length} illustrations to ${OUT}`);
