import type { Lesson } from "../types";

export const level2: Lesson[] = [
  // ───────────── Module 4: On the road ─────────────
  {
    id: "2.1",
    level: 2,
    module: 4,
    kind: "audio",
    title: "旅館で",
    subtitle: "Checking in to a traditional inn",
    intro: "Alex and Yuki arrive at a ryokan in Hakone for a weekend of hot springs.",
    dialogue: [
      { speaker: "Staff", text: "いらっしゃいませ。ご予約のお名前をお願いします。", reading: "いらっしゃいませ ごよやく の おなまえ を おねがい します", en: "Welcome. May I have the name for the reservation?" },
      { speaker: "Alex", text: "ブラウンです。二泊で予約しています。", reading: "ブラウン です にはく で よやく して います", en: "Brown. We have a reservation for two nights." },
      { speaker: "Staff", text: "ブラウン様ですね。お部屋は三階の和室です。", reading: "ブラウンさま です ね おへや は さんがい の わしつ です", en: "Mr Brown. Your room is a Japanese-style room on the third floor." },
      { speaker: "Yuki", text: "夕食は何時からですか。", reading: "ゆうしょく は なんじ から です か", en: "What time is dinner from?" },
      { speaker: "Staff", text: "六時から八時までです。お部屋にお持ちします。", reading: "ろくじ から はちじ まで です おへや に おもち します", en: "From six to eight. We'll bring it to your room." },
      { speaker: "Alex", text: "温泉は夜も入れますか。", reading: "おんせん は よる も はいれます か", en: "Can we use the hot spring at night too?" },
      { speaker: "Staff", text: "はい、夜十一時まで入れます。", reading: "はい よる じゅういちじ まで はいれます", en: "Yes, until 11 p.m." },
      { speaker: "Yuki", text: "すみません、エアコンがつかないんですが。", reading: "すみません エアコン が つかない ん です が", en: "Excuse me, the air conditioning won't come on…" },
      { speaker: "Staff", text: "申し訳ございません。すぐに確認します。", reading: "もうしわけ ございません すぐ に かくにん します", en: "I'm very sorry. I'll check it right away." },
    ],
    notes: [
      {
        heading: "Ryokan basics",
        body:
          "Take your shoes off at the entrance, wear the provided yukata around the inn, and wash thoroughly before getting into the onsen bath. Rooms have tatami floors; futons are laid out in the evening.",
      },
      {
        heading: "から and まで",
        body: "から means 'from' and まで 'until': 六時から八時まで (from six to eight). Both work with times and places.",
        examples: [
          { text: "九時から五時まで", reading: "くじ から ごじ まで", en: "from nine to five" },
          { text: "東京から大阪まで", reading: "とうきょう から おおさか まで", en: "from Tokyo to Osaka" },
        ],
      },
      {
        heading: "Softening a complaint with 〜んですが",
        body:
          "Ending with んですが ('it's that… but') leaves the sentence open so the listener offers help. It's much softer than a direct complaint.",
        examples: [{ text: "お湯が出ないんですが。", reading: "おゆ が でない ん です が", en: "There's no hot water…" }],
      },
    ],
    phrases: [
      { text: "予約しています。", reading: "よやく して います", en: "I have a reservation." },
      { text: "二泊です。", reading: "にはく です", en: "Two nights." },
      { text: "夕食は何時からですか。", reading: "ゆうしょく は なんじ から です か", en: "What time is dinner from?" },
      { text: "六時から八時まで", reading: "ろくじ から はちじ まで", en: "from six to eight" },
      { text: "温泉は夜も入れますか。", reading: "おんせん は よる も はいれます か", en: "Can I use the hot spring at night too?" },
      { text: "エアコンがつかないんですが。", reading: "エアコン が つかない ん です が", en: "The air conditioning won't come on…" },
      { text: "お湯が出ないんですが。", reading: "おゆ が でない ん です が", en: "There's no hot water…" },
      { text: "申し訳ございません。", reading: "もうしわけ ございません", en: "I'm very sorry. (formal)" },
      { text: "すぐに確認します。", reading: "すぐ に かくにん します", en: "I'll check right away." },
    ],
  },
  {
    id: "2.2",
    level: 2,
    module: 4,
    kind: "audio",
    title: "新幹線の切符",
    subtitle: "Buying train tickets",
    intro: "Alex wants to visit Kyoto and goes to the ticket office at Tokyo Station.",
    dialogue: [
      { speaker: "Alex", text: "京都までの切符を一枚お願いします。", reading: "きょうと まで の きっぷ を いちまい おねがい します", en: "One ticket to Kyoto, please." },
      { speaker: "Staff", text: "片道ですか、往復ですか。", reading: "かたみち です か おうふく です か", en: "One way or return?" },
      { speaker: "Alex", text: "往復でお願いします。", reading: "おうふく で おねがい します", en: "Return, please." },
      { speaker: "Staff", text: "指定席と自由席がありますが。", reading: "していせき と じゆうせき が あります が", en: "There are reserved and unreserved seats." },
      { speaker: "Alex", text: "指定席で、窓側がいいです。", reading: "していせき で まどがわ が いい です", en: "Reserved, and I'd like a window seat." },
      { speaker: "Staff", text: "十時発ののぞみがあります。", reading: "じゅうじ はつ の のぞみ が あります", en: "There's a Nozomi leaving at ten." },
      { speaker: "Alex", text: "京都には何時に着きますか。", reading: "きょうと に は なんじ に つきます か", en: "What time does it arrive in Kyoto?" },
      { speaker: "Staff", text: "十二時十五分に着きます。", reading: "じゅうにじ じゅうごふん に つきます", en: "It arrives at 12:15." },
      { speaker: "Alex", text: "何番線から出ますか。", reading: "なんばんせん から でます か", en: "Which platform does it leave from?" },
      { speaker: "Staff", text: "十八番線です。", reading: "じゅうはちばんせん です", en: "Platform 18." },
    ],
    notes: [
      {
        heading: "Train vocabulary",
        body: "片道 one way, 往復 return, 指定席 reserved seat, 自由席 unreserved seat, 乗り換え change of trains, 番線 platform number.",
      },
      {
        heading: "Choosing with がいい",
        body: "X がいいです means 'X would be good / I'd prefer X': 窓側がいいです (I'd like a window seat), 明日がいいです (tomorrow would be good).",
        examples: [
          { text: "窓側がいいです。", reading: "まどがわ が いい です", en: "I'd like a window seat." },
          { text: "通路側がいいです。", reading: "つうろがわ が いい です", en: "I'd like an aisle seat." },
        ],
      },
      {
        heading: "Shinkansen etiquette",
        body:
          "Trains leave to the second. Queue at the marked spot on the platform, keep phone calls for the space between carriages, and take your rubbish with you.",
      },
    ],
    phrases: [
      { text: "京都までの切符をお願いします。", reading: "きょうと まで の きっぷ を おねがい します", en: "A ticket to Kyoto, please." },
      { text: "片道", reading: "かたみち", en: "one way" },
      { text: "往復", reading: "おうふく", en: "return / round trip" },
      { text: "指定席", reading: "していせき", en: "reserved seat" },
      { text: "窓側がいいです。", reading: "まどがわ が いい です", en: "I'd like a window seat." },
      { text: "何時に着きますか。", reading: "なんじ に つきます か", en: "What time does it arrive?" },
      { text: "何番線から出ますか。", reading: "なんばんせん から でます か", en: "Which platform does it leave from?" },
      { text: "乗り換えはありますか。", reading: "のりかえ は あります か", en: "Do I need to change trains?" },
    ],
  },
  {
    id: "2.3",
    level: 2,
    module: 4,
    kind: "culture",
    title: "日本の地方",
    subtitle: "Language & culture: a quick tour of Japan",
    intro: "Japan's four main islands stretch from snowy Hokkaido to subtropical Okinawa. Here are some highlights and the words to talk about travel.",
    notes: [
      {
        heading: "Going places: に and へ",
        body: "に or へ (read e) mark where you're going: 北海道に行きます / 北海道へ行きます. Use で for how: 飛行機で (by plane).",
        examples: [
          { text: "北海道へ行きます。", reading: "ほっかいどう へ いきます", en: "I'm going to Hokkaido." },
          { text: "飛行機で行きます。", reading: "ひこうき で いきます", en: "I'm going by plane." },
        ],
      },
      { heading: "北海道 Hokkaido", body: "The northern island: powder snow, dairy farms, seafood and the Sapporo Snow Festival." },
      { heading: "関西 Kansai", body: "Kyoto's temples, Osaka's street food and Nara's deer. Kansai has its own dialect: ありがとう becomes おおきに and だめ becomes あかん." },
      { heading: "沖縄 Okinawa", body: "Subtropical islands in the far south with their own history, music and cuisine, and some of the longest life expectancies in the world." },
      {
        heading: "Talking about trips",
        body: "Useful lines for travel conversations.",
        examples: [
          { text: "どこに行きたいですか。", reading: "どこ に いきたい です か", en: "Where do you want to go?" },
          { text: "京都に行ったことがあります。", reading: "きょうと に いった こと が あります", en: "I've been to Kyoto." },
          { text: "おすすめはどこですか。", reading: "おすすめ は どこ です か", en: "Where do you recommend?" },
        ],
      },
    ],
    phrases: [
      { text: "北海道へ行きます。", reading: "ほっかいどう へ いきます", en: "I'm going to Hokkaido." },
      { text: "飛行機で行きます。", reading: "ひこうき で いきます", en: "I'm going by plane." },
      { text: "どこに行きたいですか。", reading: "どこ に いきたい です か", en: "Where do you want to go?" },
      { text: "京都に行ったことがあります。", reading: "きょうと に いった こと が あります", en: "I've been to Kyoto." },
      { text: "おすすめはどこですか。", reading: "おすすめ は どこ です か", en: "Where do you recommend?" },
      { text: "おおきに", reading: "おおきに", en: "Thank you (Kansai dialect)" },
    ],
  },

  // ───────────── Module 5: Work and plans ─────────────
  {
    id: "2.4",
    level: 2,
    module: 5,
    kind: "audio",
    title: "仕事",
    subtitle: "Talking about jobs and the workday",
    intro: "At a neighbourhood festival, Alex chats with Mika, a friend of Kenta's who works as a nurse.",
    dialogue: [
      { speaker: "Mika", text: "アレックスさんはどんな仕事をしていますか。", reading: "アレックスさん は どんな しごと を して います か", en: "What kind of work do you do, Alex?" },
      { speaker: "Alex", text: "IT会社でエンジニアをしています。", reading: "アイティーがいしゃ で エンジニア を して います", en: "I'm an engineer at an IT company." },
      { speaker: "Mika", text: "会社はどこにありますか。", reading: "かいしゃ は どこ に あります か", en: "Where's your company?" },
      { speaker: "Alex", text: "渋谷です。でも、週二回は家で働いています。", reading: "しぶや です でも しゅう にかい は いえ で はたらいて います", en: "Shibuya. But I work from home twice a week." },
      { speaker: "Alex", text: "みかさんは？", reading: "みかさん は", en: "What about you, Mika?" },
      { speaker: "Mika", text: "看護師です。今は夜勤が多いです。", reading: "かんごし です いま は やきん が おおい です", en: "I'm a nurse. I'm on a lot of night shifts right now." },
      { speaker: "Alex", text: "大変ですね。", reading: "たいへん です ね", en: "That sounds tough." },
      { speaker: "Mika", text: "でも、仕事は楽しいですよ。", reading: "でも しごと は たのしい です よ", en: "But I enjoy the work." },
      { speaker: "Alex", text: "毎日何時間ぐらい働きますか。", reading: "まいにち なんじかん ぐらい はたらきます か", en: "About how many hours a day do you work?" },
      { speaker: "Mika", text: "だいたい十時間ぐらいです。", reading: "だいたい じゅうじかん ぐらい です", en: "Roughly ten hours." },
    ],
    notes: [
      {
        heading: "〜ています for ongoing states",
        body:
          "The て form + います describes something going on now or a continuing state: 働いています (I work / am working), 住んでいます (I live), エンジニアをしています (I work as an engineer).",
        examples: [
          { text: "東京に住んでいます。", reading: "とうきょう に すんで います", en: "I live in Tokyo." },
          { text: "今、勉強しています。", reading: "いま べんきょう して います", en: "I'm studying right now." },
        ],
      },
      {
        heading: "大変ですね",
        body: "A sympathetic 'that sounds hard'. Japanese conversation is full of small responses like this (相づち): そうですね, なるほど (I see), へえ (oh really).",
      },
      {
        heading: "Work culture",
        body:
          "Business cards (名刺) are exchanged with both hands and read before putting away. Colleagues often go for drinks after work (飲み会), and 'お疲れ様です' (thanks for your hard work) is the everyday greeting between co-workers.",
        examples: [{ text: "お疲れ様です。", reading: "おつかれさま です", en: "Thanks for your hard work. (greeting at work)" }],
      },
    ],
    phrases: [
      { text: "どんな仕事をしていますか。", reading: "どんな しごと を して います か", en: "What kind of work do you do?" },
      { text: "エンジニアをしています。", reading: "エンジニア を して います", en: "I work as an engineer." },
      { text: "家で働いています。", reading: "いえ で はたらいて います", en: "I work from home." },
      { text: "週二回", reading: "しゅう にかい", en: "twice a week" },
      { text: "看護師です。", reading: "かんごし です", en: "I'm a nurse." },
      { text: "大変ですね。", reading: "たいへん です ね", en: "That sounds tough." },
      { text: "仕事は楽しいです。", reading: "しごと は たのしい です", en: "Work is fun." },
      { text: "何時間ぐらい働きますか。", reading: "なんじかん ぐらい はたらきます か", en: "About how many hours do you work?" },
      { text: "お疲れ様です。", reading: "おつかれさま です", en: "Thanks for your hard work." },
    ],
  },
  {
    id: "2.5",
    level: 2,
    module: 5,
    kind: "audio",
    title: "一緒に行きませんか",
    subtitle: "Invitations and making plans",
    intro: "Yuki messages Alex, then calls to plan Saturday.",
    dialogue: [
      { speaker: "Yuki", text: "土曜日、暇？", reading: "どようび ひま", en: "Are you free on Saturday?" },
      { speaker: "Alex", text: "うん、暇だよ。どうして？", reading: "うん ひま だ よ どうして", en: "Yeah, I'm free. Why?" },
      { speaker: "Yuki", text: "花火大会に行くんだけど、一緒に行かない？", reading: "はなびたいかい に いく ん だけど いっしょ に いかない", en: "I'm going to a fireworks festival — want to come?" },
      { speaker: "Alex", text: "いいね！行きたい！", reading: "いい ね いきたい", en: "Sounds great! I want to go!" },
      { speaker: "Yuki", text: "じゃあ、六時に駅で会おう。", reading: "じゃあ ろくじ に えき で あおう", en: "OK, let's meet at the station at six." },
      { speaker: "Alex", text: "浴衣を着たほうがいい？", reading: "ゆかた を きた ほう が いい", en: "Should I wear a yukata?" },
      { speaker: "Yuki", text: "うん、ぜひ！貸してあげるよ。", reading: "うん ぜひ かして あげる よ", en: "Yes, definitely! I'll lend you one." },
      { speaker: "Alex", text: "ありがとう。楽しみ！", reading: "ありがとう たのしみ", en: "Thanks. I can't wait!" },
      { speaker: "Yuki", text: "雨だったら、来週にしよう。", reading: "あめ だったら らいしゅう に しよう", en: "If it rains, let's make it next week." },
    ],
    notes: [
      {
        heading: "Inviting: 〜ませんか",
        body:
          "Negative questions are polite invitations: 一緒に行きませんか (won't you come with me?). Casually: 行かない？. To suggest 'let's', use 〜ましょう or casual 〜よう/〜おう: 会いましょう / 会おう.",
        examples: [
          { text: "一緒に行きませんか。", reading: "いっしょ に いきません か", en: "Would you like to go together?" },
          { text: "映画を見ましょう。", reading: "えいが を みましょう", en: "Let's watch a film." },
        ],
      },
      {
        heading: "Declining gently",
        body:
          "Japanese rarely says a flat no. ちょっと… (it's a bit…) with a trailing voice is enough to decline: 土曜日はちょっと… (Saturday is a bit…).",
        examples: [{ text: "土曜日はちょっと…", reading: "どようび は ちょっと", en: "Saturday's a bit difficult…" }],
      },
      {
        heading: "Days of the week",
        body: "月曜日 Monday, 火曜日 Tuesday, 水曜日 Wednesday, 木曜日 Thursday, 金曜日 Friday, 土曜日 Saturday, 日曜日 Sunday — moon, fire, water, wood, gold, earth, sun.",
      },
    ],
    phrases: [
      { text: "土曜日、暇？", reading: "どようび ひま", en: "Free on Saturday?" },
      { text: "一緒に行きませんか。", reading: "いっしょ に いきません か", en: "Would you like to go together?" },
      { text: "行きたいです。", reading: "いきたい です", en: "I want to go." },
      { text: "六時に駅で会いましょう。", reading: "ろくじ に えき で あいましょう", en: "Let's meet at the station at six." },
      { text: "楽しみです。", reading: "たのしみ です", en: "I'm looking forward to it." },
      { text: "土曜日はちょっと…", reading: "どようび は ちょっと", en: "Saturday's a bit difficult…" },
      { text: "雨だったら", reading: "あめ だったら", en: "if it rains" },
      { text: "来週にしましょう。", reading: "らいしゅう に しましょう", en: "Let's make it next week." },
    ],
  },
  {
    id: "2.6",
    level: 2,
    module: 5,
    kind: "culture",
    title: "Verb groups and the て form",
    subtitle: "Language & culture: how Japanese verbs work",
    intro: "Japanese verbs don't change for 'I, you, he'. They change for politeness, tense and meaning — and nearly all follow two patterns.",
    notes: [
      {
        heading: "る-verbs (ichidan)",
        body: "Drop る and add the ending: 食べる → 食べます, 食べない, 食べて. Most verbs ending in -iru or -eru belong here.",
        examples: [{ text: "食べます", reading: "たべます", en: "eat (polite)" }],
      },
      {
        heading: "う-verbs (godan)",
        body:
          "The last kana moves along its row: 飲む → 飲みます (mi), 飲まない (ma), 飲める (me), 飲もう (mo). A few verbs that end in -eru or -iru are u-verbs: 帰る, 入る, 知る.",
        examples: [{ text: "飲みます", reading: "のみます", en: "drink (polite)" }],
      },
      {
        heading: "Only two irregulars",
        body: "する (do) and 来る (come). する also makes hundreds of verbs from nouns: 勉強する (study), 料理する (cook), 電話する (phone).",
        examples: [
          { text: "します", reading: "します", en: "do (polite)" },
          { text: "来ます", reading: "きます", en: "come (polite)" },
        ],
      },
      {
        heading: "Making the て form",
        body:
          "る-verbs: 食べて. う-verbs depend on the last kana: う・つ・る → って (買って, 待って); む・ぶ・ぬ → んで (飲んで); く → いて (書いて); ぐ → いで (泳いで); す → して (話して). Exception: 行く → 行って.",
        examples: [
          { text: "ちょっと待って。", reading: "ちょっと まって", en: "Wait a moment." },
          { text: "これを読んでください。", reading: "これ を よんで ください", en: "Please read this." },
          { text: "写真を撮ってもいいですか。", reading: "しゃしん を とって も いい です か", en: "May I take a photo?" },
        ],
      },
    ],
    phrases: [
      { text: "食べます", reading: "たべます", en: "eat (polite)" },
      { text: "飲みます", reading: "のみます", en: "drink (polite)" },
      { text: "します", reading: "します", en: "do (polite)" },
      { text: "来ます", reading: "きます", en: "come (polite)" },
      { text: "ちょっと待って。", reading: "ちょっと まって", en: "Wait a moment." },
      { text: "これを読んでください。", reading: "これ を よんで ください", en: "Please read this." },
      { text: "写真を撮ってもいいですか。", reading: "しゃしん を とって も いい です か", en: "May I take a photo?" },
    ],
  },

  // ───────────── Module 6: Telling stories ─────────────
  {
    id: "2.7",
    level: 2,
    module: 6,
    kind: "audio",
    title: "先週末",
    subtitle: "Talking about the past",
    intro: "Monday morning. Mika asks Alex about the weekend trip to Kyoto.",
    dialogue: [
      { speaker: "Mika", text: "週末はどうでしたか。", reading: "しゅうまつ は どう でした か", en: "How was your weekend?" },
      { speaker: "Alex", text: "とても楽しかったです。京都に行きました。", reading: "とても たのしかった です きょうと に いきました", en: "It was great fun. I went to Kyoto." },
      { speaker: "Mika", text: "何をしましたか。", reading: "なに を しました か", en: "What did you do?" },
      { speaker: "Alex", text: "お寺を見て、着物を着て写真を撮りました。", reading: "おてら を みて きもの を きて しゃしん を とりました", en: "I saw temples, and wore a kimono and took photos." },
      { speaker: "Mika", text: "いいですね！何を食べましたか。", reading: "いい です ね なに を たべました か", en: "Lovely! What did you eat?" },
      { speaker: "Alex", text: "湯豆腐を食べました。すごくおいしかったです。", reading: "ゆどうふ を たべました すごく おいしかった です", en: "I had simmered tofu. It was really delicious." },
      { speaker: "Mika", text: "天気はよかったですか。", reading: "てんき は よかった です か", en: "Was the weather good?" },
      { speaker: "Alex", text: "土曜日はよかったですが、日曜日は雨でした。", reading: "どようび は よかった です が にちようび は あめ でした", en: "Saturday was fine, but Sunday was rainy." },
      { speaker: "Mika", text: "疲れたでしょう？", reading: "つかれた でしょう", en: "You must be tired." },
      { speaker: "Alex", text: "はい、ちょっと疲れました。", reading: "はい ちょっと つかれました", en: "Yes, a little tired." },
    ],
    notes: [
      {
        heading: "Past tense of verbs",
        body: "Polite: ます → ました, ません → ませんでした. 行きます → 行きました (went); 食べません → 食べませんでした (didn't eat).",
        examples: [
          { text: "京都に行きました。", reading: "きょうと に いきました", en: "I went to Kyoto." },
          { text: "何も買いませんでした。", reading: "なにも かいませんでした", en: "I didn't buy anything." },
        ],
      },
      {
        heading: "Past tense of adjectives",
        body:
          "い-adjectives change their ending: 楽しい → 楽しかったです (was fun); いい → よかったです (was good). Nouns and な-adjectives use でした: 雨でした (it was rainy), 静かでした (it was quiet).",
        examples: [
          { text: "楽しかったです。", reading: "たのしかった です", en: "It was fun." },
          { text: "静かでした。", reading: "しずか でした", en: "It was quiet." },
        ],
      },
      {
        heading: "Linking actions with て",
        body: "Join actions in order with the て form: お寺を見て、写真を撮りました (I saw temples and took photos). Only the last verb shows the tense.",
      },
    ],
    phrases: [
      { text: "週末はどうでしたか。", reading: "しゅうまつ は どう でした か", en: "How was your weekend?" },
      { text: "とても楽しかったです。", reading: "とても たのしかった です", en: "It was great fun." },
      { text: "京都に行きました。", reading: "きょうと に いきました", en: "I went to Kyoto." },
      { text: "何をしましたか。", reading: "なに を しました か", en: "What did you do?" },
      { text: "写真を撮りました。", reading: "しゃしん を とりました", en: "I took photos." },
      { text: "すごくおいしかったです。", reading: "すごく おいしかった です", en: "It was really delicious." },
      { text: "日曜日は雨でした。", reading: "にちようび は あめ でした", en: "Sunday was rainy." },
      { text: "ちょっと疲れました。", reading: "ちょっと つかれました", en: "I'm a little tired." },
    ],
  },
  {
    id: "2.8",
    level: 2,
    module: 6,
    kind: "audio",
    title: "病院で",
    subtitle: "Describing symptoms at the doctor's",
    intro: "Alex wakes up with a fever and goes to a local clinic.",
    dialogue: [
      { speaker: "Doctor", text: "どうしましたか。", reading: "どう しました か", en: "What seems to be the problem?" },
      { speaker: "Alex", text: "昨日から熱があります。", reading: "きのう から ねつ が あります", en: "I've had a fever since yesterday." },
      { speaker: "Doctor", text: "ほかに症状はありますか。", reading: "ほか に しょうじょう は あります か", en: "Any other symptoms?" },
      { speaker: "Alex", text: "頭が痛くて、のども痛いです。", reading: "あたま が いたくて のど も いたい です", en: "I have a headache, and my throat hurts too." },
      { speaker: "Doctor", text: "咳は出ますか。", reading: "せき は でます か", en: "Are you coughing?" },
      { speaker: "Alex", text: "少し出ます。", reading: "すこし でます", en: "A little." },
      { speaker: "Doctor", text: "アレルギーはありますか。", reading: "アレルギー は あります か", en: "Do you have any allergies?" },
      { speaker: "Alex", text: "ペニシリンのアレルギーがあります。", reading: "ペニシリン の アレルギー が あります", en: "I'm allergic to penicillin." },
      { speaker: "Doctor", text: "風邪ですね。薬を出しますから、ゆっくり休んでください。", reading: "かぜ です ね くすり を だします から ゆっくり やすんで ください", en: "It's a cold. I'll prescribe some medicine, so get plenty of rest." },
      { speaker: "Alex", text: "ありがとうございました。", reading: "ありがとう ございました", en: "Thank you very much." },
    ],
    notes: [
      {
        heading: "Saying what hurts",
        body: "Body part + が痛いです: 頭が痛いです (my head hurts). お腹 (stomach), 歯 (tooth), 背中 (back), のど (throat).",
        examples: [
          { text: "お腹が痛いです。", reading: "おなか が いたい です", en: "I have a stomach ache." },
          { text: "歯が痛いです。", reading: "は が いたい です", en: "I have toothache." },
        ],
      },
      {
        heading: "から: since, because",
        body:
          "After a time, から means 'since': 昨日から (since yesterday). After a sentence it means 'because / so': 薬を出しますから、休んでください (I'll give you medicine, so rest).",
      },
      {
        heading: "Emergencies",
        body: "Dial 119 for an ambulance or fire, 110 for police. Pharmacies are 薬局 (やっきょく) or ドラッグストア.",
        examples: [
          { text: "助けて！", reading: "たすけて", en: "Help!" },
          { text: "救急車を呼んでください！", reading: "きゅうきゅうしゃ を よんで ください", en: "Call an ambulance!" },
        ],
      },
    ],
    phrases: [
      { text: "どうしましたか。", reading: "どう しました か", en: "What's the matter?" },
      { text: "熱があります。", reading: "ねつ が あります", en: "I have a fever." },
      { text: "昨日から", reading: "きのう から", en: "since yesterday" },
      { text: "頭が痛いです。", reading: "あたま が いたい です", en: "I have a headache." },
      { text: "のどが痛いです。", reading: "のど が いたい です", en: "I have a sore throat." },
      { text: "咳が出ます。", reading: "せき が でます", en: "I have a cough." },
      { text: "アレルギーがあります。", reading: "アレルギー が あります", en: "I have an allergy." },
      { text: "ゆっくり休んでください。", reading: "ゆっくり やすんで ください", en: "Get plenty of rest." },
      { text: "助けて！", reading: "たすけて", en: "Help!" },
    ],
  },
  {
    id: "2.9",
    level: 2,
    module: 6,
    kind: "culture",
    title: "Casual verb forms",
    subtitle: "Language & culture: the plain form and when to use it",
    intro: "Friends and family speak in plain forms. They're also the building blocks for longer sentences, so they're worth learning early.",
    notes: [
      {
        heading: "Polite vs plain",
        body: "食べます → 食べる, 食べません → 食べない, 食べました → 食べた, 食べませんでした → 食べなかった. です becomes だ — or simply drops away in casual speech.",
        examples: [
          { text: "明日行く？", reading: "あした いく", en: "Are you going tomorrow? (casual)" },
          { text: "もう食べた。", reading: "もう たべた", en: "I already ate. (casual)" },
          { text: "知らない。", reading: "しらない", en: "I don't know. (casual)" },
        ],
      },
      {
        heading: "When to switch",
        body:
          "Use plain forms with close friends, family, children and people younger than you who've switched first. Stay polite with strangers, staff, teachers, colleagues and anyone older until invited otherwise.",
      },
      {
        heading: "Plain forms inside sentences",
        body:
          "Even polite speech uses plain forms before words like こと, と思います and ことがあります: 行ったことがあります (I have been), 雨が降ると思います (I think it'll rain).",
        examples: [
          { text: "富士山に登ったことがあります。", reading: "ふじさん に のぼった こと が あります", en: "I've climbed Mount Fuji." },
          { text: "まだ食べていない。", reading: "まだ たべて いない", en: "I haven't eaten yet." },
        ],
      },
    ],
    phrases: [
      { text: "明日行く？", reading: "あした いく", en: "Are you going tomorrow? (casual)" },
      { text: "もう食べた。", reading: "もう たべた", en: "I already ate. (casual)" },
      { text: "知らない。", reading: "しらない", en: "I don't know. (casual)" },
      { text: "富士山に登ったことがあります。", reading: "ふじさん に のぼった こと が あります", en: "I've climbed Mount Fuji." },
      { text: "まだ食べていない。", reading: "まだ たべて いない", en: "I haven't eaten yet." },
      { text: "分かった。", reading: "わかった", en: "Got it. (casual)" },
    ],
  },
];
