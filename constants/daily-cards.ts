// 毎日のカード占いデータ
// すべてポジティブなメッセージのみ

export type CardTheme =
  | "love"
  | "work"
  | "health"
  | "fortune"
  | "relationship"
  | "creativity"
  | "growth";

export interface DailyCard {
  id: string;
  theme: CardTheme;
  themeLabel: string;
  emoji: string;
  title: string;
  message: string;
  advice: string;
  luckyColor: string;
  luckyItem: string;
  luckyNumber: number;
}

export const DAILY_CARDS: DailyCard[] = [
  // 愛・恋愛
  {
    id: "love_1",
    theme: "love",
    themeLabel: "愛・縁",
    emoji: "💖",
    title: "愛の光が輝く日",
    message: "今日はあなたの周りに愛の光が満ちています。大切な人への感謝の気持ちが、新しい縁を引き寄せます。",
    advice: "笑顔で過ごすことで、素敵な出会いや深まりが生まれます。",
    luckyColor: "ローズピンク",
    luckyItem: "花",
    luckyNumber: 3,
  },
  {
    id: "love_2",
    theme: "love",
    themeLabel: "愛・縁",
    emoji: "🌸",
    title: "心が開く日",
    message: "今日は心の扉が自然と開いていきます。素直な気持ちを伝えることで、大切な絆がより深まります。",
    advice: "「ありがとう」の一言が、関係をより豊かにします。",
    luckyColor: "桜色",
    luckyItem: "手紙",
    luckyNumber: 6,
  },
  {
    id: "love_3",
    theme: "love",
    themeLabel: "愛・縁",
    emoji: "🌹",
    title: "縁が結ばれる日",
    message: "今日はご縁が結ばれやすい特別な日。あなたの温かさが、素晴らしい出会いを引き寄せています。",
    advice: "積極的に人と関わることで、新しい素敵な縁が生まれます。",
    luckyColor: "赤",
    luckyItem: "アクセサリー",
    luckyNumber: 9,
  },

  // 仕事・チャレンジ
  {
    id: "work_1",
    theme: "work",
    themeLabel: "仕事・挑戦",
    emoji: "⭐",
    title: "才能が輝く日",
    message: "今日はあなたの才能が最大限に輝きます。積極的に行動することで、素晴らしい成果が生まれます。",
    advice: "新しいことへの挑戦が、大きな飛躍につながります。",
    luckyColor: "ゴールド",
    luckyItem: "手帳",
    luckyNumber: 1,
  },
  {
    id: "work_2",
    theme: "work",
    themeLabel: "仕事・挑戦",
    emoji: "🚀",
    title: "飛躍の日",
    message: "今日はあなたの可能性が大きく広がる日。一歩踏み出す勇気が、新しい世界への扉を開きます。",
    advice: "アイデアを積極的に発信することで、周りからの評価が高まります。",
    luckyColor: "ブルー",
    luckyItem: "ペン",
    luckyNumber: 5,
  },
  {
    id: "work_3",
    theme: "work",
    themeLabel: "仕事・挑戦",
    emoji: "💡",
    title: "ひらめきの日",
    message: "今日は素晴らしいひらめきが降ってきます。直感を信じて行動することで、思いがけない成功が待っています。",
    advice: "メモを手元に置いて、浮かんだアイデアを大切にしましょう。",
    luckyColor: "イエロー",
    luckyItem: "ノート",
    luckyNumber: 7,
  },
  {
    id: "work_4",
    theme: "work",
    themeLabel: "仕事・挑戦",
    emoji: "🏆",
    title: "成功を掴む日",
    message: "今日はあなたの努力が実を結ぶ日。これまで積み重ねてきたものが、輝かしい成果として現れます。",
    advice: "自信を持って進むことで、望む結果が手に入ります。",
    luckyColor: "ゴールド",
    luckyItem: "時計",
    luckyNumber: 8,
  },

  // 健康・エネルギー
  {
    id: "health_1",
    theme: "health",
    themeLabel: "健康・活力",
    emoji: "🌟",
    title: "生命力が満ちる日",
    message: "今日はあなたの生命力が満ち溢れています。体も心も軽やかで、何でもできる気持ちになれます。",
    advice: "自然の中で深呼吸することで、さらにエネルギーが高まります。",
    luckyColor: "グリーン",
    luckyItem: "植物",
    luckyNumber: 4,
  },
  {
    id: "health_2",
    theme: "health",
    themeLabel: "健康・活力",
    emoji: "🌈",
    title: "心身が整う日",
    message: "今日は心と体のバランスが完璧に整います。穏やかな気持ちで過ごすことで、内側から輝きが生まれます。",
    advice: "好きな食べ物を味わうことで、幸せなエネルギーが充電されます。",
    luckyColor: "オレンジ",
    luckyItem: "お茶",
    luckyNumber: 2,
  },
  {
    id: "health_3",
    theme: "health",
    themeLabel: "健康・活力",
    emoji: "☀️",
    title: "輝きが増す日",
    message: "今日は太陽のような輝きがあなたを包んでいます。笑顔でいることで、周りにも幸せが広がります。",
    advice: "軽い運動や散歩が、さらなる活力をもたらします。",
    luckyColor: "サンシャインイエロー",
    luckyItem: "太陽光",
    luckyNumber: 11,
  },

  // 金運・豊かさ
  {
    id: "fortune_1",
    theme: "fortune",
    themeLabel: "金運・豊かさ",
    emoji: "✨",
    title: "豊かさが流れ込む日",
    message: "今日は豊かさのエネルギーがあなたに流れ込んでいます。感謝の気持ちが、さらなる豊かさを引き寄せます。",
    advice: "持っているものへの感謝が、新しい豊かさを呼び込みます。",
    luckyColor: "ゴールド",
    luckyItem: "財布",
    luckyNumber: 8,
  },
  {
    id: "fortune_2",
    theme: "fortune",
    themeLabel: "金運・豊かさ",
    emoji: "🍀",
    title: "幸運が訪れる日",
    message: "今日は幸運の女神があなたのそばにいます。直感に従って行動することで、嬉しいことが起こります。",
    advice: "小さな幸せを見つけることで、大きな幸運が引き寄せられます。",
    luckyColor: "グリーン",
    luckyItem: "四つ葉のクローバー",
    luckyNumber: 4,
  },
  {
    id: "fortune_3",
    theme: "fortune",
    themeLabel: "金運・豊かさ",
    emoji: "💎",
    title: "価値が高まる日",
    message: "今日はあなたの価値がさらに高まります。自分を大切にすることで、周りからも大切にされます。",
    advice: "自分への投資が、将来の豊かさにつながります。",
    luckyColor: "パープル",
    luckyItem: "宝石",
    luckyNumber: 7,
  },

  // 人間関係
  {
    id: "relationship_1",
    theme: "relationship",
    themeLabel: "人間関係",
    emoji: "🤝",
    title: "絆が深まる日",
    message: "今日は人との絆が深まる特別な日。周りの人への感謝と思いやりが、素晴らしい関係を育みます。",
    advice: "相手の良いところを見つけて伝えることで、関係がより豊かになります。",
    luckyColor: "ピーチ",
    luckyItem: "プレゼント",
    luckyNumber: 6,
  },
  {
    id: "relationship_2",
    theme: "relationship",
    themeLabel: "人間関係",
    emoji: "🌺",
    title: "笑顔が広がる日",
    message: "今日はあなたの笑顔が周りに幸せを広げます。明るい雰囲気が、素晴らしい人間関係を引き寄せます。",
    advice: "先に笑顔を向けることで、周りも自然と笑顔になります。",
    luckyColor: "コーラルピンク",
    luckyItem: "笑顔",
    luckyNumber: 3,
  },
  {
    id: "relationship_3",
    theme: "relationship",
    themeLabel: "人間関係",
    emoji: "🌻",
    title: "信頼が生まれる日",
    message: "今日は誠実な行動が周りからの信頼を集めます。あなたの真心が、長く続く素晴らしい関係を築きます。",
    advice: "約束を守ることで、さらに深い信頼関係が生まれます。",
    luckyColor: "サンフラワーイエロー",
    luckyItem: "ひまわり",
    luckyNumber: 9,
  },

  // 創造・表現
  {
    id: "creativity_1",
    theme: "creativity",
    themeLabel: "創造・表現",
    emoji: "🎨",
    title: "創造力が爆発する日",
    message: "今日はあなたの創造力が最大限に発揮されます。自由な発想で表現することで、素晴らしい作品が生まれます。",
    advice: "好きなことに思い切り没頭することで、才能がさらに開花します。",
    luckyColor: "バイオレット",
    luckyItem: "アート用品",
    luckyNumber: 5,
  },
  {
    id: "creativity_2",
    theme: "creativity",
    themeLabel: "創造・表現",
    emoji: "🎵",
    title: "感性が研ぎ澄まされる日",
    message: "今日はあなたの感性が研ぎ澄まされています。美しいものに触れることで、内なる才能が輝き出します。",
    advice: "音楽や芸術に触れることで、インスピレーションが高まります。",
    luckyColor: "インディゴ",
    luckyItem: "音楽",
    luckyNumber: 7,
  },
  {
    id: "creativity_3",
    theme: "creativity",
    themeLabel: "創造・表現",
    emoji: "🌙",
    title: "直感が冴える日",
    message: "今日は直感が冴え渡り、素晴らしいアイデアが次々と浮かびます。その感覚を大切にして表現してみましょう。",
    advice: "夢や直感を日記に書き留めることで、新しい発見があります。",
    luckyColor: "シルバー",
    luckyItem: "日記",
    luckyNumber: 11,
  },

  // 成長・学び
  {
    id: "growth_1",
    theme: "growth",
    themeLabel: "成長・学び",
    emoji: "🌱",
    title: "成長の種が芽吹く日",
    message: "今日は新しい学びと成長のエネルギーに満ちています。好奇心を持って取り組むことで、大きく成長できます。",
    advice: "新しいことを一つ試してみることで、可能性が広がります。",
    luckyColor: "グリーン",
    luckyItem: "本",
    luckyNumber: 1,
  },
  {
    id: "growth_2",
    theme: "growth",
    themeLabel: "成長・学び",
    emoji: "🦋",
    title: "変容の日",
    message: "今日はあなたが美しく変容していく特別な日。これまでの経験が、新しい自分を作り上げていきます。",
    advice: "変化を恐れずに受け入れることで、素晴らしい自分に出会えます。",
    luckyColor: "ターコイズ",
    luckyItem: "蝶",
    luckyNumber: 9,
  },
  {
    id: "growth_3",
    theme: "growth",
    themeLabel: "成長・学び",
    emoji: "🌠",
    title: "可能性が広がる日",
    message: "今日はあなたの可能性が無限に広がっています。夢を大きく描くことで、それに向かう力が湧いてきます。",
    advice: "理想の自分をイメージすることで、そこへの道が開けてきます。",
    luckyColor: "スターライトブルー",
    luckyItem: "星",
    luckyNumber: 3,
  },
];

// 日付からカードを決定論的に選ぶ関数（同じ日は同じカードが出る）
export function getDailyCard(date: Date, guideNumber: number): DailyCard {
  const dateStr = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
  const seed = parseInt(dateStr) + guideNumber;
  const index = seed % DAILY_CARDS.length;
  return DAILY_CARDS[Math.abs(index)];
}

// グループ別の追加メッセージ
export const GROUP_DAILY_MESSAGES: Record<string, string[]> = {
  土: [
    "大地のように揺るぎない強さがあなたにはあります。",
    "着実な歩みが、確かな成功へと続いています。",
    "あなたの安定感が、周りの人に安心を与えています。",
    "忍耐強さが、素晴らしい実りをもたらします。",
    "あなたの誠実さが、信頼という宝を築いています。",
  ],
  風: [
    "自由な発想が、新しい可能性を開いています。",
    "変化を楽しむ心が、豊かな人生を作ります。",
    "あなたの好奇心が、素晴らしい出会いを引き寄せます。",
    "軽やかな心で、どんな状況も乗り越えられます。",
    "あなたの笑顔が、周りに元気を届けています。",
  ],
  水: [
    "深い感受性が、人の心を動かす力を持っています。",
    "あなたの優しさが、周りに癒しをもたらしています。",
    "協調する心が、素晴らしいチームワークを生みます。",
    "美しいものを感じる心が、人生を豊かにします。",
    "あなたの愛情が、大切な人を幸せにしています。",
  ],
  火: [
    "情熱が、夢を現実に変える力を持っています。",
    "あなたの行動力が、新しい道を切り開きます。",
    "直感を信じることで、素晴らしい成果が生まれます。",
    "情熱的な心が、周りに勇気を与えています。",
    "あなたの輝きが、多くの人を照らしています。",
  ],
};
