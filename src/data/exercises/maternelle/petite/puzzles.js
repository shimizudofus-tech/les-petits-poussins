import puzzlePoussin from '../../../../assets/images/puzzles/puzzle-poussin.svg'
import puzzleFleur from '../../../../assets/images/puzzles/puzzle-fleur.svg'
import puzzleMaison from '../../../../assets/images/puzzles/puzzle-maison.svg'
import { buildProceduralPuzzleExercises } from '../../../puzzles/puzzleCatalog'

export const PUZZLE_BOARD_WIDTH = 280
export const PUZZLE_BOARD_HEIGHT = 180

/** Anciens puzzles SVG — fallback uniquement (grilles legacy, hors rotation principale). */
export const petiteLegacyPuzzleExercises = [
  {
    id: 'mat-petite-puzzle-poussin',
    section: 'petite',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Poussin',
    image: puzzlePoussin,
    rows: 1,
    cols: 2,
    pieceCount: 2,
    difficulty: 1,
    audioKey: 'poussin',
    promptAudioKey: 'remets_image',
    sourceType: 'asset',
    license: 'original',
    credit: 'Les Petits Poussins',
    isLegacy: true,
  },
  {
    id: 'mat-petite-puzzle-fleur',
    section: 'petite',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Fleur',
    image: puzzleFleur,
    rows: 2,
    cols: 2,
    pieceCount: 4,
    difficulty: 2,
    audioKey: 'fleur',
    promptAudioKey: 'remets_image',
    sourceType: 'asset',
    license: 'original',
    credit: 'Les Petits Poussins',
    isLegacy: true,
  },
  {
    id: 'mat-petite-puzzle-maison',
    section: 'petite',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Maison',
    image: puzzleMaison,
    rows: 2,
    cols: 3,
    pieceCount: 6,
    difficulty: 3,
    audioKey: 'maison',
    promptAudioKey: 'remets_image',
    sourceType: 'asset',
    license: 'original',
    credit: 'Les Petits Poussins',
    isLegacy: true,
  },
]

export const petiteProceduralPuzzleExercises = buildProceduralPuzzleExercises('petite')

/** Rotation principale — procédural uniquement. */
export const petitePuzzleExercises = petiteProceduralPuzzleExercises
