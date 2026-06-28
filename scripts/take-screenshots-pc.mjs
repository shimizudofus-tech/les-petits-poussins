import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 5199
const BASE = `http://localhost:${PORT}`
const OUT = 'store-assets'
const W = 960, H = 540, DPR = 2

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars'],
})

const sleep = ms => new Promise(r => setTimeout(r, ms))
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR })

console.log(`PC screenshots ${W * DPR}×${H * DPR}px (16:9)`)

const goTo = async (screen, extra) => {
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1500)
  await page.evaluate((s, ex) => {
    const key = Object.keys(localStorage).find(k => k.startsWith('les-petits-poussins'))
    if (key) {
      const state = JSON.parse(localStorage.getItem(key))
      if (s) state.currentScreen = s
      state.lastDailyGift = new Date().toISOString().slice(0, 10)
      state.tutorialDone = true
      if (ex) Object.assign(state, ex)
      localStorage.setItem(key, JSON.stringify(state))
    }
  }, screen, extra || {})
  await page.reload({ waitUntil: 'networkidle0' })
  await sleep(2000)
}

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/pc-${name}.png`, type: 'png' })
  console.log(`  ✓ pc-${name}.png`)
}

// 1. Accueil
await goTo('tamagotchi')
await shot('01-accueil')

// 2. Choix du niveau
await goTo('level-select')
await shot('02-niveaux')

// 3. Puzzle
await goTo('maternelle-section', { maternelleSection: 'petite', currentSubject: { petite: 'puzzle' } })
await shot('03-puzzle')

// 4. Lettres
await goTo('maternelle-section', { maternelleSection: 'grande', currentSubject: { grande: 'letters' } })
await shot('04-lettres')

// 5. Mini-jeux
await goTo('minigames')
await shot('05-minijeux')

// 6. Tracé
await goTo('tracing')
await shot('06-trace')

// 7. Espace parent
await goTo('parent')
await shot('07-parent')

await browser.close()
console.log('Done!')
