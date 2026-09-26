import type { WritingPrompt } from "../types";

export const writingPrompts: WritingPrompt[] = [
  {
    id: "weekend-lea",
    title: "Le week-end de Léa",
    level: "A2",
    characters: ["Léa", "Marc"],
    dialogue: [
      { speaker: "Léa", french: "Salut Marc ! Tu as des projets pour ce week-end ?", english: "Hi Marc! Do you have plans for this weekend?" },
      { speaker: "Marc", french: "Pas vraiment. Je dois travailler samedi matin. Et toi ?", english: "Not really. I have to work Saturday morning. What about you?" },
      { speaker: "Léa", french: "Moi, je veux faire une randonnée à la montagne samedi après-midi.", english: "I want to go hiking in the mountains Saturday afternoon." },
      { speaker: "Marc", french: "Ça a l'air sympa ! Je suis libre dimanche, par contre.", english: "That sounds nice! I'm free on Sunday, though." },
      { speaker: "Léa", french: "Parfait, on peut se retrouver dimanche pour déjeuner ensemble alors ?", english: "Perfect, we can meet up for lunch together on Sunday then?" },
      { speaker: "Marc", french: "Avec plaisir ! À dimanche, Léa.", english: "With pleasure! See you Sunday, Léa." },
    ],
    question: "Qu'est-ce que Léa et Marc vont faire ce week-end ? Explique en 2 ou 3 phrases.",
    questionTranslation: "What are Léa and Marc going to do this weekend? Explain in 2-3 sentences.",
    minSentences: 2,
    keyPoints: [
      "Marc travaille samedi matin",
      "Léa fait une randonnée samedi après-midi",
      "Ils déjeunent ensemble dimanche",
    ],
    modelAnswer:
      "Samedi matin, Marc travaille. L'après-midi, Léa fait une randonnée à la montagne. Dimanche, ils se retrouvent tous les deux pour déjeuner ensemble.",
    modelAnswerTranslation:
      "Saturday morning, Marc works. In the afternoon, Léa goes hiking in the mountains. On Sunday, the two of them meet up to have lunch together.",
  },
  {
    id: "au-restaurant",
    title: "Au restaurant",
    level: "B1",
    characters: ["Cliente", "Serveur"],
    dialogue: [
      { speaker: "Serveur", french: "Bonjour, vous avez choisi ?", english: "Hello, have you decided?" },
      { speaker: "Cliente", french: "Oui, je vais prendre le steak avec des frites, s'il vous plaît.", english: "Yes, I'll have the steak with fries, please." },
      { speaker: "Serveur", french: "Très bien. Et comme boisson ?", english: "Very good. And to drink?" },
      { speaker: "Cliente", french: "Un verre de vin rouge, merci. Ah, attendez... est-ce qu'il y a des noix dans la sauce du steak ?", english: "A glass of red wine, thanks. Oh wait... is there nuts in the steak sauce?" },
      { speaker: "Serveur", french: "Oui, en effet, la sauce contient des noix.", english: "Yes, indeed, the sauce contains nuts." },
      { speaker: "Cliente", french: "Ah non, je suis allergique. Je vais plutôt prendre le poulet rôti, sans sauce aux noix.", english: "Oh no, I'm allergic. I'll have the roasted chicken instead, without the nut sauce." },
      { speaker: "Serveur", french: "Pas de problème, je note le changement tout de suite.", english: "No problem, I'll note the change right away." },
    ],
    question: "Résume la commande finale de la cliente et explique pourquoi elle a changé d'avis.",
    questionTranslation: "Summarize the customer's final order and explain why she changed her mind.",
    minSentences: 2,
    keyPoints: [
      "La commande de départ était un steak-frites",
      "Elle est allergique aux noix, présentes dans la sauce",
      "La commande finale est un poulet rôti (sans sauce aux noix)",
    ],
    modelAnswer:
      "Au début, la cliente voulait un steak-frites avec un verre de vin rouge. Mais elle a appris que la sauce du steak contenait des noix, et elle y est allergique. Elle a donc changé sa commande pour un poulet rôti sans sauce aux noix.",
    modelAnswerTranslation:
      "At first, the customer wanted steak and fries with a glass of red wine. But she learned that the steak sauce contained nuts, and she's allergic to them. So she changed her order to roasted chicken without the nut sauce.",
  },
  {
    id: "imprevu-travail",
    title: "Un imprévu au travail",
    level: "B1",
    characters: ["Sophie", "Karim"],
    dialogue: [
      { speaker: "Sophie", french: "Karim, on a un problème. Le client veut le rapport final demain matin, mais il nous manque encore les chiffres de ventes.", english: "Karim, we have a problem. The client wants the final report tomorrow morning, but we're still missing the sales figures." },
      { speaker: "Karim", french: "Demain matin ? C'est très serré... Marie a ces chiffres, non ?", english: "Tomorrow morning? That's very tight... Marie has those figures, right?" },
      { speaker: "Sophie", french: "Oui, mais elle est en congé cette semaine.", english: "Yes, but she's on leave this week." },
      { speaker: "Karim", french: "On pourrait lui envoyer un message rapide, ou alors on présente une version provisoire demain et on complète vendredi.", english: "We could send her a quick message, or we present a draft version tomorrow and complete it Friday." },
      { speaker: "Sophie", french: "Je préfère la deuxième option, c'est plus réaliste.", english: "I prefer the second option, it's more realistic." },
      { speaker: "Karim", french: "D'accord, je préviens le client tout de suite.", english: "Okay, I'll let the client know right away." },
    ],
    question: "Quel est le problème, et quelle solution Sophie et Karim choisissent-ils ? Donne aussi ton avis : est-ce une bonne idée ?",
    questionTranslation: "What is the problem, and which solution do Sophie and Karim choose? Also give your opinion: is it a good idea?",
    minSentences: 3,
    keyPoints: [
      "Il manque les chiffres de ventes et Marie (qui les a) est en congé",
      "Ils choisissent de présenter une version provisoire et de la compléter vendredi",
      "Une opinion personnelle est donnée, avec une raison",
    ],
    modelAnswer:
      "Le problème, c'est qu'il manque les chiffres de ventes pour le rapport, et la seule personne qui les a, Marie, est en congé. Sophie et Karim décident de présenter une version provisoire du rapport demain et de la compléter vendredi. À mon avis, c'est une bonne solution parce que ça évite de déranger Marie pendant ses congés.",
    modelAnswerTranslation:
      "The problem is that the sales figures are missing for the report, and the only person who has them, Marie, is on leave. Sophie and Karim decide to present a draft version of the report tomorrow and complete it on Friday. In my opinion, it's a good solution because it avoids bothering Marie during her time off.",
  },
  {
    id: "debat-reseaux",
    title: "Un débat sur les réseaux sociaux",
    level: "B2",
    characters: ["Emma", "Hugo"],
    dialogue: [
      { speaker: "Emma", french: "Tu as vu ? Mon petit frère passe six heures par jour sur les réseaux sociaux. Je trouve ça inquiétant.", english: "Did you see? My little brother spends six hours a day on social media. I find that worrying." },
      { speaker: "Hugo", french: "Je ne suis pas complètement d'accord. Les réseaux sociaux permettent aussi de rester en contact avec ses amis et de découvrir plein de choses.", english: "I don't completely agree. Social media also lets you stay in touch with friends and discover lots of things." },
      { speaker: "Emma", french: "Oui, mais à quel prix ? Beaucoup d'études montrent un lien avec l'anxiété chez les jeunes.", english: "Yes, but at what cost? A lot of studies show a link with anxiety in young people." },
      { speaker: "Hugo", french: "C'est vrai, mais je pense que le vrai problème, c'est le temps passé, pas les réseaux eux-mêmes. Avec un usage raisonnable, ça reste positif.", english: "True, but I think the real problem is the time spent, not social media itself. Used reasonably, it stays positive." },
      { speaker: "Emma", french: "Peut-être, mais c'est difficile de contrôler ça à quatorze ans.", english: "Maybe, but it's hard to control that at fourteen." },
      { speaker: "Hugo", french: "Là, je suis d'accord avec toi. Il faudrait sans doute plus d'éducation sur ce sujet à l'école.", english: "There, I agree with you. There should probably be more education on this topic at school." },
    ],
    question: "Résume les points de vue d'Emma et d'Hugo, puis donne ton opinion personnelle avec au moins une raison.",
    questionTranslation: "Summarize Emma's and Hugo's points of view, then give your own opinion with at least one reason.",
    minSentences: 3,
    keyPoints: [
      "Le point de vue d'Emma : inquiète, lien avec l'anxiété chez les jeunes",
      "Le point de vue d'Hugo : les réseaux ont des avantages, le vrai problème est le temps passé",
      "Une opinion personnelle est donnée, avec au moins une raison",
    ],
    modelAnswer:
      "Emma pense que les réseaux sociaux sont inquiétants, surtout pour les jeunes, à cause du lien avec l'anxiété. Hugo pense que les réseaux ont aussi des avantages, et que le problème est le temps passé plutôt que les réseaux eux-mêmes. Les deux sont d'accord qu'il faudrait plus d'éducation sur ce sujet. À mon avis, Hugo a en partie raison : tout dépend de l'usage qu'on en fait.",
    modelAnswerTranslation:
      "Emma thinks social media is worrying, especially for young people, because of the link with anxiety. Hugo thinks social media also has benefits, and that the problem is the time spent rather than the platforms themselves. Both agree that there should be more education on the topic. In my opinion, Hugo is partly right: it all depends on how you use it.",
  },
  {
    id: "entretien-embauche",
    title: "Un entretien d'embauche",
    level: "B2",
    characters: ["Recruteuse", "Candidat"],
    dialogue: [
      { speaker: "Recruteuse", french: "Parlez-moi un peu de votre expérience professionnelle.", english: "Tell me a bit about your professional experience." },
      { speaker: "Candidat", french: "J'ai travaillé pendant trois ans comme chef de projet dans une start-up, où j'ai géré une équipe de cinq personnes.", english: "I worked for three years as a project manager at a startup, where I managed a team of five people." },
      { speaker: "Recruteuse", french: "Intéressant. Et pourquoi voulez-vous quitter votre poste actuel ?", english: "Interesting. And why do you want to leave your current position?" },
      { speaker: "Candidat", french: "J'ai envie de nouveaux défis, et votre entreprise travaille sur des projets qui me passionnent, notamment dans le développement durable.", english: "I want new challenges, and your company works on projects I'm passionate about, particularly in sustainable development." },
      { speaker: "Recruteuse", french: "Quelle serait votre plus grande qualité pour ce poste ?", english: "What would be your greatest strength for this position?" },
      { speaker: "Candidat", french: "Je dirais ma capacité à résoudre des problèmes rapidement, même sous pression.", english: "I'd say my ability to solve problems quickly, even under pressure." },
      { speaker: "Recruteuse", french: "Merci, c'est très clair. Nous vous recontacterons la semaine prochaine.", english: "Thank you, that's very clear. We'll get back to you next week." },
    ],
    question: "D'après la conversation, pourquoi ce candidat est-il qualifié pour le poste ? Réponds avec tes propres mots.",
    questionTranslation: "Based on the conversation, why is this candidate qualified for the position? Answer in your own words.",
    minSentences: 3,
    keyPoints: [
      "Trois ans d'expérience comme chef de projet, gestion d'une équipe de cinq personnes",
      "Motivé par les projets de développement durable de l'entreprise",
      "Sa plus grande qualité : résoudre des problèmes rapidement sous pression",
    ],
    modelAnswer:
      "Ce candidat a trois ans d'expérience comme chef de projet et a déjà géré une équipe de cinq personnes. Il est motivé parce que l'entreprise travaille sur des projets liés au développement durable, un sujet qui le passionne. Sa plus grande qualité est sa capacité à résoudre des problèmes rapidement, même sous pression.",
    modelAnswerTranslation:
      "This candidate has three years of experience as a project manager and has already managed a team of five people. He is motivated because the company works on projects related to sustainable development, a subject he's passionate about. His greatest strength is his ability to solve problems quickly, even under pressure.",
  },
];
