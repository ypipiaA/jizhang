"""通过 Cloudflare API 直接把 public/ 部署到 Pages（无需 Node/wrangler）。

用法：
    set CF_TOKEN=xxx & set CF_ACC=xxx & python cf_deploy.py
"""

import base64
import hashlib
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public"
PROJECT = "jizhang"  # 应用身份名；Cloudflare 后台显示名可能被改，不作为定位依据
# 正式站点的永久标识：项目 ID 不随改名变化，与正式域名共同锁定唯一发布目标
PROJECT_ID = "a460326b-e5d7-4ead-9742-a7ebcb41ef32"
EXPECTED_HOST = "jizhang-d9k.pages.dev"
REQUESTED_PROJECT = os.environ.get("CF_PROJECT", PROJECT)
TOKEN = os.environ.get("CF_TOKEN", "")
ACCOUNT = os.environ.get("CF_ACC", "")
BASE = "https://api.cloudflare.com/client/v4"


def req(url, method="GET", data=None, token=None, headers=None, raw=False):
    """走 curl 发请求（本机 Python 的 SSL 栈连不上 Cloudflare）。"""
    import subprocess
    import tempfile

    cmd = ["curl", "-s", "--max-time", "180", "-X", method, url,
           "-H", f"Authorization: Bearer {token or TOKEN}"]
    for k, v in (headers or {}).items():
        cmd += ["-H", f"{k}: {v}"]

    tmp = None
    if data is not None:
        if raw:
            body = data
        else:
            cmd += ["-H", "Content-Type: application/json"]
            body = json.dumps(data).encode()
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".bin")
        tmp.write(body)
        tmp.close()
        cmd += ["--data-binary", "@" + tmp.name]

    try:
        out = subprocess.run(cmd, capture_output=True, timeout=300).stdout.decode()
    finally:
        if tmp:
            os.unlink(tmp.name)

    try:
        res = json.loads(out)
    except json.JSONDecodeError:
        raise SystemExit(f"响应无法解析 @ {method} {url}\n{out[:600]}")
    if not res.get("success", True):
        raise SystemExit(f"API 报错 @ {method} {url}\n{json.dumps(res.get('errors'), ensure_ascii=False)[:600]}")
    return res


def collect_files():
    """返回 [(站点路径, 本地路径)]，站点路径以 / 开头。_worker.js 不算静态资源。"""
    out = []
    for p in sorted(PUBLIC.rglob("*")):
        if p.is_file() and p.name != "_worker.js":
            rel = "/" + p.relative_to(PUBLIC).as_posix()
            out.append((rel, p))
    return out


def content_hash(b64: str, ext: str) -> str:
    return hashlib.sha256((b64 + ext).encode()).hexdigest()[:32]


def multipart(fields: dict, files: dict | None = None) -> tuple[bytes, str]:
    """fields: 文本字段；files: {表单名: (文件名, bytes, Content-Type)}"""
    boundary = uuid.uuid4().hex
    buf = b""
    for name, value in fields.items():
        buf += f"--{boundary}\r\n".encode()
        buf += f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode()
        buf += value.encode() + b"\r\n"
    for name, (fname, content, ftype) in (files or {}).items():
        buf += f"--{boundary}\r\n".encode()
        buf += f'Content-Disposition: form-data; name="{name}"; filename="{fname}"\r\n'.encode()
        buf += f"Content-Type: {ftype}\r\n\r\n".encode()
        buf += content + b"\r\n"
    buf += f"--{boundary}--\r\n".encode()
    return buf, f"multipart/form-data; boundary={boundary}"


def validate_target(project=None):
    if REQUESTED_PROJECT != "jizhang" or PROJECT != "jizhang":
        raise SystemExit("生活记账只能发布到 jizhang，禁止通过 CF_PROJECT 改成其他项目（包括 jiaban）")
    if project is not None and (
        project.get("id") != PROJECT_ID
        or project.get("subdomain") != EXPECTED_HOST
        or EXPECTED_HOST not in (project.get("domains") or [])
    ):
        raise SystemExit("实际站点不是 jizhang-d9k.pages.dev（项目 ID 或域名不符），停止发布，未上传任何资源")


def resolve_project():
    """按永久项目 ID 找到正式站点（后台改名也能找到），返回其当前 API 名称与详情。"""
    projects = req(f"{BASE}/accounts/{ACCOUNT}/pages/projects")["result"] or []
    hits = [x for x in projects if x.get("id") == PROJECT_ID]
    if len(hits) != 1:
        raise SystemExit("账户中找不到生活记账正式站点（项目 ID 不存在），停止发布，未上传任何资源")
    project = req(f"{BASE}/accounts/{ACCOUNT}/pages/projects/{hits[0]['name']}")["result"]
    validate_target(project)
    return project["name"], project


def validate_release(public=PUBLIC):
    required = ["index.html", "static/manifest.json", "static/js/app.js", "static/css/style.css", "_worker.js"]
    if any(not (public / name).is_file() for name in required):
        raise SystemExit("生活记账发布资源不完整，停止发布")
    html = (public / "index.html").read_text(encoding="utf-8")
    manifest = json.loads((public / "static/manifest.json").read_text(encoding="utf-8"))
    if "<title>生活记账" not in html or manifest.get("name") != "生活记账":
        raise SystemExit("首页或桌面入口不是生活记账，停止发布")


def main():
    validate_target()
    validate_release()
    if not TOKEN or not ACCOUNT:
        raise SystemExit("请为生活记账配置 CF_TOKEN 和 CF_ACC；发布目标固定为 jizhang")
    api_name, project = resolve_project()
    if api_name != PROJECT:
        print(f"注意：Cloudflare 后台显示名为「{api_name}」，已按项目 ID 与域名确认是生活记账正式站点")
    files = collect_files()
    if not files:
        raise SystemExit("public/ 目录为空")
    print(f"待上传 {len(files)} 个文件")

    # 1. 取上传令牌
    jwt = req(f"{BASE}/accounts/{ACCOUNT}/pages/projects/{api_name}/upload-token")["result"]["jwt"]

    # 2. 计算内容哈希
    payloads, manifest = [], {}
    for site_path, local in files:
        b64 = base64.b64encode(local.read_bytes()).decode()
        ext = local.suffix.lstrip(".")
        key = content_hash(b64, ext)
        manifest[site_path] = key
        ctype = mimetypes.guess_type(local.name)[0] or "application/octet-stream"
        payloads.append({
            "key": key,
            "value": b64,
            "metadata": {"contentType": ctype},
            "base64": True,
        })

    # 3. 查询哪些还没上传过
    missing = req(f"{BASE}/pages/assets/check-missing", "POST",
                  {"hashes": list(manifest.values())}, token=jwt)["result"]
    todo = [p for p in payloads if p["key"] in set(missing)]
    print(f"需要上传 {len(todo)} 个（其余已存在）")

    # 4. 上传资源
    if todo:
        req(f"{BASE}/pages/assets/upload", "POST", todo, token=jwt)
        print("资源上传完成")

    # 5. 创建部署（附带 _worker.js 启用同步接口）
    extra_files = {}
    worker = PUBLIC / "_worker.js"
    if worker.exists():
        extra_files["_worker.js"] = ("_worker.js", worker.read_bytes(),
                                     "application/javascript+module")
        print("包含 _worker.js（云同步接口）")
    body, ctype = multipart({"manifest": json.dumps(manifest)}, extra_files)
    res = req(f"{BASE}/accounts/{ACCOUNT}/pages/projects/{api_name}/deployments",
              "POST", body, headers={"Content-Type": ctype}, raw=True)
    d = res["result"]
    print("部署成功")
    print("  预览地址:", d.get("url"))
    for domain in d.get("aliases") or []:
        print("  别名:", domain)


if __name__ == "__main__":
    sys.exit(main())
