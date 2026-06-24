import React from 'react';
import { Animated } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// 水引（淡路結び風）の連続した一筆書きパス。progress 0→1 で「結ばれる」ように描画される。
const KNOT_D =
  'M 46 72 C 50 58, 18 56, 22 36 C 25 22, 52 24, 58 40 C 60 44, 60 44, 62 40 C 68 24, 95 22, 98 36 C 102 56, 70 58, 74 72';

// パス全長より少し長めの破線長（描画完了を保証）
const DASH = 380;

type Props = {
  size?: number;
  /** 0→1 のAnimated.Value。結ばれていく進捗。 */
  progress: Animated.Value;
  pink?: string;
  gold?: string;
};

/**
 * むすび島の署名モチーフ。2本の水引（金＝奥／桃＝手前）が結ばれる演出。
 */
export function MizuhikiKnot({ size = 140, progress, pink = Colors.primary, gold = Colors.accent }: Props) {
  const strokeDashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [DASH, 0] });
  const height = size * (80 / 120);

  return (
    <Svg width={size} height={height} viewBox="0 0 120 80">
      {/* 金の水引（奥・少し下にずらす） */}
      <G transform="translate(0,3)">
        <AnimatedPath
          d={KNOT_D}
          stroke={gold}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
          strokeDasharray={[DASH, DASH]}
          strokeDashoffset={strokeDashoffset}
        />
      </G>
      {/* 桃の水引（手前） */}
      <AnimatedPath
        d={KNOT_D}
        stroke={pink}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={[DASH, DASH]}
        strokeDashoffset={strokeDashoffset}
      />
    </Svg>
  );
}
