import { useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'
import { speakFallback, stopAllAudio } from '../utils/audio'
import { getActiveAudioSettings } from '../utils/audioSettings'

const STEPS = [
  { icon: '👋', title: 'Bienvenue !', text: "Élève ton animal et apprends en t'amusant." },
  { icon: '🍎', title: 'Nourris ton animal', text: 'Touche « Nourrir » pour le faire grandir : œuf → bébé → adulte.' },
  { icon: '🎮', title: 'Joue & Apprends', text: 'Maths, lecture, dictée, lettres à tracer… selon ton niveau.' },
  { icon: '🌾', title: 'Explore & Collectionne', text: 'Visite la ferme, écoute les animaux et débloque-les tous.' },
  { icon: '⚙️', title: 'Espace parent', text: 'En haut à droite : profils, temps d\'écran et suivi des progrès.' },
]

export default function TutorialOverlay() {
  const { endTutorial } = useGame()
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1
  const s = STEPS[step]

  const speakStep = () => {
    if (getActiveAudioSettings().voiceEnabled) speakFallback(`${s.title}. ${s.text}`)
  }

  // Lecture orale auto à chaque étape ; on coupe la voix à la fermeture.
  useEffect(() => {
    speakStep()
    return () => stopAllAudio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const finish = (rewarded) => {
    stopAllAudio()
    endTutorial(rewarded)
  }

  return (
    <div className="tuto-overlay">
      <div className="tuto-card">
        <button type="button" className="tuto-skip" onClick={() => finish(false)}>
          Passer
        </button>
        <div className="text-5xl">{s.icon}</div>
        <h2 className="text-xl font-black text-[#5d3a00]">{s.title}</h2>
        <p className="text-sm font-bold text-[#6d4c41]">{s.text}</p>
        <button type="button" className="tuto-replay" onClick={speakStep} aria-label="Réécouter">🔊 Réécouter</button>

        <div className="tuto-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`tuto-dot${i === step ? ' tuto-dot--on' : ''}`} />
          ))}
        </div>

        <div className="flex w-full gap-2">
          {step > 0 ? (
            <button type="button" className="kid-btn kid-btn--ghost flex-1" onClick={() => setStep((n) => n - 1)}>
              ← Retour
            </button>
          ) : null}
          {last ? (
            <button type="button" className="kid-btn kid-btn--feed flex-1" onClick={() => finish(true)}>
              ✅ Terminer (+15⭐)
            </button>
          ) : (
            <button type="button" className="kid-btn kid-btn--play flex-1" onClick={() => setStep((n) => n + 1)}>
              Suivant →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
