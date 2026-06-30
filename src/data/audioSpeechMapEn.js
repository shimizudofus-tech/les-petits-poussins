/**
 * audioKey → texte parlé ANGLAIS (mode anglais).
 * Règle : tout est en anglais SAUF le vocabulaire de lecture/dictée français
 * (mots CP/CE/CM) qui reste en français — le mode anglais sert aussi à
 * apprendre le français.
 */
export const AUDIO_SPEECH_MAP_EN = {
  // Nombres
  0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',

  // Couleurs
  rouge: 'red', bleu: 'blue', jaune: 'yellow', vert: 'green', orange: 'orange',
  rose: 'pink', violet: 'purple', noir: 'black', blanc: 'white', marron: 'brown', gris: 'grey',

  // Formes
  cercle: 'circle', carre: 'square', triangle: 'triangle', rectangle: 'rectangle',
  etoile: 'star', coeur: 'heart', ovale: 'oval', losange: 'diamond', rond: 'round',

  // Objets / animaux maternelle (anglais)
  pomme: 'apple', banane: 'banana', herbe: 'grass', ciel: 'sky', nuage: 'cloud',
  carotte: 'carrot', fleur: 'flower', raisin: 'grapes', mouton: 'sheep', chat: 'cat',
  soleil: 'sun', arbre: 'tree', souris: 'mouse', poussin: 'chick', lapin: 'rabbit',
  canard: 'duck', cheval: 'horse', grenouille: 'frog', poisson: 'fish', oeuf: 'egg',
  maison: 'house', ferme: 'farm', caillou: 'pebble', ballon: 'ball', roue: 'wheel',
  fenetre: 'window', cadeau: 'gift', montagne: 'mountain', tente: 'tent',

  // Consignes couleurs
  trouve_rouge: 'Find the red colour', trouve_bleu: 'Find the blue colour',
  trouve_jaune: 'Find the yellow colour', trouve_vert: 'Find the green colour',
  trouve_orange: 'Find the orange colour', trouve_rose: 'Find the pink colour',
  trouve_violet: 'Find the purple colour', trouve_noir: 'Find the black colour',
  trouve_blanc: 'Find the white colour', trouve_marron: 'Find the brown colour',
  trouve_gris: 'Find the grey object',
  trouve_objet_rouge: 'Find the red object', trouve_objet_bleu: 'Find the blue object',
  trouve_objet_jaune: 'Find the yellow object', trouve_objet_vert: 'Find the green object',
  trouve_objet_orange: 'Find the orange object', trouve_objet_rose: 'Find the pink object',
  trouve_objet_violet: 'Find the purple object', trouve_objet_noir: 'Find the black object',
  trouve_objet_blanc: 'Find the white object', trouve_objet_marron: 'Find the brown object',
  trouve_objet_gris: 'Find the grey object',
  quelle_couleur_pomme: 'What colour is the apple?', quelle_couleur_banane: 'What colour is the banana?',
  quelle_couleur_herbe: 'What colour is the grass?', quelle_couleur_ciel: 'What colour is the sky?',
  quelle_couleur_carotte: 'What colour is the carrot?', quelle_couleur_fleur: 'What colour is the flower?',
  quelle_couleur_raisin: 'What colour are the grapes?', quelle_couleur_mouton: 'What colour is the sheep?',
  quelle_couleur_chat: 'What colour is the cat?', quelle_couleur_soleil: 'What colour is the sun?',
  quelle_couleur_arbre: 'What colour is the tree?', quelle_couleur_souris: 'What colour is the mouse?',
  quelle_couleur_nuage: 'What colour is the cloud?', quelle_couleur_caillou: 'What colour is the pebble?',

  // Consignes formes
  trouve_cercle: 'Find the circle', trouve_carre: 'Find the square', trouve_triangle: 'Find the triangle',
  trouve_rectangle: 'Find the rectangle', trouve_etoile: 'Find the star', trouve_coeur: 'Find the heart',
  trouve_ovale: 'Find the oval', trouve_losange: 'Find the diamond',

  // Consignes comptage
  compte: 'Count', compte_poussin: 'Count the chicks', compte_oeuf: 'Count the eggs',
  compte_fleur: 'Count the flowers', compte_pomme: 'Count the apples', compte_etoile: 'Count the stars',
  le_plus: 'Where are there the most?', le_moins: 'Where are there the fewest?',

  // Consignes générales
  remets_image: 'Put the pieces back in the right place.', continue_suite: 'Continue the pattern',
  trouve_intrus: 'Find the odd one out', ecoute_et_trouve: 'Listen and find',

  // Lettres
  lettre_a: 'A', lettre_b: 'B', lettre_d: 'D', lettre_e: 'E', lettre_f: 'F', lettre_i: 'I',
  lettre_l: 'L', lettre_m: 'M', lettre_n: 'N', lettre_o: 'O', lettre_p: 'P', lettre_r: 'R',
  lettre_s: 'S', lettre_t: 'T', lettre_u: 'U',

  // Sons
  son_a: 'Find something that starts with A', son_b: 'Find something that starts with B',
  son_d: 'Find something that starts with D', son_l: 'Find something that starts with L',
  son_m: 'Find something that starts with M', son_p: 'Find something that starts with P',
  son_r: 'Find something that starts with R', son_s: 'Find something that starts with S',
  son_t: 'Find something that starts with T',

  // ── Vocabulaire lecture/dictée : RESTE EN FRANÇAIS ──
  papa: 'papa', maman: 'maman', chien: 'chien', poule: 'poule', lune: 'lune', bebe: 'bébé',
  velo: 'vélo', ecole: 'école', ami: 'ami', sac: 'sac', lit: 'lit', bol: 'bol', rat: 'rat',
  nid: 'nid', cochon: 'cochon', vache: 'vache',
  bateau: 'bateau', gateau: 'gâteau', oiseau: 'oiseau', jardin: 'jardin', bonbon: 'bonbon',
  manteau: 'manteau', fromage: 'fromage', voiture: 'voiture', girafe: 'girafe', chateau: 'château',
  papillon: 'papillon', chaussure: 'chaussure', renard: 'renard', dauphin: 'dauphin', tortue: 'tortue',
  abeille: 'abeille', elephant: 'éléphant', ecureuil: 'écureuil', parapluie: 'parapluie',
  dinosaure: 'dinosaure', crocodile: 'crocodile', kangourou: 'kangourou', herisson: 'hérisson',
  tonnerre: 'tonnerre', coquillage: 'coquillage', pingouin: 'pingouin', chouette: 'chouette',
  guitare: 'guitare', horloge: 'horloge', pyjama: 'pyjama', tresor: 'trésor', fantome: 'fantôme',
  escargot: 'escargot', chocolat: 'chocolat', aquarium: 'aquarium', libellule: 'libellule',
  citrouille: 'citrouille', balancoire: 'balançoire', ascenseur: 'ascenseur', chevalier: 'chevalier',
  tournevis: 'tournevis', perroquet: 'perroquet', squelette: 'squelette', parapente: 'parapente',
  trampoline: 'trampoline', aspirateur: 'aspirateur', gymnastique: 'gymnastique', rhinoceros: 'rhinocéros',
  hippopotame: 'hippopotame', helicoptere: 'hélicoptère', dictionnaire: 'dictionnaire', dragon: 'dragon',

  // Consignes génériques
  ecoute_bien: 'Listen carefully', choisis_bonne_reponse: 'Choose the right answer',

  // Feedback
  bravo: 'Well done!', excellent: 'Excellent!', bien_joue: 'Great job!',
  continue_comme_ca: 'Keep it up!', oups: 'Try again!',
}
