/**
 * むすび島 デザイントークン — スペーシング（8ptグリッド）
 * 全ての余白はこのスケールから参照する。
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 40,
} as const;

export type SpacingToken = keyof typeof Spacing;
