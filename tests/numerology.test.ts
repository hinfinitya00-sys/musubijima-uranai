import { describe, it, expect } from 'vitest';
import { calculateLifePathNumber, getCharacterIdByLifePath, getNineYearCycle } from '../lib/numerology';

describe('calculateLifePathNumber', () => {
  it('1990年1月1日のライフパス数を正しく計算する', () => {
    // 1+9+9+0+1+1 = 21 → 2+1 = 3
    const result = calculateLifePathNumber(new Date(1990, 0, 1));
    expect(result).toBe(3);
  });

  it('1985年12月25日のライフパス数を正しく計算する', () => {
    // 1+9+8+5+1+2+2+5 = 33 → マスターナンバーとして保持
    const result = calculateLifePathNumber(new Date(1985, 11, 25));
    expect(result).toBe(33);
  });

  it('マスターナンバー11を正しく処理する', () => {
    // 2009年9月1日: 2+0+0+9+9+1 = 21 → 2+1 = 3 (not 11)
    // 1992年2月9日: 1+9+9+2+2+9 = 32 → 3+2 = 5
    // 2000年5月3日: 2+0+0+0+5+3 = 10 → 1+0 = 1
    // 1978年8月8日: 1+9+7+8+8+8 = 41 → 4+1 = 5
    // 2018年1月1日: 2+0+1+8+1+1 = 13 → 1+3 = 4
    // 1991年11月9日: 1+9+9+1+1+1+9 = 31 → 3+1 = 4
    // 11: 例えば 2000年2月9日: 2+0+0+0+2+9 = 13 → 1+3 = 4... nope
    // 1990年9月9日: 1+9+9+0+9+9 = 37 → 3+7 = 10 → 1+0 = 1
    // Let's find a date that gives 11:
    // 1989年9月2日: 1+9+8+9+9+2 = 38 → 3+8 = 11 → マスターナンバー
    const result = calculateLifePathNumber(new Date(1989, 8, 2));
    expect(result).toBe(11);
  });

  it('マスターナンバー22を正しく処理する', () => {
    // 1979年4月8日: 1+9+7+9+4+8 = 38 → 3+8 = 11 (nope, that's 11)
    // 1988年8月8日: 1+9+8+8+8+8 = 42 → 4+2 = 6
    // 1993年8月5日: 1+9+9+3+8+5 = 35 → 3+5 = 8
    // We need sum that reduces to 22: digits that sum to 22 or 31 or 40
    // 1975年9月8日: 1+9+7+5+9+8 = 39 → 3+9 = 12 → 1+2 = 3
    // 1977年9月9日: 1+9+7+7+9+9 = 42 → 4+2 = 6
    // Need first sum = 22, 31, or 40
    // 1978年9月5日: 1+9+7+8+9+5 = 39 → 12 → 3
    // 1994年9月5日: 1+9+9+4+9+5 = 37 → 10 → 1
    // 22直接: 1985年9月9日: 1+9+8+5+9+9 = 41 → 4+1 = 5
    // 合計が40: 1989年12月9日: 1+9+8+9+1+2+9 = 39.. nope
    // 合計が31: 1994年12月5日: 1+9+9+4+1+2+5 = 31 → 3+1 = 4 (not master)
    // Wait - reduceToSingleDigit: if sum is 22, return 22.
    // First sum of digits needs to be 22
    // 1999年1月4日: 1+9+9+9+1+4 = 33 → マスターナンバー33
    // 1999年4月1日: 1+9+9+9+4+1 = 33 → 33 too
    // 1999年9月4日: 1+9+9+9+9+4 = 41 → 5
    // For 22: need digit sum = 22
    // 1993年9月9日: 1+9+9+3+9+9 = 40 → 4+0 = 4
    // 1996年9月6日: 1+9+9+6+9+6 = 40 → 4
    // 1995年9月8日: 1+9+9+5+9+8 = 41 → 5
    // 1994年9月9日: 1+9+9+4+9+9 = 41 → 5
    // 直接22になるもの: 桁合計が22
    // 8桁で合計22: 例えば 1993年3月9日: 1+9+9+3+3+9 = 34 → 3+4 = 7
    // 1987年8月6日: 1+9+8+7+8+6 = 39 → 12 → 3
    // 1984年9月9日: 1+9+8+4+9+9 = 40 → 4
    // 6桁合計22: 最大 9+9+9+9+9+9 = 54 だから可能
    // 合計22: 1975年8月9日: 1+9+7+5+8+9 = 39 → 12 → 3
    // 2003年9月1日: 2+0+0+3+9+1 = 15 → 1+5 = 6
    // OK let me just pick one that results in an intermediate 22:
    // 合計が 22 directly: digits sum needs to be 22 on first pass
    // 1588: too old. Let's try 1993年12月7日: 1+9+9+3+1+2+7 = 32 → 3+2 = 5
    // 2003年12月8日: 2+0+0+3+1+2+8 = 16 → 7
    // 合計 = 22: 1979年8月5日: 1+9+7+9+8+5 = 39... nope
    // Just verify a known 22 case from numerology:
    // 22/4: someone born 2002年2月9日: 2+0+0+2+2+9 = 15 → 6
    // Try: 1998年9月5日: 1+9+9+8+9+5 = 41 → 5
    // Hmm, let's compute differently. Standard numerology usually sums each part:
    // Our algorithm sums ALL digits at once.
    // 合計=31 → 3+1=4 (not 22 because we only keep 11,22,33 at step results)
    // So 22 only happens if first sum = 22.
    // Need 6-7 single digits that sum to 22:
    // 1975年9月9日: 1+9+7+5+9+9 = 40 → 4
    // 6 digits summing to 22: many ways...
    // 1994年8月1日: 1+9+9+4+8+1 = 32 → 5
    // 1859年9月3日: too old
    // 1967年8月6日: 1+9+6+7+8+6 = 37 → 10 → 1
    // 1958年9月5日: 1+9+5+8+9+5 = 37 → 10 → 1
    // Simple approach: digits summing to 22
    // 4+9+9+0+0+0 = 22 → year 4900? No.
    // 9+9+4+0+0+0 = 22 → 9400? No.
    // 6+7+9+0+0+0 = 22 → unrealistic
    // Realistic: 1+9+6+3+2+1 = 22 → 1963年2月1日??
    // Wait: digits of 19630201: 1,9,6,3,0,2,0,1 → sum = 22!
    // But month is 02, day is 01 → Date(1963, 1, 1)
    // Actually our format is `${year}${month}${day}` = "196321" → 1,9,6,3,2,1 = 22!
    const result = calculateLifePathNumber(new Date(1963, 1, 1));
    expect(result).toBe(22);
  });

  it('マスターナンバー33を正しく処理する', () => {
    // 1999年1月4日: "199914" → 1+9+9+9+1+4 = 33
    const result = calculateLifePathNumber(new Date(1999, 0, 4));
    expect(result).toBe(33);
  });

  it('通常の数値（1-9）を正しく返す', () => {
    // 2000年1月1日: "200011" → 2+0+0+0+1+1 = 4
    const result = calculateLifePathNumber(new Date(2000, 0, 1));
    expect(result).toBe(4);
  });
});

describe('getCharacterIdByLifePath', () => {
  it('ライフパス数1にキャラID 1を返す', () => {
    expect(getCharacterIdByLifePath(1)).toBe(1);
  });

  it('マスターナンバー11にキャラID 11を返す', () => {
    expect(getCharacterIdByLifePath(11)).toBe(11);
  });

  it('未定義の数値にはデフォルト1を返す', () => {
    expect(getCharacterIdByLifePath(99)).toBe(1);
  });
});

describe('getNineYearCycle', () => {
  it('9年サイクルの年を正しく計算する', () => {
    const birthDate = new Date(1990, 0, 1);
    const result = getNineYearCycle(birthDate, 2026);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(9);
  });
});
