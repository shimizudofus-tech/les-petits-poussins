import { useMemo } from 'react'
import { getAmbiance } from '../utils/ambiance'

// Scatter particles deterministically so they never line up in a grid.
function buildParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const left = (i * 37 + 11) % 100
    const delay = ((i * 13) % 90) / 10 // 0–9s
    const duration = 8 + ((i * 7) % 70) / 10 // 8–15s
    const scale = 0.7 + ((i * 17) % 70) / 100 // 0.7–1.4
    const drift = ((i * 29) % 70) - 35 // -35 → 35 px
    return { id: i, left, delay, duration, scale, drift }
  })
}

export default function EvolvingBackground({ stage = 'egg', farmLevel = 1, className = '' }) {
  const ambiance = useMemo(() => getAmbiance({ stage, farmLevel }), [stage, farmLevel])

  const particles = useMemo(
    () => buildParticles(ambiance.particleCount),
    [ambiance.particleCount],
  )

  const birds = useMemo(
    () =>
      ambiance.celestial === 'moon'
        ? []
        : Array.from({ length: ambiance.creatures }, (_, i) => ({
            id: i,
            top: 20 + i * 13,
            delay: i * 2.4,
            duration: 16 + i * 4,
            scale: 0.8 + i * 0.15,
          })),
    [ambiance.creatures, ambiance.celestial],
  )

  return (
    <div
      className={`evolving-bg ${className}`}
      style={ambiance.cssVars}
      data-time={ambiance.time}
      data-season={ambiance.season}
      data-stage={ambiance.stage}
      data-particle={ambiance.particleType}
      aria-hidden="true"
    >
      <div className="evolving-bg__sky" />
      <div className="evolving-bg__atmosphere" />

      {ambiance.showStars && (
        <div className="evolving-bg__stars">
          {Array.from({ length: 32 }, (_, i) => (
            <span
              key={i}
              className="evolving-bg__star"
              style={{
                left: `${(i * 53 + 7) % 100}%`,
                top: `${(i * 31 + 5) % 68}%`,
                animationDelay: `${(i % 12) * 0.28}s`,
                '--star-scale': 0.5 + ((i * 7) % 10) / 10,
              }}
            />
          ))}
        </div>
      )}

      <div className="evolving-bg__celestial">
        {ambiance.celestial === 'sun' ? (
          <div className="evolving-bg__sun" />
        ) : (
          <div className="evolving-bg__moon" />
        )}
      </div>

      <div className="evolving-bg__clouds">
        <span className="evolving-bg__cloud evolving-bg__cloud--1" />
        <span className="evolving-bg__cloud evolving-bg__cloud--2" />
        <span className="evolving-bg__cloud evolving-bg__cloud--3" />
      </div>

      <div className="evolving-bg__hills">
        <div className="evolving-bg__hill evolving-bg__hill--back" />
        <div className="evolving-bg__hill evolving-bg__hill--front" />
        <div className="evolving-bg__ground" />
      </div>

      <div className="evolving-bg__particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="evolving-bg__particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
              '--p-scale': p.scale,
            }}
          />
        ))}
      </div>

      {birds.map((b) => (
        <svg
          key={`bird-${b.id}`}
          className="evolving-bg__bird"
          viewBox="0 0 24 10"
          style={{
            top: `${b.top}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            '--bird-scale': b.scale,
          }}
        >
          <path
            d="M2 8 Q6 2 11 7 Q16 2 22 8"
            fill="none"
            stroke="rgba(60,60,80,0.55)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  )
}
