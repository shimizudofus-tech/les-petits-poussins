// Calendrier de série : 7 cases. Case 7 = animal légendaire.
// dayInWeek (1..7) = jour atteint dans le cycle courant.
export default function DailyStreakCalendar({ dayInWeek = 1, awarded = null }) {
  return (
    <div className="streak-cal">
      <div className="streak-cal-row">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = i + 1
          const isLegend = day === 7
          const done = day < dayInWeek
          const today = day === dayInWeek
          return (
            <div
              key={day}
              className={`streak-cell${done ? ' streak-cell--done' : ''}${today ? ' streak-cell--today' : ''}${isLegend ? ' streak-cell--legend' : ''}`}
            >
              <span className="streak-cell-icon">{isLegend ? '🏆' : done ? '✓' : '⭐'}</span>
              <span className="streak-cell-day">J{day}</span>
            </div>
          )
        })}
      </div>
      {awarded ? (
        <div className="streak-legend-win">
          <img src={awarded.icon} alt={awarded.name} className="streak-legend-img" />
          <div className="streak-legend-text">
            <strong>Animal légendaire&nbsp;!</strong>
            <span>Tu as gagné : {awarded.name}</span>
          </div>
        </div>
      ) : (
        <p className="streak-cal-hint">Reviens chaque jour. Au 7ᵉ jour : un animal légendaire&nbsp;! 🦄</p>
      )}
    </div>
  )
}
