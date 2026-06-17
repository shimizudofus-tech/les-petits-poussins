export default function ScreenTitle({ children }) {
  return (
    <div className="screen-title shrink-0 px-2 py-2 text-center text-sm font-black uppercase tracking-wide">
      <span className="block truncate">{children}</span>
    </div>
  )
}
