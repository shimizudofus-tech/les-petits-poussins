import { Capacitor } from '@capacitor/core'

// Retour haptique (vibration) — actif uniquement sur l'app native Android.
// Sur web/PWA : no-op silencieux.
let Haptics = null
let ImpactStyle = null
let NotificationType = null
let ready = false

if (Capacitor.isNativePlatform()) {
  import('@capacitor/haptics')
    .then((mod) => {
      Haptics = mod.Haptics
      ImpactStyle = mod.ImpactStyle
      NotificationType = mod.NotificationType
      ready = true
    })
    .catch(() => {})
}

export function hapticTap() {
  if (ready && Haptics) Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}

export function hapticSuccess() {
  if (ready && Haptics) Haptics.notification({ type: NotificationType.Success }).catch(() => {})
}

export function hapticError() {
  if (ready && Haptics) Haptics.notification({ type: NotificationType.Warning }).catch(() => {})
}
