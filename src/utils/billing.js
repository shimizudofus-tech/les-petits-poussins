import { Capacitor } from '@capacitor/core'

let Purchases = null
let isConfigured = false

const REVENUECAT_API_KEY = '__REVENUECAT_GOOGLE_API_KEY__'
const ENTITLEMENT_ID = 'premium'

export async function initBilling() {
  if (!Capacitor.isNativePlatform()) return
  if (REVENUECAT_API_KEY.startsWith('__')) return

  try {
    const mod = await import('@revenuecat/purchases-capacitor')
    Purchases = mod.Purchases
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY })
    isConfigured = true
  } catch {
    // Plugin not available (web, or native build issue)
  }
}

export async function checkPremium() {
  if (!isConfigured) return false
  try {
    const { customerInfo } = await Purchases.getCustomerInfo()
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
  } catch {
    return false
  }
}

export async function getOfferings() {
  if (!isConfigured) return null
  try {
    const { offerings } = await Purchases.getOfferings()
    return offerings.current
  } catch {
    return null
  }
}

export async function purchasePackage(pkg) {
  if (!isConfigured) throw new Error('Billing not configured')
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
}

export async function restorePurchases() {
  if (!isConfigured) return false
  try {
    const { customerInfo } = await Purchases.restorePurchases()
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
  } catch {
    return false
  }
}

export function isBillingAvailable() {
  return isConfigured
}
