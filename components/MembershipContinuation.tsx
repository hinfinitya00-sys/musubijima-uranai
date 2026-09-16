import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

type MembershipContinuationProps = {
  locked: boolean;
  children: React.ReactNode;
};

export function MembershipContinuation({ locked, children }: MembershipContinuationProps) {
  if (!locked) return <>{children}</>;

  return (
    <View nativeID="membership-continuation" testID="membership-continuation" style={styles.wrapper}>
      <View pointerEvents="none" accessibilityElementsHidden style={styles.blurredContent}>
        {children}
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,250,249,0.08)', 'rgba(255,250,249,0.92)', '#FFFAF9']}
        style={styles.fade}
      />
      <View style={styles.prompt}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.title}>この続きは会員限定です。</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="月額330円で続きを読む"
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.push('/subscription/plans' as never)}
        >
          <Text style={styles.buttonText}>月額330円で続きを読む</Text>
        </TouchableOpacity>
        <Text style={styles.note}>いつでも解約できます</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 420,
    overflow: 'hidden',
    borderRadius: 16,
  },
  blurredContent: Platform.select({
    web: { opacity: 0.32, filter: 'blur(6px)' } as any,
    default: { opacity: 0.2 },
  }),
  fade: { ...StyleSheet.absoluteFillObject },
  prompt: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  lock: { fontSize: 25, marginBottom: 8 },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '800', color: '#3D1A1A', textAlign: 'center' },
  button: {
    minHeight: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8758A',
    borderRadius: 999,
    marginTop: 18,
    paddingHorizontal: 18,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  note: { color: '#7A6A6A', fontSize: 13, marginTop: 9 },
});
