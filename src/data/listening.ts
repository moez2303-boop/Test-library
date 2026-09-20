import type { ListeningClip } from "../types";

let counter = 0;
function q(prompt: string, options: string[], correctIndex: number) {
  counter += 1;
  return { id: `lq${counter}`, prompt, options, correctIndex };
}

const SOURCE = "1 jour, 1 question — France Télévisions / Milan Presse";

export const listeningClips: ListeningClip[] = [
  {
    id: "vendredi-13",
    title: "Pourquoi c'est un jour spécial, vendredi 13 ?",
    level: "A2",
    youtubeId: "_YuWFvVizYs",
    start: 0,
    end: 60,
    topic: "Why Friday the 13th is considered a special (lucky or unlucky) day.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=_YuWFvVizYs",
    questions: [
      q("Quel jour et quel numéro sont au centre de cette vidéo ?", ["Lundi 1", "Vendredi 13", "Dimanche 7", "Mardi 10"], 1),
      q("En général, vendredi 13 est associé à l'idée de...", ["la cuisine française", "la chance ou la malchance", "les vacances scolaires", "le sport"], 1),
      q("Le mot \"la superstition\" veut dire...", ["une croyance sans preuve scientifique", "une recette de cuisine", "un jour férié", "une règle de grammaire"], 0),
    ],
  },
  {
    id: "fortnite",
    title: "Pourquoi le jeu Fortnite est-il aussi connu ?",
    level: "A2",
    youtubeId: "Dyzo1AGj1TE",
    start: 0,
    end: 60,
    topic: "Why the video game Fortnite became so popular with young people.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=Dyzo1AGj1TE",
    questions: [
      q("Qu'est-ce que Fortnite ?", ["Un film", "Un jeu vidéo", "Une chanson", "Un livre"], 1),
      q("La vidéo explique pourquoi ce jeu est très...", ["cher", "ancien", "connu", "difficile à trouver"], 2),
      q("Le mot \"un jeu vidéo\" signifie...", ["a video game", "a board game", "a TV show", "a music video"], 0),
    ],
  },
  {
    id: "gout",
    title: "D'où vient le goût ?",
    level: "B1",
    youtubeId: "G87BOIr4zhs",
    start: 0,
    end: 60,
    topic: "How the sense of taste works and where it comes from.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=G87BOIr4zhs",
    questions: [
      q("De quel sens parle cette vidéo ?", ["La vue", "L'ouïe", "Le goût", "Le toucher"], 2),
      q("Quelle partie du corps joue le rôle principal dans le goût ?", ["Le nez", "La langue", "Les oreilles", "Les yeux"], 1),
      q("\"Le goût\" se traduit en anglais par...", ["smell", "touch", "taste", "hearing"], 2),
    ],
  },
  {
    id: "oceans",
    title: "Pourquoi faut-il protéger les océans ?",
    level: "B1",
    youtubeId: "jlRE6JeGGp8",
    start: 0,
    end: 60,
    topic: "Why the oceans need to be protected from pollution and other threats.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=jlRE6JeGGp8",
    questions: [
      q("Quel est le sujet principal de cette vidéo ?", ["La cuisine de la mer", "La protection des océans", "Les vacances à la plage", "La météo"], 1),
      q("Les océans sont souvent menacés par...", ["la pollution", "la musique", "le tourisme scolaire", "la peinture"], 0),
      q("Le verbe \"protéger\" signifie...", ["to sell", "to protect", "to pollute", "to explore"], 1),
    ],
  },
  {
    id: "ecrans",
    title: "Pourquoi passe-t-on de plus en plus de temps sur les écrans ?",
    level: "B1",
    youtubeId: "JXyBwzw9nWw",
    start: 0,
    end: 60,
    topic: "Why people spend more and more time in front of screens.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=JXyBwzw9nWw",
    questions: [
      q("De quoi parle cette vidéo ?", ["Du temps passé sur les écrans", "Des écrans de cinéma anciens", "De la fabrication des téléphones", "Des écoles sans ordinateur"], 0),
      q("\"Les écrans\" désigne par exemple...", ["les livres et les journaux", "les téléphones, ordinateurs et télévisions", "les tableaux d'art", "les vêtements"], 1),
      q("L'expression \"de plus en plus\" signifie...", ["de moins en moins", "toujours pareil", "de manière croissante", "rarement"], 2),
    ],
  },
  {
    id: "apollo11",
    title: "C'est quoi Apollo 11 ?",
    level: "B2",
    youtubeId: "AZ72v9dwcVg",
    start: 0,
    end: 60,
    topic: "What the Apollo 11 mission was and why it is historically important.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=AZ72v9dwcVg",
    questions: [
      q("Apollo 11 est surtout connu pour...", ["le premier vol commercial", "le premier alunissage habité", "le premier satellite", "la première fusée européenne"], 1),
      q("Quel astronaute est étroitement associé à Apollo 11 ?", ["Youri Gagarine", "Neil Armstrong", "Thomas Pesquet", "Buzz Lightyear"], 1),
      q("Le verbe \"atterrir\" (ou \"alunir\" sur la Lune) signifie...", ["to take off", "to land", "to float", "to explode"], 1),
    ],
  },
  {
    id: "guerre-mondiale",
    title: "Pourquoi y a-t-il eu la Première Guerre mondiale ?",
    level: "B2",
    youtubeId: "t-rPJUkjbvQ",
    start: 0,
    end: 60,
    topic: "The causes behind the outbreak of the First World War.",
    source: SOURCE,
    sourceUrl: "https://www.youtube.com/watch?v=t-rPJUkjbvQ",
    questions: [
      q("Cette vidéo explique les causes de...", ["la Révolution française", "la Première Guerre mondiale", "la construction de la tour Eiffel", "la crise économique de 2008"], 1),
      q("La Première Guerre mondiale a commencé en quelle année ?", ["1870", "1914", "1939", "1918"], 1),
      q("\"Une guerre mondiale\" signifie...", ["a local conflict", "a world war", "a trade agreement", "a sports competition"], 1),
    ],
  },
];
