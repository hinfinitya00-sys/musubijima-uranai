import { defineConfig } from "@playwright/test";

const baseURL = `${
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4174/musubijima-uranai"
}`.replace(/\/?$/, "/");

export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results/release-visual-audit",
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    browserName: "chromium",
    colorScheme: "light",
    locale: "ja-JP",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile-320", use: { viewport: { width: 320, height: 568 } } },
    { name: "mobile-390", use: { viewport: { width: 390, height: 844 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "desktop-200pct-equivalent",
      use: { viewport: { width: 720, height: 450 } },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "PORT=4174 pnpm preview:web",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
