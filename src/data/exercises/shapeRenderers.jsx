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
}
