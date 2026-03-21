import { describe, it, expect } from "vitest";
import { calculateGuideNumber, getGuideByNumber, GUIDES } from "../constants/guides-data";
import { getDailyCard, DAILY_CARDS } from "../constants/daily-cards";

describe("calculateGuideNumber", () => {
  it("1972年1月10日 → 21", () => {
    // 1+9+7+2+1+1+0 = 21
    expect(calculateGuideNumber(1972, 1, 10)).toBe(21);
  });

  it("1990年5月15日 → 30", () => {
    // 1+9+9+0+5+1+5 = 30
    expect(calculateGuideNumber(1990, 5, 15)).toBe(30);
  });

  it("2000年12月31日 → 9", () => {
    // 2+0+0+0+1+2+3+1 = 9
    expect(calculateGuideNumber(2000, 12, 31)).toBe(9);
  });

  it("1985年3月8日 → 34", () => {
    // 1+9+8+5+3+8 = 34
    expect(calculateGuideNumber(1985, 3, 8)).toBe(34);
  });
});

describe("getGuideByNumber", () => {
  it("ガイド数4はカストロ（土グループ）", () => {
    const guide = getGuideByNumber(4);
    expect(guide).toBeDefined();
    expect(guide?.name).toBe("カストロ");
    expect(guide?.group).toBe("土");
    expect(guide?.groupEn).toBe("earth");
  });

  it("ガイド数11はディティ（水グループ）", () => {
    const guide = getGuideByNumber(11);
    expect(guide).toBeDefined();
    expect(guide?.name).toBe("ディティ");
    expect(guide?.group).toBe("水");
  });

  it("存在しないガイド数はundefinedを返す", () => {
    expect(getGuideByNumber(999)).toBeUndefined();
    expect(getGuideByNumber(1)).toBeUndefined();
  });

  it("全ガイドにpositiveMessageが存在する", () => {
    GUIDES.forEach((guide) => {
      expect(guide.positiveMessage).toBeTruthy();
      expect(guide.positiveMessage.length).toBeGreaterThan(0);
    });
  });

  it("全ガイドにfeaturesが3つある", () => {
    GUIDES.forEach((guide) => {
      expect(guide.features.length).toBe(3);
    });
  });
});

describe("getDailyCard", () => {
  it("同じ日・同じガイド数は同じカードを返す（決定論的）", () => {
    const date = new Date(2024, 0, 15); // 2024-01-15
    const card1 = getDailyCard(date, 21);
    const card2 = getDailyCard(date, 21);
    expect(card1.id).toBe(card2.id);
  });

  it("異なるガイド数は異なるカードを返す場合がある", () => {
    const date = new Date(2024, 0, 15);
    const card1 = getDailyCard(date, 4);
    const card2 = getDailyCard(date, 55);
    // 必ずしも異なるとは限らないが、少なくとも有効なカードが返る
    expect(DAILY_CARDS.some((c) => c.id === card1.id)).toBe(true);
    expect(DAILY_CARDS.some((c) => c.id === card2.id)).toBe(true);
  });

  it("全カードにポジティブなメッセージが存在する", () => {
    DAILY_CARDS.forEach((card) => {
      expect(card.message).toBeTruthy();
      expect(card.advice).toBeTruthy();
      expect(card.luckyColor).toBeTruthy();
      expect(card.luckyItem).toBeTruthy();
      expect(card.luckyNumber).toBeGreaterThan(0);
    });
  });

  it("カードのidはユニークである", () => {
    const ids = DAILY_CARDS.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("GUIDESデータの整合性", () => {
  it("全ガイドのgroupEnが有効な値である", () => {
    const validGroupEns = ["earth", "wind", "water", "fire"];
    GUIDES.forEach((guide) => {
      expect(validGroupEns).toContain(guide.groupEn);
    });
  });

  it("全ガイドのgroupが有効な値である", () => {
    const validGroups = ["土", "風", "水", "火"];
    GUIDES.forEach((guide) => {
      expect(validGroups).toContain(guide.group);
    });
  });

  it("ガイド数は4以上55以下の範囲内である", () => {
    GUIDES.forEach((guide) => {
      expect(guide.number).toBeGreaterThanOrEqual(4);
      expect(guide.number).toBeLessThanOrEqual(55);
    });
  });
});
