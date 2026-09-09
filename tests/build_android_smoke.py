"""Build the SDK-only Android instrumentation tests, signed with the app's local key."""
import argparse
import os
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from build_android import ROOT, BUILD, run, tool_paths, signing_key

java, bt, platform, extension = tool_paths(argparse.Namespace(java_home=None, sdk=None))
env = dict(os.environ, JAVA_HOME=str(java))
out = BUILD / "smoke"
out.mkdir(exist_ok=True)
manifest = out / "AndroidManifest.xml"
manifest.write_text('''<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.counts.life.tests">
<uses-sdk android:minSdkVersion="29" android:targetSdkVersion="36" />
<application android:label="Counts tests" />
<instrumentation android:name="com.counts.life.tests.SmokeInstrumentation" android:targetPackage="com.counts.life" />
</manifest>''', encoding="utf-8")
classes = out / "classes"
classes.mkdir(exist_ok=True)
run([java / ("bin/javac"+extension), "-encoding", "UTF-8", "-source", "8", "-target", "8", "-Xlint:-options",
     "-classpath", platform, "-d", classes, ROOT / "tests/android/SmokeInstrumentation.java"], env)
jar = out / "classes.jar"
with zipfile.ZipFile(jar, "w") as archive:
    for path in classes.rglob("*.class"):
        archive.write(path, path.relative_to(classes).as_posix())
run([java / ("bin/java"+extension), "-cp", bt / "lib/d8.jar", "com.android.tools.r8.D8",
     "--min-api", "29", "--lib", platform, "--output", out, jar], env)
unsigned = out / "unsigned.apk"
run([bt / ("aapt2"+extension), "link", "-o", unsigned, "-I", platform, "--manifest", manifest], env)
with zipfile.ZipFile(unsigned, "a", zipfile.ZIP_DEFLATED) as archive:
    archive.write(out / "classes.dex", "classes.dex")
aligned = out / "aligned.apk"
run([bt / ("zipalign"+extension), "-f", "4", unsigned, aligned], env)
key, alias = signing_key(java, extension, env)
run([java / ("bin/java"+extension), "-jar", bt / "lib/apksigner.jar", "sign", "--ks", key,
     "--ks-key-alias", alias, "--ks-pass", "env:COUNTS_SIGNING_PASSWORD", "--key-pass", "env:COUNTS_SIGNING_PASSWORD",
     "--out", out / "counts-tests.apk", aligned], env)
print(out / "counts-tests.apk")
