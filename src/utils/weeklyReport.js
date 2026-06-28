// Agrège le journal d'activité sur les 7 derniers jours pour l'espace parent.

const DAY_LABELS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']

export function getWeeklyReport(activityLog = {}) {
  const days = []
  let totalSuccess = 0
  let totalAttempts = 0
  let activeDays = 0
  let maxSuccess = 0

  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000)
    const key = date.toISOString().slice(0, 10)
    const entry = activityLog[key] ?? { success: 0, attempts: 0 }
    totalSuccess += entry.success
    totalAttempts += entry.attempts
    if (entry.attempts > 0) activeDays += 1
    if (entry.success > maxSuccess) maxSuccess = entry.success
    days.push({ key, label: DAY_LABELS[date.getDay()], success: entry.success, attempts: entry.attempts })
  }

  const accuracy = totalAttempts > 0 ? Math.round((totalSuccess / totalAttempts) * 100) : 0
  return { days, totalSuccess, totalAttempts, accuracy, activeDays, maxSuccess }
}
