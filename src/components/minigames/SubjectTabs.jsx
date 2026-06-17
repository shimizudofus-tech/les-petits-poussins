export default function SubjectTabs({ tabs, active, onSelect, variant }) {
  const wrapClass =
    variant === 'petite' || variant === 'moyenne' || variant === 'grande'
      ? `subject-tabs subject-tabs--${variant}`
      : 'subject-tabs'

  return (
    <div className={`${wrapClass} flex shrink-0 gap-1.5 px-2 pb-0 pt-2.5`}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`stab flex-1 cursor-pointer rounded-2xl border-none px-1 py-2.5 font-[Nunito,Arial,sans-serif] font-extrabold transition-all duration-150 active:scale-95 ${
            variant === 'petite' || variant === 'moyenne' || variant === 'grande'
              ? 'text-[0.68rem] leading-tight'
              : 'text-[0.8rem]'
          } ${
            active === id
              ? 'bg-white text-[#e65100] shadow-[0_6px_14px_rgba(255,140,0,0.28)]'
              : 'bg-white/45 text-[#8d6e3a] hover:bg-white/70'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
