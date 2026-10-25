package app.vercel.edubot247.twa

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.util.Log
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.browser.customtabs.CustomTabsIntent

/**
 * EduBotWebViewClient
 * Xử lý chuyển hướng mở liên kết quảng cáo AdMob, CH Play (market://), deep links (intent://),
 * và các trang web ngoài mà không bị chặn bởi WebView (tránh ERR_UNKNOWN_URL_SCHEME).
 */
class EduBotWebViewClient(private val context: Context) : WebViewClient() {

    companion object {
        private const val TAG = "EduBotWebViewClient"
        private const val HOST_DOMAIN = "edubot247.vercel.app"
    }

    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val url = request?.url?.toString() ?: return false
        return handleUrlRedirect(url, view)
    }

    @Deprecated("Deprecated in Java/Android SDK")
    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
        if (url == null) return false
        return handleUrlRedirect(url, view)
    }

    private fun handleUrlRedirect(url: String, view: WebView?): Boolean {
        Log.d(TAG, "Navigating URL: $url")

        // 1. Xử lý mở CH Play Store (market:// hoặc URL play.google.com)
        if (url.startsWith("market://") || url.contains("play.google.com/store/apps/details")) {
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
                return true
            } catch (e: ActivityNotFoundException) {
                // Nếu máy không có ứng dụng CH Play (ví dụ giả lập), mở bằng Trình duyệt
                val webStoreUrl = if (url.startsWith("market://details?id=")) {
                    url.replace("market://details?id=", "https://play.google.com/store/apps/details?id=")
                } else url
                openExternalBrowser(webStoreUrl)
                return true
            }
        }

        // 2. Xử lý Custom Intent Schemes (intent://, tel:, mailto:, zalo:, facebook:, v.v.)
        if (url.startsWith("intent://") || url.startsWith("tel:") || url.startsWith("mailto:") || !url.startsWith("http")) {
            try {
                val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                if (intent != null) {
                    val packageManager = context.packageManager
                    val info = packageManager.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY)
                    if (info != null) {
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        context.startActivity(intent)
                        return true
                    }
                    // Fallback URL nếu intent có khai báo browser_fallback_url (thường gặp ở link quảng cáo)
                    val fallbackUrl = intent.getStringExtra("browser_fallback_url")
                    if (!fallbackUrl.isNullOrEmpty()) {
                        openExternalBrowser(fallbackUrl)
                        return true
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Lỗi phân tích intent scheme: ${e.message}")
            }
            return true
        }

        // 3. Xử lý click chuyển hướng Quảng cáo ngoài tên miền ứng dụng Vercel
        val uri = Uri.parse(url)
        val host = uri.host
        if (host != null && !host.contains(HOST_DOMAIN) && !host.contains("vercel.app")) {
            // Mở landing page quảng cáo AdMob qua Chrome Custom Tabs hoặc Trình duyệt hệ thống
            openChromeCustomTab(url)
            return true
        }

        // Trong tên miền ứng dụng edubot247.vercel.app -> Cho phép WebView load bình thường
        return false
    }

    private fun openChromeCustomTab(url: String) {
        try {
            val builder = CustomTabsIntent.Builder()
            builder.setShowTitle(true)
            val customTabsIntent = builder.build()
            customTabsIntent.launchUrl(context, Uri.parse(url))
        } catch (e: Exception) {
            openExternalBrowser(url)
        }
    }

    private fun openExternalBrowser(url: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Không thể mở trình duyệt: ${e.message}")
        }
    }
}
