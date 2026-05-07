import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HEADER_IMAGE_URL =
  'https://musubijima.com/wp-content/uploads/2021/02/musubi_mitama_head.png';

interface MitamaCard {
  num: number;
  title: string;
  subtitle: string;
  shushi: string;
  kotodama: string;
  message: string;
  img: string;
}

const MITAMA_CARDS: MitamaCard[] = [
  { num: 1, title: '第1番のおみくじ', subtitle: '不思議な力に導かれる', shushi: '手放す', kotodama: '人々の先頭に立ち、多くの人を導く使命があることを知ること 人間的深さと魅力が深まる時。創造力、直感力を活かして人のために力を惜しみなく出すと良い。', message: 'あなたが求める力は既にあなたの手の中にあることに気づいてください。私欲や邪念を持たない純粋な広い心で多く人を導く使命に気づいてください。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_27.jpg' },
  { num: 2, title: '第2番のおみくじ', subtitle: '時が来るのを気長に待て', shushi: '手放す', kotodama: '思考に囚われず、精神世界に頼り過ぎず、自分の第六感を信じること 精神世界と繋がりやすい。神仏に縁のある地を訪れると良い。', message: '今はそのことが理解できなくても、いつの日かわかる時が訪れます。批判をせず、非難もせず、ただ、その時が来る日まで待つのです。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_28.jpg' },
  { num: 3, title: '第3番のおみくじ', subtitle: '真の心を確かめよ', shushi: '手放す', kotodama: '情報に惑わされないように、常に心ある道を選択する習慣を付ける 理想的感情に流されないこと。自分の向かうべき方向を明確にする時。', message: 'に迷った時こそ自身に問いかけるのです。「右の道に心があるのか？」「左の道に心があるのか？」決して、人に聞いてはなりません。仮に選んだ道が茨の道であったとしても、心がある道こそ進むべき道なのです。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_29.jpg' },
  { num: 4, title: '第4番のおみくじ', subtitle: '結果が出る', shushi: '手放す', kotodama: 'こだわりや依存心に気づいたら、その感情を手放すことを実践する 複雑だった物事が、ひとつひとつ明らかとなって安定していく。', message: '吉 複雑なものごとも一つ一つ明らかになり、安定を手にしていきます。古いものは手放し、新たなステージへ行く準備をしてください。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_30.jpg' },
  { num: 5, title: '第5番のおみくじ', subtitle: '現実になる', shushi: '手放す', kotodama: '', message: 'は、現実になろうとしています。あなたの直感は物事の本質を見抜き、未来を正確に予見しています。大胆にかつマイペースに行動してください。 現実的、霊的、精神的な原理を使い、ものごとを立ち上げていきましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_31.jpg' },
  { num: 6, title: '第6番のおみくじ', subtitle: '忍耐が必要', shushi: '手放す', kotodama: '', message: 'のバランスを、平等にしていてください。すべては美しく事が運びます。どちらかにエネルギーがかたよらないよう注意深くいてください。 自他の境界線を明確にし、全体的な調和を保ちながら協力しあう関係を大切にしましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_32.jpg' },
  { num: 7, title: '第7番のおみくじ', subtitle: '勢いをつけて進むと良い', shushi: '手放す', kotodama: '', message: 'ころに幸あり 炎の泉。求めればあなたの必要なエネルギーが永遠に湧き出す泉です。恐れ、憂え、いらだちの感情は全て手放してください。すべては前進するエネルギーへと形を変るでしょう。あなたは今、大きく前進する時を迎えています。 建設的な創造エネルギーを表現し、開放しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_33.jpg' },
  { num: 8, title: '第8番のおみくじ', subtitle: '楽観的に待て', shushi: '手放す', kotodama: '', message: 'ころに幸あり あなたは今、創造エネルギーを受け取り、松明に炎を点しました。その炎は、知恵と直感によって人々の心に響くものを、癒すものを表現するよう求めています。楽観的でいてください。あなたの愛を持った行動が、人々の心を強く引きつけていきます。 建設的な創造エネルギーを表現し、開放しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_34.jpg' },
  { num: 9, title: '第9番のおみくじ', subtitle: '人の喜びが伴うものは叶う', shushi: '手放す', kotodama: '', message: '両手を広げてください。心を開いてください。抑圧されたエネルギーは陽の光を受け、正のエネルギーと変わりました。あなたに必要な力は万全です。ストレートに、行動を起こしてください。 建設的な創造エネルギーを表現し、開放しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_35.jpg' },
  { num: 10, title: '第10番のおみくじ', subtitle: '叶う 希望を持て', shushi: '手放す', kotodama: '', message: 'がよい 精神世界より、美しく豊かな想像エネルギーを受け取りました。あなたの表現が人々に安らぎと希望を与えていきます。どんな人とも心を通わせる準備をしてください。 建設的な創造エネルギーを表現し、開放しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_36.jpg' },
  { num: 11, title: '第11番のおみくじ', subtitle: '地道な努力が必要', shushi: '手放す', kotodama: '', message: '要 高い理想を持ち続けてください。あなたの思想は現実のものとなりつつあります。全ての環境が調和するよう入念に準備を進めてください。気づかいを怠らないようにしてくたさい。あなたの前向きな行動が人々に勇気を与えていきます。 建設的な創造エネルギーを表現し、開放しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_37.jpg' },
  { num: 12, title: '第12番のおみくじ', subtitle: '希望は高く掲げよ', shushi: '手放す', kotodama: '他人の苦しみや悲しみを受けやすい。情をかけ過ぎないこと 周りの人々に情をかけ過ぎると、本来の自分の意思を見失いがち。他人の苦しみや悲しみは理解するにとどまる事。', message: 'い 苦しみや悲しみは浄化され、あなたは様々な方法によって教え、導かれていきます。執着を外してください。そして、すべての人に優しく平等でいてください。 内なる知恵に従い、誠実で高潔な人生を送り、他の人々を導く生きた手本となることを意識してください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_38.jpg' },
  { num: 13, title: '第13番のおみくじ', subtitle: '全身全霊で取り組めば叶う', shushi: '手放す', kotodama: '', message: '楽しめる場所 大いなる愛があなたを包み込んでいます。悲しみや怒りの感情は浄化され、その思いは愛へと変っていきます。その変化を大らかな気持ちで受け止めてください。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_39.jpg' },
  { num: 14, title: '第14番のおみくじ', subtitle: '全ては丸く収まる', shushi: '手放す', kotodama: '', message: 'すべてを受け入れ、すべてを許してください。聡明な心でいてください。 すべて、これがよいのです。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_40.jpg' },
  { num: 15, title: '第15番のおみくじ', subtitle: '世の中の貢献になるものは叶う', shushi: '手放す', kotodama: '', message: 'かに、穏やかに打ち寄せた波は、月に照らされ美しい音を奏でています。目を閉じて、耳を澄ましてください。せき止められていた様々な物事は今、美しい音によって流れ始めました。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_41.jpg' },
  { num: 16, title: '第16番のおみくじ', subtitle: '勢いをつけて進め', shushi: '手放す', kotodama: '', message: 'と出会い有り 月のしずくは人々の心の乾きを潤し、あなたの思想を受け入れる準備が整ったことを知らせています。過剰な心の動きに注意し、心の平和を保ち続けていてください。あなたの努力が形となる日は近づいています。あなたの行いが人々に感動と導きを与えることを強くイメージしてください。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_42.jpg' },
  { num: 17, title: '第17番のおみくじ', subtitle: '強い意志が成功を招く', shushi: '手放す', kotodama: '', message: 'まによって生まれた波動は、次々と周囲に伝わっています。「創造性を、力強い行動によって物質的な成功に結びつける」ということに集中してください。人や社会との繋がりを更に広げる時を迎えています。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_43.jpg' },
  { num: 18, title: '第18番のおみくじ', subtitle: '神秘な力が働く時', shushi: '手放す', kotodama: '', message: '月光によって美しい姿を現した白い花は、善悪、真偽を正しく見ることを手助けしています。神秘的な力は増し、直感は冴え、創造力豊かな時を迎えています。 霊的、精神的な見方を養いながら、芸術、精神、世界、心理学などを通して人々を導いてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_44.jpg' },
  { num: 19, title: '第19番のおみくじ', subtitle: '心から奇跡を信じること', shushi: '手放す', kotodama: '', message: 'べては上手くいっています。心配ごとはすべて天に預けてください。あなたは大いなる愛に守られ、導かれています。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_45.jpg' },
  { num: 20, title: '第20番のおみくじ', subtitle: '太陽を拝むと道が拓ける', shushi: '手放す', kotodama: '', message: 'る場所 先を見通す力が高まっています。自分の信じる道を貫く決心を固めてください。 依存心や孤独に対する不安はすべて天に委ね、大らかな気持ちで進んでください。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_27.jpg' },
  { num: 21, title: '第21番のおみくじ', subtitle: '道はひらける', shushi: '手放す', kotodama: '', message: 'る場所 太陽の光によってすべては透明に、ものごとはあるがままに見えています。そのままを見ること、そのままを受け入れること、純粋な透明な心で物事を観察してください。 理想と現実の接点を見つけ、自分自身、世の中、現実を受容しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_28.jpg' },
  { num: 22, title: '第22番のおみくじ', subtitle: '分析して更なる行動が必要', shushi: '手放す', kotodama: '', message: 'べての物事は明確に見えています。概念を捨て物事をそのまま見てください。あなたは、正しい判断をしています。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_29.jpg' },
  { num: 23, title: '第23番のおみくじ', subtitle: '憂いは禁物', shushi: '手放す', kotodama: '', message: '決まれば恐れはありません。ただ目の前のするべきことを着実に行なってください。実りの杯は手を伸ばせばすぐそこに、あなたの勇気の中にあります。受け取る準備をしてください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_30.jpg' },
  { num: 24, title: '第24番のおみくじ', subtitle: '時まだ遠し', shushi: '手放す', kotodama: '', message: 'す環境 吉 急いではいけません。大海を優雅に泳ぐ魚のように、ゆっくりマイペースに進んでください。流されることなく、周りの状況を客観的に見てください。今、未来を見通す力が与えられています。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_31.jpg' },
  { num: 25, title: '第25番のおみくじ', subtitle: '与えることに集中する時', shushi: '手放す', kotodama: '', message: 'どめること 現実的に必要となるものはすべて手に入る愛のポケット。 あなたが聡明な心で願ったものはすべて手に入ります。手にしたものは、惜しみなく他の人々へも分け与えてください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_32.jpg' },
  { num: 26, title: '第26番のおみくじ', subtitle: '行動力で決まる', shushi: '手放す', kotodama: '', message: '場所 あなたの助けを待っている人が近くにいます。真実と正義によって解決するよう手助けをしてください。そして、癒してください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_33.jpg' },
  { num: 27, title: '第27番のおみくじ', subtitle: '準備不足 分析すること', shushi: '手放す', kotodama: '', message: '吉 難しかったことが、解決へと向かいます。すべては正しく進んでいます。今楽しむことに集中してください。 権力や名声、豊かさを手に入れ、それを世の中に役立てましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_34.jpg' },
  { num: 28, title: '第28番のおみくじ', subtitle: 'コツコツ積み上げよ', shushi: '手放す', kotodama: '', message: '良い 太陽へ顔を向けてください。安定への基礎はしっかりと根を下ろしました。過去の結果や形など、こだわりはすべて手放し、一つ一つ形になるよう強い意志で階段を進んでください。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_35.jpg' },
  { num: 29, title: '第29番のおみくじ', subtitle: '欲求を強く思えば引き寄せる', shushi: '手放す', kotodama: '', message: 'こと あなたの努力は認められ、実を結ぼうとしています。理性と心のバランスを崩さないよう、ただ実ることを強く願い、今は、欲求を強く持ち続けていてください。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_36.jpg' },
  { num: 30, title: '第30番のおみくじ', subtitle: 'あと一歩 強く願うこと', shushi: '手放す', kotodama: '', message: 'こと あなたの思想や行動、決断は「そのままでよい。目指す道は歩みやすくなった。」と、ロバは言っています。 忍耐強く着実に歩み続け、肉体、感情、精神の安定を手に入れ、自分という土台をしっかりと踏み固めましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_37.jpg' },
  { num: 31, title: '第31番のおみくじ', subtitle: '新たな願いをたてる時', shushi: '手放す', kotodama: '', message: 'くと良い 大空を飛びまわった鳥はある日、単調な毎日を退屈に思い、種を育てることを思いつきました。今、あなたも、新たな目的や方向性を見つけ出す時が来たことを告げています。 目的を定めた訓練と経験によって本当の自由を得ることができます。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_38.jpg' },
  { num: 32, title: '第32番のおみくじ', subtitle: '手に入る', shushi: '手放す', kotodama: '', message: 'る 自由と開放の羽を手に入れました。今は、どんな環境でも飛び込み楽しむことができます。すぐに行動してください。 目的を定めた訓練と経験によって本当の自由を得ることができます。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_39.jpg' },
  { num: 33, title: '第33番のおみくじ', subtitle: '引き寄せる', shushi: '手放す', kotodama: '', message: '縁あり 願いが叶いやすい時です。引き寄せたいものが手に入ったと強くイメージしてください。あなたに必要なものはすべて与えられることを信じて祈り続けてください。 目的を定めた訓練と経験によって本当の自由を得ることができます。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_40.jpg' },
  { num: 34, title: '第34番のおみくじ', subtitle: '必要であれば叶う', shushi: '手放す', kotodama: '', message: 'すると良い 束縛された環境を手放し、自由を追求するよう鳥が唄っています。宇宙のリズムと調和し、新たな環境の中で冒険する時がきたのです。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_41.jpg' },
  { num: 35, title: '第35番のおみくじ', subtitle: '静かに自分の声に集中する時', shushi: '手放す', kotodama: '', message: 'かな穏やかな環境に身を置き、一人の時間を大切にしてください。今は自分の心の声をしっかり聞き取ることに集中してください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_42.jpg' },
  { num: 36, title: '第36番のおみくじ', subtitle: '答えは目の前にある', shushi: '手放す', kotodama: '', message: '保てる環境 吉 魂と宇宙は繋がり、新しい可能性を示す時が来ました。理想を創造的に表現することに集中してください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_43.jpg' },
  { num: 37, title: '第37番のおみくじ', subtitle: '思いが通じる', shushi: '手放す', kotodama: '', message: '種）が、大空へ飛び立ちました。その種は「謙虚でいること」「誠実であること」「人々に深い理解を示すこと」「手にした知識を人々のために使うこと」と教えています。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_44.jpg' },
  { num: 38, title: '第38番のおみくじ', subtitle: '願いを明確に', shushi: '手放す', kotodama: '', message: '縁あり 未来の扉を開く鍵を手に入れました。問題は解決へ向かいます。鍵は「新しい観点によって物事を切り開き、開拓すること。」を強く望んでいます。目的を明確にし、扉を強く押し開いてください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_45.jpg' },
  { num: 39, title: '第39番のおみくじ', subtitle: '新たな願望を抱け', shushi: '手放す', kotodama: '', message: '吉 様々な自然の厳しさを経験することで教訓を得た鳥は、ついに自由を手に入れました。あなたも、どんな環境や境遇の変化にもすぐに仲良くなることができる柔軟さを身につけています。自由に大空を飛びまわる鳥のように、あなたも羽ばたく時がきたのです。 目的を定めた訓練と経験によって本当の自由を得ることができます。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_27.jpg' },
  { num: 40, title: '第40番のおみくじ', subtitle: '計画すれば達成する', shushi: '手放す', kotodama: '', message: '吉 心の奥深くを 感じてください。そして手を差し伸べてください。もうすぐ、そのつぼみは叡智（えいち）の花を咲かせます。心に囚われくち果ててしまわぬよう、心の主でいてください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_28.jpg' },
  { num: 41, title: '第41番のおみくじ', subtitle: '運が味方する', shushi: '手放す', kotodama: '', message: 'など あなたの命のもととなるご先祖様、そしてあなたに協力している他の様々な力に感謝の気持を伝えてください。あなたは強い運に守られていることを実感し、感謝てください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_29.jpg' },
  { num: 42, title: '第42番のおみくじ', subtitle: '成ると信じる心を強く持て', shushi: '手放す', kotodama: '', message: '場所 虹の橋がかかりました。新しい情報に柔軟でいてください。瞬間的に、直感的に物事の本質を見抜くことができ、進むべき道が明確に見えていることを確認してください。 自分、他人、魂を信頼して、心を開き、知り得た知識や知恵を世の中に提供しましょう。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_30.jpg' },
  { num: 43, title: '第43番のおみくじ', subtitle: '夢は現実になると信じること', shushi: '手放す', kotodama: '', message: '出 吉 風が、あなたと、あなたを取り巻く人々を愛の空間へ導きました。あなたの思想、喜び、創造性は人々の心を温かく包み、勇気をふるい立たせます。情熱的に語ることで、その思いは現実になる、と信じてください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_31.jpg' },
  { num: 44, title: '第44番のおみくじ', subtitle: '願いが形になる', shushi: '手放す', kotodama: '', message: '場に幸有 内に秘めていた豊かな感性は今、ふつふつと泉のように湧き出しています。そして、それを多くの人たちが必要と待っています。喜び、楽しみながら、それを形にすることに集中してください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_32.jpg' },
  { num: 45, title: '第45番のおみくじ', subtitle: '行動力が決め手', shushi: '手放す', kotodama: '', message: '吉 恐れることはありません。すべては上手く行っています。あらゆる状況を見極め、見通す力は更に増し、あなたの才能は開花しました。すべてのものと波長を合わせることに集中し、自分の心と深く関わっていてください。 感受性をプラスに活かし、心から湧き出す表現を世の中に伝えてください。', img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_33.jpg' },

];

const MAX_MESSAGE_LENGTH = 400;

function truncateMessage(message: string): string {
  if (message.length <= MAX_MESSAGE_LENGTH) return message;
  return message.slice(0, MAX_MESSAGE_LENGTH) + '...';
}

function HeaderImage() {
  if (Platform.OS === 'web') {
    return (
      <img
        src={HEADER_IMAGE_URL}
        alt="道力カード"
        style={{
          width: '100%',
          display: 'block',
        } as any}
      />
    );
  }
  return (
    <Image
      source={{ uri: HEADER_IMAGE_URL }}
      style={{
        width: '100%',
        height: 300,
        resizeMode: 'cover',
      }}
    />
  );
}

function CardImage({ uri }: { uri: string }) {
  if (Platform.OS === 'web') {
    return (
      <img
        src={uri}
        alt="カード画像"
        style={{
          width: '100%',
          maxWidth: 300,
          height: 'auto',
          borderRadius: 12,
        }}
      />
    );
  }
  return (
    <Image
      source={{ uri }}
      style={{
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: 12,
        resizeMode: 'cover',
      }}
    />
  );
}

export default function MitamaScreen() {
  const [selectedCard, setSelectedCard] = useState<MitamaCard | null>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleDrawCard = () => {
    const card = MITAMA_CARDS[Math.floor(Math.random() * MITAMA_CARDS.length)];
    setSelectedCard(card);
    setIsDrawn(true);
    scaleAnim.setValue(0);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleReset = () => {
    setSelectedCard(null);
    setIsDrawn(false);
    scaleAnim.setValue(0);
  };

  return (
    <LinearGradient
      colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <View style={styles.headerImageWrap}>
          <HeaderImage />
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>道力カード</Text>
          <Text style={styles.subtitle}>
            心を静めて、直感で1枚引いてください。{'\n'}
            今のあなたに必要な道力のメッセージが届きます。
          </Text>
        </View>

        {!isDrawn ? (
          /* Card Back / Draw Button */
          <TouchableOpacity
            style={styles.drawButton}
            onPress={handleDrawCard}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#1E1B4B', '#312E81', '#1E1B4B']}
              style={styles.cardBackGradient}
            >
              <View style={styles.starPattern}>
                <Text style={styles.starLarge}>&#10022;</Text>
                <View style={styles.starRow}>
                  <Text style={styles.starSmall}>&#10023;</Text>
                  <Text style={styles.starMed}>&#10022;</Text>
                  <Text style={styles.starSmall}>&#10023;</Text>
                </View>
                <Text style={styles.starLarge}>&#10022;</Text>
              </View>
              <View style={styles.cardBackBorder}>
                <Text style={styles.drawButtonText}>カードを引く</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : selectedCard ? (
          /* Result Display */
          <Animated.View
            style={[
              styles.resultContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: scaleAnim,
              },
            ]}
          >
            {/* Card Container */}
            <View style={styles.cardContainer}>
              {/* Card Image */}
              <View style={styles.cardImageWrap}>
                <CardImage uri={selectedCard.img} />
              </View>

              {/* Card Title */}
              <Text style={styles.cardTitle}>
                {selectedCard.subtitle || `第${selectedCard.num}番`}
              </Text>

              {/* Info Row: 願望 & 手放す */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>願望</Text>
                  <Text style={styles.infoValue}>{selectedCard.subtitle}</Text>
                </View>
                {selectedCard.kotodama ? (
                  <>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>手放す</Text>
                      <Text style={styles.infoValue} numberOfLines={3}>{selectedCard.kotodama}</Text>
                    </View>
                  </>
                ) : null}
              </View>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* Message */}
              <ScrollView
                style={styles.messageScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.cardMessage}>
                  {truncateMessage(selectedCard.message)}
                </Text>
              </ScrollView>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(127,119,221,0.3)', 'rgba(109,40,217,0.3)']}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>もう一度引く</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerImageWrap: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E8C547',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* Card Back */
  drawButton: {
    width: width * 0.7,
    aspectRatio: 0.65,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#7F77DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  cardBackGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232,197,71,0.4)',
    borderRadius: 20,
  },
  starPattern: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  starLarge: {
    fontSize: 40,
    color: '#E8C547',
  },
  starMed: {
    fontSize: 32,
    color: '#C4B5FD',
  },
  starSmall: {
    fontSize: 20,
    color: 'rgba(232,197,71,0.5)',
  },
  cardBackBorder: {
    borderWidth: 1,
    borderColor: 'rgba(232,197,71,0.5)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  drawButtonText: {
    fontSize: 18,
    color: '#E8C547',
    fontWeight: '700',
    letterSpacing: 2,
  },

  /* Result */
  resultContainer: {
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  cardImageWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8C547',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#C4B5FD',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  cardDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(232,197,71,0.4)',
    marginBottom: 16,
  },
  messageScroll: {
    maxHeight: 240,
    width: '100%',
  },
  cardMessage: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 26,
  },

  /* Retry */
  retryButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.4)',
  },
  retryButtonText: {
    color: '#C4B5FD',
    fontSize: 16,
    fontWeight: '600',
  },
});
