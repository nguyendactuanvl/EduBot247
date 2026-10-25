/**
 * Google AdMob & Google Mobile Ads Configuration for EduBot 247
 * Configured according to Google AdMob console specification
 */

export interface AdUnitConfig {
  key: string;
  name: string;
  unitId: string;
  format: 'native' | 'app_open' | 'banner' | 'rewarded_interstitial' | 'interstitial' | 'rewarded';
  formatNameVi: string;
  description: string;
  recommendedPosition: string;
  testUnitId?: string; // Standard Google test unit IDs if needed
}

export const ADMOB_CONFIG = {
  appName: 'EduBot 247',
  publisherId: 'pub-5320880447374751',
  appId: 'ca-app-pub-5320880447374751~3167851635',
  appAdsTxtEntry: 'google.com, pub-5320880447374751, DIRECT, f08c47fec0942fa0',
  adUnits: [
    {
      key: 'ADS_1_NATIVE',
      name: 'Ads 1',
      unitId: 'ca-app-pub-5320880447374751/4003943665',
      format: 'native',
      formatNameVi: 'Quảng cáo gốc nâng cao (Native Advanced)',
      description: 'Hòa nhập tự nhiên vào danh sách câu hỏi trắc nghiệm, bài tập ôn luyện GDPT 2018.',
      recommendedPosition: 'Xen kẽ giữa các đề thi hoặc bên dưới các bài giải chi tiết',
      testUnitId: 'ca-app-pub-3940256099942544/2247696110'
    },
    {
      key: 'ADS_2_APP_OPEN',
      name: 'Ads 2',
      unitId: 'ca-app-pub-5320880447374751/7345879147',
      format: 'app_open',
      formatNameVi: 'Mở ứng dụng (App Open)',
      description: 'Hiển thị khi học sinh bắt đầu mở ứng dụng hoặc quay lại sau khi chuyển tab.',
      recommendedPosition: 'Màn hình Splash/Khởi động ứng dụng',
      testUnitId: 'ca-app-pub-3940256099942544/3419835294'
    },
    {
      key: 'ADS_3_BANNER',
      name: 'Ads 3',
      unitId: 'ca-app-pub-5320880447374751/2768164873',
      format: 'banner',
      formatNameVi: 'Biểu ngữ (Banner)',
      description: 'Dải biểu ngữ cố định ở chân trang (Adaptive Banner / 320x50 / 728x90) không gây cản trở học tập.',
      recommendedPosition: 'Thanh đáy cố định màn hình chính & khu vực máy tính/thống kê',
      testUnitId: 'ca-app-pub-3940256099942544/6300978111'
    },
    {
      key: 'ADS_4_REWARDED_INTERSTITIAL',
      name: 'Ads 4',
      unitId: 'ca-app-pub-5320880447374751/3350793818',
      format: 'rewarded_interstitial',
      formatNameVi: 'Quảng cáo xen kẽ có tặng thưởng (Rewarded Interstitial)',
      description: 'Xuất hiện trong các bước tự nhiên (sau khi nộp bài thi thử, bấm kiểm tra toàn bộ đề).',
      recommendedPosition: 'Sau khi hoàn thành bài kiểm tra 45 phút hoặc đề thi thử THPT',
      testUnitId: 'ca-app-pub-3940256099942544/5354046379'
    },
    {
      key: 'ADS_4_INTERSTITIAL',
      name: 'Ads 4 (Trung gian)',
      unitId: 'ca-app-pub-5320880447374751/5976957153',
      format: 'interstitial',
      formatNameVi: 'Trung gian (Interstitial toàn màn hình)',
      description: 'Quảng cáo toàn màn hình xuất hiện khi chuyển đổi giữa các module tính năng lớn.',
      recommendedPosition: 'Khi chuyển đổi từ Luyện đề sang Máy tính MTBT hoặc Phòng thí nghiệm ảo',
      testUnitId: 'ca-app-pub-3940256099942544/1033173712'
    },
    {
      key: 'REWARD_PHAN_THUONG',
      name: 'Reward-phần thưởng',
      unitId: 'ca-app-pub-5320880447374751/6933359339',
      format: 'rewarded',
      formatNameVi: 'Quảng cáo có tặng thưởng (Rewarded Video)',
      description: 'Người dùng chủ động bấm xem để nhận thưởng: thêm lượt hỏi Gia sư AI, tải PDF bản đẹp, mở khóa đề VIP.',
      recommendedPosition: 'Nút "Nhận thêm lượt hỏi AI" hoặc "Mở khóa trọn bộ lời giải chi tiết"',
      testUnitId: 'ca-app-pub-3940256099942544/5224354917'
    }
  ] as AdUnitConfig[]
};

/**
 * Android Manifest Configuration snippet for Google AdMob SDK & TWA
 */
export const ANDROID_MANIFEST_SNIPPET = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="app.vercel.edubot247.twa">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="EduBot 247"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.EduBot247">

        <!-- Google AdMob Application ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="${ADMOB_CONFIG.appId}"/>

        <!-- Activity khởi chạy TWA -->
        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true">
            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="https://edubot247.vercel.app" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>`;

/**
 * Kotlin SplashActivity snippet for App Open Ads (Ads 2)
 */
export const SPLASH_ACTIVITY_KOTLIN_SNIPPET = `package app.vercel.edubot247.twa

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.androidbrowserhelper.trusted.LauncherActivity

class SplashActivity : AppCompatActivity() {

    private var appOpenAd: AppOpenAd? = null
    private val AD_UNIT_ID = "ca-app-pub-5320880447374751/7345879147"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        MobileAds.initialize(this) {}

        // Tải Quảng cáo Mở ứng dụng (Ads 2)
        AppOpenAd.load(
            this,
            AD_UNIT_ID,
            AdRequest.Builder().build(),
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    appOpenAd = ad
                    showAdAndNavigate()
                }

                override fun onAdFailedToLoad(loadAdError: com.google.android.gms.ads.LoadAdError) {
                    navigateToTwa()
                }
            }
        )

        // Handler giới hạn tối đa 4s chờ
        Handler(Looper.getMainLooper()).postDelayed({ navigateToTwa() }, 4000)
    }

    private fun showAdAndNavigate() {
        appOpenAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { navigateToTwa() }
            override fun onAdFailedToShowFullScreenContent(adError: com.google.android.gms.ads.AdError) { navigateToTwa() }
        }
        appOpenAd?.show(this)
    }

    private fun navigateToTwa() {
        startActivity(Intent(this, LauncherActivity::class.java))
        finish()
    }
}`;

/**
 * Gradle build configuration for Android (Kotlin DSL & Groovy)
 */
export const ANDROID_GRADLE_KTS_SNIPPET = `// Root-level (<project>/build.gradle.kts)
plugins {
    id("com.google.gms.google-services") version "4.5.0" apply false
}

// App-level (<project>/app/build.gradle.kts)
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
}

dependencies {
    // 1. Firebase BoM & Services
    implementation(platform("com.google.firebase:firebase-bom:35.1.0"))
    implementation("com.google.firebase:firebase-analytics")

    // 2. Google Mobile Ads SDK (AdMob)
    implementation("com.google.android.gms:play-services-ads:23.0.0")

    // 3. Android Browser Helper (TWA mở edubot247.vercel.app)
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.5.0")
}`;

export const ANDROID_GRADLE_SNIPPET = `// Root-level (<project>/build.gradle)
plugins {
    id 'com.google.gms.google-services' version '4.5.0' apply false
}

// App-level (<project>/app/build.gradle)
plugins {
    id 'com.android.application'
    id 'kotlin-android'
    id 'com.google.gms.google-services'
}

dependencies {
    // 1. Firebase BoM & Services
    implementation platform('com.google.firebase:firebase-bom:35.1.0')
    implementation 'com.google.firebase:firebase-analytics'

    // 2. Google Mobile Ads SDK (AdMob)
    implementation 'com.google.android.gms:play-services-ads:23.0.0'

    // 3. Android Browser Helper (TWA mở edubot247.vercel.app)
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}`;
