// Événements saisonniers : bannière festive sur l'accueil selon la date réelle.
// Renvoie { id, emoji, greeting, tint } ou null hors période.

export function getSeasonalEvent(date = new Date()) {
  const m = date.getMonth() // 0 = janvier
  const d = date.getDate()

  // Halloween : 24–31 octobre
  if (m === 9 && d >= 24) {
    return { id: 'halloween', emoji: '🎃', greeting: 'Joyeux Halloween !', tint: 'linear-gradient(135deg,#ff8f00,#6a1b9a)' }
  }
  // Noël : 1–26 décembre
  if (m === 11 && d <= 26) {
    return { id: 'noel', emoji: '🎄', greeting: 'Joyeux Noël !', tint: 'linear-gradient(135deg,#e53935,#2e7d32)' }
  }
  // Nouvel an : 27 déc – 6 jan
  if ((m === 11 && d >= 27) || (m === 0 && d <= 6)) {
    return { id: 'nouvelan', emoji: '🎉', greeting: 'Bonne année !', tint: 'linear-gradient(135deg,#ffca28,#7c4dff)' }
  }
  // Pâques : approximation début avril (1–15 avril)
  if (m === 3 && d <= 15) {
    return { id: 'paques', emoji: '🐰', greeting: 'Joyeuses Pâques !', tint: 'linear-gradient(135deg,#f06292,#ffd54f)' }
  }
  // Vacances d'été : juillet–août
  if (m === 6 || m === 7) {
    return { id: 'ete', emoji: '☀️', greeting: 'Bonnes vacances !', tint: 'linear-gradient(135deg,#4fc3f7,#ffd54f)' }
  }
  return null
}
