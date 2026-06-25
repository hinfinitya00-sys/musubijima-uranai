/**
 * むすび島 デザイントークン — タイポグラフィ
 * 見出し: Noto Serif JP / 本文: Noto Sans JP
 * フォントは app/_layout.tsx の useFonts でロードする。
 *
 * モバイル可読性のため全体を一回り拡大（本文16px以上 / 見出し20px以上）。
 */
import type { ViewStyle } from 'react-native';

export const Fonts = {
  serifBold: 'NotoSerifJP_700Bold',
  serifMedium: 'NotoSerifJP_500Medium',
  sansRegular: 'NotoSansJP_400Regular',
  sansMedium: 'NotoSansJP_500Medium',
  sansLight: 'NotoSansJP_300Light',
} as const;

export const Typography = {
  // 見出し：Noto Serif JP
  h1: { fontFamily: Fonts.serifBold, fontSize: 32, lineHeight: 48 },
  h2: { fontFamily: Fonts.serifBold, fontSize: 26, lineHeight: 39 },
  h3: { fontFamily: Fonts.serifMedium, fontSize: 22, lineHeight: 33 },
  // 本文：Noto Sans JP
  body: { fontFamily: Fonts.sansRegular, fontSize: 16, lineHeight: 28 },
  bodyLg: { fontFamily: Fonts.sansRegular, fontSize: 18, lineHeight: 30 },
  caption: { fontFamily: Fonts.sansRegular, fontSize: 15, lineHeight: 23 },
  label: { fontFamily: Fonts.sansMedium, fontSize: 16, lineHeight: 26 },
  // ブランド表記
  brand: { fontFamily: Fonts.serifBold, fontSize: 28, letterSpacing: 2 },
  brandSub: { fontFamily: Fonts.sansLight, fontSize: 13, letterSpacing: 4 },
} as const;

export type TypographyToken = keyof typeof Typography;

/**
 * コピー（テキスト選択）禁止スタイル。
 * - Web: user-select:none（親に適用すると配下テキスト全体に継承される）
 * - iOS Safari: -webkit-touch-callout / -webkit-user-select で長押しメニューも抑止
 * - iOS/Android ネイティブ: <Text> は selectable 未指定なら既定で選択不可
 * RN の型に userSelect が無いため ViewStyle へキャストして一括適用できる形にする。
 *
 * 使い方: 各画面のルート要素へ  style={[styles.container, noCopy]}
 */
export const noCopy = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
} as unknown as ViewStyle;

/**
 * ネイティブでの長押し選択をさらに抑止したい個別テキスト向けの props。
 * （スクロール領域のルートに付けるとスクロールを奪うため、葉テキストにのみ使用）
 */
export const noCopyProps = {
  selectable: false,
  onStartShouldSetResponder: () => true,
} as const;
