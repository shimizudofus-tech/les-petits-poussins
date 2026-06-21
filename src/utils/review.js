// Révision adaptative : exploitation de gameState.reviewStats { [exerciseId]: nbErreurs }.

// Ensemble des exercices encore "à revoir" (au moins 1 erreur non rattrapée).
export function weakIdSet(reviewStats) {
  const r = reviewStats || {}
  return new Set(Object.keys(r).filter((id) => (r[id] || 0) > 0))
}

const LEVEL_LABELS = {
  cp: 'CP', ce1: 'CE1', ce2: 'CE2', cm1: 'CM1', cm2: 'CM2',
  maternelle: 'Maternelle', petite: 'Petite', moyenne: 'Moyenne', grande: 'Grande',
}
const SUBJECT_LABELS = {
  dictee: 'Dictée', lecture: 'Lecture', maths: 'Maths', math: 'Maths',
  colors: 'Couleurs', shapes: 'Formes', counting: 'Compter', letters: 'Lettres', sounds: 'Sons',
}

// Transforme un exerciseId ("ce2-dictee-bateau", "cm1-mul-13-4") en libellé lisible.
export function humanizeExerciseId(id) {
  if (!id) return '?'
  const parts = String(id).split('-')
  const level = LEVEL_LABELS[parts[0]] ?? parts[0]
  const subjectRaw = parts[1] ?? ''
  const subject = SUBJECT_LABELS[subjectRaw] ?? subjectRaw
  const detail = parts.slice(2).join(' ').replace(/_/g, ' ')
  return [level, subject, detail].filter(Boolean).join(' · ')
}

// Top des exercices à retravailler, triés par nb d'erreurs décroissant.
export function topWeakItems(reviewStats, limit = 6) {
  const r = reviewStats || {}
  return Object.entries(r)
    .filter(([, n]) => (n || 0) > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, n]) => ({ id, count: n, label: humanizeExerciseId(id) }))
}
