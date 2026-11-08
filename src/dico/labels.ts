/** French labels for JMdict parts of speech and fields. */

export const POS_FR: Record<string, string> = {
  n: "nom",
  vs: "nom verbal (avec する)",
  exp: "expression",
  vt: "transitif",
  vi: "intransitif",
  "adj-no": "nom pouvant prendre の",
  "adj-na": "adjectif en な",
  v1: "verbe ichidan",
  "v1-s": "verbe ichidan (くれる)",
  adv: "adverbe",
  "adv-to": "adverbe en と",
  "adj-i": "adjectif en い",
  "adj-ix": "adjectif en い (いい/よい)",
  "adj-f": "nom ou verbe en fonction prénominale",
  "adj-t": "adjectif en たる",
  "adj-pn": "adjectif prénominal (連体詞)",
  "adj-ku": "adjectif en く (archaïque)",
  "adj-shiku": "adjectif en しく (archaïque)",
  "adj-nari": "adjectif en なり (archaïque)",
  v5u: "verbe godan en -u",
  "v5u-s": "verbe godan en -u (spécial)",
  v5k: "verbe godan en -ku",
  "v5k-s": "verbe godan (行く)",
  v5g: "verbe godan en -gu",
  v5s: "verbe godan en -su",
  v5t: "verbe godan en -tsu",
  v5n: "verbe godan en -nu",
  v5b: "verbe godan en -bu",
  v5m: "verbe godan en -mu",
  v5r: "verbe godan en -ru",
  "v5r-i": "verbe godan en -ru (irrégulier)",
  v5aru: "verbe godan en -aru (honorifique)",
  vk: "verbe くる (irrégulier)",
  "vs-s": "verbe en する (spécial)",
  "vs-i": "verbe en する",
  "vs-c": "verbe en す (ancien する)",
  vz: "verbe ichidan en -zuru",
  vr: "verbe irrégulier en -ri",
  vn: "verbe irrégulier en -nu",
  v4: "verbe yodan (archaïque)",
  v2: "verbe nidan (archaïque)",
  "v-unspec": "verbe",
  "n-suf": "nom, suffixe",
  "n-pref": "nom, préfixe",
  suf: "suffixe",
  pref: "préfixe",
  int: "interjection",
  pn: "pronom",
  prt: "particule",
  conj: "conjonction",
  ctr: "classificateur",
  num: "numéral",
  "aux-v": "verbe auxiliaire",
  "aux-adj": "adjectif auxiliaire",
  aux: "auxiliaire",
  cop: "copule",
  unc: "non classé",
};

export const FIELD_FR: Record<string, string> = {
  comp: "informatique", med: "médecine", food: "cuisine", Buddh: "bouddhisme", math: "mathématiques",
  chem: "chimie", law: "droit", anat: "anatomie", physics: "physique", music: "musique", sports: "sport",
  astron: "astronomie", ling: "linguistique", baseb: "baseball", sumo: "sumo", biol: "biologie",
  gramm: "grammaire", finc: "finance", geol: "géologie", bot: "botanique", mahj: "mahjong",
  internet: "internet", mil: "militaire", go: "go", vidg: "jeux vidéo", min: "minéralogie",
  MA: "arts martiaux", phil: "philosophie", Christn: "christianisme", bus: "commerce", print: "imprimerie",
  cards: "cartes", tradem: "marque", econ: "économie", Shinto: "shintoïsme", archit: "architecture",
  shogi: "shōgi", psy: "psychiatrie", photo: "photographie", golf: "golf", pharm: "pharmacie",
  physiol: "physiologie", hanaf: "hanafuda", art: "art", biochem: "biochimie", zool: "zoologie",
  electr: "électronique", psych: "psychologie", telec: "télécommunications", elec: "électricité",
  genet: "génétique", cloth: "vêtements", aviat: "aviation", grmyth: "mythologie grecque",
  geom: "géométrie", logic: "logique", met: "météorologie", fish: "pêche", engr: "ingénierie",
  horse: "équitation", stockm: "bourse", rail: "chemin de fer", film: "cinéma", boxing: "boxe",
  ski: "ski", dent: "dentisterie", agric: "agriculture", archeol: "archéologie",
  jpmyth: "mythologie japonaise", kabuki: "kabuki", stat: "statistique", prowres: "catch",
  rommyth: "mythologie romaine", noh: "nô", politics: "politique", psyanal: "psychanalyse",
  tv: "télévision", figskt: "patinage", geogr: "géographie", surg: "chirurgie", ent: "entomologie",
  civeng: "génie civil", ecol: "écologie", ornith: "ornithologie", chmyth: "mythologie chinoise",
  vet: "vétérinaire", embryo: "embryologie", cryst: "cristallographie", gardn: "jardinage",
  mining: "mines", motor: "automobile", mech: "mécanique", audvid: "audiovisuel", manga: "manga",
  pathol: "pathologie", paleo: "paléontologie",
};

export const THEME_FR: Record<string, string> = {
  nature: "nature", societe: "société", travail: "travail", ville: "ville", maison: "maison",
  emotions: "émotions", corps: "corps", famille: "famille", sciences: "sciences", arts: "arts",
  nourriture: "nourriture", ecole: "école", temps: "temps", loisirs: "loisirs", combat: "combat",
  religion: "religion",
};

export function gradeLabel(g?: number): string | null {
  if (!g) return null;
  if (g <= 6) return `Kyōiku, ${g}ᵉ année`;
  if (g === 8) return "Jōyō (collège)";
  if (g >= 9) return "Jinmeiyō (noms propres)";
  return null;
}

/** "Mot courant" badge from the frequency bucket. */
export function commonLabel(c?: number): string | null {
  if (!c) return null;
  if (c <= 20) return "très courant";
  if (c <= 60) return "courant";
  return null;
}
