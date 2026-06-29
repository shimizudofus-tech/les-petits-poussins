import { useState } from 'react'
import ScreenTitle from './ScreenTitle'
import MathExercise from '../minigames/MathExercise'
import AppIcon from '../AppIcon'
import { SCREENS, useGame } from '../../context/GameContext'

const LEVELS = [
  ['cp', 'CP', '6-7 ans'],
  ['ce1', 'CE1', '7-8 ans'],
  ['ce2', 'CE2', '8-9 ans'],
  ['cm1', 'CM1', '9-10 ans'],
  ['cm2', 'CM2', '10-11 ans'],
]
const TOTAL = 5
const REWARD = 10

export default function ScreenLesson() {
  const { switchScreen, setGameState, showToast } = useGame()
  const [level, setLevel] = useState(null)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const handleCorrect = () => {
    if (step + 1 >= TOTAL) {
      setDone(true)
      setGameState((s) => ({ ...s, stars: (s.stars || 0) + REWARD }))
      showToast(`Leçon terminée ! +${REWARD} ⭐`, '#43a047')
    } else {
      setTimeout(() => setStep((s) => s + 1), 900)
    }
  }

  const restart = () => { setLevel(null); setStep(0); setDone(false) }

  return (
    <main className="screen flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden overflow-x-hidden pb-4">
      <ScreenTitle>📘 Leçon du jour</ScreenTitle>

      <div className="exercise-area flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto px-3.5 pb-1 pt-3.5">
        {!level && (
          <div className="mx-auto flex w-full max-w-[360px] flex-col gap-2.5">
            <p className="lesson-intro">Choisis ton niveau pour 5 exercices.</p>
            {LEVELS.map(([id, label, age]) => (
              <button key={id} type="button" className="kid-card lesson-level-btn" onClick={() => setLevel(id)}>
                <div className="kid-card__icon" style={{ background: 'linear-gradient(135deg,#e3f2fd,#90caf9)' }}>
                  <AppIcon name={id} size={38} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-lg font-black text-[#3e2700]">{label}</div>
                  <div className="text-[0.72rem] font-bold text-[#6d4c41]">{age}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {level && !done && (
          <>
            <div className="lesson-progress">
              <div className="lesson-progress-bar">
                <div className="lesson-progress-fill" style={{ width: `${(step / TOTAL) * 100}%` }} />
              </div>
              <span className="lesson-progress-label">Question {step + 1} / {TOTAL}</span>
            </div>
            <MathExercise key={step} exerciseKey={step} level={level} onCorrect={handleCorrect} />
          </>
        )}

        {done && (
          <div className="lesson-done">
            <div className="lesson-done-emoji">🏆</div>
            <h2 className="lesson-done-title">Bravo ! Leçon terminée</h2>
            <p className="lesson-done-text">Tu as gagné {REWARD} ⭐</p>
            <button type="button" className="kid-btn kid-btn--play" onClick={restart}>
              Refaire une leçon
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
        className="close-btn mx-4 mb-3 mt-2 shrink-0 cursor-pointer rounded-[18px] border-none px-6 py-3 font-sans text-[0.95rem] font-extrabold text-white"
      >
        🏡 Retour à la ferme
      </button>
    </main>
  )
}
