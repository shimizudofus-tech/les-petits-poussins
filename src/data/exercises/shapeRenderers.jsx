export const SHAPE_RENDERERS = {
  circle: () => (
    <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
  ),
  square: () => (
    <rect x="4" y="4" width="44" height="44" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
  ),
  triangle: () => (
    <polygon points="26,4 50,50 2,50" fill="none" stroke="currentColor" strokeWidth="3" />
  ),
  rectangle: () => (
    <rect x="2" y="12" width="48" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
  ),
  star: () => (
    <polygon
      points="26,3 32,20 50,20 36,31 41,48 26,38 11,48 16,31 2,20 20,20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    />
  ),
  diamond: () => (
    <polygon points="26,4 48,26 26,48 4,26" fill="none" stroke="currentColor" strokeWidth="3" />
  ),
  oval: () => (
    <ellipse cx="26" cy="26" rx="22" ry="14" fill="none" stroke="currentColor" strokeWidth="3" />
  ),
  heart: () => (
    <path
      d="M26 42 C26 42 6 28 6 16 C6 8 14 4 20 8 C22 10 24 12 26 16 C28 12 30 10 32 8 C38 4 46 8 46 16 C46 28 26 42 26 42 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  ),
}
