export function makeOpts(correct, min, max, count) {
  const set = new Set([correct])
  // Inclusive range [min, max]. Cap the number of options to what the range can
  // actually supply so a too-small range can never spin this loop forever.
  const span = Math.max(1, max - min + 1)
  const reachable = correct >= min && correct <= max ? span : span + 1
  const target = Math.min(count, reachable)
  let guard = 0
  while (set.size < target && guard < 200) {
    set.add(min + Math.floor(Math.random() * span))
    guard += 1
  }
  return [...set].sort(() => Math.random() - 0.5)
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}
