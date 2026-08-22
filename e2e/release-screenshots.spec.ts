import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const routes = [
  ["home", "./"],
  ["login", "./login"],
  ["register", "./register"],
  ["guide", "./guide"],
  ["subscription-plans", "./subscription/plans"],
  ["omikuji", "./fortune/omikuji"],
  ["mitama", "./fortune/mitama"],
  ["musubian", "./fortune/musubian"],
  ["utamikuji", "./fortune/utamikuji"],
  ["life-rhythm", "./fortune/life-rhythm"],
  ["negative-god", "./fortune/negative-god"],
] as const;

test.beforeAll(() => mkdirSync("artifacts/release-screenshots", { recursive: true }));

for (const [name, route] of routes) {
  test(`${name} の目視確認画像`, async ({ page }, testInfo) => {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(400);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/release-screenshots/${testInfo.project.name}-${name}.png`,
      fullPage: true,
    });
  });
}
