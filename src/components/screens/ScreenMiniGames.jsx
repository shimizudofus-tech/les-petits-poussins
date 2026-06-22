import { useEffect, useRef, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import { SCREENS, useGame } from '../../context/GameContext'

const ANIMALS = ['🐤', '🐷', '🐮', '🐑', '🐰', '🦆', '🐴', '🐐', '🐱', '🐶']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── Jeu de mémoire (paires) ── */
function MemoryGame({ onWin, onBack }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([]) // indices en cours
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const lockRef = useRef(false)

  const deal = () => {
    const pick = shuffle(ANIMALS).slice(0, 6)
    setCards(shuffle([...pick, ...pick]))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
  }
  useEffect(deal, [])

  const won = cards.length > 0 && matched.size === cards.length

  useEffect(() => {
    if (won) onWin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won])

  const clickCard = (i) => {
    if (lockRef.current || flipped.includes(i) || matched.has(i)) return
    const next = [...flipped, i]
    setFlipped(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      if (cards[next[0]] === cards[next[1]]) {
        setMatched((prev) => new Set(prev).add(next[0]).add(next[1]))
        setFlipped([])
      } else {
        lockRef.current = true
        setTimeout(() => {
          setFlipped([])
          lockRef.current = false
        }, 800)
      }
    }
  }

  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">
        🧠 Trouve les paires {won ? '— Gagné ! 🎉' : `· coups : ${moves}`}
      </p>
      <div className="minigame-memory">
        {cards.map((emoji, i) => {
          const show = flipped.includes(i) || matched.has(i)
          return (
            <button
              key={i}
              type="button"
              className={`memory-card${show ? ' memory-card--up' : ''}${matched.has(i) ? ' memory-card--done' : ''}`}
              onClick={() => clickCard(i)}
            >
              {show ? emoji : '❓'}
            </button>
          )
        })}
      </div>
      <div className="petite-actions mt-3 flex justify-center gap-3">
        <button type="button" onClick={deal} className="col-btn col-btn--petite reset">🔄 Rejouer</button>
        <button type="button" onClick={onBack} className="col-btn col-btn--petite">← Jeux</button>
      </div>
    </>
  )
}

/* ── Tape la taupe (réflexes) ── */
const HOLES = 6
const GAME_MS = 30000
function WhackGame({ onScore, onBack }) {
  const [active, setActive] = useState(-1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_MS / 1000)
  const [running, setRunning] = useState(false)
  const popRef = useRef(null)
  const clockRef = useRef(null)

  const stop = () => {
    clearInterval(popRef.current)
    clearInterval(clockRef.current)
    setActive(-1)
    setRunning(false)
  }

  const start = () => {
    setScore(0)
    setTimeLeft(GAME_MS / 1000)
    setRunning(true)
    popRef.current = setInterval(() => setActive(Math.floor(Math.random() * HOLES)), 850)
    clockRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stop()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => () => stop(), [])

  const whack = (i) => {
    if (!running || i !== active) return
    setScore((s) => s + 1)
    setActive(-1)
  }

  useEffect(() => {
    if (!running && timeLeft === 0 && score > 0) onScore(score)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft])

  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">
        🔨 Tape l'animal · ⭐ {score} · ⏱️ {timeLeft}s
      </p>
      <div className="minigame-whack">
        {Array.from({ length: HOLES }).map((_, i) => (
          <button key={i} type="button" className="whack-hole" onClick={() => whack(i)}>
            {active === i ? '🐹' : ''}
          </button>
        ))}
      </div>
      <div className="petite-actions mt-3 flex justify-center gap-3">
        <button type="button" onClick={running ? stop : start} className="col-btn col-btn--petite validate">
          {running ? '⏹️ Stop' : '▶️ Jouer'}
        </button>
        <button type="button" onClick={() => { stop(); onBack() }} className="col-btn col-btn--petite">← Jeux</button>
      </div>
    </>
  )
}

export default function ScreenMiniGames() {
  const { setGameState, switchScreen, showFeedback, showToast } = useGame()
  const [game, setGame] = useState(null)

  const reward = (stars, msg) => {
    setGameState((s) => ({ ...s, stars: (s.stars ?? 0) + stars }))
    showFeedback(true)
    showToast(`${msg} +${stars} ⭐`, '#7c4dff')
  }

  return (
    <main className="screen flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden overflow-x-hidden pb-4">
      <ScreenTitle>🎲 Mini-jeux</ScreenTitle>

      <div className="exercise-area flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {game === null && (
          <div className="mx-auto flex w-full max-w-[360px] flex-col gap-2.5">
            <div role="button" tabIndex={0} className="kid-card" onClick={() => setGame('memory')} onKeyDown={(e) => e.key === 'Enter' && setGame('memory')}>
              <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg,#e1f5fe,#81d4fa)' }}>🧠</div>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-black text-[#3e2700]">Mémoire</div>
                <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">Trouve les paires d'animaux</div>
                <span className="kid-card__badge">+5 ⭐</span>
              </div>
            </div>
            <div role="button" tabIndex={0} className="kid-card" onClick={() => setGame('whack')} onKeyDown={(e) => e.key === 'Enter' && setGame('whack')}>
              <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg,#fff3e0,#ffb74d)' }}>🔨</div>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-black text-[#3e2700]">Tape la taupe</div>
                <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">Sois rapide ! 30 secondes</div>
                <span className="kid-card__badge">⭐ selon le score</span>
              </div>
            </div>
          </div>
        )}

        {game === 'memory' && <MemoryGame onWin={() => reward(5, 'Bravo !')} onBack={() => setGame(null)} />}
        {game === 'whack' && <WhackGame onScore={(s) => reward(Math.max(1, Math.round(s / 3)), `Score ${s} !`)} onBack={() => setGame(null)} />}
      </div>

      <button
        type="button"
        onClick={() => (game ? setGame(null) : switchScreen(SCREENS.TAMAGOTCHI))}
        className="close-btn mx-4 mb-3 mt-2 shrink-0 cursor-pointer rounded-[18px] border-none font-sans text-[0.95rem] font-extrabold text-white"
      >
        🏡 Retour à la ferme
      </button>
    </main>
  )
}
