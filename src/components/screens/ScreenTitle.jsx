export default function ScreenTitle({ children }) {
  return (
    <div className="screen-title shrink-0 border-b-[3px] border-[#c8902a] bg-gradient-to-br from-[#ffe082] to-[#ffcc02] px-2 py-1.5 text-center text-sm font-black uppercase tracking-wide text-[#5d3a00] shadow-[0_1px_0_rgba(255,255,255,0.5)]">
      <span className="block truncate">{children}</span>
    </div>
  )
}
