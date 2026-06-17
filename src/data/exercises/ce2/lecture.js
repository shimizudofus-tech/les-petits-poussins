// Lecture CE2 : phrases à trou plus riches, 3 choix. La voix lit le mot manquant.
const make = (id, sentence, answer, choices, key, difficulty) => ({
  id: `ce2-lecture-${id}`,
  level: 'ce2',
  subject: 'lecture',
  sentence,
  answer,
  choices,
  audioKey: key,
  imageKey: key,
  difficulty,
})

export const ce2LectureExercises = [
  make('renard-ruse', 'Le ___ est un animal rusé.', 'renard', ['renard', 'dauphin', 'tortue'], 'renard', 1),
  make('dauphin-nage', 'Le ___ nage vite dans la mer.', 'dauphin', ['dauphin', 'renard', 'écureuil'], 'dauphin', 1),
  make('abeille-miel', "L'___ fabrique du miel.", 'abeille', ['abeille', 'tortue', 'crocodile'], 'abeille', 1),
  make('ecureuil-noisettes', "L'___ cache des noisettes.", 'écureuil', ['écureuil', 'renard', 'dauphin'], 'ecureuil', 2),
  make('elephant-trompe', "L'___ a une longue trompe.", 'éléphant', ['éléphant', 'kangourou', 'crocodile'], 'elephant', 2),
  make('crocodile-dents', 'Le ___ a de grandes dents.', 'crocodile', ['crocodile', 'dauphin', 'abeille'], 'crocodile', 2),
  make('parapluie-pluie', "Quand il pleut, je prends mon ___.", 'parapluie', ['parapluie', 'parasol', 'manteau'], 'parapluie', 2),
  make('kangourou-saute', 'Le ___ saute très haut.', 'kangourou', ['kangourou', 'éléphant', 'tortue'], 'kangourou', 3),
  make('tonnerre-orage', "Pendant l'orage, on entend le ___.", 'tonnerre', ['tonnerre', 'parapluie', 'dauphin'], 'tonnerre', 3),
  make('grenouille-mare', 'La ___ saute dans la mare.', 'grenouille', ['grenouille', 'tortue', 'abeille'], 'grenouille', 3),
  make('chouette-nuit', 'La ___ chasse pendant la nuit.', 'chouette', ['chouette', 'renard', 'écureuil'], 'chouette', 3),
]
