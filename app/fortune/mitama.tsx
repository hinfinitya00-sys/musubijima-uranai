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
  {
    num: 1,
    title: 'いま ここ に心を置く',
    subtitle: '',
    shushi: 'あめのみなかぬしのかみ',
    kotodama: 'う',
    message:
      'あなたは「いまここ」に心をおいていますか？ 人は命が産み出だされた瞬間から旅を始めます。今という瞬間は、過去へ、そして、未来へと繋がり、心はどこへでも時空を超えて旅をすることが許されます。 まだまだ未熟な心は、操縦も不安定で衝突することもあります。 時には「今」という時間から心が遠くに離れてしまい、「心」が迷子になってしまうこともありまが、いざという時には「今ここ」に心を戻すことができる「どこでもドア」を持っています。こうして私たちは器用に心を操縦しているのです。しかし、その心は、本当に自分の意志でいつも操縦できているでしょうか？ 実は、自分の意志ではなく感情に心を奪われていて、その感情があなたの心を操縦をしている、と、いうことはありませんか？「今」という瞬間を味わい、心を大切にできるのは自分しかいません。「今」とうこの瞬間は、2度と訪れることのない大切な「時」なのです。しかし、その時を「今を生きている」ということに気づけず、今に心を置けないまま、今という時を過ごしている人がたくさんいます。 嬉しい時、楽しい時、悲しい時、辛い時、怒りに震える時…。どんな時でも「今」というこの瞬間は、あ',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_27.jpg',
  },
  {
    num: 2,
    title: '心を積極的にする',
    subtitle: '',
    shushi: 'たかみむすびのかみ',
    kotodama: 'あ',
    message:
      'あなたのために用意された尊いプレゼントです。 心を「明るく」することを真剣に取り組み、前を向いて進んでください。もし、できない自分に出会っても「やっぱりダメな私…」などと落ち込むことは要りません。 落ち込まず、焦らず「また始めよう」と、繰り返しチャレンジをするのです。 そして、何度も取り組みながら、時間をかけて、自分自身の心と向き合う時間を大切にしてください。 どんな心に気づいても、それは自分自身です。自分の中にある(心・芯)を知ることを恐れないでください。 「顕れる」とは明らかになることであり、その対称には必ず潜んで存在しているものがあり、心もその一つです。 潜在している(心)が明るければ、必ず明るい現象が顕れます。 いつでも「明るい心」を持ち続けていてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_28.jpg',
  },
  {
    num: 3,
    title: '受け入れる',
    subtitle: '',
    shushi: 'かみむすびのかみ',
    kotodama: 'わ',
    message:
      'あなたの中に潜んでいるからです。 その原因を見つける努力を怠らないでいてください。 この世に存在する全てのものは対立の関係にあります。 その対立が一つになる時、物事は形として現れ、盛んになり、発展します。 相反するもの、原因(陰)と結果(陽)の関係は、愛によって結ばれます。 すべての「結び」は「愛」によって「和」を得た姿です。草木が実を結ぶこと、願いがかなうこと、結果として出来上がること、あらゆるものは愛によって育ち、愛によって栄え、愛によって幸福も生み出されます。 愛とはその価値を認め、いつくしむ心、大切に思う心です。 その心は「受け入れる愛」です。 その心が「結び」となり「和」を得た姿となるのです。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_29.jpg',
  },
  {
    num: 4,
    title: '「喜び」を妄想する',
    subtitle: '',
    shushi: 'うましあしかびひこぢのかみ あめのとこたちのかみ',
    kotodama: 'を・お',
    message:
      'あなたが引き寄せて起こした現象です。 それは意識的に蒔かれたもの、無意識的に蒔かれたもの、それら全てを含み、自分の意志に関係なく芽が出てくるために戸惑うこともあります。 「こころ」に思ったことは形として現れます。 例えば「私はついていないな…。」と、心に思えば「ついていない」現象が起こり、「嫌な予感がする」と、心に思えば、その予感はよく当たります。 しかし、それは、当たったのではなく、その人の心の通りに境遇の方が変わったのであり、心に思わなかったら起こることのなかった現象です。 生まれた西暦、性別、親など変えられない宿命はあります。 地震や津波など、どうすることも出来ない自然の定めもあります。 しかし、その定めでも、自らの努力によって運命を切り開くことができます。 そのためには、清らかな心を持ち、積極的な明るい心でいることが大切です。 「運命」は心の状態で大きく変わります。 それは、意志の選択と行動によって現象が生じてくるからです。 新たな形にするための思考に注意をしてください。 「喜ぶ」現象が起こったことをいつでも想い描き続け、それを「新たな形」に成していくのです。 「思い」「心」は',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_30.jpg',
  },
  {
    num: 5,
    title: '新たな行動を起こす',
    subtitle: '',
    shushi: 'くにのとこたちのかみ とよくもののかみ',
    kotodama: 'え・ヱ',
    message:
      'より学んだ様々な事柄を理解して自分のものにすることです。 常に立ち起こる様々な現象に対し、心は選択と行動によって実在する現象を再び内に(心に)集めながら、常に未来に対して影響を及ぼしています。 その未来へ続く道のりは、たくさんの分かれ道があり、常に選択する自由が与えられていて、すべては自分の意志によって開かれた未来へ向かいます。 生きるために安全でいることを主として選択するとき、新しい行動を起こすことにブレーキがかかります。 それは「今のままがいい」という本能が、過去の経験やこだわりに囚われ、変化を嫌うために起こるためで「今が快適かどうか」といった目の前にある「楽」や「快」だけを見て選択、判断をするため、未来へ繋がる新たな行動チャレンジにブレーキをかけてしまいます。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_31.jpg',
  },
  {
    num: 6,
    title: '共感する仲間と出逢う',
    subtitle: '',
    shushi: 'うひぢにのかみ すひぢにのかみ',
    kotodama: 'ち・ヰ',
    message:
      'あなたの素晴らしい未来のために、揺るぎない基礎を「土台」を築くあなたの真実の「考え方」をいつも意識していてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_32.jpg',
  },
  {
    num: 7,
    title: '因果を断ち切り伸びる',
    subtitle: '',
    shushi: 'つのぐひのかみ いくぐひのかみ',
    kotodama: 'き・み',
    message:
      'あなたの中にあるのなら、その原因となる感情を抱いた頃にもう一度立ちかえってみてください。 そして、今はもう必要でない感情であることを自覚し、当時に感じたままになっている悲しみや悔しさを、涙と共に流してあげてください。 涙と共に流し切った時、その頃の感情は今の生活に必要のない過去のこととして捉えられるようになり、その感情を捨てることができます。 因果の世界を突き破り、そこから離れ「伸びる」ことができます。因果を断ち切ることで、見え方、捉え方が変わります。 振り返ることを恐れず立ち返り、その頃の自分へ「もう大丈夫」と、声をかけてあげてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_33.jpg',
  },
  {
    num: 8,
    title: '物事が収束に向かう',
    subtitle: '',
    shushi: 'おほとのぢのかみ おほとのべのかみ',
    kotodama: 'し・り',
    message:
      'て考えがまとまり、最終地点にたどり着きます。 人は物事を一瞬にして感じとり、思いや考えを巡らせ、それらをどのように組立て表現することが最良なのか、その方法、その伝え方、伝える時期など、様々な方向から心を捉えて選択と判断を行い、実行に移していきます。 まわりに起こる事の成り行きは、必ずどこがで収束に向かいます。 そこまでの道のりは、すぐに状況が進む場合もあれば、長期間向き合わなければならない場合もあります。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_34.jpg',
  },
  {
    num: 9,
    title: '物事が開花する',
    subtitle: '',
    shushi: 'おもだるのかみ あやかしこねのかみ',
    kotodama: 'ひ・に',
    message:
      'める力とは、料理に例えると、長い時間火にかけ材料を柔らかくし、灰汁を捨て、水分が少なくなるまで煮て、味を濃くし、美味しく料理を仕上げることです。 もし最後の仕上げの時に「あと少しで仕上がる」と油断し、緊張を緩めて目を話してしまうと、最後の最後になって料理が焦げてしまい、これまでの努力が台無しに終わってしまいます。 物事も同じように、色々な方面からよく調べ「これでいいかどうか」と、よく考えて押し詰める力、検討を十分に重ねて結論を出す力のことで、いつでも緊張を忘れず、確認しながら、不安な材料、必要じゃない考えは捨て去ること、そして開花の瞬間を見逃さない能力を育てる忍耐が必要です。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_35.jpg',
  },
  {
    num: 10,
    title: '未来を創造する',
    subtitle: '',
    shushi: 'いざなきのかみ',
    kotodama: 'い',
    message:
      'あなた自身の中にあり、過去の感情の記憶によって自らがつくり出した人工の物なのです。 そして、その心のままに未来を創造している自分に気づかず過ごしています。 「すなおな心」でいるために大切な事は「明るい積極的な心」を意識し、あるがままを受け入れる正常な心でいられるよう、いつ、どんなでも笑顔を忘れないことです。 至る心はいつも「すなおな心」積極的な心です。 心に思ったことは必ず現実となって顕れます。 「心」が未来を創っているということを忘れず「すなおな心」積極的な心でいることをいつも意識していてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_36.jpg',
  },
  {
    num: 11,
    title: '言葉が未来を創る',
    subtitle: '',
    shushi: 'いざなみのかみ',
    kotodama: 'ゐ',
    message:
      'あなたの未来はつくられるからです。 「自分の言葉が自分の未来をつくる」ということをいつも意識し、いつでも「美しい言葉」を選択する習慣を身に付けてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_37.jpg',
  },
  {
    num: 12,
    title: '運命を切り開く原動力',
    subtitle: '',
    shushi: 'おおことおしをのかみ',
    kotodama: 'た',
    message:
      'あなたを取り巻く全ての人に幸せをもたらします。 実際に存在するものや、経験から得た感情によって、思考や想像は益々膨らんでいきます。 その実際に意識として感じている本は、過去に現象が潜在意識へと蓄積された他から受けた印象の記憶、経験によって抱いた感情の記憶など、無意識の領域に蓄積された見えない力が本となって有意識に働きかけ、それが現実となって現れています。 そして、今の現実は、経験として再び潜在意識へと記憶されていきます。 このサイクルを意識していることが大切です。 喜びの思想や想像は、今を明るくし、未来を明るくします。 人間は、夢や理想を持つことができる唯一の動物です。 その夢や理想が人生を切り開く原動力となるのです。 その湧き出るあなたの清きエネルギーを深く感じてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_38.jpg',
  },
  {
    num: 13,
    title: '希望の花を咲かせる',
    subtitle: '',
    shushi: 'いはつちひこのかみ いはすひめのかみ',
    kotodama: 'と・よ',
    message:
      'あなたの自由です。あなたの「希望の花」を命一杯に咲かせてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_39.jpg',
  },
  {
    num: 14,
    title: '真実を確認する',
    subtitle: '',
    shushi: 'おほとひわけのかみ',
    kotodama: 'つ',
    message:
      'あなたの中に秘められた「真実の光」が強く輝いています。 勇気を出して目の前の扉を押し開いてください。 あなたの人生の転機が「いま、ここ」にあります。 今までの思考をすべて捨て去り、魂が共鳴する真実だけを新たに掴むことで、新しい次の世界に身を置くことができます。 批判する心、否定する心、自分を責める心、憂い心など、あなたの心を暗くしていた感情や思考は、今からの未来に必要のない心です。 あなたの中に秘められた「真実の光」を確かなものと信じて、今すぐ積極的な心で新たな行動を起こしてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_40.jpg',
  },
  {
    num: 15,
    title: 'わくわくを想像する',
    subtitle: '',
    shushi: 'あめのふきをのかみ',
    kotodama: 'て',
    message:
      'あなたのこれからの「夢」と「希望」を思い描いて下さい。 その描いた未来に、心は「わくわく」していますか？ 人は、過去の経験の記憶の上に、自分の未来を描いてしまいがちです。 もしそこに、自尊心を傷つけられた記憶が邪魔をしていたら、夢や希望は小さなものになってしまいます。 もしかしたら、不安や恐怖が先行し，結果について否定的な想像しかできず、行動する勇気を失くしてしまうかも知れません。 あなた自身を大切にする気持ちを持つことは、あなた自身を守ります。 自分の思想や言動に自信を持ち、他からの干渉を排除する勇気も必要です。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_41.jpg',
  },
  {
    num: 16,
    title: '成功体験を得る',
    subtitle: '',
    shushi: 'おほやひこのかみ',
    kotodama: 'や',
    message:
      'あなたの無限の未来に向かって、今、矢が放たれようとしています。 あなたの中で力強く引き絞られた弓は、しなやかさと強さがあります。 これまで乗り越えてきた数々の忍耐と経験は喜びとなり、未来に向かって放たれる生きた矢となって大いなる力を見出していくのです。 これまであなたを覆いながらそばで守り助けていたものは、過ぎ去った昔の出来事のように遠く離れ、また、いつでもそばであなたを助け続けます。 時空を超え、過去へ、未来へと見えない世界で繋がっているのです。 これからのあなたに必要なものは、多くの「達成経験」「成功体験」です。 達成や成功の大小を気にする必要はありません。 前の自分より、ちょっとだけ成長したことを意識してください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_42.jpg',
  },
  {
    num: 17,
    title: '自他ともに幸せになる',
    subtitle: '',
    shushi: 'かざもつわけのおしをのかみ',
    kotodama: 'ゆ',
    message:
      'あなたの心を囚われないように、あなたの心に気を配ることを意識していてください。 あなたの中にためられた様々な感情が煮えたち、地中から湧き出る熱水泉のように勢いよく外へ向かって放出しようとしています。 その心の動きを注意深く観察していてください。 温泉は、身体を温めたり、血流を良くしたり、皮膚から吸収される成分によって健康作用があったりと様々な作用と癒す効果があります。 しかし、熱水泉をそのまま人が触れば大火傷をします。 適度な温度の温泉のようにあたたかく癒しを与える人は、一緒にいると心が和んだり、元気や勇気が湧いて来たり、良き教えによって人を導いたりしますが、熱水泉のような人は、感情や欲望を思いのままぶつけてしまいます。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_43.jpg',
  },
  {
    num: 18,
    title: 'ゆったりした時間',
    subtitle: '',
    shushi: 'おほわたつみのかみ',
    kotodama: 'ゑ',
    message:
      'あなたは誰と共に過ごしていましたか？ あなたの人生の縮図は、様々な局面を彩りよく表現し、そのひとつひとつの場面に関わったご縁ある方々は、あなたを守り、育て、共に笑い、共に喜び、時には一緒に泣いてくれ、叱ってくれた大切な縁ある人たちです。 中には、あなたの人生の悪役として登場した方がいたかも知れません。 心配で心が落ち着かない時、過剰に気持ちが高ぶっている時こそ、急がず、焦らず、もう一度この縮図を思い出し、自然に任せて、ゆっくりと過ごしてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_44.jpg',
  },
  {
    num: 19,
    title: '太陽の実りを喜ぶ',
    subtitle: '',
    shushi: 'はやあきつひこのかみ あやあきつひめのかみ',
    kotodama: 'け・め',
    message:
      'あなたの周りにも人が集まり、頼りにされ、楽しくにぎやかな時を過ごすことができます。 今、あなたが心がけることは「周囲の人を明るく照らすこと」です。温かい心で他の人を受け入れてください。 その行いは様々な面で盛んになり、人々に影響を与え、実りをもたらします。 もし、心配や恐れなどの「憂える心」「悲観的な心」がある場合は、まだ心は夜中であると思い込んで静かに休んでいる状態です。 もう夜は明け、眠りから覚めて生き生きと活動する時です。 夜明けが来たのだということを自覚し、先ずは小さな一歩を踏み出して、その一歩を踏み出せたことを喜んでください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_45.jpg',
  },
  {
    num: 20,
    title: 'モノを大切に扱う',
    subtitle: '',
    shushi: 'あわなぎのかみ あわなみのかみ',
    kotodama: 'く・む',
    message:
      'あなたとのもとへかえってきます。 それは、物であり、お金であり、人であり、想いであり、この世で働きのあるもの、エネルギーが通うすべてのものや関係を含みます。 その関係にどのように働かせたか、生かす働きかけをしたならば、生かされた形であなたのものとへかえってきます。 逆に、粗末な働きかけをしたならば、粗末な形であなたに降りかかり、そのままかえってきます。 「ものは生きている」といいます。 どんなものでも大切にあつかうと、それによってケガをすることもなく、その人のために長く上機嫌に動く働きをしてくれます。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_27.jpg',
  },
  {
    num: 21,
    title: '振子の法則を知る',
    subtitle: '',
    shushi: 'つらなぎのかみ つらなみのかみ',
    kotodama: 'す・る',
    message:
      'す。 それは、長い人生をかけて細く長くとぎれることなく続いています。 生活の中で感じた渋みやえぐみ、沸々と湧き起った濁った感情など、不純なものが水面に現れたら、その灰汁を丁寧に取り除いてください。 気づきのある度に手を加えることで透き通る清い水へと変えていくのです。 事を急ぎ過ぎたり、無理が過ぎたり、怠けたり、嫌々ながら事にあたったり、また、感情を高ぶらせて行き過ぎた行動を取ったりすることなどは、水面に現れた灰汁と同じように心に現れた不純なものです。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_28.jpg',
  },
  {
    num: 22,
    title: '運命を味方にする',
    subtitle: '',
    shushi: 'あめのみくまりのかみ くにのみくまりのかみ',
    kotodama: 'そ・せ',
    message:
      'あなたの身体に最高の状態で受け入れることに集中してください。 水は高いところから低いところへと流れます。 下流に器を置けば、そこに水は流れ込み、いつでも新鮮な水を満たし続けることができます。 でも、その器にフタをしてしまえば、水を溜めることができまん。 活きるエネルギーとなる気の流れも同じように、受け入れる準備をしていなければ、最高の状態で受け入れることができず、また循環することが出来ないため、良い状態で活かすことができないのです。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_29.jpg',
  },
  {
    num: 23,
    title: '信じ込む力を強固',
    subtitle: '',
    shushi: 'あめのくひざもちのかみ くにのくひざもちのかみ',
    kotodama: 'ほ・へ',
    message:
      'あなたが心に描いた信念は、人々に豊かさを与えていくものです。 その信念を、広く多くの人々に届ける意識で行動してください。 心の中の思考を外に向かって拡げ伝えていくことは、自信を付けていくことにつながります。 自信を持って行動するようになると「こうしよう」という強い考えが生まれ、固めることができ、信念を持って行動することは信頼関係を築きます。 最初は自信を持つことができないかも知れません。 それでも信念を固めたら「必ずできる」と自分を信じ、失敗を恐れずやり続けることです。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_30.jpg',
  },
  {
    num: 24,
    title: '希望の光が射す',
    subtitle: '',
    shushi: 'しなつひこのかみ',
    kotodama: 'ふ',
    message:
      'あなたの吹く息で、見事に吹き払われていきます。 目の前の視界が広がり、長い間あたため続けた「こうしようと心に決めたこと」「あなたの希望」が動き始めます。 事が進まずもどかしい時期を過ごされていた想いも、時を迎え、いま活かされていくとき「時期・時間・志」がピッタリと一致している瞬間です。 当時では理解できなかったことでも、今になれば理解できることがたくさんあります。理解し判断する力は、その考えに至ることによって力が付き、その力が理性を育て、感情を育て、「豊かな心」を育てます。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_31.jpg',
  },
  {
    num: 25,
    title: '共存共栄する世界',
    subtitle: '',
    shushi: 'くくのちのかみ',
    kotodama: 'も',
    message:
      '々な生きものたちが盛んに活動をはじめ、それぞれに役割を果たしながら共存し、繁栄への世界に向かって活動しています。 新しく芽が出るものもあり、物事が発展へ向かいます。 新たなものを見たり聞いたりと知識を得ながら、感情や思考など心の働きを通して新たな感覚を経験することで、細胞を活性化しながら骨格を育て、心を育て、人格を育てます。 身体は命(魂)を乗せた乗り物です。 この乗り物は、人生に必要な情報と装備が備わった完全な乗り物です。 その身体を大切に扱い、手入れをしながら、私たちは、人生という長い旅を共にしています。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_32.jpg',
  },
  {
    num: 26,
    title: '自分の宝に気づく',
    subtitle: '',
    shushi: 'おほやまつみのかみ',
    kotodama: 'は',
    message:
      'あなたの「宝」を輝かせ、あなたという「個性」を伸ばします。 小さい頃、あなたはどんな「夢」を描いていましたか？ 子どもが「夢」を語る姿はとても力強く、希望のエネルギーに満ち溢れていて「もしかしたらできないかも…」などといった不安はありません。 未来に向かって「今を生きる力」がとても強いのです。 「希望」はエネルギーの源であり「個性・宝」を磨き輝かせます。 「希望」は信じる力を永遠のものにし、現実にする力を持っているのです。 あなたの魂は、命をつないだ祖先たちの希望と共に生き、大いなる力に見守られています。 あなたの積極的な心が、その力を引き寄せ「個性」を輝かせていきます。 あなたの大切な「宝」を大事に生かしてください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_33.jpg',
  },
  {
    num: 27,
    title: 'どの道もすばらしい',
    subtitle: '',
    shushi: 'かやのひめのかみ',
    kotodama: 'ぬ',
    message:
      'あなたは人生の目的に向かって真実の道を正確に進んでいます。 自然なまま、そのままのあなたでいてください。 あなたはこの世に生を受けるとき「しあわせになる」と、自ら誓いをたて、大いなる魂と約束を結んで誕生しました。 そして、魂を輝かす生き方を自らが計画し、最もふさわしい時代、場所、両親などを自分で選択して、父からは精気を、母からは身体をいただいて、あなたの心の働きをつかさどる魂をその身体に宿したのです。 必ず目的に向かって道は続き、どの道もあなたに用意された真実の道です。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_34.jpg',
  },
  {
    num: 28,
    title: '喜びを分かち合う',
    subtitle: '',
    shushi: 'あめのさつちのかみ くにのさつちのかみ',
    kotodama: 'ら・さ',
    message:
      'ち合う時です。 お米づくりは、草を抜き土地を耕し水を張って稲を植え、雑草や害虫を取り除きながら実りを迎えるまで大切に育てます。穂が実り、その恵みに感謝しながら稲を刈り取った後も、私たちが口にするお米の形になるまでにはたくさんの人の働らきがあります。 お米づくりは、日本を代表する素晴らしい伝統文化であり、愛を象徴します。 人間は、たくさんの人たちと関わりを持ちながら生きています。 誰の手も借りずに人生を生き抜くことはできません。その命はかけがえのない尊い命です。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_35.jpg',
  },
  {
    num: 29,
    title: '誰かのためにを考える',
    subtitle: '',
    shushi: 'あめのさぎりのかみ くにのさぎりのかみ',
    kotodama: 'ろ・れ',
    message:
      'あなたを支え、大切な人を守るものです。 私たち大人はその事を良く知り、自分を守り、大切な人を守り、これからの社会を担う子どもたちのために、そのことを教え、伝え、その場を提供していく役目があります。 誰かが築いた場所があったから、あなたの命は守られ、今を迎えることができました。 小さなことからで良いのです。 次は、あなたが誰かのためにその場所を築くときです。 誰かのために少しだけあなたの時間を使ってください。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_36.jpg',
  },
  {
    num: 30,
    title: '事実はひとつ',
    subtitle: '',
    shushi: 'あめのくらどのかみ くにのくらどのかみ',
    kotodama: 'の・ね',
    message:
      'あなたに「冷静な判断で物事を捉えるように」「事実をそのまま捉えるように」と、呼びかけています。 そのものの本体、「事実」は、一つしかありません。 「事実」とは、その物事のもとから出発して成り立ち現れた姿のことで、そこを取り巻く環境には、たくさんの人々が存在しています。 その各々の境遇を中心として、その「事実」を捉えたものが「真実」です。 「真実」とは、うそや偽りがなく飾りのない「本当」のことをいいます。 これも「事実」と同様、一つしかありません。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_37.jpg',
  },
  {
    num: 31,
    title: 'ぶれない「芯」を持つ',
    subtitle: '',
    shushi: 'おほとまどひこのかみ おほとまどひめのかみ',
    kotodama: 'か・ま',
    message:
      'あなたの前に光の道が拡がりました。 周りには何もない大自然の中、夜空に輝く星空を見上げている景色を想い描いてください。そこにはざわつくネオンの光りも、夜道を照らす街灯も、団らんを囲む家の明かりも何もありません。辺りは真っ暗な静かな夜です。 目を瞑り、耳を澄ませば、風が流れる音、大空に拡がる星の気配、遠くに聞こえる水のせせらぎ、小動物の鳴き声、虫の足音など、心を落ち着かせると自然から聞こえる様々な音や気配に気が付きます。 日常の生活に追われ、焦りや急ぎの真っ只中にいる人は、周りで起こる様々な出来事に心が気づかず、感動をすることから遠ざかっていきます。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_38.jpg',
  },
  {
    num: 32,
    title: '共感する仲間と出逢う',
    subtitle: '',
    shushi: 'とりのいはくすふねのかみ',
    kotodama: 'な',
    message:
      'あなたの強さとなり、曇りは晴れ、澄み渡った青空を手に入れることができるのです。 伸び伸びと自由に澄み渡った青空へ、今、飛び立つのです。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_39.jpg',
  },
  {
    num: 33,
    title: '人生の主人公を演じる',
    subtitle: '',
    shushi: 'おほげつひめのかみ',
    kotodama: 'こ',
    message:
      'あなたは人生の主人公を演じています。 天・地の大いなる景を縮図にした人生ドラマはオリジナルのもので、綿密に描かれていて、遠い昔から永遠の未来へと続いています。 私たちは、その永遠に続く大規模な人生ドラマの一部を切り取って、人生の主人公を演じています。 主人公は、子になり親になり、社員になり社長になり、夫に妻にとそれぞれの役をこなし、時には他人のドラマのエキストラとしても出演します。 個々の人生ドラマはそれぞれに顕在していながら、潜在世界(非顕在世界)ではそのすべてが一つに繋がっていて統一されています。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_40.jpg',
  },
  {
    num: 34,
    title: '天性を伸ばしていく',
    subtitle: '',
    shushi: 'ほのやぎはやをのかみ',
    kotodama: 'ん',
    message:
      'あなたは輝く人生を生きています。 すべての人が輝く人生を生きています。 一人の命は、見えない大いなる力によって生かされた尊い命です。 この命は自分で生み出した命ではなく、見えない力によって生み出され、生かされています。 すべての人がすばらしい特性を持ち、他の誰とも比べることができない尊い個性を持っています。 その個性は、天性を出来るだけ伸ばそうと努力をすることによって、この世界で必ず開花して結果として実を結ぶことが約束されていて、その能力は無限に向上し続ける強靭な生命力を秘めています。 感情に心を奪われることは、その個性を犠牲にしてしまいます。 その感情とは、過去を心配し、未来を心配する心です。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/mkj_41.jpg',
  },
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
        alt="み・たまカード"
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
          <Text style={styles.title}>み・たまカード</Text>
          <Text style={styles.subtitle}>
            心を静めて、直感で1枚引いてください。{'\n'}
            今のあなたに必要なメッセージが届きます。
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
              <Text style={styles.cardTitle}>{selectedCard.title}</Text>

              {/* Subtitle */}
              {selectedCard.subtitle ? (
                <Text style={styles.cardSubtitle}>{selectedCard.subtitle}</Text>
              ) : null}

              {/* Info Row: Shushi & Kotodama */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>宗祀</Text>
                  <Text style={styles.infoValue}>{selectedCard.shushi}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>言霊</Text>
                  <Text style={styles.infoValue}>{selectedCard.kotodama}</Text>
                </View>
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
