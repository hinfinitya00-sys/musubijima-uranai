/**
 * むすび島 デザイントークン — タイポグラフィ
 * 見出し: Noto Serif JP / 本文: Noto Sans JP
 * フォントは app/_layout.tsx の useFonts でロードする。
 */
export const Fonts = {
  serifBold: 'NotoSerifJP_700Bold',
  serifMedium: 'NotoSerifJP_500Medium',
  sansRegular: 'NotoSansJP_400Regular',
  sansMedium: 'NotoSansJP_500Medium',
  sansLight: 'NotoSansJP_300Light',
} as const;

export const Typography = {
  // 見出し：Noto Serif JP
  h1: { fontFamily: Fonts.serifBold, fontSize: 28, lineHeight: 42 },
  h2: { fontFamily: Fonts.serifBold, fontSize: 22, lineHeight: 33 },
  h3: { fontFamily: Fonts.serifMedium, fontSize: 18, lineHeight: 27 },
  // 本文：Noto Sans JP
  body: { fontFamily: Fonts.sansRegular, fontSize: 15, lineHeight: 24 },
  bodyLg: { fontFamily: Fonts.sansRegular, fontSize: 16, lineHeight: 26 },
  caption: { fontFamily: Fonts.sansRegular, fontSize: 13, lineHeight: 20 },
  label: { fontFamily: Fonts.sansMedium, fontSize: 14, lineHeight: 22 },
  // ブランド表記
  brand: { fontFamily: Fonts.serifBold, fontSize: 26, letterSpacing: 2 },
  brandSub: { fontFamily: Fonts.sansLight, fontSize: 11, letterSpacing: 4 },
} as const;

export type TypographyToken = keyof typeof Typography;
