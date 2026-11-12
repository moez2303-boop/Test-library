/**
 * Context Clue Detective: a short passage with one N2 word blanked out (＿＿).
 * The decoys are close in meaning, sound alike, or don't fit the grammar,
 * so the clue in the passage decides it. Original passages.
 */
export interface DetectiveCase {
  passage: string;
  passageEn: string;
  /** The right answer first; the game shuffles them. */
  options: [string, string, string, string];
  /** The words in the passage that give it away (highlighted as a hint). */
  clue: string;
  explanation: string;
}

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    passage: "{毎日|まいにち}{少|すこ}しずつ{練習|れんしゅう}を{続|つづ}けた{結果|けっか}、{彼|かれ}のピアノは＿＿{上達|じょうたつ}した。",
    passageEn: "As a result of practicing a little every day, his piano playing improved ＿＿.",
    options: ["{着実|ちゃくじつ}に", "{急激|きゅうげき}に", "{一気|いっき}に", "たちまち"],
    clue: "{少|すこ}しずつ",
    explanation: "\"A little every day\" points to steady progress: 着実に. 急激に, 一気に and たちまち all describe sudden change.",
  },
  {
    passage: "{最初|さいしょ}は{反対|はんたい}していた{部長|ぶちょう}も、データを{見|み}せると＿＿したようで、{静|しず}かにうなずいた。",
    passageEn: "The manager, who had objected at first, seemed ＿＿ once shown the data, and quietly nodded.",
    options: ["{納得|なっとく}", "{承知|しょうち}", "{妥協|だきょう}", "{同情|どうじょう}"],
    clue: "データを{見|み}せると",
    explanation: "Being persuaded by evidence is 納得. 承知 is acknowledging a request, 妥協 needs give-and-take, and 同情 is sympathy.",
  },
  {
    passage: "{彼|かれ}の{説明|せつめい}は＿＿で、{何|なに}を{言|い}いたいのか{誰|だれ}にもわからなかった。",
    passageEn: "His explanation was ＿＿, and nobody could tell what he meant.",
    options: ["{曖昧|あいまい}", "{微妙|びみょう}", "{漠然|ばくぜん}", "{慎重|しんちょう}"],
    clue: "＿＿で",
    explanation: "曖昧 (vague) fits, and takes で. 漠然 also means vague but is used as 漠然としていて, not 漠然で. 微妙 is \"subtle, hard to judge\", and 慎重 is \"careful\".",
  },
  {
    passage: "{台風|たいふう}の{影響|えいきょう}で、{多|おお}くの{便|びん}が＿＿になった。{空港|くうこう}は{帰|かえ}れない{人|ひと}であふれていた。",
    passageEn: "Because of the typhoon, many flights were ＿＿. The airport was packed with people who couldn't get home.",
    options: ["{欠航|けっこう}", "{運休|うんきゅう}", "{延期|えんき}", "{中止|ちゅうし}"],
    clue: "{空港|くうこう}",
    explanation: "Cancelled flights and ferries are 欠航. 運休 is for trains and buses, 延期 is postponing, and 中止 is calling off an event.",
  },
  {
    passage: "{彼女|かのじょ}は＿＿{家庭|かてい}に{育|そだ}ったので、{子|こ}どもの{頃|ころ}から{欲|ほ}しいものは{何|なん}でも{買|か}ってもらえた。",
    passageEn: "She grew up in a ＿＿ family, so as a child she got whatever she wanted.",
    options: ["{裕福|ゆうふく}な", "{豊富|ほうふ}な", "{円満|えんまん}な", "{贅沢|ぜいたく}な"],
    clue: "{何|なん}でも{買|か}ってもらえた",
    explanation: "A family with plenty of money is 裕福な. 豊富な is for supplies and resources, 円満な means harmonious, and 贅沢な describes spending, not a family.",
  },
  {
    passage: "{十年|じゅうねん}{続|つづ}けてきた{研究|けんきゅう}が、ついに＿＿を{結|むす}んだ。",
    passageEn: "Research carried on for ten years finally ＿＿.",
    options: ["{実|み}", "{成果|せいか}", "{結果|けっか}", "{効果|こうか}"],
    clue: "を{結|むす}んだ",
    explanation: "The set phrase is 実を結ぶ, \"to bear fruit\". 成果 goes with 上げる or 出す, not 結ぶ.",
  },
  {
    passage: "この{薬|くすり}はよく{効|き}くが、{眠|ねむ}くなるという＿＿がある。{運転|うんてん}する{前|まえ}には{飲|の}まないでください。",
    passageEn: "This medicine works well, but it has the ＿＿ of making you drowsy. Don't take it before driving.",
    options: ["{副作用|ふくさよう}", "{欠点|けってん}", "{弱点|じゃくてん}", "{障害|しょうがい}"],
    clue: "{薬|くすり}",
    explanation: "An unwanted effect of a medicine is a 副作用 (side effect). 欠点 and 弱点 are general flaws and weak points.",
  },
  {
    passage: "{新|あたら}しい{店長|てんちょう}は、{店員|てんいん}の{意見|いけん}に＿＿{耳|みみ}を{傾|かたむ}け、すぐに{働|はたら}きやすい{店|みせ}に{変|か}えた。",
    passageEn: "The new manager listened ＿＿ to the staff's opinions and quickly made the shop easier to work in.",
    options: ["{真剣|しんけん}に", "{深刻|しんこく}に", "{厳重|げんじゅう}に", "{慎重|しんちょう}に"],
    clue: "{耳|みみ}を{傾|かたむ}け",
    explanation: "Listening earnestly is 真剣に耳を傾ける. 深刻 describes grave problems, 厳重 strict security, and 慎重 caution before acting.",
  },
  {
    passage: "{社長|しゃちょう}は{記者|きしゃ}の{質問|しつもん}に{答|こた}えず、{会見|かいけん}を{途中|とちゅう}で＿＿、そのまま{会場|かいじょう}を{出|で}て{行|い}った。",
    passageEn: "The president didn't answer the reporters' questions; he ＿＿ the press conference partway and left the room.",
    options: ["{打|う}ち{切|き}り", "{中断|ちゅうだん}し", "{取|と}り{消|け}し", "{延期|えんき}し"],
    clue: "そのまま{会場|かいじょう}を{出|で}て{行|い}った",
    explanation: "He left for good, so the conference was cut short: 打ち切る. 中断 is a pause that will resume, 取り消す is cancelling a decision, and 延期 is postponing.",
  },
  {
    passage: "このアプリは{操作|そうさ}が＿＿なので、お{年寄|としよ}りでもすぐに{使|つか}える。",
    passageEn: "This app's controls are ＿＿, so even elderly people can use it right away.",
    options: ["{簡単|かんたん}", "{簡潔|かんけつ}", "{簡素|かんそ}", "{単調|たんちょう}"],
    clue: "すぐに{使|つか}える",
    explanation: "Easy to operate is 簡単. 簡潔 means concise (for writing or speech), 簡素 means plain and unadorned, and 単調 means monotonous.",
  },
  {
    passage: "{何度|なんど}{失敗|しっぱい}しても＿＿に{挑戦|ちょうせん}し{続|つづ}ける{彼|かれ}の{姿|すがた}に、{多|おお}くの{人|ひと}が{勇気|ゆうき}をもらった。",
    passageEn: "Many people drew courage from the way he kept taking ＿＿ shots, however many times he failed.",
    options: ["{果敢|かかん}", "{無謀|むぼう}", "{強引|ごういん}", "{頑固|がんこ}"],
    clue: "{勇気|ゆうき}をもらった",
    explanation: "It inspired people, so it's a positive word: 果敢 (bold, daring). 無謀 is reckless, 強引 is pushy, and 頑固 is stubborn.",
  },
  {
    passage: "この{地域|ちいき}では、{少子化|しょうしか}の＿＿で、{小学校|しょうがっこう}が{次々|つぎつぎ}と{閉校|へいこう}している。",
    passageEn: "In this region, as a ＿＿ of the falling birthrate, elementary schools are closing one after another.",
    options: ["{影響|えいきょう}", "{原因|げんいん}", "{理由|りゆう}", "{効果|こうか}"],
    clue: "{少子化|しょうしか}の",
    explanation: "The falling birthrate causes the closures, so they're its 影響 (effect). 少子化の原因 would be what causes the birthrate to fall. 効果 is an intended, usually positive effect.",
  },
  {
    passage: "{彼|かれ}は{自分|じぶん}の{失敗|しっぱい}を{認|みと}めず、いつも{他人|たにん}に{責任|せきにん}を＿＿。",
    passageEn: "He never admits his mistakes and always ＿＿ the responsibility onto others.",
    options: ["{押|お}し{付|つ}ける", "{負|お}う", "{果|は}たす", "{取|と}る"],
    clue: "{他人|たにん}に",
    explanation: "責任を他人に押し付ける = to push the blame onto others. 負う, 果たす and 取る are all about taking responsibility yourself.",
  },
  {
    passage: "{試験|しけん}は{明日|あした}だ。{今|いま}さら{焦|あせ}っても＿＿だ、と{兄|あに}は{笑|わら}った。",
    passageEn: "The exam is tomorrow. \"There's no ＿＿ in panicking now,\" my brother laughed.",
    options: ["{無駄|むだ}", "{手遅|ておく}れ", "{無理|むり}", "{不要|ふよう}"],
    clue: "{焦|あせ}っても",
    explanation: "〜ても無駄だ = \"it's pointless to...\". 手遅れ (too late) describes the situation, not the panicking, and 〜ても無理 / 〜ても不要 aren't natural.",
  },
  {
    passage: "{長年|ながねん}の{努力|どりょく}が＿＿、{彼|かれ}はついに{念願|ねんがん}のパイロットになった。",
    passageEn: "His years of effort ＿＿, and he finally became the pilot he had longed to be.",
    options: ["{実|みの}り", "{叶|かな}い", "{果|は}たし", "{遂|と}げ"],
    clue: "{努力|どりょく}が",
    explanation: "努力が実る = effort bears fruit. 叶う goes with a dream or wish (夢が叶う), and 果たす and 遂げる need an object (を).",
  },
  {
    passage: "その{映画|えいが}は{戦争|せんそう}の＿＿をリアルに{描|えが}いていて、{見|み}{終|お}わった{後|あと}、しばらく{誰|だれ}も{話|はな}せなかった。",
    passageEn: "The film depicts the ＿＿ of war so realistically that no one could speak for a while afterwards.",
    options: ["{悲惨|ひさん}さ", "{悲観|ひかん}", "{哀|あわ}れ", "{気|き}の{毒|どく}"],
    clue: "{戦争|せんそう}の",
    explanation: "The horror of war is 悲惨さ. 悲観 is pessimism, and 哀れ and 気の毒 express pity for a person.",
  },
  {
    passage: "{父|ちち}は{昔|むかし}から＿＿で、{一度|いちど}{決|き}めたことは{誰|だれ}が{何|なん}と{言|い}っても{変|か}えない。",
    passageEn: "My father has always been ＿＿: once he decides something, he won't change it no matter what anyone says.",
    options: ["{頑固|がんこ}", "{頑丈|がんじょう}", "{強引|ごういん}", "{慎重|しんちょう}"],
    clue: "{変|か}えない",
    explanation: "Refusing to change your own mind is 頑固 (stubborn). 頑丈 is \"sturdy\" for things, 強引 is forcing things on others, and 慎重 is \"cautious\".",
  },
  {
    passage: "{兄|あに}は{友人|ゆうじん}の{結婚式|けっこんしき}で、{司会|しかい}を＿＿ことになった。",
    passageEn: "My brother is going to ＿＿ MC at his friend's wedding.",
    options: ["{務|つと}める", "{勤|つと}める", "{努|つと}める", "{努力|どりょく}する"],
    clue: "{司会|しかい}を",
    explanation: "All three つとめる differ: 務める = to serve in a role (司会を務める), 勤める = to work for a company, 努める = to strive.",
  },
  {
    passage: "{経済|けいざい}の{回復|かいふく}を＿＿、{政府|せいふ}は{新|あたら}しい{政策|せいさく}を{発表|はっぴょう}した。",
    passageEn: "Aiming for ＿＿ economic recovery, the government announced a new policy.",
    options: ["{図|はか}って", "{測|はか}って", "{計|はか}って", "{諮|はか}って"],
    clue: "{回復|かいふく}を",
    explanation: "はかる has several kanji. 図る = to plan or aim for (回復を図る). 測る = measure size, 計る = measure time or amount, 諮る = consult a committee.",
  },
  {
    passage: "{部長|ぶちょう}は{会議|かいぎ}で、{若手|わかて}{社員|しゃいん}の{新|あたら}しいアイデアを{高|たか}く＿＿した。",
    passageEn: "At the meeting, the manager ＿＿ the young employee's new idea highly.",
    options: ["{評価|ひょうか}", "{批判|ひはん}", "{判断|はんだん}", "{批評|ひひょう}"],
    clue: "{高|たか}く",
    explanation: "The set phrase is 高く評価する, \"to rate highly\". 批判 is criticism, 判断 is judgment, and 批評 is a critique or review.",
  },
  {
    passage: "{彼|かれ}の{話|はなし}にはいつも＿＿があるので、あまり{信用|しんよう}されていない。",
    passageEn: "His stories always contain ＿＿, so people don't really trust him.",
    options: ["{誇張|こちょう}", "{強調|きょうちょう}", "{主張|しゅちょう}", "{誇|ほこ}り"],
    clue: "{信用|しんよう}されていない",
    explanation: "Not trusted, so his stories are exaggerated: 誇張. 強調 is emphasis, 主張 is a claim, and 誇り is pride.",
  },
  {
    passage: "{今年|ことし}の{米|こめ}の{収穫量|しゅうかくりょう}は、{天候不順|てんこうふじゅん}のため、{例年|れいねん}を{大|おお}きく＿＿。",
    passageEn: "Because of the unseasonable weather, this year's rice harvest ＿＿ the usual year by a wide margin.",
    options: ["{下回|したまわ}った", "{上回|うわまわ}った", "{下|さ}がった", "{減|へ}った"],
    clue: "{例年|れいねん}を",
    explanation: "Bad weather means a smaller harvest, and 例年を needs a verb that takes を: 下回る (fall below). 上回る means exceed, and 下がる and 減る don't take を.",
  },
  {
    passage: "{彼女|かのじょ}の{演奏|えんそう}は、{聴|き}く{人|ひと}の{心|こころ}を＿＿ような{美|うつく}しさだった。",
    passageEn: "Her performance had a beauty that ＿＿ the hearts of those who heard it.",
    options: ["{打|う}つ", "{叩|たた}く", "{殴|なぐ}る", "{突|つ}く"],
    clue: "{心|こころ}を",
    explanation: "心を打つ = to move someone deeply. 叩く (knock), 殴る (punch) and 突く (poke) are literal.",
  },
  {
    passage: "{長|なが}い{不況|ふきょう}から{抜|ぬ}け{出|だ}せず、{多|おお}くの{中小企業|ちゅうしょうきぎょう}が＿＿に{追|お}い{込|こ}まれた。",
    passageEn: "Unable to escape the long recession, many small companies were driven into ＿＿.",
    options: ["{倒産|とうさん}", "{崩壊|ほうかい}", "{破壊|はかい}", "{損害|そんがい}"],
    clue: "{中小企業|ちゅうしょうきぎょう}が",
    explanation: "A company going under is 倒産. 崩壊 is the collapse of a system or structure, 破壊 is destruction, and 損害 is damage or loss.",
  },
  {
    passage: "{弟|おとうと}はテストの{点|てん}が{悪|わる}かったことを{母|はは}に＿＿、こっそり{答案用紙|とうあんようし}を{隠|かく}した。",
    passageEn: "My little brother secretly hid his test paper, ＿＿ Mom about his bad score.",
    options: ["{知|し}られまいと", "{知|し}らせようと", "{教|おし}えようと", "{見|み}せようと"],
    clue: "こっそり{答案用紙|とうあんようし}を{隠|かく}した",
    explanation: "Hiding it in secret means he was trying not to let her find out: 〜まいと = \"trying not to\". The others all mean trying to tell or show her.",
  },
];
