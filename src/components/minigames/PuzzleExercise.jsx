import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { SCREENS, useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import { playWord } from '../../utils/audioManager'
import ExerciseUnavailable from './ExerciseUnavailable'
import {
  PUZZLE_BOARD_HEIGHT,
  PUZZLE_BOARD_WIDTH,
  PUZZLE_PIECE_SHAPE,
  getCellSize,
  getPieceBackgroundStyle,
  getPuzzleUiConfig,
  isNearSlot,
  resolveBoardMaxWidth,
  shufflePieces,
  slotKey,
} from './puzzleUtils'

const SNAP_RATIO = 0.42
const MIN_TRAY_TOUCH_PX = 44

function subscribeViewport(cb) {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

function getViewportWidth() {
  return window.innerWidth
}

function useViewportWidth() {
  return useSyncExternalStore(subscribeViewport, getViewportWidth, () => 360)
}

function PuzzlePieceFace({ piece, puzzle, cellW, cellH, scale, className = '', style = {} }) {
  if (!piece) return null
  return (
    <div
      className={`puzzle-piece-face ${className}`.trim()}
      data-piece-shape={PUZZLE_PIECE_SHAPE}
      data-piece-col={piece.correctCol}
      data-piece-row={piece.correctRow}
      style={{
        width: cellW * scale,
        height: cellH * scale,
        ...getPieceBackgroundStyle(
          piece.correctCol,
          piece.correctRow,
          puzzle.cols,
          puzzle.rows,
          puzzle.image,
        ),
        ...style,
      }}
    />
  )
}

export default function PuzzleExercise({ exerciseKey, section = 'petite', onCorrect }) {
  const { gameState, setGameState, showFeedback, switchScreen } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'puzzles')
  const boardRef = useRef(null)
  const dragRef = useRef(null)
  const movedRef = useRef(false)

  const puzzle = useMemo(
    () => pickMaternelleExercise(section, 'puzzles', maxDifficulty),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exerciseKey, maxDifficulty, section],
  )

  const viewportWidth = useViewportWidth()
  const ui = useMemo(() => getPuzzleUiConfig(section, puzzle), [section, puzzle])
  const boardMaxWidth = puzzle ? resolveBoardMaxWidth(ui.maxWidthCap, viewportWidth) : 0
  const scale = puzzle ? boardMaxWidth / PUZZLE_BOARD_WIDTH : 1
  const { cellW, cellH } = puzzle ? getCellSize(puzzle) : { cellW: 0, cellH: 0 }
  const snapThreshold = Math.min(cellW, cellH) * SNAP_RATIO
  const trayScale = useMemo(() => {
    if (!puzzle) return 1
    let ts = scale * ui.trayScaleFactor
    const minDim = Math.min(cellW * ts, cellH * ts)
    if (minDim < MIN_TRAY_TOUCH_PX) {
      ts = MIN_TRAY_TOUCH_PX / Math.min(cellW, cellH)
    }
    return ts
  }, [scale, ui.trayScaleFactor, cellW, cellH, puzzle])

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
  const placedCount = placedPieces.length
  const totalCount = puzzle.pieceCount

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
    setSelectedId(pieceId)
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

  const handleListen = () => {
    if (puzzle.audioKey) playWord(puzzle.audioKey)
  }

  const boardWidth = PUZZLE_BOARD_WIDTH * scale
  const boardHeight = PUZZLE_BOARD_HEIGHT * scale

  return (
    <div
      className={`puzzle-app puzzle-app--${section}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <header className="puzzle-app-header">
        <button
          type="button"
          className="puzzle-app-back"
          onClick={() => switchScreen(SCREENS.LEVEL_SELECT)}
          aria-label="Retour"
        >
          ←
        </button>
        <div className="puzzle-app-title-wrap">
          <h2 className="puzzle-app-title">🧩 {puzzle.title}</h2>
          <p className="puzzle-app-progress">
            {placedCount}/{totalCount}
          </p>
        </div>
        <div className="puzzle-app-stars" aria-label={`${gameState.stars} étoiles`}>
          ⭐ {gameState.stars}
        </div>
        {puzzle.audioKey ? (
          <button
            type="button"
            className="puzzle-app-audio"
            onClick={handleListen}
            aria-label={`Écouter ${puzzle.title}`}
          >
            🔊
          </button>
        ) : null}
      </header>

      <div className="puzzle-app-body">
        <div className="puzzle-app-stage">
          <div
            ref={boardRef}
            className="puzzle-app-board"
            style={{ width: boardWidth, height: boardHeight }}
          >
          <img
            src={puzzle.image}
            alt=""
            className="puzzle-app-guide"
            style={{ opacity: ui.guideOpacity }}
            draggable={false}
          />

          <div className="puzzle-app-grid">
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
                  className={`puzzle-app-slot ${occupied ? 'puzzle-app-slot--filled' : ''} ${
                    ui.easySlots ? 'puzzle-app-slot--easy' : ''
                  } ${selectedId && !occupied ? 'puzzle-app-slot--active' : ''}`}
                  style={{
                    left: col * cellW * scale,
                    top: row * cellH * scale,
                    width: cellW * scale,
                    height: cellH * scale,
                  }}
                  onClick={() => handleSlotTap(col, row)}
                  aria-label={`Case ${row + 1}-${col + 1}`}
                />
              )
            })}
          </div>

          {placedPieces.map((piece) => (
            <div
              key={piece.id}
              className="puzzle-app-piece-wrap puzzle-app-piece-wrap--placed"
              style={{
                left: piece.correctCol * cellW * scale,
                top: piece.correctRow * cellH * scale,
                width: cellW * scale,
                height: cellH * scale,
              }}
            >
              <PuzzlePieceFace
                piece={piece}
                puzzle={puzzle}
                cellW={cellW}
                cellH={cellH}
                scale={scale}
              />
            </div>
          ))}

          {draggingId && (
            <div
              className="puzzle-app-piece-wrap puzzle-app-piece-wrap--dragging"
              style={{
                left: dragPos.x * scale,
                top: dragPos.y * scale,
                width: cellW * scale,
                height: cellH * scale,
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
        </div>

        <div className="puzzle-app-footer">
          <div className="puzzle-app-tray" aria-label="Pièces à placer">
            <div className="puzzle-app-tray-scroll">
              {allPlaced ? (
                <p className="puzzle-app-tray-empty">Bravo, tout est placé !</p>
              ) : (
                trayPieces.map((piece) => (
                  <button
                    key={piece.id}
                    type="button"
                    className={`puzzle-app-tray-item ${
                      selectedId === piece.id ? 'puzzle-app-tray-item--selected' : ''
                    }`}
                    style={{
                      width: cellW * trayScale + 10,
                      height: cellH * trayScale + 10,
                    }}
                    onPointerDown={(event) => handlePointerDown(piece.id, event)}
                    onTouchStart={(event) => handlePointerDown(piece.id, event)}
                    aria-label={`Pièce ${piece.trayIndex + 1}`}
                    aria-pressed={selectedId === piece.id}
                  >
                    <PuzzlePieceFace
                      piece={piece}
                      puzzle={puzzle}
                      cellW={cellW}
                      cellH={cellH}
                      scale={trayScale}
                    />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="puzzle-app-actions">
            <button
              type="button"
              onClick={resetPieces}
              className="puzzle-app-btn puzzle-app-btn--reset"
              aria-label="Mélanger les pièces"
            >
              <span className="puzzle-app-btn-icon" aria-hidden="true">
                🔄
              </span>
              <span className="puzzle-app-btn-label">Mélanger</span>
            </button>
            <button
              type="button"
              onClick={handleValidate}
              disabled={!allPlaced}
              className="puzzle-app-btn puzzle-app-btn--finish"
            >
              ✅ Terminer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
