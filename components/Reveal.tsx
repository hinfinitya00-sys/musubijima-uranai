import React, { useState } from 'react';
import { Animated, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

type Props = {
  /** 親ScrollViewのスクロール量（Animated.Value） */
  scrollY: Animated.Value;
  /** ビューポート高さ */
  viewportH: number;
  /** 視差効果オフ時は静止表示 */
  reduced: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const UNMEASURED = 99999;

/**
 * スクロールに連動して、要素がビューポートに入る手前で
 * フェード＋わずかに上へスライドして現れる（スクロールリビール）。
 * 自身のレイアウトY座標を測り、scrollYに対して補間する。
 */
export function Reveal({ scrollY, viewportH, reduced, style, children }: Props) {
  const [top, setTop] = useState(UNMEASURED);
  const onLayout = (e: LayoutChangeEvent) => setTop(e.nativeEvent.layout.y);

  if (reduced) {
    return (
      <Animated.View onLayout={onLayout} style={style}>
        {children}
      </Animated.View>
    );
  }

  // 要素下端がビューポートに入り始める少し後から、完全に入るまでで 0→1
  const start = top - viewportH + 60;
  const end = top - viewportH + 200;
  const opacity = scrollY.interpolate({ inputRange: [start, end], outputRange: [0, 1], extrapolate: 'clamp' });
  const translateY = scrollY.interpolate({ inputRange: [start, end], outputRange: [20, 0], extrapolate: 'clamp' });

  return (
    <Animated.View onLayout={onLayout} style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
