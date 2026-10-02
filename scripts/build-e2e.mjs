#!/usr/bin/env node
/**
 * Builds the two copies of the site the e2e suite runs against:
 *   .next          the live site (sample content hidden)
 *   .next-preview  preview mode (NEXT_PUBLIC_PREVIEW_SAMPLES=true), to exercise
 *                  the sections that only appear once real projects, reviews
 *                  and photos exist — filters, before/after slider, lightbox.
 *
 * `next build` points tsconfig.json and next-env.d.ts at its output folder,
 * so they're restored after the preview build.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const tracked = ["tsconfig.json", "next-env.d.ts"];
const saved = Object.fromEntries(tracked.map((file) => [file, readFileSync(file, "utf8")]));

try {
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_PREVIEW_SAMPLES: "true", NEXT_DIST_DIR: ".next-preview" },
  });
} finally {
  for (const [file, content] of Object.entries(saved)) writeFileSync(file, content);
}

execSync("npx next build", {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_PREVIEW_SAMPLES: "false", NEXT_DIST_DIR: "" },
});
