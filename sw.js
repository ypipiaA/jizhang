/* 页面外壳离线缓存 Service Worker
 * 数据全部存在浏览器本地（localStorage），SW 只负责断网时能打开页面。
 * 策略：网络优先、成功即缓存——有网时永远加载最新代码，断网时回退缓存。
 */
const CACHE = "jizhang-v3";
const CORE = [
  "/",
  "/static/css/style.css",
  "/static/js/app.js",
  "/static/manifest.json",
  "/static/icon.svg",
];
// 跨域 CDN 资源单独预缓存（失败不阻断安装）
const CDN = [
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    for (const url of CDN) {
      await c.add(url).catch(() => {}); // CDN 不可达时不影响核心离线能力
    }
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") {
        const copy = res.clone();
        // 用 waitUntil 保证 SW 被回收前缓存写入完成
        e.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}));
      }
      return res;
    } catch {
      const hit = await caches.match(req);
      if (hit) return hit;
      if (req.mode === "navigate") {
        // 仅页面导航才兜底回首页缓存；脚本/样式绝不能拿 HTML 充数
        const home = await caches.match("/");
        if (home) return home;
      }
      return Response.error();
    }
  })());
});
