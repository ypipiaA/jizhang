"""Prepare the full Cloudflare Pages upload ZIP with an explicit versioned APK."""
import hashlib
import shutil
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public"


def build():
    version = ET.parse(ROOT / "android/app/src/main/AndroidManifest.xml").getroot().get(
        "{http://schemas.android.com/apk/res/android}versionName")
    name = f"counts-{version}.apk"
    apk = ROOT / "dist/android" / name
    if not apk.is_file():
        raise RuntimeError("Run build_android.py first")
    with zipfile.ZipFile(apk) as z:
        if z.testzip() is not None or "AndroidManifest.xml" not in z.namelist():
            raise RuntimeError("Invalid APK")
    downloads = PUBLIC / "downloads"
    downloads.mkdir(exist_ok=True)
    shutil.copy2(apk, downloads / name)
    page = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>生活记账 · 安卓下载</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff5ef;color:#34312d;font-family:system-ui,sans-serif}main{width:min(90%,420px);padding:36px 28px;text-align:center;background:#fff;border-radius:28px;box-shadow:0 16px 60px #af745222}img{width:96px;height:96px}h1{font-size:28px;margin:20px 0 10px}p,small{color:#70695f;line-height:1.8}a{display:block;margin:26px 0 20px;padding:16px;background:#ff6b4a;color:white;border-radius:16px;text-decoration:none;font-weight:600}small{display:block}</style>
<main><img src="/static/icon.svg" alt="生活记账图标"><h1>生活记账</h1><p>轻松记录日常收支<br>离线记账 · 分类统计 · 数据备份</p>
<a href="/downloads/APK_FILENAME" download="APK_FILENAME">下载安卓版 · APP_VERSION</a>
<small>支持 Android 8.0 及以上<br>下载后点击 APK，按手机提示安装。<br>已安装旧版可直接更新，账本数据保留。</small></main></html>'''
    (downloads / "index.html").write_text(
        page.replace("APK_FILENAME", name).replace("APP_VERSION", version), encoding="utf-8")
    output = ROOT / "dist" / f"cloudflare-counts-{version}-download-fix.zip"
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        for source in sorted(PUBLIC.rglob("*")):
            if source.is_file():
                if source.suffix in (".db", ".jks"):
                    raise RuntimeError("Private file must not be published")
                archive.write(source, source.relative_to(PUBLIC).as_posix())
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        assert hashlib.sha256(archive.read("downloads/" + name)).digest() == hashlib.sha256(apk.read_bytes()).digest()
        assert {"index.html", "404.html", "_worker.js", "_headers", "downloads/index.html"}.issubset(archive.namelist())
    # Refresh the previous upload filename as well, so an existing local link uses the fixed package.
    shutil.copy2(output, ROOT / "dist" / f"cloudflare-counts-{version}.zip")
    print(f"Cloudflare upload: {output}")
    print(f"After production deployment: /downloads/{name}")


if __name__ == "__main__":
    build()
