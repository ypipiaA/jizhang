// 分类图标（与本地分类一一对应；餐饮/交通/购物/娱乐已合并进“其他支出”）
const CATEGORY_ICONS = {
  "住房": "🏠", "其他支出": "📝",
  "工资": "💼", "奖金": "🎉", "其他收入": "💰",
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

// 根据单条记录选图标：优先渠道（自定义项目图标 / 抖音美团等），其次备注关键词，最后分类图标
function iconForRecord(categoryName, note, channel) {
  if (channel) {
    const item = itemByName(channel);
    if (item && item.icon) return `<span class="icon">${esc(item.icon)}</span>`;
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

/* ---------- 记账项目（平台）：用户在“设置 → 管理项目”里自行增删、排序、设置子选项 ----------
 * 存在 localStorage（jz_items = { list, at }），随云同步。全部归入“其他支出”。
 * 内置平台没设自定义图标时使用自绘图标。 */
const ITEM_CATEGORY = "其他支出";
const BUILTIN_IMG = { "美团": ICON_MEITUAN, "淘宝": ICON_TAOBAO, "京东": ICON_JD, "抖音": ICON_DOUYIN, "拼多多": ICON_PDD };
const DEFAULT_ITEMS = [
  { name: "餐饮", icon: "🍽️", subs: [] },
  { name: "美团", icon: "", subs: ["外卖", "团购"] },
  { name: "淘宝", icon: "", subs: ["外卖", "团购"] },
  { name: "京东", icon: "", subs: ["外卖", "团购"] },
  { name: "抖音", icon: "", subs: ["商城", "团购"] },
  { name: "拼多多", icon: "", subs: [] },
];
const LS_ITEMS = "jz_items";
let itemsCache = null;

function cleanItem(x) {
  if (!x || typeof x.name !== "string" || !x.name.trim()) return null;
  const subs = Array.isArray(x.subs) ? x.subs : [];
  return {
    name: x.name.trim().slice(0, 12),
    icon: typeof x.icon === "string" ? x.icon.trim().slice(0, 8) : "",
    subs: [...new Set(subs.map((v) => String(v).trim().slice(0, 8)).filter(Boolean))],
  };
}

function getItems() {
  if (itemsCache) return itemsCache;
  let list = null;
  try {
    const v = JSON.parse(localStorage.getItem(LS_ITEMS));
    if (v && Array.isArray(v.list)) list = v.list.map(cleanItem).filter(Boolean);
  } catch {}
  itemsCache = list || DEFAULT_ITEMS.map(cleanItem);
  return itemsCache;
}

function saveItems(list) {
  localStorage.setItem(LS_ITEMS, JSON.stringify({ list: list.map(cleanItem).filter(Boolean), at: new Date().toISOString() }));
  itemsCache = null;
  scheduleSync();
}

function itemByName(name) {
  return name ? getItems().find((x) => x.name === name) : undefined;
}

function itemIconHtml(item) {
  const img = !item.icon && BUILTIN_IMG[item.name];
  return img ? `<img class="icon-img" src="${img}" alt="">` : `<span class="icon">${esc(item.icon || "🏷️")}</span>`;
}

// 设了子选项的项目必须选子类型，返回错误文案或 null
function subRequiredError(type, channel, sub) {
  if (type !== "expense" || !channel) return null;
  const p = itemByName(channel);
  if (p && p.subs.length && !p.subs.includes(sub)) return `请先选择${p.name}的「${p.subs.join(" / ")}」`;
  return null;
}

// 金额：普通数字，保留两位小数
function parseAmount(str) {
  const n = parseFloat(String(str ?? "").trim());
  return isNaN(n) ? NaN : Math.round(n * 100) / 100;
}

// 一条记录在账单里的显示名：平台 + 子类型（如“美团·外卖”），无渠道则用分类名
function recLabel(r) {
  const base = r.channel || r.category_name || "";
  return r.sub ? `${base}·${r.sub}` : base;
}

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

let toastTimer = null;

// opts: { action: "撤销", onAction: fn, duration: ms }
function showToast(msg, opts = {}) {
  const el = $("#toast");
  clearTimeout(toastTimer);
  el.innerHTML = "";
  const span = document.createElement("span");
  span.textContent = msg;
  el.appendChild(span);
  if (opts.action && opts.onAction) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "toast-action";
    b.textContent = opts.action;
    b.addEventListener("click", () => {
      clearTimeout(toastTimer);
      el.classList.remove("show", "has-action");
      opts.onAction();
    });
    el.appendChild(b);
    el.classList.add("has-action");
  } else {
    el.classList.remove("has-action");
  }
  el.classList.add("show");
  toastTimer = setTimeout(() => el.classList.remove("show", "has-action"), opts.duration || 2200);
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
let dpTarget = "#recordDate"; // 选中日期写到哪个输入框

function renderDp() {
  $("#dpLabel").textContent = `${dpYear}年${dpMonth}月`;
  const sel = $(dpTarget).value;
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
      $(dpTarget).value = b.dataset.val;
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

function openDp(target) {
  clearTimeout(dpCloseTimer);
  dpTarget = typeof target === "string" ? target : "#recordDate";
  const [y, m] = ($(dpTarget).value || localDateStr()).split("-").map(Number);
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
  if ($("#edSheet").hidden) document.body.style.overflow = ""; // 编辑面板还开着就继续锁滚动
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
    if (!$("#itSheet").hidden) closePanel("it");
    if (!$("#rcSheet").hidden) closePanel("rc");
    if (!$("#edSheet").hidden && $("#dpSheet").hidden) closeEdit();
  });
  $("#ddMask").addEventListener("click", closeDayDetail);

  // 记账日期：默认今天；点击弹出自定义紧凑日历
  $("#recordDate").value = localDateStr();
  $("#recordDate").addEventListener("click", openDp);
  $("#dpMask").addEventListener("click", closeDp);
  $("#dpPrev").addEventListener("click", () => stepDpMonth(-1));
  $("#dpNext").addEventListener("click", () => stepDpMonth(1));
  $("#dpToday").addEventListener("click", () => {
    $(dpTarget).value = localDateStr();
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
  { id: 10, name: "其他收入", type: "income" },
];

// 已删除的旧分类 id → 兜底分类：1餐饮 2交通 3购物 4娱乐 → 其他支出(6)；9理财 → 其他收入(10)
const MERGED_TO_OTHER = { 1: 6, 2: 6, 3: 6, 4: 6, 9: 10 };

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
      const subErr = subRequiredError(d.type, (d.channel || "").trim(), (d.sub || "").trim());
      if (subErr) return { ok: false, error: subErr };
      const recs = dbAll();
      const id = recs.length ? Math.max(...recs.map((r) => r.id)) + 1 : 1;
      recs.push({
        id, type: d.type, amount, category_id: +d.category_id,
        record_date: d.date, note: (d.note || "").trim(),
        channel: (d.channel || "").trim(), // 渠道：抖音/美团/拼多多/餐饮
        sub: (d.sub || "").trim(),         // 子类型：外卖/团购/商城
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
    // 编辑账单：金额 / 日期 / 分类 / 平台 / 子类型 / 备注
    try {
      const d = JSON.parse(opts.body);
      const recs = dbAll();
      const rec = recs.find((r) => r.id === +del[1]);
      if (!rec) return { ok: false, error: "记录不存在" };
      if ("amount" in d) {
        const a = Math.round(parseFloat(d.amount) * 100) / 100;
        if (!(a > 0)) return { ok: false, error: "金额必须大于 0" };
        rec.amount = a;
      }
      if ("date" in d) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || "")) return { ok: false, error: "日期无效" };
        rec.record_date = d.date;
      }
      if ("category_id" in d) {
        const cat = catById(d.category_id);
        if (!cat || cat.type !== rec.type) return { ok: false, error: "分类无效" };
        rec.category_id = cat.id;
      }
      if ("channel" in d) rec.channel = String(d.channel || "").trim();
      if ("sub" in d) rec.sub = String(d.sub || "").trim();
      if ("note" in d) rec.note = String(d.note).trim();
      const subErr = subRequiredError(rec.type, rec.channel, rec.sub);
      if (subErr) return { ok: false, error: subErr }; // 未写盘，原记录不变
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
    const all = p.get("all") === "1"; // 跨月搜索：不限月份
    return dbAll()
      .filter((r) => (all || inMonth(r, y, m)) && (!t || r.type === t))
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
        sub: r.sub || "",
        category_name: catById(r.category_id)?.name || "未知",
      }));

    return { expense_breakdown, daily_trend, monthly_trend, top_expenses };
  }

  return { ok: false, error: "未知请求" };
}

/* ---------- 一次性迁移：从旧的 app.py 服务器把历史账单搬进本地 ---------- */
async function migrateFromServer() {
  if (localStorage.getItem(LS_RECORDS) !== null) return; // 已有本地数据，跳过
  if (window.CountsAndroid) { dbWrite([]); return; }
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
const LS_BUDGET = "jz_budget"; // { amount, at }：每月支出预算，amount=0 表示关闭

function getBudget() {
  try {
    const b = JSON.parse(localStorage.getItem(LS_BUDGET));
    return b && typeof b.amount === "number" ? b : null;
  } catch { return null; }
}

function setBudget(amount) {
  localStorage.setItem(LS_BUDGET, JSON.stringify({ amount, at: new Date().toISOString() }));
  scheduleSync();
}
const LS_TOMBSTONES = "jz_deleted";
const LS_RECUR = "jz_recurring"; // { list: [{ id, name, amount, day, category_id, start: "YYYY-MM" }], at }
const LS_THEME = "jz_theme";     // auto / light / dark（仅本机）
const LS_FOLDS = "jz_folds";     // 统计页卡片折叠状态（仅本机）

// 参与云同步的设置：[云端字段, 本地键, 校验]
const SYNCED_SETTINGS = [
  ["budget", LS_BUDGET, (v) => v && typeof v.amount === "number"],
  ["items", LS_ITEMS, (v) => v && Array.isArray(v.list)],
  ["recurring", LS_RECUR, (v) => v && Array.isArray(v.list)],
];

/* ---------- 固定账单：每月自动生成 ----------
 * 每笔自动账单的 uid 固定为 recur-<规则id>-<年月>，多台设备各自生成也只会合并成一条；
 * 用户删掉后 uid 进入删除墓碑，不会再补。 */
function getRecurring() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_RECUR));
    if (v && Array.isArray(v.list)) return v.list.filter((r) => r && r.id && r.amount > 0 && r.day >= 1);
  } catch {}
  return [];
}

function saveRecurring(list) {
  localStorage.setItem(LS_RECUR, JSON.stringify({ list, at: new Date().toISOString() }));
  scheduleSync();
}

function generateRecurring() {
  const rules = getRecurring();
  if (!rules.length) return 0;
  const recs = dbAll();
  const have = new Set(recs.map((r) => r.uid));
  const tombs = new Set(getTombstones());
  const todayStr = localDateStr();
  const now = new Date();
  let nextId = recs.length ? Math.max(...recs.map((r) => r.id)) + 1 : 1;
  let added = 0;
  for (const rule of rules) {
    let [y, m] = String(rule.start || todayStr.slice(0, 7)).split("-").map(Number);
    if (!y || !m) continue;
    // 最多补 24 个月，防止异常数据生成过多
    for (let guard = 0; guard < 24; guard++) {
      if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) break;
      const day = Math.min(rule.day, new Date(y, m, 0).getDate());
      const date = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const uid = `recur-${rule.id}-${y}${String(m).padStart(2, "0")}`;
      if (date <= todayStr && !have.has(uid) && !tombs.has(uid) && catById(rule.category_id)) {
        recs.push({
          id: nextId++, type: "expense", amount: rule.amount, category_id: rule.category_id,
          record_date: date, note: "每月固定", channel: rule.name, sub: "",
          created_at: new Date().toISOString(), uid,
        });
        have.add(uid);
        added++;
      }
      m++;
      if (m > 12) { m = 1; y++; }
    }
  }
  if (added) dbWrite(recs);
  return added;
}

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

    // 设置（预算 / 记账项目 / 固定账单）：每项两端取较新的一份
    const settingsOut = { ...((cloud && cloud.settings) || {}) };
    for (const [key, ls, valid] of SYNCED_SETTINGS) {
      let local = null;
      try { local = JSON.parse(localStorage.getItem(ls)); } catch {}
      if (local && !valid(local)) local = null;
      const remote = cloud && cloud.settings && cloud.settings[key];
      if (remote && valid(remote) && (!local || String(remote.at || "") > String(local.at || ""))) {
        local = remote;
        localStorage.setItem(ls, JSON.stringify(remote));
      }
      if (local) settingsOut[key] = local;
    }
    itemsCache = null;

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
        settings: settingsOut,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!put.ok) throw new Error("上传失败");

    if (!silent) showToast(`云同步完成 ✓ 共 ${merged.length} 条`);
    const added = generateRecurring(); // 另一台设备新增的固定账单规则，在本机补记
    if (added) scheduleSync();
    renderCategoryGrid();
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

function renderBudgetStatus() {
  const b = getBudget();
  const on = b && b.amount > 0;
  $("#budgetStatus").textContent = on
    ? `每月 ${fmt(b.amount)} · 支出卡片显示进度`
    : "未设置 · 设置后支出卡片显示进度";
  $("#btnBudget").textContent = on ? "修改" : "设置";
}

function openSettings() {
  clearTimeout(stCloseTimer);
  codeVisible = false; // 每次打开设置默认遮住同步码
  renderSyncStatus();
  renderBudgetStatus();
  renderItemsStatus();
  renderRecurStatus();
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
  $("#btnBudget").addEventListener("click", () => {
    const b = getBudget();
    const v = prompt("设置每月支出预算（元）\n填 0 或留空 = 关闭预算", b && b.amount > 0 ? b.amount : "");
    if (v === null) return;
    const n = v.trim() === "" ? 0 : Math.round(parseFloat(v) * 100) / 100;
    if (isNaN(n) || n < 0) return showToast("请输入有效金额");
    setBudget(n);
    renderBudgetStatus();
    loadSummary();
    showToast(n > 0 ? `预算已设为 ${fmt(n)} ✓` : "已关闭预算");
  });
  $("#stClose").addEventListener("click", closeSettings);
  $("#stMask").addEventListener("click", closeSettings);
}

/* ---------- 通用弹层（管理项目 / 固定账单） ---------- */
const panelTimers = {};

function openPanel(prefix) {
  clearTimeout(panelTimers[prefix]);
  const mask = $(`#${prefix}Mask`), sheet = $(`#${prefix}Sheet`);
  mask.hidden = false;
  sheet.hidden = false;
  void sheet.offsetHeight;
  mask.classList.add("show");
  sheet.classList.add("show");
  document.body.style.overflow = "hidden";
  sheet.focus();
}

function closePanel(prefix) {
  const mask = $(`#${prefix}Mask`), sheet = $(`#${prefix}Sheet`);
  mask.classList.remove("show");
  sheet.classList.remove("show");
  document.body.style.overflow = "";
  clearTimeout(panelTimers[prefix]);
  panelTimers[prefix] = setTimeout(() => { mask.hidden = true; sheet.hidden = true; }, 250);
}

/* ---------- 管理项目 ---------- */
let itEditing = -1; // 正在编辑的下标；-1 新增

function renderItemsStatus() {
  const n = getItems().length;
  $("#itemsStatus").textContent = `${n} 个项目 · 增删、排序、设置子选项`;
}

function renderItemList() {
  const items = getItems();
  const list = $("#itList");
  list.innerHTML = items.length ? items.map((it, i) => `
    <div class="mg-item">
      <div class="mg-icon">${itemIconHtml(it)}</div>
      <div class="mg-info">
        <div class="mg-name">${esc(it.name)}</div>
        <div class="mg-desc">${it.subs.length ? "必选：" + it.subs.map(esc).join(" / ") : "无子选项"}</div>
      </div>
      <div class="mg-ops">
        <button type="button" class="mg-op" data-act="up" data-i="${i}" aria-label="上移" ${i === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="mg-op" data-act="down" data-i="${i}" aria-label="下移" ${i === items.length - 1 ? "disabled" : ""}>↓</button>
        <button type="button" class="mg-op" data-act="edit" data-i="${i}" aria-label="编辑">✎</button>
        <button type="button" class="mg-op danger" data-act="del" data-i="${i}" aria-label="删除">×</button>
      </div>
    </div>`).join("") : '<p class="empty">还没有项目，点下面添加</p>';
  list.querySelectorAll(".mg-op").forEach((b) => {
    b.addEventListener("click", () => {
      const i = +b.dataset.i;
      const arr = getItems().map((x) => ({ ...x, subs: [...x.subs] }));
      if (b.dataset.act === "up" && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      else if (b.dataset.act === "down" && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
      else if (b.dataset.act === "edit") return openItemForm(i);
      else if (b.dataset.act === "del") {
        if (!confirm(`删除项目「${arr[i].name}」？已记的账单不受影响。`)) return;
        if (activePresetName === arr[i].name) { activePresetName = null; activeSub = null; }
        arr.splice(i, 1);
      } else return;
      saveItems(arr);
      afterItemsChanged();
    });
  });
}

function afterItemsChanged() {
  renderItemList();
  renderItemsStatus();
  renderCategoryGrid();
}

function openItemForm(i) {
  itEditing = i;
  const it = i >= 0 ? getItems()[i] : { name: "", icon: "", subs: [] };
  $("#itName").value = it.name;
  $("#itIcon").value = it.icon;
  $("#itSubs").value = it.subs.join(" ");
  $("#itForm").hidden = false;
  $("#itFoot").hidden = true;
  $("#itName").focus();
}

function closeItemForm() {
  $("#itForm").hidden = true;
  $("#itFoot").hidden = false;
}

function setupItems() {
  $("#btnItems").addEventListener("click", () => {
    closeSettings();
    closeItemForm();
    renderItemList();
    openPanel("it");
  });
  $("#itClose").addEventListener("click", () => closePanel("it"));
  $("#itMask").addEventListener("click", () => closePanel("it"));
  $("#itAdd").addEventListener("click", () => openItemForm(-1));
  $("#itCancel").addEventListener("click", closeItemForm);
  $("#itReset").addEventListener("click", () => {
    if (!confirm("恢复默认项目（餐饮、美团、淘宝、京东、抖音、拼多多）？自己添加的项目会被移除，已记账单不受影响。")) return;
    activePresetName = null;
    activeSub = null;
    saveItems(DEFAULT_ITEMS);
    afterItemsChanged();
    showToast("已恢复默认项目");
  });
  $("#itSave").addEventListener("click", () => {
    const name = $("#itName").value.trim();
    if (!name) return showToast("请填写项目名称");
    if (LOCAL_CATEGORIES.some((c) => c.name === name)) return showToast("不能与分类同名");
    const arr = getItems().map((x) => ({ ...x, subs: [...x.subs] }));
    if (arr.some((x, j) => x.name === name && j !== itEditing)) return showToast("已有同名项目");
    const subs = $("#itSubs").value.split(/[\s,，、/／]+/).map((v) => v.trim()).filter(Boolean);
    const item = cleanItem({ name, icon: $("#itIcon").value, subs });
    if (itEditing >= 0) {
      const old = arr[itEditing].name;
      arr[itEditing] = item;
      if (activePresetName === old) { activePresetName = null; activeSub = null; }
    } else arr.push(item);
    saveItems(arr);
    closeItemForm();
    afterItemsChanged();
    showToast(itEditing >= 0 ? "项目已更新 ✓" : "项目已添加 ✓");
  });
}

/* ---------- 固定账单管理 ---------- */
let rcEditing = null; // 规则 id；null 新增

function renderRecurStatus() {
  const list = getRecurring();
  $("#recurStatus").textContent = list.length
    ? `${list.length} 项 · 每月共 ${fmt(list.reduce((a, r) => a + r.amount, 0))}`
    : "房租、话费等每月自动记一笔";
}

function renderRecurList() {
  const rules = getRecurring();
  $("#rcList").innerHTML = rules.length ? rules.map((r) => `
    <div class="mg-item">
      <div class="mg-icon"><span class="icon">${iconForRecord(catById(r.category_id)?.name, r.name, "")}</span></div>
      <div class="mg-info">
        <div class="mg-name">${esc(r.name)} <span class="mg-amt">${fmt(r.amount)}</span></div>
        <div class="mg-desc">每月 ${r.day} 号 · ${esc(catById(r.category_id)?.name || "")}</div>
      </div>
      <div class="mg-ops">
        <button type="button" class="mg-op" data-act="edit" data-id="${esc(r.id)}" aria-label="编辑">✎</button>
        <button type="button" class="mg-op danger" data-act="del" data-id="${esc(r.id)}" aria-label="删除">×</button>
      </div>
    </div>`).join("") : '<p class="empty">还没有固定账单</p>';
  $("#rcList").querySelectorAll(".mg-op").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      if (b.dataset.act === "edit") return openRecurForm(id);
      const r = getRecurring().find((x) => x.id === id);
      if (!r || !confirm(`删除固定账单「${r.name}」？以后不再自动生成，已生成的账单保留。`)) return;
      saveRecurring(getRecurring().filter((x) => x.id !== id));
      renderRecurList();
      renderRecurStatus();
    });
  });
}

function openRecurForm(id) {
  rcEditing = id;
  const r = id ? getRecurring().find((x) => x.id === id) : null;
  $("#rcCat").innerHTML = LOCAL_CATEGORIES.filter((c) => c.type === "expense")
    .map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
  $("#rcName").value = r ? r.name : "";
  $("#rcAmount").value = r ? r.amount : "";
  $("#rcDay").value = r ? r.day : "";
  $("#rcCat").value = String(r ? r.category_id : findCategoryId("住房"));
  $("#rcForm").hidden = false;
  $("#rcFoot").hidden = true;
  $("#rcName").focus();
}

function closeRecurForm() {
  $("#rcForm").hidden = true;
  $("#rcFoot").hidden = false;
}

function setupRecurring() {
  $("#btnRecur").addEventListener("click", () => {
    closeSettings();
    closeRecurForm();
    renderRecurList();
    openPanel("rc");
  });
  $("#rcClose").addEventListener("click", () => closePanel("rc"));
  $("#rcMask").addEventListener("click", () => closePanel("rc"));
  $("#rcAdd").addEventListener("click", () => openRecurForm(null));
  $("#rcCancel").addEventListener("click", closeRecurForm);
  $("#rcSave").addEventListener("click", async () => {
    const name = $("#rcName").value.trim().slice(0, 12);
    const amount = Math.round(parseAmount($("#rcAmount").value) * 100) / 100;
    const day = Math.round(+$("#rcDay").value);
    const category_id = +$("#rcCat").value;
    if (!name) return showToast("请填写名称");
    if (!(amount > 0)) return showToast("请输入有效金额");
    if (!(day >= 1 && day <= 31)) return showToast("日期请填 1-31");
    if (!catById(category_id)) return showToast("请选择分类");
    const rules = getRecurring();
    if (rcEditing) {
      const r = rules.find((x) => x.id === rcEditing);
      if (r) Object.assign(r, { name, amount, day, category_id }); // 只影响以后生成的账单
    } else {
      rules.push({ id: newUid(), name, amount, day, category_id, start: localDateStr().slice(0, 7) });
    }
    saveRecurring(rules);
    closeRecurForm();
    renderRecurList();
    renderRecurStatus();
    const n = generateRecurring();
    if (n) { scheduleSync(); await refreshAll(); }
    showToast(n ? `已保存，本月已到期，自动记入 ${n} 笔` : "已保存 ✓ 到期后自动记账");
  });
}

/* ---------- 外观：跟随系统 / 浅色 / 深色 ---------- */
const darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function applyTheme() {
  const mode = localStorage.getItem(LS_THEME) || "auto";
  const dark = mode === "dark" || (mode === "auto" && !!(darkQuery && darkQuery.matches));
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#15171a" : "#ff6b4a");
  $$("#themeSeg .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.theme === mode));
  if (window.Chart) {
    Chart.defaults.color = cssVar("--text-muted");
    Chart.defaults.borderColor = cssVar("--border");
  }
  try { window.CountsAndroid && window.CountsAndroid.setDarkTheme && window.CountsAndroid.setDarkTheme(dark); } catch {}
}

function setupTheme() {
  applyTheme();
  $$("#themeSeg .seg-btn").forEach((b) => {
    b.addEventListener("click", () => {
      localStorage.setItem(LS_THEME, b.dataset.theme);
      applyTheme();
      if ($("#panel-charts").classList.contains("active")) loadCharts(); // 图表按新配色重画
    });
  });
  const onSys = () => {
    if ((localStorage.getItem(LS_THEME) || "auto") !== "auto") return;
    applyTheme();
    if ($("#panel-charts").classList.contains("active")) loadCharts();
  };
  if (darkQuery) {
    if (darkQuery.addEventListener) darkQuery.addEventListener("change", onSys);
    else if (darkQuery.addListener) darkQuery.addListener(onSys);
  }
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
      settings: Object.fromEntries(SYNCED_SETTINGS
        .map(([key, ls]) => { try { return [key, JSON.parse(localStorage.getItem(ls))]; } catch { return [key, null]; } })
        .filter(([, v]) => v)),
    };
    if (window.CountsAndroid) {
      // Android 的 WebView 不支持 blob 下载，交给系统“另存为”文件选择器。
      window.CountsAndroid.exportBackup(
        `记账备份-${localDateStr()}.json`, JSON.stringify(payload, null, 2));
      return;
    }
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
      if (data && data.settings) {
        for (const [key, ls, ok] of SYNCED_SETTINGS) {
          if (ok(data.settings[key])) localStorage.setItem(ls, JSON.stringify(data.settings[key]));
        }
        itemsCache = null;
        renderCategoryGrid();
      }
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

let activePresetName = null; // 当前选中的平台（美团/淘宝/京东/抖音/拼多多/餐饮）
let activeSub = null;        // 平台下的子类型（外卖/团购/商城）

// 快捷项：选中渠道，金额清零由用户输入；备注完全留给用户自己写
function applyPreset(item) {
  const catId = findCategoryId(ITEM_CATEGORY);
  if (!catId) return showToast("分类未找到");
  selectedCategoryId = catId;
  if (activePresetName !== item.name) activeSub = null; // 换平台就重选子类型
  activePresetName = item.name;
  $("#amount").value = ""; // 每次选择都从 0 开始，不保留上一次的数值
  renderCategoryGrid();
}

// 平台子类型行：美团/淘宝/京东 → 外卖/团购；抖音 → 商城/团购
function renderSubRow() {
  const row = $("#subRow");
  const item = itemByName(activePresetName);
  if (currentType !== "expense" || !item || !item.subs.length) {
    row.hidden = true;
    row.innerHTML = "";
    return;
  }
  row.hidden = false;
  row.classList.remove("need");
  row.innerHTML = `<span class="sub-label">${esc(item.name)}<em>必选</em></span>` + item.subs.map((sname) => `
    <button type="button" class="sub-btn${activeSub === sname ? " active" : ""}" data-sub="${esc(sname)}">${esc(sname)}</button>
  `).join("");
  row.querySelectorAll(".sub-btn").forEach((b) => {
    b.addEventListener("click", () => {
      activeSub = b.dataset.sub;
      row.classList.remove("need");
      row.querySelectorAll(".sub-btn").forEach((x) => x.classList.toggle("active", x === b));
    });
  });
}

function renderCategoryGrid() {
  const grid = $("#categoryGrid");
  const list = categories[currentType];
  const cells = [];

  // 常用消费捷径排在最前面
  const items = getItems();
  if (currentType === "expense") {
    items.forEach((item, i) => {
      cells.push(`
        <button type="button" class="cat-btn preset${activePresetName === item.name ? " active" : ""}" data-preset="${i}">
          ${itemIconHtml(item)}
          <span>${esc(item.name)}</span>
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
  renderSubRow();
  renderQuickRow();

  grid.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.preset !== undefined) {
        applyPreset(items[+btn.dataset.preset]);
        return;
      }
      selectedCategoryId = +btn.dataset.id;
      activePresetName = null;
      activeSub = null;
      $("#amount").value = ""; // 切换消费项目时金额归零
      grid.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSubRow();
    });
  });
}

/* ---------- 常用记录一键再记：近 90 天重复出现过的“项目·类型 备注”组合 ---------- */
function quickCombos() {
  const since = localDateStr(new Date(Date.now() - 90 * 864e5));
  const map = new Map();
  for (const r of dbAll()) {
    if (r.type !== "expense" || String(r.record_date) < since || String(r.uid || "").startsWith("recur-")) continue;
    const ch = r.channel || "";
    let sub = "";
    if (ch) {
      const it = itemByName(ch);
      if (!it) continue; // 已删除的项目不再推荐
      if (it.subs.length && !it.subs.includes(r.sub)) continue;
      if (it.subs.length) sub = r.sub; // 项目已取消子选项时不再带出旧子类型
    }
    if (!ch && !r.note) continue;
    const key = [ch, sub, r.note || "", ch ? "" : r.category_id].join("\u0001");
    const c = map.get(key) || { channel: ch, sub, note: r.note || "",
      category_id: ch ? null : r.category_id, n: 0, last: "" };
    c.n++;
    if (String(r.record_date) > c.last) c.last = String(r.record_date);
    map.set(key, c);
  }
  return [...map.values()].filter((c) => c.n >= 2)
    .sort((a, b) => b.n - a.n || b.last.localeCompare(a.last)).slice(0, 6);
}

function renderQuickRow() {
  const row = $("#quickRow");
  const list = currentType === "expense" ? quickCombos() : [];
  row.hidden = !list.length;
  if (!list.length) { row.innerHTML = ""; return; }
  row.innerHTML = '<span class="quick-label">常用</span>' + list.map((c, i) => {
    const base = c.channel ? (c.sub ? `${c.channel}·${c.sub}` : c.channel) : (catById(c.category_id)?.name || "");
    return `<button type="button" class="quick-chip" data-i="${i}">${esc(base)}${c.note ? ` <b>${esc(c.note)}</b>` : ""}</button>`;
  }).join("");
  row.querySelectorAll(".quick-chip").forEach((b) => {
    b.addEventListener("click", () => {
      const c = list[+b.dataset.i];
      activePresetName = c.channel || null;
      activeSub = c.sub || null;
      selectedCategoryId = c.channel ? findCategoryId(ITEM_CATEGORY) : c.category_id;
      $("#note").value = c.note;
      $("#amount").value = "";
      renderCategoryGrid();
      $("#amount").focus();
      showToast("已带出项目和备注，填金额即可");
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
  const cur = isCurrentMonth(y, m);
  $("#lblIncome").textContent = cur ? "本月收入" : `${m}月收入`;
  $("#lblExpense").textContent = cur ? "本月支出" : `${m}月支出`;
  $("#sumIncome").textContent = fmt(s.income);
  $("#sumExpense").textContent = fmt(s.expense);
  renderBudget(s.expense);
}

function renderBudget(expense) {
  const b = getBudget();
  const box = $("#budgetBox");
  if (!b || !(b.amount > 0)) { box.hidden = true; return; }
  box.hidden = false;
  const pct = expense / b.amount;
  $("#budgetFill").style.width = Math.min(100, pct * 100) + "%";
  box.classList.toggle("warn", pct >= 0.8 && pct <= 1);
  box.classList.toggle("over", pct > 1);
  $("#budgetText").textContent = pct > 1
    ? `预算 ${fmt(b.amount)} · 已超支 ${fmt(expense - b.amount)}`
    : `预算 ${fmt(b.amount)} · 剩余 ${fmt(b.amount - expense)}`;
}

let sortAsc = false; // 账单排序：false=最新在前（默认），true=最早在前
let filterTypeValue = ""; // 类型筛选："" 全部 / expense / income

async function loadRecords() {
  const g = ++gens.records;
  const y = getFilterYear(), m = getFilterMonth();
  const type = filterTypeValue;
  const q0 = ($("#billSearch").value || "").trim();
  const allMonths = $("#searchAll").checked && !!q0; // 勾选“搜索全部月份”且有关键词时跨月
  let url = `/api/records?year=${y}&month=${m}`;
  if (type) url += `&type=${type}`;
  if (allMonths) url += "&all=1";
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

  // 搜索：备注 / 平台 / 分类 / 金额
  const q = ($("#billSearch").value || "").trim().toLowerCase();
  if (q) {
    records = records.filter((r) =>
      [r.note, recLabel(r), r.category_name, String(r.amount)]
        .some((v) => String(v || "").toLowerCase().includes(q)));
  }

  const list = $("#recordList");
  let tIn = 0, tOut = 0;
  records.forEach((r) => { if (r.type === "income") tIn += r.amount; else tOut += r.amount; });
  $("#billSummary").textContent = records.length
    ? `共 ${records.length} 笔 · 支出 ${fmt(tOut)}${tIn ? ` · 收入 ${fmt(tIn)}` : ""}`
    : "";

  if (!records.length) {
    const filtered = q || chSel.value || filterTypeValue;
    list.innerHTML = `<p class="empty">${filtered ? "没有符合条件的账单" : "暂无记录，记一笔吧～"}</p>`;
    return;
  }

  // 按日期分组，每组带当天小计
  const groups = [];
  for (const r of records) {
    const last = groups[groups.length - 1];
    if (last && last.date === r.record_date) last.items.push(r);
    else groups.push({ date: r.record_date, items: [r] });
  }
  const rowHtml = (r) => `
    <div class="record-item editable" data-id="${r.id}" role="button" tabindex="0" title="点击编辑">
      <div class="record-icon ${r.type}">${iconForRecord(r.category_name, r.note, r.channel)}</div>
      <div class="record-info">
        <div class="name">${esc(recLabel(r))}</div>
        ${r.note ? `<div class="meta">${esc(r.note)}</div>` : ""}
      </div>
      <span class="record-amount ${r.type}">${r.type === "income" ? "+" : "-"}${fmt(r.amount).replace("¥", "")}</span>
      <button class="btn-delete" data-id="${r.id}" title="删除" aria-label="删除">×</button>
    </div>`;
  const todayStr = localDateStr();
  list.innerHTML = groups.map((g) => {
    const [yy, mm, dd] = g.date.split("-").map(Number);
    const wk = "日一二三四五六"[new Date(yy, mm - 1, dd).getDay()];
    const yp = allMonths && yy !== new Date().getFullYear() ? `${yy}年` : "";
    const out = g.items.filter((r) => r.type === "expense").reduce((a, r) => a + r.amount, 0);
    const inc = g.items.filter((r) => r.type === "income").reduce((a, r) => a + r.amount, 0);
    const tot = [out ? `支出 ${fmt(out)}` : "", inc ? `收入 ${fmt(inc)}` : ""].filter(Boolean).join("  ");
    return `<div class="day-head"><span>${yp}${mm}月${dd}日 周${wk}${g.date === todayStr ? " · 今天" : ""}</span><span>${tot}</span></div>`
      + g.items.map(rowHtml).join("");
  }).join("");

  list.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteWithUndo(btn.dataset.id);
    });
  });
  list.querySelectorAll(".record-item.editable").forEach((row) => {
    row.addEventListener("click", () => openEdit(row.dataset.id));
    row.addEventListener("keydown", (e) => { if (e.key === "Enter") openEdit(row.dataset.id); });
  });
}

/* ---------- 删除（可撤销） ---------- */
async function deleteWithUndo(id) {
  const rec = dbAll().find((r) => r.id === +id);
  if (!rec) return;
  await api(`/api/records/${id}`, { method: "DELETE" });
  refreshAll();
  showToast(`已删除 ${recLabel({ ...rec, category_name: catById(rec.category_id)?.name })} ${fmt(rec.amount)}`, {
    action: "撤销",
    duration: 5000,
    onAction: () => {
      // 原 uid 已写入删除墓碑（可能已同步到云端），恢复时换新 uid，避免被墓碑再次删掉
      const recs = dbAll();
      const nid = recs.length ? Math.max(...recs.map((r) => r.id)) + 1 : 1;
      recs.push({ ...rec, id: nid, uid: newUid(), updated_at: new Date().toISOString() });
      dbWrite(recs);
      scheduleSync();
      refreshAll();
      showToast("已恢复 ✓");
    },
  });
}

/* ---------- 编辑账单面板 ---------- */
let edId = null, edSub = null, edOpts = [], edCloseTimer = null;

function edItemOptions(rec) {
  const opts = [];
  if (rec.type === "expense") {
    getItems().forEach((p) => opts.push({ key: "p:" + p.name, label: p.name, channel: p.name, catName: ITEM_CATEGORY }));
  }
  LOCAL_CATEGORIES.filter((c) => c.type === rec.type)
    .forEach((c) => opts.push({ key: "c:" + c.id, label: c.name, channel: "", catName: c.name }));
  // 历史上用过、但现在已下架的平台（如“外卖”）：保留为可选项，避免编辑时被迫改掉
  if (rec.channel && !opts.some((o) => o.key === "p:" + rec.channel)) {
    opts.unshift({ key: "p:" + rec.channel, label: rec.channel, channel: rec.channel,
      catName: catById(rec.category_id)?.name || "其他支出" });
  }
  return opts;
}

function renderEdSubs() {
  const key = $("#edItem").value;
  const p = getItems().find((x) => "p:" + x.name === key);
  const wrap = $("#edSubWrap");
  if (!p || !p.subs.length) { wrap.hidden = true; edSub = null; return; }
  if (!p.subs.includes(edSub)) edSub = null;
  wrap.hidden = false;
  wrap.classList.remove("need");
  $("#edSubs").innerHTML = p.subs.map((n) =>
    `<button type="button" class="sub-btn${edSub === n ? " active" : ""}" data-sub="${esc(n)}">${esc(n)}</button>`).join("");
  $("#edSubs").querySelectorAll(".sub-btn").forEach((b) => {
    b.addEventListener("click", () => {
      edSub = b.dataset.sub;
      wrap.classList.remove("need");
      $("#edSubs").querySelectorAll(".sub-btn").forEach((x) => x.classList.toggle("active", x === b));
    });
  });
}

function openEdit(id) {
  const rec = dbAll().find((r) => r.id === +id);
  if (!rec) return;
  clearTimeout(edCloseTimer);
  edId = rec.id;
  edSub = rec.sub || null;
  edOpts = edItemOptions(rec);
  $("#edTitle").textContent = rec.type === "income" ? "编辑收入" : "编辑支出";
  $("#edAmount").value = rec.amount;
  $("#edDate").value = rec.record_date;
  $("#edNote").value = rec.note || "";
  $("#edItem").innerHTML = edOpts.map((o) => `<option value="${esc(o.key)}">${esc(o.label)}</option>`).join("");
  $("#edItem").value = rec.channel ? "p:" + rec.channel : "c:" + rec.category_id;
  renderEdSubs();
  $("#edMask").hidden = false;
  $("#edSheet").hidden = false;
  void $("#edSheet").offsetHeight;
  $("#edMask").classList.add("show");
  $("#edSheet").classList.add("show");
  document.body.style.overflow = "hidden";
  $("#edSheet").focus();
}

function closeEdit() {
  $("#edMask").classList.remove("show");
  $("#edSheet").classList.remove("show");
  document.body.style.overflow = "";
  clearTimeout(edCloseTimer);
  edCloseTimer = setTimeout(() => {
    $("#edMask").hidden = true;
    $("#edSheet").hidden = true;
  }, 250);
}

async function saveEdit() {
  const opt = edOpts.find((o) => o.key === $("#edItem").value);
  if (!opt) return showToast("请选择项目");
  const amount = parseAmount($("#edAmount").value);
  if (!(amount > 0)) return showToast("请输入有效金额");
  const rec = dbAll().find((r) => r.id === edId);
  if (!rec) return closeEdit();
  const err = subRequiredError(rec.type, opt.channel, edSub || "");
  if (err) {
    const wrap = $("#edSubWrap");
    wrap.classList.remove("need"); void wrap.offsetWidth; wrap.classList.add("need");
    return showToast(err);
  }
  const res = await api(`/api/records/${edId}`, {
    method: "PATCH",
    body: JSON.stringify({
      amount,
      date: $("#edDate").value,
      category_id: findCategoryId(opt.catName, rec.type),
      channel: opt.channel,
      sub: edSub || "",
      note: $("#edNote").value,
    }),
  });
  if (res && res.ok) {
    const [ny, nm] = $("#edDate").value.split("-").map(Number);
    closeEdit();
    showToast(ny === getFilterYear() && nm === getFilterMonth() ? "已保存修改 ✓" : `已保存，记录移到 ${ny}年${nm}月`);
    refreshAll();
  } else {
    showToast(res?.error || "保存失败");
  }
}

function setupEdit() {
  $("#edMask").addEventListener("click", closeEdit);
  $("#edCancel").addEventListener("click", closeEdit);
  $("#edItem").addEventListener("change", () => { edSub = null; renderEdSubs(); }); // 换平台必须重新选类型
  $("#edDate").addEventListener("click", () => openDp("#edDate"));
  $("#edSave").addEventListener("click", saveEdit);
  $("#edDelete").addEventListener("click", () => {
    const id = edId;
    closeEdit();
    deleteWithUndo(id);
  });
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    charts[key] = null;
  }
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}

/* ---------- 统计页卡片折叠（记住状态；默认收起趋势和年度图，减少滑动） ---------- */
const FOLD_DEFAULT = { pie: true, line: false, bar: false, top: true };

function getFolds() {
  try { return { ...FOLD_DEFAULT, ...(JSON.parse(localStorage.getItem(LS_FOLDS)) || {}) }; }
  catch { return { ...FOLD_DEFAULT }; }
}

function setupFolds() {
  const folds = getFolds();
  $$(".fold").forEach((card) => {
    const key = card.dataset.fold;
    const head = card.querySelector(".fold-head");
    const apply = (open) => {
      card.classList.toggle("closed", !open);
      head.setAttribute("aria-expanded", String(open));
    };
    apply(folds[key] !== false);
    head.addEventListener("click", () => {
      const open = card.classList.contains("closed");
      apply(open);
      const f = getFolds();
      f[key] = open;
      localStorage.setItem(LS_FOLDS, JSON.stringify(f));
      if (open && charts[key]) charts[key].resize(); // 收起时画布尺寸为 0，展开后重算
    });
  });
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
  // 周一为一周起点：1 号前补空格，让每一列对应固定星期
  const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const blanks = Array.from({ length: lead }, () => '<div class="dt-cell blank"></div>').join("");
  el.innerHTML = blanks + daily.map((d) => {
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
            <div class="name">${esc(recLabel(r))}</div>
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
      data: { labels: ["暂无数据"], datasets: [{ data: [1], backgroundColor: [cssVar("--border")] }] },
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
        borderColor: cssVar("--surface"),
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
                strokeStyle: cssVar("--surface"),
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
        c.fillStyle = cssVar("--text-muted");
        c.fillText("总支出", x, y - 14);
        c.font = "700 17px 'Noto Sans SC', sans-serif";
        c.fillStyle = cssVar("--expense");
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
      layout: { padding: { top: 18 } }, // 给柱顶金额留空间
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
    plugins: [{
      // 每根柱子顶部常驻显示金额，不用点击也能看到
      id: "barValueLabels",
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart;
        const narrow = chart.width < 480;
        c.save();
        c.textAlign = "center";
        c.textBaseline = "bottom";
        c.font = `600 ${narrow ? 9 : 11}px 'Noto Sans SC', sans-serif`;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          c.fillStyle = di === 0 ? cssVar("--income") : cssVar("--expense");
          meta.data.forEach((bar, i) => {
            const v = ds.data[i];
            if (!v) return; // 0 不标
            const text = narrow
              ? (v >= 10000 ? (v / 10000).toFixed(1) + "万" : Math.round(v).toLocaleString("zh-CN"))
              : Math.round(v).toLocaleString("zh-CN");
            c.fillText(text, bar.x, bar.y - 3);
          });
        });
        c.restore();
      },
    }],
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
          <div>${esc(recLabel(item))}${item.note ? " · " + esc(item.note) : ""}</div>
          <div class="top-date">${esc(item.record_date)}</div>
        </div>
      </div>
      <span class="amount">${fmt(item.amount)}</span>
    </li>
  `).join("");
}

async function refreshAll() {
  renderQuickRow();
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
      activeSub = null;
      $("#amount").value = ""; // 切换支出/收入时金额归零
      $$(".type-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCategoryGrid();
    });
  });


  $("#recordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseAmount($("#amount").value);
    if (!(amount > 0)) return showToast("请输入有效金额");
    if (!selectedCategoryId) return showToast("请选择分类"); // 离线冷启动分类可能为空
    const subErr = subRequiredError(currentType, activePresetName || "", activeSub || "");
    if (subErr) {
      const row = $("#subRow");
      row.classList.remove("need"); void row.offsetWidth; row.classList.add("need"); // 重新触发抖动
      row.scrollIntoView({ block: "center", behavior: "smooth" });
      return showToast(subErr);
    }

    const payload = {
      type: currentType,
      amount,
      category_id: selectedCategoryId,
      date: $("#recordDate").value,
      note: $("#note").value,
      channel: activePresetName || "", // 选了抖音/美团等渠道就记在账单上
      sub: activeSub || "",             // 平台子类型：外卖/团购/商城
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
      activeSub = null;
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
      if (!filterTypeValue) { $("#filterChannel").value = ""; $("#billSearch").value = ""; }
      loadRecords();
    });
  });
  $("#filterChannel").addEventListener("change", loadRecords);
  $("#billSearch").addEventListener("input", loadRecords);
  $("#searchAll").addEventListener("change", () => {
    $("#billSearch").placeholder = $("#searchAll").checked
      ? "搜索全部月份：备注 / 平台 / 金额" : "搜索本月账单：备注 / 平台 / 金额";
    loadRecords();
  });
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
  setupEdit();
  setupItems();
  setupRecurring();
  setupTheme();
  setupFolds();
  await migrateFromServer(); // 老版本 app.py 的数据一次性搬进本地
  {
    // 旧分类（餐饮/交通/购物/娱乐）的历史记录自动归并到“其他支出”
    const recs = dbAll();
    if (normalizeRecords(recs)) dbWrite(recs);
  }
  await loadCategories();
  const added = generateRecurring();
  if (added) { scheduleSync(); showToast(`已自动记入 ${added} 笔固定账单`); }
  await refreshAll();
  // 应用长时间挂在后台、跨天回来时补记固定账单
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    const n = generateRecurring();
    if (n) { scheduleSync(); refreshAll(); showToast(`已自动记入 ${n} 笔固定账单`); }
  });

  // 离线支持：注册 Service Worker 缓存页面外壳（数据本身就在本地，天然离线可用）
  if (!window.CountsAndroid && "serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  // 已设同步口令则启动时静默同步
  syncNow(true);
}

// 安卓返回键先收起弹层，再回到记账页；首页由系统返回桌面。
window.handleAndroidBack = function () {
  for (const [id, close] of [
    ["dpSheet", closeDp], ["ddSheet", closeDayDetail], ["edSheet", closeEdit],
    ["itSheet", () => closePanel("it")], ["rcSheet", () => closePanel("rc")],
    ["stSheet", closeSettings], ["mpSheet", closeSheet],
  ]) {
    if (!document.getElementById(id).hidden) { close(); return true; }
  }
  if (!$("#panel-add").classList.contains("active")) {
    $('.tab[data-tab="add"]').click();
    return true;
  }
  return false;
};

init();
