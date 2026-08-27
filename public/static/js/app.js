// 分类图标（与数据库分类一一对应；医疗/教育已合并进“其他支出”）
const CATEGORY_ICONS = {
  "餐饮": "🍽️", "交通": "🚌", "购物": "🛍️", "娱乐": "🎮",
  "住房": "🏠", "其他支出": "📝",
  "工资": "💼", "奖金": "🎉", "理财": "📈", "其他收入": "💰",
};

// 按备注关键词精细匹配图标，让账单里每笔消费都有对应的图标
const NOTE_ICONS = [
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

// 根据单条记录选图标：先看备注关键词，再退回分类图标
function iconForRecord(categoryName, note) {
  if (note) {
    for (const [kw, icon] of NOTE_ICONS) {
      if (note.includes(kw)) return icon;
    }
  }
  return CATEGORY_ICONS[categoryName] || "📌";
}

// 常用消费捷径：渲染在分类网格“餐饮”一行，点一下选中对应分类并填好备注（金额自己输）
const PRESET_ITEMS = [
  { name: "外卖", icon: "🛵", category: "餐饮" },
  { name: "打车", icon: "🚕", category: "交通" },
  { name: "超市", icon: "🛒", category: "购物" },
  { name: "电影", icon: "🎬", category: "娱乐" },
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
  $("#mpLabel").setAttribute("aria-expanded", "true");
  $("#mpSheet").focus();
}

function closeSheet() {
  $("#mpMask").classList.remove("show");
  $("#mpSheet").classList.remove("show");
  document.body.style.overflow = "";
  $("#mpLabel").setAttribute("aria-expanded", "false");
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    $("#mpMask").hidden = true;
    $("#mpSheet").hidden = true;
  }, 250);
  $("#mpLabel").focus(); // 焦点还给触发按钮
}

function initDateFilters() {
  renderPickerLabel();
  $("#mpPrev").addEventListener("click", () => stepMonth(-1));
  $("#mpNext").addEventListener("click", () => stepMonth(1));
  $("#mpLabel").addEventListener("click", openSheet);
  $("#mpMask").addEventListener("click", closeSheet);
  $("#mpYearPrev").addEventListener("click", () => { sheetYear = Math.max(minYear(), sheetYear - 1); renderSheet(); });
  $("#mpYearNext").addEventListener("click", () => { sheetYear = Math.min(maxYear(), sheetYear + 1); renderSheet(); });
  $("#mpToday").addEventListener("click", () => {
    const n = new Date();
    setFilter(n.getFullYear(), n.getMonth() + 1);
    closeSheet();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#mpSheet").hidden) closeSheet();
  });

  // 记账日期：默认今天
  $("#recordDate").value = localDateStr();

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
  { id: 1, name: "餐饮", type: "expense" },
  { id: 2, name: "交通", type: "expense" },
  { id: 3, name: "购物", type: "expense" },
  { id: 4, name: "娱乐", type: "expense" },
  { id: 5, name: "住房", type: "expense" },
  { id: 6, name: "其他支出", type: "expense" },
  { id: 7, name: "工资", type: "income" },
  { id: 8, name: "奖金", type: "income" },
  { id: 9, name: "理财", type: "income" },
  { id: 10, name: "其他收入", type: "income" },
];
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
  const u = new URL(url, location.origin);
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
        created_at: new Date().toISOString(),
      });
      dbWrite(recs);
      return { ok: true, id };
    } catch {
      return { ok: false, error: "保存失败，本地存储可能已满" };
    }
  }

  const del = path.match(/^\/api\/records\/(\d+)$/);
  if (del && method === "DELETE") {
    dbWrite(dbAll().filter((r) => r.id !== +del[1]));
    return { ok: true };
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
      const n = catById(r.category_id)?.name || "未知";
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

// 快捷项：选中对应分类并填好备注，金额清零由用户输入
function applyPreset(item) {
  const catId = findCategoryId(item.category);
  if (!catId) return showToast("分类未找到");
  selectedCategoryId = catId;
  activePresetName = item.name;
  $("#amount").value = ""; // 每次选择都从 0 开始，不保留上一次的数值
  $("#note").value = item.name;
  renderCategoryGrid();
}

function renderCategoryGrid() {
  const grid = $("#categoryGrid");
  const list = categories[currentType];
  const cells = [];

  list.forEach((cat) => {
    const active = cat.id === selectedCategoryId && !activePresetName;
    cells.push(`
      <button type="button" class="cat-btn${active ? " active" : ""}" data-id="${cat.id}" data-name="${esc(cat.name)}">
        <span class="icon">${CATEGORY_ICONS[cat.name] || "📌"}</span>
        <span>${esc(cat.name)}</span>
      </button>
    `);
    // 常用消费捷径紧跟“餐饮”排在同一行
    if (currentType === "expense" && cat.name === "餐饮") {
      PRESET_ITEMS.forEach((item, i) => {
        cells.push(`
          <button type="button" class="cat-btn preset${activePresetName === item.name ? " active" : ""}" data-preset="${i}">
            <span class="icon">${item.icon}</span>
            <span>${item.name}</span>
          </button>
        `);
      });
    }
  });
  grid.innerHTML = cells.join("");

  if (!selectedCategoryId && list.length) {
    selectedCategoryId = list[0].id;
    grid.querySelector(".cat-btn")?.classList.add("active");
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
      // 备注同步为当前选中的项目，不残留旧备注；“其他支出/其他收入”留空让用户自己写
      const n = btn.dataset.name;
      $("#note").value = n.startsWith("其他") ? "" : n;
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

async function loadRecords() {
  const g = ++gens.records;
  const y = getFilterYear(), m = getFilterMonth();
  const type = $("#filterType").value;
  let url = `/api/records?year=${y}&month=${m}`;
  if (type) url += `&type=${type}`;
  const records = await api(url);
  if (g !== gens.records) return;
  const list = $("#recordList");

  if (!records.length) {
    list.innerHTML = '<p class="empty">暂无记录，记一笔吧～</p>';
    return;
  }

  list.innerHTML = records.map((r) => {
    const isIncome = r.type === "income";
    const icon = iconForRecord(r.category_name, r.note);
    const prefix = isIncome ? "+" : "-";
    return `
      <div class="record-item">
        <div class="record-icon ${r.type}">${icon}</div>
        <div class="record-info">
          <div class="name">${esc(r.category_name)}</div>
          <div class="meta">${esc(r.record_date)}${r.note ? " · " + esc(r.note) : ""}</div>
        </div>
        <span class="record-amount ${r.type}">${prefix}${fmt(r.amount).replace("¥", "")}</span>
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
  renderMonthlyBar(data.monthly_trend);
  renderTopExpenses(data.top_expenses);
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
      cutout: "55%",
      plugins: {
        legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${fmt(ctx.raw)}`,
          },
        },
      },
    },
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
          <div>${esc(item.category_name)}${item.note ? " · " + esc(item.note) : ""}</div>
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
  $("#filterType").addEventListener("change", loadRecords);
}

async function init() {
  $("#greeting").textContent = getGreeting();
  initDateFilters();
  setupTabs();
  setupForm();
  setupFilters();
  setupBackup();
  await migrateFromServer(); // 老版本 app.py 的数据一次性搬进本地
  await loadCategories();
  await refreshAll();

  // 离线支持：注册 Service Worker 缓存页面外壳（数据本身就在本地，天然离线可用）
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

init();
