import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← ホームへ戻る</Text>
      </TouchableOpacity>

      <Image source={require('../../assets/profile/hisae.jpg')} style={styles.photo} resizeMode="contain" />

      <Text style={styles.name}>其田 寿枝（そのだ ひさえ）</Text>
      <Text style={styles.title}>占いカウンセラー｜結び島 主宰</Text>
      <Text style={styles.tagline}>想いを形に。</Text>

      <Text style={styles.body}>人生に、無駄な出来事はありません。{"\n\n"}迷いも、遠回りも、喜びも、悲しみも。そのすべてが、私たちを育て、未来へとつながる大切な時間だと私は信じています。{"\n\n"}2003年より占いカウンセリングを始め、多くの方の人生に寄り添ってきました。{"\n\n"}その中で感じ続けてきたことがあります。{"\n\n"}人は、生涯を通して育ち続ける存在であること。{"\n\n"}出会い、環境、経験、言葉。その一つひとつが心に触れ、考え方や価値観を育て、その人だけの人生を形づくっていきます。{"\n\n"}だから私は、占いを「未来を決めるもの」とは考えていません。{"\n\n"}占いは、自分を知ること。{"\n\n"}今の心を見つめ、人生の流れを受け取り、自分らしい未来を選んでいくための時間。{"\n\n"}時には前へ進むためではなく、立ち止まるための言葉が必要な日もあります。{"\n\n"}答えを急ぐより、心を整えることが先になることもあります。{"\n\n"}その人の歩幅で、自分自身と結び直していけるよう、お手伝いをしています。</Text>

      <Text style={styles.h2}>結び島について</Text>
      <Text style={styles.body}>結び島は、「自分自身と結び直す場所」です。{"\n\n"}毎日の小さな気づきが、人生を少しずつ変えていく。{"\n\n"}そんな願いを込めて、さまざまなコンテンツを届けています。{"\n\n"}どの占いにも共通している願いがあります。{"\n\n"}それは、答えを渡すことではなく、その人自身が自分の人生を信じられるようになること。{"\n\n"}私は、占いを通して、その人の中に眠る想いや可能性、まだ気づいていない力に光を届けたいと思っています。{"\n\n"}焦らなくてもいい。遠回りでもいい。{"\n\n"}今ここにある想いも、迷いも、願いも、すべて未来へ続く大切な種。{"\n\n"}結び島が、安心して帰ってこられる場所になれたら嬉しく思います。</Text>

      <Text style={styles.h2}>日々の想い</Text>
      <Text style={styles.body}>私は、日々の暮らしや自然、人生の気づきを「今日のおくりもの」として綴っています。{"\n\n"}占いだけでは伝えきれない想いも、その中に込めています。</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://note.com/sonodahisae')} style={styles.noteBtn}>
        <Text style={styles.noteBtnText}>▶ note「今日のおくりもの」を読む</Text>
      </TouchableOpacity>

      <Text style={styles.h2}>主な活動</Text>
      <Text style={styles.body}>2000年　マサジアートギャラリー代表（夫より事業継承）{"\n"}2003年　占いカウンセリング開始{"\n"}2006年　占い講座開講{"\n"}2010年　芸術活動グループ「たのしいげいじゅつ」結成{"\n"}2014年　オリジナル占いカード制作{"\n"}2015〜2021年　麻生西日本新聞TNC文化サークル 占い講座担当{"\n"}2019〜2026年　民生委員・児童委員（厚生労働大臣委嘱）{"\n"}2021年　想形楽合同会社設立／創作いなり寿司「うまいなり」オープン</Text>

      <Text style={styles.seed}>🌱 あなたの中にも、結びの種があります。</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFAF9' },
  content: { padding: 20, paddingBottom: 60 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 14, color: '#E8758A' },
  photo: { width: '100%', aspectRatio: 0.75, borderRadius: 16, marginBottom: 20, maxHeight: 500 },
  name: { fontSize: 26, fontWeight: '700', color: '#3D1A1A', fontFamily: 'NotoSerifJP_700Bold', textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 14, color: '#7A6A6A', textAlign: 'center', marginBottom: 8 },
  tagline: { fontSize: 18, color: '#E8758A', fontFamily: 'NotoSerifJP_700Bold', textAlign: 'center', marginBottom: 24 },
  h2: { fontSize: 20, fontWeight: '700', color: '#E8758A', fontFamily: 'NotoSerifJP_700Bold', marginTop: 32, marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 30, color: '#3D1A1A' },
  noteBtn: { backgroundColor: '#FFF0F3', borderRadius: 12, padding: 16, marginTop: 12, alignItems: 'center' },
  noteBtnText: { fontSize: 15, color: '#E8758A', fontWeight: '700' },
  seed: { fontSize: 18, color: '#E8758A', fontFamily: 'NotoSerifJP_700Bold', textAlign: 'center', marginTop: 40, marginBottom: 20 },
});
