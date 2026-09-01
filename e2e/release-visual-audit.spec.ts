import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/login",
  "/register",
  "/guide",
  "/history",
  "/settings",
  "/character",
  "/onboarding",
  "/card-reading",
  "/subscription",
  "/subscription/plans",
  "/subscription/success",
  "/profile",
  "/hajimete",
  "/legal/tokutei",
  "/oauth/callback",
  "/fortune/omikuji",
  "/fortune/mitama",
  "/fortune/musubian",
  "/fortune/utamikuji",
  "/fortune/life-rhythm",
  "/fortune/negative-god",
] as const;

const mojibakePatterns = ["�", "縺", "繧", "譁", "蜿", "鬥", "莠"];
const forbiddenCopy = ["980円", "月額980", "¥980", "￥980"];

for (const route of routes) {
  test(`${route} の表示品質`, async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const relativeRoute = route === "/" ? "./" : `.${route}`;
    let response;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        response = await page.goto(relativeRoute, {
          waitUntil: "commit",
          timeout: 20_000,
        });
        break;
      } catch (error) {
        if (attempt === 1) throw error;
      }
    }
    await page.waitForFunction(
      () => document.body?.innerText.trim().length > 0,
      undefined,
      { timeout: 15_000 },
    );
    // Google Fontsなど外部通信が長時間networkidleを妨げても、本文監査を止めない。
    // フォント自体はFontFaceSetのloaded状態で別途検証する。
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
    await page
      .waitForFunction(() => document.fonts.status === "loaded", undefined, { timeout: 15_000 })
      .catch(() => {});

    expect.soft(response?.status(), "HTTP応答").toBeLessThan(400);

    const result = await page.evaluate(
      ({ mojibakePatterns, forbiddenCopy }) => {
        const root = document.documentElement;
        const bodyText = document.body.innerText;
        const visible = (element: Element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) > 0 &&
            rect.width > 0 &&
            rect.height > 0
          );
        };

        const clipped: string[] = [];
        for (const element of document.querySelectorAll(
          "img, input, button, a, [role='button']",
        )) {
          if (!visible(element)) continue;
          const rect = element.getBoundingClientRect();
          if (rect.left < -2 || rect.right > window.innerWidth + 2) {
            clipped.push(
              `${element.tagName.toLowerCase()}:${(element.textContent ?? "").trim().slice(0, 40)}`,
            );
          }
        }

        const brokenImages = [...document.images]
          .filter(
            (image) =>
              visible(image) &&
              (!image.complete ||
                image.naturalWidth === 0 ||
                image.naturalHeight === 0),
          )
          .map((image) => image.currentSrc || image.src);

        const oversizedImages = [...document.images]
          .filter((image) => {
            if (!visible(image)) return false;
            const rect = image.getBoundingClientRect();
            return (
              rect.width > window.innerWidth + 2 ||
              rect.height > window.innerHeight * 3
            );
          })
          .map((image) => image.currentSrc || image.src);

        const textNodes = [...document.querySelectorAll("body *")].filter(
          (element) =>
            visible(element) && (element.textContent ?? "").trim().length > 0,
        );
        const fontFamilies = [
          ...new Set(
            textNodes
              .slice(0, 100)
              .map((element) => getComputedStyle(element).fontFamily),
          ),
        ];

        const fonts = { status: document.fonts.status };

        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          scrollWidth: root.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          clipped,
          brokenImages,
          oversizedImages,
          mojibake: mojibakePatterns.filter((pattern) =>
            bodyText.includes(pattern),
          ),
          forbiddenCopy: forbiddenCopy.filter((copy) =>
            bodyText.includes(copy),
          ),
          fontFamilies,
          fonts,
          bodyLength: bodyText.trim().length,
        };
      },
      { mojibakePatterns, forbiddenCopy },
    );

    await testInfo.attach("audit.json", {
      body: JSON.stringify(
        {
          route,
          project: testInfo.project.name,
          result,
          consoleErrors,
          pageErrors,
        },
        null,
        2,
      ),
      contentType: "application/json",
    });

    expect.soft(result.bodyLength, "空画面でないこと").toBeGreaterThan(0);
    expect
      .soft(result.scrollWidth, "横スクロールがないこと")
      .toBeLessThanOrEqual(result.viewport.width + 1);
    expect
      .soft(result.bodyWidth, "bodyの横はみ出しがないこと")
      .toBeLessThanOrEqual(result.viewport.width + 1);
    expect
      .soft(result.clipped, "操作要素・画像が左右に切れていないこと")
      .toEqual([]);
    expect.soft(result.brokenImages, "表示画像が読み込めること").toEqual([]);
    expect
      .soft(result.oversizedImages, "異常に巨大な画像がないこと")
      .toEqual([]);
    expect.soft(result.mojibake, "文字化けがないこと").toEqual([]);
    expect.soft(result.forbiddenCopy, "旧価格がないこと").toEqual([]);
    expect.soft(result.fonts.status, "Webフォント読み込み完了").toBe("loaded");
    // unicode-range分割フォントへのFontFaceSet.check()は未使用subsetをfalseにする
    // ブラウザ差があるため、実際の表示要素に指定されたcomputed styleを検証する。
    if (route === "/") {
      expect
        .soft(result.fontFamilies.some((font) => font.includes("Noto Sans JP")), "Noto Sans JP指定")
        .toBe(true);
      expect
        .soft(result.fontFamilies.some((font) => font.includes("Noto Serif JP")), "Noto Serif JP指定")
        .toBe(true);
    }
    expect.soft(pageErrors, "ページ例外がないこと").toEqual([]);
    expect.soft(consoleErrors, "コンソールエラーがないこと").toEqual([]);
  });
}
