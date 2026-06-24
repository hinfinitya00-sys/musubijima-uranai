/**
 * むすび島 デザイントークン — カラーパレット
 * 全ての色指定はこの定義から参照する（インラインhex禁止）。
 */
export const Colors = {
  bg: '#FFFAF9',
  surface: '#FFFFFF',
  primary: '#E8758A',
  primaryLight: '#F9C0CC',
  primaryDark: '#C45070',
  accent: '#C9A84C',
  ink: '#3D1A1A',
  muted: '#7A6A6A',
  border: '#F5C0CC',
  sectionPink: '#FFF0F3',
  sectionCream: '#FFF8F0',
} as const;

export type ColorToken = keyof typeof Colors;
