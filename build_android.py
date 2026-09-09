"""Build a signed, offline Android APK using only Python, a JDK and Android SDK.

First run: python build_android.py --java-home <JDK> --sdk <Android SDK>
Later runs reuse .android-build/toolchain.json. No Gradle/npm/Python packages needed.
"""
import argparse
import hashlib
import json
import os
import re
import secrets
import shutil
import subprocess
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

from build_offline import fetch_chartjs

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "android/app/src/main"
BUILD = ROOT / ".android-build"
SIGNING = ROOT / ".android-signing"
ANDROID_NS = "{http://schemas.android.com/apk/res/android}"


def prepare_assets() -> Path:
    """Use the existing web source; never package databases or local sync credentials."""
    public = ROOT / "public"
    assets = BUILD / "assets"
    web = assets / "www"
    (web / "static/js").mkdir(parents=True, exist_ok=True)
    (web / "static/css").mkdir(parents=True, exist_ok=True)
    html = (public / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'\s*<link[^>]+(?:rel="(?:manifest|preconnect|apple-touch-icon)"|href="https://fonts\.googleapis)[^>]*>', "", html)
    html = html.replace(
        "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
        "/static/js/chart.umd.min.js",
    )
    if re.search(r'<(?:script|link)[^>]+(?:src|href)="https?://', html):
        raise RuntimeError("Android UI must not depend on remote assets")
    (web / "index.html").write_text(html, encoding="utf-8")
    for relative in ("static/js/app.js", "static/css/style.css", "static/icon.svg"):
        shutil.copy2(public / relative, web / relative)
    (web / "static/js/chart.umd.min.js").write_text(fetch_chartjs(), encoding="utf-8")
    return assets


def run(args, env=None):
    subprocess.run([str(arg) for arg in args], cwd=ROOT, env=env, check=True)


def tool_paths(args):
    config = BUILD / "toolchain.json"
    saved = json.loads(config.read_text(encoding="utf-8")) if config.exists() else {}
    java = args.java_home or os.environ.get("JAVA_HOME") or saved.get("java")
    sdk = args.sdk or os.environ.get("ANDROID_HOME") or os.environ.get("ANDROID_SDK_ROOT") or saved.get("sdk")
    if not java or not sdk:
        raise RuntimeError("Specify --java-home and --sdk (or set JAVA_HOME / ANDROID_HOME)")
    java, sdk = Path(java).resolve(), Path(sdk).resolve()
    extension = ".exe" if os.name == "nt" else ""
    bt = sdk / "build-tools/36.0.0"
    platform = sdk / "platforms/android-36/android.jar"
    for path in (java / ("bin/javac" + extension), platform, bt / ("aapt2" + extension),
                 bt / "lib/d8.jar", bt / "lib/apksigner.jar"):
        if not path.is_file():
            raise RuntimeError(f"Missing required build tool: {path}")
    config.write_text(json.dumps({"java": str(java), "sdk": str(sdk)}, indent=2), encoding="utf-8")
    return java, bt, platform, extension


def signing_key(java, extension, env):
    SIGNING.mkdir(exist_ok=True)
    key = SIGNING / "counts-release.jks"
    config = SIGNING / "signing.json"
    marker = SIGNING / "certificate.sha256"
    if not config.exists():
        if key.exists() or marker.exists():
            raise RuntimeError("Restore the original signing.json before rebuilding")
        config.write_text(json.dumps({"alias": "counts-release", "password": secrets.token_urlsafe(36)}), encoding="utf-8")
    data = json.loads(config.read_text(encoding="utf-8"))
    env["COUNTS_SIGNING_PASSWORD"] = data["password"]
    if not key.exists():
        if marker.exists():
            raise RuntimeError("Signing key missing: restore it to preserve upgrade compatibility")
        run([java / ("bin/keytool" + extension), "-genkeypair", "-keystore", key,
             "-storetype", "JKS", "-storepass:env", "COUNTS_SIGNING_PASSWORD",
             "-keypass:env", "COUNTS_SIGNING_PASSWORD", "-alias", data["alias"],
             "-keyalg", "RSA", "-keysize", "3072", "-validity", "10000",
             "-dname", "CN=Counts Life,O=Counts,C=CN"], env)
    cert = BUILD / "signing-cert.der"
    run([java / ("bin/keytool" + extension), "-exportcert", "-keystore", key,
         "-storepass:env", "COUNTS_SIGNING_PASSWORD", "-alias", data["alias"], "-file", cert], env)
    fingerprint = hashlib.sha256(cert.read_bytes()).hexdigest()
    if marker.exists() and marker.read_text().strip() != fingerprint:
        raise RuntimeError("Signing certificate changed; restore the original key for app updates")
    marker.write_text(fingerprint + "\n", encoding="ascii")
    return key, data["alias"]


def build(args):
    BUILD.mkdir(exist_ok=True)
    assets = prepare_assets()
    if args.assets_only:
        print(f"Offline assets ready: {assets}")
        return
    java, bt, platform, extension = tool_paths(args)
    env = dict(os.environ, JAVA_HOME=str(java))
    env["PATH"] = str(java / "bin") + os.pathsep + env.get("PATH", "")
    manifest = ET.parse(SOURCE / "AndroidManifest.xml").getroot()
    version = manifest.get(ANDROID_NS + "versionName")
    min_sdk = manifest.find("uses-sdk").get(ANDROID_NS + "minSdkVersion")
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise RuntimeError("Invalid Android versionName")
    # Only remove this task's known intermediate directories; preserve tool settings and keys.
    for name in ("classes", "generated", "dex"):
        directory = (BUILD / name).resolve()
        directory.relative_to(BUILD.resolve())
        if directory.exists():
            shutil.rmtree(directory)
        directory.mkdir()

    print("Compiling Android resources and Java...", flush=True)
    compiled = BUILD / "resources.zip"
    unsigned = BUILD / "unsigned.apk"
    run([bt / ("aapt2" + extension), "compile", "--dir", SOURCE / "res", "-o", compiled], env)
    run([bt / ("aapt2" + extension), "link", "-o", unsigned, "-I", platform,
         "--manifest", SOURCE / "AndroidManifest.xml", "--java", BUILD / "generated",
         "-A", assets, compiled], env)
    sources = list((SOURCE / "java").rglob("*.java")) + list((BUILD / "generated").rglob("*.java"))
    run([java / ("bin/javac" + extension), "-encoding", "UTF-8", "-source", "8", "-target", "8",
         "-Xlint:-options", "-classpath", platform, "-d", BUILD / "classes", *sources], env)
    classes = BUILD / "classes.jar"
    with zipfile.ZipFile(classes, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in (BUILD / "classes").rglob("*.class"):
            archive.write(path, path.relative_to(BUILD / "classes").as_posix())
    run([java / ("bin/java" + extension), "-cp", bt / "lib/d8.jar", "com.android.tools.r8.D8",
         "--release", "--min-api", min_sdk, "--lib", platform, "--output", BUILD / "dex", classes], env)
    with zipfile.ZipFile(unsigned, "a", zipfile.ZIP_DEFLATED) as archive:
        for dex in (BUILD / "dex").glob("*.dex"):
            archive.write(dex, dex.name)
    aligned = BUILD / "aligned.apk"
    run([bt / ("zipalign" + extension), "-f", "-p", "4", unsigned, aligned], env)
    key, alias = signing_key(java, extension, env)
    output = ROOT / "dist/android"
    output.mkdir(parents=True, exist_ok=True)
    apk = output / f"counts-{version}.apk"
    signer = [java / ("bin/java" + extension), "-jar", bt / "lib/apksigner.jar"]
    run([*signer, "sign", "--ks", key, "--ks-key-alias", alias,
         "--ks-pass", "env:COUNTS_SIGNING_PASSWORD", "--key-pass", "env:COUNTS_SIGNING_PASSWORD",
         "--out", apk, aligned], env)
    run([*signer, "verify", "--verbose", "--print-certs", apk], env)
    run([bt / ("zipalign" + extension), "-c", "4", apk], env)
    with zipfile.ZipFile(apk) as archive:
        assert archive.testzip() is None, "APK is corrupt"
        expected = {"AndroidManifest.xml", "classes.dex", "resources.arsc", "assets/www/index.html",
                    "assets/www/static/js/app.js", "assets/www/static/js/chart.umd.min.js"}
        assert expected.issubset(archive.namelist()), "APK is missing required files"
        assert not any(name.endswith((".db", ".jks")) for name in archive.namelist())
    (output / (apk.name + ".sha256")).write_text(
        hashlib.sha256(apk.read_bytes()).hexdigest() + "  " + apk.name + "\n", encoding="ascii")
    print(f"APK ready: {apk} ({apk.stat().st_size / 1024:.0f} KB)", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--java-home", help="JDK 17 or newer")
    parser.add_argument("--sdk", help="Android SDK with platforms;android-36 and build-tools;36.0.0")
    parser.add_argument("--assets-only", action="store_true", help="Prepare offline web files without a JDK/SDK")
    build(parser.parse_args())
