/** Dictionnaire audioKey → texte parlé (fallback TTS navigateur). */
export const AUDIO_SPEECH_MAP = {
  // Couleurs
  rouge: 'rouge',
  bleu: 'bleu',
  jaune: 'jaune',
  vert: 'vert',
  orange: 'orange',
  rose: 'rose',
  violet: 'violet',
  noir: 'noir',
  blanc: 'blanc',
  marron: 'marron',
  gris: 'gris',

  // Formes
  cercle: 'cercle',
  carre: 'carré',
  triangle: 'triangle',
  rectangle: 'rectangle',
  etoile: 'étoile',
  coeur: 'cœur',
  ovale: 'ovale',
  losange: 'losange',

  // Objets Maternelle
  pomme: 'pomme',
  banane: 'banane',
  herbe: 'herbe',
  ciel: 'ciel',
  carotte: 'carotte',
  fleur: 'fleur',
  raisin: 'raisin',
  mouton: 'mouton',
  chat: 'chat',
  soleil: 'soleil',
  arbre: 'arbre',
  souris: 'souris',
  poussin: 'poussin',
  oeuf: 'œuf',
  maison: 'maison',
  ferme: 'ferme',

  // Lettres Grande Section
  lettre_a: 'A',
  lettre_b: 'B',
  lettre_d: 'D',
  lettre_e: 'E',
  lettre_f: 'F',
  lettre_i: 'I',
  lettre_l: 'L',
  lettre_m: 'M',
  lettre_n: 'N',
  lettre_o: 'O',
  lettre_p: 'P',
  lettre_r: 'R',
  lettre_s: 'S',
  lettre_t: 'T',
  lettre_u: 'U',

  // Sons Grande Section
  son_a: 'Trouve ce qui commence par A',
  son_b: 'Trouve ce qui commence par B',
  son_d: 'Trouve ce qui commence par D',
  son_l: 'Trouve ce qui commence par L',
  son_m: 'Trouve ce qui commence par M',
  son_p: 'Trouve ce qui commence par P',
  son_r: 'Trouve ce qui commence par R',
  son_s: 'Trouve ce qui commence par S',
  son_t: 'Trouve ce qui commence par T',

  // Mots CP
  papa: 'papa',
  maman: 'maman',
  chien: 'chien',
  poule: 'poule',
  lune: 'lune',
  bebe: 'bébé',
  velo: 'vélo',
  ecole: 'école',
  ami: 'ami',
  sac: 'sac',
  lit: 'lit',
  bol: 'bol',
  rat: 'rat',
  nid: 'nid',
  cochon: 'cochon',
  vache: 'vache',

  // Feedback
  bravo: 'Bravo !',
  oups: 'Essaie encore !',
}

export function getAudioSpeechMapCount() {
  return Object.keys(AUDIO_SPEECH_MAP).length
}
