// Dictée CE2 : mots plus difficiles (consonnes doubles, sons rares, mots longs).
// Indice = image/emoji (jamais le mot écrit). audioKey lu par la voix.
const make = (word, displayWord, difficulty) => ({
  id: `ce2-dictee-${word}`,
  level: 'ce2',
  subject: 'dictee',
  word,
  displayWord,
  audioKey: word,
  imageKey: word,
  difficulty,
})

export const ce2DicteeExercises = [
  make('renard', 'RENARD', 1),
  make('dauphin', 'DAUPHIN', 1),
  make('tortue', 'TORTUE', 1),
  make('abeille', 'ABEILLE', 1),
  make('elephant', 'ÉLÉPHANT', 2),
  make('ecureuil', 'ÉCUREUIL', 2),
  make('parapluie', 'PARAPLUIE', 2),
  make('dinosaure', 'DINOSAURE', 2),
  make('crocodile', 'CROCODILE', 2),
  make('kangourou', 'KANGOUROU', 2),
  make('herisson', 'HÉRISSON', 3),
  make('tonnerre', 'TONNERRE', 3),
  make('grenouille', 'GRENOUILLE', 3),
  make('coquillage', 'COQUILLAGE', 3),
  make('pingouin', 'PINGOUIN', 3),
  make('chouette', 'CHOUETTE', 3),
]
