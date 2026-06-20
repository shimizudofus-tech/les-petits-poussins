// Lecture CM2 : phrases plus longues, vocabulaire avancé, 3 choix.
const make = (id, sentence, answer, choices, key, difficulty) => ({
  id: `cm2-lecture-${id}`,
  level: 'cm2',
  subject: 'lecture',
  sentence,
  answer,
  choices,
  audioKey: key,
  imageKey: key,
  difficulty,
})

export const cm2LectureExercises = [
  make('chevalier', 'Le ___ porte une armure et une épée.', 'chevalier', ['chevalier', 'perroquet', 'tournevis'], 'chevalier', 1),
  make('perroquet', 'Le ___ répète tout ce qu’on dit.', 'perroquet', ['perroquet', 'rhinocéros', 'squelette'], 'perroquet', 1),
  make('tournevis', 'Je serre la vis avec un ___.', 'tournevis', ['tournevis', 'aspirateur', 'trampoline'], 'tournevis', 1),
  make('trampoline', 'Les enfants sautent sur le ___.', 'trampoline', ['trampoline', 'parapente', 'chevalier'], 'trampoline', 2),
  make('aspirateur', 'Maman nettoie le tapis avec l’___.', 'aspirateur', ['aspirateur', 'tournevis', 'perroquet'], 'aspirateur', 2),
  make('rhinoceros', 'Le ___ a une grosse corne sur le nez.', 'rhinocéros', ['rhinocéros', 'hippopotame', 'chevalier'], 'rhinoceros', 2),
  make('hippopotame', "L'___ se baigne dans la rivière.", 'hippopotame', ['hippopotame', 'rhinocéros', 'perroquet'], 'hippopotame', 3),
  make('helicoptere', "L'___ décolle à la verticale.", 'hélicoptère', ['hélicoptère', 'parapente', 'aspirateur'], 'helicoptere', 3),
  make('gymnastique', 'Elle fait de la ___ à la salle de sport.', 'gymnastique', ['gymnastique', 'trampoline', 'squelette'], 'gymnastique', 3),
  make('squelette', 'Le corps humain a un ___ de 206 os.', 'squelette', ['squelette', 'chevalier', 'perroquet'], 'squelette', 3),
]
