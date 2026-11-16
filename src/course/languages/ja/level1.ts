import type { Lesson } from "../types";

/*
 * Readings are written in kana with a space between words, so the app can show
 * spaced romaji, build word tiles and accept typed answers in kana or romaji.
 * Particles stand alone (は, を, へ) so they romanise as wa, o, e.
 */
export const level1: Lesson[] = [
  // ───────────── Module 1: First steps ─────────────
  {
    id: "1.1",
    level: 1,
    module: 1,
    kind: "audio",
    title: "はじめまして",
    subtitle: "Meeting someone for the first time",
    intro:
      "Alex has just moved into a share house in Tokyo. In the kitchen, Alex meets Yuki, one of the housemates.",
    dialogue: [
      { speaker: "Yuki", text: "はじめまして。", reading: "はじめまして", en: "Nice to meet you." },
      { speaker: "Alex", text: "はじめまして。アレックスです。", reading: "はじめまして アレックス です", en: "Nice to meet you. I'm Alex." },
      { speaker: "Yuki", text: "私はゆきです。どうぞよろしく。", reading: "わたし は ゆき です どうぞ よろしく", en: "I'm Yuki. Pleased to meet you." },
      { speaker: "Alex", text: "よろしくお願いします。", reading: "よろしく おねがい します", en: "Pleased to meet you too." },
      { speaker: "Yuki", text: "アレックスさんはアメリカ人ですか。", reading: "アレックスさん は アメリカじん です か", en: "Are you American, Alex?" },
      { speaker: "Alex", text: "はい、そうです。ニューヨークから来ました。", reading: "はい そう です ニューヨーク から きました", en: "Yes, that's right. I came from New York." },
      { speaker: "Yuki", text: "日本語が上手ですね。", reading: "にほんご が じょうず です ね", en: "Your Japanese is good!" },
      { speaker: "Alex", text: "いいえ、まだまだです。", reading: "いいえ まだまだ です", en: "No, I still have a long way to go." },
      { speaker: "Yuki", text: "これからよろしくね。", reading: "これから よろしく ね", en: "Looking forward to living together." },
      { speaker: "Alex", text: "こちらこそ。", reading: "こちらこそ", en: "Likewise." },
    ],
    notes: [
      {
        heading: "X です: the easiest sentence in Japanese",
        body:
          "です (desu) works like 'is / am / are'. Put any noun in front of it: アレックスです (I'm Alex), 学生です (I'm a student). The final u is almost silent, so it sounds like 'dess'. Japanese often leaves out 'I' when it's obvious.",
        examples: [
          { text: "学生です。", reading: "がくせい です", en: "I'm a student." },
          { text: "会社員です。", reading: "かいしゃいん です", en: "I'm an office worker." },
        ],
      },
      {
        heading: "は marks the topic",
        body:
          "私は (watashi wa) means 'as for me'. The particle は is written with the kana for ha but is always read wa when it's a particle. Add か at the end of a sentence to make it a question — no question mark needed.",
        examples: [
          { text: "私はゆきです。", reading: "わたし は ゆき です", en: "I'm Yuki." },
          { text: "学生ですか。", reading: "がくせい です か", en: "Are you a student?" },
        ],
      },
      {
        heading: "さん and humility",
        body:
          "Add さん after other people's names, never after your own. When someone praises you, Japanese manners call for a modest reply such as いいえ、まだまだです (not at all, I've a long way to go).",
      },
    ],
    phrases: [
      { text: "はじめまして", reading: "はじめまして", en: "Nice to meet you (first time)" },
      { text: "アレックスです。", reading: "アレックス です", en: "I'm Alex." },
      { text: "私はゆきです。", reading: "わたし は ゆき です", en: "I'm Yuki." },
      { text: "よろしくお願いします。", reading: "よろしく おねがい します", en: "Pleased to meet you / Please treat me well." },
      { text: "アメリカ人ですか。", reading: "アメリカじん です か", en: "Are you American?" },
      { text: "はい、そうです。", reading: "はい そう です", en: "Yes, that's right." },
      { text: "ニューヨークから来ました。", reading: "ニューヨーク から きました", en: "I came from New York." },
      { text: "日本語が上手ですね。", reading: "にほんご が じょうず です ね", en: "Your Japanese is good!" },
      { text: "いいえ、まだまだです。", reading: "いいえ まだまだ です", en: "No, I still have a long way to go." },
      { text: "こちらこそ", reading: "こちらこそ", en: "Likewise / The pleasure is mine" },
    ],
  },
  {
    id: "1.2",
    level: 1,
    module: 1,
    kind: "audio",
    title: "おはようございます",
    subtitle: "Greetings through the day",
    intro: "Over one day, Alex greets the people around the share house: Yuki in the morning, the landlord Mr Tanaka at lunch, and Kenta in the evening.",
    dialogue: [
      { speaker: "Yuki", text: "おはよう！", reading: "おはよう", en: "Morning!" },
      { speaker: "Alex", text: "おはよう。元気？", reading: "おはよう げんき", en: "Morning. How are you?" },
      { speaker: "Yuki", text: "うん、元気。行ってきます！", reading: "うん げんき いってきます", en: "Yeah, good. I'm off!" },
      { speaker: "Alex", text: "行ってらっしゃい。", reading: "いってらっしゃい", en: "See you later! (Have a good day.)" },
      { speaker: "Tanaka", text: "こんにちは。今日はいい天気ですね。", reading: "こんにちは きょう は いい てんき です ね", en: "Hello. Lovely weather today, isn't it?" },
      { speaker: "Alex", text: "こんにちは。そうですね。", reading: "こんにちは そう です ね", en: "Hello. It is, isn't it." },
      { speaker: "Tanaka", text: "お元気ですか。", reading: "おげんき です か", en: "How are you keeping?" },
      { speaker: "Alex", text: "はい、おかげさまで元気です。", reading: "はい おかげさまで げんき です", en: "I'm well, thank you." },
      { speaker: "Kenta", text: "ただいま。", reading: "ただいま", en: "I'm home." },
      { speaker: "Alex", text: "おかえり！こんばんは、けんたさん。", reading: "おかえり こんばんは けんたさん", en: "Welcome back! Good evening, Kenta." },
      { speaker: "Kenta", text: "じゃあ、おやすみ。", reading: "じゃあ おやすみ", en: "Well, good night." },
    ],
    notes: [
      {
        heading: "Greetings by time of day",
        body: "おはようございます in the morning (just おはよう with friends), こんにちは from late morning, こんばんは in the evening, and おやすみなさい before bed.",
        examples: [
          { text: "おはようございます。", reading: "おはよう ございます", en: "Good morning. (polite)" },
          { text: "こんにちは", reading: "こんにちは", en: "Hello / Good afternoon" },
          { text: "こんばんは", reading: "こんばんは", en: "Good evening" },
          { text: "おやすみなさい", reading: "おやすみなさい", en: "Good night" },
        ],
      },
      {
        heading: "Leaving and coming home",
        body:
          "Japanese has set pairs for the doorway. The person leaving says 行ってきます (I'll go and come back); those staying reply 行ってらっしゃい. Coming home you say ただいま, and everyone answers おかえり(なさい).",
      },
      {
        heading: "Polite and casual",
        body:
          "With Mr Tanaka, Alex uses polite です/ます forms and お元気ですか. With housemates of the same age, short casual forms are normal: 元気？, おはよう. Start polite with anyone new.",
      },
    ],
    phrases: [
      { text: "おはようございます。", reading: "おはよう ございます", en: "Good morning. (polite)" },
      { text: "こんにちは", reading: "こんにちは", en: "Hello / Good afternoon" },
      { text: "こんばんは", reading: "こんばんは", en: "Good evening" },
      { text: "お元気ですか。", reading: "おげんき です か", en: "How are you?" },
      { text: "元気です。", reading: "げんき です", en: "I'm fine." },
      { text: "いい天気ですね。", reading: "いい てんき です ね", en: "Nice weather, isn't it?" },
      { text: "行ってきます。", reading: "いってきます", en: "I'm off! (leaving home)" },
      { text: "行ってらっしゃい。", reading: "いってらっしゃい", en: "Have a good day! (to someone leaving)" },
      { text: "ただいま", reading: "ただいま", en: "I'm home." },
      { text: "おかえりなさい", reading: "おかえりなさい", en: "Welcome back." },
      { text: "おやすみなさい", reading: "おやすみなさい", en: "Good night" },
    ],
  },
  {
    id: "1.3",
    level: 1,
    module: 1,
    kind: "culture",
    title: "Three scripts",
    subtitle: "Language & culture: hiragana, katakana and kanji",
    intro: "Japanese mixes three writing systems in one sentence. Here's what each one does and how to start reading.",
    notes: [
      {
        heading: "Hiragana: the grammar script",
        body:
          "46 rounded characters, each one syllable: あ a, い i, う u, え e, お o, か ka, き ki… Hiragana writes grammar endings, particles and words with no common kanji. Learn it first — every reading in this course is written in kana.",
        examples: [
          { text: "ありがとう", reading: "ありがとう", en: "Thank you" },
          { text: "すし", reading: "すし", en: "sushi" },
        ],
      },
      {
        heading: "Katakana: the borrowed-word script",
        body:
          "The same sounds in a sharper shape: ア a, イ i, ウ u… Katakana writes foreign names and loanwords. A dash ー makes a long vowel.",
        examples: [
          { text: "コーヒー", reading: "コーヒー", en: "coffee" },
          { text: "アメリカ", reading: "アメリカ", en: "America" },
          { text: "パン", reading: "パン", en: "bread" },
        ],
      },
      {
        heading: "Kanji: the meaning script",
        body:
          "Characters from Chinese, each with a meaning and usually several readings. 日 means sun or day; 本 means origin or book; together 日本 (にほん) is Japan. You'll meet kanji alongside their kana readings.",
        examples: [
          { text: "日本", reading: "にほん", en: "Japan" },
          { text: "山", reading: "やま", en: "mountain" },
          { text: "水", reading: "みず", en: "water" },
        ],
      },
      {
        heading: "Small っ and long vowels",
        body:
          "A small っ doubles the next consonant with a tiny pause: きって (kitte, stamp) vs きて (kite, come). Long vowels change meaning too: おばさん (aunt) vs おばあさん (grandmother).",
        examples: [
          { text: "切手", reading: "きって", en: "stamp" },
          { text: "おばあさん", reading: "おばあさん", en: "grandmother" },
        ],
      },
    ],
    phrases: [
      { text: "ありがとう", reading: "ありがとう", en: "Thank you" },
      { text: "コーヒー", reading: "コーヒー", en: "coffee" },
      { text: "アメリカ", reading: "アメリカ", en: "America" },
      { text: "日本", reading: "にほん", en: "Japan" },
      { text: "山", reading: "やま", en: "mountain" },
      { text: "水", reading: "みず", en: "water" },
      { text: "切手", reading: "きって", en: "stamp" },
      { text: "おばあさん", reading: "おばあさん", en: "grandmother" },
    ],
  },
  {
    id: "1.4",
    level: 1,
    module: 1,
    kind: "culture",
    title: "お辞儀とすみません",
    subtitle: "Language & culture: bowing and the magic word すみません",
    intro: "A few habits and phrases will make you sound polite in almost any situation in Japan.",
    notes: [
      {
        heading: "Bowing",
        body:
          "A small nod of the head works for greetings and thanks in everyday life. A deeper bow from the waist shows respect or a serious apology. Handshakes are fine with people used to foreign visitors, but expect a bow first.",
      },
      {
        heading: "すみません does everything",
        body:
          "すみません (sumimasen) means 'excuse me', 'sorry' and even 'thank you for your trouble'. Use it to call a waiter, get past someone on the train or thank someone who held a door.",
        examples: [
          { text: "すみません", reading: "すみません", en: "Excuse me / Sorry / Thanks" },
          { text: "ごめんなさい", reading: "ごめんなさい", en: "I'm sorry (personal apology)" },
        ],
      },
      {
        heading: "Thank you, please, you're welcome",
        body: "ください after a noun asks for it; お願いします is a softer 'please'.",
        examples: [
          { text: "ありがとうございます", reading: "ありがとう ございます", en: "Thank you very much" },
          { text: "どういたしまして", reading: "どういたしまして", en: "You're welcome" },
          { text: "お願いします", reading: "おねがい します", en: "Please" },
          { text: "水をください。", reading: "みず を ください", en: "Water, please." },
          { text: "大丈夫です。", reading: "だいじょうぶ です", en: "I'm OK / No thank you." },
        ],
      },
    ],
    phrases: [
      { text: "すみません", reading: "すみません", en: "Excuse me / Sorry / Thanks" },
      { text: "ごめんなさい", reading: "ごめんなさい", en: "I'm sorry" },
      { text: "ありがとうございます", reading: "ありがとう ございます", en: "Thank you very much" },
      { text: "どういたしまして", reading: "どういたしまして", en: "You're welcome" },
      { text: "お願いします", reading: "おねがい します", en: "Please" },
      { text: "水をください。", reading: "みず を ください", en: "Water, please." },
      { text: "大丈夫です。", reading: "だいじょうぶ です", en: "I'm OK / No thank you." },
    ],
  },

  // ───────────── Module 2: Out and about ─────────────
  {
    id: "1.5",
    level: 1,
    module: 2,
    kind: "audio",
    title: "カフェで",
    subtitle: "Ordering drinks and paying",
    intro: "Alex and Kenta stop at a small café near the station.",
    dialogue: [
      { speaker: "Staff", text: "いらっしゃいませ。何名様ですか。", reading: "いらっしゃいませ なんめいさま です か", en: "Welcome. How many people?" },
      { speaker: "Kenta", text: "二人です。", reading: "ふたり です", en: "Two." },
      { speaker: "Staff", text: "ご注文はお決まりですか。", reading: "ごちゅうもん は おきまり です か", en: "Are you ready to order?" },
      { speaker: "Kenta", text: "アイスコーヒーをお願いします。", reading: "アイスコーヒー を おねがい します", en: "An iced coffee, please." },
      { speaker: "Alex", text: "私は抹茶ラテとケーキをください。", reading: "わたし は まっちゃラテ と ケーキ を ください", en: "A matcha latte and a cake for me, please." },
      { speaker: "Staff", text: "サイズはいかがなさいますか。", reading: "サイズ は いかが なさいます か", en: "What size would you like?" },
      { speaker: "Alex", text: "Mでお願いします。", reading: "エム で おねがい します", en: "Medium, please." },
      { speaker: "Staff", text: "全部で千二百円です。", reading: "ぜんぶ で せんにひゃくえん です", en: "That's 1,200 yen altogether." },
      { speaker: "Alex", text: "カードで払えますか。", reading: "カード で はらえます か", en: "Can I pay by card?" },
      { speaker: "Staff", text: "はい、大丈夫です。", reading: "はい だいじょうぶ です", en: "Yes, that's fine." },
    ],
    notes: [
      {
        heading: "Asking for things",
        body:
          "Noun + を + ください (please give me) or お願いします (please). と joins nouns: 抹茶ラテとケーキ (a matcha latte and a cake).",
        examples: [
          { text: "コーヒーをください。", reading: "コーヒー を ください", en: "A coffee, please." },
          { text: "これをお願いします。", reading: "これ を おねがい します", en: "This one, please." },
        ],
      },
      {
        heading: "Shop Japanese",
        body:
          "Staff use very formal language (keigo) such as いらっしゃいませ (welcome) and いかがなさいますか (how would you like it?). You don't need to answer in keigo — polite です/ます is perfect.",
      },
      {
        heading: "No tipping",
        body:
          "Tipping isn't done in Japan and can cause confusion. Many shops have a small tray: put your money or card in it rather than handing it over directly.",
      },
    ],
    phrases: [
      { text: "いらっしゃいませ", reading: "いらっしゃいませ", en: "Welcome (said by staff)" },
      { text: "二人です。", reading: "ふたり です", en: "Two people." },
      { text: "アイスコーヒーをお願いします。", reading: "アイスコーヒー を おねがい します", en: "An iced coffee, please." },
      { text: "ケーキをください。", reading: "ケーキ を ください", en: "A cake, please." },
      { text: "これをお願いします。", reading: "これ を おねがい します", en: "This one, please." },
      { text: "全部でいくらですか。", reading: "ぜんぶ で いくら です か", en: "How much is it altogether?" },
      { text: "千二百円です。", reading: "せんにひゃくえん です", en: "It's 1,200 yen." },
      { text: "カードで払えますか。", reading: "カード で はらえます か", en: "Can I pay by card?" },
      { text: "大丈夫です。", reading: "だいじょうぶ です", en: "That's fine." },
    ],
  },
  {
    id: "1.6",
    level: 1,
    module: 2,
    kind: "audio",
    title: "駅はどこですか",
    subtitle: "Asking for and understanding directions",
    intro: "Alex is trying to find Shinjuku Station and asks a woman on the street.",
    dialogue: [
      { speaker: "Alex", text: "すみません、新宿駅はどこですか。", reading: "すみません しんじゅくえき は どこ です か", en: "Excuse me, where is Shinjuku Station?" },
      { speaker: "Woman", text: "新宿駅ですか。この道をまっすぐ行ってください。", reading: "しんじゅくえき です か この みち を まっすぐ いって ください", en: "Shinjuku Station? Go straight along this road." },
      { speaker: "Woman", text: "二つ目の信号を右に曲がってください。", reading: "ふたつめ の しんごう を みぎ に まがって ください", en: "Turn right at the second traffic light." },
      { speaker: "Alex", text: "遠いですか。", reading: "とおい です か", en: "Is it far?" },
      { speaker: "Woman", text: "いいえ、歩いて五分ぐらいです。", reading: "いいえ あるいて ごふん ぐらい です", en: "No, about five minutes on foot." },
      { speaker: "Alex", text: "この近くにトイレはありますか。", reading: "この ちかく に トイレ は あります か", en: "Is there a toilet near here?" },
      { speaker: "Woman", text: "あのコンビニの中にありますよ。", reading: "あの コンビニ の なか に あります よ", en: "There's one inside that convenience store." },
      { speaker: "Alex", text: "すみません、もう一度お願いします。", reading: "すみません もう いちど おねがい します", en: "Sorry, could you say that once more?" },
      { speaker: "Woman", text: "あのコンビニの中です。", reading: "あの コンビニ の なか です", en: "Inside that convenience store." },
      { speaker: "Alex", text: "ありがとうございました。", reading: "ありがとう ございました", en: "Thank you very much." },
    ],
    notes: [
      {
        heading: "Direction words",
        body: "These cover most directions you'll be given.",
        examples: [
          { text: "まっすぐ", reading: "まっすぐ", en: "straight ahead" },
          { text: "右", reading: "みぎ", en: "right" },
          { text: "左", reading: "ひだり", en: "left" },
          { text: "信号", reading: "しんごう", en: "traffic light" },
          { text: "角", reading: "かど", en: "corner" },
        ],
      },
      {
        heading: "Asking politely with 〜てください",
        body:
          "The て form of a verb plus ください makes a polite request: 行ってください (please go), 曲がってください (please turn), 待ってください (please wait).",
      },
      {
        heading: "あります: there is",
        body:
          "Use あります for things and います for people and animals. この, その, あの mean this, that (near you), that (over there).",
      },
    ],
    phrases: [
      { text: "駅はどこですか。", reading: "えき は どこ です か", en: "Where is the station?" },
      { text: "まっすぐ行ってください。", reading: "まっすぐ いって ください", en: "Please go straight ahead." },
      { text: "右に曲がってください。", reading: "みぎ に まがって ください", en: "Please turn right." },
      { text: "左に曲がってください。", reading: "ひだり に まがって ください", en: "Please turn left." },
      { text: "遠いですか。", reading: "とおい です か", en: "Is it far?" },
      { text: "歩いて五分ぐらいです。", reading: "あるいて ごふん ぐらい です", en: "About five minutes on foot." },
      { text: "トイレはありますか。", reading: "トイレ は あります か", en: "Is there a toilet?" },
      { text: "もう一度お願いします。", reading: "もう いちど おねがい します", en: "Once more, please." },
      { text: "ありがとうございました。", reading: "ありがとう ございました", en: "Thank you very much (for what you did)." },
    ],
  },
  {
    id: "1.7",
    level: 1,
    module: 2,
    kind: "culture",
    title: "Numbers and money",
    subtitle: "Language & culture: counting, yen and telling the time",
    intro: "Japanese numbers are wonderfully regular: once you know one to ten, you can build almost any number.",
    notes: [
      {
        heading: "One to ten",
        body:
          "いち 1, に 2, さん 3, よん (し) 4, ご 5, ろく 6, なな (しち) 7, はち 8, きゅう 9, じゅう 10. Then just combine: じゅういち 11, にじゅう 20, にじゅうさん 23.",
        examples: [
          { text: "十一", reading: "じゅういち", en: "11" },
          { text: "二十三", reading: "にじゅうさん", en: "23" },
          { text: "九十九", reading: "きゅうじゅうきゅう", en: "99" },
        ],
      },
      {
        heading: "Hundreds and thousands",
        body:
          "百 (ひゃく) 100, 千 (せん) 1,000, 万 (まん) 10,000. Watch the sound changes: 三百 さんびゃく, 六百 ろっぴゃく, 八百 はっぴゃく, 三千 さんぜん, 八千 はっせん. Big numbers count in units of 万: 30,000 is 三万 (さんまん).",
        examples: [
          { text: "三百円", reading: "さんびゃくえん", en: "300 yen" },
          { text: "八千円", reading: "はっせんえん", en: "8,000 yen" },
          { text: "一万円", reading: "いちまんえん", en: "10,000 yen" },
        ],
      },
      {
        heading: "Telling the time",
        body:
          "Hours use 時 (じ) and minutes 分 (ふん / ぷん). Note 四時 is よじ, 七時 しちじ and 九時 くじ. 半 (はん) means half past.",
        examples: [
          { text: "今、何時ですか。", reading: "いま なんじ です か", en: "What time is it now?" },
          { text: "三時です。", reading: "さんじ です", en: "It's three o'clock." },
          { text: "九時半", reading: "くじはん", en: "half past nine" },
          { text: "いくらですか。", reading: "いくら です か", en: "How much is it?" },
        ],
      },
    ],
    phrases: [
      { text: "十一", reading: "じゅういち", en: "11" },
      { text: "二十三", reading: "にじゅうさん", en: "23" },
      { text: "三百円", reading: "さんびゃくえん", en: "300 yen" },
      { text: "八千円", reading: "はっせんえん", en: "8,000 yen" },
      { text: "一万円", reading: "いちまんえん", en: "10,000 yen" },
      { text: "今、何時ですか。", reading: "いま なんじ です か", en: "What time is it now?" },
      { text: "三時です。", reading: "さんじ です", en: "It's three o'clock." },
      { text: "九時半", reading: "くじはん", en: "half past nine" },
      { text: "いくらですか。", reading: "いくら です か", en: "How much is it?" },
    ],
  },
  {
    id: "1.8",
    level: 1,
    module: 2,
    kind: "audio",
    title: "コンビニで",
    subtitle: "Shopping at a convenience store",
    intro: "Late in the evening Alex pops into the konbini for dinner.",
    dialogue: [
      { speaker: "Clerk", text: "いらっしゃいませ。", reading: "いらっしゃいませ", en: "Welcome." },
      { speaker: "Alex", text: "すみません、おにぎりはどこですか。", reading: "すみません おにぎり は どこ です か", en: "Excuse me, where are the rice balls?" },
      { speaker: "Clerk", text: "あちらの棚にございます。", reading: "あちら の たな に ございます", en: "They're on that shelf over there." },
      { speaker: "Clerk", text: "お弁当は温めますか。", reading: "おべんとう は あたためます か", en: "Shall I heat up the bento?" },
      { speaker: "Alex", text: "はい、お願いします。", reading: "はい おねがい します", en: "Yes, please." },
      { speaker: "Clerk", text: "袋はご利用ですか。", reading: "ふくろ は ごりよう です か", en: "Would you like a bag?" },
      { speaker: "Alex", text: "いいえ、大丈夫です。", reading: "いいえ だいじょうぶ です", en: "No, I'm fine." },
      { speaker: "Clerk", text: "お箸は何膳おつけしますか。", reading: "おはし は なんぜん おつけ します か", en: "How many pairs of chopsticks?" },
      { speaker: "Alex", text: "一つでいいです。", reading: "ひとつ で いい です", en: "One is fine." },
      { speaker: "Clerk", text: "六百五十円になります。", reading: "ろっぴゃくごじゅうえん に なります", en: "That comes to 650 yen." },
    ],
    notes: [
      {
        heading: "The konbini",
        body:
          "Japanese convenience stores sell hot meals, pay bills, print documents and ship parcels. Staff will often offer to heat your bento (温めますか) and ask about bags, which cost a few yen.",
      },
      {
        heading: "Saying no politely",
        body:
          "いいえ、大丈夫です (no, I'm fine) is the smoothest way to turn down an offer. 結構です also means 'no thank you' but can sound firm.",
      },
      {
        heading: "Counting things: ひとつ, ふたつ",
        body:
          "For general objects Japanese uses its own counting words: ひとつ 1, ふたつ 2, みっつ 3, よっつ 4, いつつ 5. They're handy when you don't know the right counter.",
        examples: [
          { text: "一つ", reading: "ひとつ", en: "one (thing)" },
          { text: "二つください。", reading: "ふたつ ください", en: "Two, please." },
        ],
      },
    ],
    phrases: [
      { text: "おにぎりはどこですか。", reading: "おにぎり は どこ です か", en: "Where are the rice balls?" },
      { text: "温めますか。", reading: "あたためます か", en: "Shall I heat it up?" },
      { text: "はい、お願いします。", reading: "はい おねがい します", en: "Yes, please." },
      { text: "いいえ、大丈夫です。", reading: "いいえ だいじょうぶ です", en: "No, I'm fine (thanks)." },
      { text: "袋はいりません。", reading: "ふくろ は いりません", en: "I don't need a bag." },
      { text: "一つでいいです。", reading: "ひとつ で いい です", en: "One is fine." },
      { text: "二つください。", reading: "ふたつ ください", en: "Two, please." },
      { text: "お箸", reading: "おはし", en: "chopsticks" },
      { text: "お弁当", reading: "おべんとう", en: "boxed meal (bento)" },
    ],
  },

  // ───────────── Module 3: Everyday life ─────────────
  {
    id: "1.9",
    level: 1,
    module: 3,
    kind: "audio",
    title: "家族",
    subtitle: "Talking about family",
    intro: "Yuki shows Alex photos from home on her phone.",
    dialogue: [
      { speaker: "Alex", text: "これはゆきさんの家族ですか。", reading: "これ は ゆきさん の かぞく です か", en: "Is this your family, Yuki?" },
      { speaker: "Yuki", text: "うん。父と母と弟。", reading: "うん ちち と はは と おとうと", en: "Yeah. My dad, my mum and my little brother." },
      { speaker: "Alex", text: "弟さんは何歳ですか。", reading: "おとうとさん は なんさい です か", en: "How old is your brother?" },
      { speaker: "Yuki", text: "十八歳。大学生だよ。", reading: "じゅうはっさい だいがくせい だ よ", en: "Eighteen. He's at university." },
      { speaker: "Yuki", text: "アレックスさんは兄弟がいますか。", reading: "アレックスさん は きょうだい が います か", en: "Do you have any brothers or sisters, Alex?" },
      { speaker: "Alex", text: "姉が一人います。", reading: "あね が ひとり います", en: "I have one older sister." },
      { speaker: "Yuki", text: "お姉さんもアメリカに住んでいますか。", reading: "おねえさん も アメリカ に すんで います か", en: "Does your sister live in America too?" },
      { speaker: "Alex", text: "いいえ、今はカナダに住んでいます。", reading: "いいえ いま は カナダ に すんで います", en: "No, she lives in Canada now." },
      { speaker: "Yuki", text: "へえ、いいですね。", reading: "へえ いい です ね", en: "Oh, nice." },
    ],
    notes: [
      {
        heading: "Two words for each family member",
        body:
          "Japanese uses humble words for your own family and respectful words for someone else's. My mother is 母 (はは); your mother is お母さん (おかあさん).",
        examples: [
          { text: "父 / お父さん", reading: "ちち おとうさん", en: "my father / your father" },
          { text: "母 / お母さん", reading: "はは おかあさん", en: "my mother / your mother" },
          { text: "兄 / お兄さん", reading: "あに おにいさん", en: "my older brother / yours" },
          { text: "姉 / お姉さん", reading: "あね おねえさん", en: "my older sister / yours" },
          { text: "弟 / 妹", reading: "おとうと いもうと", en: "younger brother / younger sister" },
        ],
      },
      {
        heading: "います for people",
        body: "To say you have siblings, use います: 姉が一人います (I have one older sister). People are counted with 人: 一人 ひとり, 二人 ふたり, 三人 さんにん.",
      },
      {
        heading: "Ages",
        body: "Add 歳 (さい): 二十歳 is はたち, a special word for 20. Ask with 何歳ですか, or politely おいくつですか.",
      },
    ],
    phrases: [
      { text: "これは家族ですか。", reading: "これ は かぞく です か", en: "Is this your family?" },
      { text: "父と母", reading: "ちち と はは", en: "my father and mother" },
      { text: "何歳ですか。", reading: "なんさい です か", en: "How old are you / is he?" },
      { text: "十八歳です。", reading: "じゅうはっさい です", en: "I'm / He's eighteen." },
      { text: "兄弟がいますか。", reading: "きょうだい が います か", en: "Do you have siblings?" },
      { text: "姉が一人います。", reading: "あね が ひとり います", en: "I have one older sister." },
      { text: "カナダに住んでいます。", reading: "カナダ に すんで います", en: "She lives in Canada." },
      { text: "お母さん", reading: "おかあさん", en: "(someone's) mother" },
      { text: "弟", reading: "おとうと", en: "(my) younger brother" },
    ],
  },
  {
    id: "1.10",
    level: 1,
    module: 3,
    kind: "audio",
    title: "何が好きですか",
    subtitle: "Likes, dislikes and free time",
    intro: "Kenta and Alex chat on the sofa about what they do on weekends.",
    dialogue: [
      { speaker: "Kenta", text: "週末は何をしますか。", reading: "しゅうまつ は なに を します か", en: "What do you do at weekends?" },
      { speaker: "Alex", text: "よく映画を見ます。", reading: "よく えいが を みます", en: "I often watch films." },
      { speaker: "Kenta", text: "どんな映画が好きですか。", reading: "どんな えいが が すき です か", en: "What kind of films do you like?" },
      { speaker: "Alex", text: "アニメが大好きです。けんたさんは？", reading: "アニメ が だいすき です けんたさん は", en: "I love anime. What about you, Kenta?" },
      { speaker: "Kenta", text: "僕はサッカーが好きです。毎週しています。", reading: "ぼく は サッカー が すき です まいしゅう して います", en: "I like football. I play every week." },
      { speaker: "Alex", text: "いいですね。私はスポーツがあまり好きじゃないです。", reading: "いい です ね わたし は スポーツ が あまり すき じゃない です", en: "Nice. I don't really like sport." },
      { speaker: "Kenta", text: "じゃあ、料理は？", reading: "じゃあ りょうり は", en: "What about cooking, then?" },
      { speaker: "Alex", text: "料理は得意です！", reading: "りょうり は とくい です", en: "I'm good at cooking!" },
      { speaker: "Kenta", text: "今度一緒に作りましょう。", reading: "こんど いっしょ に つくりましょう", en: "Let's cook together sometime." },
    ],
    notes: [
      {
        heading: "好き and 嫌い",
        body:
          "好き (like) and 嫌い (dislike) describe the thing, so it takes が: 映画が好きです (I like films). 大好き means love. 嫌い sounds strong, so people often say 好きじゃないです (I don't really like it).",
        examples: [
          { text: "猫が好きです。", reading: "ねこ が すき です", en: "I like cats." },
          { text: "ラーメンが大好きです。", reading: "ラーメン が だいすき です", en: "I love ramen." },
          { text: "あまり好きじゃないです。", reading: "あまり すき じゃない です", en: "I don't really like it." },
        ],
      },
      {
        heading: "を marks the object",
        body: "映画を見ます (watch a film), 本を読みます (read a book). The verb always comes last in a Japanese sentence.",
      },
      {
        heading: "How often",
        body: "毎日 (every day), 毎週 (every week), よく (often), 時々 (sometimes), あまり + negative (not much), 全然 + negative (not at all).",
      },
    ],
    phrases: [
      { text: "週末は何をしますか。", reading: "しゅうまつ は なに を します か", en: "What do you do at weekends?" },
      { text: "よく映画を見ます。", reading: "よく えいが を みます", en: "I often watch films." },
      { text: "何が好きですか。", reading: "なに が すき です か", en: "What do you like?" },
      { text: "アニメが大好きです。", reading: "アニメ が だいすき です", en: "I love anime." },
      { text: "サッカーが好きです。", reading: "サッカー が すき です", en: "I like football." },
      { text: "あまり好きじゃないです。", reading: "あまり すき じゃない です", en: "I don't really like it." },
      { text: "料理は得意です。", reading: "りょうり は とくい です", en: "I'm good at cooking." },
      { text: "一緒に作りましょう。", reading: "いっしょ に つくりましょう", en: "Let's make it together." },
      { text: "時々", reading: "ときどき", en: "sometimes" },
    ],
  },
  {
    id: "1.11",
    level: 1,
    module: 3,
    kind: "culture",
    title: "Particles",
    subtitle: "Language & culture: は, が, を, に, で, の",
    intro: "Particles are small words placed after a noun to show its job in the sentence. They let Japanese word order stay flexible — as long as the verb comes last.",
    notes: [
      {
        heading: "は (wa): the topic",
        body: "Sets what you're talking about: 私は学生です (as for me, I'm a student).",
        examples: [{ text: "今日は暑いです。", reading: "きょう は あつい です", en: "It's hot today." }],
      },
      {
        heading: "が (ga): the subject, new information",
        body: "Used with likes, abilities, existence and question words: 誰が来ますか (who's coming?).",
        examples: [{ text: "雨が降っています。", reading: "あめ が ふって います", en: "It's raining." }],
      },
      {
        heading: "を (o): the object",
        body: "What the action is done to.",
        examples: [{ text: "水を飲みます。", reading: "みず を のみます", en: "I drink water." }],
      },
      {
        heading: "に (ni): time, destination, location of existence",
        body: "When, where to, and where something is.",
        examples: [
          { text: "七時に起きます。", reading: "しちじ に おきます", en: "I get up at seven." },
          { text: "東京に行きます。", reading: "とうきょう に いきます", en: "I'm going to Tokyo." },
        ],
      },
      {
        heading: "で (de): place of action, means",
        body: "Where something happens and how.",
        examples: [
          { text: "家で勉強します。", reading: "いえ で べんきょう します", en: "I study at home." },
          { text: "電車で行きます。", reading: "でんしゃ で いきます", en: "I go by train." },
        ],
      },
      {
        heading: "の (no): of / 's",
        body: "Links nouns like an apostrophe-s.",
        examples: [{ text: "私の本です。", reading: "わたし の ほん です", en: "It's my book." }],
      },
    ],
    phrases: [
      { text: "今日は暑いです。", reading: "きょう は あつい です", en: "It's hot today." },
      { text: "雨が降っています。", reading: "あめ が ふって います", en: "It's raining." },
      { text: "水を飲みます。", reading: "みず を のみます", en: "I drink water." },
      { text: "七時に起きます。", reading: "しちじ に おきます", en: "I get up at seven." },
      { text: "東京に行きます。", reading: "とうきょう に いきます", en: "I'm going to Tokyo." },
      { text: "家で勉強します。", reading: "いえ で べんきょう します", en: "I study at home." },
      { text: "電車で行きます。", reading: "でんしゃ で いきます", en: "I go by train." },
      { text: "私の本です。", reading: "わたし の ほん です", en: "It's my book." },
    ],
  },
  {
    id: "1.12",
    level: 1,
    module: 3,
    kind: "culture",
    title: "いただきます",
    subtitle: "Language & culture: meals and table manners",
    intro: "Mealtimes come with their own set phrases and a few rules worth knowing before your first dinner with Japanese friends.",
    notes: [
      {
        heading: "Before and after eating",
        body:
          "Say いただきます (I humbly receive) before you start, often with hands together, and ごちそうさまでした (thank you for the meal) when you finish — including to restaurant staff as you leave.",
        examples: [
          { text: "いただきます", reading: "いただきます", en: "Said before eating" },
          { text: "ごちそうさまでした", reading: "ごちそうさまでした", en: "Thank you for the meal" },
        ],
      },
      {
        heading: "Chopstick manners",
        body:
          "Don't stand chopsticks upright in rice or pass food from chopstick to chopstick — both are linked to funerals. Rest them on the holder when you pause. Slurping noodles is fine, even appreciated.",
      },
      {
        heading: "Meals of the day",
        body: "朝ご飯 (breakfast), 昼ご飯 (lunch), 晩ご飯 (dinner). ご飯 means both cooked rice and a meal.",
        examples: [
          { text: "朝ご飯", reading: "あさごはん", en: "breakfast" },
          { text: "昼ご飯", reading: "ひるごはん", en: "lunch" },
          { text: "晩ご飯", reading: "ばんごはん", en: "dinner" },
          { text: "おいしいです！", reading: "おいしい です", en: "It's delicious!" },
          { text: "お腹がすきました。", reading: "おなか が すきました", en: "I'm hungry." },
          { text: "乾杯！", reading: "かんぱい", en: "Cheers!" },
        ],
      },
    ],
    phrases: [
      { text: "いただきます", reading: "いただきます", en: "Said before eating" },
      { text: "ごちそうさまでした", reading: "ごちそうさまでした", en: "Thank you for the meal" },
      { text: "朝ご飯", reading: "あさごはん", en: "breakfast" },
      { text: "昼ご飯", reading: "ひるごはん", en: "lunch" },
      { text: "晩ご飯", reading: "ばんごはん", en: "dinner" },
      { text: "おいしいです！", reading: "おいしい です", en: "It's delicious!" },
      { text: "お腹がすきました。", reading: "おなか が すきました", en: "I'm hungry." },
      { text: "乾杯！", reading: "かんぱい", en: "Cheers!" },
    ],
  },
];
