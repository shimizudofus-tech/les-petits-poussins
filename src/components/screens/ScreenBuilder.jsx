import MobileScreenLayout from '../layout/MobileScreenLayout'
import { useGame } from '../../context/GameContext'
import { resolveBuilderIcon } from '../../data/builderAssets'
import { isImageIcon } from '../../utils/animalIcon'

function BuilderIcon({ icon, sizeClass, alt = '' }) {
  if (isImageIcon(icon)) {
    return (
      <img
        src={icon}
        alt={alt}
        draggable={false}
        className={sizeClass}
      />
    )
  }
  return <span className={sizeClass} aria-hidden={!alt}>{icon}</span>
}

export default function ScreenBuilder() {
  const { gameState, selectBuilderItem, placeBuilderItem } = useGame()

  return (
    <MobileScreenLayout
      className="screen-builder"
      title="AMÉNAGER"
      titleIcon="🔨"
      scrollable={false}
      mainClassName="flex min-h-0 flex-1 flex-col overflow-hidden px-[var(--screen-padding)] py-1.5"
    >
      <div className="builder-top shrink-0">
        <p className="builder-hint text-center text-[0.68rem] leading-tight font-bold text-[#2e7d32]">
          👆 Choisis un objet, puis touche la grille
        </p>

        <div className="catalog-scroll catalog py-1">
          <div className="catalog-track">
            {gameState.shop.map((item) => {
              const icon = resolveBuilderIcon(item.icon, gameState.shop)
              const longName = item.name.length > 7
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectBuilderItem(item.id)}
                  onKeyDown={(e) => e.key === 'Enter' && selectBuilderItem(item.id)}
                  className={`catalog-item cursor-pointer rounded-[12px] border-[3px] transition-transform duration-100 ${
                    gameState.builderSelectedItem === item.id ? 'selected' : ''
                  }`}
                >
                  <div className="item-icon">
                    <BuilderIcon
                      icon={icon}
                      alt=""
                      sizeClass="catalog-icon-size"
                    />
                  </div>
                  <div className={`item-name font-extrabold text-[#5d3a00] ${longName ? 'item-name--long' : ''}`}>
                    {item.name}
                  </div>
                  <div className="item-price font-bold text-[#e65100]">⭐ {item.price}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="builder-workspace">
        <p className="builder-zone-label">Ton enclos</p>
        <div className="grid-builder">
          {gameState.farmLayout.map((cellIcon, index) => {
            const icon = resolveBuilderIcon(cellIcon, gameState.shop)
            return (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => placeBuilderItem(index)}
                onKeyDown={(e) => e.key === 'Enter' && placeBuilderItem(index)}
                className={`grid-cell ${cellIcon ? 'occupied' : ''}`}
              >
                {cellIcon ? <BuilderIcon icon={icon} sizeClass="grid-cell-icon" /> : null}
              </div>
            )
          })}
        </div>
      </div>
    </MobileScreenLayout>
  )
}
