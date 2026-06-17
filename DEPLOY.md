# Mettre « Les Petits Poussins » en ligne (installable iPhone + Android)

L'app est une **PWA** : une fois en ligne (HTTPS), elle s'installe sur l'écran
d'accueil comme une vraie appli, plein écran, **sans store, gratuitement, sur
Android ET iPhone**. Pas besoin d'APK ni de compte Apple.

---

## 1. Construire l'app

```bash
cd petits-poussins
npm install
npm run build
```

Le site prêt à héberger est dans **`petits-poussins/dist/`**.

---

## 2. Mettre en ligne — choisis UNE option

### Option A — Netlify Drop (le plus rapide, sans compte ni Git)
1. Va sur **https://app.netlify.com/drop**
2. Glisse-dépose le dossier **`petits-poussins/dist`**
3. Tu obtiens aussitôt une URL en `https://…netlify.app` → c'est le lien à partager.

### Option B — Netlify ou Vercel connecté au dépôt Git (déploiement auto à chaque push)
- **Netlify** : « Add new site → Import from Git ». Le fichier `netlify.toml`
  (à la racine du dépôt) configure déjà tout (dossier `petits-poussins`,
  `npm run build`, dossier publié `dist`).
- **Vercel** : « New Project → Import ». Mets **Root Directory = `petits-poussins`**,
  framework **Vite** (détecté), build `npm run build`, output `dist`.

### Option C — GitHub Pages (gratuit, intégré au dépôt)
1. Pousse le code sur GitHub.
2. **Settings → Pages → Source = GitHub Actions**.
3. Le workflow `.github/workflows/deploy.yml` (déjà inclus) build et publie
   automatiquement sur `https://<utilisateur>.github.io/<repo>/`.
   (Il règle tout seul le chemin de base `/<repo>/`.)

> Les 3 options servent l'app en **HTTPS** — indispensable pour l'installation PWA.

---

## 3. Installer sur le téléphone

**Android (Chrome)** : ouvre l'URL → menu ⋮ → **« Installer l'application »**
(ou « Ajouter à l'écran d'accueil »).

**iPhone / iPad (Safari obligatoire)** : ouvre l'URL → bouton **Partager** →
**« Sur l'écran d'accueil »**. L'icône apparaît, l'app s'ouvre en plein écran.

L'app fonctionne **hors-ligne** après la 1ʳᵉ ouverture (service worker), et la
progression est sauvegardée sur l'appareil.

---

## 4. (Optionnel) Générer un vrai APK Android depuis la PWA en ligne

Une fois l'app en ligne (étape 2), va sur **https://www.pwabuilder.com**, colle
ton URL → il génère un **`.apk` signé** téléchargeable (et les paquets Play
Store / Microsoft Store). Aucun Android Studio requis.

## iOS « fichier installable »
Apple n'autorise pas l'installation d'un fichier téléchargé (pas d'équivalent
APK). Pour une appli native iOS il faut un **Mac + Xcode + compte Apple
Développeur (99 $/an)** et passer par l'**App Store / TestFlight**. La voie PWA
ci-dessus (Ajouter à l'écran d'accueil) reste la solution gratuite et immédiate.
