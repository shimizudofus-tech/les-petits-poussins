// Jeu d'icônes maison : SVG colorés, style enfant (formes pleines + ombrage léger).
// Usage : <AppIcon name="apple" size={28} />
// Remplace les emoji des boutons/écrans principaux.

const ICONS = {
  // 🔥 Série (streak)
  flame: (
    <>
      <path d="M24 4c-2 8-10 11-10 22a10 10 0 0020 0c0-5-3-8-3-12-3 2-4 5-4 8 0-7-1-13 1-18Z" fill="#ff7043" />
      <path d="M24 18c-1 6-6 7-6 13a6 6 0 0012 0c0-4-3-6-3-9-2 1-3 3-3 5z" fill="#ffca28" />
    </>
  ),
  // 🍎 Nourrir
  apple: (
    <>
      <path d="M24 16c-3-5-9-6-13-3-5 4-5 13-1 20 2 4 5 7 8 6 2-1 4-1 6 0 3 1 6-2 8-6 4-7 4-16-1-20-4-3-10-2-7 3Z" fill="#e53935" />
      <path d="M24 16c-3-5-9-6-13-3-3 2-4 6-3 10 2-4 5-7 9-7 3 0 5 1 7 0Z" fill="#ff6f60" />
      <path d="M24 16c1-4 5-7 9-7-1 4-4 7-9 7Z" fill="#43a047" />
      <rect x="23" y="8" width="2.5" height="8" rx="1.2" fill="#6d4c41" />
    </>
  ),
  // ⭐ Étoile
  star: (
    <>
      <path d="M24 4l5.6 11.3 12.5 1.8-9 8.8 2.1 12.4L24 32.4 12.8 38.3l2.1-12.4-9-8.8 12.5-1.8z" fill="#ffca28" stroke="#f9a825" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 10l3 6 1.5-1.2z" fill="#fff3c4" opacity="0.8" />
    </>
  ),
  // 🎮 Jouer & Apprendre (manette)
  play: (
    <>
      <rect x="4" y="16" width="40" height="20" rx="10" fill="#7c4dff" />
      <rect x="4" y="16" width="40" height="10" rx="5" fill="#9575ff" />
      <rect x="12" y="24" width="9" height="3" rx="1.5" fill="#fff" />
      <rect x="15" y="21" width="3" height="9" rx="1.5" fill="#fff" />
      <circle cx="31" cy="23" r="2.4" fill="#ffca28" />
      <circle cx="37" cy="27" r="2.4" fill="#43a047" />
      <circle cx="31" cy="31" r="2.4" fill="#ff5252" />
    </>
  ),
  // 🥚 Œuf / nouvel animal
  egg: (
    <>
      <ellipse cx="24" cy="28" rx="15" ry="18" fill="#fff8e1" stroke="#e0c068" strokeWidth="2" />
      <ellipse cx="19" cy="22" rx="4" ry="6" fill="#fff" opacity="0.7" />
      <path d="M11 27l5 3-5 3 5 2-4 3" fill="none" stroke="#e0c068" strokeWidth="1.6" strokeLinejoin="round" opacity="0.6" />
    </>
  ),
  // 📖 Collection (livre)
  book: (
    <>
      <path d="M6 10c6-3 12-3 18 1v30c-6-4-12-4-18-1z" fill="#42a5f5" />
      <path d="M42 10c-6-3-12-3-18 1v30c6-4 12-4 18-1z" fill="#1e88e5" />
      <path d="M24 11v30" stroke="#0d47a1" strokeWidth="1.5" />
      <path d="M10 16c3-1 6-1 9 1M10 22c3-1 6-1 9 1" stroke="#fff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
    </>
  ),
  // 🌾 Explorer (blé)
  wheat: (
    <>
      <path d="M24 44V18" stroke="#8d6e3a" strokeWidth="2.5" strokeLinecap="round" />
      <g fill="#f9a825">
        <ellipse cx="24" cy="12" rx="3.5" ry="6" />
        <ellipse cx="17" cy="20" rx="3" ry="5" transform="rotate(-30 17 20)" />
        <ellipse cx="31" cy="20" rx="3" ry="5" transform="rotate(30 31 20)" />
        <ellipse cx="16" cy="28" rx="3" ry="5" transform="rotate(-30 16 28)" />
        <ellipse cx="32" cy="28" rx="3" ry="5" transform="rotate(30 32 28)" />
      </g>
      <path d="M24 18c-2-1-6-3-8-7M24 26c-2-1-6-3-8-7M24 18c2-1 6-3 8-7M24 26c2-1 6-3 8-7" stroke="#c8902a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  ),
  // ✨ Améliorer (étincelle / baguette)
  sparkle: (
    <>
      <path d="M28 6l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffca28" stroke="#f9a825" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 26l1.6 4 4 1.6-4 1.6L13 39l-1.6-4-4-1.6 4-1.6z" fill="#ce93d8" stroke="#ab47bc" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="37" cy="34" r="2.5" fill="#4fc3f7" />
    </>
  ),
  // ✍️ J'écris (crayon)
  pencil: (
    <>
      <rect x="30" y="4" width="9" height="34" rx="2" transform="rotate(40 34 20)" fill="#ffca28" />
      <rect x="30" y="4" width="9" height="8" rx="2" transform="rotate(40 34 20)" fill="#f48fb1" />
      <path d="M11 39l2-8 6 5z" fill="#ffe0b2" />
      <path d="M11 39l1-4 3 2.5z" fill="#5d4037" />
      <rect x="30" y="10" width="9" height="3" transform="rotate(40 34 20)" fill="#c8902a" />
    </>
  ),
  // 🎲 Mini-jeux (dé)
  dice: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="7" fill="#ef5350" />
      <rect x="8" y="8" width="32" height="32" rx="7" fill="url(#diceShade)" opacity="0.0" />
      <circle cx="17" cy="17" r="3" fill="#fff" />
      <circle cx="31" cy="17" r="3" fill="#fff" />
      <circle cx="24" cy="24" r="3" fill="#fff" />
      <circle cx="17" cy="31" r="3" fill="#fff" />
      <circle cx="31" cy="31" r="3" fill="#fff" />
    </>
  ),
  // 🏡 Retour ferme (maison)
  house: (
    <>
      <path d="M24 7L6 21h4v18h28V21h4z" fill="#ef9a9a" />
      <path d="M24 7L6 21h4l14-11 14 11h4z" fill="#e53935" />
      <rect x="20" y="28" width="8" height="11" rx="1" fill="#6d4c41" />
      <rect x="13" y="25" width="6" height="6" rx="1" fill="#fff9c4" />
      <rect x="29" y="25" width="6" height="6" rx="1" fill="#fff9c4" />
    </>
  ),
  // 🏆 Trophée (adulte)
  trophy: (
    <>
      <path d="M14 8h20v8a10 10 0 01-20 0z" fill="#ffca28" />
      <path d="M14 10H8v3a6 6 0 006 6M34 10h6v3a6 6 0 01-6 6" fill="none" stroke="#f9a825" strokeWidth="2.5" />
      <rect x="21" y="26" width="6" height="8" fill="#f9a825" />
      <rect x="14" y="34" width="20" height="5" rx="2" fill="#c8902a" />
    </>
  ),
  // 🐣 Petite Section (poussin qui éclôt)
  hatch: (
    <>
      <path d="M11 30a13 13 0 0026 0l-3 3-4-3-4 3-4-3-4 3-4-3z" fill="#fff8e1" stroke="#e0c068" strokeWidth="1.6" />
      <circle cx="24" cy="20" r="11" fill="#ffd54f" />
      <circle cx="20" cy="18" r="2" fill="#3e2723" />
      <circle cx="28" cy="18" r="2" fill="#3e2723" />
      <path d="M22 22l4 0-2 3z" fill="#ff8f00" />
    </>
  ),
  // 🐥 Moyenne Section (poussin)
  chick: (
    <>
      <ellipse cx="24" cy="30" rx="14" ry="12" fill="#ffd54f" />
      <circle cx="24" cy="16" r="10" fill="#ffe082" />
      <circle cx="20" cy="15" r="2" fill="#3e2723" />
      <circle cx="28" cy="15" r="2" fill="#3e2723" />
      <path d="M22 18l4 0-2 3z" fill="#ff8f00" />
      <path d="M13 32l-5 2 5 2M35 32l5 2-5 2" fill="#ffca28" />
      <path d="M19 9l3-4 1 4M25 9l3-4 1 4" fill="#ffd54f" />
    </>
  ),
  // 🐔 Grande Section (poule)
  hen: (
    <>
      <ellipse cx="22" cy="28" rx="15" ry="13" fill="#fff" />
      <ellipse cx="22" cy="28" rx="15" ry="13" fill="#fafafa" />
      <circle cx="32" cy="18" r="8" fill="#fff" />
      <path d="M30 11c0-3 4-3 4 0 1-3 4-2 3 1 2-1 3 2 0 3z" fill="#e53935" />
      <circle cx="34" cy="17" r="1.6" fill="#3e2723" />
      <path d="M38 19l5 1-5 2z" fill="#ff8f00" />
      <path d="M33 24c-1 2-2 3-4 3" stroke="#e53935" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8 28c-3-2-4 0-3 3 2 2 5 1 6-2z" fill="#ffca28" />
    </>
  ),
  // 🧠 Mémoire (cerveau)
  brain: (
    <>
      <path d="M19 8c-5 0-8 3-8 7-3 1-4 4-2 7-2 2-1 6 2 7 0 4 4 6 8 4z" fill="#f48fb1" />
      <path d="M29 8c5 0 8 3 8 7 3 1 4 4 2 7 2 2 1 6-2 7 0 4-4 6-8 4z" fill="#f06292" />
      <path d="M24 10v28" stroke="#ad1457" strokeWidth="1.5" />
      <path d="M19 16c2 1 3 3 2 5M29 16c-2 1-3 3-2 5M17 26c2 0 4 1 4 4M31 26c-2 0-4 1-4 4" stroke="#ad1457" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  // 🔨 Tape la taupe (marteau)
  hammer: (
    <>
      <rect x="22" y="20" width="5" height="22" rx="2.5" transform="rotate(-30 24 31)" fill="#8d6e3a" />
      <rect x="10" y="10" width="22" height="11" rx="3" transform="rotate(-30 21 15)" fill="#90a4ae" />
      <rect x="10" y="10" width="22" height="5" rx="2.5" transform="rotate(-30 21 15)" fill="#b0bec5" />
    </>
  ),
  // 🎵 Simon (notes)
  music: (
    <>
      <path d="M20 10l18-4v22" fill="none" stroke="#ab47bc" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="16" cy="34" rx="6" ry="5" fill="#ce93d8" />
      <ellipse cx="34" cy="28" rx="6" ry="5" fill="#ab47bc" />
    </>
  ),
  // 🔍 Trouve l'intrus (loupe)
  search: (
    <>
      <circle cx="21" cy="21" r="12" fill="#a5d6a7" stroke="#43a047" strokeWidth="3" />
      <circle cx="21" cy="21" r="6" fill="#e8f5e9" opacity="0.6" />
      <rect x="29" y="29" width="14" height="6" rx="3" transform="rotate(45 36 32)" fill="#2e7d32" />
    </>
  ),
  // 🔢 Compte vite (chiffres)
  numbers: (
    <>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#42a5f5" />
      <rect x="6" y="6" width="36" height="18" rx="8" fill="#64b5f6" />
      <text x="16" y="22" fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">1</text>
      <text x="32" y="22" fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">2</text>
      <text x="16" y="38" fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">3</text>
      <text x="32" y="38" fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle">4</text>
    </>
  ),
  // 🔒 Cadenas (verrouillé)
  lock: (
    <>
      <path d="M16 22v-4a8 8 0 0116 0v4" fill="none" stroke="#b8860b" strokeWidth="4" strokeLinecap="round" />
      <rect x="10" y="22" width="28" height="20" rx="5" fill="#ffca28" />
      <rect x="10" y="22" width="28" height="20" rx="5" fill="#ffd54f" opacity="0.5" />
      <circle cx="24" cy="30" r="3.5" fill="#8d6e3a" />
      <rect x="22.5" y="31" width="3" height="6" rx="1.5" fill="#8d6e3a" />
    </>
  ),
  // ✏️ CP (crayon-règle)
  cp: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#42a5f5" />
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#64b5f6" opacity="0.5" />
      <path d="M16 32l2-6 10-10 4 4-10 10z" fill="#ffe0b2" />
      <path d="M28 16l4 4 2-2-4-4z" fill="#f48fb1" />
      <path d="M16 32l1-3 2 2z" fill="#5d4037" />
    </>
  ),
  // 📐 CE1 (règle/équerre)
  ce1: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#7e57c2" />
      <path d="M14 34V14l20 20z" fill="#fff" opacity="0.92" />
      <path d="M18 30v-7l7 7z" fill="#7e57c2" opacity="0.5" />
    </>
  ),
  // 🧮 CE2 (boulier)
  ce2: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#26a69a" />
      <rect x="13" y="14" width="22" height="3" rx="1.5" fill="#80cbc4" />
      <rect x="13" y="23" width="22" height="3" rx="1.5" fill="#80cbc4" />
      <rect x="13" y="32" width="22" height="3" rx="1.5" fill="#80cbc4" />
      <circle cx="18" cy="15.5" r="3" fill="#ff7043" />
      <circle cx="28" cy="24.5" r="3" fill="#ffca28" />
      <circle cx="22" cy="33.5" r="3" fill="#ef5350" />
    </>
  ),
  // 📊 CM1 (graphique)
  cm1: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#ffa726" />
      <rect x="14" y="26" width="5" height="9" rx="1.5" fill="#fff" />
      <rect x="21.5" y="20" width="5" height="15" rx="1.5" fill="#fff" />
      <rect x="29" y="14" width="5" height="21" rx="1.5" fill="#fff" />
    </>
  ),
  // 🎓 CM2 (diplôme)
  cm2: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#ec407a" />
      <path d="M24 16L11 22l13 6 13-6z" fill="#fff" />
      <path d="M17 26v5c0 2 14 2 14 0v-5l-7 3z" fill="#fce4ec" />
      <path d="M37 22v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  // 📏 Grand ou petit
  size: (
    <>
      <circle cx="16" cy="32" r="10" fill="#ffca28" stroke="#f9a825" strokeWidth="2" />
      <circle cx="35" cy="25" r="17" fill="#4fc3f7" stroke="#0288d1" strokeWidth="2" />
      <circle cx="30" cy="20" r="4" fill="#b3e5fc" opacity="0.7" />
    </>
  ),
  // 🌑 Les ombres
  shadow: (
    <>
      <ellipse cx="19" cy="36" rx="14" ry="5" fill="#607d8b" opacity="0.55" />
      <circle cx="27" cy="20" r="13" fill="#ffd54f" />
      <circle cx="22" cy="18" r="2.2" fill="#3e2723" />
      <circle cx="31" cy="18" r="2.2" fill="#3e2723" />
      <path d="M24 22l5 0-2.5 3z" fill="#ff8f00" />
    </>
  ),
  // 🐔 entête ferme (tête de poule)
  henhead: (
    <>
      <circle cx="24" cy="26" r="14" fill="#fff" />
      <path d="M18 12c0-4 5-4 5 0 1-4 5-3 4 1 3-1 4 3 0 4z" fill="#e53935" />
      <circle cx="20" cy="24" r="2.2" fill="#3e2723" />
      <circle cx="30" cy="24" r="2.2" fill="#3e2723" />
      <path d="M22 29l4 0-2 4z" fill="#ff8f00" />
      <path d="M14 34c-2 1-2 4 1 4M34 34c2 1 2 4-1 4" fill="#e53935" />
    </>
  ),
}

export default function AppIcon({ name, size = 24, className = '', style }) {
  const content = ICONS[name]
  if (!content) return null
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`app-icon ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  )
}
