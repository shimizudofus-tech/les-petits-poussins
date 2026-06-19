# Build Android (Capacitor)

App native Android empaquetée avec **Capacitor**. Le jeu web (`dist/`) est
embarqué et chargé hors-ligne. `appId` = `com.lespetitspoussins.app`.

## Prérequis (sur ta machine)
- Android Studio (SDK + JDK 17).

## Construire / lancer
```bash
cd petits-poussins
npm install
npm run build          # génère dist/ (base racine)
npx cap sync android   # copie dist/ + plugins dans le projet android
npx cap open android   # ouvre Android Studio
```
Dans Android Studio : Run ▶ pour tester, ou Build → Generate Signed Bundle/APK
pour un **.aab** (Play Store) / **.apk**.

> À chaque changement du jeu : `npm run build && npx cap sync android`.

## Abonnement 1,99 €/mois (à brancher)
Le gating est déjà dans l'app (drapeau `premium`, paywall, `subscribe()` stub
dans `src/context/GameContext.jsx`). Pour activer le paiement réel :

1. **Google Play Console** (compte dev 25 $) → créer l'app + un produit
   **abonnement** mensuel à 1,99 €.
2. Choisir une lib de billing :
   - **RevenueCat** (`@revenuecat/purchases-capacitor`) — le plus simple, multi-stores.
   - ou **Google Play Billing** via un plugin Capacitor.
3. Dans `subscribe()` : lancer l'achat ; à la confirmation → `setPremium(true)`.
   Au démarrage : vérifier l'abonnement actif et appeler `setPremium(true/false)`.
4. Retirer le bouton « Premium TEST » de l'espace Parent avant publication.

## Publication
- Politique de confidentialité (requise), fiche store, captures, classification
  PEGI/contenu enfants (Play « Familles »).
- Uploader le `.aab` signé, remplir l'abonnement, soumettre à validation Google.
