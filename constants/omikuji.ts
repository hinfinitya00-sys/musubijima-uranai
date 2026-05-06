export interface OmikujiType {
  label: string;
  emoji: string;
  messages: string[];
}

export const OMIKUJI_RESULTS: Record<string, OmikujiType> = {
  daikichi: {
    label: '大吉',
    emoji: '⭐️',
    messages: [
      'むすびの力が満ちています。今日は大きな一歩を踏み出す吉日。',
      '宇宙があなたを応援しています。思い切って行動しましょう。',
      'あなたの中に眠る才能が開花する日。自信を持って進んで。',
      '出会いの星が輝いています。新しい縁が素晴らしい未来を運ぶでしょう。',
      '全てのむすびが調和する最高の日。今日始めたことは大きく実を結びます。',
      'あなたの情熱が周囲に伝染する日。リーダーシップを発揮して。',
    ],
  },
  kichi: {
    label: '吉',
    emoji: '🌟',
    messages: [
      '穏やかな幸せが続く日。今の歩みを信じて進みましょう。',
      '小さな喜びが積み重なる一日。感謝の気持ちが更なる幸運を呼びます。',
      'あなたの優しさが誰かを救う日。そのままのあなたでいて。',
      '直感が冴える日。ふと浮かんだアイデアを大切にしてください。',
      '人間関係に恵まれる日。大切な人との時間を楽しんで。',
      '学びの多い一日になりそう。新しい知識があなたの世界を広げます。',
    ],
  },
  suekichi: {
    label: '末吉',
    emoji: '✨',
    messages: [
      '少しずつ運気が上昇中。焦らず自分のペースで進みましょう。',
      'じっくり取り組むことで、良い結果が得られるでしょう。種まきの日です。',
      '今は準備の時。今日の小さな努力が、明日の大きな花を咲かせます。',
      '内省の日。自分と向き合うことで新しい気づきが生まれます。',
      '待つことも力。今は焦らず、流れに身を委ねる時期です。',
      '基礎を固める日。地味でも確実な一歩が未来を変えます。',
    ],
  },
  kyo: {
    label: '凶',
    emoji: '🌙',
    messages: [
      '今日は内側を見つめる日。静かに過ごすことで新しい気づきが生まれます。',
      '試練は成長のスパイス。この経験があなたをもっと強くします。',
      '手放す勇気を持つ日。古いものを手放せば、新しいものが入ってきます。',
      '今日はゆっくり休むことが最大の幸運。無理せず自分を甘やかして。',
      '凶は「強」の始まり。この壁を超えた先に、大きな飛躍が待っています。',
      '月が満ちるように、闇の後には必ず光が来ます。今は充電の時。',
    ],
  },
};

export function drawOmikuji(): { result: string; label: string; emoji: string; message: string } {
  const weights = { daikichi: 20, kichi: 40, suekichi: 30, kyo: 10 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  let selectedKey = 'kichi';
  for (const [key, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      selectedKey = key;
      break;
    }
  }

  const result = OMIKUJI_RESULTS[selectedKey];
  const message = result.messages[Math.floor(Math.random() * result.messages.length)];

  return {
    result: selectedKey,
    label: result.label,
    emoji: result.emoji,
    message,
  };
}
