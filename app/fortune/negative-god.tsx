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
    negDesc: '人間の意識の中に入り込み、「恐怖の種」を植え付けて育てる神。\n\nその種は、\n「失敗したらどうしよう」\n「傷ついたらどうしよう」\n「嫌われたらどうしよう」\nという思いを栄養にして少しずつ成長していく。\n\n種が大きくなるほど、人はまだ起きていない未来を恐れ、自分の可能性にブレーキをかけてしまう。\n\nしかしキョーフは、ただ人を苦しめる存在ではない。\n\nあなたが本当に守りたいものや、大切に思っているものを教えてくれる存在でもある。\n\n恐怖を感じる時こそ、自分の心の奥にある本当の願いに気づく機会なのかもしれない。',
    guardianName: 'ラー／エジプト守護神',
    guardianDesc: '天空の船に乗り、毎日太陽を運びながら世界に光を届ける太陽神。\n\nその温かな光は大地を照らし、多くの生命を育んでいる。\n\nラーは人の心にも光を届け、「希望」の炎を燃やすように働きかける。\n\n未来への希望が生まれると、人は自然と前を向き、自ら行動する力を取り戻していく。\n\nラーは、あなたの中に眠る勇気や可能性を照らし出し、新しい一歩を踏み出す力を与えてくれるだろう。',
    handle: '恐怖をなくそうとする必要はありません。\n\nまずは「私は何を恐れているのだろう」と、自分の心を静かに見つめてみましょう。\n\nそして、小さなことでも構いません。\n\n「こうなったら嬉しい」という希望を持って一歩行動してみてください。\n\n希望を持って進む時、ラーの光は強くなり、キョーフの種は少しずつ力を失っていきます。\n\n恐怖が消えてから進むのではなく、希望を胸に抱き進むことで、恐怖は自然と小さくなっていくでしょう。',
    img: require('../../assets/negative/neg_01.jpg'),
  },
  {
    num: 2,
    name: 'タイダー（怠惰）',
    negDesc: '人間の心に忍び込み、「あとでやればいい」「今はまだいい」とささやく神。\n\n考えることや行動することに対して「めんどくさい」という気持ちを生み出し、人から思考力や行動力を少しずつ奪っていく。\n\nタイダーの力が強くなるほど、人は目の前にある可能性やチャンスに気づけなくなり、自らの成長を遠ざけてしまう。\n\nしかしタイダーは、ただ人を怠けさせるためだけに存在しているわけではない。\n\nその奥には、「失敗したくない」「変化が怖い」「自信がない」といった隠れた気持ちが眠っていることもある。\n\n行動できない自分を責めるのではなく、まずは心の奥にある本当の声に耳を傾けてみよう。',
    guardianName: 'シュー／エジプト守護神',
    guardianDesc: '人々が生きるために必要な大気と太陽の光を司り、生命に息吹を与える神。\n\nその力は人の聴覚や思考にも及び、正しい気づきや知恵をもたらす存在として知られている。\n\nシューは、あなたが本当にやりたいことや進むべき道を見つけられるよう働きかける。\n\nそして、その実現に必要な人や情報、機会を引き寄せ、チャンスをつかむための知恵を授けてくれる。\n\n心を開き、自ら考えようとする時、シューは新しい可能性への扉を静かに開いてくれるだろう。',
    handle: 'タイダーの力は、「考えること」と「行動すること」をやめた時に強くなります。\n\n大きな一歩である必要はありません。\n\nまずは気になっていることを調べてみる、誰かに相談してみる、小さな行動を一つ起こしてみることから始めてみましょう。\n\n自分の意志で考え、自分の未来のために行動する時、シューの知恵はあなたを導き、タイダーは近づくことができなくなります。\n\n小さな一歩こそが、新しいチャンスへの入り口なのです。',
    img: require('../../assets/negative/neg_02.jpg'),
  },
  {
    num: 3,
    name: 'ヒテー（否定）',
    negDesc: '人間の心に入り込み、「どうせ無理だ」「きっとうまくいかない」といった否定的な考えを繰り返し生み出す神。\n\nその言葉は小さなささやきから始まるが、何度も繰り返されることで心の中に根を張り、人の可能性や希望を少しずつ奪っていく。\n\nヒテーは、「繰り返す思考は現実を引き寄せる」という自然の法則を利用し、人が自ら不幸な未来を思い描くように仕向ける。\n\nしかしヒテーは、ただ人を苦しめる存在ではない。\n\nその姿が現れる時は、自分自身の力や可能性を信じられなくなっている時でもある。\n\n否定的な考えに気づくことは、本来の願いや目標を思い出すための大切なきっかけとなるだろう。',
    guardianName: 'テフヌト／エジプト守護神',
    guardianDesc: '湿気や霧などの水の力を用いて太陽の熱を司る女神。\n\n求心力や受容性、収縮力、そして必要なものを引き寄せる力を持つ存在として知られている。\n\nテフヌトは、あなたが本当に望む未来や目標を見つけられるよう導く。\n\nそして、その目標を心に刻み、何度も思い出させることで、成功へ向かう意識と行動を育てていく。\n\n目標が明確になるほど心はぶれにくくなり、必要な出会いや機会が自然と引き寄せられていく。\n\nテフヌトは、あなたの願いを現実へと近づけるための力を与えてくれるだろう。',
    handle: 'ヒテーのささやきが聞こえてきたら、「私は本当はどうなりたいのだろう」と自分に問いかけてみましょう。\n\n否定的な考えを追い払おうとするよりも、自分が目指す未来を具体的に思い描くことが大切です。\n\nそして、その未来に向かう小さな行動を一つ起こしてみてください。\n\n目標を明確にし、希望を持って進む時、テフヌトの引き寄せる力は強く働きます。\n\n未来への意識が定まった時、ヒテーはあなたの心に居場所を失っていくでしょう。',
    img: require('../../assets/negative/neg_03.jpg'),
  },
  {
    num: 4,
    name: 'ウーン（運）',
    negDesc: '人間の心に入り込み、「自分は運が悪い」「どうせうまくいかない」という思いを育てる神。特に、お金や仕事、人間関係などへの不安を利用し、人を「足りないもの」ばかりに意識が向く状態へ導いていく。\n\nウーンは、「貧しさを恐れれば貧しさを引き寄せる」という自然の法則を利用し、人間を不安や欠乏のリズムに同調させる。\n\nその力が強くなるほど、人は目の前にある恵みや可能性に気づけなくなり、自ら幸運を遠ざけてしまう。\n\nしかしウーンは、ただ不幸をもたらす存在ではない。\n\nその姿が現れる時は、あなたが豊かさよりも不足に意識を向けていることを知らせるサインでもある。\n\nまずは自分の心が何を恐れているのかに気づくことが、豊かさへの第一歩となるだろう。',
    guardianName: 'オシリス／エジプト守護神',
    guardianDesc: '温厚な性格を持ち、豊穣を司る穀物神。\n\n人々に法律を広め、作物の育て方や食べ物の調理法を教え、文明の発展に大きく貢献した存在として知られている。そのため多くの人々から深く敬われ、絶大な支持を集めた。\n\nオシリスは、あなたが豊かな生活を築き、その喜びを周囲の人々と分かち合いながら生きる方法を教えてくれる。\n\n豊かさとは、単にお金や物を得ることだけではない。感謝する心、人とのつながり、自分の力を活かして生きることもまた大切な豊かさである。\n\nオシリスは、あなたが人生の実りを受け取りながら、さらに発展していけるよう導いてくれるだろう。',
    handle: 'ウーンの力は、「足りない」「失いたくない」という思いに意識が集中するほど強くなります。そんな時は、今ある恵みに目を向けながら、自分が望む豊かな未来を具体的に思い描いてみましょう。\n\n「どんな暮らしをしたいのか。」「どんな人たちと笑い合いたいのか。」「何を実現したいのか。」\n\nその未来を心の中で鮮明に描き、そのための小さな行動を積み重ねてください。\n\n豊かさに意識を向ける時、オシリスの力は大きく働き、ウーンはあなたの心に影響を与えられなくなっていくでしょう。',
    img: require('../../assets/negative/neg_04.jpg'),
  },
  {
    num: 5,
    name: 'ウラミー（恨み）',
    negDesc: '人間の心に入り込み、過去の傷や悲しみを何度も思い出させる神。\n\n「あの人が悪い」「許せない」「仕返しをしたい」\n\nそんな思いを心の中で繰り返し育て、怒りや憎しみの感情で人を支配していく。\n\nウラミーの力が強くなるほど、人は相手の欠点ばかりに目を向けるようになり、本来大切にしたい人間関係までも壊してしまう。\n\nしかしウラミーは、ただ争いを生み出すためだけに存在しているわけではない。\n\nその姿が現れる時は、あなたの心が深く傷つき、理解や癒やしを求めている時でもある。\n\n恨みの奥に隠された本当の気持ちに気づくことが、心を解放する第一歩となるだろう。',
    guardianName: 'セト／エジプト守護神',
    guardianDesc: '暴風や暗黒、戦いなど、強大で破壊的な力を司る神。\n\nその荒々しい力ゆえに恐れられることもあるが、危険を見抜く鋭い洞察力と強い判断力を持つ存在でもある。\n\nセトは、人との関わりの中で何が調和を生み、何が争いを生むのかを見極める知恵を授ける。\n\nそして、無用な衝突を避けながら、自分自身を守り、健全な人間関係を築く方法を教えてくれる。\n\nすべての人と無理に仲良くなる必要はない。\n\n自分を大切にしながら、互いを尊重できる関係を選ぶ力こそが、セトの与える守護の力なのである。',
    handle: 'ウラミーの力は、怒りや憎しみの感情を繰り返し思い返すほど強くなります。\n\n相手を変えようとする前に、自分が本当に求めているものは何かを考えてみましょう。\n\n理解してほしいのか。\n\n認めてほしいのか。\n\nそれとも距離を置くことが必要なのか。\n\n自分と相手を尊重しながら、愛と思いやりのある関係を築こうとする時、セトの知恵はあなたを導きます。\n\n愛のある人間関係を育てる場所には、ウラミーは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_05.jpg'),
  },
  {
    num: 6,
    name: 'ムジヒ（無慈悲）',
    negDesc: '人の苦しみや悲しみに心を閉ざし、「自分には関係ない」と背を向けさせる神。\n\n困っている人を見ても見ないふりをしたり、誰かの痛みに共感できなくなったりと、人と人とのつながりを少しずつ遠ざけていく。\n\nまた、「どうせ助けても無駄だ」「自分には何もできない」という思いを抱かせ、本当は優しさを持っている心を凍らせてしまう。\n\nムジヒの力が強くなるほど、人は他人だけでなく自分自身にも厳しくなり、心の温もりを感じにくくなってしまう。\n\nしかしムジヒが現れる時は、あなた自身が疲れや傷つきによって心を守ろうとしているサインでもある。\n\n優しさを失ったのではなく、優しさを表現する余裕が少なくなっていることを知らせているのである。',
    guardianName: 'ケヘト／エジプト守護神',
    guardianDesc: '出産を助け、新たな命に息吹を与える心優しい蛙の女神。\n\n生命の誕生と成長を見守り、弱き者を包み込む慈愛の力を象徴している。\n\nケヘトは、人の苦しみに寄り添う思いやりと、「少しでも力になりたい」という温かな心を育ててくれる。\n\nそれは大きな奉仕や特別な行動ではない。\n\n優しい言葉をかけること、話を聞くこと、相手の幸せを願うこともまた、慈悲の心の表れである。\n\nケヘトは、人をいたわる心を通して、あなた自身の心にも安らぎと喜びをもたらしてくれるだろう。',
    handle: 'ムジヒの力は、人とのつながりを忘れた時に強くなります。\n\n誰かのためにできることは、大きなことでなくても構いません。\n\n笑顔を向けること。\n感謝を伝えること。\n相手の話に耳を傾けること。\n\nそんな小さな優しさの積み重ねが、固くなった心を少しずつほぐしていきます。\n\n人をいつくしみ、思いやる心でいる時、ケヘトの慈愛はあなたを包み込み、ムジヒは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_06.jpg'),
  },
  {
    num: 7,
    name: 'ゴーヨク（強欲）',
    negDesc: '自分の利益や欲望ばかりに意識を向けさせる神。\n\n「もっと欲しい」「自分だけが得をしたい」「失いたくない」\n\nそんな思いを膨らませ、周囲の人の気持ちや立場を見えにくくしてしまう。\n\nゴーヨクの力が強くなるほど、人は与えることよりも受け取ることに意識が向き、人間関係を損得で判断するようになる。\n\n時には自分の望みを叶えるために、人を思い通りに動かそうとしたり、無意識のうちに相手を利用してしまったりすることもある。\n\nしかしゴーヨクが現れる時は、心の奥に「足りない」という不安や欠乏感を抱えていることを知らせている場合がある。\n\n本当の豊かさは奪い合うことで得られるものではなく、分かち合うことで育まれていくのである。',
    guardianName: 'ベス／エジプト守護神',
    guardianDesc: 'すべての人に幸福をもたらし、自ら楽器を奏でながら踊って邪気を払う歓喜と祝福、舞踊の神。\n\n人々の暮らしを明るく照らし、笑顔や喜びの中に宿る幸運の力を象徴している。\n\nベスは、「自分に何ができるだろう」と相手を思いやる心を育て、人との調和の中に本当の幸せがあることを教えてくれる。\n\n喜びは一人で抱え込むものではなく、誰かと分かち合うことでさらに大きくなる。\n\n明るい言葉や優しい行動は、人との縁を育み、幸運を呼び込む力となるのである。',
    handle: 'ゴーヨクの力は、自分の利益だけに意識が向いた時に強くなります。\n\n何かを得ようとする前に、自分が周囲に与えられるものは何かを考えてみましょう。\n\n優しい言葉をかけること。\n\n感謝を伝えること。\n\n誰かの喜びを一緒に喜ぶこと。\n\nそんな小さな思いやりが、人とのつながりを豊かにし、心の満足感を育ててくれます。\n\n明るく思いやりの心で過ごしている時、ベスの祝福はあなたを包み込み、ゴーヨクは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_07.jpg'),
  },
  {
    num: 8,
    name: 'ガイ（害）',
    negDesc: '心や身体が求めるままに欲望を満たそうとさせる神。\n\n「これくらい大丈夫」「もう少しだけ」「好きなものだから我慢したくない」\n\nそんな気持ちを繰り返しささやき、必要以上に食べたり飲んだりするよう仕向けていく。\n\n本来は身体を支えるはずのものでも、限度を超えれば負担となり、やがて心身の不調へと姿を変えていく。\n\nガイの力が強くなるほど、人は目先の満足を優先し、身体からの小さなサインを見逃してしまう。\n\nそして疲れや不調が積み重なることで判断力や行動力が鈍り、本来の力を発揮しにくくなってしまうのである。\n\nしかしガイが現れる時は、単なる食べ過ぎや欲望の問題ではなく、心や身体が何かの不足を補おうとしている場合もある。\n\n自分が本当に求めているものは何かに気づくことが、健やかさを取り戻す第一歩となるだろう。',
    guardianName: 'セルケト／エジプト守護神',
    guardianDesc: '命を奪う毒を解く呪術を持ち、人々を有害な生き物の毒から守る医療の女神。\n\n危険なものを見極め、毒を癒やしへと変える知恵を象徴している。\n\nセルケトは、身体を動かす機会や健康への意識を与えながら、「良いものであっても過ぎれば毒になる」という大切な教えを授けてくれる。\n\n健康は特別なことをすることで得られるものではなく、日々の小さな積み重ねによって育まれるもの。\n\nセルケトは、心と身体の声に耳を傾け、自分にとって心地よいバランスを見つける力を与えてくれるだろう。',
    handle: 'ガイの力は、欲望のままに行動し、自分の限界を見失った時に強くなります。\n\n食べることを我慢するのではなく、自分の身体が本当に必要としている量や状態を意識してみましょう。\n\nよく味わって食べること。適度に身体を動かすこと。疲れた時はしっかり休むこと。\n\nそんな小さな心がけが、心身の調和を取り戻す助けになります。\n\n食欲や欲望を上手にコントロールし、自分を大切にできる時、セルケトの守護はあなたを支え、ガイは手を出すことができなくなるでしょう。',
    img: require('../../assets/negative/neg_08.jpg'),
  },
  {
    num: 9,
    name: 'シット（嫉妬）',
    negDesc: '大切な人や大切なものを失う不安を心に植え付ける神。\n\n「あの人が離れていくかもしれない」\n\n「自分より誰かを選ぶのではないか」\n\n「自分だけが愛されていないのではないか」\n\nそんな疑いや不安を膨らませ、嫉妬や恨みの感情を生み出していく。\n\nシットの力が強くなるほど、人は相手を信じることが難しくなり、愛情を確認しようとして相手を束縛したり、自分自身を責めたりしてしまう。\n\nしかし、その行動は本来守りたかった関係に距離を生み、心の調和を乱してしまうことも少なくない。\n\nけれどシットが現れる時は、あなたが誰かを大切に思っている証でもある。\n\nその奥には、「失いたくない」「愛されたい」という純粋な願いが隠されているのである。',
    guardianName: 'イシス／エジプト守護神',
    guardianDesc: '誕生、成長、発展、活力を象徴する女神であり、深い愛と知恵を備えた良妻賢母の神。\n\nまた、生と死をも司る強大な魔力を持つ偉大な魔術師としても知られている。\n\nイシスは、自分自身を愛することと、他者を愛することの大切さを教えてくれる。\n\nすべての命には価値があり、それぞれが尊重され、慈しまれるべき存在であることを気づかせてくれるのである。\n\n愛とは相手を縛る力ではなく、成長を見守り、支え、共に育んでいく力。\n\nイシスは、その建設的で創造的な愛こそが人生を豊かにし、多くの奇跡を生み出すことを教え導いてくれる。',
    handle: 'シットの力は、不安や疑いに心を支配された時に強くなります。\n\n誰かと比べるのではなく、自分自身の価値を認めてみましょう。\n\n相手を信じること。\n\n自分を大切にすること。\n\n感謝や愛情を素直に伝えること。\n\nその積み重ねが、心に安心と信頼を育てていきます。\n\n愛は奪い合うものではなく、育て合うものです。\n\n偉大なる愛の力を信じ、自分と他者を慈しむ心でいる時、イシスの祝福はあなたを包み込み、シットは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_09.jpg'),
  },
  {
    num: 10,
    name: 'キョエー（虚栄）',
    negDesc: '人からどう見られるかばかりを気にさせる神。\n\n「立派に見られたい」「認められたい」「すごいと思われたい」\n\nそんな思いを膨らませ、本当の自分よりも外見や評価を優先するよう仕向けていく。\n\nキョエーの力が強くなるほど、人は心を磨くことよりも、うわべを飾ることに意識を向けるようになる。\n\nそして他人との比較や見栄に振り回され、自分らしさを見失ってしまうことも少なくない。一時的に満たされたように感じても、その満足は長く続かず、さらに評価を求める心が生まれていく。\n\nしかしキョエーが現れる時は、本当は自分に自信が持てず、心の奥で認められたいと願っているサインでもある。うわべを飾ることではなく、自分自身と向き合うことが、本当の強さへの入り口となるのである。',
    guardianName: 'ネフティス／エジプト守護神',
    guardianDesc: '死と再生、そして境界を司る送葬の女神。終わりを見守るだけでなく、腐敗したものの中から新たな命が生まれる変化の力を象徴している。\n\nネフティスは、偽りや見栄に覆われた心を静かに見つめ、その奥にある真実の自分へと導いてくれる。自分の弱さや未熟さから目を背けずに受け入れた時、人は初めて本当の意味で成長することができる。\n\n他人からの評価に左右されない心。飾らなくても揺るがない自信。\n\nそれこそがネフティスの授ける不動の力である。\n\n彼女は、古い自分を手放し、より誠実で真実に満ちた自分へと生まれ変わる手助けをしてくれるだろう。',
    handle: 'キョエーの力は、他人の評価や見た目ばかりに意識が向いた時に強くなります。\n\n自分を大きく見せようとする前に、本当の自分は何を感じ、何を望んでいるのかを見つめてみましょう。\n\nできないことを認めること。間違いを受け入れること。ありのままの自分を大切にすること。それらは弱さではなく、真の強さへとつながる道です。\n\n自分の弱さと向き合い、見栄やうぬぼれから解放された時、心には揺るぎない不動の力が宿ります。\n\nその時、ネフティスの守護はあなたを支え、キョエーは手を出すことができなくなるでしょう。',
    img: require('../../assets/negative/neg_10.jpg'),
  },
  {
    num: 11,
    name: 'リコ（利己）',
    negDesc: '自分の利益だけを優先させる神。\n\n「自分さえ得をすればいい」「損はしたくない」「人より有利になりたい」\n\nそんな思いを心に植え付け、周囲との調和よりも目先の利益を追い求めるよう仕向けていく。\n\nリコの力が強くなるほど、人は他人の気持ちや立場を考えにくくなり、自分の目的を達成するためなら人を利用したり、ごまかしたりすることも正当化してしまう。\n\nしかし、そのような行動は一時的な利益をもたらしても、信頼という大切な財産を失わせてしまう。\n\nやがて人との縁は遠ざかり、孤立や不満を招くことになるのである。\n\nけれどリコが現れる時は、自分を守りたいという本能や、不安からくる欠乏感が強くなっている時でもある。\n\n本当の豊かさは一人で得るものではなく、人との信頼の中で育まれることを思い出す必要があるのだ。',
    guardianName: 'トト／エジプト守護神',
    guardianDesc: '宇宙の法則を定めた知恵の神。文字を発明し、法と秩序を築き、知識や科学の発展を導いた偉大な存在として知られている。\n\nトトは、すべての出来事には原因と結果があることを教え、大自然の法則に沿って生きる知恵を授けてくれる。まずは自らが他人に快く協力し、周囲との調和を育むこと。\n\nその行いが巡り巡って信頼となり、未来を創造する力となることを理解させてくれるのである。知恵とは知識の量ではなく、物事の本質を理解し、正しく活かす力。\n\nトトは、望む人生を創り出すための洞察力と判断力を与え、あなたをより良い未来へと導いてくれるだろう。',
    handle: 'リコの力は、自分の利益ばかりを考えた時に強くなります。\n\n何かを受け取ろうとする前に、自分は何を与えられるだろうかと考えてみましょう。\n\n相手を尊重すること。約束を守ること。誠実に行動すること。\n\nその積み重ねが信頼を育み、人との縁を豊かにしていきます。\n\n大自然の法則は、「与えたものが巡って返ってくる」という調和の上に成り立っています。\n\nその法則に従い、誠実な心で行動する時、トトの知恵はあなたを支え、リコは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_11.jpg'),
  },
  {
    num: 12,
    name: 'ユージュ（優柔）',
    negDesc: '自分で考え、決断する力を鈍らせる神。\n\n「間違えたらどうしよう」「誰かが決めてくれた方が楽だ」「様子を見てからにしよう」\n\nそんな迷いを繰り返し生み出し、自分の意思よりも周囲の意見や流れに従うよう仕向けていく。\n\nユージュの力が強くなるほど、人は選択を先延ばしにし、自分の本音がわからなくなってしまう。\n\nそして気づけば、自分で選んだ人生ではなく、人に流された人生を歩んでいることも少なくない。\n\nしかしユージュが現れる時は、慎重さや失敗への恐れが強くなっている時でもある。\n\n本当はより良い選択をしたいと思うからこそ、決断できずに立ち止まっているのである。\n\nだからこそ必要なのは、完璧な答えを探し続けることではなく、自分の意思を信じて一歩を踏み出す勇気なのである。',
    guardianName: 'ホルス／エジプト守護神',
    guardianDesc: '太陽と月の両目を持つ天空神。広い視野と鋭い洞察力を備え、真実と偽りを見抜く堅実な目を持つ守護神として知られている。\n\nホルスは、自ら考え、自ら選び、自ら行動する力を育ててくれる。誰かに依存するのではなく、自分の意思で人生を切り開くことの大切さを教えてくれるのである。\n\n人生には多くの選択がある。そのすべてが正解である必要はない。\n\n大切なのは、自分で考え、自分で決める経験を積み重ねること。\n\nその習慣が判断力を磨き、必要な時に素早く決断できる力となっていく。\n\nホルスは、あなたが自分自身の人生の舵を握るための勇気と知恵を授けてくれるだろう。',
    handle: 'ユージュの力は、自分の考えを見失い、他人の意見に振り回された時に強くなります。\n\nまずは「自分はどうしたいのか」を静かに問いかけてみましょう。\n\nすべての人に賛成してもらう必要はありません。\n\n自分の価値観を知ること。自分の意思を言葉にすること。\n\n小さなことでも自分で決めること。\n\nその積み重ねが、自分らしい人生への道を開いていきます。\n\n自分の考えが明確になり、自らの意思で行動できる時、ホルスの鋭い眼は進むべき道を照らし、ユージュは手を出すことができなくなるでしょう。',
    img: require('../../assets/negative/neg_12.jpg'),
  },
  {
    num: 13,
    name: 'フセイジツ（不誠実）',
    negDesc: '真実から目を背けさせる神。\n\n「少しくらいなら大丈夫」「本当のことを言うと困る」「自分だけは得をしたい」\n\nそんな思いを心に忍び込ませ、ウソやごまかし、裏切りへと導いていく。\n\nフセイジツの力が強くなるほど、人は目先の利益や都合を優先し、誠実な行動を後回しにするようになる。\n\nしかし、一つのウソは新たなウソを生み、やがて信頼を失わせる原因となる。\n\n人を欺こうとして仕掛けた罠は、巡り巡って自分自身を苦しめる結果となることも少なくない。\n\nけれどフセイジツが現れる時は、自分を守りたい不安や恐れが強くなっている時でもある。\n\n真実と向き合う勇気を失った時、この神は心に影を落とすのである。',
    guardianName: 'マアト／エジプト守護神',
    guardianDesc: '頭に戴く羽を真理の象徴とし、法、真実、秩序、正義を司る神。\n\n宇宙や世界が調和を保つための絶対的な真理を守る存在として知られている。\n\nマアトは、私利私欲にとらわれず、真心をもって人や物事に向き合うことの大切さを教えてくれる。\n\n正しさとは誰かを裁くことではなく、自分自身の良心に従って生きること。\n\n誠実な言葉。誠実な行動。誠実な心。\n\nその積み重ねが信頼を育み、人との絆を強くしていくのである。\n\nマアトは、真実の中にこそ揺るぎない安心と平和があることを伝え、あなたを正しい道へと導いてくれるだろう。',
    handle: 'フセイジツの力は、自分の都合を優先し、良心の声を無視した時に強くなります。\n\n迷った時は、「これは誠実な行動だろうか」と自分に問いかけてみましょう。\n\n約束を守ること。真実を大切にすること。相手を尊重すること。\n\nそんな一つひとつの選択が、信頼と調和のある人生を築いていきます。\n\n正義とは、他人を裁くためのものではなく、自分の心を正しい方向へ導く光です。\n\n正義の心を持ち、真実に従って生きる時、マアトの羽はあなたを守り導き、フセイジツは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_13.jpg'),
  },
  {
    num: 14,
    name: 'ヒボウ（誹謗）',
    negDesc: '人の欠点や失敗ばかりに目を向けさせる神。\n\n「あの人はおかしい」「自分の方が正しい」「誰かに聞いてほしい」\n\nそんな思いを心に生み出し、悪口や批判を広げるよう仕向けていく。\n\nヒボウの力が強くなるほど、人は自分自身を見つめることを忘れ、他人の評価や噂話に意識を向けるようになる。\n\nそして発した言葉は周囲の空気を乱すだけでなく、自らの心にも影を落としていく。\n\n一時的な優越感や満足感を得たとしても、その言葉は巡り巡って自分自身へと返ってくるのである。\n\nしかしヒボウが現れる時は、自分の不満や不安、満たされない思いを抱えている時でもある。\n\n他人を責めたくなる時ほど、本当に向き合うべき相手は自分自身なのかもしれない。',
    guardianName: 'メルセゲル／エジプト守護神',
    guardianDesc: '罪を犯した者には厳しく戒めを与え、善き行いをする者には恵みを授ける女神。\n\n人の行いに応じた結果がもたらされるという、宇宙の公正な法則を象徴している。\n\nメルセゲルは、この世界が「振り子の法則」によって成り立っていることを教えてくれる。\n\n右へ大きく振れた振り子は、同じ力で左へ振れるように、自らが発した言葉や行動は、形を変えて自分へと返ってくる。\n\nだからこそ、善意を与えれば善意が育ち、思いやりを与えれば思いやりが広がっていく。\n\nメルセゲルは、自分の言葉や行動に責任を持つことの大切さを伝え、より良い未来を築くための知恵を授けてくれるのである。',
    handle: 'ヒボウの力は、人の欠点ばかりに意識が向いた時に強くなります。誰かを批判したくなった時は、その言葉が自分に返ってきてもよいものかを考えてみましょう。\n\n感謝を伝えること。人の長所を見ること。励ましの言葉を選ぶこと。\n\nそんな小さな積み重ねが、周囲との関係だけでなく、自分自身の心も豊かにしてくれます。あなたが発する言葉は、未来への種でもあります。\n\n自ら発するすべてを「善」に変えた時、メルセゲルの守護はあなたに恵みをもたらし、ヒボウは手を出すことができなくなるでしょう。',
    img: require('../../assets/negative/neg_14.jpg'),
  },
  {
    num: 15,
    name: 'ネタミー（妬み）',
    negDesc: '自分にないものばかりに意識を向けさせる神。\n\n「もっとお金があれば」「あの人のようになれたら」「なぜ自分だけ恵まれないのだろう」\n\nそんな思いを繰り返し抱かせ、他人の幸せや成功を素直に喜べなくしてしまう。\n\nネタミーの力が強くなるほど、人は今ある豊かさよりも不足しているものに目を向けるようになる。\n\nそして比較することが習慣となり、自分自身の価値や魅力まで見失ってしまうのである。\n\nしかしネタミーが現れる時は、本当は自分も成長したい、もっと良くなりたいという願いを抱いている時でもある。\n\nその願いを他人への妬みではなく、自分自身を高める力へと変えていくことが大切なのである。',
    guardianName: 'ケプリ／エジプト守護神',
    guardianDesc: '太陽神の一柱として、発生、生成、自己創造を司る神聖な存在。\n\n太陽を運ぶ神として、毎日新しい始まりと成長の力を世界にもたらしている。\n\nケプリは、私たちが太陽の光や自然の恵みによって生かされていることを思い出させてくれる。\n\nそして、これまで家族や友人、多くの人々から受け取ってきた愛情や支え、数え切れない恩恵にも気づかせてくれるのである。\n\n人は決して一人で生きているわけではない。\n\n今の自分があるのは、多くの存在とのつながりと恵みがあるからこそ。\n\nケプリは、感謝の心の中にこそ、本当の豊かさと新しい可能性が生まれることを教えてくれるだろう。',
    handle: 'ネタミーの力は、自分にないものばかりを見つめた時に強くなります。\n\nそんな時は、今すでに持っているものに目を向けてみましょう。\n\n健康な身体。支えてくれる人々。今日という新しい一日。\n\n当たり前と思っていたものの中にも、多くの恵みが存在しています。\n\n感謝の心は、不足感を豊かさへと変える力を持っています。\n\n家族や友人、自然の恵みに感謝し、自分の人生に与えられた恩恵を受け取る時、ケプリの光はあなたを照らし、ネタミーは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_15.jpg'),
  },
  {
    num: 16,
    name: 'セメ（責め）',
    negDesc: '人の過ちや欠点ばかりに目を向けさせる神。\n\n「あの人が悪い」「自分は悪くない」「許してはいけない」\n\nそんな思いを抱かせ、誰かを責め続けることで心を支配していく。\n\nセメの力が強くなるほど、人は自分の非を認めることが難しくなり、問題の原因を常に外へ求めるようになる。\n\nそして相手を裁き続けるうちに、自分自身もまた怒りや不満に縛られ、心の自由を失ってしまうのである。\n\nしかしセメが現れる時は、本当は傷つき、理解されたいと願っている時でもある。\n\n責める心の奥には、自分自身が抱える痛みや弱さが隠されていることが少なくない。\n\nだからこそ、他人を裁く前に、自分の心と向き合うことが大切なのである。',
    guardianName: 'アヌビス／エジプト守護神',
    guardianDesc: 'ミイラづくりの神であり、生と死に関する秘儀を司る知識の神。\n\nまた、魂の罪の重さを量り、その真実を見極める役目を持つ神として知られている。\n\nアヌビスは、人の過ちや欠点を厳しく裁くためではなく、そのすべてを正しく見つめ、受け入れる知恵を授けてくれる。\n\n誰にでも未熟な部分や失敗はある。だからこそ、自分の弱さを認めることは恥ではなく、成長への第一歩なのである。\n\nアヌビスは、自分自身を許し、他者を許す心を育てながら、本当の意味での強さとは受容の中にあることを教えてくれる。許しは過去を消すことではない。\n\n過去に縛られず、未来へ進むために心を解放する力なのである。',
    handle: 'セメの力は、怒りや正しさへの執着によって強くなります。誰かを責めたくなった時は、その人もまた不完全な存在であることを思い出してみましょう。\n\nそして同じように、自分もまた完璧ではないことを受け入れてみてください。\n\n自分の過ちを認めること。相手の立場を理解しようとすること。\n\n過去への執着を手放すこと。\n\nその積み重ねが、心を軽くし、人との調和を取り戻してくれます。\n\nすべてを受け入れ、許す心でいる時、アヌビスの知恵はあなたを導き、セメは近づくことができなくなるでしょう。',
    img: require('../../assets/negative/neg_16.jpg'),
  },
  {
    num: 17,
    name: 'ヌボレー（自惚れ）',
    negDesc: '自分を実際以上に大きく見せようとさせる神。\n\n「自分は特別だ」「失敗するはずがない」「人の意見を聞く必要はない」\n\nそんな思いを膨らませ、見栄や過信によって判断を曇らせていく。\n\nヌボレーの力が強くなるほど、人は自分の弱点や課題を見ようとしなくなり、周囲からの助言にも耳を傾けなくなる。\n\nそして順調な時ほど気づかないまま、自ら失敗の種を育ててしまうのである。\n\nやがて大きな壁にぶつかった時、自信は一気に崩れ去り、「自分は駄目だ」という極端な落ち込みへと変わることも少なくない。\n\nしかしヌボレーが現れる時は、本当の自信がまだ育っていないことを知らせるサインでもある。うわべの自信ではなく、自分の強みも弱みも理解した上で前進する力が求められているのである。',
    guardianName: 'ネイト／エジプト守護神',
    guardianDesc: '王の進むべき道から障害を取り除く知恵の神であり、戦いと狩猟を司る女神。\n\n困難を乗り越えるための判断力と行動力を授ける存在として知られている。\n\nネイトは、失敗を恐れる必要はないことを教えてくれる。\n\nなぜなら、失敗の中には成功へとつながる大切な学びや気づきが隠されているからである。壁にぶつかった時こそ、人は成長する。\n\n転んだ経験があるからこそ、より確かな道を選べるようになる。\n\nネイトは、弱気な心を勇気へと変え、困難の中にも可能性を見出す知恵を授けてくれる。\n\nそして、どんな状況でも前へ進む力を育てながら、本当の自信とは挑戦を続ける中で生まれることを教えてくれるのである。',
    handle: 'ヌボレーの力は、過信や見栄にとらわれた時に強くなります。\n\nまた、失敗によって自信を失い、自分を否定し続ける時にも力を増していきます。\n\n大切なのは、自分を過大評価することでも過小評価することでもありません。\n\n失敗から学ぶこと。できたことに目を向けること。未来の可能性を信じること。\n\nその積み重ねが、本物の自信を育てていきます。\n\n失敗の中に成功の種を見つけ、マイナス思考の呪縛から解放されて前向きな心を取り戻した時、ネイトの知恵はあなたの道を照らし、ヌボレーは手を出すことができなくなるでしょう。',
    img: require('../../assets/negative/neg_17.jpg'),
  },
  {
    num: 18,
    name: 'ビョーキ（病気）',
    negDesc: '心に暗い影を落とし、不安や悲しみ、怒りや我慢を積み重ねさせる神。\n\n「どうせうまくいかない」「また悪いことが起こるかもしれない」「自分だけが苦しい」\n\nそんな思いに心を支配されると、気づかないうちに心の元気が失われていく。\n\nビョーキは、心配事や悲しむ出来事ばかりに意識を向けさせ、心と身体のバランスを崩していく。\n\n本来、人の身体には回復する力が備わっているが、ネガティブな感情を抱え込み続けることで、その力が十分に発揮できなくなる。\n\nしかしビョーキが現れる時は、「もっと自分を大切にしてほしい」という身体からのメッセージでもある。\n\n休息や癒やしを後回しにしていないか、自分の心の声を見失っていないかを見つめ直す機会を与えているのである。',
    guardianName: 'バステト／エジプト守護神',
    guardianDesc: '人々を病や悪しきものから守護する女神であり、豊穣や喜びを司る存在。\n\n音楽や踊りを愛し、楽器を手にした姿でも知られている。\n\nバステトは、生きる喜びこそが人を元気にする力であることを教えてくれる。\n\n好きな音楽を聴くこと。美しいものを眺めること。心が和む人と過ごすこと。\n\n美味しいものを味わうこと。\n\nそうした小さな喜びは、心に光を取り戻し、身体の内側に活力を生み出していく。\n\nバステトは、頑張ることだけではなく、自分を喜ばせることの大切さに気づかせてくれる女神である。\n\nそして、楽しむことや笑うことを通して、心と身体に溜まった重たいものを手放し、本来の生命力を呼び覚ましてくれるのである。',
    handle: 'ビョーキの力は、不安や悲しみを抱え込み、自分の喜びを忘れた時に強くなります。\n\nだからこそ、自分を喜ばせる時間を意識して持つことが大切です。\n\n好きな音楽を聴く。自然に触れる。美味しいものを味わう。感謝できることを見つける。\n\nどんなに小さなことでも構いません。\n\n心が喜ぶ時間を積み重ねることで、身体にも明るいエネルギーが巡り始めます。\n\n喜びに満たされ、自分自身を大切にできるようになった時、バステトはあなたを優しく守護し、ビョーキは手を出すことができなくなるでしょう。',
    img: require('../../assets/negative/neg_18.jpg'),
  },
  {
    num: 19,
    name: 'キョリョ（狭慮）',
    negDesc: '視野を狭くし、自分とは異なる考えや価値観を受け入れられなくする神。\n\n「自分が正しい」「あの人は間違っている」「理解できない人とは関わりたくない」\n\nそんな思いを少しずつ心に植え付け、人との間に見えない壁を作っていく。\n\nキョリョの力が強くなるほど、人は自分と似た考えだけを求めるようになり、新しい学びや出会いを遠ざけてしまう。\n\nそして気づかないうちに心は閉ざされ、周囲とのつながりを失い、孤独の中へと追い込まれていくのである。\n\nしかしキョリョが現れる時は、自分の世界が狭くなっていることを知らせるサインでもある。\n\n本当の成長とは、自分と異なる考えを否定することではなく、その存在を認めながら視野を広げていくことなのである。',
    guardianName: 'クヌム／エジプト守護神',
    guardianDesc: '粘土をこねて神々や人間、大地、そして万物を創造したとされる創造神。\n\n陶芸の守護神としても知られ、命を形づくる存在として古くから崇められてきた。\n\nクヌムは、人は一人では生きられないことを教えてくれる。\n\nどんな才能も、どんな成功も、多くの人との出会いや支えの中で育まれていく。\n\nまた、人それぞれが異なる個性や役割を持つことも教えてくれる。\n\n陶芸家が様々な形の器を作るように、この世界には同じ人間は一人として存在しない。\n\nだからこそ違いを認め合い、学び合い、支え合うことで人生は豊かになっていくのである。\n\nクヌムは、これからの人生に必要となる仲間や友人との縁を育てる知恵を授け、心の器を広げてくれる神なのである。',
    handle: 'キョリョの力は、人を批判したり、自分と違う価値観を拒絶したりする時に強くなります。\n\nそんな時は、自分とは異なる考えの中にも学びがあることを思い出してみましょう。\n\n人の話に耳を傾けること。感謝の気持ちを伝えること。互いの違いを認めること。\n\nその積み重ねが、人との信頼や友情を育てていきます。\n\n前向きな仲間と語り合い、支え合いながら歩む時、クヌムはあなたの人生に必要なご縁を結び、キョリョは手を出すことができなくなるでしょう。',
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
            <LinearGradient colors={['#E8758A', '#C45070']} style={styles.templeButtonGradient}>
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
                      style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #F5C0CC', width: '100%', color: '#3D1A1A', background: '#FFFAF9' }}
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
                      style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #F5C0CC', width: '100%', color: '#3D1A1A', background: '#FFFAF9' }}
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
                      style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #F5C0CC', width: '100%', color: '#3D1A1A', background: '#FFFAF9' }}
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
              colors={birthYear && birthMonth && birthDay ? ['#E8758A', '#C45070'] : ['#D0C0C0', '#D0C0C0']}
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
  container: { flex: 1, backgroundColor: '#FFFAF9' },
  scrollContent: { padding: 20, paddingTop: 48, paddingBottom: 60, alignItems: 'center', maxWidth: 600, alignSelf: 'center' as any, width: '100%' },

  introHeader: { alignItems: 'center', marginBottom: 24 },
  introTitle: { fontSize: 24, fontWeight: '800', color: '#3D1A1A', textAlign: 'center', lineHeight: 36, letterSpacing: 1 },
  introTitleUnderline: { width: 60, height: 2, backgroundColor: '#F5C0CC', marginTop: 12, borderRadius: 2 },
  introCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: '#F5C0CC', shadowColor: '#E8758A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  introText: { fontSize: 14, color: '#374151', lineHeight: 26 },

  templeButton: { borderRadius: 50, overflow: 'hidden', marginBottom: 20, shadowColor: '#E8758A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  templeButtonGradient: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, alignItems: 'center' },
  templeButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: '700', letterSpacing: 2 },

  inputHeader: { alignItems: 'center', marginBottom: 20 },
  inputTitle: { fontSize: 18, fontWeight: '700', color: '#3D1A1A', textAlign: 'center' },
  inputSubtitle: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
  inputCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F5C0CC', width: '100%' },
  inputLabel: { fontSize: 13, color: '#C45070', fontWeight: '600', marginBottom: 6 },
  nativeInputWrap: { width: '100%' },
  webInputRow: { flexDirection: 'row', gap: 12 } as any,
  webInputGroup: { flex: 1 },

  divineButton: { borderRadius: 50, overflow: 'hidden', marginBottom: 20, shadowColor: '#E8758A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  divineButtonDisabled: { opacity: 0.6 },
  divineButtonGradient: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, alignItems: 'center' },
  divineButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: '700', letterSpacing: 2 },

  godImageWrap: { alignItems: 'center', marginBottom: 20, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F5C0CC', width: '100%' },
  godImage: { borderRadius: 8 },

  negCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F5C0CC', width: '100%', shadowColor: '#E8758A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  negCardHeader: { marginBottom: 12 },
  negCardTag: { fontSize: 10, color: '#C45070', fontWeight: '700', letterSpacing: 2, backgroundColor: '#FFE0E8', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 6 },
  negCardName: { fontSize: 20, fontWeight: '800', color: '#3D1A1A' },
  negCardDesc: { fontSize: 14, color: '#374151', lineHeight: 26 },

  guardianCard: { backgroundColor: '#FFF8F0', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F0E0D0', width: '100%', shadowColor: '#E8758A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  guardianCardHeader: { marginBottom: 12 },
  guardianCardTag: { fontSize: 10, color: '#C9A84C', fontWeight: '700', letterSpacing: 2, backgroundColor: '#FFF0D0', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 6 },
  guardianCardName: { fontSize: 20, fontWeight: '800', color: '#C9A84C' },
  guardianCardDesc: { fontSize: 14, color: '#374151', lineHeight: 26 },

  handleCard: { backgroundColor: '#FFF0F3', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F5C0CC', width: '100%' },
  handleTitle: { fontSize: 15, fontWeight: '700', color: '#C45070', textAlign: 'center', marginBottom: 12, letterSpacing: 1 },
  handleText: { fontSize: 14, color: '#374151', lineHeight: 26 },

  resetButton: { borderWidth: 1, borderColor: '#E8758A', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', backgroundColor: 'transparent' },
  resetButtonText: { color: '#E8758A', fontSize: 15, fontWeight: '600' },
});
