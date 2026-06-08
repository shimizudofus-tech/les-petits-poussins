export default function MobileScreenLayout({
  title,
  titleIcon,
  header,
  footer,
  children,
  className = '',
  mainClassName = '',
  scrollable = true,
}) {
  return (
    <div
      className={`screen flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden ${className}`}
    >
      {header ??
        (title ? (
          <header className="screen-header shrink-0 border-b-[3px] border-[#c8902a] bg-gradient-to-br from-[#ffe082] to-[#ffcc02] px-[var(--screen-padding)] py-1.5 text-center">
            <h1 className="truncate text-sm font-black uppercase tracking-wide text-[#5d3a00]">
              {titleIcon ? `${titleIcon} ` : ''}
              {title}
            </h1>
          </header>
        ) : null)}

      <main
        className={`screen-content flex-1 min-h-0 w-full max-w-full ${
          scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'
        } ${mainClassName}`}
      >
        {children}
      </main>

      {footer ? (
        <footer className="screen-footer w-full max-w-full shrink-0 overflow-x-hidden">
          {footer}
        </footer>
      ) : null}
    </div>
  )
}
