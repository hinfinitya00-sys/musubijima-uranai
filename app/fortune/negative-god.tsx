import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Animated, Platform, Image, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function reduceToRange(n: number, max: number): number {
  let num = Math.abs(n);
  while (num > max) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
    if (num > max) num = ((num - 1) % max) + 1;
  }
  return num || 1;
}

function calcGodNumber(year: number, month: number, day: number, hour: number): number {
  const sum = year + month + day + hour;
  return reduceToRange(sum, 19);
}

const INTRO_TEXT = `ネガティブ神とエジプト守護神占い

もし、自分の心を曇らせる消極的な感情を、前向きな力へと変えることができたなら。

毎日はもっと軽やかに、もっと自分らしく輝き始めるかもしれません。

けれど、人は誰でも不安や恐れ、怒りや嫉妬、迷いといった感情を抱くものです。

「こんなことを考えてはいけない」
「こんな自分ではダメだ」

そう思い、自分自身を責めてしまうこともあるでしょう。

しかし、その感情もまた、あなたの大切な一部です。

本当の意味で前向きになるためには、ネガティブな感情を無理に消そうとするのではなく、まずは「これも今の私なのだ」と受け入れることが大切なのかもしれません。

この占いでは、あなたの心の中にある消極的な感情を「ネガティブ神」、その感情の奥に眠る可能性や本来の力を呼び覚ます存在を「エジプト守護神」として表現しています。

ネガティブ神は、あなたを苦しめるための存在ではありません。不安や怒り、恐れや迷いなど、普段は見過ごしてしまう心の声を届けてくれる案内人です。

そしてエジプト守護神は、その感情の奥に隠された才能や魅力、進むべき方向を照らし出してくれる存在。

この占いには、19柱のネガティブ神と19柱のエジプト守護神が登場します。それぞれの神は、あなたの心に存在する感情や可能性を象徴しています。

今のあなたに現れた神々は、偶然ではありません。それは、あなた自身の心が今必要としているメッセージなのです。

さあ、神々の声に耳を澄ませ、まだ見ぬ自分との出会いの旅へ出かけましょう。`;

const NEGATIVE_GODS = [
  {
    num: 1,
    name: 'キョーフ（恐怖）',
    negDesc: '人間の意識の中に入り込み、「恐怖の種」を植え付けて育てる神。\n\nその種は、「失敗したらどうしよう」「傷ついたらどうしよう」「嫌われたらどうしよう」という思いを栄養にして少しずつ成長していく。\n\n種が大きくなるほど、人はまだ起きていない未来を恐れ、自分の可能性にブレーキをかけてしまう。\n\nしかしキョーフは、ただ人を苦しめる存在ではない。あなたが本当に守りたいものや、大切に思っているものを教えてくれる存在でもある。',
    guardianName: 'ラー（エジプト守護神）',
    guardianDesc: '天空の船に乗り、毎日太陽を運びながら世界に光を届ける太陽神。\n\nラーは人の心にも光を届け、「希望」の炎を燃やすように働きかける。未来への希望が生まれると、人は自然と前を向き、自ら行動する力を取り戻していく。\n\nラーは、あなたの中に眠る勇気や可能性を照らし出し、新しい一歩を踏み出す力を与えてくれるだろう。',
    handle: '恐怖をなくそうとする必要はありません。まずは「私は何を恐れているのだろう」と、自分の心を静かに見つめてみましょう。\n\n「こうなったら嬉しい」という希望を持って一歩行動してみてください。希望を胸に抱き進むことで、恐怖は自然と小さくなっていくでしょう。',
    img: require('../../assets/negative/neg_01.jpg'),
  },
  {
    num: 2,
    name: 'タイダー（怠惰）',
    negDesc: '人間の心に忍び込み、「あとでやればいい」「今はまだいい」とささやく神。\n\n考えることや行動することに対して「めんどくさい」という気持ちを生み出し、人から思考力や行動力を少しずつ奪っていく。\n\nしかしタイダーは、ただ人を怠けさせるためだけに存在しているわけではない。その奥には、「失敗したくない」「変化が怖い」「自信がない」といった隠れた気持ちが眠っていることもある。',
    guardianName: 'シュー（エジプト守護神）',
    guardianDesc: '人々が生きるために必要な大気と太陽の光を司り、生命に息吹を与える神。\n\nシューは、あなたが本当にやりたいことや進むべき道を見つけられるよう働きかける。そして、その実現に必要な人や情報、機会を引き寄せ、チャンスをつかむための知恵を授けてくれる。',
    handle: 'タイダーの力は、「考えること」と「行動すること」をやめた時に強くなります。\n\n大きな一歩である必要はありません。まずは気になっていることを調べてみる、誰かに相談してみる、小さな行動を一つ起こしてみることから始めてみましょう。',
    img: require('../../assets/negative/neg_02.jpg'),
  },
  {
    num: 3,
    name: 'ヒテー（否定）',
    negDesc: '人間の心に入り込み、「どうせ無理だ」「きっとうまくいかない」といった否定的な考えを繰り返し生み出す神。\n\nその言葉は小さなささやきから始まるが、何度も繰り返されることで心の中に根を張り、人の可能性や希望を少しずつ奪っていく。\n\nしかしヒテーは、ただ人を苦しめる存在ではない。その姿が現れる時は、自分自身の力や可能性を信じられなくなっている時でもある。',
    guardianName: 'テフヌト（エジプト守護神）',
    guardianDesc: '湿気や霧などの水の力を用いて太陽の熱を司る女神。求心力や受容性、必要なものを引き寄せる力を持つ存在として知られている。\n\nテフヌトは、あなたが本当に望む未来や目標を見つけられるよう導く。目標が明確になるほど心はぶれにくくなり、必要な出会いや機会が自然と引き寄せられていく。',
    handle: 'ヒテーのささやきが聞こえてきたら、「私は本当はどうなりたいのだろう」と自分に問いかけてみましょう。\n\n否定的な考えを追い払おうとするよりも、自分が目指す未来を具体的に思い描くことが大切です。',
    img: require('../../assets/negative/neg_03.jpg'),
  },
  {
    num: 4,
    name: 'ウーン（運）',
    negDesc: '人間の心に入り込み、「自分は運が悪い」「どうせうまくいかない」という思いを育てる神。特に、お金や仕事、人間関係などへの不安を利用し、人を「足りないもの」ばかりに意識が向く状態へ導いていく。\n\nしかしウーンは、ただ不幸をもたらす存在ではない。その姿が現れる時は、あなたが豊かさよりも不足に意識を向けていることを知らせるサインでもある。',
    guardianName: 'オシリス（エジプト守護神）',
    guardianDesc: '温厚な性格を持ち、豊穣を司る穀物神。人々に法律を広め、作物の育て方や食べ物の調理法を教え、文明の発展に大きく貢献した存在。\n\nオシリスは、あなたが豊かな生活を築き、その喜びを周囲の人々と分かち合いながら生きる方法を教えてくれる。豊かさとは、単にお金や物を得ることだけではない。',
    handle: 'ウーンの力は、「足りない」「失いたくない」という思いに意識が集中するほど強くなります。\n\n今ある恵みに目を向けながら、自分が望む豊かな未来を具体的に思い描いてみましょう。豊かさに意識を向ける時、オシリスの力は大きく働きます。',
    img: require('../../assets/negative/neg_04.jpg'),
  },
  {
    num: 5,
    name: 'ウラミー（恨み）',
    negDesc: '人間の心に入り込み、過去の傷や悲しみを何度も思い出させる神。\n\n「あの人が悪い」「許せない」「仕返しをしたい」そんな思いを心の中で繰り返し育て、怒りや憎しみの感情で人を支配していく。\n\nしかしウラミーは、ただ争いを生み出すためだけに存在しているわけではない。その姿が現れる時は、あなたの心が深く傷つき、理解や癒やしを求めている時でもある。',
    guardianName: 'セト（エジプト守護神）',
    guardianDesc: '暴風や暗黒、戦いなど、強大で破壊的な力を司る神。その荒々しい力ゆえに恐れられることもあるが、危険を見抜く鋭い洞察力と強い判断力を持つ存在でもある。\n\nセトは、人との関わりの中で何が調和を生み、何が争いを生むのかを見極める知恵を授ける。',
    handle: 'ウラミーの力は、怒りや憎しみの感情を繰り返し思い返すほど強くなります。\n\n相手を変えようとする前に、自分が本当に求めているものは何かを考えてみましょう。自分と相手を尊重しながら、愛と思いやりのある関係を築こうとする時、セトの知恵はあなたを導きます。',
    img: require('../../assets/negative/neg_05.jpg'),
  },
  {
    num: 6,
    name: 'ムジヒ（無慈悲）',
    negDesc: '人の苦しみや悲しみに心を閉ざし、「自分には関係ない」と背を向けさせる神。\n\n困っている人を見ても見ないふりをしたり、誰かの痛みに共感できなくなったりと、人と人とのつながりを少しずつ遠ざけていく。\n\nしかしムジヒが現れる時は、あなた自身が疲れや傷つきによって心を守ろうとしているサインでもある。',
    guardianName: 'ケヘト（エジプト守護神）',
    guardianDesc: '出産を助け、新たな命に息吹を与える心優しい蛙の女神。生命の誕生と成長を見守り、弱き者を包み込む慈愛の力を象徴している。\n\nケヘトは、人の苦しみに寄り添う思いやりと、「少しでも力になりたい」という温かな心を育ててくれる。',
    handle: 'ムジヒの力は、人とのつながりを忘れた時に強くなります。\n\n誰かのためにできることは、大きなことでなくても構いません。笑顔を向けること。感謝を伝えること。相手の話に耳を傾けること。そんな小さな優しさの積み重ねが、固くなった心を少しずつほぐしていきます。',
    img: require('../../assets/negative/neg_06.jpg'),
  },
  {
    num: 7,
    name: 'ゴーヨク（強欲）',
    negDesc: '自分の利益や欲望ばかりに意識を向けさせる神。\n\n「もっと欲しい」「自分だけが得をしたい」「失いたくない」そんな思いを膨らませ、周囲の人の気持ちや立場を見えにくくしてしまう。\n\nしかしゴーヨクが現れる時は、心の奥に「足りない」という不安や欠乏感を抱えていることを知らせている場合がある。',
    guardianName: 'ベス（エジプト守護神）',
    guardianDesc: 'すべての人に幸福をもたらし、自ら楽器を奏でながら踊って邪気を払う歓喜と祝福、舞踊の神。\n\nベスは、「自分に何ができるだろう」と相手を思いやる心を育て、人との調和の中に本当の幸せがあることを教えてくれる。喜びは一人で抱え込むものではなく、誰かと分かち合うことでさらに大きくなる。',
    handle: 'ゴーヨクの力は、自分の利益だけに意識が向いた時に強くなります。\n\n何かを得ようとする前に、自分が周囲に与えられるものは何かを考えてみましょう。明るく思いやりの心で過ごしている時、ベスの祝福はあなたを包み込みます。',
    img: require('../../assets/negative/neg_07.jpg'),
  },
  {
    num: 8,
    name: 'ガイ（害）',
    negDesc: '心や身体が求めるままに欲望を満たそうとさせる神。\n\n「これくらい大丈夫」「もう少しだけ」「好きなものだから我慢したくない」そんな気持ちを繰り返しささやき、必要以上に食べたり飲んだりするよう仕向けていく。\n\nしかしガイが現れる時は、単なる食べ過ぎや欲望の問題ではなく、心や身体が何かの不足を補おうとしている場合もある。',
    guardianName: 'セルケト（エジプト守護神）',
    guardianDesc: '命を奪う毒を解く呪術を持ち、人々を有害な生き物の毒から守る医療の女神。\n\nセルケトは、身体を動かす機会や健康への意識を与えながら、「良いものであっても過ぎれば毒になる」という大切な教えを授けてくれる。健康は日々の小さな積み重ねによって育まれるもの。',
    handle: 'ガイの力は、欲望のままに行動し、自分の限界を見失った時に強くなります。\n\nよく味わって食べること。適度に身体を動かすこと。疲れた時はしっかり休むこと。そんな小さな心がけが、心身の調和を取り戻す助けになります。',
    img: require('../../assets/negative/neg_08.jpg'),
  },
  {
    num: 9,
    name: 'シット（嫉妬）',
    negDesc: '大切な人や大切なものを失う不安を心に植え付ける神。\n\n「あの人が離れていくかもしれない」「自分より誰かを選ぶのではないか」そんな疑いや不安を膨らませ、嫉妬や恨みの感情を生み出していく。\n\nしかし、シットが現れる時は、あなたが誰かを大切に思っている証でもある。その奥には、「失いたくない」「愛されたい」という純粋な願いが隠されているのである。',
    guardianName: 'イシス（エジプト守護神）',
    guardianDesc: '誕生、成長、発展、活力を象徴する女神であり、深い愛と知恵を備えた良妻賢母の神。\n\nイシスは、自分自身を愛することと、他者を愛することの大切さを教えてくれる。愛とは相手を縛る力ではなく、成長を見守り、支え、共に育んでいく力。',
    handle: 'シットの力は、不安や疑いに心を支配された時に強くなります。\n\n誰かと比べるのではなく、自分自身の価値を認めてみましょう。相手を信じること。自分を大切にすること。感謝や愛情を素直に伝えること。その積み重ねが、心に安心と信頼を育てていきます。',
    img: require('../../assets/negative/neg_09.jpg'),
  },
  {
    num: 10,
    name: 'キョエー（虚栄）',
    negDesc: '人からどう見られるかばかりを気にさせる神。\n\n「立派に見られたい」「認められたい」「すごいと思われたい」そんな思いを膨らませ、本当の自分よりも外見や評価を優先するよう仕向けていく。\n\nしかしキョエーが現れる時は、本当は自分に自信が持てず、心の奥で認められたいと願っているサインでもある。',
    guardianName: 'ネフティス（エジプト守護神）',
    guardianDesc: '死と再生、そして境界を司る送葬の女神。終わりを見守るだけでなく、腐敗したものの中から新たな命が生まれる変化の力を象徴している。\n\nネフティスは、偽りや見栄に覆われた心を静かに見つめ、その奥にある真実の自分へと導いてくれる。',
    handle: 'キョエーの力は、他人の評価や見た目ばかりに意識が向いた時に強くなります。\n\nできないことを認めること。間違いを受け入れること。ありのままの自分を大切にすること。自分の弱さと向き合い、見栄やうぬぼれから解放された時、心には揺るぎない不動の力が宿ります。',
    img: require('../../assets/negative/neg_10.jpg'),
  },
  {
    num: 11,
    name: 'リコ（利己）',
    negDesc: '自分の利益だけを優先させる神。\n\n「自分さえ得をすればいい」「損はしたくない」「人より有利になりたい」そんな思いを心に植え付け、周囲との調和よりも目先の利益を追い求めるよう仕向けていく。\n\nしかしリコが現れる時は、自分を守りたいという本能や、不安からくる欠乏感が強くなっている時でもある。',
    guardianName: 'トト（エジプト守護神）',
    guardianDesc: '宇宙の法則を定めた知恵の神。文字を発明し、法と秩序を築き、知識や科学の発展を導いた偉大な存在。\n\nトトは、すべての出来事には原因と結果があることを教え、大自然の法則に沿って生きる知恵を授けてくれる。まずは自らが他人に快く協力し、周囲との調和を育むこと。',
    handle: 'リコの力は、自分の利益ばかりを考えた時に強くなります。\n\n相手を尊重すること。約束を守ること。誠実に行動すること。その積み重ねが信頼を育み、人との縁を豊かにしていきます。',
    img: require('../../assets/negative/neg_11.jpg'),
  },
  {
    num: 12,
    name: 'ユージュ（優柔）',
    negDesc: '自分で考え、決断する力を鈍らせる神。\n\n「間違えたらどうしよう」「誰かが決めてくれた方が楽だ」「様子を見てからにしよう」そんな迷いを繰り返し生み出し、自分の意思よりも周囲の意見や流れに従うよう仕向けていく。\n\nしかしユージュが現れる時は、慎重さや失敗への恐れが強くなっている時でもある。本当はより良い選択をしたいと思うからこそ、決断できずに立ち止まっているのである。',
    guardianName: 'ホルス（エジプト守護神）',
    guardianDesc: '太陽と月の両目を持つ天空神。広い視野と鋭い洞察力を備え、真実と偽りを見抜く堅実な目を持つ守護神。\n\nホルスは、自ら考え、自ら選び、自ら行動する力を育ててくれる。大切なのは、自分で考え、自分で決める経験を積み重ねること。',
    handle: 'ユージュの力は、自分の考えを見失い、他人の意見に振り回された時に強くなります。\n\nまずは「自分はどうしたいのか」を静かに問いかけてみましょう。小さなことでも自分で決めること。その積み重ねが、自分らしい人生への道を開いていきます。',
    img: require('../../assets/negative/neg_12.jpg'),
  },
  {
    num: 13,
    name: 'フセイジツ（不誠実）',
    negDesc: '真実から目を背けさせる神。\n\n「少しくらいなら大丈夫」「本当のことを言うと困る」「自分だけは得をしたい」そんな思いを心に忍び込ませ、ウソやごまかし、裏切りへと導いていく。\n\nしかしフセイジツが現れる時は、自分を守りたい不安や恐れが強くなっている時でもある。真実と向き合う勇気を失った時、この神は心に影を落とすのである。',
    guardianName: 'マアト（エジプト守護神）',
    guardianDesc: '頭に戴く羽を真理の象徴とし、法、真実、秩序、正義を司る神。宇宙や世界が調和を保つための絶対的な真理を守る存在。\n\nマアトは、私利私欲にとらわれず、真心をもって人や物事に向き合うことの大切さを教えてくれる。誠実な言葉。誠実な行動。誠実な心。その積み重ねが信頼を育み、人との絆を強くしていく。',
    handle: '迷った時は、「これは誠実な行動だろうか」と自分に問いかけてみましょう。\n\n約束を守ること。真実を大切にすること。相手を尊重すること。正義の心を持ち、真実に従って生きる時、マアトの羽はあなたを守り導きます。',
    img: require('../../assets/negative/neg_13.jpg'),
  },
  {
    num: 14,
    name: 'ヒボウ（誹謗）',
    negDesc: '人の欠点や失敗ばかりに目を向けさせる神。\n\n「あの人はおかしい」「自分の方が正しい」「誰かに聞いてほしい」そんな思いを心に生み出し、悪口や批判を広げるよう仕向けていく。\n\nしかしヒボウが現れる時は、自分の不満や不安、満たされない思いを抱えている時でもある。他人を責めたくなる時ほど、本当に向き合うべき相手は自分自身なのかもしれない。',
    guardianName: 'メルセゲル（エジプト守護神）',
    guardianDesc: '罪を犯した者には厳しく戒めを与え、善き行いをする者には恵みを授ける女神。人の行いに応じた結果がもたらされるという、宇宙の公正な法則を象徴している。\n\nメルセゲルは、この世界が「振り子の法則」によって成り立っていることを教えてくれる。自らが発した言葉や行動は、形を変えて自分へと返ってくる。',
    handle: '誰かを批判したくなった時は、その言葉が自分に返ってきてもよいものかを考えてみましょう。\n\n感謝を伝えること。人の長所を見ること。励ましの言葉を選ぶこと。あなたが発する言葉は、未来への種でもあります。',
    img: require('../../assets/negative/neg_14.jpg'),
  },
  {
    num: 15,
    name: 'ネタミー（妬み）',
    negDesc: '自分にないものばかりに意識を向けさせる神。\n\n「もっとお金があれば」「あの人のようになれたら」「なぜ自分だけ恵まれないのだろう」そんな思いを繰り返し抱かせ、他人の幸せや成功を素直に喜べなくしてしまう。\n\nしかしネタミーが現れる時は、本当は自分も成長したい、もっと良くなりたいという願いを抱いている時でもある。',
    guardianName: 'ケプリ（エジプト守護神）',
    guardianDesc: '太陽神の一柱として、発生、生成、自己創造を司る神聖な存在。太陽を運ぶ神として、毎日新しい始まりと成長の力を世界にもたらしている。\n\nケプリは、私たちが太陽の光や自然の恵みによって生かされていることを思い出させてくれる。感謝の心の中にこそ、本当の豊かさと新しい可能性が生まれる。',
    handle: 'ネタミーの力は、自分にないものばかりを見つめた時に強くなります。\n\n今すでに持っているものに目を向けてみましょう。健康な身体。支えてくれる人々。今日という新しい一日。感謝の心は、不足感を豊かさへと変える力を持っています。',
    img: require('../../assets/negative/neg_15.jpg'),
  },
  {
    num: 16,
    name: 'セメ（責め）',
    negDesc: '人の過ちや欠点ばかりに目を向けさせる神。\n\n「あの人が悪い」「自分は悪くない」「許してはいけない」そんな思いを抱かせ、誰かを責め続けることで心を支配していく。\n\nしかしセメが現れる時は、本当は傷つき、理解されたいと願っている時でもある。責める心の奥には、自分自身が抱える痛みや弱さが隠されていることが少なくない。',
    guardianName: 'アヌビス（エジプト守護神）',
    guardianDesc: 'ミイラづくりの神であり、生と死に関する秘儀を司る知識の神。また、魂の罪の重さを量り、その真実を見極める役目を持つ神。\n\nアヌビスは、人の過ちや欠点を厳しく裁くためではなく、そのすべてを正しく見つめ、受け入れる知恵を授けてくれる。自分自身を許し、他者を許す心を育てながら、本当の強さとは受容の中にあることを教えてくれる。',
    handle: '誰かを責めたくなった時は、その人もまた不完全な存在であることを思い出してみましょう。\n\n自分の過ちを認めること。相手の立場を理解しようとすること。過去への執着を手放すこと。その積み重ねが、心を軽くし、人との調和を取り戻してくれます。',
    img: require('../../assets/negative/neg_16.jpg'),
  },
  {
    num: 17,
    name: 'ヌボレー（自惚れ）',
    negDesc: '自分を実際以上に大きく見せようとさせる神。\n\n「自分は特別だ」「失敗するはずがない」「人の意見を聞く必要はない」そんな思いを膨らませ、見栄や過信によって判断を曇らせていく。\n\nしかしヌボレーが現れる時は、本当の自信がまだ育っていないことを知らせるサインでもある。',
    guardianName: 'ネイト（エジプト守護神）',
    guardianDesc: '王の進むべき道から障害を取り除く知恵の神であり、戦いと狩猟を司る女神。困難を乗り越えるための判断力と行動力を授ける存在。\n\nネイトは、失敗を恐れる必要はないことを教えてくれる。壁にぶつかった時こそ、人は成長する。どんな状況でも前へ進む力を育てながら、本当の自信とは挑戦を続ける中で生まれることを教えてくれる。',
    handle: 'ヌボレーの力は、過信や見栄にとらわれた時に強くなります。また、失敗によって自信を失い、自分を否定し続ける時にも力を増していきます。\n\n失敗から学ぶこと。できたことに目を向けること。未来の可能性を信じること。その積み重ねが、本物の自信を育てていきます。',
    img: require('../../assets/negative/neg_17.jpg'),
  },
  {
    num: 18,
    name: 'ビョーキ（病気）',
    negDesc: '心に暗い影を落とし、不安や悲しみ、怒りや我慢を積み重ねさせる神。\n\n「どうせうまくいかない」「また悪いことが起こるかもしれない」「自分だけが苦しい」そんな思いに心を支配されると、気づかないうちに心の元気が失われていく。\n\nしかしビョーキが現れる時は、「もっと自分を大切にしてほしい」という身体からのメッセージでもある。',
    guardianName: 'バステト（エジプト守護神）',
    guardianDesc: '人々を病や悪しきものから守護する女神であり、豊穣や喜びを司る存在。音楽や踊りを愛し、楽器を手にした姿でも知られている。\n\nバステトは、生きる喜びこそが人を元気にする力であることを教えてくれる。好きな音楽を聴くこと。美しいものを眺めること。そうした小さな喜びは、心に光を取り戻し、身体の内側に活力を生み出していく。',
    handle: 'ビョーキの力は、不安や悲しみを抱え込み、自分の喜びを忘れた時に強くなります。\n\n好きな音楽を聴く。自然に触れる。美味しいものを味わう。感謝できることを見つける。心が喜ぶ時間を積み重ねることで、身体にも明るいエネルギーが巡り始めます。',
    img: require('../../assets/negative/neg_18.jpg'),
  },
  {
    num: 19,
    name: 'キョリョ（狭慮）',
    negDesc: '視野を狭くし、自分とは異なる考えや価値観を受け入れられなくする神。\n\n「自分が正しい」「あの人は間違っている」「理解できない人とは関わりたくない」そんな思いを少しずつ心に植え付け、人との間に見えない壁を作っていく。\n\nしかしキョリョが現れる時は、自分の世界が狭くなっていることを知らせるサインでもある。本当の成長とは、自分と異なる考えを否定することではなく、その存在を認めながら視野を広げていくことなのである。',
    guardianName: 'クヌム（エジプト守護神）',
    guardianDesc: '粘土をこねて神々や人間、大地、そして万物を創造したとされる創造神。陶芸の守護神としても知られ、命を形づくる存在として古くから崇められてきた。\n\nクヌムは、人は一人では生きられないことを教えてくれる。人それぞれが異なる個性や役割を持つことも教えてくれる。違いを認め合い、学び合い、支え合うことで人生は豊かになっていく。',
    handle: 'キョリョの力は、人を批判したり、自分と違う価値観を拒絶したりする時に強くなります。\n\n人の話に耳を傾けること。感謝の気持ちを伝えること。互いの違いを認めること。前向きな仲間と語り合い、支え合いながら歩む時、クヌムはあなたの人生に必要なご縁を結びます。',
    img: require('../../assets/negative/neg_19.jpg'),
  },
];

type Phase = 'intro' | 'input' | 'result';

export default function NegativeGodScreen() {
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>('intro');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [result, setResult] = useState<typeof NEGATIVE_GODS[0] | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    fadeIn();
  }, [phase]);

  const handleVisitTemple = () => {
    setPhase('input');
  };

  const handleDivine = () => {
    const y = parseInt(birthYear);
    const m = parseInt(birthMonth);
    const d = parseInt(birthDay);
    if (!y || !m || !d || y < 1900 || y > 2099 || m < 1 || m > 12 || d < 1 || d > 31) return;
    const hour = new Date().getHours();
    const num = calcGodNumber(y, m, d, hour);
    const god = NEGATIVE_GODS.find(g => g.num === num) || NEGATIVE_GODS[0];
    setResult(god);
    setPhase('result');
  };

  const handleReset = () => {
    setResult(null);
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setPhase('intro');
  };

  const imgWidth = Math.min(width - 40, 500);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* イントロフェーズ */}
      {phase === 'intro' && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <View style={styles.introHeader}>
            <Text style={styles.introTitle}>ネガティブ神と{'\n'}エジプト守護神占い</Text>
            <View style={styles.introTitleUnderline} />
          </View>
          <View style={styles.introCard}>
            <Text style={styles.introText}>{INTRO_TEXT}</Text>
          </View>
          <TouchableOpacity style={styles.templeButton} onPress={handleVisitTemple} activeOpacity={0.85}>
            <LinearGradient colors={['#2D1B69', '#4C1D95', '#6D28D9']} style={styles.templeButtonGradient}>
              <Text style={styles.templeButtonText}>✦　心の神殿を訪れる　✦</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 入力フェーズ */}
      {phase === 'input' && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputTitle}>生年月日を入力してください</Text>
            <Text style={styles.inputSubtitle}>あなたの数字から、今の心に宿る神を導き出します</Text>
          </View>
          <View style={styles.inputCard}>
            <View style={styles.nativeInputWrap}>
              {Platform.OS === 'web' ? (
                <View style={styles.webInputRow}>
                  <View style={styles.webInputGroup}>
                    <Text style={styles.inputLabel}>年</Text>
                    <input
                      type="number"
                      placeholder="1990"
                      value={birthYear}
                      onChange={(e: any) => setBirthYear(e.target.value)}
                      style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #DDD6FE', width: '100%', color: '#1E1B4B', background: '#F8F6FF' }}
                    />
                  </View>
                  <View style={styles.webInputGroup}>
                    <Text style={styles.inputLabel}>月</Text>
                    <input
                      type="number"
                      placeholder="1"
                      min="1" max="12"
                      value={birthMonth}
                      onChange={(e: any) => setBirthMonth(e.target.value)}
                      style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #DDD6FE', width: '100%', color: '#1E1B4B', background: '#F8F6FF' }}
                    />
                  </View>
                  <View style={styles.webInputGroup}>
                    <Text style={styles.inputLabel}>日</Text>
                    <input
                      type="number"
                      placeholder="1"
                      min="1" max="31"
                      value={birthDay}
                      onChange={(e: any) => setBirthDay(e.target.value)}
                      style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #DDD6FE', width: '100%', color: '#1E1B4B', background: '#F8F6FF' }}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.divineButton, (!birthYear || !birthMonth || !birthDay) && styles.divineButtonDisabled]}
            onPress={handleDivine}
            activeOpacity={0.85}
            disabled={!birthYear || !birthMonth || !birthDay}
          >
            <LinearGradient
              colors={birthYear && birthMonth && birthDay ? ['#2D1B69', '#4C1D95', '#6D28D9'] : ['#9CA3AF', '#9CA3AF']}
              style={styles.divineButtonGradient}
            >
              <Text style={styles.divineButtonText}>✦　神を呼び出す　✦</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 結果フェーズ */}
      {phase === 'result' && result && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <View style={styles.godImageWrap}>
            <Image
              source={result.img}
              style={[styles.godImage, { width: imgWidth, height: imgWidth * 0.65 }]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.negCard}>
            <View style={styles.negCardHeader}>
              <Text style={styles.negCardTag}>ネガティブ神</Text>
              <Text style={styles.negCardName}>【{result.name}】</Text>
            </View>
            <Text style={styles.negCardDesc}>{result.negDesc}</Text>
          </View>

          <View style={styles.guardianCard}>
            <View style={styles.guardianCardHeader}>
              <Text style={styles.guardianCardTag}>エジプト守護神</Text>
              <Text style={styles.guardianCardName}>【{result.guardianName}】</Text>
            </View>
            <Text style={styles.guardianCardDesc}>{result.guardianDesc}</Text>
          </View>

          <View style={styles.handleCard}>
            <Text style={styles.handleTitle}>✦ 対処法 ✦</Text>
            <Text style={styles.handleText}>{result.handle}</Text>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.85}>
            <Text style={styles.resetButtonText}>最初に戻る</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6FF' },
  scrollContent: { padding: 20, paddingTop: 48, paddingBottom: 60, alignItems: 'center', maxWidth: 600, alignSelf: 'center' as any, width: '100%' },

  introHeader: { alignItems: 'center', marginBottom: 24 },
  introTitle: { fontSize: 24, fontWeight: '800', color: '#2D1B69', textAlign: 'center', lineHeight: 36, letterSpacing: 1 },
  introTitleUnderline: { width: 60, height: 2, backgroundColor: '#C4B5FD', marginTop: 12, borderRadius: 2 },
  introCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: '#DDD6FE', shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  introText: { fontSize: 14, color: '#374151', lineHeight: 26 },

  templeButton: { borderRadius: 50, overflow: 'hidden', marginBottom: 20, shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  templeButtonGradient: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, alignItems: 'center' },
  templeButtonText: { fontSize: 18, color: '#E8C547', fontWeight: '700', letterSpacing: 2 },

  inputHeader: { alignItems: 'center', marginBottom: 20 },
  inputTitle: { fontSize: 18, fontWeight: '700', color: '#2D1B69', textAlign: 'center' },
  inputSubtitle: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
  inputCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#DDD6FE', width: '100%' },
  inputLabel: { fontSize: 13, color: '#6D28D9', fontWeight: '600', marginBottom: 6 },
  nativeInputWrap: { width: '100%' },
  webInputRow: { flexDirection: 'row', gap: 12 } as any,
  webInputGroup: { flex: 1 },

  divineButton: { borderRadius: 50, overflow: 'hidden', marginBottom: 20, shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  divineButtonDisabled: { opacity: 0.6 },
  divineButtonGradient: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, alignItems: 'center' },
  divineButtonText: { fontSize: 18, color: '#E8C547', fontWeight: '700', letterSpacing: 2 },

  godImageWrap: { alignItems: 'center', marginBottom: 20, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EDE9FE', width: '100%' },
  godImage: { borderRadius: 8 },

  negCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#EDE9FE', width: '100%', shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  negCardHeader: { marginBottom: 12 },
  negCardTag: { fontSize: 10, color: '#6D28D9', fontWeight: '700', letterSpacing: 2, backgroundColor: '#EDE9FE', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 6 },
  negCardName: { fontSize: 20, fontWeight: '800', color: '#2D1B69' },
  negCardDesc: { fontSize: 14, color: '#374151', lineHeight: 26 },

  guardianCard: { backgroundColor: '#FFFBEB', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#FDE68A', width: '100%', shadowColor: '#B45309', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  guardianCardHeader: { marginBottom: 12 },
  guardianCardTag: { fontSize: 10, color: '#B45309', fontWeight: '700', letterSpacing: 2, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 6 },
  guardianCardName: { fontSize: 20, fontWeight: '800', color: '#92400E' },
  guardianCardDesc: { fontSize: 14, color: '#374151', lineHeight: 26 },

  handleCard: { backgroundColor: '#F0FDF4', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#BBF7D0', width: '100%' },
  handleTitle: { fontSize: 15, fontWeight: '700', color: '#065F46', textAlign: 'center', marginBottom: 12, letterSpacing: 1 },
  handleText: { fontSize: 14, color: '#374151', lineHeight: 26 },

  resetButton: { borderWidth: 1, borderColor: '#C4B5FD', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', backgroundColor: 'transparent' },
  resetButtonText: { color: '#6D28D9', fontSize: 15, fontWeight: '600' },
});
