import React, { useState, useEffect } from 'react';
import { noCopy } from '@/constants/Typography';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Colors } from '@/constants/Colors';
import { Typography, Fonts } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { fetchOverlay } from '@/lib/cms';
import { UTAMIKUJI, type Utamikuji } from '@/constants/utamikuji';

const UTAMIKUJI_INTRO = `歌みくじは、今のあなたに必要なメッセージを、オリジナル楽曲で届ける結び島だけのおみくじです。
言葉だけでは届かない想いも、音楽には心をやさしく包み込み、背中を押す力があります。
その日の気持ちに寄り添い、今のあなたに必要な一曲との出会いをお届けします。

このページでわかること
🎵 今日の歌みくじ … 今のあなたに必要な一曲をお届けします。
💌 歌に込められたメッセージ … 歌詞に込めた想いや、今日のあなたへのメッセージをお伝えします。
🌱 今日の過ごし方 … 歌の世界観から、今日を心地よく過ごすためのヒントをご紹介します。
🎧 心のお守りソング … 落ち込んだ時や迷った時、何度でも聴きたくなる一曲です。

音楽は、心に寄り添うもう一つの言葉。
あなたに必要な歌との出会いが、今日という一日をやさしく結んでくれますように。
🌱 あなたの中にも、結びの種があります。`;

// 音声アセット（assets/utamikuji/1.mp3〜9.mp3）。require は静的パスのみ可。
const AUDIO: Record<number, number> = {
  1: require('../../assets/utamikuji/1.mp3'),
  2: require('../../assets/utamikuji/2.mp3'),
  3: require('../../assets/utamikuji/3.mp3'),
  4: require('../../assets/utamikuji/4.mp3'),
  5: require('../../assets/utamikuji/5.mp3'),
  6: require('../../assets/utamikuji/6.mp3'),
  7: require('../../assets/utamikuji/7.mp3'),
  8: require('../../assets/utamikuji/8.mp3'),
  9: require('../../assets/utamikuji/9.mp3'),
};

/** 導カードと同方式: JSTの今日の日付(YYYYMMDD)を9で割った余り（0〜8）。 */
function getTodaySongIndex(): number {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(jst.getUTCDate()).padStart(2, '0');
  const dateNum = parseInt(`${y}${m}${d}`, 10);
  return dateNum % 9; // 0〜8
}

export default function UtamikujiScreen() {
  // Supabase(utamikuji)のテキスト列をローカルデータに number で上書き。失敗時はローカルのまま。
  const [songs, setSongs] = useState<Utamikuji[]>(UTAMIKUJI);
  useEffect(() => {
    fetchOverlay('utamikuji', UTAMIKUJI, (u) => u.number, (u, r) => ({
      ...u,
      title: r.title ?? u.title,
      lyrics: r.lyrics ?? u.lyrics,
    })).then(setSongs).catch(() => {});
  }, []);

  // iOSのサイレントスイッチでも再生
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const index = getTodaySongIndex();             // 0〜8
  const number = index + 1;                       // 1〜9
  const song = songs[index] ?? songs[0];

  const player = useAudioPlayer(AUDIO[number]);
  const status = useAudioPlayerStatus(player);
  const playing = status.playing;

  const togglePlay = () => {
    if (playing) {
      player.pause();
    } else {
      // 再生し終えていたら頭に戻す
      if (status.didJustFinish || (status.duration > 0 && status.currentTime >= status.duration)) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  return (
    <LinearGradient colors={[Colors.sectionPink, Colors.bg, Colors.sectionPink]} style={[styles.container, noCopy]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>今日の歌みくじ</Text>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.subtitle}>第{number}番 ／ 全9曲</Text>
        </View>

        {/* プレイヤー */}
        <View style={styles.playerCard}>
          <TouchableOpacity onPress={togglePlay} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.playButton}
            >
              <Text style={styles.playIcon}>{playing ? '■' : '▶'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.playLabel}>{playing ? '停止' : '再生'}</Text>
        </View>

        {/* 歌みくじとは */}
        <View style={styles.introCard}>
          <Text style={styles.introText}>{UTAMIKUJI_INTRO}</Text>
        </View>

        {/* 歌詞 */}
        <View style={styles.lyricsCard}>
          <Text style={styles.lyricsLabel}>歌詞</Text>
          <Text style={styles.lyricsText}>{song.lyrics}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },

  header: { alignItems: 'center', marginBottom: Spacing.lg },
  eyebrow: { ...Typography.caption, color: Colors.primaryDark, letterSpacing: 2, marginBottom: Spacing.xs },
  title: { fontFamily: Fonts.serifBold, fontSize: 28, lineHeight: 40, color: Colors.ink, textAlign: 'center' },
  subtitle: { ...Typography.caption, color: Colors.muted, marginTop: Spacing.xs },

  playerCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  playButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  playIcon: { color: Colors.surface, fontSize: 30, marginLeft: 2 },
  playLabel: { ...Typography.label, color: Colors.primaryDark, marginTop: Spacing.sm },

  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  introText: { ...Typography.body, color: Colors.ink, lineHeight: 28 },
  lyricsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: Spacing.lg,
  },
  lyricsLabel: { fontFamily: Fonts.serifMedium, fontSize: 17, color: Colors.primaryDark, marginBottom: Spacing.md },
  lyricsText: { ...Typography.body, color: Colors.ink, lineHeight: 30 },
});
