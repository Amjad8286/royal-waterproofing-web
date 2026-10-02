import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brandColors, waveMark } from "@/config/brand";
import { cta, site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

async function fonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [bold, medium] = await Promise.all([
    readFile(join(dir, "BarlowSemiCondensed-Bold.ttf")),
    readFile(join(dir, "BarlowSemiCondensed-Medium.ttf")),
  ]);
  return [
    { name: "Barlow", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Barlow", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}

/** The reversed logo (for the navy card) as a data URI. */
async function logo() {
  const svg = await readFile(join(process.cwd(), "public/images/brand/royal-waterproofing-logo-reversed.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

/** Branded share card used by every opengraph-image route: the reversed logo on navy, like the footer. */
export async function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const [logoSrc, fontData] = await Promise.all([logo(), fonts()]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brandColors.navy900,
          padding: "64px 72px",
          fontFamily: "Barlow",
          color: brandColors.white,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by ImageResponse, not a page image */}
        <img src={logoSrc} width={209} height={100} alt={site.name} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: brandColors.wave300, fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
            <svg width={64} height={24} viewBox={waveMark.viewBox}>
              <path d={waveMark.back} fill={brandColors.wave300} />
              <path d={waveMark.front} fill={brandColors.wave500} />
            </svg>
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ marginTop: 22, fontSize: 76, fontWeight: 700, lineHeight: 1.02, maxWidth: 980 }}>{title}</div>
          {subtitle ? (
            <div style={{ marginTop: 22, fontSize: 30, fontWeight: 500, color: brandColors.white, opacity: 0.75, maxWidth: 900 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 26, fontWeight: 500, color: brandColors.white, opacity: 0.75 }}>
            {site.contact.phone.display} · {site.contact.address.locality}, {site.contact.address.city}
          </span>
          <span
            style={{
              background: brandColors.wave600,
              color: brandColors.white,
              fontSize: 26,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 6,
            }}
          >
            {cta.primary}
          </span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fontData },
  );
}
