"""Web server for the bookkeeping app (stdlib only, no Flask required)."""

import json
import mimetypes
import re
from datetime import date, datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import database as db

ROOT = Path(__file__).parent
PUBLIC = ROOT / "public"          # 网页文件（部署到 Cloudflare 的就是这个目录）
STATIC = PUBLIC / "static"

db.init_db()


def json_response(handler: BaseHTTPRequestHandler, data, status=200):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_body(handler: BaseHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length", 0))
    raw = handler.rfile.read(length) if length else b"{}"
    return json.loads(raw.decode("utf-8"))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)

        if path == "/":
            return self._serve_file(PUBLIC / "index.html", "text/html; charset=utf-8")

        if path == "/sw.js":  # Service Worker 必须从根路径提供，才能控制整站
            return self._serve_file(PUBLIC / "sw.js", "application/javascript; charset=utf-8")

        if path.startswith("/static/"):
            rel = path[len("/static/"):]
            file_path = STATIC / rel
            if file_path.is_file():
                ctype = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
                return self._serve_file(file_path, ctype)
            return self.send_error(404)

        if path == "/api/categories":
            record_type = qs.get("type", [None])[0]
            return json_response(self, db.get_categories(record_type))

        if path == "/api/records":
            year = int(qs["year"][0]) if "year" in qs else None
            month = int(qs["month"][0]) if "month" in qs else None
            record_type = qs.get("type", [None])[0]
            return json_response(self, db.get_records(year, month, record_type))

        if path == "/api/summary":
            year = int(qs.get("year", [date.today().year])[0])
            month = int(qs.get("month", [date.today().month])[0])
            return json_response(self, db.get_summary(year, month))

        if path == "/api/charts":
            year = int(qs.get("year", [date.today().year])[0])
            month = int(qs.get("month", [date.today().month])[0])
            return json_response(self, {
                "expense_breakdown": db.get_category_breakdown(year, month, "expense"),
                "income_breakdown": db.get_category_breakdown(year, month, "income"),
                "daily_trend": db.get_daily_trend(year, month),
                "monthly_trend": db.get_monthly_trend(year),
                "top_expenses": db.get_top_expenses(year, month),
            })

        self.send_error(404)

    def do_POST(self):
        if self.path == "/api/records":
            try:
                data = read_body(self)
                amount = float(str(data["amount"]).replace(",", ""))
                if amount <= 0:
                    raise ValueError("金额必须大于 0")
                record_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
                category_id = int(data["category_id"])
                record_type = data["type"]
                note = (data.get("note") or "").strip()
                if record_type not in ("income", "expense"):
                    raise ValueError("无效的类型")
                record_id = db.add_record(record_type, round(amount, 2), category_id, record_date, note)
                return json_response(self, {"ok": True, "id": record_id})
            except (KeyError, ValueError, TypeError) as exc:
                return json_response(self, {"ok": False, "error": str(exc)}, 400)
            except Exception:
                # 兜底返回 JSON 500，避免连接中断被客户端误判为“离线”
                return json_response(self, {"ok": False, "error": "服务器内部错误"}, 500)
        self.send_error(404)

    def do_DELETE(self):
        match = re.match(r"^/api/records/(\d+)$", self.path)
        if match:
            db.delete_record(int(match.group(1)))
            return json_response(self, {"ok": True})
        self.send_error(404)

    def _serve_file(self, file_path: Path, content_type: str):
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main(host="0.0.0.0", port=None):
    import os
    if port is None:
        port = int(os.environ.get("PORT", 5000))  # 云平台部署时自动使用平台分配的端口
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"生活记账已启动 → http://localhost:{port}")
    print("按 Ctrl+C 停止服务")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已停止")
        server.server_close()


if __name__ == "__main__":
    main()
