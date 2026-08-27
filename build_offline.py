"""把整个应用打包成一个自包含的 HTML 文件。

产物：dist/生活记账.html —— 双击即可使用，不需要服务器、不需要联网、不需要 VPN。
用法：python build_offline.py
"""

import base64
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
PUBLIC = ROOT / "public"
DIST = ROOT / "dist"
CHART_URL = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
CHART_CACHE = ROOT / ".chart.cache.js"


def fetch_chartjs() -> str:
    if CHART_CACHE.exists():
        return CHART_CACHE.read_text(encoding="utf-8")
    print("下载 Chart.js ...")
    with urllib.request.urlopen(CHART_URL, timeout=60) as resp:
        code = resp.read().decode("utf-8")
    CHART_CACHE.write_text(code, encoding="utf-8")
    return code


def build() -> Path:
    html = (PUBLIC / "index.html").read_text(encoding="utf-8")
    css = (PUBLIC / "static/css/style.css").read_text(encoding="utf-8")
    js = (PUBLIC / "static/js/app.js").read_text(encoding="utf-8")
    chart = fetch_chartjs()
    icon_b64 = base64.b64encode((PUBLIC / "static/icon.svg").read_bytes()).decode()

    # 外链资源全部内联
    html = html.replace(
        '<link rel="stylesheet" href="/static/css/style.css">',
        f"<style>\n{css}\n</style>",
    )
    html = html.replace(
        f'<script src="{CHART_URL}"></script>',
        f"<script>\n{chart}\n</script>",
    )
    html = html.replace(
        '<script src="/static/js/app.js"></script>',
        f"<script>\n{js}\n</script>",
    )

    # 单文件版没有服务器，去掉 PWA/字体等所有网络请求
    html = re.sub(r'\s*<link rel="manifest"[^>]*>', "", html)
    html = re.sub(r'\s*<link rel="preconnect"[^>]*>', "", html)
    html = re.sub(r'\s*<link href="https://fonts\.googleapis[^>]*>', "", html)
    html = re.sub(r'\s*<link rel="apple-touch-icon"[^>]*>', "", html)
    html = html.replace(
        '<link rel="icon" href="/static/icon.svg" type="image/svg+xml">',
        f'<link rel="icon" href="data:image/svg+xml;base64,{icon_b64}">',
    )

    # 关闭 Service Worker 注册与旧服务器数据迁移（单文件场景下都无意义）
    html = html.replace('navigator.serviceWorker.register("/sw.js")',
                        'Promise.reject()')
    html = html.replace("await migrateFromServer();",
                        "if (localStorage.getItem(LS_RECORDS) === null) dbWrite([]);")

    assert "/static/css/style.css" not in html, "CSS 未内联"
    assert "/static/js/app.js" not in html, "JS 未内联"
    assert CHART_URL not in html, "Chart.js 未内联"

    DIST.mkdir(exist_ok=True)
    out = DIST / "生活记账.html"
    out.write_text(html, encoding="utf-8")
    return out


if __name__ == "__main__":
    path = build()
    size = path.stat().st_size / 1024
    print(f"完成 -> {path}  ({size:.0f} KB)")
