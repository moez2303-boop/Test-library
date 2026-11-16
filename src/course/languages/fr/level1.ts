import type { Lesson } from "../types";

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
      { speaker: "Léa", text: "Bonjour !", en: "Hello!" },
      { speaker: "Sam", text: "Bonjour, madame.", en: "Hello, ma'am." },
      { speaker: "Léa", text: "Je m'appelle Léa. Et vous ?", en: "My name is Léa. And you?" },
      { speaker: "Sam", text: "Je m'appelle Sam.", en: "My name is Sam." },
      { speaker: "Léa", text: "Enchantée, Sam.", en: "Nice to meet you, Sam." },
      { speaker: "Sam", text: "Enchanté. Vous habitez ici ?", en: "Nice to meet you. Do you live here?" },
      { speaker: "Léa", text: "Oui, au deuxième étage.", en: "Yes, on the second floor." },
      { speaker: "Sam", text: "Moi, au troisième.", en: "Me, on the third." },
      { speaker: "Léa", text: "Bienvenue ! Bonne journée !", en: "Welcome! Have a nice day!" },
      { speaker: "Sam", text: "Merci, vous aussi.", en: "Thank you, you too." },
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
          { text: "Enchanté.", en: "Nice to meet you. (man speaking)" },
          { text: "Enchantée.", en: "Nice to meet you. (woman speaking)" },
        ],
      },
      {
        heading: "Vous, the polite 'you'",
        body:
          "With strangers and adults you don't know, use « vous ». Save « tu » for friends, family, children and pets. When in doubt, use « vous ».",
      },
    ],
    phrases: [
      { text: "Bonjour", en: "Hello / Good morning" },
      { text: "Bonsoir", en: "Good evening" },
      { text: "Je m'appelle Sam.", en: "My name is Sam.", note: "lit. I call myself Sam" },
      { text: "Et vous ?", en: "And you? (polite)" },
      { text: "Enchanté", en: "Nice to meet you" },
      { text: "Vous habitez ici ?", en: "Do you live here?" },
      { text: "Oui", en: "Yes" },
      { text: "Non", en: "No" },
      { text: "Bienvenue !", en: "Welcome!" },
      { text: "Bonne journée !", en: "Have a nice day!" },
      { text: "Merci", en: "Thank you" },
      { text: "Vous aussi", en: "You too" },
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
      { speaker: "Léa", text: "Salut, Sam ! Ça va ?", en: "Hi, Sam! How's it going?" },
      { speaker: "Sam", text: "Ça va bien, merci. Et toi ?", en: "I'm fine, thanks. And you?" },
      { speaker: "Léa", text: "Très bien. Je te présente Hugo.", en: "Very well. Let me introduce Hugo." },
      { speaker: "Hugo", text: "Salut ! Tu es anglais ?", en: "Hi! Are you English?" },
      { speaker: "Sam", text: "Non, je suis américain.", en: "No, I'm American." },
      { speaker: "Hugo", text: "Cool ! Tu parles bien français.", en: "Cool! You speak French well." },
      { speaker: "Sam", text: "Un peu. J'apprends.", en: "A little. I'm learning." },
      { speaker: "Léa", text: "Bon, on y va. À plus tard !", en: "Right, we're off. See you later!" },
      { speaker: "Sam", text: "Au revoir ! À demain !", en: "Goodbye! See you tomorrow!" },
    ],
    notes: [
      {
        heading: "Ça va: the all-purpose phrase",
        body:
          "« Ça va ? » with a rising voice is a question (How are you?). « Ça va. » with a falling voice is the answer (I'm fine). You can add « bien », « très bien » or, honestly, « pas mal » (not bad) or « bof » (meh).",
        examples: [
          { text: "Ça va ?", en: "How are you?" },
          { text: "Ça va très bien.", en: "I'm very well." },
          { text: "Pas mal.", en: "Not bad." },
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
      { text: "Salut !", en: "Hi! / Bye! (informal)" },
      { text: "Ça va ?", en: "How are you?" },
      { text: "Ça va bien, merci.", en: "I'm fine, thanks." },
      { text: "Et toi ?", en: "And you? (informal)" },
      { text: "Très bien", en: "Very well" },
      { text: "Je te présente Hugo.", en: "Let me introduce Hugo." },
      { text: "Je suis américain.", en: "I'm American. (man)" },
      { text: "Tu parles français ?", en: "Do you speak French?" },
      { text: "Un peu", en: "A little" },
      { text: "À plus tard !", en: "See you later!" },
      { text: "Au revoir", en: "Goodbye" },
      { text: "À demain !", en: "See you tomorrow!" },
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
          { text: "Je suis fatigué.", en: "I'm tired." },
          { text: "Tu es français ?", en: "Are you French?" },
          { text: "Elle est professeure.", en: "She is a teacher." },
          { text: "Nous sommes en retard.", en: "We are late." },
          { text: "Vous êtes très gentil.", en: "You are very kind." },
          { text: "Ils sont à Paris.", en: "They are in Paris." },
        ],
      },
      {
        heading: "On: the everyday 'we'",
        body:
          "In conversation, French speakers say « on » far more than « nous ». « On y va ? » means « Shall we go? ». It takes the same verb form as il/elle.",
        examples: [
          { text: "On est contents.", en: "We're happy." },
          { text: "On y va ?", en: "Shall we go?" },
        ],
      },
      {
        heading: "Jobs without 'a'",
        body:
          "With être and a profession, French drops the article: « Je suis médecin » (I am a doctor), not « Je suis un médecin ».",
        examples: [{ text: "Je suis étudiant.", en: "I'm a student." }],
      },
    ],
    phrases: [
      { text: "Je suis fatigué.", en: "I'm tired." },
      { text: "Tu es français ?", en: "Are you French?" },
      { text: "Elle est professeure.", en: "She is a teacher." },
      { text: "Nous sommes en retard.", en: "We are late." },
      { text: "Vous êtes très gentil.", en: "You are very kind." },
      { text: "Ils sont à Paris.", en: "They are in Paris." },
      { text: "On y va ?", en: "Shall we go?" },
      { text: "Je suis étudiant.", en: "I'm a student." },
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
          { text: "S'il vous plaît", en: "Please (polite)" },
          { text: "S'il te plaît", en: "Please (informal)" },
          { text: "Merci beaucoup", en: "Thank you very much" },
          { text: "De rien", en: "You're welcome" },
          { text: "Excusez-moi", en: "Excuse me" },
          { text: "Pardon", en: "Sorry / Pardon me" },
          { text: "Bonjour, monsieur.", en: "Hello, sir." },
        ],
      },
    ],
    phrases: [
      { text: "S'il vous plaît", en: "Please (polite)" },
      { text: "S'il te plaît", en: "Please (informal)" },
      { text: "Merci beaucoup", en: "Thank you very much" },
      { text: "De rien", en: "You're welcome" },
      { text: "Excusez-moi", en: "Excuse me" },
      { text: "Pardon", en: "Sorry / Pardon me" },
      { text: "Bonjour, monsieur.", en: "Hello, sir." },
      { text: "On se fait la bise ?", en: "Shall we greet with a kiss?" },
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
      { speaker: "Serveur", text: "Bonjour, messieurs. Qu'est-ce que je vous sers ?", en: "Hello, gentlemen. What can I get you?" },
      { speaker: "Hugo", text: "Un café, s'il vous plaît.", en: "An espresso, please." },
      { speaker: "Sam", text: "Pour moi, un thé au citron.", en: "For me, a lemon tea." },
      { speaker: "Serveur", text: "Et avec ça ?", en: "Anything else?" },
      { speaker: "Sam", text: "Un croissant, s'il vous plaît.", en: "A croissant, please." },
      { speaker: "Serveur", text: "Très bien. Je vous apporte ça.", en: "Very good. I'll bring that for you." },
      { speaker: "Hugo", text: "L'addition, s'il vous plaît.", en: "The bill, please." },
      { speaker: "Serveur", text: "Ça fait sept euros cinquante.", en: "That's seven euros fifty." },
      { speaker: "Sam", text: "Je peux payer par carte ?", en: "Can I pay by card?" },
      { speaker: "Serveur", text: "Bien sûr.", en: "Of course." },
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
          { text: "un thé", en: "a tea" },
          { text: "une bière", en: "a beer" },
          { text: "une carafe d'eau", en: "a jug of tap water" },
        ],
      },
      {
        heading: "You have to ask for the bill",
        body:
          "Waiters in France won't rush you. When you're ready to leave, catch their eye and ask: « L'addition, s'il vous plaît. » Service is included in the price, so tipping is optional.",
      },
    ],
    phrases: [
      { text: "Un café, s'il vous plaît.", en: "An espresso, please." },
      { text: "Pour moi, un thé.", en: "For me, a tea." },
      { text: "Et avec ça ?", en: "Anything else?" },
      { text: "Un croissant", en: "A croissant" },
      { text: "Une carafe d'eau", en: "A jug of tap water" },
      { text: "L'addition, s'il vous plaît.", en: "The bill, please." },
      { text: "Ça fait combien ?", en: "How much is it?" },
      { text: "Je peux payer par carte ?", en: "Can I pay by card?" },
      { text: "Bien sûr", en: "Of course" },
      { text: "Un café crème", en: "A coffee with milk" },
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
      { speaker: "Sam", text: "Excusez-moi, madame. Où est la gare, s'il vous plaît ?", en: "Excuse me, ma'am. Where is the station, please?" },
      { speaker: "Passante", text: "La gare ? C'est tout droit, puis à gauche.", en: "The station? It's straight ahead, then left." },
      { speaker: "Sam", text: "C'est loin ?", en: "Is it far?" },
      { speaker: "Passante", text: "Non, c'est à dix minutes à pied.", en: "No, it's ten minutes on foot." },
      { speaker: "Sam", text: "Il y a une pharmacie près d'ici ?", en: "Is there a pharmacy near here?" },
      { speaker: "Passante", text: "Oui, à droite, à côté de la banque.", en: "Yes, on the right, next to the bank." },
      { speaker: "Sam", text: "Pardon, vous pouvez répéter plus lentement ?", en: "Sorry, could you repeat more slowly?" },
      { speaker: "Passante", text: "À droite... à côté de la banque.", en: "On the right... next to the bank." },
      { speaker: "Sam", text: "Merci beaucoup !", en: "Thank you very much!" },
    ],
    notes: [
      {
        heading: "Direction words",
        body: "These four phrases cover most directions you'll ever be given.",
        examples: [
          { text: "tout droit", en: "straight ahead" },
          { text: "à gauche", en: "on / to the left" },
          { text: "à droite", en: "on / to the right" },
          { text: "au coin de la rue", en: "at the corner of the street" },
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
      { text: "Où est la gare ?", en: "Where is the station?" },
      { text: "C'est tout droit.", en: "It's straight ahead." },
      { text: "à gauche", en: "on the left" },
      { text: "à droite", en: "on the right" },
      { text: "C'est loin ?", en: "Is it far?" },
      { text: "à dix minutes à pied", en: "ten minutes on foot" },
      { text: "Il y a une pharmacie près d'ici ?", en: "Is there a pharmacy near here?" },
      { text: "à côté de la banque", en: "next to the bank" },
      { text: "Vous pouvez répéter ?", en: "Could you repeat?" },
      { text: "plus lentement", en: "more slowly" },
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
          { text: "vingt et un", en: "21" },
          { text: "soixante-quinze", en: "75" },
          { text: "quatre-vingt-dix-neuf", en: "99" },
          { text: "cent", en: "100" },
        ],
      },
      {
        heading: "Prices",
        body:
          "Prices are read with the euros first then the cents: 7,50 € is « sept euros cinquante ». French writes a comma where English writes a decimal point.",
        examples: [{ text: "douze euros quatre-vingts", en: "€12.80" }],
      },
      {
        heading: "Telling the time",
        body:
          "« Il est quelle heure ? » asks the time. The 24-hour clock is standard for timetables: 18 h 30 is « dix-huit heures trente ».",
        examples: [
          { text: "Il est quelle heure ?", en: "What time is it?" },
          { text: "Il est trois heures.", en: "It's three o'clock." },
          { text: "Il est midi.", en: "It's noon." },
          { text: "à huit heures et demie", en: "at half past eight" },
        ],
      },
    ],
    phrases: [
      { text: "vingt et un", en: "21" },
      { text: "soixante-quinze", en: "75" },
      { text: "quatre-vingt-dix-neuf", en: "99" },
      { text: "cent", en: "100" },
      { text: "douze euros quatre-vingts", en: "€12.80" },
      { text: "Il est quelle heure ?", en: "What time is it?" },
      { text: "Il est trois heures.", en: "It's three o'clock." },
      { text: "Il est midi.", en: "It's noon." },
      { text: "à huit heures et demie", en: "at half past eight" },
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
      { speaker: "Boulangère", text: "Bonjour, monsieur. Vous désirez ?", en: "Hello, sir. What would you like?" },
      { speaker: "Sam", text: "Bonjour. Une baguette, s'il vous plaît.", en: "Hello. A baguette, please." },
      { speaker: "Boulangère", text: "Bien cuite ou pas trop cuite ?", en: "Well done or not too done?" },
      { speaker: "Sam", text: "Pas trop cuite. Et deux pains au chocolat.", en: "Not too done. And two chocolate croissants." },
      { speaker: "Boulangère", text: "Ce sera tout ?", en: "Will that be all?" },
      { speaker: "Sam", text: "Je voudrais aussi une tarte aux pommes.", en: "I'd also like an apple tart." },
      { speaker: "Boulangère", text: "Une petite ou une grande ?", en: "A small one or a big one?" },
      { speaker: "Sam", text: "Une petite, c'est pour deux personnes.", en: "A small one, it's for two people." },
      { speaker: "Boulangère", text: "Voilà. Ça fait neuf euros vingt.", en: "Here you go. That's nine euros twenty." },
      { speaker: "Sam", text: "Voilà. Merci, bon dimanche !", en: "Here you are. Thanks, have a good Sunday!" },
    ],
    notes: [
      {
        heading: "Je voudrais",
        body:
          "« Je voudrais » (I would like) is the polite way to ask for anything. It is softer than « je veux » (I want), which can sound demanding.",
        examples: [
          { text: "Je voudrais un croissant.", en: "I'd like a croissant." },
          { text: "Je voudrais réserver une table.", en: "I'd like to book a table." },
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
      { text: "Vous désirez ?", en: "What would you like?" },
      { text: "Une baguette, s'il vous plaît.", en: "A baguette, please." },
      { text: "deux pains au chocolat", en: "two chocolate croissants" },
      { text: "Ce sera tout ?", en: "Will that be all?" },
      { text: "Je voudrais une tarte aux pommes.", en: "I'd like an apple tart." },
      { text: "Une petite ou une grande ?", en: "A small one or a big one?" },
      { text: "pour deux personnes", en: "for two people" },
      { text: "Voilà", en: "Here you are / There you go" },
      { text: "Bon dimanche !", en: "Have a good Sunday!" },
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
      { speaker: "Sam", text: "C'est ta famille sur la photo ?", en: "Is that your family in the photo?" },
      { speaker: "Léa", text: "Oui. Voici mes parents et mon frère, Antoine.", en: "Yes. Here are my parents and my brother, Antoine." },
      { speaker: "Sam", text: "Il a quel âge ?", en: "How old is he?" },
      { speaker: "Léa", text: "Il a vingt-cinq ans. Il habite à Marseille.", en: "He's twenty-five. He lives in Marseille." },
      { speaker: "Sam", text: "Et cette petite fille ?", en: "And this little girl?" },
      { speaker: "Léa", text: "C'est ma nièce, Chloé. Elle a quatre ans.", en: "That's my niece, Chloé. She's four." },
      { speaker: "Léa", text: "Tu as des frères et sœurs ?", en: "Do you have brothers and sisters?" },
      { speaker: "Sam", text: "J'ai une sœur. Je n'ai pas de frère.", en: "I have a sister. I don't have a brother." },
      { speaker: "Léa", text: "Elle est plus âgée que toi ?", en: "Is she older than you?" },
      { speaker: "Sam", text: "Non, elle est plus jeune.", en: "No, she's younger." },
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
          { text: "mon père", en: "my father" },
          { text: "ma mère", en: "my mother" },
          { text: "mes grands-parents", en: "my grandparents" },
        ],
      },
      {
        heading: "Negatives with ne… pas",
        body:
          "Wrap the verb: « Je ne parle pas », « Je n'ai pas ». After a negative, un/une/des become « de »: « Je n'ai pas de frère ».",
      },
    ],
    phrases: [
      { text: "Voici mes parents.", en: "Here are my parents." },
      { text: "mon frère", en: "my brother" },
      { text: "ma sœur", en: "my sister" },
      { text: "Il a quel âge ?", en: "How old is he?" },
      { text: "Il a vingt-cinq ans.", en: "He's twenty-five." },
      { text: "Tu as des frères et sœurs ?", en: "Do you have brothers and sisters?" },
      { text: "Je n'ai pas de frère.", en: "I don't have a brother." },
      { text: "plus jeune", en: "younger" },
      { text: "plus âgé", en: "older" },
      { text: "ma nièce", en: "my niece" },
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
      { speaker: "Hugo", text: "Qu'est-ce que tu fais le week-end ?", en: "What do you do at the weekend?" },
      { speaker: "Sam", text: "J'aime faire du vélo et lire.", en: "I like cycling and reading." },
      { speaker: "Hugo", text: "Tu aimes le sport ?", en: "Do you like sport?" },
      { speaker: "Sam", text: "Oui, j'adore le football. Et toi ?", en: "Yes, I love football. And you?" },
      { speaker: "Hugo", text: "Moi, je préfère la musique. Je joue de la guitare.", en: "Me, I prefer music. I play the guitar." },
      { speaker: "Sam", text: "Génial ! Tu aimes le jazz ?", en: "Great! Do you like jazz?" },
      { speaker: "Hugo", text: "Pas trop. Je déteste le jazz, en fait !", en: "Not really. I actually hate jazz!" },
      { speaker: "Sam", text: "Ah bon ? Moi, j'aime bien.", en: "Really? I quite like it." },
      { speaker: "Hugo", text: "On va au concert samedi ? C'est du rock.", en: "Shall we go to the concert on Saturday? It's rock." },
      { speaker: "Sam", text: "D'accord, avec plaisir !", en: "OK, with pleasure!" },
    ],
    notes: [
      {
        heading: "The scale of liking",
        body: "From hate to love, plus « aimer bien » which means 'to quite like'.",
        examples: [
          { text: "Je déteste", en: "I hate" },
          { text: "Je n'aime pas", en: "I don't like" },
          { text: "J'aime bien", en: "I quite like" },
          { text: "J'aime", en: "I like / love" },
          { text: "J'adore", en: "I love" },
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
      { text: "Qu'est-ce que tu fais le week-end ?", en: "What do you do at the weekend?" },
      { text: "J'aime lire.", en: "I like reading." },
      { text: "faire du vélo", en: "to go cycling" },
      { text: "J'adore le football.", en: "I love football." },
      { text: "Je préfère la musique.", en: "I prefer music." },
      { text: "Je joue de la guitare.", en: "I play the guitar." },
      { text: "Je déteste le jazz.", en: "I hate jazz." },
      { text: "Ah bon ?", en: "Really?" },
      { text: "D'accord", en: "OK / Agreed" },
      { text: "Avec plaisir !", en: "With pleasure!" },
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
        examples: [{ text: "Tu es prêt ?", en: "Are you ready?" }],
      },
      {
        heading: "2. Add est-ce que",
        body: "Put « est-ce que » at the start. Neutral and always correct.",
        examples: [{ text: "Est-ce que tu es prêt ?", en: "Are you ready?" }],
      },
      {
        heading: "3. Flip the verb",
        body:
          "Swap the pronoun and verb with a hyphen. This is more formal and common in writing.",
        examples: [{ text: "Es-tu prêt ?", en: "Are you ready?" }],
      },
      {
        heading: "Question words",
        body:
          "où (where) · quand (when) · comment (how) · pourquoi (why) · qui (who) · quoi / qu'est-ce que (what) · combien (how much / many) · quel / quelle (which).",
        examples: [
          { text: "Comment tu t'appelles ?", en: "What's your name?" },
          { text: "Pourquoi ?", en: "Why?" },
          { text: "Quand est-ce que tu pars ?", en: "When are you leaving?" },
          { text: "Qui est-ce ?", en: "Who is it?" },
          { text: "Combien ça coûte ?", en: "How much does it cost?" },
        ],
      },
    ],
    phrases: [
      { text: "Tu es prêt ?", en: "Are you ready?" },
      { text: "Est-ce que tu es prêt ?", en: "Are you ready?" },
      { text: "Comment tu t'appelles ?", en: "What's your name?" },
      { text: "Pourquoi ?", en: "Why?" },
      { text: "Quand est-ce que tu pars ?", en: "When are you leaving?" },
      { text: "Qui est-ce ?", en: "Who is it?" },
      { text: "Combien ça coûte ?", en: "How much does it cost?" },
      { text: "Où es-tu ?", en: "Where are you?" },
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
          { text: "Bon appétit !", en: "Enjoy your meal!" },
          { text: "C'est délicieux.", en: "It's delicious." },
          { text: "J'ai faim.", en: "I'm hungry." },
          { text: "J'ai soif.", en: "I'm thirsty." },
          { text: "Santé !", en: "Cheers!" },
          { text: "Je n'ai plus faim, merci.", en: "I'm full, thank you." },
        ],
      },
    ],
    phrases: [
      { text: "le petit-déjeuner", en: "breakfast" },
      { text: "le déjeuner", en: "lunch" },
      { text: "le dîner", en: "dinner" },
      { text: "Bon appétit !", en: "Enjoy your meal!" },
      { text: "C'est délicieux.", en: "It's delicious." },
      { text: "J'ai faim.", en: "I'm hungry." },
      { text: "J'ai soif.", en: "I'm thirsty." },
      { text: "Santé !", en: "Cheers!" },
      { text: "Je n'ai plus faim, merci.", en: "I'm full, thank you." },
    ],
  },
];
