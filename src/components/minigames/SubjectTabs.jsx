export default function SubjectTabs({ tabs, active, onSelect }) {
  return (
    <div className="subject-tabs flex shrink-0 gap-2 px-3 pb-0 pt-2.5">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`stab flex-1 cursor-pointer rounded-t-[14px] border-none px-1 py-2.5 font-[Nunito,Arial,sans-serif] text-[0.8rem] font-extrabold transition-[background,color] duration-150 ${
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
