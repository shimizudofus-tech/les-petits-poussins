import { PUZZLE_BOARD_HEIGHT, PUZZLE_BOARD_WIDTH } from '../../data/exercises/maternelle/petite/puzzles'

export { PUZZLE_BOARD_WIDTH, PUZZLE_BOARD_HEIGHT }

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
