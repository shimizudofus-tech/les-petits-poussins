import puzzlePoussin from '../../../../assets/images/puzzles/puzzle-poussin.svg'
import puzzleFleur from '../../../../assets/images/puzzles/puzzle-fleur.svg'
import puzzleMaison from '../../../../assets/images/puzzles/puzzle-maison.svg'
import { PUZZLE_BOARD_HEIGHT, PUZZLE_BOARD_WIDTH } from '../petite/puzzles'

export { PUZZLE_BOARD_WIDTH, PUZZLE_BOARD_HEIGHT }

export const moyennePuzzleExercises = [
  {
    id: 'mat-moyenne-puzzle-poussin',
    section: 'moyenne',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Poussin',
    image: puzzlePoussin,
    rows: 2,
    cols: 2,
    pieceCount: 4,
    difficulty: 1,
    audioKey: 'poussin',
    promptAudioKey: 'remets_image',
  },
  {
    id: 'mat-moyenne-puzzle-fleur',
    section: 'moyenne',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Fleur',
    image: puzzleFleur,
    rows: 2,
    cols: 3,
    pieceCount: 6,
    difficulty: 2,
    audioKey: 'fleur',
    promptAudioKey: 'remets_image',
  },
  {
    id: 'mat-moyenne-puzzle-maison',
    section: 'moyenne',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Maison',
    image: puzzleMaison,
    rows: 2,
    cols: 4,
    pieceCount: 8,
    difficulty: 3,
    audioKey: 'maison',
    promptAudioKey: 'remets_image',
  },
]
