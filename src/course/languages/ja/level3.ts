import type { Lesson } from "../types";

export const level3: Lesson[] = [
  // ───────────── Module 7: Settling in ─────────────
  {
    id: "3.1",
    level: 3,
    module: 7,
    kind: "audio",
    title: "居酒屋で",
    subtitle: "Ordering at an izakaya and special requests",
    intro: "To celebrate Yuki's birthday, the housemates go to an izakaya — a Japanese pub that serves lots of small dishes.",
    dialogue: [
      { speaker: "Staff", text: "お飲み物はいかがなさいますか。", reading: "おのみもの は いかが なさいます か", en: "What would you like to drink?" },
      { speaker: "Kenta", text: "とりあえず生ビールを三つ。", reading: "とりあえず なまビール を みっつ", en: "Three draught beers to start with." },
      { speaker: "Yuki", text: "私はウーロン茶でお願いします。", reading: "わたし は ウーロンちゃ で おねがい します", en: "Oolong tea for me, please." },
      { speaker: "Alex", text: "おすすめは何ですか。", reading: "おすすめ は なん です か", en: "What do you recommend?" },
      { speaker: "Staff", text: "今日は焼き鳥と刺身の盛り合わせがおすすめです。", reading: "きょう は やきとり と さしみ の もりあわせ が おすすめ です", en: "Today we recommend the yakitori and the sashimi platter." },
      { speaker: "Alex", text: "じゃあ、それを両方ください。", reading: "じゃあ それ を りょうほう ください", en: "Then we'll have both, please." },
      { speaker: "Yuki", text: "すみません、えびのアレルギーがあるんですが、大丈夫ですか。", reading: "すみません えび の アレルギー が ある ん です が だいじょうぶ です か", en: "Excuse me, I'm allergic to prawns — will that be OK?" },
      { speaker: "Staff", text: "確認してまいります。", reading: "かくにん して まいります", en: "I'll go and check." },
      { speaker: "Kenta", text: "それでは、ゆきの誕生日に乾杯！", reading: "それでは ゆき の たんじょうび に かんぱい", en: "Well then, a toast to Yuki's birthday!" },
      { speaker: "All", text: "乾杯！お誕生日おめでとう！", reading: "かんぱい おたんじょうび おめでとう", en: "Cheers! Happy birthday!" },
    ],
    notes: [
      {
        heading: "とりあえず",
        body:
          "とりあえず (for now / to start with) is the classic izakaya opener: とりあえずビール. Dishes arrive one by one to share, and you keep ordering through the evening.",
      },
      {
        heading: "Pouring for others",
        body:
          "At a group drink, pour for others rather than yourself and hold your glass up when someone pours for you. Wait for 乾杯 before drinking.",
      },
      {
        heading: "Allergies and requests",
        body: "Explain with 〜があるんですが, and ask for changes with 〜抜きで (without…).",
        examples: [
          { text: "わさび抜きでお願いします。", reading: "わさびぬき で おねがい します", en: "Without wasabi, please." },
          { text: "肉が食べられません。", reading: "にく が たべられません", en: "I can't eat meat." },
        ],
      },
    ],
    phrases: [
      { text: "とりあえず生ビールを三つ。", reading: "とりあえず なまビール を みっつ", en: "Three draught beers to start with." },
      { text: "おすすめは何ですか。", reading: "おすすめ は なん です か", en: "What do you recommend?" },
      { text: "それを両方ください。", reading: "それ を りょうほう ください", en: "Both of those, please." },
      { text: "えびのアレルギーがあるんですが。", reading: "えび の アレルギー が ある ん です が", en: "I'm allergic to prawns…" },
      { text: "わさび抜きでお願いします。", reading: "わさびぬき で おねがい します", en: "Without wasabi, please." },
      { text: "肉が食べられません。", reading: "にく が たべられません", en: "I can't eat meat." },
      { text: "お誕生日おめでとう！", reading: "おたんじょうび おめでとう", en: "Happy birthday!" },
      { text: "お会計お願いします。", reading: "おかいけい おねがい します", en: "The bill, please." },
    ],
  },
  {
    id: "3.2",
    level: 3,
    module: 7,
    kind: "audio",
    title: "子供のころ",
    subtitle: "Memories and experiences",
    intro: "Kenta's grandmother visits the share house and tells Alex about growing up in a fishing village.",
    dialogue: [
      { speaker: "Alex", text: "子供のころ、どこに住んでいましたか。", reading: "こども の ころ どこ に すんで いました か", en: "Where did you live when you were a child?" },
      { speaker: "Grandma", text: "海の近くの小さな村に住んでいました。", reading: "うみ の ちかく の ちいさな むら に すんで いました", en: "I lived in a small village near the sea." },
      { speaker: "Grandma", text: "父は漁師で、毎朝早く海に出ていましたよ。", reading: "ちち は りょうし で まいあさ はやく うみ に でて いました よ", en: "My father was a fisherman, and went out to sea early every morning." },
      { speaker: "Alex", text: "学校まで遠かったですか。", reading: "がっこう まで とおかった です か", en: "Was school far?" },
      { speaker: "Grandma", text: "歩いて一時間かかりました。冬はとても寒かったです。", reading: "あるいて いちじかん かかりました ふゆ は とても さむかった です", en: "It took an hour on foot. Winters were very cold." },
      { speaker: "Alex", text: "テレビはありましたか。", reading: "テレビ は ありました か", en: "Did you have a TV?" },
      { speaker: "Grandma", text: "村に一台だけありました。みんなで見に行ったものです。", reading: "むら に いちだい だけ ありました みんな で みに いった もの です", en: "There was only one in the village. We all used to go and watch it." },
      { speaker: "Alex", text: "楽しそうですね。", reading: "たのしそう です ね", en: "That sounds like fun." },
      { speaker: "Grandma", text: "アレックスさんは海で泳いだことがありますか。", reading: "アレックスさん は うみ で およいだ こと が あります か", en: "Have you ever swum in the sea, Alex?" },
      { speaker: "Alex", text: "日本の海ではまだ泳いだことがありません。", reading: "にほん の うみ で は まだ およいだ こと が ありません", en: "I've never swum in the sea in Japan yet." },
    ],
    notes: [
      {
        heading: "〜ていました: used to / was doing",
        body: "The past of 〜ています describes past states and habits: 住んでいました (I lived), 海に出ていました (he used to go out to sea).",
      },
      {
        heading: "〜たことがあります: experience",
        body: "Plain past + ことがあります means 'have done (at some point)'. Negative: ことがありません (have never).",
        examples: [
          { text: "日本に来たことがありますか。", reading: "にほん に きた こと が あります か", en: "Have you been to Japan before?" },
          { text: "納豆を食べたことがありません。", reading: "なっとう を たべた こと が ありません", en: "I've never eaten natto." },
        ],
      },
      {
        heading: "〜そうです: looks like",
        body: "Drop the い of an adjective and add そう: 楽しそう (looks fun), おいしそう (looks delicious). Exception: いい → よさそう.",
        examples: [{ text: "おいしそうですね。", reading: "おいしそう です ね", en: "That looks delicious." }],
      },
    ],
    phrases: [
      { text: "子供のころ", reading: "こども の ころ", en: "when I was a child" },
      { text: "海の近くに住んでいました。", reading: "うみ の ちかく に すんで いました", en: "I lived near the sea." },
      { text: "歩いて一時間かかりました。", reading: "あるいて いちじかん かかりました", en: "It took an hour on foot." },
      { text: "冬はとても寒かったです。", reading: "ふゆ は とても さむかった です", en: "Winters were very cold." },
      { text: "楽しそうですね。", reading: "たのしそう です ね", en: "That sounds fun." },
      { text: "泳いだことがありますか。", reading: "およいだ こと が あります か", en: "Have you ever swum?" },
      { text: "まだ泳いだことがありません。", reading: "まだ およいだ こと が ありません", en: "I've never swum yet." },
      { text: "納豆を食べたことがありません。", reading: "なっとう を たべた こと が ありません", en: "I've never eaten natto." },
    ],
  },
  {
    id: "3.3",
    level: 3,
    module: 7,
    kind: "culture",
    title: "Casual Japanese",
    subtitle: "Language & culture: how friends really talk",
    intro: "Textbook Japanese is polite and complete. Between friends, words shrink, particles drop and sentence endings carry the mood.",
    notes: [
      {
        heading: "Contractions",
        body: "〜ている → 〜てる (食べてる), 〜てしまう → 〜ちゃう (忘れちゃった), 〜なければ → 〜なきゃ (行かなきゃ).",
        examples: [
          { text: "今、何してる？", reading: "いま なに してる", en: "What are you doing now?" },
          { text: "忘れちゃった。", reading: "わすれちゃった", en: "I forgot (oops)." },
          { text: "もう行かなきゃ。", reading: "もう いかなきゃ", en: "I've got to go." },
        ],
      },
      {
        heading: "Sentence-ending particles",
        body: "ね seeks agreement (right?), よ asserts new information (you know), よね does both. Tone matters more than words here.",
        examples: [
          { text: "暑いね。", reading: "あつい ね", en: "Hot, isn't it?" },
          { text: "おいしいよ！", reading: "おいしい よ", en: "It's tasty, I tell you!" },
        ],
      },
      {
        heading: "Everyday casual words",
        body: "Words you'll hear constantly among friends.",
        examples: [
          { text: "マジで？", reading: "マジ で", en: "Seriously?" },
          { text: "やばい！", reading: "やばい", en: "Crazy! / Awesome! / Uh-oh!" },
          { text: "すごい！", reading: "すごい", en: "Amazing!" },
          { text: "大丈夫？", reading: "だいじょうぶ", en: "You OK?" },
        ],
      },
    ],
    phrases: [
      { text: "今、何してる？", reading: "いま なに してる", en: "What are you doing now?" },
      { text: "忘れちゃった。", reading: "わすれちゃった", en: "I forgot (oops)." },
      { text: "もう行かなきゃ。", reading: "もう いかなきゃ", en: "I've got to go." },
      { text: "暑いね。", reading: "あつい ね", en: "Hot, isn't it?" },
      { text: "マジで？", reading: "マジ で", en: "Seriously?" },
      { text: "やばい！", reading: "やばい", en: "Crazy! / Awesome! / Uh-oh!" },
      { text: "すごい！", reading: "すごい", en: "Amazing!" },
    ],
  },

  // ───────────── Module 8: Hopes and opinions ─────────────
  {
    id: "3.4",
    level: 3,
    module: 8,
    kind: "audio",
    title: "面接",
    subtitle: "A job interview in polite Japanese",
    intro: "Alex has an interview for a new position at a game studio in Tokyo. The interview is entirely in Japanese.",
    dialogue: [
      { speaker: "Interviewer", text: "本日はよろしくお願いいたします。", reading: "ほんじつ は よろしく おねがい いたします", en: "Thank you for coming today." },
      { speaker: "Alex", text: "よろしくお願いいたします。", reading: "よろしく おねがい いたします", en: "Thank you for having me." },
      { speaker: "Interviewer", text: "まず、自己紹介をお願いします。", reading: "まず じこしょうかい を おねがい します", en: "First, please introduce yourself." },
      { speaker: "Alex", text: "ブラウンと申します。三年間、エンジニアとして働いております。", reading: "ブラウン と もうします さんねんかん エンジニア と して はたらいて おります", en: "My name is Brown. I've worked as an engineer for three years." },
      { speaker: "Interviewer", text: "どうして弊社を志望されたのですか。", reading: "どうして へいしゃ を しぼう された の です か", en: "Why did you apply to our company?" },
      { speaker: "Alex", text: "御社のゲームが大好きで、一緒に作りたいと思いました。", reading: "おんしゃ の ゲーム が だいすき で いっしょ に つくりたい と おもいました", en: "I love your company's games and wanted to make them with you." },
      { speaker: "Interviewer", text: "いつから働けますか。", reading: "いつ から はたらけます か", en: "When could you start?" },
      { speaker: "Alex", text: "来月から働けます。", reading: "らいげつ から はたらけます", en: "I can start next month." },
      { speaker: "Interviewer", text: "何か質問はありますか。", reading: "なにか しつもん は あります か", en: "Do you have any questions?" },
      { speaker: "Alex", text: "リモートワークは可能でしょうか。", reading: "リモートワーク は かのう でしょう か", en: "Would remote work be possible?" },
      { speaker: "Interviewer", text: "はい、週に二日まで可能です。結果は来週ご連絡します。", reading: "はい しゅう に ふつか まで かのう です けっか は らいしゅう ごれんらく します", en: "Yes, up to two days a week. We'll contact you next week with the result." },
    ],
    notes: [
      {
        heading: "Humble words for yourself",
        body:
          "In formal settings, use humble verbs about yourself: 申します (am called) for 言います, おります for います, いたします for します.",
        examples: [
          { text: "ブラウンと申します。", reading: "ブラウン と もうします", en: "My name is Brown. (humble)" },
          { text: "よろしくお願いいたします。", reading: "よろしく おねがい いたします", en: "I look forward to working with you. (very polite)" },
        ],
      },
      {
        heading: "御社 and 弊社",
        body: "When speaking, call the other company 御社 (おんしゃ, your esteemed company) and your own 弊社 (へいしゃ, our humble company).",
      },
      {
        heading: "Potential form: can do",
        body: "う-verbs change the final u to e + る: 働く → 働ける, 話す → 話せる. る-verbs add られる: 食べられる. する becomes できる.",
        examples: [
          { text: "日本語が話せます。", reading: "にほんご が はなせます", en: "I can speak Japanese." },
          { text: "来月から働けます。", reading: "らいげつ から はたらけます", en: "I can start work next month." },
        ],
      },
    ],
    phrases: [
      { text: "よろしくお願いいたします。", reading: "よろしく おねがい いたします", en: "I look forward to working with you. (very polite)" },
      { text: "自己紹介をお願いします。", reading: "じこしょうかい を おねがい します", en: "Please introduce yourself." },
      { text: "ブラウンと申します。", reading: "ブラウン と もうします", en: "My name is Brown. (humble)" },
      { text: "エンジニアとして働いております。", reading: "エンジニア と して はたらいて おります", en: "I work as an engineer. (humble)" },
      { text: "一緒に作りたいと思いました。", reading: "いっしょ に つくりたい と おもいました", en: "I wanted to make them together." },
      { text: "来月から働けます。", reading: "らいげつ から はたらけます", en: "I can start next month." },
      { text: "日本語が話せます。", reading: "にほんご が はなせます", en: "I can speak Japanese." },
      { text: "リモートワークは可能でしょうか。", reading: "リモートワーク は かのう でしょう か", en: "Would remote work be possible?" },
      { text: "何か質問はありますか。", reading: "なにか しつもん は あります か", en: "Do you have any questions?" },
    ],
  },
  {
    id: "3.5",
    level: 3,
    module: 8,
    kind: "audio",
    title: "私はこう思います",
    subtitle: "Giving opinions, agreeing and disagreeing",
    intro: "Over dinner, the housemates debate whether Japan should have a four-day working week.",
    dialogue: [
      { speaker: "Kenta", text: "週休三日制、どう思う？", reading: "しゅうきゅうみっかせい どう おもう", en: "What do you think of a four-day week?" },
      { speaker: "Yuki", text: "私は賛成。もっと家族と過ごせると思う。", reading: "わたし は さんせい もっと かぞく と すごせる と おもう", en: "I'm for it. I think people could spend more time with family." },
      { speaker: "Kenta", text: "でも、給料が下がるかもしれないよ。", reading: "でも きゅうりょう が さがる かもしれない よ", en: "But salaries might go down." },
      { speaker: "Alex", text: "確かに。でも、効率は上がると思います。", reading: "たしかに でも こうりつ は あがる と おもいます", en: "True. But I think productivity would go up." },
      { speaker: "Kenta", text: "そうかなあ。仕事によると思うけど。", reading: "そう かなあ しごと に よる と おもう けど", en: "I wonder. I think it depends on the job." },
      { speaker: "Yuki", text: "それはそうだね。病院とかは難しそう。", reading: "それ は そう だ ね びょういん とか は むずかしそう", en: "That's true. It sounds hard for hospitals and places like that." },
      { speaker: "Alex", text: "まず、試してみたらいいんじゃないですか。", reading: "まず ためして みたら いい ん じゃない です か", en: "Wouldn't it be good to try it first?" },
      { speaker: "Kenta", text: "なるほど。それには賛成！", reading: "なるほど それ に は さんせい", en: "I see. I agree with that!" },
    ],
    notes: [
      {
        heading: "と思います: I think",
        body: "Plain form + と思います: 上がると思います (I think it'll rise). Casually, と思う. Ask others with どう思いますか.",
        examples: [
          { text: "いいと思います。", reading: "いい と おもいます", en: "I think it's good." },
          { text: "どう思いますか。", reading: "どう おもいます か", en: "What do you think?" },
        ],
      },
      {
        heading: "Agreeing and disagreeing softly",
        body:
          "賛成 (in favour) and 反対 (against) are clear but strong. Softer: 確かに (true), そうですね (yes, I see), そうかなあ (I wonder…), 〜じゃないですか (isn't it…?).",
        examples: [
          { text: "賛成です。", reading: "さんせい です", en: "I agree / I'm in favour." },
          { text: "反対です。", reading: "はんたい です", en: "I'm against it." },
          { text: "確かに。", reading: "たしかに", en: "That's true." },
        ],
      },
      {
        heading: "かもしれません: might",
        body: "Adds uncertainty: 雨が降るかもしれません (it might rain). Casually かもしれない or just かも.",
      },
    ],
    phrases: [
      { text: "どう思いますか。", reading: "どう おもいます か", en: "What do you think?" },
      { text: "いいと思います。", reading: "いい と おもいます", en: "I think it's good." },
      { text: "賛成です。", reading: "さんせい です", en: "I'm in favour." },
      { text: "反対です。", reading: "はんたい です", en: "I'm against it." },
      { text: "確かに。", reading: "たしかに", en: "That's true." },
      { text: "給料が下がるかもしれません。", reading: "きゅうりょう が さがる かもしれません", en: "Salaries might go down." },
      { text: "仕事によると思います。", reading: "しごと に よる と おもいます", en: "I think it depends on the job." },
      { text: "なるほど。", reading: "なるほど", en: "I see." },
    ],
  },
  {
    id: "3.6",
    level: 3,
    module: 8,
    kind: "culture",
    title: "敬語",
    subtitle: "Language & culture: honorific and humble speech",
    intro: "Keigo is the formal register used with customers, superiors and strangers in formal settings. It has two sides: raising the other person and lowering yourself.",
    notes: [
      {
        heading: "Respectful verbs (尊敬語)",
        body: "Used for the other person's actions: いらっしゃる (be / go / come), 召し上がる (eat / drink), おっしゃる (say), ご覧になる (see).",
        examples: [
          { text: "何を召し上がりますか。", reading: "なに を めしあがります か", en: "What would you like to eat?" },
          { text: "社長はいらっしゃいますか。", reading: "しゃちょう は いらっしゃいます か", en: "Is the company president in?" },
        ],
      },
      {
        heading: "Humble verbs (謙譲語)",
        body: "Used for your own actions toward others: 参る (go / come), いただく (receive / eat), 申す (say), 拝見する (see).",
        examples: [
          { text: "明日、伺います。", reading: "あした うかがいます", en: "I'll visit you tomorrow." },
          { text: "資料を拝見しました。", reading: "しりょう を はいけん しました", en: "I've looked at the documents." },
        ],
      },
      {
        heading: "Phrases you'll hear in shops",
        body: "Staff use keigo constantly; recognising it is more important than producing it at first.",
        examples: [
          { text: "少々お待ちください。", reading: "しょうしょう おまち ください", en: "Please wait a moment." },
          { text: "かしこまりました。", reading: "かしこまりました", en: "Certainly." },
        ],
      },
    ],
    phrases: [
      { text: "何を召し上がりますか。", reading: "なに を めしあがります か", en: "What would you like to eat?" },
      { text: "社長はいらっしゃいますか。", reading: "しゃちょう は いらっしゃいます か", en: "Is the company president in?" },
      { text: "明日、伺います。", reading: "あした うかがいます", en: "I'll visit you tomorrow." },
      { text: "資料を拝見しました。", reading: "しりょう を はいけん しました", en: "I've looked at the documents." },
      { text: "少々お待ちください。", reading: "しょうしょう おまち ください", en: "Please wait a moment." },
      { text: "かしこまりました。", reading: "かしこまりました", en: "Certainly." },
    ],
  },
  {
    id: "3.7",
    level: 3,
    module: 8,
    kind: "culture",
    title: "季節と行事",
    subtitle: "Language & culture: seasons and festivals",
    intro: "Japanese life follows the seasons closely, from cherry blossom parties to New Year visits to the shrine.",
    notes: [
      {
        heading: "Spring: 花見",
        body: "In late March and April, friends picnic under cherry blossoms (桜). The new school and work year starts in April.",
        examples: [{ text: "桜がきれいですね。", reading: "さくら が きれい です ね", en: "The cherry blossoms are beautiful." }],
      },
      {
        heading: "Summer: 祭りと花火",
        body: "Summer brings festivals, fireworks and yukata. お盆 in August is when families gather to honour their ancestors.",
        examples: [{ text: "夏祭りに行きましょう。", reading: "なつまつり に いきましょう", en: "Let's go to the summer festival." }],
      },
      {
        heading: "Autumn and winter",
        body: "Autumn is for 紅葉 (red leaves) and seasonal food. At New Year (お正月) people visit shrines and send greetings.",
        examples: [
          { text: "あけましておめでとうございます。", reading: "あけまして おめでとう ございます", en: "Happy New Year!" },
          { text: "今年もよろしくお願いします。", reading: "ことし も よろしく おねがい します", en: "I look forward to another good year with you." },
          { text: "よいお年を。", reading: "よい おとし を", en: "Have a good New Year. (said before it)" },
        ],
      },
    ],
    phrases: [
      { text: "桜がきれいですね。", reading: "さくら が きれい です ね", en: "The cherry blossoms are beautiful." },
      { text: "夏祭りに行きましょう。", reading: "なつまつり に いきましょう", en: "Let's go to the summer festival." },
      { text: "あけましておめでとうございます。", reading: "あけまして おめでとう ございます", en: "Happy New Year!" },
      { text: "今年もよろしくお願いします。", reading: "ことし も よろしく おねがい します", en: "I look forward to another good year with you." },
      { text: "よいお年を。", reading: "よい おとし を", en: "Have a good New Year." },
      { text: "紅葉", reading: "こうよう", en: "autumn leaves" },
    ],
  },
];
