function getVoixUrl(filename) {
  return new URL(`../assets/audio/voix/${filename}`, import.meta.url).href
}

function playFile(filename) {
  const path = getVoixUrl(filename)

  try {
    const audio = new Audio(path)

    audio.addEventListener('error', () => {
      console.log('Audio non trouvé :', path)
    })

    audio.play().catch(() => {
      console.log('Audio non trouvé :', path)
    })
  } catch {
    console.log('Audio non trouvé :', path)
  }
}

export function playSuccess() {
  playFile('bravo.mp3')
}

export function playError() {
  playFile('oups.mp3')
}

export function playWord(word) {
  const normalized = String(word).toLowerCase().trim()
  playFile(`${normalized}.mp3`)
}
