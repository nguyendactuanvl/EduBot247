package app.vercel.edubot247.twa

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.androidbrowserhelper.trusted.LauncherActivity

/**
 * SplashActivity - Màn hình chờ mở ứng dụng tích hợp Google AdMob App Open Ad (Ads 2)
 * Mã đơn vị quảng cáo Ads 2: ca-app-pub-5320880447374751/7345879147
 * Tự động chuyển tiếp sang TWA LauncherActivity khi quảng cáo kết thúc hoặc quá thời gian chờ.
 */
class SplashActivity : AppCompatActivity() {

    private var appOpenAd: AppOpenAd? = null
    private var isLoadingAd = false
    private var isNavigatedToMain = false
    private val handler = Handler(Looper.getMainLooper())

    // Timeout fail-safe (tối đa 4 giây chờ quảng cáo)
    private val timeoutRunnable = Runnable {
        Log.d("SplashActivity", "Hết thời gian chờ quảng cáo, mở ứng dụng TWA...")
        navigateToMainActivity()
    }

    companion object {
        private const val TAG = "SplashActivity"
        // Mã đơn vị quảng cáo Ads 2 (App Open Ad) từ Google AdMob Console
        private const val AD_UNIT_ID = "ca-app-pub-5320880447374751/7345879147"
        // Mã test mặc định của Google nếu chưa bật live ad: "ca-app-pub-3940256099942544/9257395921"
        private const val AD_TIMEOUT_MS = 4000L
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Set layout giao diện màn hình chờ (Splash Screen Logo EduBot 247)
        // setContentView(R.layout.activity_splash)

        // 1. Khởi tạo Google Mobile Ads SDK
        MobileAds.initialize(this) { initializationStatus ->
            Log.d(TAG, "Google Mobile Ads SDK initialized: ${initializationStatus.adapterStatusMap}")
        }

        // Hạn định tối đa 4 giây chờ tải quảng cáo để không làm phiền trải nghiệm người dùng
        handler.postDelayed(timeoutRunnable, AD_TIMEOUT_MS)

        // 2. Tải Quảng cáo Mở ứng dụng (Ads 2)
        loadAppOpenAd()
    }

    private fun loadAppOpenAd() {
        if (isLoadingAd || appOpenAd != null) return

        isLoadingAd = true
        val request = AdRequest.Builder().build()

        AppOpenAd.load(
            this,
            AD_UNIT_ID,
            request,
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    Log.d(TAG, "Đã tải thành công Quảng cáo Mở ứng dụng (Ads 2)!")
                    appOpenAd = ad
                    isLoadingAd = false
                    
                    // Hủy Runnable timeout vì quảng cáo đã sẵn sàng
                    handler.removeCallbacks(timeoutRunnable)

                    // Hiển thị quảng cáo ngay khi tải xong
                    showAdIfAvailable()
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.e(TAG, "Tải quảng cáo thất bại: ${loadAdError.message}")
                    isLoadingAd = false
                    
                    // Chuyển sang ứng dụng chính ngay lập tức nếu lỗi
                    handler.removeCallbacks(timeoutRunnable)
                    navigateToMainActivity()
                }
            }
        )
    }

    private fun showAdIfAvailable() {
        val ad = appOpenAd
        if (ad != null && !isFinishing) {
            ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    Log.d(TAG, "Người dùng đã đóng quảng cáo.")
                    appOpenAd = null
                    navigateToMainActivity()
                }

                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    Log.e(TAG, "Lỗi hiển thị quảng cáo: ${adError.message}")
                    appOpenAd = null
                    navigateToMainActivity()
                }

                override fun onAdShowedFullScreenContent() {
                    Log.d(TAG, "Quảng cáo Mở ứng dụng đang hiển thị.")
                }
            }
            ad.show(this)
        } else {
            navigateToMainActivity()
        }
    }

    private fun navigateToMainActivity() {
        if (isNavigatedToMain) return
        isNavigatedToMain = true
        handler.removeCallbacks(timeoutRunnable)

        val intent = Intent(this, LauncherActivity::class.java)
        startActivity(intent)
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(timeoutRunnable)
    }
}
