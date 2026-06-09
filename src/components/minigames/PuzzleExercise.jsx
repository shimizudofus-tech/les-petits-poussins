import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'
import {
  PUZZLE_BOARD_HEIGHT,
  PUZZLE_BOARD_WIDTH,
  getCellSize,
  getPieceBackgroundStyle,
  isNearSlot,
  shufflePieces,
  slotKey,
} from './puzzleUtils'

const SNAP_RATIO = 0.42

function PuzzlePieceFace({ piece, puzzle, cellW, cellH, scale, className = '', style = {} }) {
  if (!piece) return null
  const width = cellW * scale
  const height = cellH * scale
  return (
    <div
      className={`image-puzzle-piece ${className}`.trim()}
      style={{
        width,
        height,
        ...getPieceBackgroundStyle(piece.correctCol, piece.correctRow, puzzle.cols, puzzle.rows, puzzle.image),
        ...style,
      }}
    />
  )
}

export default function PuzzleExercise({ exerciseKey, section = 'petite', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'puzzles')
  const boardRef = useRef(null)
  const dragRef = useRef(null)
  const movedRef = useRef(false)

  const puzzle = useMemo(
    () => pickMaternelleExercise(section, 'puzzles', maxDifficulty),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exerciseKey, maxDifficulty, section],
  )

  const displayMaxWidth =
    section === 'grande' && puzzle?.pieceCount >= 12
      ? 300
      : puzzle?.difficulty === 1
        ? 320
        : puzzle?.pieceCount <= 4
          ? 300
          : 280
  const scale = puzzle ? Math.min(1, displayMaxWidth / PUZZLE_BOARD_WIDTH) : 1
  const isEasyPuzzle = puzzle?.difficulty === 1
  const { cellW, cellH } = puzzle ? getCellSize(puzzle) : { cellW: 0, cellH: 0 }
  const snapThreshold = Math.min(cellW, cellH) * SNAP_RATIO

  const [pieces, setPieces] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })

  const resetPieces = useCallback(() => {
    if (!puzzle) return
    setPieces(shufflePieces(puzzle))
    setSelectedId(null)
    setDraggingId(null)
    dragRef.current = null
  }, [puzzle])

  useEffect(() => {
    resetPieces()
  }, [puzzle, exerciseKey, resetPieces])

  if (!puzzle) {
    return <ExerciseUnavailable />
  }

  const allPlaced = pieces.length > 0 && pieces.every((piece) => piece.placed)
  const trayPieces = pieces.filter((piece) => !piece.placed && piece.id !== draggingId)
  const placedPieces = pieces.filter((piece) => piece.placed)

  const placePiece = (pieceId) => {
    setPieces((prev) =>
      prev.map((piece) => (piece.id === pieceId ? { ...piece, placed: true } : piece)),
    )
    setSelectedId(null)
    setDraggingId(null)
    dragRef.current = null
  }

  const handleSlotTap = (col, row) => {
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece || piece.placed) return
    if (piece.correctCol === col && piece.correctRow === row) {
      placePiece(piece.id)
    }
  }

  const toBoardCoords = (clientX, clientY, board) => ({
    x: (clientX - board.left) / scale,
    y: (clientY - board.top) / scale,
  })

  const handlePointerDown = (pieceId, event) => {
    const piece = pieces.find((p) => p.id === pieceId)
    if (!piece || piece.placed) return

    const board = boardRef.current?.getBoundingClientRect()
    if (!board) return

    const clientX = event.clientX ?? event.touches?.[0]?.clientX
    const clientY = event.clientY ?? event.touches?.[0]?.clientY
    const { x, y } = toBoardCoords(clientX, clientY, board)

    movedRef.current = false
    setDraggingId(pieceId)
    setDragPos({ x: x - cellW / 2, y: y - cellH / 2 })
    dragRef.current = {
      pieceId,
      offsetX: cellW / 2,
      offsetY: cellH / 2,
      startX: clientX,
      startY: clientY,
    }
    event.preventDefault()
  }

  const handlePointerMove = (event) => {
    if (!dragRef.current) return
    const board = boardRef.current?.getBoundingClientRect()
    if (!board) return

    const clientX = event.clientX ?? event.touches?.[0]?.clientX
    const clientY = event.clientY ?? event.touches?.[0]?.clientY
    const { offsetX, offsetY, startX, startY } = dragRef.current
    const { x, y } = toBoardCoords(clientX, clientY, board)

    if (Math.hypot(clientX - startX, clientY - startY) > 8) {
      movedRef.current = true
    }

    setDragPos({ x: x - offsetX, y: y - offsetY })
    event.preventDefault()
  }

  const handlePointerUp = () => {
    if (!dragRef.current) return
    const { pieceId } = dragRef.current
    const piece = pieces.find((p) => p.id === pieceId)

    if (!movedRef.current) {
      setDraggingId(null)
      setSelectedId((current) => (current === pieceId ? null : pieceId))
      dragRef.current = null
      movedRef.current = false
      return
    }

    if (piece && isNearSlot(piece, dragPos.x, dragPos.y, cellW, cellH, snapThreshold)) {
      placePiece(pieceId)
    } else {
      setDraggingId(null)
      setSelectedId(pieceId)
    }
    dragRef.current = null
    movedRef.current = false
  }

  const handleValidate = () => {
    if (!allPlaced) return
    showFeedback(true)
    recordMaternelleSuccess(setGameState, section, 'puzzles')
    onCorrect?.()
  }

  const boardWidth = PUZZLE_BOARD_WIDTH * scale
  const boardHeight = PUZZLE_BOARD_HEIGHT * scale

  return (
    <>
      <PetiteExerciseHeader
        instruction="Remets l'image"
        parentHint={
          isEasyPuzzle
            ? `${puzzle.title} — glisse ou touche les 2 morceaux`
            : `${puzzle.title} — glisse ou touche chaque morceau`
        }
        audioKey={puzzle.audioKey}
        audioLabel={puzzle.title}
      />

      <div
        className={`image-puzzle mx-auto w-full max-w-full ${isEasyPuzzle ? 'image-puzzle--easy' : ''}`}
        style={{ maxWidth: boardWidth }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div
          ref={boardRef}
          className="image-puzzle-target relative overflow-hidden rounded-2xl border-4 border-[#e8b84b] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          style={{ width: boardWidth, height: boardHeight }}
        >
          <img
            src={puzzle.image}
            alt=""
            className="image-puzzle-guide pointer-events-none absolute inset-0 h-full w-full"
            draggable={false}
          />

          <div className="image-puzzle-grid absolute inset-0">
            {Array.from({ length: puzzle.rows * puzzle.cols }).map((_, index) => {
              const col = index % puzzle.cols
              const row = Math.floor(index / puzzle.cols)
              const occupied = placedPieces.some(
                (piece) => piece.correctCol === col && piece.correctRow === row,
              )
              return (
                <button
                  key={slotKey(col, row)}
                  type="button"
                  className={`image-puzzle-slot ${occupied ? 'image-puzzle-slot--filled' : ''} ${
                    selectedId && !occupied ? 'image-puzzle-slot--active' : ''
                  }`}
                  style={{
                    left: col * cellW * scale,
                    top: row * cellH * scale,
                    width: cellW * scale,
                    height: cellH * scale,
                  }}
                  onClick={() => handleSlotTap(col, row)}
                  aria-label={`Emplacement ${row + 1}-${col + 1}`}
                />
              )
            })}
          </div>

          {placedPieces.map((piece) => (
            <div
              key={piece.id}
              className="image-puzzle-piece-wrap image-puzzle-piece-wrap--placed absolute"
              style={{
                left: piece.correctCol * cellW * scale,
                top: piece.correctRow * cellH * scale,
                width: cellW * scale,
                height: cellH * scale,
              }}
            >
              <PuzzlePieceFace piece={piece} puzzle={puzzle} cellW={cellW} cellH={cellH} scale={scale} />
            </div>
          ))}

          {draggingId && (
            <div
              className="image-puzzle-piece-wrap image-puzzle-piece-wrap--dragging absolute"
              style={{
                left: dragPos.x * scale,
                top: dragPos.y * scale,
                width: cellW * scale,
                height: cellH * scale,
                zIndex: 20,
              }}
            >
              <PuzzlePieceFace
                piece={pieces.find((p) => p.id === draggingId)}
                puzzle={puzzle}
                cellW={cellW}
                cellH={cellH}
                scale={scale}
              />
            </div>
          )}
        </div>

        <div
          className={`image-puzzle-tray mt-3 ${puzzle.pieceCount > 4 ? 'image-puzzle-tray--many' : ''}`}
        >
          {trayPieces.map((piece) => (
            <button
              key={piece.id}
              type="button"
              className={`image-puzzle-tray-item ${
                selectedId === piece.id ? 'image-puzzle-tray-item--selected' : ''
              }`}
              style={{ width: cellW * scale, height: cellH * scale }}
              onPointerDown={(event) => handlePointerDown(piece.id, event)}
              onTouchStart={(event) => handlePointerDown(piece.id, event)}
              aria-label={`Morceau ${piece.trayIndex + 1}`}
              aria-pressed={selectedId === piece.id}
            >
              <PuzzlePieceFace piece={piece} puzzle={puzzle} cellW={cellW} cellH={cellH} scale={scale} />
            </button>
          ))}
        </div>
      </div>

      <div className="petite-actions mt-3 flex justify-center gap-3">
        <button type="button" onClick={resetPieces} className="col-btn col-btn--petite reset">
          🔄 Recommencer
        </button>
        <button
          type="button"
          onClick={handleValidate}
          disabled={!allPlaced}
          className="col-btn col-btn--petite validate disabled:opacity-50"
        >
          ✅ Terminer
        </button>
      </div>
    </>
  )
}
