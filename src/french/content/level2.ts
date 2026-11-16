import type { Lesson } from "./types";

export const level2: Lesson[] = [
  // ───────────── Module 4: Travel ─────────────
  {
    id: "2.1",
    level: 2,
    module: 4,
    kind: "audio",
    title: "À l'hôtel",
    subtitle: "Checking in and solving problems",
    intro: "Sam and his sister Emma arrive at a small hotel in Annecy for the weekend.",
    dialogue: [
      { speaker: "Réceptionniste", fr: "Bonsoir, bienvenue. Vous avez une réservation ?", en: "Good evening, welcome. Do you have a reservation?" },
      { speaker: "Sam", fr: "Oui, au nom de Miller, pour deux nuits.", en: "Yes, under the name Miller, for two nights." },
      { speaker: "Réceptionniste", fr: "Une chambre double avec vue sur le lac. Voici votre clé.", en: "A double room with a lake view. Here is your key." },
      { speaker: "Emma", fr: "Le petit-déjeuner est compris ?", en: "Is breakfast included?" },
      { speaker: "Réceptionniste", fr: "Oui, il est servi de sept heures à dix heures.", en: "Yes, it's served from seven to ten." },
      { speaker: "Sam", fr: "Quel est le mot de passe du wifi ?", en: "What's the wifi password?" },
      { speaker: "Réceptionniste", fr: "Il est écrit sur la carte, dans la chambre.", en: "It's written on the card, in the room." },
      { speaker: "Emma", fr: "Excusez-moi, la climatisation ne marche pas.", en: "Excuse me, the air conditioning isn't working." },
      { speaker: "Réceptionniste", fr: "Je suis désolé. J'envoie quelqu'un tout de suite.", en: "I'm sorry. I'll send someone right away." },
      { speaker: "Sam", fr: "Merci. On peut laisser nos bagages demain matin ?", en: "Thanks. Can we leave our luggage tomorrow morning?" },
      { speaker: "Réceptionniste", fr: "Bien sûr, sans problème.", en: "Of course, no problem." },
    ],
    notes: [
      {
        heading: "Ne marche pas",
        body:
          "« Marcher » means 'to walk' but also 'to work' for machines. « Ça ne marche pas » is the go-to phrase when something is broken.",
        examples: [
          { fr: "La douche ne marche pas.", en: "The shower doesn't work." },
          { fr: "Il n'y a pas d'eau chaude.", en: "There is no hot water." },
        ],
      },
      {
        heading: "Pouvoir: can",
        body:
          "je peux · tu peux · il peut · nous pouvons · vous pouvez · ils peuvent. Follow it with an infinitive: « Je peux payer ? » « On peut laisser nos bagages ? ».",
      },
      {
        heading: "Nos, vos, leurs",
        body: "Plural possessives: notre / nos (our), votre / vos (your), leur / leurs (their).",
      },
    ],
    phrases: [
      { fr: "J'ai une réservation.", en: "I have a reservation." },
      { fr: "au nom de Miller", en: "under the name Miller" },
      { fr: "pour deux nuits", en: "for two nights" },
      { fr: "une chambre double", en: "a double room" },
      { fr: "Le petit-déjeuner est compris ?", en: "Is breakfast included?" },
      { fr: "Quel est le mot de passe du wifi ?", en: "What's the wifi password?" },
      { fr: "La climatisation ne marche pas.", en: "The air conditioning isn't working." },
      { fr: "Je suis désolé.", en: "I'm sorry." },
      { fr: "tout de suite", en: "right away" },
      { fr: "On peut laisser nos bagages ?", en: "Can we leave our luggage?" },
      { fr: "sans problème", en: "no problem" },
    ],
  },
  {
    id: "2.2",
    level: 2,
    module: 4,
    kind: "audio",
    title: "Un billet de train",
    subtitle: "Buying tickets and travelling by train",
    intro: "Emma wants to get from Annecy to Paris. She goes to the ticket office.",
    dialogue: [
      { speaker: "Emma", fr: "Bonjour, un aller simple pour Paris, s'il vous plaît.", en: "Hello, a one-way ticket to Paris, please." },
      { speaker: "Agent", fr: "Pour quand ?", en: "For when?" },
      { speaker: "Emma", fr: "Pour demain matin, le plus tôt possible.", en: "For tomorrow morning, as early as possible." },
      { speaker: "Agent", fr: "Il y a un train à sept heures douze, avec un changement à Lyon.", en: "There's a train at 7:12, with a change in Lyon." },
      { speaker: "Emma", fr: "Il n'y a pas de train direct ?", en: "Isn't there a direct train?" },
      { speaker: "Agent", fr: "Si, à neuf heures, mais c'est plus cher.", en: "Yes, at nine, but it's more expensive." },
      { speaker: "Emma", fr: "Je prends celui de neuf heures. En seconde classe.", en: "I'll take the nine o'clock one. Second class." },
      { speaker: "Agent", fr: "Côté fenêtre ou côté couloir ?", en: "Window or aisle?" },
      { speaker: "Emma", fr: "Côté fenêtre. Le train part de quel quai ?", en: "Window. Which platform does the train leave from?" },
      { speaker: "Agent", fr: "Le quai est affiché vingt minutes avant le départ.", en: "The platform is displayed twenty minutes before departure." },
    ],
    notes: [
      {
        heading: "Si: yes to a negative",
        body:
          "When someone asks a negative question and the answer is yes, French uses « si », not « oui ». « Il n'y a pas de train direct ? » — « Si ! » (Yes, there is!).",
      },
      {
        heading: "Comparisons",
        body:
          "plus … que (more … than), moins … que (less … than), aussi … que (as … as). « Bon » becomes « meilleur » (better).",
        examples: [
          { fr: "Le TGV est plus rapide que le bus.", en: "The high-speed train is faster than the bus." },
          { fr: "C'est moins cher.", en: "It's cheaper." },
          { fr: "C'est meilleur.", en: "It's better." },
        ],
      },
      {
        heading: "Prendre: to take",
        body:
          "je prends · tu prends · il prend · nous prenons · vous prenez · ils prennent. Used for transport, food and decisions: « Je prends le train », « Je prends un café ».",
      },
    ],
    phrases: [
      { fr: "un aller simple pour Paris", en: "a one-way ticket to Paris" },
      { fr: "un aller-retour", en: "a return ticket" },
      { fr: "le plus tôt possible", en: "as early as possible" },
      { fr: "avec un changement à Lyon", en: "with a change in Lyon" },
      { fr: "un train direct", en: "a direct train" },
      { fr: "C'est plus cher.", en: "It's more expensive." },
      { fr: "Je prends celui de neuf heures.", en: "I'll take the nine o'clock one." },
      { fr: "côté fenêtre", en: "window seat" },
      { fr: "Le train part de quel quai ?", en: "Which platform does the train leave from?" },
      { fr: "le départ", en: "the departure" },
      { fr: "l'arrivée", en: "the arrival" },
    ],
  },
  {
    id: "2.3",
    level: 2,
    module: 4,
    kind: "culture",
    title: "Les régions de France",
    subtitle: "Language & culture: a quick tour of France",
    intro:
      "France is split into thirteen mainland regions, each with its own food, accent and character. Here are a few highlights, and how to talk about places.",
    notes: [
      {
        heading: "Going to places",
        body:
          "Use « à » with cities (à Paris, à Nice), « en » with feminine countries and regions (en France, en Bretagne), and « au » with masculine ones (au Canada, au Japon). Plural countries take « aux »: aux États-Unis.",
        examples: [
          { fr: "Je vais à Bordeaux.", en: "I'm going to Bordeaux." },
          { fr: "J'habite en Normandie.", en: "I live in Normandy." },
          { fr: "Elle travaille au Canada.", en: "She works in Canada." },
          { fr: "Nous allons aux États-Unis.", en: "We're going to the United States." },
        ],
      },
      {
        heading: "Bretagne",
        body: "Brittany, in the north-west: Celtic roots, rugged coast, crêpes and cider.",
      },
      {
        heading: "Provence",
        body: "In the south-east: lavender fields, olive oil, markets and a sing-song accent.",
      },
      {
        heading: "Alsace",
        body: "On the German border: half-timbered houses, Christmas markets and choucroute.",
      },
      {
        heading: "Outre-mer",
        body:
          "France also includes overseas departments such as Guadeloupe, Martinique, La Réunion, Guyane and Mayotte, where French is spoken alongside Creole languages.",
      },
    ],
    phrases: [
      { fr: "Je vais à Bordeaux.", en: "I'm going to Bordeaux." },
      { fr: "J'habite en Normandie.", en: "I live in Normandy." },
      { fr: "Elle travaille au Canada.", en: "She works in Canada." },
      { fr: "Nous allons aux États-Unis.", en: "We're going to the United States." },
      { fr: "Tu viens d'où ?", en: "Where are you from?" },
      { fr: "Je viens de Bretagne.", en: "I come from Brittany." },
      { fr: "C'est une belle région.", en: "It's a beautiful region." },
    ],
  },

  // ───────────── Module 5: Work and plans ─────────────
  {
    id: "2.4",
    level: 2,
    module: 5,
    kind: "audio",
    title: "Au travail",
    subtitle: "Talking about jobs and the workday",
    intro: "At a friend's party, Sam chats with Nadia, who works in a hospital.",
    dialogue: [
      { speaker: "Nadia", fr: "Tu fais quoi dans la vie ?", en: "What do you do for a living?" },
      { speaker: "Sam", fr: "Je suis développeur. Je travaille pour une start-up.", en: "I'm a developer. I work for a start-up." },
      { speaker: "Nadia", fr: "Tu travailles à la maison ?", en: "Do you work from home?" },
      { speaker: "Sam", fr: "Deux jours par semaine. Le reste du temps, je vais au bureau.", en: "Two days a week. The rest of the time I go to the office." },
      { speaker: "Sam", fr: "Et toi ?", en: "And you?" },
      { speaker: "Nadia", fr: "Je suis infirmière. Je travaille de nuit en ce moment.", en: "I'm a nurse. I'm working nights at the moment." },
      { speaker: "Sam", fr: "Ça doit être fatigant !", en: "That must be tiring!" },
      { speaker: "Nadia", fr: "Oui, mais j'adore mon métier. Mes collègues sont super.", en: "Yes, but I love my job. My colleagues are great." },
      { speaker: "Sam", fr: "Tu as combien de semaines de vacances ?", en: "How many weeks of holiday do you get?" },
      { speaker: "Nadia", fr: "Cinq semaines, comme tout le monde.", en: "Five weeks, like everybody." },
    ],
    notes: [
      {
        heading: "Aller: to go",
        body:
          "An irregular but essential verb: je vais · tu vas · il va · nous allons · vous allez · ils vont. « À + le » becomes « au »: je vais au bureau; « à + les » becomes « aux ».",
      },
      {
        heading: "Jobs, masculine and feminine",
        body:
          "Many jobs have two forms: infirmier / infirmière, vendeur / vendeuse, acteur / actrice. Others now add -e in the feminine: professeur / professeure, auteur / autrice.",
      },
      {
        heading: "French work culture",
        body:
          "The legal working week is 35 hours, and most employees get five weeks of paid leave. Lunch breaks are often real breaks, and many people disconnect from work email in the evening.",
      },
    ],
    phrases: [
      { fr: "Tu fais quoi dans la vie ?", en: "What do you do for a living?" },
      { fr: "Je suis développeur.", en: "I'm a developer." },
      { fr: "Je travaille à la maison.", en: "I work from home." },
      { fr: "deux jours par semaine", en: "two days a week" },
      { fr: "Je vais au bureau.", en: "I go to the office." },
      { fr: "Je suis infirmière.", en: "I'm a nurse. (woman)" },
      { fr: "en ce moment", en: "at the moment" },
      { fr: "Ça doit être fatigant !", en: "That must be tiring!" },
      { fr: "mes collègues", en: "my colleagues" },
      { fr: "les vacances", en: "holidays / vacation" },
      { fr: "comme tout le monde", en: "like everybody" },
    ],
  },
  {
    id: "2.5",
    level: 2,
    module: 5,
    kind: "audio",
    title: "On fait quoi ce soir ?",
    subtitle: "Making plans and the near future",
    intro: "Léa texts Sam, then calls him to organise Friday night.",
    dialogue: [
      { speaker: "Léa", fr: "Tu es libre vendredi soir ?", en: "Are you free on Friday evening?" },
      { speaker: "Sam", fr: "Je crois que oui. Pourquoi ?", en: "I think so. Why?" },
      { speaker: "Léa", fr: "On va aller au cinéma avec Hugo. Tu viens ?", en: "We're going to go to the cinema with Hugo. Are you coming?" },
      { speaker: "Sam", fr: "Avec plaisir. Vous allez voir quel film ?", en: "With pleasure. What film are you going to see?" },
      { speaker: "Léa", fr: "Une comédie. La séance est à vingt heures.", en: "A comedy. The showing is at eight." },
      { speaker: "Sam", fr: "On se retrouve où ?", en: "Where shall we meet?" },
      { speaker: "Léa", fr: "Devant le cinéma, à huit heures moins le quart.", en: "In front of the cinema, at a quarter to eight." },
      { speaker: "Sam", fr: "Parfait. Après, on va manger quelque chose ?", en: "Perfect. Shall we go eat something afterwards?" },
      { speaker: "Léa", fr: "Bonne idée ! Je vais réserver une pizzeria.", en: "Good idea! I'll book a pizzeria." },
      { speaker: "Sam", fr: "Super. À vendredi !", en: "Great. See you Friday!" },
    ],
    notes: [
      {
        heading: "The near future",
        body:
          "Aller + infinitive is the easiest way to talk about the future, just like 'going to' in English.",
        examples: [
          { fr: "Je vais manger.", en: "I'm going to eat." },
          { fr: "On va aller au cinéma.", en: "We're going to go to the cinema." },
          { fr: "Il va pleuvoir.", en: "It's going to rain." },
        ],
      },
      {
        heading: "Venir: to come",
        body: "je viens · tu viens · il vient · nous venons · vous venez · ils viennent.",
      },
      {
        heading: "Days of the week",
        body:
          "lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche — no capital letters. « Le samedi » means 'on Saturdays' (every week); « samedi » alone means 'this Saturday'.",
      },
    ],
    phrases: [
      { fr: "Tu es libre vendredi soir ?", en: "Are you free on Friday evening?" },
      { fr: "Je crois que oui.", en: "I think so." },
      { fr: "On va aller au cinéma.", en: "We're going to go to the cinema." },
      { fr: "Tu viens ?", en: "Are you coming?" },
      { fr: "On se retrouve où ?", en: "Where shall we meet?" },
      { fr: "devant le cinéma", en: "in front of the cinema" },
      { fr: "à huit heures moins le quart", en: "at a quarter to eight" },
      { fr: "Bonne idée !", en: "Good idea!" },
      { fr: "Je vais réserver.", en: "I'm going to book." },
      { fr: "À vendredi !", en: "See you Friday!" },
    ],
  },
  {
    id: "2.6",
    level: 2,
    module: 5,
    kind: "culture",
    title: "Le futur proche & les verbes en -ir",
    subtitle: "Language & culture: more verb patterns",
    intro:
      "You know the -er family. Now meet the -ir verbs like finir and choisir, plus three irregular verbs you'll use daily: faire, vouloir and devoir.",
    notes: [
      {
        heading: "Regular -ir verbs",
        body:
          "finir (to finish): je finis · tu finis · il finit · nous finissons · vous finissez · ils finissent. Choisir, réussir and grandir follow the same pattern.",
        examples: [
          { fr: "Je finis à dix-huit heures.", en: "I finish at 6 pm." },
          { fr: "Vous choisissez quel dessert ?", en: "Which dessert are you choosing?" },
        ],
      },
      {
        heading: "Faire: to do / make",
        body:
          "je fais · tu fais · il fait · nous faisons · vous faites · ils font. It's used for weather too: « Il fait beau » (the weather's nice).",
        examples: [
          { fr: "Il fait beau.", en: "The weather's nice." },
          { fr: "Il fait froid.", en: "It's cold." },
          { fr: "Je fais les courses.", en: "I'm doing the shopping." },
        ],
      },
      {
        heading: "Vouloir and devoir",
        body:
          "vouloir (to want): je veux · tu veux · il veut · nous voulons · vous voulez · ils veulent. devoir (must): je dois · tu dois · il doit · nous devons · vous devez · ils doivent.",
        examples: [
          { fr: "Tu veux venir ?", en: "Do you want to come?" },
          { fr: "Je dois partir.", en: "I have to leave." },
        ],
      },
    ],
    phrases: [
      { fr: "Je finis à dix-huit heures.", en: "I finish at 6 pm." },
      { fr: "Vous choisissez quel dessert ?", en: "Which dessert are you choosing?" },
      { fr: "Il fait beau.", en: "The weather's nice." },
      { fr: "Il fait froid.", en: "It's cold." },
      { fr: "Je fais les courses.", en: "I'm doing the shopping." },
      { fr: "Tu veux venir ?", en: "Do you want to come?" },
      { fr: "Je dois partir.", en: "I have to leave." },
    ],
  },

  // ───────────── Module 6: Telling stories ─────────────
  {
    id: "2.7",
    level: 2,
    module: 6,
    kind: "audio",
    title: "Le week-end dernier",
    subtitle: "Talking about the past with the passé composé",
    intro: "Monday morning. Nadia asks Sam about his weekend in Annecy.",
    dialogue: [
      { speaker: "Nadia", fr: "Alors, tu as passé un bon week-end ?", en: "So, did you have a good weekend?" },
      { speaker: "Sam", fr: "Excellent ! Je suis allé à Annecy avec ma sœur.", en: "Excellent! I went to Annecy with my sister." },
      { speaker: "Nadia", fr: "Qu'est-ce que vous avez fait ?", en: "What did you do?" },
      { speaker: "Sam", fr: "On a loué des vélos et on a fait le tour du lac.", en: "We rented bikes and cycled around the lake." },
      { speaker: "Nadia", fr: "Vous avez nagé ?", en: "Did you swim?" },
      { speaker: "Sam", fr: "Emma a nagé, mais moi, j'ai trouvé l'eau trop froide !", en: "Emma swam, but I found the water too cold!" },
      { speaker: "Nadia", fr: "Et vous avez bien mangé ?", en: "And did you eat well?" },
      { speaker: "Sam", fr: "Oui, on a goûté la tartiflette. C'était délicieux.", en: "Yes, we tried tartiflette. It was delicious." },
      { speaker: "Nadia", fr: "Vous êtes rentrés quand ?", en: "When did you get back?" },
      { speaker: "Sam", fr: "Hier soir, très tard. Je suis crevé !", en: "Last night, very late. I'm exhausted!" },
    ],
    notes: [
      {
        heading: "The passé composé",
        body:
          "To say what happened, use avoir in the present + a past participle. For -er verbs the participle ends in -é: parler → parlé, manger → mangé.",
        examples: [
          { fr: "J'ai mangé.", en: "I ate / I have eaten." },
          { fr: "Tu as parlé.", en: "You spoke." },
          { fr: "Nous avons loué des vélos.", en: "We rented bikes." },
        ],
      },
      {
        heading: "Verbs that use être",
        body:
          "A small group of movement verbs use être instead: aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, mourir, rester, tomber, rentrer, retourner. The participle agrees like an adjective: « Elle est allée », « Nous sommes rentrés ».",
      },
      {
        heading: "Irregular participles",
        body: "faire → fait · avoir → eu · être → été · prendre → pris · voir → vu · boire → bu.",
      },
      {
        heading: "C'était",
        body:
          "To describe what something was like, use « c'était » (it was): « C'était super », « C'était nul » (it was rubbish).",
      },
    ],
    phrases: [
      { fr: "Tu as passé un bon week-end ?", en: "Did you have a good weekend?" },
      { fr: "Je suis allé à Annecy.", en: "I went to Annecy." },
      { fr: "Qu'est-ce que vous avez fait ?", en: "What did you do?" },
      { fr: "On a loué des vélos.", en: "We rented bikes." },
      { fr: "Elle a nagé.", en: "She swam." },
      { fr: "J'ai trouvé l'eau trop froide.", en: "I found the water too cold." },
      { fr: "C'était délicieux.", en: "It was delicious." },
      { fr: "Vous êtes rentrés quand ?", en: "When did you get back?" },
      { fr: "hier soir", en: "last night" },
      { fr: "Je suis crevé !", en: "I'm exhausted! (informal)" },
    ],
  },
  {
    id: "2.8",
    level: 2,
    module: 6,
    kind: "audio",
    title: "Chez le médecin",
    subtitle: "Describing symptoms and getting help",
    intro: "Emma isn't feeling well after her swim in the lake. She sees a doctor.",
    dialogue: [
      { speaker: "Médecin", fr: "Bonjour, madame. Qu'est-ce qui ne va pas ?", en: "Hello, ma'am. What's the matter?" },
      { speaker: "Emma", fr: "J'ai mal à la gorge et j'ai de la fièvre.", en: "I have a sore throat and a fever." },
      { speaker: "Médecin", fr: "Depuis quand ?", en: "Since when?" },
      { speaker: "Emma", fr: "Depuis hier. Et j'ai mal à la tête.", en: "Since yesterday. And I have a headache." },
      { speaker: "Médecin", fr: "Vous toussez ?", en: "Are you coughing?" },
      { speaker: "Emma", fr: "Un peu, surtout la nuit.", en: "A little, especially at night." },
      { speaker: "Médecin", fr: "Vous avez des allergies ?", en: "Do you have any allergies?" },
      { speaker: "Emma", fr: "Oui, je suis allergique à la pénicilline.", en: "Yes, I'm allergic to penicillin." },
      { speaker: "Médecin", fr: "D'accord. Je vous fais une ordonnance. Reposez-vous bien.", en: "OK. I'll write you a prescription. Get plenty of rest." },
      { speaker: "Emma", fr: "Merci, docteur.", en: "Thank you, doctor." },
    ],
    notes: [
      {
        heading: "Avoir mal à…",
        body:
          "To say something hurts: avoir mal + à + body part. Remember à + le = au, à + les = aux.",
        examples: [
          { fr: "J'ai mal à la tête.", en: "I have a headache." },
          { fr: "J'ai mal au ventre.", en: "I have a stomach ache." },
          { fr: "J'ai mal aux dents.", en: "I have toothache." },
          { fr: "J'ai mal au dos.", en: "My back hurts." },
        ],
      },
      {
        heading: "Depuis",
        body:
          "« Depuis » + present tense means 'have been … for/since': « J'ai de la fièvre depuis hier » (I've had a fever since yesterday).",
      },
      {
        heading: "Emergencies",
        body:
          "Dial 112 anywhere in Europe, or 15 for medical emergencies in France. Pharmacies (look for the green cross) can give advice on minor problems.",
        examples: [
          { fr: "Au secours !", en: "Help!" },
          { fr: "Appelez une ambulance !", en: "Call an ambulance!" },
        ],
      },
    ],
    phrases: [
      { fr: "Qu'est-ce qui ne va pas ?", en: "What's the matter?" },
      { fr: "J'ai mal à la gorge.", en: "I have a sore throat." },
      { fr: "J'ai de la fièvre.", en: "I have a fever." },
      { fr: "J'ai mal à la tête.", en: "I have a headache." },
      { fr: "Depuis quand ?", en: "Since when?" },
      { fr: "depuis hier", en: "since yesterday" },
      { fr: "Je suis allergique à la pénicilline.", en: "I'm allergic to penicillin." },
      { fr: "une ordonnance", en: "a prescription" },
      { fr: "Reposez-vous bien.", en: "Get plenty of rest." },
      { fr: "Au secours !", en: "Help!" },
    ],
  },
  {
    id: "2.9",
    level: 2,
    module: 6,
    kind: "culture",
    title: "Le passé composé en détail",
    subtitle: "Language & culture: negatives and agreement in the past",
    intro: "Let's polish your past tense: negatives, questions, and when the participle changes.",
    notes: [
      {
        heading: "Negatives wrap the helper verb",
        body: "Ne … pas goes around avoir or être, not the participle.",
        examples: [
          { fr: "Je n'ai pas compris.", en: "I didn't understand." },
          { fr: "Elle n'est pas venue.", en: "She didn't come." },
          { fr: "On n'a rien mangé.", en: "We didn't eat anything." },
          { fr: "Je ne suis jamais allé en Corse.", en: "I've never been to Corsica." },
        ],
      },
      {
        heading: "Agreement with être",
        body:
          "With être verbs, the participle agrees with the subject: il est parti, elle est partie, ils sont partis, elles sont parties. With avoir it normally doesn't change.",
      },
      {
        heading: "Useful time markers",
        body: "hier (yesterday) · avant-hier (the day before yesterday) · la semaine dernière (last week) · il y a deux jours (two days ago) · déjà (already) · pas encore (not yet).",
        examples: [
          { fr: "Je l'ai vu il y a deux jours.", en: "I saw him two days ago." },
          { fr: "Tu as déjà mangé ?", en: "Have you already eaten?" },
          { fr: "Pas encore.", en: "Not yet." },
        ],
      },
    ],
    phrases: [
      { fr: "Je n'ai pas compris.", en: "I didn't understand." },
      { fr: "Elle n'est pas venue.", en: "She didn't come." },
      { fr: "On n'a rien mangé.", en: "We didn't eat anything." },
      { fr: "Je ne suis jamais allé en Corse.", en: "I've never been to Corsica." },
      { fr: "la semaine dernière", en: "last week" },
      { fr: "Je l'ai vu il y a deux jours.", en: "I saw him two days ago." },
      { fr: "Tu as déjà mangé ?", en: "Have you already eaten?" },
      { fr: "Pas encore.", en: "Not yet." },
    ],
  },
];
