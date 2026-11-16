import type { Lesson } from "./types";

export const level3: Lesson[] = [
  // ───────────── Module 7: Settling in ─────────────
  {
    id: "3.1",
    level: 3,
    module: 7,
    kind: "audio",
    title: "Au restaurant",
    subtitle: "Ordering a meal, special requests and complaints",
    intro: "Sam takes Léa out for her birthday to a bistro in the old town.",
    dialogue: [
      { speaker: "Serveuse", fr: "Vous avez choisi ?", en: "Have you decided?" },
      { speaker: "Léa", fr: "Oui. En entrée, je vais prendre la soupe à l'oignon.", en: "Yes. As a starter, I'll have the onion soup." },
      { speaker: "Sam", fr: "Et pour moi, le menu du jour. Qu'est-ce que vous me conseillez ?", en: "And for me, the set menu of the day. What do you recommend?" },
      { speaker: "Serveuse", fr: "Le bœuf bourguignon est fait maison. Il est excellent.", en: "The beef bourguignon is homemade. It's excellent." },
      { speaker: "Sam", fr: "Va pour le bœuf bourguignon.", en: "I'll go for the beef bourguignon." },
      { speaker: "Léa", fr: "Est-ce que le plat végétarien contient des noix ? Je suis allergique.", en: "Does the vegetarian dish contain nuts? I'm allergic." },
      { speaker: "Serveuse", fr: "Je vais demander au chef.", en: "I'll ask the chef." },
      { speaker: "Sam", fr: "Excusez-moi, mon plat est froid.", en: "Excuse me, my dish is cold." },
      { speaker: "Serveuse", fr: "Oh, je suis vraiment désolée. Je vous le réchauffe tout de suite.", en: "Oh, I'm really sorry. I'll warm it up for you right away." },
      { speaker: "Sam", fr: "Ce n'est pas grave. Et on pourrait avoir la carte des desserts ?", en: "It's no big deal. And could we have the dessert menu?" },
      { speaker: "Léa", fr: "Tu sais quoi ? On va prendre une bouteille de champagne !", en: "You know what? Let's get a bottle of champagne!" },
    ],
    notes: [
      {
        heading: "Object pronouns",
        body:
          "« Le », « la » and « les » can replace a noun and go before the verb: « Je vous le réchauffe » (I'll warm it up for you). « Me », « te », « nous », « vous » mean 'to me', 'to you' and so on.",
        examples: [
          { fr: "Je le prends.", en: "I'll take it." },
          { fr: "Tu me conseilles quoi ?", en: "What do you recommend to me?" },
        ],
      },
      {
        heading: "Polite complaints",
        body:
          "Start softly with « excusez-moi » and state the problem simply. « Ce n'est pas grave » (it's no big deal) smooths things over.",
      },
      {
        heading: "Fait maison",
        body:
          "Restaurants may display a small logo of a roof over a saucepan to show a dish is « fait maison » — cooked on site from raw ingredients.",
      },
    ],
    phrases: [
      { fr: "Vous avez choisi ?", en: "Have you decided?" },
      { fr: "En entrée, je vais prendre la soupe.", en: "As a starter, I'll have the soup." },
      { fr: "le menu du jour", en: "the set menu of the day" },
      { fr: "Qu'est-ce que vous me conseillez ?", en: "What do you recommend?" },
      { fr: "fait maison", en: "homemade" },
      { fr: "Est-ce que ça contient des noix ?", en: "Does it contain nuts?" },
      { fr: "Mon plat est froid.", en: "My dish is cold." },
      { fr: "Ce n'est pas grave.", en: "It's no big deal." },
      { fr: "On pourrait avoir la carte des desserts ?", en: "Could we have the dessert menu?" },
      { fr: "Tu sais quoi ?", en: "You know what?" },
    ],
  },
  {
    id: "3.2",
    level: 3,
    module: 7,
    kind: "audio",
    title: "Quand j'étais petit",
    subtitle: "Memories and the imparfait",
    intro: "Léa's grandmother, Mamie Josette, tells Sam about growing up in a village in the Auvergne.",
    dialogue: [
      { speaker: "Sam", fr: "Vous habitiez où quand vous étiez petite ?", en: "Where did you live when you were little?" },
      { speaker: "Josette", fr: "On habitait dans une ferme, près d'un petit village.", en: "We lived on a farm, near a small village." },
      { speaker: "Josette", fr: "Il n'y avait pas de télévision, alors on jouait dehors.", en: "There was no television, so we played outside." },
      { speaker: "Sam", fr: "Vous alliez à l'école à pied ?", en: "Did you walk to school?" },
      { speaker: "Josette", fr: "Oui, tous les jours. C'était à trois kilomètres !", en: "Yes, every day. It was three kilometres away!" },
      { speaker: "Josette", fr: "L'hiver, il faisait très froid et il neigeait souvent.", en: "In winter it was very cold and it often snowed." },
      { speaker: "Sam", fr: "Qu'est-ce que vous faisiez le dimanche ?", en: "What did you use to do on Sundays?" },
      { speaker: "Josette", fr: "Toute la famille se réunissait pour un grand repas.", en: "The whole family would get together for a big meal." },
      { speaker: "Josette", fr: "Un jour, pendant le repas, le chien a volé le rôti !", en: "One day, during the meal, the dog stole the roast!" },
      { speaker: "Sam", fr: "Ce n'est pas vrai ! Qu'est-ce que vous avez fait ?", en: "No way! What did you do?" },
      { speaker: "Josette", fr: "On a ri, et on a mangé des pâtes.", en: "We laughed, and we ate pasta." },
    ],
    notes: [
      {
        heading: "The imparfait",
        body:
          "Use the imparfait for background, descriptions and habits in the past ('used to', 'was …ing'). Take the nous form of the present, drop -ons, add: -ais, -ais, -ait, -ions, -iez, -aient.",
        examples: [
          { fr: "Je jouais dehors.", en: "I used to play outside." },
          { fr: "Il faisait froid.", en: "It was cold." },
          { fr: "Nous habitions à la campagne.", en: "We lived in the countryside." },
        ],
      },
      {
        heading: "Être is the exception",
        body: "j'étais · tu étais · il était · nous étions · vous étiez · ils étaient.",
      },
      {
        heading: "Imparfait vs passé composé",
        body:
          "Think of a film: the imparfait sets the scene (it was snowing, the family was eating), and the passé composé is the action that happens (the dog stole the roast).",
      },
    ],
    phrases: [
      { fr: "Quand j'étais petit…", en: "When I was little…" },
      { fr: "On habitait dans une ferme.", en: "We lived on a farm." },
      { fr: "Il n'y avait pas de télévision.", en: "There was no television." },
      { fr: "On jouait dehors.", en: "We used to play outside." },
      { fr: "tous les jours", en: "every day" },
      { fr: "Il faisait très froid.", en: "It was very cold." },
      { fr: "Il neigeait souvent.", en: "It often snowed." },
      { fr: "Qu'est-ce que vous faisiez le dimanche ?", en: "What did you use to do on Sundays?" },
      { fr: "Ce n'est pas vrai !", en: "No way!" },
      { fr: "On a ri.", en: "We laughed." },
    ],
  },
  {
    id: "3.3",
    level: 3,
    module: 7,
    kind: "culture",
    title: "Parler comme un Français",
    subtitle: "Language & culture: everyday slang and verlan",
    intro:
      "Textbook French will get you far, but in the street you'll hear words you never studied. Here's a starter kit of informal French.",
    notes: [
      {
        heading: "Dropping the ne",
        body:
          "In casual speech, the « ne » of a negative often disappears: « Je sais pas » instead of « Je ne sais pas ». « Il y a » shrinks to « y'a ». Keep the full forms for writing.",
        examples: [
          { fr: "Je sais pas.", en: "Dunno." },
          { fr: "C'est pas grave.", en: "No worries." },
          { fr: "Y'a pas de souci.", en: "No problem." },
        ],
      },
      {
        heading: "Everyday slang",
        body: "Common informal words you'll hear constantly.",
        examples: [
          { fr: "un truc", en: "a thing / thingy" },
          { fr: "le boulot", en: "work / job" },
          { fr: "un pote", en: "a mate / buddy" },
          { fr: "la bouffe", en: "food / grub" },
          { fr: "C'est nul.", en: "It's rubbish." },
          { fr: "C'est ouf !", en: "It's crazy!" },
          { fr: "Grave !", en: "Totally!" },
        ],
      },
      {
        heading: "Verlan",
        body:
          "Verlan flips the syllables of a word (« verlan » itself comes from « l'envers », backwards). « Fou » becomes « ouf », « bizarre » becomes « zarbi », « femme » becomes « meuf ».",
      },
    ],
    phrases: [
      { fr: "Je sais pas.", en: "Dunno." },
      { fr: "C'est pas grave.", en: "No worries." },
      { fr: "Y'a pas de souci.", en: "No problem." },
      { fr: "un truc", en: "a thing / thingy" },
      { fr: "le boulot", en: "work / job" },
      { fr: "un pote", en: "a mate / buddy" },
      { fr: "C'est ouf !", en: "It's crazy!" },
      { fr: "Grave !", en: "Totally!" },
    ],
  },

  // ───────────── Module 8: Hopes and opinions ─────────────
  {
    id: "3.4",
    level: 3,
    module: 8,
    kind: "audio",
    title: "L'entretien d'embauche",
    subtitle: "A job interview and the conditional",
    intro: "Emma is applying for a job at a design agency in Paris. The interview is in French.",
    dialogue: [
      { speaker: "Recruteur", fr: "Pourquoi voulez-vous travailler chez nous ?", en: "Why do you want to work for us?" },
      { speaker: "Emma", fr: "J'admire vos projets depuis longtemps, et j'aimerais vivre à Paris.", en: "I've admired your projects for a long time, and I'd like to live in Paris." },
      { speaker: "Recruteur", fr: "Quelles sont vos qualités principales ?", en: "What are your main strengths?" },
      { speaker: "Emma", fr: "Je suis créative, organisée et j'aime travailler en équipe.", en: "I'm creative, organised and I like working in a team." },
      { speaker: "Recruteur", fr: "Et votre plus grand défaut ?", en: "And your biggest weakness?" },
      { speaker: "Emma", fr: "Je suis parfois trop perfectionniste.", en: "I'm sometimes too much of a perfectionist." },
      { speaker: "Recruteur", fr: "Si vous étiez embauchée, quand pourriez-vous commencer ?", en: "If you were hired, when could you start?" },
      { speaker: "Emma", fr: "Je pourrais commencer le mois prochain.", en: "I could start next month." },
      { speaker: "Recruteur", fr: "Avez-vous des questions ?", en: "Do you have any questions?" },
      { speaker: "Emma", fr: "Oui, je voudrais savoir s'il est possible de faire du télétravail.", en: "Yes, I'd like to know if remote working is possible." },
      { speaker: "Recruteur", fr: "Tout à fait. Nous vous recontacterons la semaine prochaine.", en: "Absolutely. We'll get back to you next week." },
    ],
    notes: [
      {
        heading: "The conditional",
        body:
          "For 'would', take the future stem (usually the infinitive) and add the imparfait endings: j'aimerais, tu aimerais, il aimerait, nous aimerions, vous aimeriez, ils aimeraient.",
        examples: [
          { fr: "J'aimerais vivre à Paris.", en: "I'd like to live in Paris." },
          { fr: "Je pourrais commencer lundi.", en: "I could start on Monday." },
          { fr: "Ce serait génial.", en: "That would be great." },
        ],
      },
      {
        heading: "Si + imparfait, conditional",
        body:
          "Hypotheses: « Si j'avais le temps, je voyagerais » (If I had time, I would travel). The imparfait goes after si, never the conditional.",
      },
      {
        heading: "Inversion in formal settings",
        body:
          "In interviews, notice the formal inverted questions: « Pourquoi voulez-vous… ? », « Avez-vous des questions ? ».",
      },
    ],
    phrases: [
      { fr: "Pourquoi voulez-vous travailler chez nous ?", en: "Why do you want to work for us?" },
      { fr: "J'aimerais vivre à Paris.", en: "I'd like to live in Paris." },
      { fr: "J'aime travailler en équipe.", en: "I like working in a team." },
      { fr: "Je suis parfois trop perfectionniste.", en: "I'm sometimes too much of a perfectionist." },
      { fr: "Je pourrais commencer le mois prochain.", en: "I could start next month." },
      { fr: "Avez-vous des questions ?", en: "Do you have any questions?" },
      { fr: "Je voudrais savoir…", en: "I'd like to know…" },
      { fr: "faire du télétravail", en: "to work remotely" },
      { fr: "Tout à fait.", en: "Absolutely." },
      { fr: "Si j'avais le temps, je voyagerais.", en: "If I had time, I would travel." },
    ],
  },
  {
    id: "3.5",
    level: 3,
    module: 8,
    kind: "audio",
    title: "À mon avis",
    subtitle: "Giving opinions, agreeing and disagreeing",
    intro: "Over dinner, Hugo, Léa and Sam argue about whether cars should be banned from the city centre.",
    dialogue: [
      { speaker: "Hugo", fr: "À mon avis, il faut interdire les voitures en centre-ville.", en: "In my opinion, cars should be banned from the city centre." },
      { speaker: "Léa", fr: "Je ne suis pas d'accord. Et les personnes âgées ?", en: "I don't agree. What about elderly people?" },
      { speaker: "Hugo", fr: "Il y a les bus et les tramways. C'est moins polluant.", en: "There are buses and trams. It's less polluting." },
      { speaker: "Sam", fr: "Je pense que Hugo a raison, mais il faudrait plus de transports.", en: "I think Hugo is right, but we'd need more transport." },
      { speaker: "Léa", fr: "D'un côté, c'est bien pour l'environnement. De l'autre, c'est compliqué pour les commerçants.", en: "On the one hand it's good for the environment. On the other, it's tricky for shopkeepers." },
      { speaker: "Hugo", fr: "Il faut que la mairie fasse quelque chose.", en: "The town hall has to do something." },
      { speaker: "Sam", fr: "Ça dépend. Je ne crois pas que ce soit si simple.", en: "It depends. I don't think it's that simple." },
      { speaker: "Léa", fr: "Bon, on est d'accord pour ne pas être d'accord !", en: "Well, we agree to disagree!" },
      { speaker: "Hugo", fr: "Exactement. Qui veut du fromage ?", en: "Exactly. Who wants some cheese?" },
    ],
    notes: [
      {
        heading: "Opinion starters",
        body: "Ways to give your view, from neutral to strong.",
        examples: [
          { fr: "À mon avis…", en: "In my opinion…" },
          { fr: "Je pense que…", en: "I think that…" },
          { fr: "Je trouve que…", en: "I find that…" },
          { fr: "Je suis convaincu que…", en: "I'm convinced that…" },
        ],
      },
      {
        heading: "Agreeing and disagreeing",
        body:
          "« Je suis d'accord » (I agree), « Tu as raison » (you're right), « Tu as tort » (you're wrong), « Pas du tout ! » (not at all!), « Ça dépend » (it depends).",
      },
      {
        heading: "A first look at the subjunctive",
        body:
          "After « il faut que » and doubt like « je ne crois pas que », French uses the subjunctive: « Il faut que la mairie fasse… », « Je ne crois pas que ce soit… ». Don't worry about mastering it yet — just notice it.",
      },
    ],
    phrases: [
      { fr: "À mon avis…", en: "In my opinion…" },
      { fr: "Je ne suis pas d'accord.", en: "I don't agree." },
      { fr: "Je pense que tu as raison.", en: "I think you're right." },
      { fr: "Tu as tort.", en: "You're wrong." },
      { fr: "C'est moins polluant.", en: "It's less polluting." },
      { fr: "D'un côté… de l'autre…", en: "On the one hand… on the other…" },
      { fr: "Il faut que la mairie fasse quelque chose.", en: "The town hall has to do something." },
      { fr: "Ça dépend.", en: "It depends." },
      { fr: "Pas du tout !", en: "Not at all!" },
      { fr: "On est d'accord pour ne pas être d'accord.", en: "We agree to disagree." },
    ],
  },
  {
    id: "3.6",
    level: 3,
    module: 8,
    kind: "culture",
    title: "Le subjonctif",
    subtitle: "Language & culture: wishes, needs and doubts",
    intro:
      "The subjunctive has a scary reputation, but it shows up after a fairly small set of triggers. Learn the triggers and a handful of forms and you're most of the way there.",
    notes: [
      {
        heading: "Forming it",
        body:
          "Take the ils form of the present, drop -ent, add -e, -es, -e, -ions, -iez, -ent. Parler: que je parle, que tu parles, qu'il parle, que nous parlions, que vous parliez, qu'ils parlent.",
      },
      {
        heading: "Common irregulars",
        body:
          "être: que je sois · avoir: que j'aie · faire: que je fasse · aller: que j'aille · pouvoir: que je puisse · savoir: que je sache · vouloir: que je veuille.",
      },
      {
        heading: "Triggers",
        body: "Necessity, wishes, emotions and doubt, followed by que + a different subject.",
        examples: [
          { fr: "Il faut que tu viennes.", en: "You have to come." },
          { fr: "Je veux que tu sois heureux.", en: "I want you to be happy." },
          { fr: "Je suis content que vous soyez là.", en: "I'm glad you're here." },
          { fr: "Bien qu'il pleuve, on sort.", en: "Although it's raining, we're going out." },
          { fr: "Je doute qu'il le sache.", en: "I doubt he knows." },
        ],
      },
      {
        heading: "When NOT to use it",
        body:
          "If the subject is the same, use an infinitive instead: « Je veux partir » (I want to leave), not « Je veux que je parte ». And « je pense que » / « je crois que » take the normal indicative when positive.",
      },
    ],
    phrases: [
      { fr: "Il faut que tu viennes.", en: "You have to come." },
      { fr: "Je veux que tu sois heureux.", en: "I want you to be happy." },
      { fr: "Je suis content que vous soyez là.", en: "I'm glad you're here." },
      { fr: "Bien qu'il pleuve, on sort.", en: "Although it's raining, we're going out." },
      { fr: "Je doute qu'il le sache.", en: "I doubt he knows." },
      { fr: "Je veux partir.", en: "I want to leave." },
    ],
  },
  {
    id: "3.7",
    level: 3,
    module: 8,
    kind: "culture",
    title: "La francophonie",
    subtitle: "Language & culture: French around the world",
    intro:
      "Around 320 million people speak French across five continents. Each region has its own words and accent — here are a few you might meet.",
    notes: [
      {
        heading: "Québec",
        body:
          "Quebec French keeps some older forms and has its own vocabulary. People often use « tu » sooner than in France.",
        examples: [
          { fr: "C'est le fun !", en: "It's fun! (Québec)" },
          { fr: "le dépanneur", en: "the corner shop (Québec)" },
          { fr: "Bienvenue !", en: "You're welcome! (Québec)" },
        ],
      },
      {
        heading: "Belgique et Suisse",
        body:
          "Belgians and the Swiss say « septante » (70) and « nonante » (90); the Swiss often use « huitante » for 80. In Belgium, « une fois » is a common filler.",
      },
      {
        heading: "Afrique",
        body:
          "Over half of all French speakers live in Africa, in countries such as Côte d'Ivoire, Sénégal, the Democratic Republic of Congo and Cameroun, where French sits alongside many local languages and has its own creative expressions.",
        examples: [{ fr: "On est ensemble !", en: "We're in this together! (West Africa)" }],
      },
    ],
    phrases: [
      { fr: "C'est le fun !", en: "It's fun! (Québec)" },
      { fr: "le dépanneur", en: "the corner shop (Québec)" },
      { fr: "septante", en: "seventy (Belgium, Switzerland)" },
      { fr: "nonante", en: "ninety (Belgium, Switzerland)" },
      { fr: "On est ensemble !", en: "We're in this together! (West Africa)" },
      { fr: "Je parle français.", en: "I speak French." },
    ],
  },
];
