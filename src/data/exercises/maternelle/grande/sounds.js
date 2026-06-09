const OBJ = {
  avion: { id: 'avion', emoji: '✈️', label: 'Avion' },
  arbre: { id: 'arbre', emoji: '🌳', label: 'Arbre' },
  maison: { id: 'maison', emoji: '🏠', label: 'Maison' },
  maman: { id: 'maman', emoji: '👩', label: 'Maman' },
  papa: { id: 'papa', emoji: '👨', label: 'Papa' },
  poule: { id: 'poule', emoji: '🐔', label: 'Poule' },
  lune: { id: 'lune', emoji: '🌙', label: 'Lune' },
  lapin: { id: 'lapin', emoji: '🐰', label: 'Lapin' },
  soleil: { id: 'soleil', emoji: '☀️', label: 'Soleil' },
  sac: { id: 'sac', emoji: '🎒', label: 'Sac' },
  robot: { id: 'robot', emoji: '🤖', label: 'Robot' },
  raisin: { id: 'raisin', emoji: '🍇', label: 'Raisin' },
  bateau: { id: 'bateau', emoji: '⛵', label: 'Bateau' },
  dinosaure: { id: 'dinosaure', emoji: '🦕', label: 'Dinosaure' },
  tomate: { id: 'tomate', emoji: '🍅', label: 'Tomate' },
  chat: { id: 'chat', emoji: '🐱', label: 'Chat' },
  velo: { id: 'velo', emoji: '🚲', label: 'Vélo' },
}

function findSound(id, targetSound, correctKey, distractorKeys, difficulty) {
  return {
    id,
    section: 'grande',
    level: 'maternelle',
    subject: 'sounds',
    type: 'findSound',
    targetSound,
    correct: OBJ[correctKey],
    distractors: distractorKeys.map((k) => OBJ[k]),
    difficulty,
    audioKey: `son_${targetSound.toLowerCase()}`,
  }
}

export const grandeSoundExercises = [
  findSound('mat-grd-s-a-avion', 'A', 'avion', ['soleil', 'lune'], 1),
  findSound('mat-grd-s-a-arbre', 'A', 'arbre', ['maison', 'lapin'], 1),
  findSound('mat-grd-s-m-maison', 'M', 'maison', ['chat', 'velo'], 1),
  findSound('mat-grd-s-m-maman', 'M', 'maman', ['papa', 'poule'], 1),
  findSound('mat-grd-s-p-poule', 'P', 'poule', ['lapin', 'lune'], 1),
  findSound('mat-grd-s-p-papa', 'P', 'papa', ['maman', 'sac'], 1),

  findSound('mat-grd-s-l-lune', 'L', 'lune', ['soleil', 'tomate'], 2),
  findSound('mat-grd-s-l-lapin', 'L', 'lapin', ['poule', 'sac'], 2),
  findSound('mat-grd-s-r-raisin', 'R', 'raisin', ['robot', 'lapin'], 2),
  findSound('mat-grd-s-r-robot', 'R', 'robot', ['raisin', 'sac'], 2),
  findSound('mat-grd-s-s-soleil', 'S', 'soleil', ['lune', 'maison'], 2),
  findSound('mat-grd-s-s-sac', 'S', 'sac', ['soleil', 'papa'], 2),

  findSound('mat-grd-s-b-bateau', 'B', 'bateau', ['dinosaure', 'tomate'], 3),
  findSound('mat-grd-s-d-dino', 'D', 'dinosaure', ['bateau', 'tomate'], 3),
  findSound('mat-grd-s-t-tomate', 'T', 'tomate', ['bateau', 'dinosaure'], 3),
]
