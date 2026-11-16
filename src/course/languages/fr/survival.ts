import type { SurvivalGroup } from "../types";


export const SURVIVAL: SurvivalGroup[] = [
  {
    title: "Getting by",
    icon: "💬",
    phrases: [
      { text: "Je ne comprends pas.", en: "I don't understand." },
      { text: "Vous parlez anglais ?", en: "Do you speak English?" },
      { text: "Pouvez-vous parler plus lentement ?", en: "Could you speak more slowly?" },
      { text: "Comment dit-on « key » en français ?", en: "How do you say 'key' in French?" },
      { text: "Qu'est-ce que ça veut dire ?", en: "What does that mean?" },
      { text: "Vous pouvez l'écrire ?", en: "Could you write it down?" },
      { text: "Je suis désolé, je suis perdu.", en: "I'm sorry, I'm lost." },
    ],
  },
  {
    title: "Emergencies",
    icon: "🚑",
    phrases: [
      { text: "Au secours !", en: "Help!" },
      { text: "Appelez la police !", en: "Call the police!" },
      { text: "Appelez une ambulance !", en: "Call an ambulance!" },
      { text: "J'ai besoin d'un médecin.", en: "I need a doctor." },
      { text: "On m'a volé mon portefeuille.", en: "My wallet has been stolen." },
      { text: "Où est l'hôpital le plus proche ?", en: "Where is the nearest hospital?" },
      { text: "C'est une urgence.", en: "It's an emergency." },
    ],
  },
  {
    title: "Shopping",
    icon: "🛍️",
    phrases: [
      { text: "Combien ça coûte ?", en: "How much does it cost?" },
      { text: "Je regarde seulement, merci.", en: "I'm just looking, thanks." },
      { text: "Vous avez une taille plus grande ?", en: "Do you have a bigger size?" },
      { text: "Je peux l'essayer ?", en: "Can I try it on?" },
      { text: "Je le prends.", en: "I'll take it." },
      { text: "Vous acceptez les cartes ?", en: "Do you take cards?" },
      { text: "Un sac, s'il vous plaît.", en: "A bag, please." },
    ],
  },
  {
    title: "Eating out",
    icon: "🍽️",
    phrases: [
      { text: "Une table pour deux, s'il vous plaît.", en: "A table for two, please." },
      { text: "La carte, s'il vous plaît.", en: "The menu, please." },
      { text: "Je suis végétarien.", en: "I'm vegetarian." },
      { text: "Sans gluten, s'il vous plaît.", en: "Gluten-free, please." },
      { text: "Une carafe d'eau, s'il vous plaît.", en: "A jug of tap water, please." },
      { text: "C'était délicieux !", en: "It was delicious!" },
      { text: "L'addition, s'il vous plaît.", en: "The bill, please." },
    ],
  },
  {
    title: "Getting around",
    icon: "🚆",
    phrases: [
      { text: "Où est la station de métro ?", en: "Where is the metro station?" },
      { text: "Un ticket, s'il vous plaît.", en: "One ticket, please." },
      { text: "Ce bus va au centre-ville ?", en: "Does this bus go to the city centre?" },
      { text: "À quelle heure part le prochain train ?", en: "What time does the next train leave?" },
      { text: "Pouvez-vous m'appeler un taxi ?", en: "Could you call me a taxi?" },
      { text: "Arrêtez-vous ici, s'il vous plaît.", en: "Stop here, please." },
      { text: "Où sont les toilettes ?", en: "Where are the toilets?" },
    ],
  },
];
