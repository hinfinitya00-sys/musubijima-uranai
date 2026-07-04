import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts, Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function HajimeteScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← ホームへ戻る</Text>
      </TouchableOpacity>

      <Text style={styles.h1}>はじめての方へ</Text>
      <Text style={styles.h2}>ようこそ、結び島へ。</Text>
      <Text style={styles.body}>結び島へお越しいただき、ありがとうございます。{"\n\n"}画面の一番上に流れる「今日のおくりもの」は、その日、あなたに届けたい短いメッセージです。{"\n\n"}ふと目に留まった言葉が、今日という一日を少し軽くし、新しい気づきを運んでくれるかもしれません。{"\n\n"}そして結び島には、その言葉をさらに深く受け取るための、さまざまな占いや音楽があります。{"\n\n"}結び島は、占い・言葉・音楽を通して、心を整え、自分らしい一歩を見つける場所です。{"\n\n"}未来を決めるための占いではありません。{"\n\n"}今の自分を知り、本来の自分と結び直し、毎日を少し軽やかに歩くための道しるべをお届けしています。{"\n\n"}人生には、前へ進む時もあれば、立ち止まる時、整える時もあります。{"\n\n"}どの時間にも意味があり、どのあなたも大切な存在です。</Text>

      <Text style={styles.h2}>🌱 結び島でできること</Text>
      <Text style={styles.body}>🌸 導カード（無料）{"\n"}今日の運気や心の流れを知り、今のあなたに必要なメッセージを受け取ります。{"\n\n"}🌿 結び族（基本無料）{"\n"}生まれ持った性質や才能、自分らしい活かし方を知ることができます。{"\n\n"}🌳 今年の運勢（概要無料）{"\n"}人生の流れを植物の成長にたとえ、今年をどのように過ごすとよいかをお伝えします。{"\n\n"}🕊 み・たまカード（会員向け）{"\n"}心の奥にある本当の想いに気づき、自分自身と向き合う時間を届けます。{"\n\n"}🏺 ネガティブ・エジプト（会員向け）{"\n"}心の影や思い込みをやさしく読み解き、本来のあなたへ戻るためのヒントをお伝えします。{"\n\n"}🎵 歌みくじ（無料）{"\n"}オリジナル楽曲とともに、今日のあなたへメッセージを届けます。</Text>

      <Text style={styles.h2}>おすすめの歩き方</Text>
      <Text style={styles.body}>はじめての方は、次の順番がおすすめです。{"\n\n"}① 導カードで、今日のメッセージを受け取る。{"\n"}② 結び族で、生まれ持った個性や才能を知る。{"\n"}③ 今年の運勢で、人生の流れを知る。{"\n"}④ み・たまカードで、心の声に耳を傾ける。{"\n"}⑤ ネガティブ・エジプトで、心の影と向き合う。{"\n"}⑥ 歌みくじで、今日のお守りソングを受け取る。{"\n\n"}もちろん、気になる場所から歩き始めても大丈夫です。{"\n\n"}その日に必要な場所が、きっとあなたを待っています。</Text>

      <Text style={styles.h2}>結び島が大切にしていること</Text>
      <Text style={styles.body}>結び島の占いは、未来を決めるものではありません。{"\n\n"}あなたの中にある答えや可能性に気づき、本来の自分らしさを思い出すための場所です。{"\n\n"}迷った日も、立ち止まった日も、遠回りをした日も、人生に無駄な時間はありません。{"\n\n"}そのすべてが、今のあなたへとつながっています。</Text>

      <Text style={styles.h2}>最後に</Text>
      <Text style={styles.body}>どうぞ、結び島をゆっくり歩いてみてください。{"\n\n"}あなたの今日に必要な言葉、あなたらしい生き方、そして心が少し軽くなる時間との出会いがありますように。</Text>

      <Text style={styles.seed}>🌱 あなたの中にも、結びの種があります。</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.lg, paddingBottom: 60 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 14, color: Colors.primary },
  h1: { fontSize: 28, fontWeight: '700', color: Colors.primaryDark, fontFamily: Fonts.serifBold, marginBottom: 8, textAlign: 'center' },
  h2: { fontSize: 20, fontWeight: '700', color: Colors.primary, fontFamily: Fonts.serifBold, marginTop: 32, marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 30, color: Colors.ink, fontFamily: Fonts.sansRegular },
  seed: { fontSize: 18, color: Colors.primary, fontFamily: Fonts.serifBold, textAlign: 'center', marginTop: 40, marginBottom: 20 },
});
