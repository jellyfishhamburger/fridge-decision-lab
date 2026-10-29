/* ============================================================
   cook.js — 「拖食材进锅 → 推荐一道菜 → 真的扣库存」
   这一页不动 index.html 的任何一行；它只调用 logic.js 已有的
   FD.items / FD.decide / FD.consume / FD.saveItems / FD.log。

   三条边界（刻意守着）：
   1. 选中食材只是界面状态（sel:Set<cat>），不写任何存储；
   2. 只有按「开始做饭」才写库存，且只走 FD.saveItems 这唯一写入口；
   3. 这一页不启动 FD.sync.start()，所以云端一行都不会被改。
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ---------- 这一页自己的文案（挂进现有 i18n 表，不改 i18n.js） ---------- */
  Object.assign(I18N.STR.zh, {
    "cook.back": "冰箱",
    "cook.title": "今天的锅",
    "cook.myFridge": "我的冰箱",
    "cook.lede": "点一下食材，或者直接把它拖进锅里。",
    "cook.pot": "锅里",
    "cook.picked0": "还没放东西",
    "cook.pickedN": "已放 {n} 样",
    "cook.dropHint": "把食材拖进来",
    "cook.dropHere": "锅：把食材放进来",
    "cook.ask": "帮我做一道菜",
    "cook.empty": "冰箱还是空的。先载入一份示例，看看这个玩法长什么样。",
    "cook.demo": "载入示例",
    "cook.demoDone": "已载入示例库存",
    "cook.ready": "现在就能做",
    "cook.gap1": "差一样",
    "cook.gapN": "差 {n} 样",
    "cook.mins": "{n} 分钟",
    "cook.kcal": "{n} kcal",
    "cook.uses": "用掉",
    "cook.needBuy": "还差：{s}",
    "cook.needPantry": "柜里也没有：{s}",
    "cook.steps": "看做法",
    "cook.cook": "开始做饭",
    "cook.cookLocked": "食材不齐",
    "cook.noMatch": "这几样凑不出菜。换一样试试，或者多加一样。",
    "cook.none": "锅里还是空的 —— 先放点东西。",
    "cook.done": "用掉 {s}，库存已扣减",
    "cook.doneTitle": "做好了",
    "cook.again": "再选一锅",
    "cook.local": "库存存在这台设备 · 这个页面不往云端写",
    "cook.legOk": "还新鲜",
    "cook.legSoon": "3 天内到期",
    "cook.legNow": "今天到期",
    "cook.leftN": "剩 {n}",
    "cook.today": "今天到期",
    "cook.dayN": "{n} 天"
  });
  Object.assign(I18N.STR.en, {
    "cook.back": "Fridge",
    "cook.title": "Tonight's pot",
    "cook.myFridge": "My fridge",
    "cook.lede": "Tap an ingredient, or drag it straight into the pot.",
    "cook.pot": "In the pot",
    "cook.picked0": "Nothing yet",
    "cook.pickedN": "{n} in the pot",
    "cook.dropHint": "Drag something in",
    "cook.dropHere": "Pot: drop ingredients here",
    "cook.ask": "What can I cook?",
    "cook.empty": "The fridge is empty. Load the sample stock to see how this works.",
    "cook.demo": "Load sample",
    "cook.demoDone": "Sample stock loaded",
    "cook.ready": "Ready now",
    "cook.gap1": "One missing",
    "cook.gapN": "{n} missing",
    "cook.mins": "{n} min",
    "cook.kcal": "{n} kcal",
    "cook.uses": "Uses",
    "cook.needBuy": "Missing: {s}",
    "cook.needPantry": "Not in the cupboard: {s}",
    "cook.steps": "Steps",
    "cook.cook": "Start cooking",
    "cook.cookLocked": "Not enough ingredients",
    "cook.noMatch": "Nothing matches that selection. Swap one, or add another.",
    "cook.none": "The pot is empty — put something in first.",
    "cook.done": "Used {s}; stock updated",
    "cook.doneTitle": "Done",
    "cook.again": "Another pot",
    "cook.local": "Stock lives on this device · this page never writes to the cloud",
    "cook.legOk": "fresh",
    "cook.legSoon": "within 3 days",
    "cook.legNow": "due today",
    "cook.leftN": "{n} left",
    "cook.today": "today",
    "cook.dayN": "{n} d"
  });

  const t = (k, v) => I18N.t(k, v);
  const foodName = id => I18N.foodName(id);
  /* 调料不在地铁图里，也要出中文名（pantryById 是 logic.js 已经建好的表） */
  const pantryName = id => {
    const p = FD.pantryById[id];
    if (!p) return id;
    return I18N.getLang() === "en" ? (p.name || p.cn) : (p.cn || p.name);
  };
  const art = (id, cls) => COOK_ART.svg(id, cls);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 状态 ---------- */
  let items = [];              // 真实库存快照（FD.items()）
  const sel = new Set();       // 选中的 cat，纯界面状态
  let cooked = null;           // 刚做完的那道菜

  /* ---------- 库存 → 砖 ---------- */
  function grouped() {
    const map = new Map();     // cat -> {cat, qty, days, name, tag}
    items.forEach(it => {
      const days = FD.daysLeftOf(it);
      const qty = it.qty == null ? 1 : it.qty;
      const cur = map.get(it.cat);
      if (cur) { cur.qty += qty; cur.days = Math.min(cur.days, days); }
      else map.set(it.cat, { cat: it.cat, qty, days, name: it.name, tag: it.tag });
    });
    return [...map.values()].sort((a, b) => a.days - b.days || a.cat.localeCompare(b.cat));
  }

  const SHELVES = [
    { id: "protein", label: "蛋白 · protein", tags: ["protein"] },
    { id: "veg", label: "菜 · veg", tags: ["veg", "greens"] },
    { id: "carb", label: "主食 · others", tags: ["carb", "dairy", "other", ""] }
  ];

  function renderFridge() {
    items = FD.items();
    const shelves = $("#shelves");
    const empty = $("#empty");
    const list = grouped();
    empty.hidden = list.length > 0;
    shelves.innerHTML = "";
    if (!list.length) { renderPot(); return; }

    SHELVES.forEach(sh => {
      const row = document.createElement("div");
      row.className = "shelf";
      const inRow = list.filter(x => sh.tags.includes(x.tag) || (sh.id === "carb" && !SHELVES[0].tags.includes(x.tag) && !SHELVES[1].tags.includes(x.tag)));
      const lab = document.createElement("span");
      lab.className = "shelf-label"; lab.textContent = sh.label;
      row.appendChild(lab);
      if (!inRow.length) { row.style.minHeight = "26px"; }
      inRow.forEach(x => row.appendChild(tile(x)));
      shelves.appendChild(row);
    });
    renderPot();
  }

  function tile(x) {
    const b = document.createElement("button");
    b.className = "tile";
    b.type = "button";
    b.dataset.cat = x.cat;
    b.setAttribute("aria-pressed", sel.has(x.cat) ? "true" : "false");
    const urgent = x.days <= 1 ? "2" : x.days <= 3 ? "1" : "0";
    b.dataset.urgent = urgent;
    const dayTxt = x.days <= 0 ? t("cook.today") : t("cook.dayN", { n: x.days });
    b.title = `${foodName(x.cat)} · ${x.qty} · ${dayTxt}`;
    b.innerHTML = `
      <span class="exp" aria-hidden="true"></span>
      ${art(x.cat)}
      <span class="nm">${foodName(x.cat)}</span>
      <span class="qt">×${x.qty} · ${dayTxt}</span>`;
    b.addEventListener("click", () => {
      if (Date.now() - lastDragEnd < 400) return;      // 刚拖完，click 是残留事件，忽略
      toggle(x.cat, b);
    });
    attachDrag(b, x.cat);
    return b;
  }

  /* ---------- 选中 / 取消 ---------- */
  function toggle(cat, el, fromDrop) {
    if (sel.has(cat)) sel.delete(cat);
    else {
      sel.add(cat);
      if (!fromDrop) flyToPot(el, cat);
    }
    if (el) el.setAttribute("aria-pressed", sel.has(cat) ? "true" : "false");
    renderPot();
  }

  function renderPot() {
    const pot = $("#pot"), chips = $("#chips");
    chips.innerHTML = "";
    sel.forEach(cat => {
      const li = document.createElement("li");
      li.className = "chip";
      li.innerHTML = `${art(cat)}<span>${foodName(cat)}</span>
        <button type="button" aria-label="移除 ${foodName(cat)}">×</button>`;
      li.querySelector("button").addEventListener("click", () => {
        sel.delete(cat);
        const el = $(`.tile[data-cat="${cat}"]`); if (el) el.setAttribute("aria-pressed", "false");
        renderPot();
      });
      chips.appendChild(li);
    });
    pot.classList.toggle("has", sel.size > 0);
    pot.classList.toggle("warm", sel.size > 0);
    $("#potCount").textContent = sel.size ? t("cook.pickedN", { n: sel.size }) : t("cook.picked0");
    $("#askBtn").disabled = sel.size === 0;
    /* 这一页刻意不启动 sync.start()：无论在云端开着还是关着，它都只写本地 */
    $("#syncNote").textContent = t("cook.local");
  }

  /* ---------- 飞进锅：clone → WAAPI 弧线 ---------- */
  function flyToPot(el, cat) {
    if (reduce || !el) return bump();
    const from = el.getBoundingClientRect();
    const pot = $("#pot").getBoundingClientRect();
    const flyer = document.createElement("div");
    flyer.className = "flyer";
    flyer.innerHTML = art(cat);
    flyer.style.left = from.left + from.width / 2 - 27 + "px";
    flyer.style.top = from.top + from.height / 2 - 27 + "px";
    document.body.appendChild(flyer);
    const dx = (pot.left + pot.width / 2) - (from.left + from.width / 2);
    const dy = (pot.top + pot.height / 2) - (from.top + from.height / 2);
    const lift = Math.min(-90, dy / 2 - 40);
    const anim = flyer.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px,${lift}px) scale(1.15) rotate(-12deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${dx}px,${dy}px) scale(.35) rotate(8deg)`, opacity: .2 }
    ], { duration: 560, easing: "cubic-bezier(.3,.7,.2,1)" });
    anim.onfinish = () => { flyer.remove(); bump(); };
  }
  function bump() {
    const pot = $("#pot");
    pot.classList.remove("bump");
    void pot.offsetWidth;                 // 重启动画
    pot.classList.add("bump");
  }

  /* ---------- 拖拽 ----------
     鼠标：移动 10px 即视为拖拽。
     触摸：按住 170ms 再移动才拖（避免和「滚动页面」抢手势），松手即取消。
     拖完到锅里 → 选中；拖到别处 → 什么都不变（不会误选）。
     拖拽结束后的那次 click 会被 lastDragEnd 吃掉，所以不会出现
     「放进去又立刻被取消」的双触发。 */
  let lastDragEnd = 0;
  function attachDrag(el, cat) {
    const HOLD_MS = 170;      // 触摸：按住多久才开始算拖拽
    const MOVE_PX = 10;       // 移动多少像素算拖拽
    let pid = null, sx = 0, sy = 0, ghost = null, dragging = false, holdTimer = null, isTouch = false;

    const potEl = () => document.getElementById("pot");
    const overPot = (x, y) => {
      const r = potEl().getBoundingClientRect();
      const pad = 18;                                   // 锅的判定范围比可视区大一圈，手指抬起不会差几像素就落空
      return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    };

    function makeGhost(x, y) {
      const g = document.createElement("div");
      g.className = "flyer drag-ghost";
      g.innerHTML = art(cat);
      document.body.appendChild(g);
      moveGhost(g, x, y);
      return g;
    }
    function moveGhost(g, x, y) {
      g.style.left = (x - 27) + "px";
      g.style.top = (y - 27) + "px";
    }

    function startDrag(x, y) {
      if (dragging) return;
      dragging = true;
      el.classList.add("dragging");
      document.body.classList.add("is-dragging");
      ghost = makeGhost(x, y);
      potEl().classList.add("can-drop");
      if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
    }

    function finish(x, y, cancelled) {
      clearTimeout(holdTimer); holdTimer = null;
      potEl().classList.remove("can-drop", "over");
      document.body.classList.remove("is-dragging");
      if (ghost) { ghost.remove(); ghost = null; }
      el.classList.remove("dragging");
      if (dragging) {
        lastDragEnd = Date.now();
        if (!cancelled && overPot(x, y) && !sel.has(cat)) { toggle(cat, el, true); bump(); }
      }
      dragging = false;
      pid = null;
    }

    el.addEventListener("pointerdown", e => {
      if (e.button != null && e.button > 0) return;      // 只响应主键
      pid = e.pointerId;
      isTouch = e.pointerType === "touch";
      sx = e.clientX; sy = e.clientY;
      try { el.setPointerCapture(pid); } catch (err) {}
      if (isTouch) {                                     // 触摸：先按住，拖不动页面
        holdTimer = setTimeout(() => { if (pid === e.pointerId) startDrag(sx, sy); }, HOLD_MS);
      }
    });

    el.addEventListener("pointermove", e => {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!dragging) {
        if (Math.hypot(dx, dy) < MOVE_PX) return;
        if (isTouch) { clearTimeout(holdTimer); holdTimer = null; pid = null; return; } // 未按住就滑 → 让页面滚
        startDrag(sx, sy);
      }
      e.preventDefault();
      moveGhost(ghost, e.clientX, e.clientY);
      potEl().classList.toggle("over", overPot(e.clientX, e.clientY));
    }, { passive: false });

    el.addEventListener("pointerup", e => {
      if (e.pointerId !== pid) return;
      finish(e.clientX, e.clientY, false);
    });
    el.addEventListener("pointercancel", e => {
      if (e.pointerId !== pid) return;
      finish(e.clientX, e.clientY, true);
    });
    // 触摸时若提前松手但还没进入拖拽 → 当作点击（click 事件照常触发）
  }

  /* ---------- 推荐 ---------- */
  function pick() {
    if (!sel.size) { toast(t("cook.none")); return; }
    cooked = null;
    // 只为选中的 cat 造一份虚拟库存：每个 cat 取最先过期的那一件
    const byCat = {};
    items.forEach(it => {
      const d = FD.daysLeftOf(it);
      if (!byCat[it.cat] || d < FD.daysLeftOf(byCat[it.cat])) byCat[it.cat] = it;
    });
    const virtual = [...sel].map(c => byCat[c]).filter(Boolean);
    const st = FD.settings();
    const ranked = FD.decide(virtual, st)
      .filter(x => x.recipe.needs.some(n => sel.has(n)));
    const rank = x => (x.status === "ready" ? 0 : x.status === "shop1" ? 1 : 2);
    ranked.sort((a, b) => rank(a) - rank(b) || b.score - a.score);
    renderResult(ranked.slice(0, 3));
  }

  function renderResult(list) {
    const box = $("#result");
    box.innerHTML = "";
    if (!list.length) {
      box.innerHTML = `<div class="rcard note">${t("cook.noMatch")}</div>`;
      return;
    }
    list.forEach((r, i) => {
      const card = document.createElement("article");
      card.className = "rcard";
      card.style.animationDelay = i * 70 + "ms";
      const status = r.status === "ready" ? `<span class="ok">${t("cook.ready")}</span>`
        : r.status === "shop1" ? `<span class="gap">${t("cook.gap1")}</span>`
        : `<span class="gap">${t("cook.gapN", { n: r.missing.length })}</span>`;
      const needs = r.recipe.needs.map(id =>
        `<span>${art(id)}${foodName(id)}</span>`).join("");
      // 自己拼缺料，不用 FD.shoppingHint（它已经带「买」字，英文界面也不合适）
      const buy = r.missing.length
        ? r.missing.map(id => `${foodName(id)}${FD.byId[id] && FD.byId[id].shop ? "（" + FD.byId[id].shop + "）" : ""}`).join("、")
        : "";
      const pantry = r.pantryMissing.length
        ? `<p class="meta">${t("cook.needPantry", { s: r.pantryMissing.map(pantryName).join("、") })}</p>` : "";
      // 注意：这里拿到的是 evaluate() 的包裹对象，真正的菜谱在 r.recipe 上
      const steps = (I18N.recipeSteps(r.recipe) || [])
        .filter(s => s && !/^!\[/.test(s.trim()))
        .map((s, i) => {
          const act = COOK_STEPS.of(s, r.recipe.id + "#" + i);   // 人工校正优先，其次关键词
          return `<li data-act="${act.id}">
            <span class="n">${i + 1}</span>
            <span class="act" title="${I18N.getLang() === "en" ? act.en : act.zh}">${COOK_STEPS.svg(act.id)}</span>
            <span class="tx">${s}</span>
          </li>`;
        }).join("");
      card.innerHTML = `
        <h3>${I18N.recipeName(r.recipe)}</h3>
        <div class="meta">
          ${status}
          <span>${t("cook.mins", { n: r.recipe.minutes })}</span>
          <span>${t("cook.kcal", { n: r.recipe.kcal })}</span>
        </div>
        <div class="use">${needs}</div>
        ${buy ? `<p class="meta"><span class="gap">${t("cook.needBuy", { s: buy })}</span></p>` : ""}
        ${pantry}
        <details><summary>${t("cook.steps")}</summary><ol>${steps}</ol></details>
        <button class="cook" data-recipe="${r.recipe.id}" ${r.status === "ready" ? "" : "disabled"}>
          ${r.status === "ready" ? t("cook.cook") : t("cook.cookLocked")}
        </button>`;
      const btn = card.querySelector(".cook");
      btn.addEventListener("click", () => cook(r.recipe, btn));
      box.appendChild(card);
    });
  }

  /* ---------- 真正扣库存：唯一写入口 ---------- */
  function cook(recipe, btn) {
    const cur = FD.items();
    const res = FD.consume(cur, recipe);          // 纯函数，返回新数组
    if (!res.used.length) { toast(t("cook.cookLocked")); return; }
    FD.saveItems(res.items);                       // ← 生产环境这里会自动推 Supabase
    FD.log("take", recipe.id);                     // 决策信号，原有统计照用
    const names = res.used.map(u => `${foodName(u.cat)}${u.qty > 1 ? " ×" + u.qty : ""}`).join("、");
    cooked = { recipe, used: res.used, removed: res.removed };
    sel.clear();
    renderFridge();
    btn.disabled = true;
    btn.textContent = t("cook.doneTitle");
    $("#result").insertAdjacentHTML("afterbegin", `
      <article class="rcard" style="border-color:#C9DEC4;background:#F3F8F0">
        <h3>${t("cook.doneTitle")} · ${I18N.recipeName(recipe)}</h3>
        <p class="meta">${t("cook.done", { s: names })}</p>
        <button class="cook" id="againBtn" style="background:#7E9C82">${t("cook.again")}</button>
      </article>`);
    $("#againBtn").addEventListener("click", () => {
      $("#result").innerHTML = ""; window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    toast(t("cook.done", { s: names }));
  }

  /* ---------- 示例库存（与 index.html 的 demoBtn 同一套，写进同一份 localStorage） ---------- */
  function loadDemo() {
    const today = FD.localDate();
    const mk = (cat, days, qty) => {
      const f = FD.byId[cat];
      return {
        id: "demo-" + cat + "-" + Math.random().toString(36).slice(2, 7),
        cat, name: f.name, tag: f.tag, qty: qty || 1, unit: FD.unitOf(cat),
        daysLeft: days, life: days, addedAt: today
      };
    };
    FD.saveItems([mk("pork", 3, 1), mk("chili", 6, 3), mk("egg", 20, 10), mk("greens", 4, 1), mk("rice", 3, 2), mk("tofu", 4, 1)]);
    sel.clear(); cooked = null;
    renderFridge();
    $("#result").innerHTML = "";
    toast(t("cook.demoDone"));
  }

  /* ---------- toast / 语言 ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("on"), 2200);
  }

  function applyLang() {
    I18N.apply();
    $("#langBtn").textContent = I18N.getLang() === "en" ? "中文" : "EN";
    renderFridge();
    if (cooked) renderResult([]);           // 换语言时清掉旧结果，避免中英混排
  }

  /* ---------- 启动 ---------- */
  $("#demoBtn").addEventListener("click", loadDemo);
  $("#askBtn").addEventListener("click", pick);
  $("#langBtn").addEventListener("click", () => {
    I18N.setLang(I18N.getLang() === "en" ? "zh" : "en");
    applyLang();
  });
  // 锅本身也能当放置目标：点一下等于「把选中的都收进来」（键盘可达）
  $("#pot").addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
  });

  renderFridge();
  applyLang();
})();
