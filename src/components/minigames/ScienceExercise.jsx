import { useMemo } from 'react'
import { playWord } from '../../utils/audio'
import AnswerButtons from './AnswerButtons'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Banque de questions Sciences niveau CP.
// Règle : 1 bonne réponse évidente + 3 mauvaises CLAIREMENT fausses (pas « presque vraies »).
const QUESTIONS = [
  // ── Animaux ──
  { icon: '🐄', q: 'Que mange la vache ?', a: 'Herbe fraîche et foin', w: ['Bonbons et chocolat', 'Viande et poisson', 'Cailloux et sable'] },
  { icon: '🐔', q: 'Que pond la poule ?', a: 'Des œufs', w: ['Du lait', 'Des cailloux', 'Des feuilles'] },
  { icon: '🐟', q: 'Où vit le poisson ?', a: "Dans l'eau", w: ['Dans un arbre', 'Dans le ciel', 'Dans une chaussure'] },
  { icon: '🥛', q: 'Quel animal donne du lait ?', a: 'La vache', w: ['Le poisson', 'La poule', 'Le serpent'] },
  { icon: '🐑', q: 'Quel animal a de la laine ?', a: 'Le mouton', w: ['Le poisson', 'La grenouille', 'Le canard'] },
  { icon: '🐰', q: 'Que mange le lapin ?', a: 'Des carottes', w: ['De la viande', 'Des bonbons', 'Du métal'] },
  { icon: '🐝', q: "Que fabrique l'abeille ?", a: 'Du miel', w: ['Du pain', 'Du fromage', 'Du chocolat'] },
  // ── Nature ──
  { icon: '🌱', q: 'Que faut-il à une plante pour pousser ?', a: "De l'eau et de la lumière", w: ['Du chocolat', 'Du sable sec', 'De la musique'] },
  { icon: '🌸', q: 'Où pousse une fleur ?', a: 'Dans la terre', w: ['Dans le feu', 'Dans le ciel', 'Dans une boîte'] },
  { icon: '☀️', q: 'Que voit-on dans le ciel le jour ?', a: 'Le soleil', w: ['La lune', 'Des poissons', 'Une voiture'] },
  { icon: '🌙', q: 'Que voit-on souvent la nuit ?', a: 'La lune', w: ['Le soleil', 'Un arc-en-ciel', 'Des fleurs'] },
  { icon: '🌧️', q: "Qu'est-ce qui tombe quand il pleut ?", a: "De l'eau", w: ['Du sable', 'Des cailloux', 'Du feu'] },
  // ── Corps / sens ──
  { icon: '👂', q: 'Avec quoi entend-on ?', a: 'Les oreilles', w: ['Les yeux', 'Les pieds', 'Le nez'] },
  { icon: '👀', q: 'Avec quoi voit-on ?', a: 'Les yeux', w: ['Les oreilles', 'Les mains', 'La bouche'] },
  { icon: '👃', q: 'Avec quoi sent-on les odeurs ?', a: 'Le nez', w: ['Les yeux', 'Les pieds', 'Les oreilles'] },
]

export default function ScienceExercise({ onCorrect, exerciseKey = 0 }) {
  const data = useMemo(() => {
    const item = pick(QUESTIONS)
    const options = [item.a, ...item.w].sort(() => Math.random() - 0.5)
    return { item, options }
  }, [exerciseKey])

  const { item } = data

  return (
    <>
      <div className="science-card">
        <div className="science-card-label">
          🔬 Sciences
          <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
        </div>
        <div className="science-animal" aria-hidden="true">{item.icon}</div>
        <p className="science-question">{item.q}</p>
      </div>
      <AnswerButtons
        options={data.options}
        correct={item.a}
        onCorrect={onCorrect}
        columns={1}
        feedbackMeta={{ exerciseId: `science-${item.q}` }}
      />
    </>
  )
}
