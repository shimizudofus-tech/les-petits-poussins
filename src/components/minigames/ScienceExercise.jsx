import { useMemo } from 'react'
import { ANIMAL_INFO } from '../../data/animalInfo'
import { playWord } from '../../utils/audio'
import AnswerButtons from './AnswerButtons'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Nom + emoji + article par animal (clés alignées sur ANIMAL_INFO).
const ANIMALS = [
  { key: 'chicken', emoji: '🐔', name: 'poule', art: 'la' },
  { key: 'pig', emoji: '🐷', name: 'cochon', art: 'le' },
  { key: 'cow', emoji: '🐮', name: 'vache', art: 'la' },
  { key: 'sheep', emoji: '🐑', name: 'mouton', art: 'le' },
  { key: 'rabbit', emoji: '🐰', name: 'lapin', art: 'le' },
  { key: 'duck', emoji: '🦆', name: 'canard', art: 'le' },
  { key: 'horse', emoji: '🐴', name: 'cheval', art: 'le' },
  { key: 'goat', emoji: '🐐', name: 'chèvre', art: 'la' },
  { key: 'dog', emoji: '🐶', name: 'chien', art: 'le' },
  { key: 'cat', emoji: '🐱', name: 'chat', art: 'le' },
  { key: 'turkey', emoji: '🦃', name: 'dinde', art: 'la' },
  { key: 'mouse', emoji: '🐭', name: 'souris', art: 'la' },
]

function buildEatsOptions(correctKey) {
  const correct = ANIMAL_INFO[correctKey]?.eats
  const others = ANIMALS.map((a) => ANIMAL_INFO[a.key]?.eats).filter((e) => e && e !== correct)
  const set = new Set([correct])
  while (set.size < 4 && others.length) {
    const i = Math.floor(Math.random() * others.length)
    set.add(others.splice(i, 1)[0])
  }
  return [...set].sort(() => Math.random() - 0.5)
}

export default function ScienceExercise({ onCorrect, exerciseKey = 0 }) {
  const data = useMemo(() => {
    const animal = pick(ANIMALS)
    const info = ANIMAL_INFO[animal.key]
    return {
      animal,
      fact: info?.fact,
      question: `Que mange ${animal.art} ${animal.name} ?`,
      answer: info?.eats,
      options: buildEatsOptions(animal.key),
    }
  }, [exerciseKey])

  const { animal } = data

  return (
    <>
      <div className="science-card">
        <div className="science-card-label">
          🔬 Sciences — la ferme
          <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
        </div>
        <div className="science-animal" aria-hidden="true">{animal.emoji}</div>
        <p className="science-question">{data.question}</p>
      </div>
      <AnswerButtons
        options={data.options}
        correct={data.answer}
        onCorrect={onCorrect}
        columns={1}
        feedbackMeta={{ exerciseId: `science-${animal.key}` }}
      />
    </>
  )
}
