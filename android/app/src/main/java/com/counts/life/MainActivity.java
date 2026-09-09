package com.counts.life;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Local, offline WebView host. Only the packaged page may use the file-save bridge. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/index.html";
    private static final int IMPORT_FILE = 101;
    private static final int EXPORT_FILE = 102;
    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private final ExecutorService files = Executors.newSingleThreadExecutor();
    private boolean exporting;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(255, 245, 240));
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars()
                        | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                v.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return WindowInsets.CONSUMED;
            });
        }
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(255, 245, 240));
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        root.requestApplyInsets();

        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Only user-selected content:// backup files.
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        WebView.setWebContentsDebuggingEnabled(false);
        web.addJavascriptInterface(new BackupBridge(), "CountsAndroid");
        web.setWebViewClient(new LocalClient());
        web.setWebChromeClient(new BrowserDialogs());
        exporting = state != null && state.getBoolean("exporting", false)
                && pendingBackup().isFile();
        web.loadUrl(START);
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost())
                && uri.getPort() == -1 && uri.getUserInfo() == null;
    }

    private final class LocalClient extends WebViewClient {
        @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            // Never navigate to remote documents while the native bridge is attached.
            return !isLocal(request.getUrl()) || !"/index.html".equals(request.getUrl().getPath());
        }

        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (isLocal(uri) && "GET".equals(request.getMethod())) {
                String path = uri.getPath();
                String mime;
                if ("/index.html".equals(path)) mime = "text/html";
                else if ("/static/css/style.css".equals(path)) mime = "text/css";
                else if ("/static/js/app.js".equals(path) || "/static/js/chart.umd.min.js".equals(path))
                    mime = "application/javascript";
                else if ("/static/icon.svg".equals(path)) mime = "image/svg+xml";
                else return blocked();
                try {
                    InputStream content = getAssets().open("www" + path);
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Cache-Control", "no-store");
                    headers.put("Content-Security-Policy", "default-src 'none'; script-src 'self'; "
                            + "style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
                            + "connect-src https://jizhang-d9k.pages.dev; "
                            + "frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'");
                    return new WebResourceResponse(mime, "UTF-8", 200, "OK", headers, content);
                } catch (IOException e) { return blocked(); }
            }
            // Preserve the existing opt-in sync endpoint; all UI assets stay offline.
            if (!request.isForMainFrame() && "https".equals(uri.getScheme())
                    && "jizhang-d9k.pages.dev".equals(uri.getHost())
                    && "/api/sync".equals(uri.getPath()) && uri.getPort() == -1) return null;
            return blocked();
        }
    }

    private static WebResourceResponse blocked() {
        return new WebResourceResponse("text/plain", "UTF-8", 403, "Forbidden",
                new HashMap<>(), new ByteArrayInputStream(new byte[0]));
    }

    private final class BrowserDialogs extends WebChromeClient {
        @Override public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            new AlertDialog.Builder(MainActivity.this).setTitle("生活记账").setMessage(message)
                    .setPositiveButton("确定", (d, w) -> result.confirm())
                    .setOnCancelListener(d -> result.cancel()).show();
            return true;
        }

        @Override public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
            new AlertDialog.Builder(MainActivity.this).setTitle("生活记账").setMessage(message)
                    .setPositiveButton("确定", (d, w) -> result.confirm())
                    .setNegativeButton("取消", (d, w) -> result.cancel())
                    .setOnCancelListener(d -> result.cancel()).show();
            return true;
        }

        @Override public boolean onJsPrompt(WebView view, String url, String message,
                                           String defaultValue, JsPromptResult result) {
            EditText input = new EditText(MainActivity.this);
            input.setSingleLine(true);
            input.setText(defaultValue);
            input.setSelectAllOnFocus(true);
            new AlertDialog.Builder(MainActivity.this).setTitle("生活记账").setMessage(message)
                    .setView(input)
                    .setPositiveButton("确定", (d, w) -> result.confirm(input.getText().toString()))
                    .setNegativeButton("取消", (d, w) -> result.cancel())
                    .setOnCancelListener(d -> result.cancel()).show();
            return true;
        }

        @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                                   FileChooserParams params) {
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = callback;
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("*/*"); // Some file providers label JSON as plain text/octet-stream.
            intent.putExtra(Intent.EXTRA_MIME_TYPES,
                    new String[] {"application/json", "text/plain", "application/octet-stream"});
            try { startActivityForResult(intent, IMPORT_FILE); }
            catch (ActivityNotFoundException e) {
                fileCallback.onReceiveValue(null);
                fileCallback = null;
                toast("未找到系统文件选择器");
            }
            return true;
        }
    }

    private File pendingBackup() { return new File(getCacheDir(), "pending-backup.json"); }

    private final class BackupBridge {
        @JavascriptInterface public void exportBackup(String name, String json) {
            if (json == null || json.length() > 20_000_000) {
                runOnUiThread(() -> toast("备份过大，无法导出"));
                return;
            }
            try {
                JSONObject payload = new JSONObject(json);
                if (!"生活记账".equals(payload.optString("app")) || payload.optJSONArray("records") == null)
                    throw new IllegalArgumentException();
            } catch (Exception e) {
                runOnUiThread(() -> toast("备份内容无效"));
                return;
            }
            final String filename = name != null && name.matches("记账备份-\\d{4}-\\d{2}-\\d{2}\\.json")
                    ? name : "记账备份.json";
            runOnUiThread(() -> {
                if (exporting || !START.equals(web.getUrl())) return;
                exporting = true;
                files.execute(() -> {
                    try (OutputStream out = new FileOutputStream(pendingBackup())) {
                        out.write(json.getBytes(StandardCharsets.UTF_8));
                    } catch (IOException e) {
                        runOnUiThread(() -> { exporting = false; toast("备份准备失败，请重试"); });
                        return;
                    }
                    runOnUiThread(() -> {
                        if (isFinishing() || isDestroyed()) return;
                        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                        intent.addCategory(Intent.CATEGORY_OPENABLE);
                        intent.setType("application/json");
                        intent.putExtra(Intent.EXTRA_TITLE, filename);
                        try { startActivityForResult(intent, EXPORT_FILE); }
                        catch (ActivityNotFoundException e) {
                            exporting = false;
                            pendingBackup().delete();
                            toast("未找到系统文件选择器");
                        }
                    });
                });
            });
        }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == IMPORT_FILE && fileCallback != null) {
            Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
            fileCallback.onReceiveValue(uri != null && "content".equals(uri.getScheme())
                    ? new Uri[] {uri} : null);
            fileCallback = null;
        } else if (request == EXPORT_FILE) {
            if (result != RESULT_OK || data == null || data.getData() == null) {
                exporting = false;
                pendingBackup().delete();
                return;
            }
            Uri destination = data.getData();
            files.execute(() -> {
                boolean success = false;
                try (InputStream in = new FileInputStream(pendingBackup());
                     OutputStream out = getContentResolver().openOutputStream(destination, "wt")) {
                    if (out == null) throw new IOException("No output stream");
                    byte[] buffer = new byte[8192];
                    int count;
                    while ((count = in.read(buffer)) != -1) out.write(buffer, 0, count);
                    out.flush();
                    success = true;
                } catch (IOException | SecurityException e) { /* Report without exposing local paths. */ }
                pendingBackup().delete();
                final boolean saved = success;
                runOnUiThread(() -> { exporting = false; toast(saved ? "备份已保存 ✓" : "备份保存失败，请重新导出"); });
            });
        }
    }

    private void toast(String message) { Toast.makeText(this, message, Toast.LENGTH_LONG).show(); }

    private void handleBack() {
        web.evaluateJavascript("Boolean(window.handleAndroidBack && window.handleAndroidBack())", handled -> {
            if (!"true".equals(handled)) moveTaskToBack(true);
        });
    }

    @Override public void onBackPressed() { handleBack(); }
    @Override protected void onSaveInstanceState(Bundle state) {
        state.putBoolean("exporting", exporting);
        super.onSaveInstanceState(state);
    }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onDestroy() {
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        web.removeJavascriptInterface("CountsAndroid");
        web.destroy();
        files.shutdown();
        super.onDestroy();
    }
}
