import { expect, test } from "@playwright/test";

test("ログインと新規登録を相互に移動できる", async ({ page }) => {
  await page.goto("./login", { waitUntil: "networkidle" });
  await expect(page.getByText("Googleでログイン")).toHaveCount(0);
  await page.getByText("初めての方は新規登録へ").click();
  await expect(page).toHaveURL(/\/register(?:\?|$)/);
  await expect(page.getByText("むすび島に登録")).toBeVisible();
  await page.getByText("すでにアカウントをお持ちの方はこちら").click();
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});

test("導カードの無料結果から330円プランへ進める", async ({ page }, testInfo) => {
  await page.goto("./fortune/omikuji", { waitUntil: "networkidle" });
  await page.getByText("今日のカードを引く").click();

  await expect(page.getByText("この続きは会員限定です")).toBeVisible();
  await expect(page.getByText("月額330円ですべて読む")).toBeVisible();
  await page.screenshot({
    path: `artifacts/release-screenshots/${testInfo.project.name}-omikuji-paywall.png`,
    fullPage: true,
  });

  await page.getByText("月額330円ですべて読む").click();
  await expect(page).toHaveURL(/\/subscription\/plans(?:\?|$)/);
  await expect(page.getByText("月額")).toBeVisible();
  await expect(page.getByText("330", { exact: true })).toBeVisible();
  await expect(page.getByText(/980/)).toHaveCount(0);
});

test("会員プランから無料利用へ戻れる", async ({ page }) => {
  await page.goto("./subscription/plans", { waitUntil: "networkidle" });
  await page.getByText("このまま無料で使う").click();
  await expect(page).toHaveURL(/\/musubijima-uranai\/?$/);
});
