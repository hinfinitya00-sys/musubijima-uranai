import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface OmikujiItem {
  num: number;
  title: string;
  subtitle: string;
  tehanasu: string;
  kansha: string;
  sooji: string;
  shigoto: string;
  gakumon: string;
  renai: string;
  kenkou: string;
  ryokou: string;
  message: string;
}

const OMIKUJI_DATA: OmikujiItem[] = [
  {
    num: 1,
    title: "おみくじ_1",
    subtitle: "",
    tehanasu: "人々の先頭に立ち、多くの人を導く使命があることを知ること 人間的深さと魅力が深まる時。創造力、直感力を活かして人のために力を惜しみなく出すと良い。",
    kansha: "不思議な力に導かれる",
    sooji: "人のために動けば良好",
    shigoto: "人の一歩先を行く",
    gakumon: "熱心に取り組め",
    renai: "思いやりを持つこと",
    kenkou: "良好",
    ryokou: "直感に従うこと",
    message: "あなたが求める力は既にあなたの手の中にあることに気づいてください。私欲や邪念を持たない純粋な広い心で多く人を導く使命に気づいてください。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。"
  },
  {
    num: 2,
    title: "おみくじ_2",
    subtitle: "",
    tehanasu: "思考に囚われず、精神世界に頼り過ぎず、自分の第六感を信じること 精神世界と繋がりやすい。神仏に縁のある地を訪れると良い。",
    kansha: "時が来るのを気長に待て",
    sooji: "人の話に耳を傾けること",
    shigoto: "働き者 成功近し",
    gakumon: "気力、集中力が高まる時",
    renai: "ハッキリと自分の意思を示すこと",
    kenkou: "良好",
    ryokou: "寺院、神社など",
    message: "今はそのことが理解できなくても、いつの日かわかる時が訪れます。批判をせず、非難もせず、ただ、その時が来る日まで待つのです。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。"
  },
  {
    num: 3,
    title: "おみくじ_3",
    subtitle: "",
    tehanasu: "情報に惑わされないように、常に心ある道を選択する習慣を付ける 理想的感情に流されないこと。自分の向かうべき方向を明確にする時。",
    kansha: "真の心を確かめよ",
    sooji: "争いごとで分かれ有り",
    shigoto: "自分流が吉",
    gakumon: "知恵が働く時",
    renai: "二又に注意",
    kenkou: "扁桃腺に注意",
    ryokou: "長距離旅行 吉",
    message: "に迷った時こそ自身に問いかけるのです。「右の道に心があるのか？」「左の道に心があるのか？」決して、人に聞いてはなりません。仮に選んだ道が茨の道であったとしても、心がある道こそ進むべき道なのです。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。"
  },
  {
    num: 4,
    title: "おみくじ_4",
    subtitle: "",
    tehanasu: "こだわりや依存心に気づいたら、その感情を手放すことを実践する 複雑だった物事が、ひとつひとつ明らかとなって安定していく。",
    kansha: "結果が出る",
    sooji: "葛藤に苦しむ",
    shigoto: "自分流が吉",
    gakumon: "頭が冴えている",
    renai: "執着をすてること",
    kenkou: "過度な飲酒を控えること",
    ryokou: "歴史ある場所 吉 複雑なものごとも一つ一つ明らかになり、安定を手にしていきます。古いものは手放し、新たなステージへ行く準備をしてください。",
    message: "吉 複雑なものごとも一つ一つ明らかになり、安定を手にしていきます。古いものは手放し、新たなステージへ行く準備をしてください。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。"
  },
  {
    num: 5,
    title: "おみくじ_5",
    subtitle: "",
    tehanasu: "",
    kansha: "現実になる",
    sooji: "平和な環境",
    shigoto: "全てが順調",
    gakumon: "頭が冴えている",
    renai: "行動力・決断力が鍵",
    kenkou: "体力有り",
    ryokou: "",
    message: "は、現実になろうとしています。あなたの直感は物事の本質を見抜き、未来を正確に予見しています。大胆にかつマイペースに行動してください。 現実的、霊的、精神的な原理を使い、ものごとを立ち上げていきましょう。"
  },
  {
    num: 6,
    title: "おみくじ_6",
    subtitle: "",
    tehanasu: "",
    kansha: "忍耐が必要",
    sooji: "穏やかに過ごせる",
    shigoto: "補佐的な働きを必要とされる",
    gakumon: "努力が実る",
    renai: "想いが通じる",
    kenkou: "健康",
    ryokou: "",
    message: "のバランスを、平等にしていてください。すべては美しく事が運びます。どちらかにエネルギーがかたよらないよう注意深くいてください。 自他の境界線を明確にし、全体的な調和を保ちながら協力しあう関係を大切にしましょう。"
  },
  {
    num: 7,
    title: "おみくじ_7",
    subtitle: "",
    tehanasu: "",
    kansha: "勢いをつけて進むと良い",
    sooji: "わがままから起こる",
    shigoto: "進んで取り組めば目標達成",
    gakumon: "新たな考えを取り入れること",
    renai: "積極大胆に進め",
    kenkou: "腰痛に注意",
    ryokou: "",
    message: "ころに幸あり 炎の泉。求めればあなたの必要なエネルギーが永遠に湧き出す泉です。恐れ、憂え、いらだちの感情は全て手放してください。すべては前進するエネルギーへと形を変るでしょう。あなたは今、大きく前進する時を迎えています。 建設的な創造エネルギーを表現し、開放しましょう。"
  },
  {
    num: 8,
    title: "おみくじ_8",
    subtitle: "",
    tehanasu: "",
    kansha: "楽観的に待て",
    sooji: "話し合いで解決",
    shigoto: "人の意見を取り入れると吉",
    gakumon: "上手く処理する能力あり",
    renai: "心を引き付ける魅力あり",
    kenkou: "下半身に疲れが溜まりやすい",
    ryokou: "初めて訪れるところに幸あり",
    message: "ころに幸あり あなたは今、創造エネルギーを受け取り、松明に炎を点しました。その炎は、知恵と直感によって人々の心に響くものを、癒すものを表現するよう求めています。楽観的でいてください。あなたの愛を持った行動が、人々の心を強く引きつけていきます。 建設的な創造エネルギーを表現し、開放しましょう。"
  },
  {
    num: 9,
    title: "おみくじ_9",
    subtitle: "",
    tehanasu: "",
    kansha: "人の喜びが伴うものは叶う",
    sooji: "心配ない",
    shigoto: "人からの信頼が集まる",
    gakumon: "必要な時に教えあり",
    renai: "自分に正直であれ",
    kenkou: "疲れに注意",
    ryokou: "",
    message: "両手を広げてください。心を開いてください。抑圧されたエネルギーは陽の光を受け、正のエネルギーと変わりました。あなたに必要な力は万全です。ストレートに、行動を起こしてください。 建設的な創造エネルギーを表現し、開放しましょう。"
  },
  {
    num: 10,
    title: "おみくじ_10",
    subtitle: "",
    tehanasu: "",
    kansha: "叶う 希望を持て",
    sooji: "心を通わせる努力が必要",
    shigoto: "人を育てる時",
    gakumon: "希望を持つこと",
    renai: "安らぎある人との出会いあり",
    kenkou: "心配しない",
    ryokou: "",
    message: "がよい 精神世界より、美しく豊かな想像エネルギーを受け取りました。あなたの表現が人々に安らぎと希望を与えていきます。どんな人とも心を通わせる準備をしてください。 建設的な創造エネルギーを表現し、開放しましょう。"
  },
  {
    num: 11,
    title: "おみくじ_11",
    subtitle: "",
    tehanasu: "",
    kansha: "地道な努力が必要",
    sooji: "すべては調和している",
    shigoto: "決断力と行動力がカギ",
    gakumon: "努力は実る",
    renai: "勇気を持って進め",
    kenkou: "心配しないこと",
    ryokou: "",
    message: "要 高い理想を持ち続けてください。あなたの思想は現実のものとなりつつあります。全ての環境が調和するよう入念に準備を進めてください。気づかいを怠らないようにしてくたさい。あなたの前向きな行動が人々に勇気を与えていきます。 建設的な創造エネルギーを表現し、開放しましょう。"
  },
  {
    num: 12,
    title: "おみくじ_12",
    subtitle: "",
    tehanasu: "他人の苦しみや悲しみを受けやすい。情をかけ過ぎないこと 周りの人々に情をかけ過ぎると、本来の自分の意思を見失いがち。他人の苦しみや悲しみは理解するにとどまる事。",
    kansha: "希望は高く掲げよ",
    sooji: "心が通い合う",
    shigoto: "教え導く仕事で才能を発揮",
    gakumon: "芸術的才能あり",
    renai: "優柔不断",
    kenkou: "気管支系に注意",
    ryokou: "大勢で行くとよい 苦しみや悲しみは浄化され、あなたは様々な方法によって教え、導かれていきます。執着を外してください。そして、すべての人に優しく平等でいてください。",
    message: "い 苦しみや悲しみは浄化され、あなたは様々な方法によって教え、導かれていきます。執着を外してください。そして、すべての人に優しく平等でいてください。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。"
  },
  {
    num: 13,
    title: "おみくじ_13",
    subtitle: "",
    tehanasu: "",
    kansha: "全身全霊で取り組めば叶う",
    sooji: "平和な環境",
    shigoto: "他人より優れたところを発見",
    gakumon: "プレッシャーに負けるな",
    renai: "温かい言葉がカギ",
    kenkou: "神経性の腹痛に注意",
    ryokou: "",
    message: "楽しめる場所 大いなる愛があなたを包み込んでいます。悲しみや怒りの感情は浄化され、その思いは愛へと変っていきます。その変化を大らかな気持ちで受け止めてください。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。"
  },
  {
    num: 14,
    title: "おみくじ_14",
    subtitle: "",
    tehanasu: "",
    kansha: "全ては丸く収まる",
    sooji: "相手を受け入れること",
    shigoto: "他の人に教え導くとき",
    gakumon: "プレッシャーに負けるな",
    renai: "成熟する",
    kenkou: "気管支系に注意",
    ryokou: "自然の多い場所",
    message: "すべてを受け入れ、すべてを許してください。聡明な心でいてください。 すべて、これがよいのです。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。"
  },
  {
    num: 15,
    title: "おみくじ_15",
    subtitle: "",
    tehanasu: "",
    kansha: "世の中の貢献になるものは叶う",
    sooji: "感情をため過ぎると爆発する",
    shigoto: "自らが先頭に立つと良い",
    gakumon: "直感力が働く",
    renai: "心が通う",
    kenkou: "睡眠を良くとること",
    ryokou: "",
    message: "かに、穏やかに打ち寄せた波は、月に照らされ美しい音を奏でています。目を閉じて、耳を澄ましてください。せき止められていた様々な物事は今、美しい音によって流れ始めました。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。"
  },
  {
    num: 16,
    title: "おみくじ_16",
    subtitle: "",
    tehanasu: "",
    kansha: "勢いをつけて進め",
    sooji: "感情をコントロールすること",
    shigoto: "競争心が和を乱す傾向",
    gakumon: "努力が実る",
    renai: "自己不振に陥らないこと",
    kenkou: "冷えに注意",
    ryokou: "",
    message: "と出会い有り 月のしずくは人々の心の乾きを潤し、あなたの思想を受け入れる準備が整ったことを知らせています。過剰な心の動きに注意し、心の平和を保ち続けていてください。あなたの努力が形となる日は近づいています。あなたの行いが人々に感動と導きを与えることを強くイメージしてください。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。"
  },
  {
    num: 17,
    title: "おみくじ_17",
    subtitle: "",
    tehanasu: "",
    kansha: "強い意志が成功を招く",
    sooji: "人を抑制しようとする傾向",
    shigoto: "競争心が和を乱す傾向",
    gakumon: "努力が実る",
    renai: "愛情豊かな時",
    kenkou: "ビタミンを多くとること",
    ryokou: "",
    message: "まによって生まれた波動は、次々と周囲に伝わっています。「創造性を、力強い行動によって物質的な成功に結びつける」ということに集中してください。人や社会との繋がりを更に広げる時を迎えています。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。"
  },
  {
    num: 18,
    title: "おみくじ_18",
    subtitle: "",
    tehanasu: "",
    kansha: "神秘な力が働く時",
    sooji: "正直になること",
    shigoto: "孤独な仕事が吉",
    gakumon: "順調",
    renai: "一人の時間が必要",
    kenkou: "ストレスに注意",
    ryokou: "",
    message: "月光によって美しい姿を現した白い花は、善悪、真偽を正しく見ることを手助けしています。神秘的な力は増し、直感は冴え、創造力豊かな時を迎えています。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。"
  },
  {
    num: 19,
    title: "おみくじ_19",
    subtitle: "",
    tehanasu: "",
    kansha: "心から奇跡を信じること",
    sooji: "正しさで他人を責めないこと",
    shigoto: "実務的な能力がアップ",
    gakumon: "他の意見を受容すると良い",
    renai: "情熱的に進め",
    kenkou: "腎臓系を大切に",
    ryokou: "美しい場所",
    message: "べては上手くいっています。心配ごとはすべて天に預けてください。あなたは大いなる愛に守られ、導かれています。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。"
  },
  {
    num: 20,
    title: "おみくじ_20",
    subtitle: "",
    tehanasu: "",
    kansha: "太陽を拝むと道が拓ける",
    sooji: "神経質にならない",
    shigoto: "先見の目あり",
    gakumon: "他の意見を受容すると良い",
    renai: "依存心を捨てること",
    kenkou: "刺激の強い食の取り過ぎに注意",
    ryokou: "",
    message: "る場所 先を見通す力が高まっています。自分の信じる道を貫く決心を固めてください。 依存心や孤独に対する不安はすべて天に委ね、大らかな気持ちで進んでください。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。"
  },
  {
    num: 21,
    title: "おみくじ_21",
    subtitle: "",
    tehanasu: "",
    kansha: "道はひらける",
    sooji: "相手に心を合わせること",
    shigoto: "どんな仕事もこなせる",
    gakumon: "プレッシャーに負けるな",
    renai: "太陽のような人と縁あり",
    kenkou: "喉に注意",
    ryokou: "",
    message: "る場所 太陽の光によってすべては透明に、ものごとはあるがままに見えています。そのままを見ること、そのままを受け入れること、純粋な透明な心で物事を観察してください。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。"
  },
  {
    num: 22,
    title: "おみくじ_22",
    subtitle: "",
    tehanasu: "",
    kansha: "分析して更なる行動が必要",
    sooji: "大らかでいること",
    shigoto: "準備をすること",
    gakumon: "順序つけると良い",
    renai: "安定する",
    kenkou: "肩こり 首の痛み",
    ryokou: "短い旅 吉",
    message: "べての物事は明確に見えています。概念を捨て物事をそのまま見てください。\u0003あなたは、正しい判断をしています。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。"
  },
  {
    num: 23,
    title: "おみくじ_23",
    subtitle: "",
    tehanasu: "",
    kansha: "憂いは禁物",
    sooji: "丸く収まる",
    shigoto: "リーダー性を発揮する",
    gakumon: "熱心に取りくめ",
    renai: "実る",
    kenkou: "関節痛に注意",
    ryokou: "",
    message: "決まれば恐れはありません。ただ目の前のするべきことを着実に行なってください。実りの杯は手を伸ばせばすぐそこに、あなたの勇気の中にあります。受け取る準備をしてください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。"
  },
  {
    num: 24,
    title: "おみくじ_24",
    subtitle: "",
    tehanasu: "",
    kansha: "時まだ遠し",
    sooji: "相手の心を理解する事",
    shigoto: "魂を入れて取り組め",
    gakumon: "向上する",
    renai: "マイペースで良い",
    kenkou: "関節痛に注意",
    ryokou: "",
    message: "す環境 吉 急いではいけません。大海を優雅に泳ぐ魚のように、ゆっくりマイペースに進んでください。流されることなく、周りの状況を客観的に見てください。今、未来を見通す力が与えられています。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。"
  },
  {
    num: 25,
    title: "おみくじ_25",
    subtitle: "",
    tehanasu: "",
    kansha: "与えることに集中する時",
    sooji: "相手を受け入れること",
    shigoto: "慎重に取りくめ",
    gakumon: "人に教えることで自らも学び有",
    renai: "よこしまな感情を捨てる",
    kenkou: "耳の病気に注意",
    ryokou: "身近な場所にとどめること 現実的に必要となるものはすべて手に入る愛のポケット。",
    message: "どめること 現実的に必要となるものはすべて手に入る愛のポケット。 あなたが聡明な心で願ったものはすべて手に入ります。手にしたものは、惜しみなく他の人々へも分け与えてください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。"
  },
  {
    num: 26,
    title: "おみくじ_26",
    subtitle: "",
    tehanasu: "",
    kansha: "行動力で決まる",
    sooji: "攻撃的な態度に注意",
    shigoto: "リーダーとしての才を発揮",
    gakumon: "今は一つに絞り込む時",
    renai: "積極的にいくとき",
    kenkou: "ビタミン、鉄分不足に注意",
    ryokou: "見晴らしの良い場所",
    message: "場所 あなたの助けを待っている人が近くにいます。真実と正義によって解決するよう手助けをしてください。そして、癒してください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。"
  },
  {
    num: 27,
    title: "おみくじ_27",
    subtitle: "",
    tehanasu: "",
    kansha: "準備不足 分析すること",
    sooji: "正しさより明るさが必要",
    shigoto: "楽しむと良い",
    gakumon: "集中力あり",
    renai: "形になる",
    kenkou: "膀胱に注意",
    ryokou: "",
    message: "吉 難しかったことが、解決へと向かいます。すべては正しく進んでいます。今楽しむことに集中してください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。"
  },
  {
    num: 28,
    title: "おみくじ_28",
    subtitle: "",
    tehanasu: "",
    kansha: "コツコツ積み上げよ",
    sooji: "家庭内の争いに注意",
    shigoto: "準備をわすれないこと",
    gakumon: "忍耐強く取り組め",
    renai: "安定した関係",
    kenkou: "貧血に注意",
    ryokou: "",
    message: "良い 太陽へ顔を向けてください。安定への基礎はしっかりと根を下ろしました。過去の結果や形など、こだわりはすべて手放し、一つ一つ形になるよう強い意志で階段を進んでください。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。"
  },
  {
    num: 29,
    title: "おみくじ_29",
    subtitle: "",
    tehanasu: "",
    kansha: "欲求を強く思えば引き寄せる",
    sooji: "短気が仇となる",
    shigoto: "せっかちになるな",
    gakumon: "忍耐強く取り組め",
    renai: "ゆっくり時間をとること",
    kenkou: "動悸（どうき） 心のバランスをとる事",
    ryokou: "急いで決めないこと",
    message: "こと あなたの努力は認められ、実を結ぼうとしています。理性と心のバランスを崩さないよう、ただ実ることを強く願い、今は、欲求を強く持ち続けていてください。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。"
  },
  {
    num: 30,
    title: "おみくじ_30",
    subtitle: "",
    tehanasu: "",
    kansha: "あと一歩 強く願うこと",
    sooji: "短気が仇となる",
    shigoto: "せっかちに物事を進めないこと",
    gakumon: "忍耐強く取り組め",
    renai: "引き付ける力あり",
    kenkou: "頭痛 低血圧",
    ryokou: "急いで決めないこと",
    message: "こと あなたの思想や行動、決断は「そのままでよい。目指す道は歩みやすくなった。」と、ロバは言っています。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。"
  },
  {
    num: 31,
    title: "おみくじ_31",
    subtitle: "",
    tehanasu: "",
    kansha: "新たな願いをたてる時",
    sooji: "気づきあり",
    shigoto: "マンネリ化 気を引き締めよ",
    gakumon: "感性を磨く時",
    renai: "浮気に注意",
    kenkou: "慢性的な病気に注意",
    ryokou: "",
    message: "くと良い 大空を飛びまわった鳥はある日、単調な毎日を退屈に思い、種を育てることを思いつきました。今、あなたも、新たな目的や方向性を見つけ出す時が来たことを告げています。 目的を定めた訓練と経験によって本当の自由を得ることができます。"
  },
  {
    num: 32,
    title: "おみくじ_32",
    subtitle: "",
    tehanasu: "",
    kansha: "手に入る",
    sooji: "執拗（しつよう）にこだわらない",
    shigoto: "様々な経験多い時",
    gakumon: "頭の回転良好",
    renai: "縁ある人を大切にすること",
    kenkou: "免疫低下に注意",
    ryokou: "",
    message: "る 自由と開放の羽を手に入れました。今は、どんな環境でも飛び込み楽しむことができます。すぐに行動してください。 目的を定めた訓練と経験によって本当の自由を得ることができます。"
  },
  {
    num: 33,
    title: "おみくじ_33",
    subtitle: "",
    tehanasu: "",
    kansha: "引き寄せる",
    sooji: "気分でモノを言うと争いあり",
    shigoto: "経験多い時 楽しめ",
    gakumon: "学びは順調",
    renai: "実る",
    kenkou: "依存に注意",
    ryokou: "",
    message: "縁あり 願いが叶いやすい時です。引き寄せたいものが手に入ったと強くイメージしてください。あなたに必要なものはすべて与えられることを信じて祈り続けてください。 目的を定めた訓練と経験によって本当の自由を得ることができます。"
  },
  {
    num: 34,
    title: "おみくじ_34",
    subtitle: "",
    tehanasu: "",
    kansha: "必要であれば叶う",
    sooji: "熱狂的にならないこと",
    shigoto: "束縛（そくばく）な環境 凶",
    gakumon: "イメージして取り組め",
    renai: "相手を見通す 受容が必要",
    kenkou: "神経系の病気に注意",
    ryokou: "",
    message: "すると良い 束縛された環境を手放し、自由を追求するよう鳥が唄っています。宇宙のリズムと調和し、新たな環境の中で冒険する時がきたのです。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。"
  },
  {
    num: 35,
    title: "おみくじ_35",
    subtitle: "",
    tehanasu: "",
    kansha: "静かに自分の声に集中する時",
    sooji: "争い事に関わらないこと",
    shigoto: "一匹狼でいけ",
    gakumon: "自分流を発見しすると良い",
    renai: "一人の時間を楽しむとき",
    kenkou: "便秘に注意",
    ryokou: "",
    message: "かな穏やかな環境に身を置き、一人の時間を大切にしてください。今は自分の心の声をしっかり聞き取ることに集中してください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。"
  },
  {
    num: 36,
    title: "おみくじ_36",
    subtitle: "",
    tehanasu: "",
    kansha: "答えは目の前にある",
    sooji: "新たな可能性",
    shigoto: "ヒーリングの才能が開花",
    gakumon: "必要な情報が手に入る",
    renai: "運命の出会い",
    kenkou: "緊張し過ぎないこと",
    ryokou: "",
    message: "保てる環境 吉 魂と宇宙は繋がり、新しい可能性を示す時が来ました。理想を創造的に表現することに集中してください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。"
  },
  {
    num: 37,
    title: "おみくじ_37",
    subtitle: "",
    tehanasu: "",
    kansha: "思いが通じる",
    sooji: "謙虚（けんきょ）になること",
    shigoto: "信頼が集まる",
    gakumon: "得た知識を人に伝ていく",
    renai: "周りの協力が得られる",
    kenkou: "肌荒れに注意",
    ryokou: "",
    message: "種）が、大空へ飛び立ちました。その種は「謙虚でいること」「誠実であること」「人々に深い理解を示すこと」「手にした知識を人々のために使うこと」と教えています。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。"
  },
  {
    num: 38,
    title: "おみくじ_38",
    subtitle: "",
    tehanasu: "",
    kansha: "願いを明確に",
    sooji: "問題は解決する",
    shigoto: "未来を切り開く力あり",
    gakumon: "創造力、分析力アップ",
    renai: "安定する",
    kenkou: "頭痛 肩こりに注意",
    ryokou: "",
    message: "縁あり 未来の扉を開く鍵を手に入れました。問題は解決へ向かいます。鍵は「新しい観点によって物事を切り開き、開拓すること。」を強く望んでいます。目的を明確にし、扉を強く押し開いてください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。"
  },
  {
    num: 39,
    title: "おみくじ_39",
    subtitle: "",
    tehanasu: "",
    kansha: "新たな願望を抱け",
    sooji: "説明すれば分かり合える",
    shigoto: "予定に縛られる傾向",
    gakumon: "冴えている",
    renai: "新たな環境",
    kenkou: "皮膚病に注意",
    ryokou: "",
    message: "吉 様々な自然の厳しさを経験することで教訓を得た鳥は、ついに自由を手に入れました。あなたも、どんな環境や境遇の変化にもすぐに仲良くなることができる柔軟さを身につけています。自由に大空を飛びまわる鳥のように、あなたも羽ばたく時がきたのです。 目的を定めた訓練と経験によって本当の自由を得ることができます。"
  },
  {
    num: 40,
    title: "おみくじ_40",
    subtitle: "",
    tehanasu: "",
    kansha: "計画すれば達成する",
    sooji: "思いやりが必要",
    shigoto: "成果あり",
    gakumon: "研究 吉",
    renai: "相手の心がみえる",
    kenkou: "めまいに注意",
    ryokou: "",
    message: "吉 心の奥深くを 感じてください。そして手を差し伸べてください。もうすぐ、そのつぼみは叡智（えいち）の花を咲かせます。心に囚われくち果ててしまわぬよう、心の主でいてください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。"
  },
  {
    num: 41,
    title: "おみくじ_41",
    subtitle: "",
    tehanasu: "",
    kansha: "運が味方する",
    sooji: "争いなく良好",
    shigoto: "一人作業がはかどる",
    gakumon: "探求していくと良い",
    renai: "考えが深まりやすい",
    kenkou: "憂鬱（ゆううつ）にならないこと",
    ryokou: "海 湖 水辺 など",
    message: "など あなたの命のもととなるご先祖様、そしてあなたに協力している他の様々な力に感謝の気持を伝えてください。\u0003あなたは強い運に守られていることを実感し、感謝てください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。"
  },
  {
    num: 42,
    title: "おみくじ_42",
    subtitle: "",
    tehanasu: "",
    kansha: "成ると信じる心を強く持て",
    sooji: "柔軟に対応できる",
    shigoto: "自立できる",
    gakumon: "専門分野を追求する時",
    renai: "魂との繋がりが強まる",
    kenkou: "ゆっくりな食事を心がけること",
    ryokou: "",
    message: "場所 虹の橋がかかりました。新しい情報に柔軟でいてください。瞬間的に、直感的に物事の本質を見抜くことができ、進むべき道が明確に見えていることを確認してください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。"
  },
  {
    num: 43,
    title: "おみくじ_43",
    subtitle: "",
    tehanasu: "",
    kansha: "夢は現実になると信じること",
    sooji: "柔らかな言葉で対処すること",
    shigoto: "人をまとめる力を発揮",
    gakumon: "執筆の才能が開花",
    renai: "愛の発展",
    kenkou: "風邪に注意",
    ryokou: "",
    message: "出 吉 風が、あなたと、あなたを取り巻く人々を愛の空間へ導きました。あなたの思想、喜び、創造性は人々の心を温かく包み、勇気をふるい立たせます。情熱的に語ることで、その思いは現実になる、と信じてください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。"
  },
  {
    num: 44,
    title: "おみくじ_44",
    subtitle: "",
    tehanasu: "",
    kansha: "願いが形になる",
    sooji: "言葉の攻撃に注意",
    shigoto: "人々をまとめる力を発揮",
    gakumon: "執筆の才能が開花",
    renai: "気持ちを伝える時",
    kenkou: "疲れやすい",
    ryokou: "",
    message: "場に幸有 内に秘めていた豊かな感性は今、ふつふつと泉のように湧き出しています。そして、それを多くの人たちが必要と待っています。喜び、楽しみながら、それを形にすることに集中してください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。"
  },
  {
    num: 45,
    title: "おみくじ_45",
    subtitle: "",
    tehanasu: "",
    kansha: "行動力が決め手",
    sooji: "感情的にならないこと",
    shigoto: "表現力アップ",
    gakumon: "感性を磨くと時",
    renai: "自分の心と深く向き合うこと",
    kenkou: "吹き出物に注意",
    ryokou: "",
    message: "吉 恐れることはありません。すべては上手く行っています。あらゆる状況を見極め、見通す力は更に増し、あなたの才能は開花しました。すべてのものと波長を合わせることに集中し、自分の心と深く関わっていてください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。"
  },
];

const HEADER_IMAGE_URI = 'https://musubijima.com/wp-content/uploads/2021/02/musubi_omikuji_head.png';

function getTodayOmikujiNum(): number {
  const date = new Date();
  return ((date.getDate() + date.getMonth()) % 45) + 1;
}

function getRandomOmikujiNum(): number {
  return Math.floor(Math.random() * 45) + 1;
}

interface FortuneGridItem {
  label: string;
  value: string;
}

function buildFortuneGrid(item: OmikujiItem): FortuneGridItem[] {
  const entries: { label: string; key: keyof OmikujiItem }[] = [
    { label: '願望', key: 'kansha' },
    { label: '争事', key: 'sooji' },
    { label: '仕事', key: 'shigoto' },
    { label: '学問', key: 'gakumon' },
    { label: '恋愛', key: 'renai' },
    { label: '健康', key: 'kenkou' },
    { label: '旅行', key: 'ryokou' },
  ];
  return entries
    .filter((e) => {
      const val = item[e.key];
      return typeof val === 'string' && val.length > 0;
    })
    .map((e) => ({ label: e.label, value: item[e.key] as string }));
}

function HeaderImage() {
  if (Platform.OS === 'web') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <View style={styles.headerImageWrapper}>
        <img
          src={HEADER_IMAGE_URI}
          alt="むすび島おみくじ"
          style={{ width: '100%', maxWidth: 360, height: 'auto', borderRadius: 16 }}
        />
      </View>
    );
  }

  const { Image: RNImage } = require('react-native');
  return (
    <View style={styles.headerImageWrapper}>
      <RNImage
        source={{ uri: HEADER_IMAGE_URI }}
        style={styles.headerImage}
        resizeMode="contain"
      />
    </View>
  );
}

export default function OmikujiScreen() {
  const [currentNum, setCurrentNum] = useState<number>(getTodayOmikujiNum());
  const [revealed, setRevealed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const currentItem = OMIKUJI_DATA.find((d) => d.num === currentNum) ?? OMIKUJI_DATA[0];
  const fortuneGrid = buildFortuneGrid(currentItem);

  const revealResult = (num: number) => {
    setCurrentNum(num);
    setRevealed(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleDraw = () => {
    revealResult(getTodayOmikujiNum());
  };

  const handleRedraw = () => {
    revealResult(getRandomOmikujiNum());
  };

  return (
    <LinearGradient colors={['#0D0B1E', '#1A1545', '#0D0B1E']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeaderImage />

        {!revealed ? (
          <View style={styles.drawSection}>
            <Text style={styles.title}>むすび島おみくじ</Text>
            <Text style={styles.subtitle}>今日のあなたへのメッセージ</Text>

            <TouchableOpacity style={styles.drawButton} onPress={handleDraw} activeOpacity={0.8}>
              <LinearGradient
                colors={['#E8C547', '#D4A017']}
                style={styles.drawButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.drawButtonText}>おみくじを引く</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.resultSection,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.resultTitle}>
              {currentItem.subtitle && currentItem.subtitle.length > 0
                ? currentItem.subtitle
                : currentItem.title.startsWith('おみくじ_')
                  ? `第${currentItem.num}番のおみくじ`
                  : currentItem.title}
            </Text>

            <View style={styles.divider} />

            {currentItem.tehanasu.length > 0 && (
              <View style={styles.tehanasuBox}>
                <Text style={styles.tehanasuLabel}>【手放す】</Text>
                <Text style={styles.tehanasuText}>{currentItem.tehanasu}</Text>
              </View>
            )}

            {fortuneGrid.length > 0 && (
              <View style={styles.fortuneGrid}>
                {fortuneGrid.map((item, index) => (
                  <View
                    key={item.label}
                    style={[
                      styles.fortuneCell,
                      index === fortuneGrid.length - 1 && fortuneGrid.length % 2 !== 0
                        ? styles.fortuneCellFull
                        : undefined,
                    ]}
                  >
                    <Text style={styles.fortuneLabel}>{item.label}</Text>
                    <Text style={styles.fortuneValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{currentItem.message}</Text>
            </View>

            <TouchableOpacity
              style={styles.redrawButton}
              onPress={handleRedraw}
              activeOpacity={0.8}
            >
              <Text style={styles.redrawButtonText}>引き直す</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerImageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerImage: {
    width: 320,
    height: 160,
    borderRadius: 16,
  },
  drawSection: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E8C547',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 40,
    textAlign: 'center',
  },
  drawButton: {
    width: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  drawButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
  drawButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  resultSection: {
    width: '100%',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E8C547',
    marginBottom: 12,
    textAlign: 'center',
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: 'rgba(232, 197, 71, 0.4)',
    marginBottom: 20,
  },
  tehanasuBox: {
    width: '100%',
    backgroundColor: 'rgba(196, 181, 253, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.25)',
  },
  tehanasuLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C4B5FD',
    marginBottom: 8,
  },
  tehanasuText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  fortuneGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fortuneCell: {
    width: '48%',
    backgroundColor: 'rgba(232, 197, 71, 0.06)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(232, 197, 71, 0.15)',
  },
  fortuneCellFull: {
    width: '100%',
  },
  fortuneLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E8C547',
    marginBottom: 4,
  },
  fortuneValue: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  messageBox: {
    width: '100%',
    backgroundColor: 'rgba(232, 197, 71, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(232, 197, 71, 0.2)',
  },
  messageText: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 28,
    textAlign: 'center',
  },
  redrawButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.4)',
    backgroundColor: 'rgba(196, 181, 253, 0.08)',
  },
  redrawButtonText: {
    color: '#C4B5FD',
    fontSize: 16,
    fontWeight: '600',
  },
});
