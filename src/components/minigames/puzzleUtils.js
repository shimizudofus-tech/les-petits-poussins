import { PUZZLE_BOARD_HEIGHT, PUZZLE_BOARD_WIDTH } from '../../data/exercises/maternelle/petite/puzzles'

export { PUZZLE_BOARD_WIDTH, PUZZLE_BOARD_HEIGHT }

/** Forme de rendu actuelle — 'rect'. Futur : masques SVG / clip-path par pièce. */
export const PUZZLE_PIECE_SHAPE = 'rect'

export function getPuzzleUiConfig(section, puzzle) {
  if (!puzzle) {
    return {
      maxWidthCap: 340,
      guideOpacity: 0.35,
      trayScaleFactor: 0.9,
      easySlots: false,
    }
  }

  if (section === 'petite') {
    return {
      maxWidthCap: 340,
      guideOpacity: puzzle.difficulty === 1 ? 0.58 : 0.42,
      trayScaleFactor: puzzle.pieceCount <= 2 ? 0.92 : 0.88,
      easySlots: true,
    }
  }

  if (section === 'moyenne') {
    return {
      maxWidthCap: 330,
      guideOpacity: 0.38,
      trayScaleFactor: puzzle.pieceCount >= 6 ? 0.82 : 0.88,
      easySlots: true,
    }
  }

  return {
    maxWidthCap: puzzle.pieceCount >= 12 ? 310 : 330,
    guideOpacity: 0.3,
    trayScaleFactor: puzzle.pieceCount >= 12 ? 0.72 : puzzle.pieceCount >= 8 ? 0.78 : 0.85,
    easySlots: false,
  }
}

export function resolveBoardMaxWidth(maxWidthCap, viewportWidth) {
  const vw = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : maxWidthCap)
  return Math.min(vw * 0.92, maxWidthCap)
}

export function getPieceBackgroundStyle(col, row, cols, rows, imageUrl) {
  const posX = cols <= 1 ? 0 : (col / (cols - 1)) * 100
  const posY = rows <= 1 ? 0 : (row / (rows - 1)) * 100
  const safeUrl = typeof imageUrl === 'string' ? imageUrl.replace(/"/g, '\\"') : ''
  return {
    backgroundImage: safeUrl ? `url("${safeUrl}")` : undefined,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat',
  }
}

export function shufflePieces(puzzle) {
  const items = []
  for (let row = 0; row < puzzle.rows; row += 1) {
    for (let col = 0; col < puzzle.cols; col += 1) {
      items.push({
        id: `p-${row}-${col}`,
        correctRow: row,
        correctCol: col,
        placed: false,
      })
    }
  }

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }

  return items.map((piece, trayIndex) => ({ ...piece, trayIndex }))
}

export function getCellSize(puzzle) {
  return {
    cellW: PUZZLE_BOARD_WIDTH / puzzle.cols,
    cellH: PUZZLE_BOARD_HEIGHT / puzzle.rows,
  }
}

export function slotKey(col, row) {
  return `${col}-${row}`
}

export function isNearSlot(piece, x, y, cellW, cellH, threshold) {
  const targetX = piece.correctCol * cellW
  const targetY = piece.correctRow * cellH
  return Math.hypot(x - targetX, y - targetY) <= threshold
}
