import type { Phrase } from "./types";

export interface SurvivalGroup {
  title: string;
  icon: string;
  phrases: Phrase[];
}

export const SURVIVAL: SurvivalGroup[] = [
  {
    title: "Getting by",
    icon: "💬",
    phrases: [
      { fr: "Je ne comprends pas.", en: "I don't understand." },
      { fr: "Vous parlez anglais ?", en: "Do you speak English?" },
      { fr: "Pouvez-vous parler plus lentement ?", en: "Could you speak more slowly?" },
      { fr: "Comment dit-on « key » en français ?", en: "How do you say 'key' in French?" },
      { fr: "Qu'est-ce que ça veut dire ?", en: "What does that mean?" },
      { fr: "Vous pouvez l'écrire ?", en: "Could you write it down?" },
      { fr: "Je suis désolé, je suis perdu.", en: "I'm sorry, I'm lost." },
    ],
  },
  {
    title: "Emergencies",
    icon: "🚑",
    phrases: [
      { fr: "Au secours !", en: "Help!" },
      { fr: "Appelez la police !", en: "Call the police!" },
      { fr: "Appelez une ambulance !", en: "Call an ambulance!" },
      { fr: "J'ai besoin d'un médecin.", en: "I need a doctor." },
      { fr: "On m'a volé mon portefeuille.", en: "My wallet has been stolen." },
      { fr: "Où est l'hôpital le plus proche ?", en: "Where is the nearest hospital?" },
      { fr: "C'est une urgence.", en: "It's an emergency." },
    ],
  },
  {
    title: "Shopping",
    icon: "🛍️",
    phrases: [
      { fr: "Combien ça coûte ?", en: "How much does it cost?" },
      { fr: "Je regarde seulement, merci.", en: "I'm just looking, thanks." },
      { fr: "Vous avez une taille plus grande ?", en: "Do you have a bigger size?" },
      { fr: "Je peux l'essayer ?", en: "Can I try it on?" },
      { fr: "Je le prends.", en: "I'll take it." },
      { fr: "Vous acceptez les cartes ?", en: "Do you take cards?" },
      { fr: "Un sac, s'il vous plaît.", en: "A bag, please." },
    ],
  },
  {
    title: "Eating out",
    icon: "🍽️",
    phrases: [
      { fr: "Une table pour deux, s'il vous plaît.", en: "A table for two, please." },
      { fr: "La carte, s'il vous plaît.", en: "The menu, please." },
      { fr: "Je suis végétarien.", en: "I'm vegetarian." },
      { fr: "Sans gluten, s'il vous plaît.", en: "Gluten-free, please." },
      { fr: "Une carafe d'eau, s'il vous plaît.", en: "A jug of tap water, please." },
      { fr: "C'était délicieux !", en: "It was delicious!" },
      { fr: "L'addition, s'il vous plaît.", en: "The bill, please." },
    ],
  },
  {
    title: "Getting around",
    icon: "🚆",
    phrases: [
      { fr: "Où est la station de métro ?", en: "Where is the metro station?" },
      { fr: "Un ticket, s'il vous plaît.", en: "One ticket, please." },
      { fr: "Ce bus va au centre-ville ?", en: "Does this bus go to the city centre?" },
      { fr: "À quelle heure part le prochain train ?", en: "What time does the next train leave?" },
      { fr: "Pouvez-vous m'appeler un taxi ?", en: "Could you call me a taxi?" },
      { fr: "Arrêtez-vous ici, s'il vous plaît.", en: "Stop here, please." },
      { fr: "Où sont les toilettes ?", en: "Where are the toilets?" },
    ],
  },
];
