import { useEffect, useRef, useState } from 'react'
import ScreenTitle from './ScreenTitle'
import AppIcon from '../AppIcon'
import { useT } from '../../i18n/useT'
import { SCREENS, useGame } from '../../context/GameContext'
import { playClip, stopAllAudio } from '../../utils/audio'

const ANIMALS = ['🐤', '🐷', '🐮', '🐑', '🐰', '🦆', '🐴', '🐐', '🐱', '🐶', '🦊', '🐸']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const rnd = (n) => Math.floor(Math.random() * n)

/* ════════ Mémoire ════════ */
function MemoryGame({ onScore }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const lockRef = useRef(false)
  const wonRef = useRef(false)
  const deal = () => {
    const pick = shuffle(ANIMALS).slice(0, 6)
    setCards(shuffle([...pick, ...pick]))
    setFlipped([]); setMatched(new Set()); wonRef.current = false
  }
  useEffect(deal, [])
  useEffect(() => {
    if (cards.length && matched.size === cards.length && !wonRef.current) { wonRef.current = true; onScore(5, 'Bravo !') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, cards])
  const click = (i) => {
    if (lockRef.current || flipped.includes(i) || matched.has(i)) return
    const next = [...flipped, i]; setFlipped(next)
    if (next.length === 2) {
      if (cards[next[0]] === cards[next[1]]) { setMatched((p) => new Set(p).add(next[0]).add(next[1])); setFlipped([]) }
      else { lockRef.current = true; setTimeout(() => { setFlipped([]); lockRef.current = false }, 800) }
    }
  }
  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">🧠 Trouve les paires</p>
      <div className="minigame-memory">
        {cards.map((e, i) => {
          const up = flipped.includes(i) || matched.has(i)
          return <button key={i} type="button" className={`memory-card${up ? ' memory-card--up' : ''}${matched.has(i) ? ' memory-card--done' : ''}`} onClick={() => click(i)}>{up ? e : '❓'}</button>
        })}
      </div>
      <div className="petite-actions mt-3 flex justify-center"><button type="button" onClick={deal} className="col-btn col-btn--petite reset">🔄 Rejouer</button></div>
    </>
  )
}

/* ════════ Tape la taupe ════════ */
function WhackGame({ onScore }) {
  const HOLES = 6, MS = 30
  const [active, setActive] = useState(-1); const [score, setScore] = useState(0); const [t, setT] = useState(MS); const [run, setRun] = useState(false)
  const pop = useRef(null), clk = useRef(null), scoreRef = useRef(0)
  const stop = () => { clearInterval(pop.current); clearInterval(clk.current); setActive(-1); setRun(false) }
  const start = () => { setScore(0); scoreRef.current = 0; setT(MS); setRun(true); pop.current = setInterval(() => setActive(rnd(HOLES)), 850); clk.current = setInterval(() => setT((x) => { if (x <= 1) { stop(); if (scoreRef.current > 0) onScore(Math.max(1, Math.round(scoreRef.current / 3)), `Score ${scoreRef.current} !`); return 0 } return x - 1 }), 1000) }
  useEffect(() => () => stop(), [])
  const whack = (i) => { if (!run || i !== active) return; scoreRef.current += 1; setScore(scoreRef.current); setActive(-1) }
  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">🔨 Tape l'animal · ⭐ {score} · ⏱️ {t}s</p>
      <div className="minigame-whack">{Array.from({ length: HOLES }).map((_, i) => <button key={i} type="button" className="whack-hole" onClick={() => whack(i)}>{active === i ? '🐹' : ''}</button>)}</div>
      <div className="petite-actions mt-3 flex justify-center"><button type="button" onClick={run ? stop : start} className="col-btn col-btn--petite validate">{run ? '⏹️ Stop' : '▶️ Jouer'}</button></div>
    </>
  )
}

/* ════════ Simon (suite de couleurs) ════════ */
const PADS = ['#ef5350', '#66bb6a', '#42a5f5', '#ffca28']
function SimonGame({ onScore }) {
  const [seq, setSeq] = useState([]); const [step, setStep] = useState(0); const [active, setActive] = useState(-1); const [showing, setShowing] = useState(false); const [msg, setMsg] = useState('')
  const timers = useRef([]); const seqRef = useRef([]); const stepRef = useRef(0)
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const play = (s) => { setShowing(true); clear(); s.forEach((p, i) => { timers.current.push(setTimeout(() => setActive(p), 650 * i + 250)); timers.current.push(setTimeout(() => setActive(-1), 650 * i + 600)) }); timers.current.push(setTimeout(() => { setShowing(false); stepRef.current = 0; setStep(0) }, 650 * s.length + 350)) }
  const next = () => { const s = [...seqRef.current, rnd(4)]; seqRef.current = s; setSeq(s); play(s) }
  useEffect(() => { seqRef.current = []; next(); return clear }, [])
  const tap = (i) => {
    if (showing) return
    setActive(i); setTimeout(() => setActive(-1), 180)
    if (i !== seqRef.current[stepRef.current]) { setMsg('Raté ! On recommence'); seqRef.current = []; setTimeout(() => { setMsg(''); next() }, 900); return }
    stepRef.current += 1; setStep(stepRef.current)
    if (stepRef.current === seqRef.current.length) { onScore(1, `Niveau ${seqRef.current.length} !`); setMsg('👍'); setTimeout(() => { setMsg(''); next() }, 800) }
  }
  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">🎵 Répète la suite · niveau {seq.length} {msg && `· ${msg}`}</p>
      <div className="minigame-simon">
        {PADS.map((c, i) => <button key={i} type="button" className="simon-pad" style={{ background: c, opacity: active === i ? 1 : 0.45 }} onClick={() => tap(i)} disabled={showing} />)}
      </div>
      <p className="zone-coloring-hint">{showing ? 'Regarde bien…' : 'À toi de répéter !'}</p>
    </>
  )
}

/* ════════ Trouve l'intrus ════════ */
function IntrusGame({ onScore }) {
  const [d, setD] = useState(() => build())
  function build() {
    const n = 9; const [a, b] = shuffle(ANIMALS).slice(0, 2); const odd = rnd(n)
    return { cells: Array.from({ length: n }, (_, i) => (i === odd ? b : a)), odd }
  }
  const click = (i) => { if (i === d.odd) { onScore(3, 'Trouvé !'); setD(build()) } }
  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">🔍 Trouve l'animal différent</p>
      <div className="minigame-intrus">{d.cells.map((e, i) => <button key={i} type="button" className="intrus-cell" onClick={() => click(i)}>{e}</button>)}</div>
    </>
  )
}

/* ════════ Compte vite ════════ */
function CountGame({ onScore }) {
  const [r, setR] = useState(() => build()); const [score, setScore] = useState(0)
  function build() {
    const k = 3 + rnd(7); const e = ANIMALS[rnd(ANIMALS.length)]
    const opts = shuffle([k, k + 1, Math.max(1, k - 1), k + 2].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4))
    return { k, e, opts }
  }
  const answer = (v) => { if (v === r.k) { const ns = score + 1; setScore(ns); onScore(1, `Compté ! (${ns})`); setR(build()) } }
  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">🔢 Combien y en a-t-il ? · ⭐ {score}</p>
      <div className="count-objects">{Array.from({ length: r.k }).map((_, i) => <span key={i}>{r.e}</span>)}</div>
      <div className="answers-grid cols-4 mt-2">{r.opts.map((v) => <button key={v} type="button" className="ans-btn" onClick={() => answer(v)}>{v}</button>)}</div>
    </>
  )
}

/* ════════ Les ombres ════════ */
function ShadowGame({ onScore }) {
  const [d, setD] = useState(() => build())
  function build() {
    const pick = shuffle(ANIMALS).slice(0, 3)
    return { target: pick[0], opts: shuffle(pick) }
  }
  const click = (e) => { if (e === d.target) { onScore(3, 'Bravo !'); setD(build()) } }
  return (
    <>
      <p className="cp-level-badge mx-3.5 mt-2 shrink-0 text-center">🌑 Trouve la bonne ombre</p>
      <div className="shadow-target">{d.target}</div>
      <div className="shadow-options">
        {d.opts.map((e, i) => (
          <button key={i} type="button" className="shadow-opt" onClick={() => click(e)}>
            <span className="shadow-silhouette">{e}</span>
          </button>
        ))}
      </div>
    </>
  )
}

const GAMES = [
  { id: 'memory', icon: 'brain', tint: '#81d4fa', name: 'Mémoire', action: 'Retrouve les paires identiques.', benefit: 'Travaille la mémoire et la concentration.', badge: '+5 ⭐', Cmp: MemoryGame },
  { id: 'shadow', icon: 'shadow', tint: '#b0bec5', name: 'Les ombres', action: "Associe l'animal à son ombre.", benefit: 'Travaille la reconnaissance des formes.', badge: '+3 ⭐', Cmp: ShadowGame },
  { id: 'whack', icon: 'hammer', tint: '#ffb74d', name: 'Tape la taupe', action: 'Tape vite les animaux qui sortent.', benefit: "Développe les réflexes et l'attention.", badge: '⭐ score', Cmp: WhackGame },
  { id: 'simon', icon: 'music', tint: '#ce93d8', name: 'Simon', action: 'Répète la suite de couleurs.', benefit: 'Renforce la mémoire des séquences.', badge: '+1 ⭐ / niveau', Cmp: SimonGame },
  { id: 'intrus', icon: 'search', tint: '#a5d6a7', name: "Trouve l'intrus", action: "Touche l'animal différent.", benefit: "Aiguise l'observation et le tri.", badge: '+3 ⭐', Cmp: IntrusGame },
  { id: 'count', icon: 'numbers', tint: '#90caf9', name: 'Compte vite', action: 'Compte les animaux affichés.', benefit: 'Entraîne le calcul et le dénombrement.', badge: '+1 ⭐ / bonne', Cmp: CountGame },
]

export default function ScreenMiniGames() {
  const { setGameState, switchScreen, showFeedback, showToast, recordMission } = useGame()
  const t = useT()
  const [gameId, setGameId] = useState(null)
  const game = GAMES.find((g) => g.id === gameId)

  const reward = (stars, msg) => {
    setGameState((s) => ({ ...s, stars: (s.stars ?? 0) + stars }))
    showFeedback(true)
    showToast(`${msg} +${stars} ⭐`, '#7c4dff')
  }

  const openGame = (g) => { setGameId(g.id); recordMission('minigame') }

  const speakGame = (e, g) => {
    e.stopPropagation()
    // voix ElevenLabs (Perle), repli voix navigateur si indispo
    playClip(`audio/minigames/${g.id}.mp3`, `${g.name}. ${g.action} ${g.benefit}`)
  }

  const back = () => {
    stopAllAudio()
    if (gameId) setGameId(null)
    else switchScreen(SCREENS.TAMAGOTCHI)
  }

  return (
    <main className="screen flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden overflow-x-hidden pb-4">
      <ScreenTitle>{t('mg.title')}</ScreenTitle>

      <div className="exercise-area flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {!game && (
          <div className="mx-auto flex w-full max-w-[360px] flex-col gap-2.5">
            {GAMES.map((g) => (
              <div key={g.id} role="button" tabIndex={0} className="kid-card" onClick={() => openGame(g)} onKeyDown={(e) => e.key === 'Enter' && openGame(g)}>
                <div className="kid-card__icon" style={{ background: `linear-gradient(135deg,#ffffff,${g.tint})` }}><AppIcon name={g.icon} size={38} /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-black text-[#3e2700]">{t(`mg.${g.id}.name`)}</div>
                  <div className="mt-0.5 text-[0.72rem] font-bold text-[#6d4c41]">{t(`mg.${g.id}.action`)}</div>
                  <div className="text-[0.68rem] font-semibold text-[#8d6e3a]">💡 {t(`mg.${g.id}.benefit`)}</div>
                  <span className="kid-card__badge">{g.badge}</span>
                </div>
                <button
                  type="button"
                  className="minigame-listen-btn shrink-0"
                  onClick={(e) => speakGame(e, g)}
                  aria-label={`Écouter : ${g.name}`}
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        )}
        {game && <game.Cmp onScore={reward} />}
      </div>

      <button
        type="button"
        onClick={back}
        className="close-btn mx-4 mb-3 mt-2 shrink-0 cursor-pointer rounded-[18px] border-none font-sans text-[0.95rem] font-extrabold text-white"
      >
        {gameId ? '← Jeux' : '🏡 Retour à la ferme'}
      </button>
    </main>
  )
}
