# Les Petits Poussins 🐣

Jeu éducatif mobile (ratio 9:16) — ferme Tamagotchi évolutive, mini-jeux Maternelle/CP, améliorations et Collection d’animaux.

Refactorisation React + Vite + Tailwind CSS du prototype Vanilla JS.

## Base stable V1

Checkpoint fonctionnel validé — socle prêt pour l’ajout massif de contenu pédagogique.

- **Ferme évolutive FarmScene V2** — scène chibi en SVG (ciel, nuages, herbe, grange, clôture, nid, jardin, décorations)
- **Améliorer la ferme** — écran dédié, plafond niveau 3, coûts en étoiles
- **Collection** — album d’animaux débloqués, badges stade / adulte
- **Explorer la ferme** — mode large interactif, bulles de dialogue
- **Cycle animal** — œuf → bébé → adulte → `completed`
- **Choix animal via Collection** — bouton « Choisir », animal actif sauvegardé
- **Reset progression robuste** — Mode Parent, confirmation, état initial immédiat
- **Moteur d’exercices data-driven** — `src/data/exercises/`, ajout de contenu sans recoder les mini-jeux
- **Mode Parent / Debug** — stats contenu, audio, imageKey, reset local
- **PWA + icônes** — `vite-plugin-pwa`, `npm run icons` depuis `public/pwa-icon.svg`
- **Assets SVG propres** — ferme (`src/assets/images/farm/`), builder, animaux

Le legacy Builder (`farmLayout`, `ScreenBuilder`) est conservé pour compatibilité ; non exposé dans la navigation principale.

## Pack Contenu 1

Premier lot de contenu pédagogique data-driven (sans fichiers MP3 pour l’instant).

| Matière | Fichier | Quantité |
|---------|---------|----------|
| Dictée CP | `cp/dictee.js` | **24** mots |
| Lecture CP | `cp/lecture.js` | **12** phrases |
| Maths CP | `cp/maths.js` | **32** exercices (12 additions, 10 soustractions, 10 comparaisons) |
| Couleurs Maternelle | `maternelle/colors.js` | **9** couleurs |
| Formes Maternelle | `maternelle/shapes.js` | **6** formes (cercle, carré, triangle, rectangle, étoile, cœur) |
| Compter Maternelle | `maternelle/counting.js` | **25** exercices (1 à 5 × 5 visuels) |

Les `audioKey` sont prêts pour les MP3 futurs dans `src/assets/audio/voix/`. Exemples :

- `word: "bébé"` → `audioKey: "bebe"` → `bebe.mp3`
- `word: "vélo"` → `audioKey: "velo"` → `velo.mp3`
- `word: "école"` → `audioKey: "ecole"` → `ecole.mp3`
- `word: "œuf"` → `audioKey: "oeuf"` → `oeuf.mp3`

Si un MP3 est absent, le jeu continue sans crash (le bouton Écouter reste silencieux).

Les compteurs du Mode Parent se mettent à jour automatiquement via `getExerciseContentStats()`.

## Puzzles procéduraux

Les puzzles Maternelle (Petite, Moyenne, Grande Section) utilisent un **catalogue procédural** (`src/data/puzzles/puzzleCatalog.js`) :

- **30 scènes uniques** générées en SVG à la volée (`src/utils/puzzleSceneGenerator.js`)
- **12 animaux** : poussin, poule, vache, cochon, mouton, chien, chat, lapin, canard, cheval, grenouille, poisson
- **Aucune image externe** — tout est dessiné dans le projet (style chibi / ferme, 280×180)
- Licence : **Original / projet Les Petits Poussins**
- Les 3 anciens puzzles SVG (`puzzle-poussin`, `puzzle-fleur`, `puzzle-maison`) restent disponibles en mode `image` direct

### Imports futurs (CC0 / Public Domain)

Quand des images externes seront ajoutées, elles devront :

- être **CC0** ou **Public Domain**
- avoir leur **source** enregistrée (`sourceName`, `sourceUrl`, `license`) dans le catalogue
- être placées dans `public/puzzles/imported/` (dossier prévu, pas encore utilisé en V1)

## Prérequis

- [Node.js](https://nodejs.org/) 18+

## Commandes

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement (http://localhost:5173)
npm run dev

# Build de production (dossier dist/)
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint

# Générer les icônes PWA (PNG depuis public/pwa-icon.svg)
npm run icons
```

## Générer les icônes PWA

L’icône source est `public/pwa-icon.svg` (poussin chibi, ciel bleu, herbe verte).

Après modification du SVG, régénérez les PNG :

```bash
npm run icons
```

Fichiers produits dans `public/` :

- `pwa-192x192.png` — manifest PWA
- `pwa-512x512.png` — manifest PWA (haute résolution)
- `apple-touch-icon.png` — ajout à l’écran d’accueil iOS (180×180)

Puis reconstruisez si besoin : `npm run build`.

## Sauvegarde locale

La progression est persistée automatiquement dans le `localStorage` du navigateur (clé : `les-petits-poussins-game-state`). Étoiles, animaux, améliorations de ferme (`farmUpgrades`), faim, etc. sont restaurés au rechargement de la page.

## Structure du projet

```
petits-poussins/
├── public/                  # Fichiers statiques (favicon, icônes PWA…)
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── animaux/     # Sprites des animaux
│   │   │   ├── builder/     # Objets du builder (legacy)
│   │   │   ├── farm/        # Assets FarmScene V2 (grange, clôture, nid…)
│   │   │   └── exercises/   # Images optionnelles des exercices (futur)
│   │   └── audio/
│   │       └── voix/        # Fichiers MP3 enregistrés (dictée, lecture…)
│   ├── components/
│   │   ├── minigames/       # Composants d'exercices (lisent les données)
│   │   └── screens/         # Écrans principaux
│   ├── context/
│   │   └── GameContext.jsx  # État global + logique métier
│   ├── data/
│   │   ├── exercises/       # ★ Contenu pédagogique data-driven
│   │   │   ├── index.js
│   │   │   ├── maternelle/  # colors, shapes, counting
│   │   │   └── cp/          # maths, dictee, lecture
│   │   ├── farmUpgrades.js
│   │   ├── farmAssets.js    # Mapping niveaux → SVG ferme
│   │   ├── canvasDrawings.js
│   │   └── initialGameState.js
│   ├── utils/
│   │   ├── audioManager.js
│   │   ├── exerciseImage.js
│   │   └── persistence.js
│   └── …
├── index.html
├── package.json
└── vite.config.js
```

## Contenu pédagogique (data-driven)

Tous les exercices sont définis dans `src/data/exercises/`. Les mini-jeux piochent aléatoirement dans ces fichiers — **aucun recodage du jeu** n'est nécessaire pour ajouter du contenu.

| Niveau | Fichier | Matière |
|--------|---------|---------|
| CP | `cp/dictee.js` | Dictée |
| CP | `cp/lecture.js` | Lecture |
| CP | `cp/maths.js` | Maths |
| Maternelle | `maternelle/colors.js` | Couleurs |
| Maternelle | `maternelle/shapes.js` | Formes |
| Maternelle | `maternelle/counting.js` | Compter |

Index central : `src/data/exercises/index.js` (`exercisesByLevel`, `pickRandomExercise`).

### Comment ajouter un mot de dictée ?

1. Ouvrir `src/data/exercises/cp/dictee.js`
2. Ajouter une entrée dans le tableau `cpDicteeExercises` :

```js
{
  id: 'cp-dictee-ferme',
  level: 'cp',
  subject: 'dictee',
  word: 'ferme',
  displayWord: 'FERME',
  audioKey: 'ferme',
  imageKey: 'ferme',
  difficulty: 1,
},
```

3. (Optionnel) Ajouter le MP3 dans `src/assets/audio/voix/`
4. Le nom du fichier doit correspondre à `audioKey` :

| audioKey | Fichier attendu |
|----------|-----------------|
| `"chat"` | `src/assets/audio/voix/chat.mp3` |
| `"ferme"` | `src/assets/audio/voix/ferme.mp3` |

5. Relancer `npm run dev` — le nouveau mot apparaît automatiquement dans la dictée CP.

Si le MP3 est absent, le jeu continue normalement (un `console.log` discret est émis, pas d'erreur bloquante).

### Comment ajouter une phrase de lecture ?

Même principe dans `src/data/exercises/cp/lecture.js` :

```js
{
  id: 'cp-lecture-lune',
  level: 'cp',
  subject: 'lecture',
  sentence: 'La ___ brille dans le ciel.',
  answer: 'lune',
  choices: ['lune', 'maison', 'chat'],
  audioKey: 'lune',
  imageKey: 'lune',
  difficulty: 1,
},
```

Utilisez `___` (trois underscores) pour l'emplacement du mot manquant.

### Comment ajouter des exercices de maths ?

Dans `src/data/exercises/cp/maths.js`, types possibles : `addition`, `subtraction`, `comparison`.

### Images optionnelles (`imageKey`)

Si une image PNG existe plus tard dans `src/assets/images/exercises/`, elle pourra être branchée via `imageKey`. En attendant, un emoji ou le texte du mot s'affiche automatiquement (`ExerciseImageDisplay`).

## Prototype d'origine

Le prototype Vanilla (`index.html`, `style.css`, `app.js`) reste disponible à la racine du dossier parent `Les petis poussins/`.
