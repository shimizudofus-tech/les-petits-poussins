/** Grilles par section et difficulté (mobile 360px). */
export const SECTION_PUZZLE_GRIDS = {
  petite: {
    1: { rows: 2, cols: 2, pieceCount: 4 },
    2: { rows: 2, cols: 3, pieceCount: 6 },
    3: { rows: 3, cols: 4, pieceCount: 12 },
  },
  moyenne: {
    1: { rows: 2, cols: 3, pieceCount: 6 },
    2: { rows: 3, cols: 4, pieceCount: 12 },
    3: { rows: 3, cols: 5, pieceCount: 15 },
  },
  grande: {
    1: { rows: 3, cols: 4, pieceCount: 12 },
    2: { rows: 3, cols: 5, pieceCount: 15 },
    3: { rows: 4, cols: 5, pieceCount: 20 },
  },
}

const ALL_SECTIONS = ['petite', 'moyenne', 'grande']

/**
 * Catalogue de scènes procédurales — images générées à la volée (SVG).
 * 30 scènes : 12 animaux, 2–3 variantes chacun.
 */
export const PUZZLE_CATALOG = [
  {
    id: 'farm-chick-001',
    title: 'Le poussin',
    category: 'farm',
    animal: 'chick',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poussin',
    tags: ['animal', 'ferme', 'facile'],
    scene: { animal: 'chick', background: 'meadow', props: ['sun'], variant: 1 },
  },
  {
    id: 'farm-chick-002',
    title: 'Poussin et œuf',
    category: 'farm',
    animal: 'chick',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poussin',
    tags: ['animal', 'ferme'],
    scene: { animal: 'chick', background: 'meadow', props: ['egg', 'flower'], variant: 2 },
  },
  {
    id: 'farm-chick-003',
    title: 'Poussin à la barrière',
    category: 'farm',
    animal: 'chick',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poussin',
    tags: ['animal', 'ferme'],
    scene: { animal: 'chick', background: 'farm', props: ['fence', 'cloud'], variant: 1 },
  },
  {
    id: 'farm-hen-001',
    title: 'La poule',
    category: 'farm',
    animal: 'hen',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poule',
    tags: ['animal', 'ferme'],
    scene: { animal: 'hen', background: 'farm', props: ['sun'], variant: 1 },
  },
  {
    id: 'farm-hen-002',
    title: 'Poule au pré',
    category: 'farm',
    animal: 'hen',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poule',
    tags: ['animal', 'ferme'],
    scene: { animal: 'hen', background: 'meadow', props: ['flower'], variant: 2 },
  },
  {
    id: 'farm-cow-001',
    title: 'La vache',
    category: 'farm',
    animal: 'cow',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'vache',
    tags: ['animal', 'ferme'],
    scene: { animal: 'cow', background: 'meadow', props: ['sun'], variant: 1 },
  },
  {
    id: 'farm-cow-002',
    title: 'Vache à la ferme',
    category: 'farm',
    animal: 'cow',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'vache',
    tags: ['animal', 'ferme'],
    scene: { animal: 'cow', background: 'farm', props: ['fence'], variant: 2 },
  },
  {
    id: 'farm-pig-001',
    title: 'Le cochon',
    category: 'farm',
    animal: 'pig',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'cochon',
    tags: ['animal', 'ferme'],
    scene: { animal: 'pig', background: 'farm', props: ['apple'], variant: 1 },
  },
  {
    id: 'farm-pig-002',
    title: 'Cochon au jardin',
    category: 'farm',
    animal: 'pig',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'cochon',
    tags: ['animal', 'ferme'],
    scene: { animal: 'pig', background: 'garden', props: ['flower', 'apple'], variant: 2 },
  },
  {
    id: 'farm-sheep-001',
    title: 'Le mouton',
    category: 'farm',
    animal: 'sheep',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'mouton',
    tags: ['animal', 'ferme'],
    scene: { animal: 'sheep', background: 'meadow', props: ['cloud'], variant: 1 },
  },
  {
    id: 'farm-sheep-002',
    title: 'Mouton fleuri',
    category: 'farm',
    animal: 'sheep',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'mouton',
    tags: ['animal', 'ferme'],
    scene: { animal: 'sheep', background: 'farm', props: ['flower'], variant: 2 },
  },
  {
    id: 'farm-dog-001',
    title: 'Le chien',
    category: 'farm',
    animal: 'dog',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'chien',
    tags: ['animal', 'ferme'],
    scene: { animal: 'dog', background: 'farm', props: ['fence'], variant: 1 },
  },
  {
    id: 'farm-dog-002',
    title: 'Chien au jardin',
    category: 'farm',
    animal: 'dog',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'chien',
    tags: ['animal', 'ferme'],
    scene: { animal: 'dog', background: 'garden', props: ['flower'], variant: 2 },
  },
  {
    id: 'farm-cat-001',
    title: 'Le chat',
    category: 'farm',
    animal: 'cat',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'chat',
    tags: ['animal', 'ferme'],
    scene: { animal: 'cat', background: 'garden', props: ['flower'], variant: 1 },
  },
  {
    id: 'farm-cat-002',
    title: 'Chat à la ferme',
    category: 'farm',
    animal: 'cat',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'chat',
    tags: ['animal', 'ferme'],
    scene: { animal: 'cat', background: 'farm', props: ['sun'], variant: 2 },
  },
  {
    id: 'farm-rabbit-001',
    title: 'Le lapin',
    category: 'farm',
    animal: 'rabbit',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'lapin',
    tags: ['animal', 'ferme'],
    scene: { animal: 'rabbit', background: 'meadow', props: ['flower'], variant: 1 },
  },
  {
    id: 'farm-rabbit-002',
    title: 'Lapin et œuf',
    category: 'farm',
    animal: 'rabbit',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'lapin',
    tags: ['animal', 'ferme'],
    scene: { animal: 'rabbit', background: 'garden', props: ['egg'], variant: 2 },
  },
  {
    id: 'farm-duck-001',
    title: 'Le canard',
    category: 'farm',
    animal: 'duck',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'canard',
    tags: ['animal', 'ferme'],
    scene: { animal: 'duck', background: 'pond', props: ['cloud'], variant: 1 },
  },
  {
    id: 'farm-duck-002',
    title: 'Canard au soleil',
    category: 'farm',
    animal: 'duck',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'canard',
    tags: ['animal', 'ferme'],
    scene: { animal: 'duck', background: 'meadow', props: ['sun'], variant: 2 },
  },
  {
    id: 'farm-horse-001',
    title: 'Le cheval',
    category: 'farm',
    animal: 'horse',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'cheval',
    tags: ['animal', 'ferme'],
    scene: { animal: 'horse', background: 'farm', props: ['fence'], variant: 1 },
  },
  {
    id: 'farm-horse-002',
    title: 'Cheval au pré',
    category: 'farm',
    animal: 'horse',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'cheval',
    tags: ['animal', 'ferme'],
    scene: { animal: 'horse', background: 'meadow', props: ['cloud'], variant: 2 },
  },
  {
    id: 'farm-frog-001',
    title: 'La grenouille',
    category: 'farm',
    animal: 'frog',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'grenouille',
    tags: ['animal', 'mare'],
    scene: { animal: 'frog', background: 'pond', props: ['cloud'], variant: 1 },
  },
  {
    id: 'farm-frog-002',
    title: 'Grenouille fleurie',
    category: 'farm',
    animal: 'frog',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'grenouille',
    tags: ['animal', 'mare'],
    scene: { animal: 'frog', background: 'pond', props: ['cloud'], variant: 2 },
  },
  {
    id: 'farm-fish-001',
    title: 'Le poisson',
    category: 'farm',
    animal: 'fish',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poisson',
    tags: ['animal', 'mare'],
    scene: { animal: 'fish', background: 'pond', props: ['cloud'], variant: 1 },
  },
  {
    id: 'farm-fish-002',
    title: 'Poisson bleu',
    category: 'farm',
    animal: 'fish',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poisson',
    tags: ['animal', 'mare'],
    scene: { animal: 'fish', background: 'pond', props: [], variant: 2 },
  },
  {
    id: 'farm-cow-003',
    title: 'Vache au ciel',
    category: 'farm',
    animal: 'cow',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'vache',
    tags: ['animal', 'ferme'],
    scene: { animal: 'cow', background: 'sky', props: ['cloud', 'sun'], variant: 1 },
  },
  {
    id: 'farm-pig-003',
    title: 'Cochon rose',
    category: 'farm',
    animal: 'pig',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'cochon',
    tags: ['animal', 'ferme'],
    scene: { animal: 'pig', background: 'meadow', props: ['sun'], variant: 1 },
  },
  {
    id: 'farm-sheep-003',
    title: 'Mouton au ciel',
    category: 'farm',
    animal: 'sheep',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'mouton',
    tags: ['animal', 'ferme'],
    scene: { animal: 'sheep', background: 'sky', props: ['cloud'], variant: 1 },
  },
  {
    id: 'farm-duck-003',
    title: 'Canard à la mare',
    category: 'farm',
    animal: 'duck',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'canard',
    tags: ['animal', 'mare'],
    scene: { animal: 'duck', background: 'pond', props: ['cloud'], variant: 1 },
  },
  {
    id: 'farm-chick-004',
    title: 'Poussin au jardin',
    category: 'farm',
    animal: 'chick',
    sourceType: 'procedural',
    license: 'original',
    credit: 'Generated in Les Petits Poussins',
    sections: ALL_SECTIONS,
    audioKey: 'poussin',
    tags: ['animal', 'jardin'],
    scene: { animal: 'chick', background: 'garden', props: ['apple', 'flower'], variant: 1 },
  },
]

export const PROCEDURAL_SCENE_COUNT = PUZZLE_CATALOG.length

export const PROCEDURAL_ANIMALS = [
  ...new Set(PUZZLE_CATALOG.map((entry) => entry.animal)),
]

/**
 * Construit les exercices puzzle procéduraux pour une section Maternelle.
 */
export function buildProceduralPuzzleExercises(section) {
  const grids = SECTION_PUZZLE_GRIDS[section]
  if (!grids) return []

  const exercises = []

  for (const entry of PUZZLE_CATALOG) {
    if (!entry.sections.includes(section)) continue

    for (const difficulty of [1, 2, 3]) {
      const grid = grids[difficulty]
      if (!grid) continue

      exercises.push({
        id: `proc-${section}-${entry.id}-d${difficulty}`,
        level: 'maternelle',
        section,
        subject: 'puzzles',
        title: entry.title,
        catalogId: entry.id,
        scene: entry.scene,
        rows: grid.rows,
        cols: grid.cols,
        pieceCount: grid.pieceCount,
        difficulty,
        audioKey: entry.audioKey,
        promptAudioKey: 'remets_image',
        sourceType: entry.sourceType,
        license: entry.license,
        credit: entry.credit,
      })
    }
  }

  return exercises
}

const LAST_PUZZLE_KEY = 'pp-last-puzzle-id'

/**
 * Sélection aléatoire contrôlée — procédural d'abord, legacy en fallback si liste vide.
 */
export function pickPuzzleForSection(section, proceduralExercises, maxDifficulty = 3, legacyExercises = []) {
  const procedural = pickFromPuzzlePool(section, proceduralExercises, maxDifficulty)
  if (procedural) return procedural

  if (legacyExercises.length) {
    return pickFromPuzzlePool(`${section}-legacy`, legacyExercises, maxDifficulty)
  }

  return null
}

function pickFromPuzzlePool(storageKey, exercises, maxDifficulty) {
  const list = exercises.filter((item) => (item.difficulty ?? 1) <= maxDifficulty)
  if (!list.length) return null

  let candidates = list
  try {
    const lastId = sessionStorage.getItem(`${LAST_PUZZLE_KEY}-${storageKey}`)
    if (lastId && candidates.length > 1) {
      const filtered = candidates.filter((item) => item.id !== lastId)
      if (filtered.length) candidates = filtered
    }
  } catch {
    // sessionStorage indisponible
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)]

  try {
    sessionStorage.setItem(`${LAST_PUZZLE_KEY}-${storageKey}`, picked.id)
  } catch {
    // sessionStorage indisponible
  }

  return picked
}

export function getPuzzleCatalogStats() {
  return {
    proceduralScenes: PROCEDURAL_SCENE_COUNT,
    animals: PROCEDURAL_ANIMALS.length,
    animalList: PROCEDURAL_ANIMALS,
    perSection: {
      petite: buildProceduralPuzzleExercises('petite').length,
      moyenne: buildProceduralPuzzleExercises('moyenne').length,
      grande: buildProceduralPuzzleExercises('grande').length,
    },
    source: 'Images procédurales originales',
    license: 'Original / projet Les Petits Poussins',
  }
}
