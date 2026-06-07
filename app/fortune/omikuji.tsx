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
import { shareResult } from '@/lib/share';

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
    title: "いま ここ に心を置く",
    subtitle: "う",
    tehanasu: "あめのみなかぬしのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたは「いまここ」に心をおいていますか？ 人は命が産み出だされた瞬間から旅を始めます。今という瞬間は、過去へ、そして、未来へと繋がり、心はどこへでも時空を超えて旅をすることが許されます。 まだまだ未熟な心は、操縦も不安定で衝突することもあります。 時には「今」という時間から心が遠くに離れてしまい、「心」が迷子になってしまうこともありまが、いざという時には「今ここ」に心を戻すことができる「どこでもドア」を持っています。こうして私たちは器用に心を操縦しているのです。しかし、その心は、本当に自分の意志でいつも操縦できているでしょうか？ 実は、自分の意志ではなく感情に心を奪われていて、その感情があなたの心を操縦をしている、と、いうことはありませんか？「今」という瞬間を味わい、心を大切にできるのは自分しかいません。「今」とうこの瞬間は、2度と訪れることのない大切な「時」なのです。しかし、その時を「今を生きている」ということに気づけず、今に心を置けないまま、今という時を過ごしている人がたくさんいます。 嬉しい時、楽しい時、悲しい時、辛い時、怒りに震える時…。どんな時でも「今」というこの瞬間は、あ"
  },
  {
    num: 2,
    title: "心を積極的にする",
    subtitle: "あ",
    tehanasu: "たかみむすびのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたのために用意された尊いプレゼントです。 心を「明るく」することを真剣に取り組み、前を向いて進んでください。もし、できない自分に出会っても「やっぱりダメな私…」などと落ち込むことは要りません。 落ち込まず、焦らず「また始めよう」と、繰り返しチャレンジをするのです。 そして、何度も取り組みながら、時間をかけて、自分自身の心と向き合う時間を大切にしてください。 どんな心に気づいても、それは自分自身です。自分の中にある(心・芯)を知ることを恐れないでください。 「顕れる」とは明らかになることであり、その対称には必ず潜んで存在しているものがあり、心もその一つです。 潜在している(心)が明るければ、必ず明るい現象が顕れます。 いつでも「明るい心」を持ち続けていてください。"
  },
  {
    num: 3,
    title: "受け入れる",
    subtitle: "わ",
    tehanasu: "かみむすびのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの中に潜んでいるからです。 その原因を見つける努力を怠らないでいてください。 この世に存在する全てのものは対立の関係にあります。 その対立が一つになる時、物事は形として現れ、盛んになり、発展します。 相反するもの、原因(陰)と結果(陽)の関係は、愛によって結ばれます。 すべての「結び」は「愛」によって「和」を得た姿です。草木が実を結ぶこと、願いがかなうこと、結果として出来上がること、あらゆるものは愛によって育ち、愛によって栄え、愛によって幸福も生み出されます。 愛とはその価値を認め、いつくしむ心、大切に思う心です。 その心は「受け入れる愛」です。 その心が「結び」となり「和」を得た姿となるのです。"
  },
  {
    num: 4,
    title: "「喜び」を妄想する",
    subtitle: "を・お",
    tehanasu: "うましあしかびひこぢのかみ あめのとこたちのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたが引き寄せて起こした現象です。 それは意識的に蒔かれたもの、無意識的に蒔かれたもの、それら全てを含み、自分の意志に関係なく芽が出てくるために戸惑うこともあります。 「こころ」に思ったことは形として現れます。 例えば「私はついていないな…。」と、心に思えば「ついていない」現象が起こり、「嫌な予感がする」と、心に思えば、その予感はよく当たります。 しかし、それは、当たったのではなく、その人の心の通りに境遇の方が変わったのであり、心に思わなかったら起こることのなかった現象です。 生まれた西暦、性別、親など変えられない宿命はあります。 地震や津波など、どうすることも出来ない自然の定めもあります。 しかし、その定めでも、自らの努力によって運命を切り開くことができます。 そのためには、清らかな心を持ち、積極的な明るい心でいることが大切です。 「運命」は心の状態で大きく変わります。 それは、意志の選択と行動によって現象が生じてくるからです。 新たな形にするための思考に注意をしてください。 「喜ぶ」現象が起こったことをいつでも想い描き続け、それを「新たな形」に成していくのです。 「思い」「心」は"
  },
  {
    num: 5,
    title: "新たな行動を起こす",
    subtitle: "え・ヱ",
    tehanasu: "くにのとこたちのかみ とよくもののかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "より学んだ様々な事柄を理解して自分のものにすることです。 常に立ち起こる様々な現象に対し、心は選択と行動によって実在する現象を再び内に(心に)集めながら、常に未来に対して影響を及ぼしています。 その未来へ続く道のりは、たくさんの分かれ道があり、常に選択する自由が与えられていて、すべては自分の意志によって開かれた未来へ向かいます。 生きるために安全でいることを主として選択するとき、新しい行動を起こすことにブレーキがかかります。 それは「今のままがいい」という本能が、過去の経験やこだわりに囚われ、変化を嫌うために起こるためで「今が快適かどうか」といった目の前にある「楽」や「快」だけを見て選択、判断をするため、未来へ繋がる新たな行動チャレンジにブレーキをかけてしまいます。"
  },
  {
    num: 6,
    title: "共感する仲間と出逢う",
    subtitle: "ち・ヰ",
    tehanasu: "うひぢにのかみ すひぢにのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの素晴らしい未来のために、揺るぎない基礎を「土台」を築くあなたの真実の「考え方」をいつも意識していてください。"
  },
  {
    num: 7,
    title: "因果を断ち切り伸びる",
    subtitle: "き・み",
    tehanasu: "つのぐひのかみ いくぐひのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの中にあるのなら、その原因となる感情を抱いた頃にもう一度立ちかえってみてください。 そして、今はもう必要でない感情であることを自覚し、当時に感じたままになっている悲しみや悔しさを、涙と共に流してあげてください。 涙と共に流し切った時、その頃の感情は今の生活に必要のない過去のこととして捉えられるようになり、その感情を捨てることができます。 因果の世界を突き破り、そこから離れ「伸びる」ことができます。因果を断ち切ることで、見え方、捉え方が変わります。 振り返ることを恐れず立ち返り、その頃の自分へ「もう大丈夫」と、声をかけてあげてください。"
  },
  {
    num: 8,
    title: "物事が収束に向かう",
    subtitle: "し・り",
    tehanasu: "おほとのぢのかみ おほとのべのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "て考えがまとまり、最終地点にたどり着きます。 人は物事を一瞬にして感じとり、思いや考えを巡らせ、それらをどのように組立て表現することが最良なのか、その方法、その伝え方、伝える時期など、様々な方向から心を捉えて選択と判断を行い、実行に移していきます。 まわりに起こる事の成り行きは、必ずどこがで収束に向かいます。 そこまでの道のりは、すぐに状況が進む場合もあれば、長期間向き合わなければならない場合もあります。"
  },
  {
    num: 9,
    title: "物事が開花する",
    subtitle: "ひ・に",
    tehanasu: "おもだるのかみ あやかしこねのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "める力とは、料理に例えると、長い時間火にかけ材料を柔らかくし、灰汁を捨て、水分が少なくなるまで煮て、味を濃くし、美味しく料理を仕上げることです。 もし最後の仕上げの時に「あと少しで仕上がる」と油断し、緊張を緩めて目を話してしまうと、最後の最後になって料理が焦げてしまい、これまでの努力が台無しに終わってしまいます。 物事も同じように、色々な方面からよく調べ「これでいいかどうか」と、よく考えて押し詰める力、検討を十分に重ねて結論を出す力のことで、いつでも緊張を忘れず、確認しながら、不安な材料、必要じゃない考えは捨て去ること、そして開花の瞬間を見逃さない能力を育てる忍耐が必要です。"
  },
  {
    num: 10,
    title: "未来を創造する",
    subtitle: "い",
    tehanasu: "いざなきのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなた自身の中にあり、過去の感情の記憶によって自らがつくり出した人工の物なのです。 そして、その心のままに未来を創造している自分に気づかず過ごしています。 「すなおな心」でいるために大切な事は「明るい積極的な心」を意識し、あるがままを受け入れる正常な心でいられるよう、いつ、どんなでも笑顔を忘れないことです。 至る心はいつも「すなおな心」積極的な心です。 心に思ったことは必ず現実となって顕れます。 「心」が未来を創っているということを忘れず「すなおな心」積極的な心でいることをいつも意識していてください。"
  },
  {
    num: 11,
    title: "言葉が未来を創る",
    subtitle: "ゐ",
    tehanasu: "いざなみのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの未来はつくられるからです。 「自分の言葉が自分の未来をつくる」ということをいつも意識し、いつでも「美しい言葉」を選択する習慣を身に付けてください。"
  },
  {
    num: 12,
    title: "運命を切り開く原動力",
    subtitle: "た",
    tehanasu: "おおことおしをのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたを取り巻く全ての人に幸せをもたらします。 実際に存在するものや、経験から得た感情によって、思考や想像は益々膨らんでいきます。 その実際に意識として感じている本は、過去に現象が潜在意識へと蓄積された他から受けた印象の記憶、経験によって抱いた感情の記憶など、無意識の領域に蓄積された見えない力が本となって有意識に働きかけ、それが現実となって現れています。 そして、今の現実は、経験として再び潜在意識へと記憶されていきます。 このサイクルを意識していることが大切です。 喜びの思想や想像は、今を明るくし、未来を明るくします。 人間は、夢や理想を持つことができる唯一の動物です。 その夢や理想が人生を切り開く原動力となるのです。 その湧き出るあなたの清きエネルギーを深く感じてください。"
  },
  {
    num: 13,
    title: "希望の花を咲かせる",
    subtitle: "と・よ",
    tehanasu: "いはつちひこのかみ いはすひめのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの自由です。あなたの「希望の花」を命一杯に咲かせてください。"
  },
  {
    num: 14,
    title: "真実を確認する",
    subtitle: "つ",
    tehanasu: "おほとひわけのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの中に秘められた「真実の光」が強く輝いています。 勇気を出して目の前の扉を押し開いてください。 あなたの人生の転機が「いま、ここ」にあります。 今までの思考をすべて捨て去り、魂が共鳴する真実だけを新たに掴むことで、新しい次の世界に身を置くことができます。 批判する心、否定する心、自分を責める心、憂い心など、あなたの心を暗くしていた感情や思考は、今からの未来に必要のない心です。 あなたの中に秘められた「真実の光」を確かなものと信じて、今すぐ積極的な心で新たな行動を起こしてください。"
  },
  {
    num: 15,
    title: "わくわくを想像する",
    subtitle: "て",
    tehanasu: "あめのふきをのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたのこれからの「夢」と「希望」を思い描いて下さい。 その描いた未来に、心は「わくわく」していますか？ 人は、過去の経験の記憶の上に、自分の未来を描いてしまいがちです。 もしそこに、自尊心を傷つけられた記憶が邪魔をしていたら、夢や希望は小さなものになってしまいます。 もしかしたら、不安や恐怖が先行し，結果について否定的な想像しかできず、行動する勇気を失くしてしまうかも知れません。 あなた自身を大切にする気持ちを持つことは、あなた自身を守ります。 自分の思想や言動に自信を持ち、他からの干渉を排除する勇気も必要です。"
  },
  {
    num: 16,
    title: "成功体験を得る",
    subtitle: "や",
    tehanasu: "おほやひこのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの無限の未来に向かって、今、矢が放たれようとしています。 あなたの中で力強く引き絞られた弓は、しなやかさと強さがあります。 これまで乗り越えてきた数々の忍耐と経験は喜びとなり、未来に向かって放たれる生きた矢となって大いなる力を見出していくのです。 これまであなたを覆いながらそばで守り助けていたものは、過ぎ去った昔の出来事のように遠く離れ、また、いつでもそばであなたを助け続けます。 時空を超え、過去へ、未来へと見えない世界で繋がっているのです。 これからのあなたに必要なものは、多くの「達成経験」「成功体験」です。 達成や成功の大小を気にする必要はありません。 前の自分より、ちょっとだけ成長したことを意識してください。"
  },
  {
    num: 17,
    title: "自他ともに幸せになる",
    subtitle: "ゆ",
    tehanasu: "かざもつわけのおしをのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの心を囚われないように、あなたの心に気を配ることを意識していてください。 あなたの中にためられた様々な感情が煮えたち、地中から湧き出る熱水泉のように勢いよく外へ向かって放出しようとしています。 その心の動きを注意深く観察していてください。 温泉は、身体を温めたり、血流を良くしたり、皮膚から吸収される成分によって健康作用があったりと様々な作用と癒す効果があります。 しかし、熱水泉をそのまま人が触れば大火傷をします。 適度な温度の温泉のようにあたたかく癒しを与える人は、一緒にいると心が和んだり、元気や勇気が湧いて来たり、良き教えによって人を導いたりしますが、熱水泉のような人は、感情や欲望を思いのままぶつけてしまいます。"
  },
  {
    num: 18,
    title: "ゆったりした時間",
    subtitle: "ゑ",
    tehanasu: "おほわたつみのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたは誰と共に過ごしていましたか？ あなたの人生の縮図は、様々な局面を彩りよく表現し、そのひとつひとつの場面に関わったご縁ある方々は、あなたを守り、育て、共に笑い、共に喜び、時には一緒に泣いてくれ、叱ってくれた大切な縁ある人たちです。 中には、あなたの人生の悪役として登場した方がいたかも知れません。 心配で心が落ち着かない時、過剰に気持ちが高ぶっている時こそ、急がず、焦らず、もう一度この縮図を思い出し、自然に任せて、ゆっくりと過ごしてください。"
  },
  {
    num: 19,
    title: "太陽の実りを喜ぶ",
    subtitle: "け・め",
    tehanasu: "はやあきつひこのかみ あやあきつひめのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの周りにも人が集まり、頼りにされ、楽しくにぎやかな時を過ごすことができます。 今、あなたが心がけることは「周囲の人を明るく照らすこと」です。温かい心で他の人を受け入れてください。 その行いは様々な面で盛んになり、人々に影響を与え、実りをもたらします。 もし、心配や恐れなどの「憂える心」「悲観的な心」がある場合は、まだ心は夜中であると思い込んで静かに休んでいる状態です。 もう夜は明け、眠りから覚めて生き生きと活動する時です。 夜明けが来たのだということを自覚し、先ずは小さな一歩を踏み出して、その一歩を踏み出せたことを喜んでください。"
  },
  {
    num: 20,
    title: "モノを大切に扱う",
    subtitle: "く・む",
    tehanasu: "あわなぎのかみ あわなみのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたとのもとへかえってきます。 それは、物であり、お金であり、人であり、想いであり、この世で働きのあるもの、エネルギーが通うすべてのものや関係を含みます。 その関係にどのように働かせたか、生かす働きかけをしたならば、生かされた形であなたのものとへかえってきます。 逆に、粗末な働きかけをしたならば、粗末な形であなたに降りかかり、そのままかえってきます。 「ものは生きている」といいます。 どんなものでも大切にあつかうと、それによってケガをすることもなく、その人のために長く上機嫌に動く働きをしてくれます。"
  },
  {
    num: 21,
    title: "振子の法則を知る",
    subtitle: "す・る",
    tehanasu: "つらなぎのかみ つらなみのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "す。 それは、長い人生をかけて細く長くとぎれることなく続いています。 生活の中で感じた渋みやえぐみ、沸々と湧き起った濁った感情など、不純なものが水面に現れたら、その灰汁を丁寧に取り除いてください。 気づきのある度に手を加えることで透き通る清い水へと変えていくのです。 事を急ぎ過ぎたり、無理が過ぎたり、怠けたり、嫌々ながら事にあたったり、また、感情を高ぶらせて行き過ぎた行動を取ったりすることなどは、水面に現れた灰汁と同じように心に現れた不純なものです。"
  },
  {
    num: 22,
    title: "運命を味方にする",
    subtitle: "そ・せ",
    tehanasu: "あめのみくまりのかみ くにのみくまりのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの身体に最高の状態で受け入れることに集中してください。 水は高いところから低いところへと流れます。 下流に器を置けば、そこに水は流れ込み、いつでも新鮮な水を満たし続けることができます。 でも、その器にフタをしてしまえば、水を溜めることができまん。 活きるエネルギーとなる気の流れも同じように、受け入れる準備をしていなければ、最高の状態で受け入れることができず、また循環することが出来ないため、良い状態で活かすことができないのです。"
  },
  {
    num: 23,
    title: "信じ込む力を強固",
    subtitle: "ほ・へ",
    tehanasu: "あめのくひざもちのかみ くにのくひざもちのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたが心に描いた信念は、人々に豊かさを与えていくものです。 その信念を、広く多くの人々に届ける意識で行動してください。 心の中の思考を外に向かって拡げ伝えていくことは、自信を付けていくことにつながります。 自信を持って行動するようになると「こうしよう」という強い考えが生まれ、固めることができ、信念を持って行動することは信頼関係を築きます。 最初は自信を持つことができないかも知れません。 それでも信念を固めたら「必ずできる」と自分を信じ、失敗を恐れずやり続けることです。"
  },
  {
    num: 24,
    title: "希望の光が射す",
    subtitle: "ふ",
    tehanasu: "しなつひこのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの吹く息で、見事に吹き払われていきます。 目の前の視界が広がり、長い間あたため続けた「こうしようと心に決めたこと」「あなたの希望」が動き始めます。 事が進まずもどかしい時期を過ごされていた想いも、時を迎え、いま活かされていくとき「時期・時間・志」がピッタリと一致している瞬間です。 当時では理解できなかったことでも、今になれば理解できることがたくさんあります。理解し判断する力は、その考えに至ることによって力が付き、その力が理性を育て、感情を育て、「豊かな心」を育てます。"
  },
  {
    num: 25,
    title: "共存共栄する世界",
    subtitle: "も",
    tehanasu: "くくのちのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "々な生きものたちが盛んに活動をはじめ、それぞれに役割を果たしながら共存し、繁栄への世界に向かって活動しています。 新しく芽が出るものもあり、物事が発展へ向かいます。 新たなものを見たり聞いたりと知識を得ながら、感情や思考など心の働きを通して新たな感覚を経験することで、細胞を活性化しながら骨格を育て、心を育て、人格を育てます。 身体は命(魂)を乗せた乗り物です。 この乗り物は、人生に必要な情報と装備が備わった完全な乗り物です。 その身体を大切に扱い、手入れをしながら、私たちは、人生という長い旅を共にしています。"
  },
  {
    num: 26,
    title: "自分の宝に気づく",
    subtitle: "は",
    tehanasu: "おほやまつみのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの「宝」を輝かせ、あなたという「個性」を伸ばします。 小さい頃、あなたはどんな「夢」を描いていましたか？ 子どもが「夢」を語る姿はとても力強く、希望のエネルギーに満ち溢れていて「もしかしたらできないかも…」などといった不安はありません。 未来に向かって「今を生きる力」がとても強いのです。 「希望」はエネルギーの源であり「個性・宝」を磨き輝かせます。 「希望」は信じる力を永遠のものにし、現実にする力を持っているのです。 あなたの魂は、命をつないだ祖先たちの希望と共に生き、大いなる力に見守られています。 あなたの積極的な心が、その力を引き寄せ「個性」を輝かせていきます。 あなたの大切な「宝」を大事に生かしてください。"
  },
  {
    num: 27,
    title: "どの道もすばらしい",
    subtitle: "ぬ",
    tehanasu: "かやのひめのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたは人生の目的に向かって真実の道を正確に進んでいます。 自然なまま、そのままのあなたでいてください。 あなたはこの世に生を受けるとき「しあわせになる」と、自ら誓いをたて、大いなる魂と約束を結んで誕生しました。 そして、魂を輝かす生き方を自らが計画し、最もふさわしい時代、場所、両親などを自分で選択して、父からは精気を、母からは身体をいただいて、あなたの心の働きをつかさどる魂をその身体に宿したのです。 必ず目的に向かって道は続き、どの道もあなたに用意された真実の道です。"
  },
  {
    num: 28,
    title: "喜びを分かち合う",
    subtitle: "ら・さ",
    tehanasu: "あめのさつちのかみ くにのさつちのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "ち合う時です。 お米づくりは、草を抜き土地を耕し水を張って稲を植え、雑草や害虫を取り除きながら実りを迎えるまで大切に育てます。穂が実り、その恵みに感謝しながら稲を刈り取った後も、私たちが口にするお米の形になるまでにはたくさんの人の働らきがあります。 お米づくりは、日本を代表する素晴らしい伝統文化であり、愛を象徴します。 人間は、たくさんの人たちと関わりを持ちながら生きています。 誰の手も借りずに人生を生き抜くことはできません。その命はかけがえのない尊い命です。"
  },
  {
    num: 29,
    title: "誰かのためにを考える",
    subtitle: "ろ・れ",
    tehanasu: "あめのさぎりのかみ くにのさぎりのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたを支え、大切な人を守るものです。 私たち大人はその事を良く知り、自分を守り、大切な人を守り、これからの社会を担う子どもたちのために、そのことを教え、伝え、その場を提供していく役目があります。 誰かが築いた場所があったから、あなたの命は守られ、今を迎えることができました。 小さなことからで良いのです。 次は、あなたが誰かのためにその場所を築くときです。 誰かのために少しだけあなたの時間を使ってください。"
  },
  {
    num: 30,
    title: "事実はひとつ",
    subtitle: "の・ね",
    tehanasu: "あめのくらどのかみ くにのくらどのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたに「冷静な判断で物事を捉えるように」「事実をそのまま捉えるように」と、呼びかけています。 そのものの本体、「事実」は、一つしかありません。 「事実」とは、その物事のもとから出発して成り立ち現れた姿のことで、そこを取り巻く環境には、たくさんの人々が存在しています。 その各々の境遇を中心として、その「事実」を捉えたものが「真実」です。 「真実」とは、うそや偽りがなく飾りのない「本当」のことをいいます。 これも「事実」と同様、一つしかありません。"
  },
  {
    num: 31,
    title: "ぶれない「芯」を持つ",
    subtitle: "か・ま",
    tehanasu: "おほとまどひこのかみ おほとまどひめのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの前に光の道が拡がりました。 周りには何もない大自然の中、夜空に輝く星空を見上げている景色を想い描いてください。そこにはざわつくネオンの光りも、夜道を照らす街灯も、団らんを囲む家の明かりも何もありません。辺りは真っ暗な静かな夜です。 目を瞑り、耳を澄ませば、風が流れる音、大空に拡がる星の気配、遠くに聞こえる水のせせらぎ、小動物の鳴き声、虫の足音など、心を落ち着かせると自然から聞こえる様々な音や気配に気が付きます。 日常の生活に追われ、焦りや急ぎの真っ只中にいる人は、周りで起こる様々な出来事に心が気づかず、感動をすることから遠ざかっていきます。"
  },
  {
    num: 32,
    title: "共感する仲間と出逢う",
    subtitle: "な",
    tehanasu: "とりのいはくすふねのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたの強さとなり、曇りは晴れ、澄み渡った青空を手に入れることができるのです。 伸び伸びと自由に澄み渡った青空へ、今、飛び立つのです。"
  },
  {
    num: 33,
    title: "人生の主人公を演じる",
    subtitle: "こ",
    tehanasu: "おほげつひめのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたは人生の主人公を演じています。 天・地の大いなる景を縮図にした人生ドラマはオリジナルのもので、綿密に描かれていて、遠い昔から永遠の未来へと続いています。 私たちは、その永遠に続く大規模な人生ドラマの一部を切り取って、人生の主人公を演じています。 主人公は、子になり親になり、社員になり社長になり、夫に妻にとそれぞれの役をこなし、時には他人のドラマのエキストラとしても出演します。 個々の人生ドラマはそれぞれに顕在していながら、潜在世界(非顕在世界)ではそのすべてが一つに繋がっていて統一されています。"
  },
  {
    num: 34,
    title: "天性を伸ばしていく",
    subtitle: "ん",
    tehanasu: "ほのやぎはやをのかみ",
    kansha: "",
    sooji: "",
    shigoto: "",
    gakumon: "",
    renai: "",
    kenkou: "",
    ryokou: "",
    message: "あなたは輝く人生を生きています。 すべての人が輝く人生を生きています。 一人の命は、見えない大いなる力によって生かされた尊い命です。 この命は自分で生み出した命ではなく、見えない力によって生み出され、生かされています。 すべての人がすばらしい特性を持ち、他の誰とも比べることができない尊い個性を持っています。 その個性は、天性を出来るだけ伸ばそうと努力をすることによって、この世界で必ず開花して結果として実を結ぶことが約束されていて、その能力は無限に向上し続ける強靭な生命力を秘めています。 感情に心を奪われることは、その個性を犠牲にしてしまいます。 その感情とは、過去を心配し、未来を心配する心です。"
  },

];

const HEADER_IMAGE_URI = 'https://musubijima.com/wp-content/uploads/2021/02/musubi_omikuji_head.png';

function getTodayOmikujiNum(): number {
  const date = new Date();
  return ((date.getDate() + date.getMonth()) % 34) + 1;
}

function getRandomOmikujiNum(): number {
  return Math.floor(Math.random() * 34) + 1;
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
              {currentItem.title}
            </Text>

            <View style={styles.divider} />

            {currentItem.tehanasu.length > 0 && (
              <View style={styles.tehanasuBox}>
                <Text style={styles.tehanasuLabel}>【ご神名】</Text>
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
              style={styles.shareButton}
              onPress={() => shareResult({
                title: '今日のおみくじ',
                message: `【今日のおみくじ】\n${currentItem.title}\n\n${currentItem.message.slice(0, 100)}...`,
              })}
              activeOpacity={0.8}
            >
              <Text style={styles.shareButtonText}>結果をシェアする 🔮</Text>
            </TouchableOpacity>

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
  shareButton: {
    borderWidth: 1,
    borderColor: '#6D28D9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  shareButtonText: {
    color: '#6D28D9',
    fontSize: 14,
    fontWeight: '500',
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
