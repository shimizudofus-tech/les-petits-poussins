// Dictée CM1 : mots longs / orthographe complexe (gn, ph, ill, ç…).
const make = (word, displayWord, difficulty) => ({
  id: `cm1-dictee-${word}`,
  level: 'cm1',
  subject: 'dictee',
  word,
  displayWord,
  audioKey: word,
  imageKey: word,
  difficulty,
})

export const cm1DicteeExercises = [
  make('dragon', 'DRAGON', 1),
  make('guitare', 'GUITARE', 1),
  make('horloge', 'HORLOGE', 1),
  make('pyjama', 'PYJAMA', 1),
  make('tresor', 'TRÉSOR', 1),
  make('fantome', 'FANTÔME', 2),
  make('escargot', 'ESCARGOT', 2),
  make('chocolat', 'CHOCOLAT', 2),
  make('aquarium', 'AQUARIUM', 2),
  make('libellule', 'LIBELLULE', 2),
  make('citrouille', 'CITROUILLE', 3),
  make('balancoire', 'BALANÇOIRE', 3),
  make('ascenseur', 'ASCENSEUR', 3),
  make('parapluie', 'PARAPLUIE', 3),
]
