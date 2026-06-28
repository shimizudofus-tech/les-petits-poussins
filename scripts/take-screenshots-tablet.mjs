import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 5199
const BASE = `http://localhost:${PORT}`
const OUT = 'store-assets'

const TABLETS = [
  { name: '7inch', w: 600, h: 1024, dpr: 2 },
  { name: '10inch', w: 800, h: 1280, dpr: 2 },
]

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars'],
})

const sleep = ms => new Promise(r => setTimeout(r, ms))

for (const tab of TABLETS) {
  const px = `${tab.w * tab.dpr}×${tab.h * tab.dpr}`
  console.log(`\n=== ${tab.name} (${px}) ===`)

  const page = await browser.newPage()
  await page.setViewport({ width: tab.w, height: tab.h, deviceScaleFactor: tab.dpr })

  const shot = async (name) => {
    await sleep(1200)
    await page.screenshot({ path: `${OUT}/${tab.name}-${name}.png`, type: 'png' })
    console.log(`  ✓ ${tab.name}-${name}.png`)
  }

  const dismissModals = async () => {
    for (let i = 0; i < 8; i++) {
      const dismissed = await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b =>
          /Merci|Passer|Commencer|OK|Compris|Suivant/.test(b.textContent))
        if (btn) { btn.click(); return true }
        return false
      })
      if (dismissed) await sleep(700)
      else break
    }
  }

  // Each screenshot = fresh page load → navigate directly via game state
  const goToScreen = async (screen, extra) => {
    await page.goto(BASE, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.documentElement.classList.add('native'))
    await sleep(2000)
    await dismissModals()
    await sleep(300)
    if (screen) {
      await page.evaluate((s) => {
        const ctx = document.querySelector('[data-game-ctx]')
        if (!ctx) {
          const ev = new CustomEvent('__nav__', { detail: s })
          window.dispatchEvent(ev)
        }
      }, screen)
      // Direct state manipulation via React internals
      await page.evaluate((s, ex) => {
        const key = Object.keys(localStorage).find(k => k.startsWith('les-petits-poussins'))
        if (key) {
          const state = JSON.parse(localStorage.getItem(key))
          state.currentScreen = s
          state.lastDailyGift = new Date().toISOString().slice(0, 10)
          if (ex) Object.assign(state, ex)
          localStorage.setItem(key, JSON.stringify(state))
        }
      }, screen, extra || {})
      await page.reload({ waitUntil: 'networkidle0' })
      await page.evaluate(() => document.documentElement.classList.add('native'))
      await sleep(2000)
      await dismissModals()
      await sleep(500)
    }
  }

  // 1. Accueil — suppress daily gift first
  await goToScreen(null)
  await page.evaluate(() => {
    const key = Object.keys(localStorage).find(k => k.startsWith('les-petits-poussins'))
    if (key) {
      const state = JSON.parse(localStorage.getItem(key))
      state.lastDailyGift = new Date().toISOString().slice(0, 10)
      state.currentScreen = 'tamagotchi'
      localStorage.setItem(key, JSON.stringify(state))
    }
  })
  await page.reload({ waitUntil: 'networkidle0' })
  await page.evaluate(() => document.documentElement.classList.add('native'))
  await sleep(2000)
  await shot('01-accueil')

  // 2. Choix du niveau
  await goToScreen('level-select')
  await shot('02-niveaux')

  // 3. Petite Section → Puzzle tab
  await goToScreen('maternelle-section', { maternelleSection: 'petite', currentSubject: { petite: 'puzzle' } })
  await shot('03-puzzle')

  // 4. Grande Section → Lettres
  await goToScreen('maternelle-section', { maternelleSection: 'grande', currentSubject: { grande: 'letters' } })
  await shot('04-lettres')

  // 5. Mini-jeux
  await goToScreen('minigames')
  await shot('05-minijeux')

  // 6. Tracé
  await goToScreen('tracing')
  await shot('06-trace')

  // 7. Espace parent
  await goToScreen('parent')
  await shot('07-parent')

  await page.close()
}

await browser.close()
console.log('\nDone!')
