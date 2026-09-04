// 分类图标（与本地分类一一对应；餐饮/交通/购物/娱乐已合并进“其他支出”）
const CATEGORY_ICONS = {
  "住房": "🏠", "其他支出": "📝",
  "工资": "💼", "奖金": "🎉", "理财": "📈", "其他收入": "💰",
};

// 美团（黄袋鼠）/ 抖省省（粉底"抖"字）自绘图标，内嵌 SVG 不依赖网络
const SVG_MEITUAN = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><ellipse cx='21' cy='12' rx='6' ry='11' fill='#FFD100' transform='rotate(-18 21 12)'/><ellipse cx='45' cy='13' rx='5' ry='10' fill='#FFD100' transform='rotate(16 45 13)'/><path d='M32 9c14 0 22 12 22 26 0 15-10 23-22 23S10 50 10 35C10 21 18 9 32 9z' fill='#FFD100'/><ellipse cx='30' cy='45' rx='12' ry='10' fill='#FFF4B8'/><circle cx='25' cy='27' r='3.2' fill='#4a2c00'/><circle cx='38' cy='27' r='3.2' fill='#4a2c00'/><ellipse cx='31' cy='35' rx='6.5' ry='5' fill='#8a4b00'/></svg>`;
const SVG_DOUYIN = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect x='4' y='4' width='56' height='56' rx='15' fill='#fe3b5f'/><path d='M14 14l6 3M17 11l4 5' stroke='#fff' stroke-width='2.5' stroke-linecap='round'/><text x='33' y='45' font-size='31' font-weight='700' text-anchor='middle' fill='#fff' font-family='sans-serif'>抖</text></svg>`;
const SVG_PDD = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='pdd' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ff4141'/><stop offset='1' stop-color='#e8220f'/></linearGradient></defs><rect x='4' y='4' width='56' height='56' rx='15' fill='url(#pdd)'/><text x='32' y='45' font-size='31' font-weight='700' text-anchor='middle' fill='#fff' font-family='sans-serif'>拼</text></svg>`;
const SVG_TAOBAO = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='tb' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ff8f00'/><stop offset='1' stop-color='#ff5000'/></linearGradient></defs><rect x='4' y='4' width='56' height='56' rx='15' fill='url(#tb)'/><text x='32' y='45' font-size='31' font-weight='700' text-anchor='middle' fill='#fff' font-family='sans-serif'>淘</text></svg>`;
const SVG_JD = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='jd' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#f22a1d'/><stop offset='1' stop-color='#c81623'/></linearGradient></defs><rect x='4' y='4' width='56' height='56' rx='15' fill='url(#jd)'/><text x='32' y='45' font-size='31' font-weight='700' text-anchor='middle' fill='#fff' font-family='sans-serif'>京</text></svg>`;
const ICON_MEITUAN = "data:image/svg+xml," + encodeURIComponent(SVG_MEITUAN);
const ICON_DOUYIN = "data:image/svg+xml," + encodeURIComponent(SVG_DOUYIN);
const ICON_PDD = "data:image/svg+xml," + encodeURIComponent(SVG_PDD);
const ICON_TAOBAO = "data:image/svg+xml," + encodeURIComponent(SVG_TAOBAO);
const ICON_JD = "data:image/svg+xml," + encodeURIComponent(SVG_JD);
const IMG_MEITUAN = `<img class="icon-img" src="${ICON_MEITUAN}" alt="美团">`;
const IMG_DOUYIN = `<img class="icon-img" src="${ICON_DOUYIN}" alt="抖音">`;
const IMG_PDD = `<img class="icon-img" src="${ICON_PDD}" alt="拼多多">`;
const IMG_TAOBAO = `<img class="icon-img" src="${ICON_TAOBAO}" alt="淘宝">`;
const IMG_JD = `<img class="icon-img" src="${ICON_JD}" alt="京东">`;

// 按备注关键词精细匹配图标，让账单里每笔消费都有对应的图标
const NOTE_ICONS = [
  ["美团", IMG_MEITUAN], ["抖音", IMG_DOUYIN], ["抖省省", IMG_DOUYIN],
  ["拼多多", IMG_PDD], ["拼夕夕", IMG_PDD], ["淘宝", IMG_TAOBAO],
  ["京东", IMG_JD], ["餐饮", "🍽️"],
  ["外卖", "🛵"], ["早餐", "🥐"], ["午餐", "🍱"], ["晚餐", "🍲"], ["夜宵", "🌙"],
  ["奶茶", "🧋"], ["咖啡", "☕"], ["水果", "🍎"], ["零食", "🍿"], ["聚餐", "🍻"],
  ["打车", "🚕"], ["出租", "🚕"], ["地铁", "🚇"], ["公交", "🚌"], ["高铁", "🚄"],
  ["火车", "🚄"], ["机票", "✈️"], ["加油", "⛽"], ["停车", "🅿️"],
  ["超市", "🛒"], ["买菜", "🥬"], ["衣", "👕"], ["鞋", "👟"], ["化妆", "💄"],
  ["电影", "🎬"], ["游戏", "🎮"], ["健身", "💪"], ["旅游", "🏖️"], ["门票", "🎫"],
  ["房租", "🏠"], ["水电", "💡"], ["燃气", "🔥"], ["物业", "🏢"], ["网费", "📶"], ["话费", "📱"],
  ["药", "💊"], ["医院", "🏥"], ["体检", "🩺"],
  ["书", "📖"], ["课", "🎓"], ["文具", "✏️"],
  ["红包", "🧧"], ["礼", "🎁"], ["宠物", "🐾"],
];

// 根据单条记录选图标：优先渠道（抖音/美团等），其次备注关键词，最后分类图标
function iconForRecord(categoryName, note, channel) {
  if (channel) {
    for (const [kw, icon] of NOTE_ICONS) {
      if (channel.includes(kw)) return icon;
    }
  }
  if (note) {
    for (const [kw, icon] of NOTE_ICONS) {
      if (note.includes(kw)) return icon;
    }
  }
  return CATEGORY_ICONS[categoryName] || "📌";
}

// 常用消费捷径：渲染在分类网格最前面，点一下自动填好备注（金额自己输），归入“其他支出”
const PRESET_ITEMS = [
  { name: "餐饮", icon: "🍽️", category: "其他支出" },
  { name: "外卖", icon: "🛵", category: "其他支出" },
  { name: "美团", img: ICON_MEITUAN, category: "其他支出" },
  { name: "淘宝", img: ICON_TAOBAO, category: "其他支出" },
  { name: "京东", img: ICON_JD, category: "其他支出" },
  { name: "抖音", img: ICON_DOUYIN, category: "其他支出" },
  { name: "拼多多", img: ICON_PDD, category: "其他支出" },
];

const CHART_COLORS = [
  "#ff6b4a", "#ffa94d", "#ffd43b", "#69db7c", "#38d9a9",
  "#4dabf7", "#748ffc", "#da77f2", "#f783ac", "#868e96",
];

let currentType = "expense";
let selectedCategoryId = null;
let categories = { income: [], expense: [] };
let charts = {};

const today = new Date();
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 本地日期（避免 toISOString 的 UTC 偏移：北京时间早上 8 点前会得到昨天）
function localDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmt(n) {
  return "¥" + Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "夜深了，注意休息 🌙";
  if (h < 11) return "早上好，新的一天 ☀️";
  if (h < 14) return "中午好，记得吃饭 🍱";
  if (h < 18) return "下午好，加油 💪";
  return "晚上好，今天辛苦了 🌆";
}

// HTML 转义，防止备注/分类名中的特殊字符破坏或注入标记
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* ---------- 年月筛选器（胶囊 + 底部抽屉） ---------- */
// 用函数取当前年份，避免页面跨年后边界失效
const maxYear = () => new Date().getFullYear();
const minYear = () => maxYear() - 4;
const filter = { year: today.getFullYear(), month: today.getMonth() + 1 };
let sheetYear = filter.year; // 抽屉里正在浏览的年份

function getFilterYear() { return filter.year; }
function getFilterMonth() { return filter.month; }

function isCurrentMonth(y, m) {
  const n = new Date();
  return y === n.getFullYear() && m === n.getMonth() + 1;
}

function renderPickerLabel() {
  $("#mpLabel").textContent = `${filter.year}年${filter.month}月`;
  $("#mpPrev").disabled = filter.year === minYear() && filter.month === 1;
  $("#mpNext").disabled = filter.year === maxYear() && filter.month === 12;
}

function setFilter(y, m) {
  if (y < minYear() || y > maxYear()) return;
  if (filter.year === y && filter.month === m) return;
  filter.year = y;
  filter.month = m;
  renderPickerLabel();
  refreshAll();
}

function stepMonth(delta) {
  let y = filter.year;
  let m = filter.month + delta;
  if (m < 1) { m = 12; y--; }
  if (m > 12) { m = 1; y++; }
  setFilter(y, m);
}

function renderSheet() {
  $("#mpYearLabel").textContent = sheetYear + "年";
  $("#mpYearPrev").disabled = sheetYear <= minYear();
  $("#mpYearNext").disabled = sheetYear >= maxYear();

  const grid = $("#mpMonthGrid");
  grid.innerHTML = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const active = sheetYear === filter.year && m === filter.month;
    const isNow = isCurrentMonth(sheetYear, m);
    return `<button type="button" class="mp-month${active ? " active" : ""}${isNow ? " now" : ""}" data-month="${m}">${m}月</button>`;
  }).join("");

  grid.querySelectorAll(".mp-month").forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(sheetYear, +btn.dataset.month);
      closeSheet();
    });
  });
}

let closeTimer = null;

function openSheet() {
  clearTimeout(closeTimer); // 取消未完成的关闭动画，避免刚打开又被隐藏
  sheetYear = filter.year;
  renderSheet();
  $("#mpMask").hidden = false;
  $("#mpSheet").hidden = false;
  void $("#mpSheet").offsetHeight; // 强制回流，确保过渡动画生效
  $("#mpMask").classList.add("show");
  $("#mpSheet").classList.add("show");
  document.body.style.overflow = "hidden"; // 锁定背景滚动
  $("#mpSheet").focus();
}

function closeSheet() {
  $("#mpMask").classList.remove("show");
  $("#mpSheet").classList.remove("show");
  document.body.style.overflow = "";
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    $("#mpMask").hidden = true;
    $("#mpSheet").hidden = true;
  }, 250);
}

/* ---------- 自定义记账日期选择器（紧凑日历，替代系统日历弹窗） ---------- */
let dpYear, dpMonth, dpCloseTimer = null;

function renderDp() {
  $("#dpLabel").textContent = `${dpYear}年${dpMonth}月`;
  const sel = $("#recordDate").value;
  const todayStr = localDateStr();
  const firstWeekday = new Date(dpYear, dpMonth - 1, 1).getDay(); // 0=周日
  const days = new Date(dpYear, dpMonth, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push('<span class="dp-cell blank"></span>');
  for (let d = 1; d <= days; d++) {
    const val = `${dpYear}-${String(dpMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const cls = ["dp-cell"];
    if (val === sel) cls.push("active");
    else if (val === todayStr) cls.push("now");
    cells.push(`<button type="button" class="${cls.join(" ")}" data-val="${val}">${d}</button>`);
  }
  const grid = $("#dpGrid");
  grid.innerHTML = cells.join("");
  grid.querySelectorAll("button.dp-cell").forEach((b) => {
    b.addEventListener("click", () => {
      $("#recordDate").value = b.dataset.val;
      closeDp();
    });
  });
}

function stepDpMonth(delta) {
  dpMonth += delta;
  if (dpMonth < 1) { dpMonth = 12; dpYear--; }
  if (dpMonth > 12) { dpMonth = 1; dpYear++; }
  renderDp();
}

function openDp() {
  clearTimeout(dpCloseTimer);
  const [y, m] = ($("#recordDate").value || localDateStr()).split("-").map(Number);
  dpYear = y;
  dpMonth = m;
  renderDp();
  $("#dpMask").hidden = false;
  $("#dpSheet").hidden = false;
  void $("#dpSheet").offsetHeight;
  $("#dpMask").classList.add("show");
  $("#dpSheet").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDp() {
  $("#dpMask").classList.remove("show");
  $("#dpSheet").classList.remove("show");
  document.body.style.overflow = "";
  clearTimeout(dpCloseTimer);
  dpCloseTimer = setTimeout(() => {
    $("#dpMask").hidden = true;
    $("#dpSheet").hidden = true;
  }, 250);
}

function initDateFilters() {
  renderPickerLabel();
  $("#mpPrev").addEventListener("click", () => stepMonth(-1));
  $("#mpNext").addEventListener("click", () => stepMonth(1));
  $("#mpLabel").addEventListener("click", openSheet); // 点年月文字弹出全部月份
  $("#mpMask").addEventListener("click", closeSheet);
  $("#mpYearPrev").addEventListener("click", () => { sheetYear = Math.max(minYear(), sheetYear - 1); renderSheet(); });
  $("#mpYearNext").addEventListener("click", () => { sheetYear = Math.min(maxYear(), sheetYear + 1); renderSheet(); });
  $("#mpToday").addEventListener("click", () => {
    const n = new Date();
    setFilter(n.getFullYear(), n.getMonth() + 1);
    closeSheet();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#mpSheet").hidden) closeSheet();
    if (!$("#dpSheet").hidden) closeDp();
    if (!$("#ddSheet").hidden) closeDayDetail();
    if (!$("#stSheet").hidden) closeSettings();
  });
  $("#ddMask").addEventListener("click", closeDayDetail);

  // 记账日期：默认今天；点击弹出自定义紧凑日历
  $("#recordDate").value = localDateStr();
  $("#recordDate").addEventListener("click", openDp);
  $("#dpMask").addEventListener("click", closeDp);
  $("#dpPrev").addEventListener("click", () => stepDpMonth(-1));
  $("#dpNext").addEventListener("click", () => stepDpMonth(1));
  $("#dpToday").addEventListener("click", () => {
    $("#recordDate").value = localDateStr();
    closeDp();
  });

  // 跨天检测：页面挂过夜后回到前台时，刷新“今天”相关状态
  let lastKnownToday = localDateStr();
  const onDayChange = () => {
    const nowStr = localDateStr();
    if (nowStr === lastKnownToday) return;
    if ($("#recordDate").value === lastKnownToday) {
      $("#recordDate").value = nowStr; // 用户没改过日期，自动跟随到新的“今天”
    }
    lastKnownToday = nowStr;
    renderPickerLabel();
    if (!$("#mpSheet").hidden) renderSheet();
  };
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) onDayChange();
  });
  window.addEventListener("focus", onDayChange);
}

/* ==================== 本地数据层 ====================
 * 全部数据存在浏览器 localStorage，无需任何服务器。
 * api(url, opts) 保持原签名，内部直接读写本地数据。
 */
const LOCAL_CATEGORIES = [
  { id: 5, name: "住房", type: "expense" },
  { id: 6, name: "其他支出", type: "expense" },
  { id: 7, name: "工资", type: "income" },
  { id: 8, name: "奖金", type: "income" },
  { id: 9, name: "理财", type: "income" },
  { id: 10, name: "其他收入", type: "income" },
];

// 已删除的旧分类 id → 其他支出（1餐饮 2交通 3购物 4娱乐），历史记录自动归并
const MERGED_TO_OTHER = { 1: 6, 2: 6, 3: 6, 4: 6 };

function normalizeRecords(recs) {
  let changed = false;
  for (const r of recs) {
    if (MERGED_TO_OTHER[r.category_id]) {
      r.category_id = MERGED_TO_OTHER[r.category_id];
      changed = true;
    }
  }
  return changed;
}
const LS_RECORDS = "jz_records";

function dbAll() {
  try {
    const r = JSON.parse(localStorage.getItem(LS_RECORDS));
    return Array.isArray(r) ? r : [];
  } catch { return []; }
}

function dbWrite(recs) {
  localStorage.setItem(LS_RECORDS, JSON.stringify(recs));
}

function catById(id) {
  return LOCAL_CATEGORIES.find((c) => c.id === +id);
}

function inMonth(r, y, m) {
  const [ry, rm] = String(r.record_date).split("-").map(Number);
  return ry === y && rm === m;
}

async function api(url, opts = {}) {
  // 固定的虚拟 base：兼容 file:// 直接打开（此时 location.origin 是 "null"）
  const u = new URL(url, "http://local");
  const p = u.searchParams;
  const path = u.pathname;
  const method = (opts.method || "GET").toUpperCase();

  if (path === "/api/categories") {
    const t = p.get("type");
    return LOCAL_CATEGORIES.filter((c) => !t || c.type === t);
  }

  if (path === "/api/records" && method === "POST") {
    try {
      const d = JSON.parse(opts.body);
      const amount = Math.round(parseFloat(d.amount) * 100) / 100;
      if (!(amount > 0)) return { ok: false, error: "金额必须大于 0" };
      if (!catById(d.category_id)) return { ok: false, error: "请选择分类" };
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || "")) return { ok: false, error: "日期无效" };
      if (d.type !== "income" && d.type !== "expense") return { ok: false, error: "无效的类型" };
      const recs = dbAll();
      const id = recs.length ? Math.max(...recs.map((r) => r.id)) + 1 : 1;
      recs.push({
        id, type: d.type, amount, category_id: +d.category_id,
        record_date: d.date, note: (d.note || "").trim(),
        channel: (d.channel || "").trim(), // 渠道：抖音/美团/拼多多/外卖/餐饮
        created_at: new Date().toISOString(),
        uid: newUid(), // 全局唯一标识，跨设备合并用
      });
      dbWrite(recs);
      scheduleSync();
      return { ok: true, id };
    } catch {
      return { ok: false, error: "保存失败，本地存储可能已满" };
    }
  }

  const del = path.match(/^\/api\/records\/(\d+)$/);
  if (del && method === "DELETE") {
    const recs = dbAll();
    const gone = recs.find((r) => r.id === +del[1]);
    if (gone && gone.uid) addTombstone(gone.uid); // 记录删除墓碑，防止云端把它复活
    dbWrite(recs.filter((r) => r.id !== +del[1]));
    scheduleSync();
    return { ok: true };
  }

  if (del && method === "PATCH") {
    // 修改备注
    try {
      const d = JSON.parse(opts.body);
      const recs = dbAll();
      const rec = recs.find((r) => r.id === +del[1]);
      if (!rec) return { ok: false, error: "记录不存在" };
      if ("note" in d) rec.note = String(d.note).trim();
      rec.updated_at = new Date().toISOString(); // 冲突合并时新者胜
      dbWrite(recs);
      scheduleSync();
      return { ok: true };
    } catch {
      return { ok: false, error: "保存失败" };
    }
  }

  if (path === "/api/records") {
    const y = +p.get("year"), m = +p.get("month"), t = p.get("type");
    return dbAll()
      .filter((r) => inMonth(r, y, m) && (!t || r.type === t))
      .sort((a, b) => String(b.record_date).localeCompare(String(a.record_date)) || b.id - a.id)
      .map((r) => ({ ...r, category_name: catById(r.category_id)?.name || "未知" }));
  }

  if (path === "/api/summary") {
    const y = +p.get("year"), m = +p.get("month");
    let income = 0, expense = 0;
    for (const r of dbAll()) {
      if (!inMonth(r, y, m)) continue;
      if (r.type === "income") income += r.amount; else expense += r.amount;
    }
    return { income, expense, balance: income - expense };
  }

  if (path === "/api/charts") {
    const y = +p.get("year"), m = +p.get("month");
    const recs = dbAll();
    const monthRecs = recs.filter((r) => inMonth(r, y, m));

    const byCat = {};
    for (const r of monthRecs) {
      if (r.type !== "expense") continue;
      // 优先按渠道（抖音/美团/外卖等）细分，无渠道的按分类归组
      const n = r.channel || catById(r.category_id)?.name || "未知";
      byCat[n] = (byCat[n] || 0) + r.amount;
    }
    const expense_breakdown = Object.entries(byCat)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    const days = new Date(y, m, 0).getDate();
    const daily_trend = Array.from({ length: days }, (_, i) => ({ day: i + 1, income: 0, expense: 0 }));
    for (const r of monthRecs) {
      const di = +String(r.record_date).slice(8, 10) - 1;
      if (daily_trend[di]) daily_trend[di][r.type] += r.amount;
    }

    const monthly_trend = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
    for (const r of recs) {
      const [ry, rm] = String(r.record_date).split("-").map(Number);
      if (ry === y && monthly_trend[rm - 1]) monthly_trend[rm - 1][r.type] += r.amount;
    }

    const top_expenses = monthRecs
      .filter((r) => r.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((r) => ({
        amount: r.amount, note: r.note, record_date: r.record_date,
        channel: r.channel || "",
        category_name: catById(r.category_id)?.name || "未知",
      }));

    return { expense_breakdown, daily_trend, monthly_trend, top_expenses };
  }

  return { ok: false, error: "未知请求" };
}

/* ---------- 一次性迁移：从旧的 app.py 服务器把历史账单搬进本地 ---------- */
async function migrateFromServer() {
  if (localStorage.getItem(LS_RECORDS) !== null) return; // 已有本地数据，跳过
  try {
    const res = await fetch("/api/records");
    const old = await res.json();
    if (!Array.isArray(old) || !old.length) { dbWrite([]); return; }
    // 旧库分类 id 与本地不同，按名称重新映射
    const migrated = old.map((r, i) => {
      const cat = LOCAL_CATEGORIES.find((c) => c.name === r.category_name)
        || LOCAL_CATEGORIES.find((c) => c.type === r.type && c.name.startsWith("其他"));
      return {
        id: i + 1, type: r.type, amount: r.amount, category_id: cat.id,
        record_date: r.record_date, note: r.note || "",
        created_at: r.created_at || new Date().toISOString(),
      };
    });
    dbWrite(migrated);
    showToast(`已迁移 ${migrated.length} 条历史记录到本地 ✓`);
  } catch {
    dbWrite([]); // 服务器不在（纯静态部署），从空账本开始
  }
}

/* ==================== 云同步（Cloudflare KV） ====================
 * 口令 → SHA-256 → 云端存储键。两台设备输入相同口令即共享同一本账。
 * 合并规则：按 uid 取并集；同 uid 两端都有时取修改时间新的；删除靠墓碑传播。
 */
const SYNC_ENDPOINT = "https://jizhang-d9k.pages.dev/api/sync";
const LS_SYNC_PASS = "jz_sync_pass";
const LS_TOMBSTONES = "jz_deleted";

function newUid() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getTombstones() {
  try {
    const t = JSON.parse(localStorage.getItem(LS_TOMBSTONES));
    return Array.isArray(t) ? t : [];
  } catch { return []; }
}

function addTombstone(uid) {
  try {
    const t = getTombstones();
    if (!t.includes(uid)) {
      t.push(uid);
      localStorage.setItem(LS_TOMBSTONES, JSON.stringify(t));
    }
  } catch {}
}

// 老记录没有 uid：补上（只生成一次并落盘，保证跨设备稳定）
function ensureUids(recs) {
  let changed = false;
  for (const r of recs) {
    if (!r.uid) { r.uid = newUid(); changed = true; }
  }
  return changed;
}

function mtime(r) { return r.updated_at || r.created_at || ""; }

let syncTimer = null;
let syncing = false;

// 写库后 2 秒自动同步（已设口令时）
function scheduleSync() {
  if (!localStorage.getItem(LS_SYNC_PASS)) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncNow(true), 2000);
}

async function syncNow(silent) {
  const pass = localStorage.getItem(LS_SYNC_PASS);
  if (!pass || syncing) return;
  syncing = true;
  try {
    const k = await sha256Hex(pass);
    const local = dbAll();
    if (ensureUids(local)) dbWrite(local);

    // 1. 拉取云端
    const res = await fetch(`${SYNC_ENDPOINT}?k=${k}`);
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || "HTTP " + res.status);
    }
    const cloud = await res.json();
    const cloudRecs = cloud && Array.isArray(cloud.records) ? cloud.records : [];
    const cloudTombs = cloud && Array.isArray(cloud.tombstones) ? cloud.tombstones : [];

    // 2. 合并：墓碑并集 → 记录按 uid 并集（同 uid 取修改时间新的）→ 剔除已删除
    const tombs = [...new Set([...getTombstones(), ...cloudTombs])];
    const byUid = new Map();
    for (const r of [...cloudRecs, ...local]) {
      if (!r || !r.uid) continue;
      const prev = byUid.get(r.uid);
      if (!prev || mtime(r) > mtime(prev)) byUid.set(r.uid, r);
    }
    const merged = [...byUid.values()].filter((r) => !tombs.includes(r.uid));
    merged.sort((a, b) =>
      String(a.record_date).localeCompare(String(b.record_date)) ||
      String(a.created_at || "").localeCompare(String(b.created_at || "")));
    merged.forEach((r, i) => { r.id = i + 1; }); // 本地 id 重排保持唯一
    normalizeRecords(merged);

    // 3. 写回本地 + 推送云端
    dbWrite(merged);
    localStorage.setItem(LS_TOMBSTONES, JSON.stringify(tombs));
    const put = await fetch(`${SYNC_ENDPOINT}?k=${k}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        records: merged,
        tombstones: tombs,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!put.ok) throw new Error("上传失败");

    if (!silent) showToast(`云同步完成 ✓ 共 ${merged.length} 条`);
    refreshAll();
  } catch (e) {
    if (!silent) showToast("同步失败：" + (e.message || "网络不可达"));
  } finally {
    syncing = false;
  }
}

/* ---------- 设置弹层（云同步 / 备份） ---------- */
let stCloseTimer = null;

let codeVisible = false;

function renderSyncStatus() {
  const pass = localStorage.getItem(LS_SYNC_PASS);
  const on = !!pass;
  $("#syncStatus").textContent = on
    ? "已开启 · 记账后自动同步，回到前台自动拉取"
    : "未开启 · 电脑手机共享同一本账";
  $("#btnSync").textContent = on ? "☁ 立即同步" : "☁ 开启同步";
  $("#syncCodeRow").hidden = !on;
  if (on) {
    $("#syncCodeText").textContent = codeVisible ? pass : "•".repeat(Math.max(6, pass.length));
    $("#btnShowCode").textContent = codeVisible ? "隐藏" : "显示";
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 旧浏览器 / 非安全上下文兜底
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch {}
    ta.remove();
    return ok;
  }
}

function setupSyncCode() {
  $("#btnShowCode").addEventListener("click", () => {
    codeVisible = !codeVisible;
    renderSyncStatus();
  });
  $("#btnCopyCode").addEventListener("click", async () => {
    const pass = localStorage.getItem(LS_SYNC_PASS);
    if (!pass) return;
    showToast((await copyText(pass)) ? "同步码已复制 ✓" : "复制失败，请点“显示”手动抄写");
  });
  $("#btnChangeCode").addEventListener("click", async () => {
    const cur = localStorage.getItem(LS_SYNC_PASS) || "";
    const next = prompt(
      "输入新的同步码（至少 4 位）。\n" +
      "· 想接上另一台设备的账本：输入那台设备的同步码\n" +
      "· 本机数据会与该同步码下的云端数据合并，不会丢失", cur);
    if (next === null) return;
    const v = next.trim();
    if (v.length < 4) return showToast("同步码至少 4 个字符");
    if (v === cur) return;
    localStorage.setItem(LS_SYNC_PASS, v);
    codeVisible = false;
    renderSyncStatus();
    showToast("同步码已更换，正在合并…");
    await syncNow(false);
  });
}

function openSettings() {
  clearTimeout(stCloseTimer);
  codeVisible = false; // 每次打开设置默认遮住同步码
  renderSyncStatus();
  $("#stMask").hidden = false;
  $("#stSheet").hidden = false;
  void $("#stSheet").offsetHeight;
  $("#stMask").classList.add("show");
  $("#stSheet").classList.add("show");
  document.body.style.overflow = "hidden";
  $("#stSheet").focus();
}

function closeSettings() {
  $("#stMask").classList.remove("show");
  $("#stSheet").classList.remove("show");
  document.body.style.overflow = "";
  clearTimeout(stCloseTimer);
  stCloseTimer = setTimeout(() => {
    $("#stMask").hidden = true;
    $("#stSheet").hidden = true;
  }, 250);
}

function setupSettings() {
  $("#btnSettings").addEventListener("click", openSettings);
  $("#stClose").addEventListener("click", closeSettings);
  $("#stMask").addEventListener("click", closeSettings);
}

function setupSync() {
  $("#btnSync").addEventListener("click", async () => {
    let pass = localStorage.getItem(LS_SYNC_PASS);
    if (!pass) {
      pass = prompt(
        "首次使用云同步：设置一个同步口令（至少 4 位）。\n" +
        "在手机/电脑输入相同口令，即可自动共享同一本账。\n" +
        "口令请自己记好，不要用银行密码。");
      if (pass === null) return;
      pass = pass.trim();
      if (pass.length < 4) return showToast("口令至少 4 个字符");
      localStorage.setItem(LS_SYNC_PASS, pass);
      renderSyncStatus();
    }
    showToast("同步中…");
    await syncNow(false);
  });
  // 回到前台时静默同步一次，随时拉到另一台设备的新账
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncNow(true);
  });
}

/* ---------- 备份：导出 / 导入 JSON（数据在本机，换设备用这个搬家） ---------- */
function setupBackup() {
  $("#btnExport").addEventListener("click", () => {
    const payload = {
      app: "生活记账", version: 1,
      exported_at: new Date().toISOString(),
      records: dbAll(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `记账备份-${localDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("备份已导出 ✓");
  });

  $("#btnImport").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const recs = Array.isArray(data) ? data : data.records;
      if (!Array.isArray(recs)) throw new Error("bad");
      const valid = recs.filter((r) => r && r.id && r.record_date && r.amount > 0);
      normalizeRecords(valid); // 旧备份里的已删分类同样归并到“其他支出”
      if (!confirm(`备份包含 ${valid.length} 条记录，导入将替换当前全部数据，确定？`)) return;
      dbWrite(valid);
      showToast("导入成功 ✓");
      refreshAll();
    } catch {
      showToast("备份文件无效");
    }
  });
}

async function loadCategories() {
  const e = await api("/api/categories?type=expense");
  const i = await api("/api/categories?type=income");
  categories.expense = Array.isArray(e) ? e : [];
  categories.income = Array.isArray(i) ? i : [];
  renderCategoryGrid();
}

function findCategoryId(name, type = "expense") {
  const cat = categories[type].find((c) => c.name === name);
  return cat ? cat.id : categories[type][0]?.id;
}

let activePresetName = null; // 当前选中的快捷项（外卖/打车/超市/电影）

// 快捷项：选中渠道，金额清零由用户输入；备注完全留给用户自己写
function applyPreset(item) {
  const catId = findCategoryId(item.category);
  if (!catId) return showToast("分类未找到");
  selectedCategoryId = catId;
  activePresetName = item.name;
  $("#amount").value = ""; // 每次选择都从 0 开始，不保留上一次的数值
  renderCategoryGrid();
}

function renderCategoryGrid() {
  const grid = $("#categoryGrid");
  const list = categories[currentType];
  const cells = [];

  // 常用消费捷径排在最前面
  if (currentType === "expense") {
    PRESET_ITEMS.forEach((item, i) => {
      const iconHtml = item.img
        ? `<img class="icon-img" src="${item.img}" alt="">`
        : `<span class="icon">${item.icon}</span>`;
      cells.push(`
        <button type="button" class="cat-btn preset${activePresetName === item.name ? " active" : ""}" data-preset="${i}">
          ${iconHtml}
          <span>${item.name}</span>
        </button>
      `);
    });
  }
  list.forEach((cat) => {
    const active = cat.id === selectedCategoryId && !activePresetName;
    cells.push(`
      <button type="button" class="cat-btn${active ? " active" : ""}" data-id="${cat.id}" data-name="${esc(cat.name)}">
        <span class="icon">${CATEGORY_ICONS[cat.name] || "📌"}</span>
        <span>${esc(cat.name)}</span>
      </button>
    `);
  });
  grid.innerHTML = cells.join("");

  if (!selectedCategoryId && list.length) {
    // 默认选“其他支出/其他收入”这类兜底分类
    const other = list.find((c) => c.name.startsWith("其他"));
    selectedCategoryId = (other || list[0]).id;
    grid.querySelector(`.cat-btn[data-id="${selectedCategoryId}"]`)?.classList.add("active");
  }

  grid.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.preset !== undefined) {
        applyPreset(PRESET_ITEMS[+btn.dataset.preset]);
        return;
      }
      selectedCategoryId = +btn.dataset.id;
      activePresetName = null;
      $("#amount").value = ""; // 切换消费项目时金额归零
      grid.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

// 每类请求各自的代号：响应回来时若已过期（用户又切了月份）则丢弃，防止旧数据覆盖新数据
const gens = { summary: 0, records: 0, charts: 0 };

async function loadSummary() {
  const g = ++gens.summary;
  const y = getFilterYear(), m = getFilterMonth();
  const s = await api(`/api/summary?year=${y}&month=${m}`);
  if (g !== gens.summary) return;
  $("#sumIncome").textContent = fmt(s.income);
  $("#sumExpense").textContent = fmt(s.expense);
}

let sortAsc = false; // 账单排序：false=最新在前（默认），true=最早在前
let filterTypeValue = ""; // 类型筛选："" 全部 / expense / income

async function loadRecords() {
  const g = ++gens.records;
  const y = getFilterYear(), m = getFilterMonth();
  const type = filterTypeValue;
  let url = `/api/records?year=${y}&month=${m}`;
  if (type) url += `&type=${type}`;
  let records = await api(url);
  if (g !== gens.records) return;
  if (sortAsc) records.reverse(); // 接口默认日期倒序，反转即为正序

  // 平台筛选：下拉选项按当月实际出现的平台动态生成
  const chSel = $("#filterChannel");
  const labels = [...new Set(records.map((r) => r.channel || r.category_name))];
  const keep = chSel.value;
  chSel.innerHTML = '<option value="">全部平台</option>' +
    labels.map((l) => `<option value="${esc(l)}">${esc(l)}</option>`).join("");
  if (labels.includes(keep)) chSel.value = keep; // 保持当前选择
  if (chSel.value) records = records.filter((r) => (r.channel || r.category_name) === chSel.value);

  const list = $("#recordList");

  if (!records.length) {
    list.innerHTML = '<p class="empty">暂无记录，记一笔吧～</p>';
    return;
  }

  list.innerHTML = records.map((r) => {
    const isIncome = r.type === "income";
    const icon = iconForRecord(r.category_name, r.note, r.channel);
    // 选了渠道（抖音/美团等）就显示渠道名，不显示“其他支出”
    const label = r.channel || r.category_name;
    const prefix = isIncome ? "+" : "-";
    return `
      <div class="record-item">
        <div class="record-icon ${r.type}">${icon}</div>
        <div class="record-info">
          <div class="name">${esc(label)}</div>
          <div class="meta">${esc(r.record_date)}${r.note ? " · " + esc(r.note) : ""}</div>
        </div>
        <span class="record-amount ${r.type}">${prefix}${fmt(r.amount).replace("¥", "")}</span>
        <button class="btn-edit" data-id="${r.id}" data-note="${esc(r.note || "")}" title="编辑备注">✎</button>
        <button class="btn-delete" data-id="${r.id}" title="删除">×</button>
      </div>`;
  }).join("");

  list.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("确定删除这条记录？")) return;
      await api(`/api/records/${btn.dataset.id}`, { method: "DELETE" });
      showToast("已删除");
      refreshAll();
    });
  });

  list.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const next = prompt("修改备注", btn.dataset.note || "");
      if (next === null || next === btn.dataset.note) return;
      const res = await api(`/api/records/${btn.dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ note: next }),
      });
      if (res && res.ok) {
        showToast("备注已更新 ✓");
        refreshAll();
      } else {
        showToast(res?.error || "保存失败");
      }
    });
  });
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    charts[key] = null;
  }
}

async function loadCharts() {
  const g = ++gens.charts;
  const y = getFilterYear(), m = getFilterMonth();
  const data = await api(`/api/charts?year=${y}&month=${m}`);
  if (g !== gens.charts) return;

  renderExpensePie(data.expense_breakdown);
  renderDailyLine(data.daily_trend);
  renderDailyTotals(data.daily_trend);
  renderMonthlyBar(data.monthly_trend);
  renderTopExpenses(data.top_expenses);
}

// 每日消费总额：整月一屏看全，有消费的日子高亮，点击查看当天明细
function renderDailyTotals(daily) {
  const el = $("#dailyTotals");
  const y = getFilterYear(), m = getFilterMonth();
  el.innerHTML = daily.map((d) => {
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
    if (d.expense > 0) {
      return `
        <button type="button" class="dt-cell clickable" data-date="${dateStr}">
          <span class="dt-day">${d.day}日</span>
          <span class="dt-amt">${fmt(d.expense).replace("¥", "")}</span>
        </button>`;
    }
    return `
      <div class="dt-cell zero">
        <span class="dt-day">${d.day}日</span>
        <span class="dt-amt">—</span>
      </div>`;
  }).join("");

  el.querySelectorAll(".dt-cell.clickable").forEach((btn) => {
    btn.addEventListener("click", () => openDayDetail(btn.dataset.date));
  });
}

// 查看某平台的消费明细：切到账单页并按平台筛选
async function openPlatformDetail(name) {
  document.querySelector('.tab[data-tab="records"]').click();
  await loadRecords(); // 先生成平台选项
  const sel = $("#filterChannel");
  if ([...sel.options].some((o) => o.value === name)) {
    sel.value = name;
    await loadRecords();
  }
}

/* ---------- 当日消费明细弹层 ---------- */
let ddCloseTimer = null;

async function openDayDetail(dateStr) {
  clearTimeout(ddCloseTimer);
  const [y, m, d] = dateStr.split("-").map(Number);
  const records = (await api(`/api/records?year=${y}&month=${m}`)) || [];
  const dayRecs = records.filter((r) => r.record_date === dateStr && r.type === "expense");
  const total = dayRecs.reduce((s, r) => s + r.amount, 0);

  $("#ddTitle").textContent = `${m}月${d}日 消费明细`;
  $("#ddTotal").textContent = `共 ${dayRecs.length} 笔 · ${fmt(total)}`;
  $("#ddList").innerHTML = dayRecs.length
    ? dayRecs.map((r) => `
        <div class="record-item">
          <div class="record-icon expense">${iconForRecord(r.category_name, r.note, r.channel)}</div>
          <div class="record-info">
            <div class="name">${esc(r.channel || r.category_name)}</div>
            <div class="meta">${r.note ? esc(r.note) : ""}</div>
          </div>
          <span class="record-amount expense">-${fmt(r.amount).replace("¥", "")}</span>
        </div>`).join("")
    : '<p class="empty">当天没有消费记录</p>';

  $("#ddMask").hidden = false;
  $("#ddSheet").hidden = false;
  void $("#ddSheet").offsetHeight;
  $("#ddMask").classList.add("show");
  $("#ddSheet").classList.add("show");
  document.body.style.overflow = "hidden";
  $("#ddSheet").focus();
}

function closeDayDetail() {
  $("#ddMask").classList.remove("show");
  $("#ddSheet").classList.remove("show");
  document.body.style.overflow = "";
  clearTimeout(ddCloseTimer);
  ddCloseTimer = setTimeout(() => {
    $("#ddMask").hidden = true;
    $("#ddSheet").hidden = true;
  }, 250);
}

function renderExpensePie(breakdown) {
  destroyChart("pie");
  const ctx = $("#expensePieChart").getContext("2d");
  if (!breakdown.length) {
    charts.pie = new Chart(ctx, {
      type: "doughnut",
      data: { labels: ["暂无数据"], datasets: [{ data: [1], backgroundColor: ["#eee"] }] },
      options: { plugins: { legend: { display: false } } },
    });
    return;
  }
  const total = breakdown.reduce((s, d) => s + d.total, 0);
  charts.pie = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: breakdown.map((d) => d.name),
      datasets: [{
        data: breakdown.map((d) => d.total),
        backgroundColor: CHART_COLORS,
        borderWidth: 2,
        borderColor: "#fff",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "right",
          // 点图例 → 跳到账单页查看该平台的消费明细
          onClick: (e, item, legend) => {
            const name = legend.chart.data.labels[item.index];
            openPlatformDetail(name);
          },
          labels: {
            boxWidth: 10,
            font: { size: 11 },
            // 图例右侧直接带上各分类金额
            generateLabels(chart) {
              const ds = chart.data.datasets[0];
              return chart.data.labels.map((label, i) => ({
                text: `${label}  ${fmt(ds.data[i])}`,
                fillStyle: CHART_COLORS[i % CHART_COLORS.length],
                strokeStyle: "#fff",
                lineWidth: 2,
                index: i,
              }));
            },
          },
        },
        tooltip: { enabled: false }, // 点圆环不弹明细，中央只保留总支出
      },
    },
    plugins: [{
      // 圆环中央显示总支出金额
      id: "centerTotal",
      afterDraw(chart) {
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        c.save();
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "12px 'Noto Sans SC', sans-serif";
        c.fillStyle = "#8a8a8a";
        c.fillText("总支出", x, y - 14);
        c.font = "700 17px 'Noto Sans SC', sans-serif";
        c.fillStyle = "#e74c3c";
        c.fillText(fmt(total), x, y + 8);
        c.restore();
      },
    }],
  });
}

function renderDailyLine(daily) {
  destroyChart("line");
  const ctx = $("#dailyLineChart").getContext("2d");
  charts.line = new Chart(ctx, {
    type: "line",
    data: {
      labels: daily.map((d) => d.day + "日"),
      datasets: [{
        label: "支出",
        data: daily.map((d) => d.expense),
        borderColor: "#ff6b4a",
        backgroundColor: "rgba(255,107,74,0.1)",
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 10, font: { size: 10 } } },
        y: { beginAtZero: true, ticks: { font: { size: 10 } } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => ` 支出: ${fmt(ctx.raw)}` },
        },
      },
    },
  });
}

function renderMonthlyBar(monthly) {
  destroyChart("bar");
  const ctx = $("#monthlyBarChart").getContext("2d");
  charts.bar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: monthly.map((d) => d.month + "月"),
      datasets: [
        {
          label: "收入",
          data: monthly.map((d) => d.income),
          backgroundColor: "rgba(46,204,113,0.75)",
          borderRadius: 6,
        },
        {
          label: "支出",
          data: monthly.map((d) => d.expense),
          backgroundColor: "rgba(231,76,60,0.75)",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12 } },
        tooltip: {
          callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` },
        },
      },
    },
  });
}

function renderTopExpenses(top) {
  const el = $("#topExpenses");
  if (!top.length) {
    el.innerHTML = '<li class="empty">暂无数据</li>';
    return;
  }
  el.innerHTML = top.map((item, i) => `
    <li>
      <div class="info">
        <span class="rank">${i + 1}</span>
        <div>
          <div>${esc(item.channel || item.category_name)}${item.note ? " · " + esc(item.note) : ""}</div>
          <div style="font-size:12px;color:#8a8a8a">${esc(item.record_date)}</div>
        </div>
      </div>
      <span class="amount">${fmt(item.amount)}</span>
    </li>
  `).join("");
}

async function refreshAll() {
  await Promise.all([loadSummary(), loadRecords()]);
  const chartsPanel = $("#panel-charts");
  if (chartsPanel.classList.contains("active")) {
    await loadCharts();
  }
}

function setupTabs() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", async () => {
      $$(".tab").forEach((t) => t.classList.remove("active"));
      $$(".panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      $(`#panel-${tab.dataset.tab}`).classList.add("active");
      if (tab.dataset.tab === "charts") await loadCharts();
    });
  });
}

function setupForm() {
  $$(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentType = btn.dataset.type;
      selectedCategoryId = null;
      activePresetName = null;
      $("#amount").value = ""; // 切换支出/收入时金额归零
      $$(".type-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCategoryGrid();
    });
  });

  $("#recordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = +$("#amount").value;
    if (!amount || amount <= 0) return showToast("请输入有效金额");
    if (!selectedCategoryId) return showToast("请选择分类"); // 离线冷启动分类可能为空

    const payload = {
      type: currentType,
      amount,
      category_id: selectedCategoryId,
      date: $("#recordDate").value,
      note: $("#note").value,
      channel: activePresetName || "", // 选了抖音/美团等渠道就记在账单上
    };
    const res = await api("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const clearForm = () => {
      $("#amount").value = "";
      $("#note").value = "";
      activePresetName = null;
      renderCategoryGrid();
    };

    if (res && res.ok) {
      showToast("记录已保存 ✓");
      clearForm();
      refreshAll();
    } else {
      showToast(res.error || "保存失败");
    }
  });
}

function setupFilters() {
  // 类型筛选用按钮组：每次点击都是真实事件（下拉框重选同一项不会触发 change）
  $$("#typeSeg .seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterTypeValue = btn.dataset.type;
      $$("#typeSeg .seg-btn").forEach((b) => b.classList.toggle("active", b === btn));
      // 点“全部”= 清除所有筛选，左侧平台同步回“全部平台”
      if (!filterTypeValue) $("#filterChannel").value = "";
      loadRecords();
    });
  });
  $("#filterChannel").addEventListener("change", loadRecords);
  $("#btnSort").addEventListener("click", () => {
    sortAsc = !sortAsc;
    $("#btnSort").textContent = sortAsc ? "日期↑" : "日期↓";
    loadRecords();
  });
}

async function init() {
  $("#greeting").textContent = getGreeting();
  initDateFilters();
  setupTabs();
  setupForm();
  setupFilters();
  setupBackup();
  setupSync();
  setupSettings();
  setupSyncCode();
  await migrateFromServer(); // 老版本 app.py 的数据一次性搬进本地
  {
    // 旧分类（餐饮/交通/购物/娱乐）的历史记录自动归并到“其他支出”
    const recs = dbAll();
    if (normalizeRecords(recs)) dbWrite(recs);
  }
  await loadCategories();
  await refreshAll();

  // 离线支持：注册 Service Worker 缓存页面外壳（数据本身就在本地，天然离线可用）
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  // 已设同步口令则启动时静默同步
  syncNow(true);
}

init();
