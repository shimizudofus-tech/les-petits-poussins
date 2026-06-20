// Lecture CM1 : phrases à trou, vocabulaire riche, 3 choix.
const make = (id, sentence, answer, choices, key, difficulty) => ({
  id: `cm1-lecture-${id}`,
  level: 'cm1',
  subject: 'lecture',
  sentence,
  answer,
  choices,
  audioKey: key,
  imageKey: key,
  difficulty,
})

export const cm1LectureExercises = [
  make('dragon', 'Le ___ crache du feu dans le château.', 'dragon', ['dragon', 'escargot', 'fantôme'], 'dragon', 1),
  make('guitare', 'Le musicien joue de la ___.', 'guitare', ['guitare', 'horloge', 'citrouille'], 'guitare', 1),
  make('horloge', "L'___ sonne midi.", 'horloge', ['horloge', 'guitare', 'libellule'], 'horloge', 1),
  make('escargot', "L'___ avance très lentement.", 'escargot', ['escargot', 'dragon', 'aquarium'], 'escargot', 2),
  make('aquarium', 'Les poissons nagent dans l’___.', 'aquarium', ['aquarium', 'horloge', 'parapluie'], 'aquarium', 2),
  make('chocolat', "J'adore le gâteau au ___.", 'chocolat', ['chocolat', 'trésor', 'pyjama'], 'chocolat', 2),
  make('libellule', 'La ___ vole au-dessus de la mare.', 'libellule', ['libellule', 'escargot', 'dragon'], 'libellule', 3),
  make('citrouille', 'On fait une lanterne avec une ___.', 'citrouille', ['citrouille', 'guitare', 'horloge'], 'citrouille', 3),
  make('ascenseur', 'On monte au 5e étage en ___.', 'ascenseur', ['ascenseur', 'balançoire', 'aquarium'], 'ascenseur', 3),
  make('parapluie', 'Quand il pleut, je prends mon ___.', 'parapluie', ['parapluie', 'chocolat', 'trésor'], 'parapluie', 3),
]
