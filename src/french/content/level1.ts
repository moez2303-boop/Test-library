import type { Lesson } from "./types";

export const level1: Lesson[] = [
  // ───────────── Module 1: First steps ─────────────
  {
    id: "1.1",
    level: 1,
    module: 1,
    kind: "audio",
    title: "Bonjour !",
    subtitle: "Greetings and introducing yourself",
    intro:
      "Sam has just arrived in Lyon and meets Léa, a neighbour, on the stairs. Listen to how they greet each other and swap names.",
    dialogue: [
      { speaker: "Léa", fr: "Bonjour !", en: "Hello!" },
      { speaker: "Sam", fr: "Bonjour, madame.", en: "Hello, ma'am." },
      { speaker: "Léa", fr: "Je m'appelle Léa. Et vous ?", en: "My name is Léa. And you?" },
      { speaker: "Sam", fr: "Je m'appelle Sam.", en: "My name is Sam." },
      { speaker: "Léa", fr: "Enchantée, Sam.", en: "Nice to meet you, Sam." },
      { speaker: "Sam", fr: "Enchanté. Vous habitez ici ?", en: "Nice to meet you. Do you live here?" },
      { speaker: "Léa", fr: "Oui, au deuxième étage.", en: "Yes, on the second floor." },
      { speaker: "Sam", fr: "Moi, au troisième.", en: "Me, on the third." },
      { speaker: "Léa", fr: "Bienvenue ! Bonne journée !", en: "Welcome! Have a nice day!" },
      { speaker: "Sam", fr: "Merci, vous aussi.", en: "Thank you, you too." },
    ],
    notes: [
      {
        heading: "Bonjour is everywhere",
        body:
          "Say « bonjour » when you walk into a shop, a bakery, a doctor's waiting room, or when you meet anyone during the day. Skipping it can come across as rude. In the evening switch to « bonsoir ».",
      },
      {
        heading: "Enchanté or enchantée?",
        body:
          "Both sound exactly the same. The extra -e is written when the speaker is a woman. Sam writes « enchanté », Léa writes « enchantée ».",
        examples: [
          { fr: "Enchanté.", en: "Nice to meet you. (man speaking)" },
          { fr: "Enchantée.", en: "Nice to meet you. (woman speaking)" },
        ],
      },
      {
        heading: "Vous, the polite 'you'",
        body:
          "With strangers and adults you don't know, use « vous ». Save « tu » for friends, family, children and pets. When in doubt, use « vous ».",
      },
    ],
    phrases: [
      { fr: "Bonjour", en: "Hello / Good morning" },
      { fr: "Bonsoir", en: "Good evening" },
      { fr: "Je m'appelle Sam.", en: "My name is Sam.", note: "lit. I call myself Sam" },
      { fr: "Et vous ?", en: "And you? (polite)" },
      { fr: "Enchanté", en: "Nice to meet you" },
      { fr: "Vous habitez ici ?", en: "Do you live here?" },
      { fr: "Oui", en: "Yes" },
      { fr: "Non", en: "No" },
      { fr: "Bienvenue !", en: "Welcome!" },
      { fr: "Bonne journée !", en: "Have a nice day!" },
      { fr: "Merci", en: "Thank you" },
      { fr: "Vous aussi", en: "You too" },
    ],
  },
  {
    id: "1.2",
    level: 1,
    module: 1,
    kind: "audio",
    title: "Ça va ?",
    subtitle: "Asking how someone is and saying goodbye",
    intro:
      "The next morning Sam runs into Léa again, this time with her friend Hugo. Things are a bit more relaxed now.",
    dialogue: [
      { speaker: "Léa", fr: "Salut, Sam ! Ça va ?", en: "Hi, Sam! How's it going?" },
      { speaker: "Sam", fr: "Ça va bien, merci. Et toi ?", en: "I'm fine, thanks. And you?" },
      { speaker: "Léa", fr: "Très bien. Je te présente Hugo.", en: "Very well. Let me introduce Hugo." },
      { speaker: "Hugo", fr: "Salut ! Tu es anglais ?", en: "Hi! Are you English?" },
      { speaker: "Sam", fr: "Non, je suis américain.", en: "No, I'm American." },
      { speaker: "Hugo", fr: "Cool ! Tu parles bien français.", en: "Cool! You speak French well." },
      { speaker: "Sam", fr: "Un peu. J'apprends.", en: "A little. I'm learning." },
      { speaker: "Léa", fr: "Bon, on y va. À plus tard !", en: "Right, we're off. See you later!" },
      { speaker: "Sam", fr: "Au revoir ! À demain !", en: "Goodbye! See you tomorrow!" },
    ],
    notes: [
      {
        heading: "Ça va: the all-purpose phrase",
        body:
          "« Ça va ? » with a rising voice is a question (How are you?). « Ça va. » with a falling voice is the answer (I'm fine). You can add « bien », « très bien » or, honestly, « pas mal » (not bad) or « bof » (meh).",
        examples: [
          { fr: "Ça va ?", en: "How are you?" },
          { fr: "Ça va très bien.", en: "I'm very well." },
          { fr: "Pas mal.", en: "Not bad." },
        ],
      },
      {
        heading: "Salut and tu",
        body:
          "Once Léa switches to « tu » and « salut » (hi / bye), Sam can too. Notice « Et toi ? » instead of « Et vous ? ».",
      },
      {
        heading: "Nationalities change with gender",
        body:
          "A man is « américain », « anglais », « canadien »; a woman is « américaine », « anglaise », « canadienne ». The feminine form usually lets you hear the final consonant.",
      },
    ],
    phrases: [
      { fr: "Salut !", en: "Hi! / Bye! (informal)" },
      { fr: "Ça va ?", en: "How are you?" },
      { fr: "Ça va bien, merci.", en: "I'm fine, thanks." },
      { fr: "Et toi ?", en: "And you? (informal)" },
      { fr: "Très bien", en: "Very well" },
      { fr: "Je te présente Hugo.", en: "Let me introduce Hugo." },
      { fr: "Je suis américain.", en: "I'm American. (man)" },
      { fr: "Tu parles français ?", en: "Do you speak French?" },
      { fr: "Un peu", en: "A little" },
      { fr: "À plus tard !", en: "See you later!" },
      { fr: "Au revoir", en: "Goodbye" },
      { fr: "À demain !", en: "See you tomorrow!" },
    ],
  },
  {
    id: "1.3",
    level: 1,
    module: 1,
    kind: "culture",
    title: "Être and the pronouns",
    subtitle: "Language & culture: the verb 'to be'",
    intro:
      "You have already used « je suis » (I am). Here is the whole verb être, the most important verb in French, plus the subject pronouns.",
    notes: [
      {
        heading: "The subject pronouns",
        body:
          "je (I) · tu (you, informal) · il (he / it) · elle (she / it) · on (we, informally / one) · nous (we) · vous (you, polite or plural) · ils (they, masc. or mixed) · elles (they, all feminine). « Je » becomes « j' » before a vowel: j'apprends, j'habite.",
      },
      {
        heading: "Être in the present",
        body:
          "je suis · tu es · il/elle/on est · nous sommes · vous êtes · ils/elles sont. Note that « tu es » and « il est » sound the same.",
        examples: [
          { fr: "Je suis fatigué.", en: "I'm tired." },
          { fr: "Tu es français ?", en: "Are you French?" },
          { fr: "Elle est professeure.", en: "She is a teacher." },
          { fr: "Nous sommes en retard.", en: "We are late." },
          { fr: "Vous êtes très gentil.", en: "You are very kind." },
          { fr: "Ils sont à Paris.", en: "They are in Paris." },
        ],
      },
      {
        heading: "On: the everyday 'we'",
        body:
          "In conversation, French speakers say « on » far more than « nous ». « On y va ? » means « Shall we go? ». It takes the same verb form as il/elle.",
        examples: [
          { fr: "On est contents.", en: "We're happy." },
          { fr: "On y va ?", en: "Shall we go?" },
        ],
      },
      {
        heading: "Jobs without 'a'",
        body:
          "With être and a profession, French drops the article: « Je suis médecin » (I am a doctor), not « Je suis un médecin ».",
        examples: [{ fr: "Je suis étudiant.", en: "I'm a student." }],
      },
    ],
    phrases: [
      { fr: "Je suis fatigué.", en: "I'm tired." },
      { fr: "Tu es français ?", en: "Are you French?" },
      { fr: "Elle est professeure.", en: "She is a teacher." },
      { fr: "Nous sommes en retard.", en: "We are late." },
      { fr: "Vous êtes très gentil.", en: "You are very kind." },
      { fr: "Ils sont à Paris.", en: "They are in Paris." },
      { fr: "On y va ?", en: "Shall we go?" },
      { fr: "Je suis étudiant.", en: "I'm a student." },
    ],
  },
  {
    id: "1.4",
    level: 1,
    module: 1,
    kind: "culture",
    title: "La bise",
    subtitle: "Language & culture: kisses, handshakes and politeness",
    intro:
      "How do French people actually greet each other? The answer depends on who you are, who they are, and even which region you're in.",
    notes: [
      {
        heading: "Handshake or bise?",
        body:
          "In a work setting or when meeting someone formally, a brief handshake is normal. Among friends, family and friends-of-friends, people « se font la bise »: they touch cheeks and make a small kissing sound. Follow the other person's lead.",
      },
      {
        heading: "How many kisses?",
        body:
          "Two is the most common number, but parts of the south can do three and some areas in the west do four. Nobody will mind if you get it wrong. Start with the right cheek.",
      },
      {
        heading: "Magic politeness words",
        body:
          "French service culture leans on a few set phrases. Add « monsieur » or « madame » after bonjour or merci to be extra polite.",
        examples: [
          { fr: "S'il vous plaît", en: "Please (polite)" },
          { fr: "S'il te plaît", en: "Please (informal)" },
          { fr: "Merci beaucoup", en: "Thank you very much" },
          { fr: "De rien", en: "You're welcome" },
          { fr: "Excusez-moi", en: "Excuse me" },
          { fr: "Pardon", en: "Sorry / Pardon me" },
          { fr: "Bonjour, monsieur.", en: "Hello, sir." },
        ],
      },
    ],
    phrases: [
      { fr: "S'il vous plaît", en: "Please (polite)" },
      { fr: "S'il te plaît", en: "Please (informal)" },
      { fr: "Merci beaucoup", en: "Thank you very much" },
      { fr: "De rien", en: "You're welcome" },
      { fr: "Excusez-moi", en: "Excuse me" },
      { fr: "Pardon", en: "Sorry / Pardon me" },
      { fr: "Bonjour, monsieur.", en: "Hello, sir." },
      { fr: "On se fait la bise ?", en: "Shall we greet with a kiss?" },
    ],
  },

  // ───────────── Module 2: Out and about ─────────────
  {
    id: "1.5",
    level: 1,
    module: 2,
    kind: "audio",
    title: "Au café",
    subtitle: "Ordering drinks and paying",
    intro: "Sam and Hugo sit down on a café terrace. Time to order.",
    dialogue: [
      { speaker: "Serveur", fr: "Bonjour, messieurs. Qu'est-ce que je vous sers ?", en: "Hello, gentlemen. What can I get you?" },
      { speaker: "Hugo", fr: "Un café, s'il vous plaît.", en: "An espresso, please." },
      { speaker: "Sam", fr: "Pour moi, un thé au citron.", en: "For me, a lemon tea." },
      { speaker: "Serveur", fr: "Et avec ça ?", en: "Anything else?" },
      { speaker: "Sam", fr: "Un croissant, s'il vous plaît.", en: "A croissant, please." },
      { speaker: "Serveur", fr: "Très bien. Je vous apporte ça.", en: "Very good. I'll bring that for you." },
      { speaker: "Hugo", fr: "L'addition, s'il vous plaît.", en: "The bill, please." },
      { speaker: "Serveur", fr: "Ça fait sept euros cinquante.", en: "That's seven euros fifty." },
      { speaker: "Sam", fr: "Je peux payer par carte ?", en: "Can I pay by card?" },
      { speaker: "Serveur", fr: "Bien sûr.", en: "Of course." },
    ],
    notes: [
      {
        heading: "Un café is an espresso",
        body:
          "Order « un café » and you'll get a small black espresso. For something milky ask for « un café crème » or « un crème ». « Un café allongé » is a longer, diluted coffee.",
      },
      {
        heading: "Un and une",
        body:
          "Every French noun is masculine or feminine. « Un » goes with masculine nouns (un thé, un croissant), « une » with feminine nouns (une bière, une eau minérale). Learn the article with each new word.",
        examples: [
          { fr: "un thé", en: "a tea" },
          { fr: "une bière", en: "a beer" },
          { fr: "une carafe d'eau", en: "a jug of tap water" },
        ],
      },
      {
        heading: "You have to ask for the bill",
        body:
          "Waiters in France won't rush you. When you're ready to leave, catch their eye and ask: « L'addition, s'il vous plaît. » Service is included in the price, so tipping is optional.",
      },
    ],
    phrases: [
      { fr: "Un café, s'il vous plaît.", en: "An espresso, please." },
      { fr: "Pour moi, un thé.", en: "For me, a tea." },
      { fr: "Et avec ça ?", en: "Anything else?" },
      { fr: "Un croissant", en: "A croissant" },
      { fr: "Une carafe d'eau", en: "A jug of tap water" },
      { fr: "L'addition, s'il vous plaît.", en: "The bill, please." },
      { fr: "Ça fait combien ?", en: "How much is it?" },
      { fr: "Je peux payer par carte ?", en: "Can I pay by card?" },
      { fr: "Bien sûr", en: "Of course" },
      { fr: "Un café crème", en: "A coffee with milk" },
    ],
  },
  {
    id: "1.6",
    level: 1,
    module: 2,
    kind: "audio",
    title: "Où est la gare ?",
    subtitle: "Asking for and understanding directions",
    intro: "Sam needs to catch a train but can't find the station. He stops a passer-by.",
    dialogue: [
      { speaker: "Sam", fr: "Excusez-moi, madame. Où est la gare, s'il vous plaît ?", en: "Excuse me, ma'am. Where is the station, please?" },
      { speaker: "Passante", fr: "La gare ? C'est tout droit, puis à gauche.", en: "The station? It's straight ahead, then left." },
      { speaker: "Sam", fr: "C'est loin ?", en: "Is it far?" },
      { speaker: "Passante", fr: "Non, c'est à dix minutes à pied.", en: "No, it's ten minutes on foot." },
      { speaker: "Sam", fr: "Il y a une pharmacie près d'ici ?", en: "Is there a pharmacy near here?" },
      { speaker: "Passante", fr: "Oui, à droite, à côté de la banque.", en: "Yes, on the right, next to the bank." },
      { speaker: "Sam", fr: "Pardon, vous pouvez répéter plus lentement ?", en: "Sorry, could you repeat more slowly?" },
      { speaker: "Passante", fr: "À droite... à côté de la banque.", en: "On the right... next to the bank." },
      { speaker: "Sam", fr: "Merci beaucoup !", en: "Thank you very much!" },
    ],
    notes: [
      {
        heading: "Direction words",
        body: "These four phrases cover most directions you'll ever be given.",
        examples: [
          { fr: "tout droit", en: "straight ahead" },
          { fr: "à gauche", en: "on / to the left" },
          { fr: "à droite", en: "on / to the right" },
          { fr: "au coin de la rue", en: "at the corner of the street" },
        ],
      },
      {
        heading: "Il y a: there is, there are",
        body:
          "« Il y a » never changes, whether one thing or many follow. As a question, just raise your voice: « Il y a un métro ici ? ».",
      },
      {
        heading: "Le, la, les",
        body:
          "'The' is « le » for masculine, « la » for feminine, « l' » before a vowel, and « les » for any plural: le métro, la gare, l'hôtel, les toilettes.",
      },
    ],
    phrases: [
      { fr: "Où est la gare ?", en: "Where is the station?" },
      { fr: "C'est tout droit.", en: "It's straight ahead." },
      { fr: "à gauche", en: "on the left" },
      { fr: "à droite", en: "on the right" },
      { fr: "C'est loin ?", en: "Is it far?" },
      { fr: "à dix minutes à pied", en: "ten minutes on foot" },
      { fr: "Il y a une pharmacie près d'ici ?", en: "Is there a pharmacy near here?" },
      { fr: "à côté de la banque", en: "next to the bank" },
      { fr: "Vous pouvez répéter ?", en: "Could you repeat?" },
      { fr: "plus lentement", en: "more slowly" },
    ],
  },
  {
    id: "1.7",
    level: 1,
    module: 2,
    kind: "culture",
    title: "Les nombres",
    subtitle: "Language & culture: numbers, prices and time",
    intro:
      "French numbers are logical up to sixty… then they get creative. Here's how to count, read prices and tell the time.",
    notes: [
      {
        heading: "0 to 20",
        body:
          "zéro, un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze, treize, quatorze, quinze, seize, dix-sept, dix-huit, dix-neuf, vingt.",
      },
      {
        heading: "Tens",
        body:
          "trente (30), quarante (40), cinquante (50), soixante (60). Then 70 is « soixante-dix » (sixty-ten), 80 is « quatre-vingts » (four twenties) and 90 is « quatre-vingt-dix » (four twenties ten). In Belgium and Switzerland you'll hear septante and nonante instead.",
        examples: [
          { fr: "vingt et un", en: "21" },
          { fr: "soixante-quinze", en: "75" },
          { fr: "quatre-vingt-dix-neuf", en: "99" },
          { fr: "cent", en: "100" },
        ],
      },
      {
        heading: "Prices",
        body:
          "Prices are read with the euros first then the cents: 7,50 € is « sept euros cinquante ». French writes a comma where English writes a decimal point.",
        examples: [{ fr: "douze euros quatre-vingts", en: "€12.80" }],
      },
      {
        heading: "Telling the time",
        body:
          "« Il est quelle heure ? » asks the time. The 24-hour clock is standard for timetables: 18 h 30 is « dix-huit heures trente ».",
        examples: [
          { fr: "Il est quelle heure ?", en: "What time is it?" },
          { fr: "Il est trois heures.", en: "It's three o'clock." },
          { fr: "Il est midi.", en: "It's noon." },
          { fr: "à huit heures et demie", en: "at half past eight" },
        ],
      },
    ],
    phrases: [
      { fr: "vingt et un", en: "21" },
      { fr: "soixante-quinze", en: "75" },
      { fr: "quatre-vingt-dix-neuf", en: "99" },
      { fr: "cent", en: "100" },
      { fr: "douze euros quatre-vingts", en: "€12.80" },
      { fr: "Il est quelle heure ?", en: "What time is it?" },
      { fr: "Il est trois heures.", en: "It's three o'clock." },
      { fr: "Il est midi.", en: "It's noon." },
      { fr: "à huit heures et demie", en: "at half past eight" },
    ],
  },
  {
    id: "1.8",
    level: 1,
    module: 2,
    kind: "audio",
    title: "À la boulangerie",
    subtitle: "Buying bread and quantities",
    intro: "On Sunday morning Sam goes to the bakery on the corner. There's a queue.",
    dialogue: [
      { speaker: "Boulangère", fr: "Bonjour, monsieur. Vous désirez ?", en: "Hello, sir. What would you like?" },
      { speaker: "Sam", fr: "Bonjour. Une baguette, s'il vous plaît.", en: "Hello. A baguette, please." },
      { speaker: "Boulangère", fr: "Bien cuite ou pas trop cuite ?", en: "Well done or not too done?" },
      { speaker: "Sam", fr: "Pas trop cuite. Et deux pains au chocolat.", en: "Not too done. And two chocolate croissants." },
      { speaker: "Boulangère", fr: "Ce sera tout ?", en: "Will that be all?" },
      { speaker: "Sam", fr: "Je voudrais aussi une tarte aux pommes.", en: "I'd also like an apple tart." },
      { speaker: "Boulangère", fr: "Une petite ou une grande ?", en: "A small one or a big one?" },
      { speaker: "Sam", fr: "Une petite, c'est pour deux personnes.", en: "A small one, it's for two people." },
      { speaker: "Boulangère", fr: "Voilà. Ça fait neuf euros vingt.", en: "Here you go. That's nine euros twenty." },
      { speaker: "Sam", fr: "Voilà. Merci, bon dimanche !", en: "Here you are. Thanks, have a good Sunday!" },
    ],
    notes: [
      {
        heading: "Je voudrais",
        body:
          "« Je voudrais » (I would like) is the polite way to ask for anything. It is softer than « je veux » (I want), which can sound demanding.",
        examples: [
          { fr: "Je voudrais un croissant.", en: "I'd like a croissant." },
          { fr: "Je voudrais réserver une table.", en: "I'd like to book a table." },
        ],
      },
      {
        heading: "Making plurals",
        body:
          "Most nouns add a silent -s in the plural: un croissant, deux croissants. You hear the plural in the article, not the noun: le pain / les pains.",
      },
      {
        heading: "The daily baguette",
        body:
          "Many French families still buy fresh bread every day. A « tradition » is a baguette made to a stricter traditional recipe, often a little more expensive and crustier.",
      },
    ],
    phrases: [
      { fr: "Vous désirez ?", en: "What would you like?" },
      { fr: "Une baguette, s'il vous plaît.", en: "A baguette, please." },
      { fr: "deux pains au chocolat", en: "two chocolate croissants" },
      { fr: "Ce sera tout ?", en: "Will that be all?" },
      { fr: "Je voudrais une tarte aux pommes.", en: "I'd like an apple tart." },
      { fr: "Une petite ou une grande ?", en: "A small one or a big one?" },
      { fr: "pour deux personnes", en: "for two people" },
      { fr: "Voilà", en: "Here you are / There you go" },
      { fr: "Bon dimanche !", en: "Have a good Sunday!" },
    ],
  },

  // ───────────── Module 3: Everyday life ─────────────
  {
    id: "1.9",
    level: 1,
    module: 3,
    kind: "audio",
    title: "Ma famille",
    subtitle: "Talking about family and age",
    intro: "Léa invites Sam in for a drink and shows him some photos on the fridge.",
    dialogue: [
      { speaker: "Sam", fr: "C'est ta famille sur la photo ?", en: "Is that your family in the photo?" },
      { speaker: "Léa", fr: "Oui. Voici mes parents et mon frère, Antoine.", en: "Yes. Here are my parents and my brother, Antoine." },
      { speaker: "Sam", fr: "Il a quel âge ?", en: "How old is he?" },
      { speaker: "Léa", fr: "Il a vingt-cinq ans. Il habite à Marseille.", en: "He's twenty-five. He lives in Marseille." },
      { speaker: "Sam", fr: "Et cette petite fille ?", en: "And this little girl?" },
      { speaker: "Léa", fr: "C'est ma nièce, Chloé. Elle a quatre ans.", en: "That's my niece, Chloé. She's four." },
      { speaker: "Léa", fr: "Tu as des frères et sœurs ?", en: "Do you have brothers and sisters?" },
      { speaker: "Sam", fr: "J'ai une sœur. Je n'ai pas de frère.", en: "I have a sister. I don't have a brother." },
      { speaker: "Léa", fr: "Elle est plus âgée que toi ?", en: "Is she older than you?" },
      { speaker: "Sam", fr: "Non, elle est plus jeune.", en: "No, she's younger." },
    ],
    notes: [
      {
        heading: "Age uses avoir",
        body:
          "In French you 'have' years: « J'ai trente ans » (I am thirty). Never use être for age. Ask « Tu as quel âge ? » or politely « Vous avez quel âge ? ».",
      },
      {
        heading: "Avoir in the present",
        body: "j'ai · tu as · il/elle/on a · nous avons · vous avez · ils/elles ont.",
      },
      {
        heading: "Mon, ma, mes",
        body:
          "'My' agrees with the thing owned, not the owner: mon frère, ma sœur, mes parents. Before a feminine word starting with a vowel use mon: mon amie.",
        examples: [
          { fr: "mon père", en: "my father" },
          { fr: "ma mère", en: "my mother" },
          { fr: "mes grands-parents", en: "my grandparents" },
        ],
      },
      {
        heading: "Negatives with ne… pas",
        body:
          "Wrap the verb: « Je ne parle pas », « Je n'ai pas ». After a negative, un/une/des become « de »: « Je n'ai pas de frère ».",
      },
    ],
    phrases: [
      { fr: "Voici mes parents.", en: "Here are my parents." },
      { fr: "mon frère", en: "my brother" },
      { fr: "ma sœur", en: "my sister" },
      { fr: "Il a quel âge ?", en: "How old is he?" },
      { fr: "Il a vingt-cinq ans.", en: "He's twenty-five." },
      { fr: "Tu as des frères et sœurs ?", en: "Do you have brothers and sisters?" },
      { fr: "Je n'ai pas de frère.", en: "I don't have a brother." },
      { fr: "plus jeune", en: "younger" },
      { fr: "plus âgé", en: "older" },
      { fr: "ma nièce", en: "my niece" },
    ],
  },
  {
    id: "1.10",
    level: 1,
    module: 3,
    kind: "audio",
    title: "Qu'est-ce que tu aimes ?",
    subtitle: "Likes, dislikes and free time",
    intro: "Hugo wants to know what Sam does at the weekend.",
    dialogue: [
      { speaker: "Hugo", fr: "Qu'est-ce que tu fais le week-end ?", en: "What do you do at the weekend?" },
      { speaker: "Sam", fr: "J'aime faire du vélo et lire.", en: "I like cycling and reading." },
      { speaker: "Hugo", fr: "Tu aimes le sport ?", en: "Do you like sport?" },
      { speaker: "Sam", fr: "Oui, j'adore le football. Et toi ?", en: "Yes, I love football. And you?" },
      { speaker: "Hugo", fr: "Moi, je préfère la musique. Je joue de la guitare.", en: "Me, I prefer music. I play the guitar." },
      { speaker: "Sam", fr: "Génial ! Tu aimes le jazz ?", en: "Great! Do you like jazz?" },
      { speaker: "Hugo", fr: "Pas trop. Je déteste le jazz, en fait !", en: "Not really. I actually hate jazz!" },
      { speaker: "Sam", fr: "Ah bon ? Moi, j'aime bien.", en: "Really? I quite like it." },
      { speaker: "Hugo", fr: "On va au concert samedi ? C'est du rock.", en: "Shall we go to the concert on Saturday? It's rock." },
      { speaker: "Sam", fr: "D'accord, avec plaisir !", en: "OK, with pleasure!" },
    ],
    notes: [
      {
        heading: "The scale of liking",
        body: "From hate to love, plus « aimer bien » which means 'to quite like'.",
        examples: [
          { fr: "Je déteste", en: "I hate" },
          { fr: "Je n'aime pas", en: "I don't like" },
          { fr: "J'aime bien", en: "I quite like" },
          { fr: "J'aime", en: "I like / love" },
          { fr: "J'adore", en: "I love" },
        ],
      },
      {
        heading: "Always use 'the'",
        body:
          "After verbs of liking, French uses le/la/les even for general things: « J'aime le chocolat » (I like chocolate), « Je déteste les araignées » (I hate spiders).",
      },
      {
        heading: "-er verbs",
        body:
          "Aimer, parler, habiter and most French verbs follow one pattern: j'aime, tu aimes, il aime, nous aimons, vous aimez, ils aiment. The -e, -es, -ent endings are all silent.",
      },
    ],
    phrases: [
      { fr: "Qu'est-ce que tu fais le week-end ?", en: "What do you do at the weekend?" },
      { fr: "J'aime lire.", en: "I like reading." },
      { fr: "faire du vélo", en: "to go cycling" },
      { fr: "J'adore le football.", en: "I love football." },
      { fr: "Je préfère la musique.", en: "I prefer music." },
      { fr: "Je joue de la guitare.", en: "I play the guitar." },
      { fr: "Je déteste le jazz.", en: "I hate jazz." },
      { fr: "Ah bon ?", en: "Really?" },
      { fr: "D'accord", en: "OK / Agreed" },
      { fr: "Avec plaisir !", en: "With pleasure!" },
    ],
  },
  {
    id: "1.11",
    level: 1,
    module: 3,
    kind: "culture",
    title: "Asking questions",
    subtitle: "Language & culture: three ways to ask",
    intro:
      "French has three ways to turn a sentence into a question, from casual to formal. You only need the first one to get by, but you'll hear all three.",
    notes: [
      {
        heading: "1. Just raise your voice",
        body:
          "The most common way in speech. Say a normal sentence and let your voice rise at the end.",
        examples: [{ fr: "Tu es prêt ?", en: "Are you ready?" }],
      },
      {
        heading: "2. Add est-ce que",
        body: "Put « est-ce que » at the start. Neutral and always correct.",
        examples: [{ fr: "Est-ce que tu es prêt ?", en: "Are you ready?" }],
      },
      {
        heading: "3. Flip the verb",
        body:
          "Swap the pronoun and verb with a hyphen. This is more formal and common in writing.",
        examples: [{ fr: "Es-tu prêt ?", en: "Are you ready?" }],
      },
      {
        heading: "Question words",
        body:
          "où (where) · quand (when) · comment (how) · pourquoi (why) · qui (who) · quoi / qu'est-ce que (what) · combien (how much / many) · quel / quelle (which).",
        examples: [
          { fr: "Comment tu t'appelles ?", en: "What's your name?" },
          { fr: "Pourquoi ?", en: "Why?" },
          { fr: "Quand est-ce que tu pars ?", en: "When are you leaving?" },
          { fr: "Qui est-ce ?", en: "Who is it?" },
          { fr: "Combien ça coûte ?", en: "How much does it cost?" },
        ],
      },
    ],
    phrases: [
      { fr: "Tu es prêt ?", en: "Are you ready?" },
      { fr: "Est-ce que tu es prêt ?", en: "Are you ready?" },
      { fr: "Comment tu t'appelles ?", en: "What's your name?" },
      { fr: "Pourquoi ?", en: "Why?" },
      { fr: "Quand est-ce que tu pars ?", en: "When are you leaving?" },
      { fr: "Qui est-ce ?", en: "Who is it?" },
      { fr: "Combien ça coûte ?", en: "How much does it cost?" },
      { fr: "Où es-tu ?", en: "Where are you?" },
    ],
  },
  {
    id: "1.12",
    level: 1,
    module: 3,
    kind: "culture",
    title: "Les repas",
    subtitle: "Language & culture: French mealtimes",
    intro: "Meals are a big deal in France. Knowing the rhythm of the day will help you fit right in.",
    notes: [
      {
        heading: "Three meals and a snack",
        body:
          "« Le petit-déjeuner » (breakfast) is light: bread, butter, jam, coffee. « Le déjeuner » (lunch) is around 12:30 and can be a full meal. Children have « le goûter » (afternoon snack) around 4 pm. « Le dîner » (dinner) is around 8 pm.",
      },
      {
        heading: "Courses",
        body:
          "A traditional meal goes « l'entrée » (starter — not the main course!), « le plat principal » (main), then « le fromage » and/or « le dessert ». A « menu » in a restaurant is a fixed-price set meal; the list of dishes is « la carte ».",
      },
      {
        heading: "Table phrases",
        body: "Before eating, someone will say « Bon appétit ! » and you reply the same.",
        examples: [
          { fr: "Bon appétit !", en: "Enjoy your meal!" },
          { fr: "C'est délicieux.", en: "It's delicious." },
          { fr: "J'ai faim.", en: "I'm hungry." },
          { fr: "J'ai soif.", en: "I'm thirsty." },
          { fr: "Santé !", en: "Cheers!" },
          { fr: "Je n'ai plus faim, merci.", en: "I'm full, thank you." },
        ],
      },
    ],
    phrases: [
      { fr: "le petit-déjeuner", en: "breakfast" },
      { fr: "le déjeuner", en: "lunch" },
      { fr: "le dîner", en: "dinner" },
      { fr: "Bon appétit !", en: "Enjoy your meal!" },
      { fr: "C'est délicieux.", en: "It's delicious." },
      { fr: "J'ai faim.", en: "I'm hungry." },
      { fr: "J'ai soif.", en: "I'm thirsty." },
      { fr: "Santé !", en: "Cheers!" },
      { fr: "Je n'ai plus faim, merci.", en: "I'm full, thank you." },
    ],
  },
];
