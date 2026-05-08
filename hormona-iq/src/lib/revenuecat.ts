// RevenueCat client — initialization, entitlement checks, purchase, and restore.
// The 'pro' entitlement gates DRSP insights and PDF export. After a successful
// purchase, the revenuecat-webhook Edge Function updates `users.tier` server-side.

import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

export function initRevenueCat(userId: string): void {
  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  if (!apiKey) return;
  Purchases.setLogLevel(LOG_LEVEL.ERROR);
  Purchases.configure({ apiKey, appUserID: userId });
}

export async function checkProEntitlement(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch {
    return false;
  }
}

export async function purchasePro(): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch {
    // User cancelled or transient error — treat as no purchase.
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch {
    return false;
  }
}
