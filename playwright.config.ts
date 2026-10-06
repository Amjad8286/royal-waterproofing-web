import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3200);
const PREVIEW_PORT = PORT + 1;

const desktop = { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } };
const phone = devices["Pixel 7"];

/**
 * End-to-end tests run against production builds (`npm run test:e2e` builds first):
 * - the live site, where sample content is hidden (e2e/*.spec.ts), and
 * - a preview build with sample content shown (e2e/preview/*.spec.ts), to exercise
 *   the sections that appear once real projects, reviews and photos exist.
 * LEAD_TEST_HOOKS lets a submission named "Test Error" exercise the form's error path.
 * LEADS_API_URL is emptied so enquiries are simulated, even when a local .env points at a lead API.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", testIgnore: /preview\//, use: { ...desktop, baseURL: `http://localhost:${PORT}` } },
    { name: "mobile", testIgnore: /preview\//, use: { ...phone, baseURL: `http://localhost:${PORT}` } },
    { name: "preview-desktop", testMatch: /preview\/.*\.spec\.ts/, use: { ...desktop, baseURL: `http://localhost:${PREVIEW_PORT}` } },
    { name: "preview-mobile", testMatch: /preview\/.*\.spec\.ts/, use: { ...phone, baseURL: `http://localhost:${PREVIEW_PORT}` } },
  ],
  webServer: [
    {
      command: `npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      env: { LEAD_TEST_HOOKS: "true", LEADS_API_URL: "" },
      timeout: 120_000,
    },
    {
      command: `npx next start -p ${PREVIEW_PORT}`,
      url: `http://localhost:${PREVIEW_PORT}`,
      reuseExistingServer: !process.env.CI,
      env: { LEAD_TEST_HOOKS: "true", LEADS_API_URL: "", NEXT_DIST_DIR: ".next-preview" },
      timeout: 120_000,
    },
  ],
});
