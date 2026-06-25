import { supabase } from './supabase';

/** CMS テーブルのテキスト列を表す行。編集対象は text 列のため string | null。 */
export type CmsRow = Record<string, string | null>;

/**
 * Supabase の CMS テーブルからレコードを取得し、ベース配列（constants 等のローカルデータ）へ
 * `number` で紐づけて、編集可能なテキスト列のみを上書き（オーバーレイ）する。
 *
 * - 取得失敗・空・例外時はベース配列をそのまま返す（安全網 = フォールバック）。
 * - 画像（require モジュール）など DB に存在しない／型の異なるフィールドはベースの値を保持する。
 *
 * @param table   Supabase テーブル名
 * @param base    ローカルのベース配列（フォールバック兼ベーススキーマ）
 * @param baseKey ベース要素から number を取り出す関数
 * @param apply   ベース要素と DB 行から、上書き後の要素を返す関数
 */
export async function fetchOverlay<T>(
  table: string,
  base: readonly T[],
  baseKey: (item: T) => number,
  apply: (item: T, row: CmsRow) => T,
): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error || !data || data.length === 0) return base.slice();
    const rows = data as Array<Record<string, string | number | null>>;
    const byNumber = new Map<number, CmsRow>();
    for (const row of rows) {
      byNumber.set(Number(row.number), row as CmsRow);
    }
    return base.map((item) => {
      const row = byNumber.get(baseKey(item));
      return row ? apply(item, row) : item;
    });
  } catch {
    return base.slice();
  }
}
