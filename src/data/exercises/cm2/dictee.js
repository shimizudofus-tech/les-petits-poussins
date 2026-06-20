// Dictée CM2 : mots difficiles (consonnes doubles, h, ph, sons rares).
const make = (word, displayWord, difficulty) => ({
  id: `cm2-dictee-${word}`,
  level: 'cm2',
  subject: 'dictee',
  word,
  displayWord,
  audioKey: word,
  imageKey: word,
  difficulty,
})

export const cm2DicteeExercises = [
  make('chevalier', 'CHEVALIER', 1),
  make('tournevis', 'TOURNEVIS', 1),
  make('perroquet', 'PERROQUET', 1),
  make('squelette', 'SQUELETTE', 1),
  make('parapente', 'PARAPENTE', 2),
  make('trampoline', 'TRAMPOLINE', 2),
  make('aspirateur', 'ASPIRATEUR', 2),
  make('gymnastique', 'GYMNASTIQUE', 2),
  make('rhinoceros', 'RHINOCÉROS', 3),
  make('hippopotame', 'HIPPOPOTAME', 3),
  make('helicoptere', 'HÉLICOPTÈRE', 3),
  make('dictionnaire', 'DICTIONNAIRE', 3),
]
