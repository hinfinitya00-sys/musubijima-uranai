/**
 * 数秘術計算ロジック（コア）
 * むすび島サブスクアプリの中心機能
 */

/**
 * 数値を1桁になるまで各桁の合計を繰り返す
 * マスターナンバー（11, 22, 33）は保持する
 */
function reduceToSingleDigit(n: number): number {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
  const sum = [...`${n}`].reduce((acc, d) => acc + parseInt(d), 0);
  return reduceToSingleDigit(sum);
}

/**
 * 数値を1桁（1〜9）になるまで各桁の合計を繰り返す
 * マスターナンバーは保持しない（今年の運勢は1〜9のみのため）
 */
function reduceToOneToNine(n: number): number {
  while (n > 9) {
    n = [...`${n}`].reduce((acc, d) => acc + parseInt(d), 0);
  }
  return n;
}

/**
 * むすび族番号を計算する
 * 生年月日の全桁合計を還元せずにそのまま返す（4〜48）
 * 例: 1994/01/28 → 1+9+9+4+1+2+8 = 34（チェロ・風）
 */
export function calculateMusubiNumber(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const sum = [...`${year}${month}${day}`]
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  return sum; // 還元しない
}

/**
 * 今年の運勢番号を計算する
 * 今年の年＋生まれた月日の全桁合計を1桁（1〜9）に還元する
 * 例: 2026年 + 01/28 → 2+0+2+6+1+2+8 = 21 → 2+1 = 3
 */
export function calculateThisYearNumber(birthDate: Date): number {
  const currentYear = new Date().getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const sum = [...`${currentYear}${month}${day}`]
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceToOneToNine(sum); // 1〜9に還元
}

/**
 * ライフパス数を計算する
 * 生年月日の全桁を1桁になるまで足す
 * マスターナンバー（11, 22, 33）は保持する
 */
export function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  const sum = [...`${year}${month}${day}`]
    .reduce((acc, digit) => acc + parseInt(digit), 0);

  return reduceToSingleDigit(sum);
}

/**
 * ライフパス数からむすび族キャラIDを返す
 */
export function getCharacterIdByLifePath(lifePathNum: number): number {
  const mapping: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    11: 11,
    22: 22,
    33: 33,
  };
  return mapping[lifePathNum] ?? 1;
}

/**
 * 9年サイクルの現在の年を計算する
 */
export function getNineYearCycle(birthDate: Date, targetYear: number): number {
  const lifePathNum = calculateLifePathNumber(birthDate);
  const cycleYear = (targetYear - birthDate.getFullYear()) % 9;
  return ((lifePathNum + cycleYear - 1) % 9) + 1;
}
