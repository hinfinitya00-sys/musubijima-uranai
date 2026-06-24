import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Colors';

// 中央の小さな水引結び（二つ輪の蝶結び）
const MINI_D =
  'M 10 16 C 11 11, 3 11, 4 7 C 5 3, 13 5, 14 10 C 15 5, 23 3, 24 7 C 25 11, 17 11, 18 16';

type Props = {
  /** セクションのアクセントカラー */
  color?: string;
};

/**
 * セクション境界の水引ライン。線—結び—線で署名モチーフを反復し、
 * color でセクションごとのアクセントを与える。
 */
export function MizuhikiDivider({ color = Colors.primary }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginVertical: Spacing.md }}>
      <View style={{ flex: 1, height: 1.5, backgroundColor: color, opacity: 0.35 }} />
      <Svg width={28} height={20} viewBox="0 0 28 20" style={{ marginHorizontal: Spacing.sm }}>
        <Path d={MINI_D} stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <View style={{ flex: 1, height: 1.5, backgroundColor: color, opacity: 0.35 }} />
    </View>
  );
}
