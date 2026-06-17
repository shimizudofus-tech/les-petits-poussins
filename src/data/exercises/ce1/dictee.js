// Dictée CE1 : mots plus longs, sons complexes (eau, ch, gn, oi, on…).
// Indice = image/emoji (jamais le mot écrit). audioKey lu par la voix.
const make = (word, displayWord, difficulty) => ({
  id: `ce1-dictee-${word}`,
  level: 'ce1',
  subject: 'dictee',
  word,
  displayWord,
  audioKey: word,
  imageKey: word,
  difficulty,
})

export const ce1DicteeExercises = [
  make('bateau', 'BATEAU', 1),
  make('gateau', 'GÂTEAU', 1),
  make('oiseau', 'OISEAU', 1),
  make('jardin', 'JARDIN', 1),
  make('cheval', 'CHEVAL', 1),
  make('bonbon', 'BONBON', 1),
  make('manteau', 'MANTEAU', 2),
  make('fromage', 'FROMAGE', 2),
  make('voiture', 'VOITURE', 2),
  make('girafe', 'GIRAFE', 2),
  make('etoile', 'ÉTOILE', 2),
  make('fenetre', 'FENÊTRE', 2),
  make('chateau', 'CHÂTEAU', 3),
  make('montagne', 'MONTAGNE', 3),
  make('papillon', 'PAPILLON', 3),
  make('chaussure', 'CHAUSSURE', 3),
]
