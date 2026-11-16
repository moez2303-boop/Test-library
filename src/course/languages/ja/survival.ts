import type { SurvivalGroup } from "../types";

export const SURVIVAL: SurvivalGroup[] = [
  {
    title: "Getting by",
    icon: "💬",
    phrases: [
      { text: "分かりません。", reading: "わかりません", en: "I don't understand." },
      { text: "英語を話せますか。", reading: "えいご を はなせます か", en: "Can you speak English?" },
      { text: "ゆっくり話してください。", reading: "ゆっくり はなして ください", en: "Please speak slowly." },
      { text: "これは日本語で何と言いますか。", reading: "これ は にほんご で なん と いいます か", en: "What is this called in Japanese?" },
      { text: "どういう意味ですか。", reading: "どういう いみ です か", en: "What does it mean?" },
      { text: "書いてください。", reading: "かいて ください", en: "Please write it down." },
      { text: "道に迷いました。", reading: "みち に まよいました", en: "I'm lost." },
    ],
  },
  {
    title: "Emergencies",
    icon: "🚑",
    phrases: [
      { text: "助けて！", reading: "たすけて", en: "Help!" },
      { text: "警察を呼んでください！", reading: "けいさつ を よんで ください", en: "Call the police!" },
      { text: "救急車を呼んでください！", reading: "きゅうきゅうしゃ を よんで ください", en: "Call an ambulance!" },
      { text: "医者に診てもらいたいです。", reading: "いしゃ に みて もらいたい です", en: "I need to see a doctor." },
      { text: "財布をなくしました。", reading: "さいふ を なくしました", en: "I've lost my wallet." },
      { text: "一番近い病院はどこですか。", reading: "いちばん ちかい びょういん は どこ です か", en: "Where is the nearest hospital?" },
      { text: "緊急です。", reading: "きんきゅう です", en: "It's an emergency." },
    ],
  },
  {
    title: "Shopping",
    icon: "🛍️",
    phrases: [
      { text: "これはいくらですか。", reading: "これ は いくら です か", en: "How much is this?" },
      { text: "見ているだけです。", reading: "みて いる だけ です", en: "I'm just looking." },
      { text: "もう少し大きいサイズはありますか。", reading: "もう すこし おおきい サイズ は あります か", en: "Do you have a slightly bigger size?" },
      { text: "試着してもいいですか。", reading: "しちゃく して も いい です か", en: "Can I try it on?" },
      { text: "これにします。", reading: "これ に します", en: "I'll take this." },
      { text: "カードは使えますか。", reading: "カード は つかえます か", en: "Can I use a card?" },
      { text: "免税できますか。", reading: "めんぜい できます か", en: "Can I get it tax-free?" },
    ],
  },
  {
    title: "Eating out",
    icon: "🍽️",
    phrases: [
      { text: "二人です。", reading: "ふたり です", en: "Two people." },
      { text: "メニューをください。", reading: "メニュー を ください", en: "The menu, please." },
      { text: "英語のメニューはありますか。", reading: "えいご の メニュー は あります か", en: "Do you have an English menu?" },
      { text: "ベジタリアンです。", reading: "ベジタリアン です", en: "I'm vegetarian." },
      { text: "お水をください。", reading: "おみず を ください", en: "Some water, please." },
      { text: "ごちそうさまでした。", reading: "ごちそうさまでした", en: "Thank you for the meal." },
      { text: "お会計お願いします。", reading: "おかいけい おねがい します", en: "The bill, please." },
    ],
  },
  {
    title: "Getting around",
    icon: "🚆",
    phrases: [
      { text: "駅はどこですか。", reading: "えき は どこ です か", en: "Where is the station?" },
      { text: "この電車は渋谷に行きますか。", reading: "この でんしゃ は しぶや に いきます か", en: "Does this train go to Shibuya?" },
      { text: "次の電車は何時ですか。", reading: "つぎ の でんしゃ は なんじ です か", en: "What time is the next train?" },
      { text: "ここまでお願いします。", reading: "ここ まで おねがい します", en: "To here, please. (showing a taxi driver)" },
      { text: "ここで止めてください。", reading: "ここ で とめて ください", en: "Please stop here." },
      { text: "トイレはどこですか。", reading: "トイレ は どこ です か", en: "Where is the toilet?" },
      { text: "コインロッカーはありますか。", reading: "コインロッカー は あります か", en: "Are there coin lockers?" },
    ],
  },
];
