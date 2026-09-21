import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

async function expectResultLayout(page: Page, testInfo: TestInfo, expectGate = false) {
  // 本番CDNでは結果描画後に画像転送が続くため、通信中を破損扱いせずロード完了を待つ。
  await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 15_000 });
  const layout = await page.evaluate(() => {
    const root = document.documentElement;
    const brokenImages = [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src);
    const clipped = [...document.querySelectorAll("img, input, button, a, [role='button']")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const outsideViewport = rect.left < -2 || rect.right > window.innerWidth + 2;
        if (style.display === "none" || style.visibility === "hidden" || rect.width <= 0 || !outsideViewport) return false;

        // ImageBackgroundのcover画像など、表示枠内で意図的にクロップされる装飾画像は除外する。
        let parent = element.parentElement;
        while (parent) {
          const parentRect = parent.getBoundingClientRect();
          const parentStyle = getComputedStyle(parent);
          if (["hidden", "clip"].includes(parentStyle.overflowX) &&
              parentRect.left >= -2 && parentRect.right <= window.innerWidth + 2) return false;
          parent = parent.parentElement;
        }
        return true;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return `${element.tagName}:${element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 30) ?? ""} (${rect.left.toFixed(1)}..${rect.right.toFixed(1)})`;
      });
    return { viewportWidth: window.innerWidth, scrollWidth: root.scrollWidth, brokenImages, clipped };
  });
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.brokenImages, layout.brokenImages.join("\n")).toHaveLength(0);
  expect(layout.clipped, layout.clipped.join("\n")).toHaveLength(0);

  if (expectGate) {
    const gateWidth = await page.locator("#membership-continuation").evaluate((element) => element.getBoundingClientRect().width);
    expect(gateWidth).toBeLessThanOrEqual(layout.viewportWidth);
    if (testInfo.project.name === "desktop-1440") expect(gateWidth).toBeGreaterThanOrEqual(640);
  }
}

async function expectCopyProtected(locator: Locator) {
  await expect(locator).toBeVisible();
  const protectedByAncestor = await locator.evaluate((element) => {
    let current: Element | null = element;
    while (current) {
      const style = getComputedStyle(current);
      if (style.userSelect === "none" || style.webkitUserSelect === "none") return true;
      current = current.parentElement;
    }
    return false;
  });
  expect(protectedByAncestor).toBe(true);
}

test("ログインと新規登録を相互に移動できる", async ({ page }) => {
  await page.goto("./login", { waitUntil: "networkidle" });
  await expect(page.getByText("Googleでログイン")).toHaveCount(0);
  await page.getByText("初めての方は新規登録へ").click();
  await expect(page).toHaveURL(/\/register(?:\?|$)/);
  await expect(page.getByText("むすび島に登録")).toBeVisible();
  await page.getByText("すでにアカウントをお持ちの方はこちら").click();
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});

test("登録メール送信後に正しいメールの案内と再送導線が表示される", async ({ page }) => {
  await page.route("**/auth/v1/otp**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.goto("./register", { waitUntil: "networkidle" });
  await page.getByPlaceholder("mail@example.com").fill("release-test@example.com");
  await page.getByPlaceholder("1990", { exact: true }).fill("1990");
  await page.getByPlaceholder("1", { exact: true }).nth(0).fill("1");
  await page.getByPlaceholder("1", { exact: true }).nth(1).fill("1");
  await page.getByText("登録リンクを送信", { exact: true }).click();
  await expect(page.getByText("メールを送信しました")).toBeVisible();
  await expect(page.getByText(/GitHub Actionsなど、別サービスの通知メールでは登録できません/)).toBeVisible();
  await expect(page.getByText("同じメールアドレスに再送", { exact: true })).toBeVisible();
});

test("ホームの導カードとみ・たま画像が主役サイズで表示される", async ({ page }, testInfo) => {
  await page.goto("./", { waitUntil: "networkidle" });

  for (const { id, aspectRatio } of [
    { id: "#home-shirube-logo", aspectRatio: 1200 / 284 },
    { id: "#home-mitama-logo", aspectRatio: 1434 / 436 },
  ]) {
    const logo = page.locator(id);
    await logo.scrollIntoViewIfNeeded();
    await expect(logo).toBeVisible();
    const size = await logo.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const card = element.parentElement?.getBoundingClientRect();
      return { width: rect.width, height: rect.height, cardWidth: card?.width ?? 0, viewportWidth: window.innerWidth };
    });
    expect(size.width).toBeGreaterThanOrEqual(size.cardWidth * 0.8);
    expect(size.width).toBeLessThanOrEqual(size.viewportWidth);
    expect(size.width / size.height).toBeCloseTo(aspectRatio, 1);
    if (["mobile-390", "desktop-1440"].includes(testInfo.project.name)) {
      await logo.locator("..").screenshot({
        path: `artifacts/release-screenshots/${testInfo.project.name}-${id.slice(1)}-prominent.png`,
      });
    }
  }
});

test("導カードは無料で全文を読める", async ({ page }, testInfo) => {
  await page.goto("./fortune/omikuji", { waitUntil: "networkidle" });
  await page.getByText("今日のカードを引く").click();

  await expect(page.getByText("今日の問い")).toBeVisible();
  await expect(page.getByText("今日の結びアクション")).toBeVisible();
  await expectCopyProtected(page.getByText("今日の問い"));
  await expect(page.getByText("この続きは会員限定です。")).toHaveCount(0);
  await expectResultLayout(page, testInfo);
  await page.screenshot({
    path: `artifacts/release-screenshots/${testInfo.project.name}-omikuji-free-full.png`,
    fullPage: true,
  });
});

test("結び族と歌みくじは無料で全文を読める", async ({ page }, testInfo) => {
  await page.goto("./fortune/musubian", { waitUntil: "networkidle" });
  await page.getByText("鑑定する", { exact: true }).click();
  await expect(page.getByText("結び島からの手紙")).toBeVisible();
  await expectCopyProtected(page.getByText("結び島からの手紙"));
  await expect(page.getByText("この続きは会員限定です。")).toHaveCount(0);
  await expectResultLayout(page, testInfo);

  await page.goto("./fortune/utamikuji", { waitUntil: "networkidle" });
  await expect(page.getByText("歌詞", { exact: true })).toBeVisible();
  await expectCopyProtected(page.getByText("歌詞", { exact: true }));
  await expect(page.getByText("この続きは会員限定です。")).toHaveCount(0);
  await expectResultLayout(page, testInfo);
});

test("み・たまカードは冒頭後に会員限定表示する", async ({ page }, testInfo) => {
  await page.goto("./fortune/mitama", { waitUntil: "networkidle" });
  await page.getByText("カードを引く").click();
  await expect(page.getByText("〈み・たまの導き〉")).toBeVisible();
  await expectCopyProtected(page.getByText("〈み・たまの導き〉"));
  await expect(page.getByText("この続きは会員限定です。")).toBeVisible();
  await expectCopyProtected(page.getByText("この続きは会員限定です。"));
  // レイアウト測定は登場アニメーションが静止した実表示状態で行う。
  await page.waitForTimeout(1200);
  await expectResultLayout(page, testInfo, true);
  await page.getByText("この続きは会員限定です。").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/release-screenshots/${testInfo.project.name}-mitama-paywall.png` });
  await page.getByRole("button", { name: "月額330円で続きを読む" }).click();
  await expect(page).toHaveURL(/\/subscription\/plans(?:\?|$)/);
});

test("今年の運勢は冒頭後に会員限定表示する", async ({ page }, testInfo) => {
  await page.goto("./fortune/life-rhythm", { waitUntil: "networkidle" });
  await page.getByText(/年の運勢を占う/).click();
  await expect(page.getByText("この続きは会員限定です。")).toBeVisible();
  await expectCopyProtected(page.getByText("この続きは会員限定です。"));
  await expectResultLayout(page, testInfo, true);
  await page.getByText("この続きは会員限定です。").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/release-screenshots/${testInfo.project.name}-life-rhythm-paywall.png` });
});

test("ネガティブ神は冒頭後に会員限定表示する", async ({ page }, testInfo) => {
  await page.goto("./fortune/negative-god", { waitUntil: "networkidle" });
  await page.getByText("心の神殿を訪れる").click();
  await page.locator('input[placeholder="1990"]').fill("1990");
  await page.locator('input[placeholder="1"]').nth(0).fill("1");
  await page.locator('input[placeholder="1"]').nth(1).fill("1");
  await page.getByText("神を呼び出す").click();
  await expect(page.getByText("この続きは会員限定です。")).toBeVisible();
  await expectCopyProtected(page.getByText("この続きは会員限定です。"));
  await expectResultLayout(page, testInfo, true);
  await page.getByText("この続きは会員限定です。").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/release-screenshots/${testInfo.project.name}-negative-god-paywall.png` });
});

test("会員プランは有料対象と無料対象を正しく案内する", async ({ page }) => {
  await page.goto("./subscription/plans", { waitUntil: "networkidle" });
  await expect(page.getByText("330", { exact: true })).toBeVisible();
  await expect(page.getByText("み・たまカードの全文")).toBeVisible();
  await expect(page.getByText("今年の運勢の全文")).toBeVisible();
  await expect(page.getByText("ネガティブ神・守護神・対処法の全文")).toBeVisible();
  await expect(page.getByText("導カード・結び族・歌みくじは無料で全文楽しめます")).toBeVisible();
  await expect(page.getByText("カード", { exact: true })).toBeVisible();
  await expect(page.getByText("Apple Pay", { exact: true })).toBeVisible();
  await expect(page.getByText("Google Pay", { exact: true })).toBeVisible();
  await expect(page.getByText("Link", { exact: true })).toBeVisible();
  await expect(page.getByText("ご利用の端末に対応した決済方法が自動で表示されます")).toBeVisible();
  await expect(page.getByText(/980/)).toHaveCount(0);
});

test("会員プランから無料利用へ戻れる", async ({ page }) => {
  await page.goto("./subscription/plans", { waitUntil: "networkidle" });
  await page.getByText("このまま無料で使う").click();
  await expect(page).toHaveURL(/\/musubijima-uranai\/?$/);
});
