package com.counts.life.tests;

import android.app.Activity;
import android.app.ActivityOptions;
import android.app.Instrumentation;
import android.content.ContentValues;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.provider.MediaStore;
import android.view.Surface;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/** Runs the release Activity on a private virtual phone display, without taking focus. */
public final class SmokeInstrumentation extends Instrumentation {
    private Activity activity;
    private WebView web;
    private VirtualDisplay display;
    private Surface surface;
    private ImageReader frames;
    private String original;
    private Uri backup;

    @Override public void onCreate(Bundle args) { super.onCreate(args); start(); }

    private void check(boolean condition, String description) {
        if (!condition) throw new AssertionError(description);
        Bundle status = new Bundle();
        status.putString("stream", "PASS " + description + "\n");
        sendStatus(0, status);
    }

    private WebView findWeb(View view) {
        if (view instanceof WebView) return (WebView) view;
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            for (int i = 0; i < group.getChildCount(); i++) {
                WebView found = findWeb(group.getChildAt(i));
                if (found != null) return found;
            }
        }
        return null;
    }

    private String js(String code) throws Exception {
        CountDownLatch done = new CountDownLatch(1);
        String[] value = new String[1];
        runOnMainSync(() -> web.evaluateJavascript(code, result -> { value[0] = result; done.countDown(); }));
        if (!done.await(10, TimeUnit.SECONDS)) throw new AssertionError("JavaScript timed out");
        return value[0];
    }

    private void waitJs(String expression) throws Exception {
        for (int i = 0; i < 100; i++) {
            if ("true".equals(js("Boolean(" + expression + ")"))) return;
            Thread.sleep(100);
        }
        throw new AssertionError("Timed out: " + expression);
    }

    private void launch() throws Exception {
        Intent intent = new Intent().setClassName("com.counts.life", "com.counts.life.MainActivity")
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
        ActivityOptions options = ActivityOptions.makeBasic();
        options.setLaunchDisplayId(display.getDisplay().getDisplayId());
        activity = startActivitySync(intent, options.toBundle());
        runOnMainSync(() -> web = findWeb(activity.getWindow().getDecorView()));
        waitJs("typeof categories !== 'undefined' && categories.expense.length > 0");
    }

    private void screenshot(String name) {
        runOnMainSync(() -> {
            Bitmap bitmap = Bitmap.createBitmap(web.getWidth(), web.getHeight(), Bitmap.Config.ARGB_8888);
            web.draw(new Canvas(bitmap));
            try (FileOutputStream out = new FileOutputStream(new File(getTargetContext().getExternalCacheDir(), name))) {
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
            } catch (Exception e) { throw new RuntimeException(e); }
            bitmap.recycle();
        });
    }

    private void tap(String selector) throws Exception {
        JSONObject point = new JSONObject(js("(()=>{const r=document.querySelector("+JSONObject.quote(selector)+").getBoundingClientRect(); return {x:(r.left+r.width/2)*devicePixelRatio, y:(r.top+r.height/2)*devicePixelRatio};})()"));
        float x = (float)point.getDouble("x"), y = (float)point.getDouble("y");
        runOnMainSync(() -> {
            long now = SystemClock.uptimeMillis();
            MotionEvent down = MotionEvent.obtain(now, now, MotionEvent.ACTION_DOWN, x, y, 0);
            MotionEvent up = MotionEvent.obtain(now, now+50, MotionEvent.ACTION_UP, x, y, 0);
            web.dispatchTouchEvent(down);
            web.dispatchTouchEvent(up);
            down.recycle(); up.recycle();
        });
    }

    private ActivityMonitor documentPicker(String action, Intent selected) throws Exception {
        IntentFilter filter = new IntentFilter(action);
        filter.addCategory(Intent.CATEGORY_OPENABLE);
        filter.addDataType("*/*");
        return addMonitor(filter, new ActivityResult(Activity.RESULT_OK, selected), true);
    }

    @Override public void onStart() {
        Bundle result = new Bundle();
        int status = Activity.RESULT_CANCELED;
        try {
            getUiAutomation().adoptShellPermissionIdentity();
            runOnMainSync(() -> {
                frames = ImageReader.newInstance(1080, 2400, PixelFormat.RGBA_8888, 3);
                frames.setOnImageAvailableListener(reader -> {
                    Image frame = reader.acquireLatestImage();
                    if (frame != null) frame.close();
                }, new Handler(Looper.getMainLooper()));
                surface = frames.getSurface();
                DisplayManager manager = getTargetContext().getSystemService(DisplayManager.class);
                display = manager.createVirtualDisplay("Counts APK smoke test", 1080, 2400, 480,
                        surface, DisplayManager.VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY
                                | DisplayManager.VIRTUAL_DISPLAY_FLAG_PRESENTATION);
            });
            launch();
            check(activity.getDisplay().getDisplayId() == display.getDisplay().getDisplayId(), "isolated virtual phone display");
            check("true".equals(js("location.origin === 'https://appassets.androidplatform.net' && !!crypto.subtle")), "local secure origin");
            check("true".equals(js("typeof Chart === 'function' && !!window.CountsAndroid")), "bundled charts and native bridge");
            check("true".equals(js("document.documentElement.scrollWidth <= innerWidth && innerWidth <= 400")), "360dp phone layout fits screen");
            original = js("JSON.stringify(Object.fromEntries(Object.entries(localStorage)))");
            check("true".equals(js("!localStorage.getItem(LS_SYNC_PASS)")), "cloud sync remains off");
            js("dbWrite([]); window.__done = false; api('/api/records', {method:'POST', body:JSON.stringify({type:'expense', amount:12.34, category_id:6, date:localDateStr(), note:'Android smoke test', channel:'美团', sub:'外卖'})}).then(r=>{window.__saved=r.ok; return refreshAll();}).then(()=>window.__done=true)");
            waitJs("window.__done && window.__saved");
            check("true".equals(js("dbAll().length===1 && document.querySelector('#sumExpense').textContent.includes('12.34')")), "expense save and summary");
            js("window.__done=false; api('/api/records',{method:'POST',body:JSON.stringify({type:'income',amount:100,category_id:7,date:localDateStr(),note:'salary'})}).then(()=>refreshAll()).then(()=>window.__done=true)");
            waitJs("window.__done");
            check("true".equals(js("document.querySelector('#sumIncome').textContent.includes('100.00')")), "income save and summary");
            js("window.__done=false; api('/api/records/1',{method:'PATCH',body:JSON.stringify({note:'edited on Android'})}).then(()=>window.__done=true)");
            waitJs("window.__done");
            check("true".equals(js("dbAll()[0].note === 'edited on Android'")), "record editing");
            screenshot("counts-phone-add.png");
            // Background virtual displays may throttle requestAnimationFrame; draw deterministically.
            js("Chart.defaults.animation=false; document.querySelector('.tab[data-tab=charts]').click()");
            waitJs("Object.keys(charts).length===3");
            check("true".equals(js("document.querySelector('#expensePieChart').width>0 && document.querySelector('#dailyTotals').textContent.includes('12.34')")), "offline charts and daily totals");
            Thread.sleep(500);
            check("true".equals(js("(()=>{const c=document.querySelector('#expensePieChart'); return c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3 && v>0);})()")), "chart canvas contains visible pixels");
            screenshot("counts-phone-charts.png");
            js("openSettings()");
            waitJs("!document.querySelector('#stSheet').hidden");
            Thread.sleep(300);
            screenshot("counts-phone-settings.png");
            runOnMainSync(() -> activity.onBackPressed());
            waitJs("document.querySelector('#stSheet').hidden");
            check(true, "Android back closes settings");
            runOnMainSync(() -> activity.onBackPressed());
            waitJs("document.querySelector('#panel-add').classList.contains('active')");
            check(true, "Android back returns to entry tab");

            // Select an app-owned temporary document as if returned by the system picker.
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, "counts-smoke-test.json");
            values.put(MediaStore.Downloads.MIME_TYPE, "application/json");
            backup = getTargetContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            check(backup != null, "temporary backup document created");
            Intent selected = new Intent().setData(backup);
            ActivityMonitor save = documentPicker(Intent.ACTION_CREATE_DOCUMENT, selected);
            js("openSettings()");
            Thread.sleep(350);
            tap("#btnExport");
            for (int i=0; i<100 && save.getHits()==0; i++) Thread.sleep(100);
            check(save.getHits()==1, "export opens Android document picker");
            removeMonitor(save);
            String exported = "";
            for (int i=0; i<100; i++) {
                try (InputStream in = getTargetContext().getContentResolver().openInputStream(backup)) {
                    byte[] bytes = new byte[65536];
                    int count = in.read(bytes);
                    exported = count > 0 ? new String(bytes,0,count,java.nio.charset.StandardCharsets.UTF_8) : "";
                }
                if (exported.endsWith("}")) break;
                Thread.sleep(100);
            }
            check(new JSONObject(exported).getJSONArray("records").length()==2, "native export writes valid JSON backup");
            js("dbWrite([]); refreshAll(); window.confirm=()=>true");
            ActivityMonitor open = documentPicker(Intent.ACTION_OPEN_DOCUMENT, selected);
            tap("#btnImport");
            for (int i=0; i<100 && open.getHits()==0; i++) Thread.sleep(100);
            check(open.getHits()==1, "import opens Android document picker");
            waitJs("dbAll().length===2");
            check(open.getHits()==1, "native import restores selected backup");
            removeMonitor(open);
            check("true".equals(js("dbAll()[0].amount===12.34 && dbAll()[0].note==='edited on Android'")), "backup round trip preserves values");

            runOnMainSync(() -> activity.finish());
            waitForIdleSync();
            launch();
            check("true".equals(js("dbAll().length===2 && dbAll()[0].amount===12.34")), "records survive Activity recreation");
            js("window.__done=false; api('/api/records/1',{method:'DELETE'}).then(()=>window.__done=true)");
            waitJs("window.__done");
            check("true".equals(js("dbAll().length===1 && dbAll()[0].type==='income'")), "record deletion");
            result.putString("stream", "All Android APK smoke checks passed.\n");
            status = Activity.RESULT_OK;
        } catch (Throwable e) {
            result.putString("stream", "FAILED: " + android.util.Log.getStackTraceString(e));
        } finally {
            try {
                if (original != null && web != null) js("localStorage.clear(); Object.entries(JSON.parse("+original+")).forEach(([k,v])=>localStorage.setItem(k,v)); refreshAll()");
                if (backup != null) getTargetContext().getContentResolver().delete(backup, null, null);
                runOnMainSync(() -> {
                    if (activity != null) activity.finish();
                    if (display != null) display.release();
                    if (surface != null) surface.release();
                    if (frames != null) frames.close();
                });
            } catch (Throwable ignored) {}
            getUiAutomation().dropShellPermissionIdentity();
        }
        finish(status, result);
    }
}
