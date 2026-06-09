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
          className={`stab flex-1 cursor-pointer rounded-t-[14px] border-none px-1 py-2.5 font-[Nunito,Arial,sans-serif] font-extrabold transition-[background,color] duration-150 ${
            variant === 'petite' || variant === 'moyenne' || variant === 'grande'
              ? 'text-[0.68rem] leading-tight'
              : 'text-[0.8rem]'
          } ${
            active === id
              ? 'bg-white text-[#e65100] shadow-[0_3px_0_#ff8f00]'
              : 'bg-white/40 text-[#8d6e3a] shadow-[0_2px_0_rgba(0,0,0,0.08)] hover:bg-white/65'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
