import puzzlePoussin from '../../../../assets/images/puzzles/puzzle-poussin.svg'
import puzzleFleur from '../../../../assets/images/puzzles/puzzle-fleur.svg'
import puzzleMaison from '../../../../assets/images/puzzles/puzzle-maison.svg'
import { PUZZLE_BOARD_HEIGHT, PUZZLE_BOARD_WIDTH } from '../petite/puzzles'

export { PUZZLE_BOARD_WIDTH, PUZZLE_BOARD_HEIGHT }

export const grandePuzzleExercises = [
  {
    id: 'mat-grande-puzzle-poussin',
    section: 'grande',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Poussin',
    image: puzzlePoussin,
    rows: 2,
    cols: 3,
    pieceCount: 6,
    difficulty: 1,
    audioKey: 'poussin',
    promptAudioKey: 'remets_image',
  },
  {
    id: 'mat-grande-puzzle-fleur',
    section: 'grande',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Fleur',
    image: puzzleFleur,
    rows: 2,
    cols: 4,
    pieceCount: 8,
    difficulty: 2,
    audioKey: 'fleur',
    promptAudioKey: 'remets_image',
  },
  {
    id: 'mat-grande-puzzle-maison',
    section: 'grande',
    level: 'maternelle',
    subject: 'puzzles',
    title: 'Maison',
    image: puzzleMaison,
    rows: 3,
    cols: 4,
    pieceCount: 12,
    difficulty: 3,
    audioKey: 'maison',
    promptAudioKey: 'remets_image',
  },
]
