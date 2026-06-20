/* Génère public/voix.html : liste toutes les voix, lecture une par une +
   bouton "Tout écouter" (séquentiel). Lance : node scripts/build-voix-page.mjs */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const VOIX = path.join(ROOT, 'public/audio/voix')

// texte parlé (depuis la map) pour affichage
const mapSrc = fs.readFileSync(path.join(ROOT, 'src/data/audioSpeechMap.js'), 'utf8')
const text = {}
for (const line of mapSrc.split('\n')) {
  const m = line.match(/^\s*([a-z0-9_]+):\s*(['"])(.*?)\2,?\s*$/)
  if (m) text[m[1]] = m[3]
}

const files = fs.readdirSync(VOIX).filter((f) => f.endsWith('.mp3')).map((f) => f.replace('.mp3', ''))
const letters = []
const numbers = []
const rest = []
for (const k of files) {
  if (/^lettre_[a-z]$/.test(k)) letters.push(k)
  else if (/^\d+$/.test(k)) numbers.push(k)
  else rest.push(k)
}
letters.sort()
numbers.sort((a, b) => Number(a) - Number(b))
rest.sort()
const ordered = [...letters, ...numbers, ...rest]

const rows = ordered.map((k, i) => `
  <div class="row" data-i="${i}">
    <code>${k}</code>
    <span class="txt">${text[k] ?? ''}</span>
    <audio preload="none" src="audio/voix/${k}.mp3?v=7"></audio>
    <button onclick="playOne(${i})">▶</button>
  </div>`).join('')

const html = `<!doctype html><html lang="fr"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voix — test</title>
<style>
body{font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:16px;background:#fafafa}
h1{font-size:1.2rem}
.bar{position:sticky;top:0;background:#fafafa;padding:8px 0;border-bottom:1px solid #ddd}
button{cursor:pointer;border:1px solid #c8902a;background:#ffd23b;border-radius:8px;padding:4px 10px;font-weight:700}
.row{display:flex;align-items:center;gap:10px;padding:6px 4px;border-bottom:1px solid #eee}
.row.playing{background:#fff3c4}
code{min-width:170px;font-size:.8rem;color:#a15}
.txt{flex:1;font-size:.85rem;color:#333}
</style>
<h1>🔊 Voix (${ordered.length}) — lettres, chiffres, puis mots/consignes</h1>
<div class="bar"><button onclick="playAll()">▶ Tout écouter dans l'ordre</button> <button onclick="stopAll()">⏹ Stop</button></div>
${rows}
<script>
const rows=[...document.querySelectorAll('.row')]
const audios=rows.map(r=>r.querySelector('audio'))
let seq=false, cur=-1
function clear(){rows.forEach(r=>r.classList.remove('playing'));audios.forEach(a=>{a.pause();a.currentTime=0})}
function playOne(i){seq=false;clear();cur=i;rows[i].classList.add('playing');rows[i].scrollIntoView({block:'center'});audios[i].play()}
function playAll(){seq=true;cur=-1;next()}
function next(){if(!seq)return;cur++;if(cur>=audios.length){seq=false;clear();return}clear();rows[cur].classList.add('playing');rows[cur].scrollIntoView({block:'center'});audios[cur].play()}
function stopAll(){seq=false;clear()}
audios.forEach(a=>a.addEventListener('ended',()=>{if(seq)setTimeout(next,350)}))
</script>
</html>`

fs.writeFileSync(path.join(ROOT, 'public/voix.html'), html)
console.log('public/voix.html écrit —', ordered.length, 'voix')
