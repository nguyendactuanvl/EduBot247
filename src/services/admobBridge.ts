/**
 * AdMob Javascript Bridge for EduBot 247 (TWA / PWA / Android Native Wrapper)
 * Supports Banner, Interstitial, and Rewarded Ads with fallbacks for Browser Preview
 */

export interface AdMobCallbackOptions {
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: string) => void;
  onAdOpened?: () => void;
  onAdClosed?: () => void;
  onUserEarnedReward?: (rewardType: string, rewardAmount: number) => void;
}

declare global {
  interface Window {
    AndroidAdMob?: {
      showBanner: () => void;
      hideBanner: () => void;
      loadInterstitial: (unitId: string) => void;
      showInterstitial: () => void;
      loadRewarded: (unitId: string) => void;
      showRewarded: () => void;
      isNativeApp: () => boolean;
    };
    onAdMobEvent?: (eventType: string, data?: string) => void;
  }
}

class AdMobBridgeService {
  private rewardCallbacks: Map<string, AdMobCallbackOptions> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      window.onAdMobEvent = (eventType: string, data?: string) => {
        this.handleNativeAdEvent(eventType, data);
      };
    }
  }

  public isNativeAndroidApp(): boolean {
    return typeof window !== 'undefined' && Boolean(window.AndroidAdMob?.isNativeApp?.());
  }

  public showBannerAd(): void {
    if (this.isNativeAndroidApp()) {
      window.AndroidAdMob?.showBanner();
    } else {
      console.log('[AdMob Web Bridge] Displaying banner ad (Web fallback)');
    }
  }

  public hideBannerAd(): void {
    if (this.isNativeAndroidApp()) {
      window.AndroidAdMob?.hideBanner();
    } else {
      console.log('[AdMob Web Bridge] Hiding banner ad (Web fallback)');
    }
  }

  public showInterstitialAd(unitId: string, callbacks?: AdMobCallbackOptions): void {
    if (callbacks) {
      this.rewardCallbacks.set('interstitial', callbacks);
    }

    if (this.isNativeAndroidApp()) {
      window.AndroidAdMob?.loadInterstitial(unitId);
      window.AndroidAdMob?.showInterstitial();
    } else {
      callbacks?.onAdOpened?.();
      setTimeout(() => {
        callbacks?.onAdClosed?.();
      }, 1500);
    }
  }

  public showRewardedAd(
    unitId: string,
    callbacks?: AdMobCallbackOptions,
    rewardType = 'XP',
    rewardAmount = 50
  ): void {
    if (callbacks) {
      this.rewardCallbacks.set('rewarded', callbacks);
    }

    if (this.isNativeAndroidApp()) {
      window.AndroidAdMob?.loadRewarded(unitId);
      window.AndroidAdMob?.showRewarded();
    } else {
      callbacks?.onAdOpened?.();
      setTimeout(() => {
        callbacks?.onUserEarnedReward?.(rewardType, rewardAmount);
        callbacks?.onAdClosed?.();
      }, 2000);
    }
  }

  private handleNativeAdEvent(eventType: string, data?: string): void {
    const interstitialCb = this.rewardCallbacks.get('interstitial');
    const rewardedCb = this.rewardCallbacks.get('rewarded');

    switch (eventType) {
      case 'INTERSTITIAL_LOADED':
        interstitialCb?.onAdLoaded?.();
        break;
      case 'INTERSTITIAL_FAILED':
        interstitialCb?.onAdFailedToLoad?.(data || 'Failed to load interstitial ad');
        break;
      case 'INTERSTITIAL_CLOSED':
        interstitialCb?.onAdClosed?.();
        break;

      case 'REWARDED_LOADED':
        rewardedCb?.onAdLoaded?.();
        break;
      case 'REWARDED_FAILED':
        rewardedCb?.onAdFailedToLoad?.(data || 'Failed to load rewarded ad');
        break;
      case 'REWARDED_EARNED':
        rewardedCb?.onUserEarnedReward?.('XP', 100);
        break;
      case 'REWARDED_CLOSED':
        rewardedCb?.onAdClosed?.();
        break;
    }
  }
}

export const admobBridge = new AdMobBridgeService();
