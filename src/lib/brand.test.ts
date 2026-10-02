import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { brandColors, brandColorTokens, waveMark } from "@/config/brand";

const root = process.cwd();
const css = readFileSync(join(root, "src/app/globals.css"), "utf8");

function token(name: string) {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  return match?.[1].toLowerCase();
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "generated" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts") ? [path] : [];
  });
}

describe("brand tokens", () => {
  it("keeps src/config/brand.ts in step with the CSS tokens", () => {
    for (const [key, name] of Object.entries(brandColorTokens)) {
      expect(token(name), name).toBe(brandColors[key as keyof typeof brandColors]);
    }
  });

  it("draws the same wave mark in CSS and in brand.ts", () => {
    expect(css).toContain(`d='${waveMark.back}'`);
    expect(css).toContain(`d='${waveMark.front}'`);
  });

  it("has no colours left from the previous theme", () => {
    expect(css).not.toMatch(/--color-amber-/);
    for (const file of sourceFiles(join(root, "src"))) {
      expect(readFileSync(file, "utf8"), relative(root, file)).not.toMatch(/\bamber-\d/);
    }
  });

  it("keeps colour values out of components (they belong in globals.css or brand.ts)", () => {
    const allowed = new Set(["src/config/brand.ts"]);
    for (const file of sourceFiles(join(root, "src"))) {
      const path = relative(root, file);
      if (allowed.has(path)) continue;
      const source = readFileSync(file, "utf8");
      expect(source, path).not.toMatch(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?!\w)|\brgba?\(|\bhsla?\(|\boklch\(/);
    }
  });
});
