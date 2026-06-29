import { useMemo, useState } from 'react'

import { getExercises } from '../../data/exercises'

import { SHAPE_RENDERERS } from '../../data/exercises/shapeRenderers'

import { useGame } from '../../context/GameContext'

import ExerciseUnavailable from './ExerciseUnavailable'



function buildShapeOptions() {

  const pool = getExercises('maternelle', 'shapes')

  if (!pool.length) return null



  const target = pool[Math.floor(Math.random() * pool.length)]

  const opts = [target]

  const others = pool.filter((s) => s.shapeId !== target.shapeId)

  while (opts.length < 4 && others.length) {

    const pick = others[Math.floor(Math.random() * others.length)]

    if (!opts.find((o) => o.shapeId === pick.shapeId)) opts.push(pick)

  }

  return { target, options: opts.sort(() => Math.random() - 0.5) }

}



export default function ShapesExercise({ onCorrect }) {

  const { showFeedback } = useGame()

  const shapeData = useMemo(buildShapeOptions, [])

  const [selected, setSelected] = useState(null)

  const [answered, setAnswered] = useState(false)



  if (!shapeData) {

    return <ExerciseUnavailable />

  }



  const { target, options } = shapeData



  const handleSelect = (shape) => {

    if (answered) return

    setSelected(shape.name)

    const isCorrect = shape.shapeId === target.shapeId

    setAnswered(true)

    showFeedback(isCorrect)

    if (isCorrect) onCorrect?.()
    else setTimeout(() => { setAnswered(false); setSelected(null) }, 1100)

  }



  return (

    <>

      <div className="mb-1.5 text-center text-[0.85rem] font-extrabold text-[#5d3a00]">

        👆 Trouve le <strong>{target.name}</strong> !

      </div>

      <div className="shapes-row flex flex-wrap justify-center gap-3">

        {options.map((shape) => {

          const ShapeIcon = SHAPE_RENDERERS[shape.shapeId]

          return (

            <div

              key={shape.id}

              role="button"

              tabIndex={0}

              onClick={() => handleSelect(shape)}

              onKeyDown={(e) => e.key === 'Enter' && handleSelect(shape)}

              className={`shape-item flex cursor-pointer flex-col items-center gap-1 rounded-[14px] border-[3px] px-3.5 py-2.5 text-[0.75rem] font-extrabold text-[#5d3a00] transition-[transform,border-color] duration-150 active:scale-[0.92] ${

                selected === shape.name

                  ? 'selected border-[#ff8f00] bg-[rgba(255,224,130,0.85)]'

                  : 'border-transparent bg-white/70'

              }`}

            >

              <svg className="shape-svg h-[52px] w-[52px] text-[#5d3a00]" viewBox="0 0 52 52">

                {ShapeIcon ? <ShapeIcon /> : null}

              </svg>

              <span>{shape.name}</span>

            </div>

          )

        })}

      </div>

    </>

  )

}

