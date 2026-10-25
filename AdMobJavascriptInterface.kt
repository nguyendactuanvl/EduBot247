package app.vercel.edubot247.twa

import android.app.Activity
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

/**
 * AdMob Javascript Interface Bridge cho EduBot 247
 * Kết nối giữa Web React Frontend (Vercel) và Native Google AdMob SDK trong Android App
 */
class AdMobJavascriptInterface(private val activity: Activity, private val webView: WebView) {

    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null

    companion object {
        private const val TAG = "AdMobBridge"
    }

    @JavascriptInterface
    fun isNativeApp(): Boolean {
        return true
    }

    /**
     * Tải Quảng cáo Xen kẽ (Interstitial Ad - Ads 4)
     */
    @JavascriptInterface
    fun loadInterstitial(unitId: String) {
        activity.runOnUiThread {
            val adRequest = AdRequest.Builder().build()
            InterstitialAd.load(
                activity,
                unitId,
                adRequest,
                object : InterstitialAdLoadCallback() {
                    override fun onAdLoaded(ad: InterstitialAd) {
                        interstitialAd = ad
                        Log.d(TAG, "Interstitial Ad Loaded successfully")
                        sendJsEvent("INTERSTITIAL_LOADED")
                    }

                    override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                        interstitialAd = null
                        Log.e(TAG, "Interstitial Ad Failed to load: ${loadAdError.message}")
                        sendJsEvent("INTERSTITIAL_FAILED", loadAdError.message)
                    }
                }
            )
        }
    }

    /**
     * Hiển thị Quảng cáo Xen kẽ
     */
    @JavascriptInterface
    fun showInterstitial() {
        activity.runOnUiThread {
            if (interstitialAd != null) {
                interstitialAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        interstitialAd = null
                        sendJsEvent("INTERSTITIAL_CLOSED")
                    }

                    override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                        interstitialAd = null
                        sendJsEvent("INTERSTITIAL_FAILED", adError.message)
                    }
                }
                interstitialAd?.show(activity)
            } else {
                sendJsEvent("INTERSTITIAL_FAILED", "No ad ready to show")
            }
        }
    }

    /**
     * Tải Quảng cáo Tặng thưởng (Rewarded Video Ad - Reward-phần thưởng)
     */
    @JavascriptInterface
    fun loadRewarded(unitId: String) {
        activity.runOnUiThread {
            val adRequest = AdRequest.Builder().build()
            RewardedAd.load(
                activity,
                unitId,
                adRequest,
                object : RewardedAdLoadCallback() {
                    override fun onAdLoaded(ad: RewardedAd) {
                        rewardedAd = ad
                        Log.d(TAG, "Rewarded Ad Loaded successfully")
                        sendJsEvent("REWARDED_LOADED")
                    }

                    override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                        rewardedAd = null
                        Log.e(TAG, "Rewarded Ad Failed to load: ${loadAdError.message}")
                        sendJsEvent("REWARDED_FAILED", loadAdError.message)
                    }
                }
            )
        }
    }

    /**
     * Hiển thị Quảng cáo Tặng thưởng
     */
    @JavascriptInterface
    fun showRewarded() {
        activity.runOnUiThread {
            if (rewardedAd != null) {
                rewardedAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        rewardedAd = null
                        sendJsEvent("REWARDED_CLOSED")
                    }

                    override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                        rewardedAd = null
                        sendJsEvent("REWARDED_FAILED", adError.message)
                    }
                }
                rewardedAd?.show(activity) { rewardItem ->
                    Log.d(TAG, "User earned reward: ${rewardItem.amount} ${rewardItem.type}")
                    sendJsEvent("REWARDED_EARNED", "${rewardItem.amount}:${rewardItem.type}")
                }
            } else {
                sendJsEvent("REWARDED_FAILED", "No rewarded ad ready to show")
            }
        }
    }

    /**
     * Bắn sự kiện ngược lại JavaScript cho React Web App xử lý
     */
    private fun sendJsEvent(eventType: String, data: String = "") {
        activity.runOnUiThread {
            val script = "window.onAdMobEvent && window.onAdMobEvent('$eventType', '$data');"
            webView.evaluateJavascript(script, null)
        }
    }
}
