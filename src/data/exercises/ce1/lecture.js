// Lecture CE1 : phrases à trou plus riches, 3 choix. La voix lit le mot manquant.
const make = (id, sentence, answer, choices, key, difficulty) => ({
  id: `ce1-lecture-${id}`,
  level: 'ce1',
  subject: 'lecture',
  sentence,
  answer,
  choices,
  audioKey: key,
  imageKey: key,
  difficulty,
})

export const ce1LectureExercises = [
  make('cheval-galope', 'Le ___ galope dans le pré.', 'cheval', ['cheval', 'bateau', 'gâteau'], 'cheval', 1),
  make('oiseau-vole', "L'___ vole dans le ciel.", 'oiseau', ['oiseau', 'poisson', 'cheval'], 'oiseau', 1),
  make('bateau-flotte', 'Le ___ flotte sur la mer.', 'bateau', ['bateau', 'jardin', 'manteau'], 'bateau', 1),
  make('jardin-fleurs', 'Dans le ___ il y a des fleurs.', 'jardin', ['jardin', 'château', 'fromage'], 'jardin', 1),
  make('gateau-bon', 'Le ___ au chocolat est bon.', 'gâteau', ['gâteau', 'bateau', 'manteau'], 'gateau', 2),
  make('voiture-roule', 'La ___ roule sur la route.', 'voiture', ['voiture', 'girafe', 'étoile'], 'voiture', 2),
  make('papillon-vole', 'Le ___ se pose sur la fleur.', 'papillon', ['papillon', 'cheval', 'bateau'], 'papillon', 2),
  make('manteau-chaud', 'En hiver je mets mon ___.', 'manteau', ['manteau', 'bateau', 'jardin'], 'manteau', 2),
  make('etoile-brille', "L'___ brille dans la nuit.", 'étoile', ['étoile', 'oiseau', 'voiture'], 'etoile', 2),
  make('chateau-fort', 'Le roi habite dans un ___.', 'château', ['château', 'gâteau', 'bateau'], 'chateau', 3),
  make('montagne-haute', 'La ___ est très haute.', 'montagne', ['montagne', 'voiture', 'girafe'], 'montagne', 3),
  make('girafe-cou', 'La ___ a un long cou.', 'girafe', ['girafe', 'cheval', 'papillon'], 'girafe', 3),
]
