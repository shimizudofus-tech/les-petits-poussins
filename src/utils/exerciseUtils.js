export function makeOpts(correct, min, max, count) {
  const set = new Set([correct])
  while (set.size < count) {
    const v = min + Math.floor(Math.random() * (max - min))
    set.add(v)
  }
  return [...set].sort(() => Math.random() - 0.5)
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}
