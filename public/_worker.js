/* Cloudflare Pages Worker：云同步接口
 * GET  /api/sync?k=<sha256(口令)> -> 返回该口令对应的账本 JSON（无则 null）
 * PUT  /api/sync?k=<sha256(口令)> -> 保存账本 JSON
 * 其余请求原样返回静态资源。
 * CORS 全开，让 github.io / 单文件版 / localhost 也能用同一个云端。
 */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/downloads/") && url.pathname.endsWith(".apk")) {
      const name = url.pathname.slice("/downloads/".length);
      const missing = () => new Response("安装包文件不存在，请确认已发布对应版本。", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
      if (!/^counts-\d+\.\d+\.\d+\.apk$/.test(name)) return missing();
      if (!["GET", "HEAD"].includes(request.method)) {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
      }
      // Verify the asset bytes: SPA fallback can return the homepage with HTTP 200,
      // even when a download-specific header has made its MIME type look like an APK.
      const assetHeaders = new Headers(request.headers);
      for (const header of ["Range", "If-None-Match", "If-Modified-Since", "Accept-Encoding"]) {
        assetHeaders.delete(header);
      }
      const asset = await env.ASSETS.fetch(new Request(request, { method: "GET", headers: assetHeaders }));
      if (!asset.ok) return missing();
      const bytes = await asset.arrayBuffer();
      const signature = new Uint8Array(bytes, 0, Math.min(4, bytes.byteLength));
      if (signature.length !== 4 || ![0x50, 0x4b, 0x03, 0x04].every((v, i) => signature[i] === v)) {
        return missing();
      }
      return new Response(request.method === "HEAD" ? null : bytes, {
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": `attachment; filename="${name}"`,
          "Content-Length": String(bytes.byteLength),
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    if (url.pathname === "/api/sync") {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: CORS });
      }
      const k = (url.searchParams.get("k") || "").toLowerCase();
      if (!/^[0-9a-f]{64}$/.test(k)) {
        return json({ ok: false, error: "无效的同步标识" }, 400);
      }
      const key = "sync:" + k;
      if (!env.SYNC_KV) {
        return json({ ok: false, error: "云端存储未配置（KV 未绑定）" }, 503);
      }

      if (request.method === "GET") {
        const v = await env.SYNC_KV.get(key);
        return new Response(v || "null", {
          headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
        });
      }

      if (request.method === "PUT") {
        const body = await request.text();
        if (body.length > 2_000_000) return json({ ok: false, error: "数据过大" }, 413);
        try {
          JSON.parse(body);
        } catch {
          return json({ ok: false, error: "格式错误" }, 400);
        }
        await env.SYNC_KV.put(key, body);
        return json({ ok: true });
      }

      return json({ ok: false, error: "方法不支持" }, 405);
    }
    return env.ASSETS.fetch(request);
  },
};
