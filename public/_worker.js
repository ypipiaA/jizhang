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
