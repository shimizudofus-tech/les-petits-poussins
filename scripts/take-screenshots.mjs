import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 5199
const BASE = `http://localhost:${PORT}`
const OUT = 'store-assets'
const W = 375, H = 812
const DPR = 3

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [`--window-size=${W},${H}`, '--hide-scrollbars'],
})

const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR })

const sleep = ms => new Promise(r => setTimeout(r, ms))

const shot = async (name) => {
  await sleep(1000)
  await page.screenshot({ path: `${OUT}/${name}.png`, type: 'png' })
  console.log(`  ✓ ${name}.png (${W * DPR}×${H * DPR})`)
}

const click = async (text) => {
  await page.evaluate((t) => {
    const el = [...document.querySelectorAll('button, [role=button]')]
      .find(b => b.textContent.includes(t))
    if (el) el.click()
  }, text)
  await sleep(500)
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

console.log(`Taking screenshots at ${W}×${H} @${DPR}x → ${W * DPR}×${H * DPR}px`)

// Load + native mode + dismiss modals
await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.documentElement.classList.add('native'))
await sleep(3000)
await dismissModals()
await sleep(500)

// 1. Accueil ferme
await shot('01-accueil-ferme')

// 2. Choix du niveau
await click('Jouer & Apprendre')
await sleep(300)
await shot('02-choix-niveau')

// 3. Petite Section → Puzzle
await click('Petite Section')
await sleep(500)
await click('Puzzle')
await sleep(1000)
await shot('03-puzzle-maternelle')

// 4. Retour → Grande Section (lettres — plus parlant que coloriage x2)
await click('Retour')
await sleep(300)
await click('Grande Section')
await sleep(800)
await page.evaluate(() => {
  const tab = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Lettres'))
  if (tab) tab.click()
})
await sleep(800)
await shot('04-grande-section-lettres')

// 5. Retour → level select → Mini-jeux
await click('Retour')
await sleep(500)
// Might be on level-select or maternelle-section — click Retour again if needed
const onLevelSelect = await page.evaluate(() =>
  !!document.querySelector('.screen-level-select'))
if (!onLevelSelect) {
  await click('Retour')
  await sleep(500)
}
await click('Mini-jeux')
await sleep(700)
await shot('05-mini-jeux')

// 6. Go to J'écris (mini-jeux Retour goes to home, so re-navigate)
await click('Retour')
await sleep(500)
// If on home, go through Jouer & Apprendre first
const needsNav = await page.evaluate(() =>
  !document.querySelector('.screen-level-select'))
if (needsNav) {
  await click('Jouer & Apprendre')
  await sleep(500)
}
await click("J'écris")
await sleep(800)
await shot('06-trace-lettres')

// 7. Back to home → Espace parent
await click('Retour')
await sleep(500)
// If on level-select, go home
const needsHome = await page.evaluate(() =>
  !!document.querySelector('.screen-level-select'))
if (needsHome) {
  await click('Retour à la ferme')
  await sleep(500)
}
await sleep(300)
await page.evaluate(() => {
  const g = [...document.querySelectorAll('button')].find(b => b.textContent.includes('⚙'))
  if (g) g.click()
})
await sleep(800)
await shot('07-espace-parent')

await browser.close()
console.log('Done! Screenshots in', OUT + '/')
