/* ============================================================
   COOK_STEPS — 把一句做法文字认成「一个动作」，配一张 24×24 的动作插画。
   为什么不用照片/视频：这 20 道菜的上游素材里，只有 1 道有步骤图、
   0 道有视频（查过 Anduin2017/HowToCook：bilibili 只在 ~20 个文件里，
   她这 20 道一个都没撞上）。所以「每一步长什么样」只能我们自己画。

   用法：COOK_STEPS.of("把鸡蛋打散，加入温水") -> {id:"mix", ...}
   ============================================================ */
(function (g) {
  "use strict";

  const C = { line: "#7A6A55", wood: "#D9B77E", iron: "#8FA9A2", ironD: "#6F8B84",
              hot: "#D4553F", water: "#A8CBDD", white: "#FFFDF4", leaf: "#8FB98A" };

  const A = {
    cut: {
      zh: "切", en: "cut",
      svg: `<path d="M4 19h9" stroke="${C.wood}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M19.5 3.6l2 2-9.6 12.2-2.6.6.6-2.6z" fill="${C.iron}" stroke="${C.ironD}" stroke-width="1"/>
        <path d="M13.6 18.4c1.4-1 2.6-.4 2.8.8" stroke="${C.hot}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      anim: "cut"
    },
    chop: {
      zh: "剁/拍", en: "chop",
      svg: `<path d="M3.4 19.4h11" stroke="${C.wood}" stroke-width="2.6" stroke-linecap="round"/>
        <rect x="13" y="4" width="8" height="7" rx="1.6" fill="${C.iron}" stroke="${C.ironD}" stroke-width="1"/>
        <path d="M14.6 11v3.4" stroke="${C.ironD}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M7 16.4c1.2-.8 2.4-.2 2.6 1" stroke="${C.hot}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      anim: "chop"
    },
    mix: {
      zh: "打散/搅", en: "whisk",
      svg: `<path d="M6.6 12.4h10.8l-1.4 7a2 2 0 01-2 1.6h-4a2 2 0 01-2-1.6z" fill="${C.white}" stroke="${C.line}" stroke-width="1.2"/>
        <path d="M12 3v9.4" stroke="${C.line}" stroke-width="2" stroke-linecap="round"/>
        <path d="M8.6 5.6c1.6 1.4 1.6 4.4 0 6M15.4 5.6c-1.6 1.4-1.6 4.4 0 6" stroke="${C.line}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
      anim: "mix"
    },
    fry: {
      zh: "炒/翻", en: "stir-fry",
      svg: `<path d="M3.4 11.4h13.8c0 3.6-2.4 5.6-5.4 5.6H8.8c-3 0-5.4-2-5.4-5.6z" fill="${C.iron}" stroke="${C.ironD}" stroke-width="1"/>
        <path d="M17.2 12.6h3.2" stroke="${C.ironD}" stroke-width="2.6" stroke-linecap="round"/>
        <circle cx="6.4" cy="7.6" r="1.2" fill="${C.hot}"/><circle cx="10.2" cy="5.6" r="1.4" fill="${C.leaf}"/>
        <circle cx="13.8" cy="8" r="1.1" fill="${C.wood}"/>`,
      anim: "fry"
    },
    boil: {
      zh: "煮/蒸", en: "boil",
      svg: `<path d="M4.6 12h14.8v3.2a5 5 0 01-5 5H9.6a5 5 0 01-5-5z" fill="${C.iron}" stroke="${C.ironD}" stroke-width="1"/>
        <path d="M3.4 12h18" stroke="${C.ironD}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M9.4 8.6c-1-1.6 1-2.4 0-4M14.6 8.6c-1-1.6 1-2.4 0-4" stroke="${C.water}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
      anim: "boil"
    },
    pour: {
      zh: "倒/加入", en: "pour",
      svg: `<path d="M5.6 4.6h5l1.2 8.4H6.8z" fill="${C.white}" stroke="${C.line}" stroke-width="1.2" transform="rotate(-16 8 8)"/>
        <path d="M13.4 9.4c1.6 1.2 2 3.4 2.4 5.4" stroke="${C.water}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M8.6 15.6h10.6l-1.2 4.4H9.8z" fill="${C.iron}" stroke="${C.ironD}" stroke-width="1"/>`,
      anim: "pour"
    },
    season: {
      zh: "调味", en: "season",
      svg: `<path d="M8.4 9.6h7.2l1.4 9.4a1.6 1.6 0 01-1.6 1.8H8.6a1.6 1.6 0 01-1.6-1.8z" fill="${C.white}" stroke="${C.line}" stroke-width="1.2"/>
        <path d="M9.6 9.6V7.2h4.8v2.4" stroke="${C.line}" stroke-width="1.2" fill="none"/>
        <circle cx="10.4" cy="14" r=".7" fill="${C.line}"/><circle cx="13.6" cy="14" r=".7" fill="${C.line}"/>
        <circle cx="12" cy="17.4" r=".7" fill="${C.line}"/>
        <path d="M17.6 5.4l1.4-1.4M18.8 8.4h1.8" stroke="${C.hot}" stroke-width="1.6" stroke-linecap="round"/>`,
      anim: "season"
    },
    cover: {
      zh: "盖/焖", en: "cover",
      svg: `<path d="M4 12.4h16" stroke="${C.ironD}" stroke-width="2" stroke-linecap="round"/>
        <path d="M6.4 12.4a5.6 5.6 0 0111.2 0z" fill="${C.iron}" stroke="${C.ironD}" stroke-width="1"/>
        <circle cx="12" cy="5.2" r="1.2" fill="${C.ironD}"/>
        <path d="M4.6 16.4h14.8" stroke="${C.water}" stroke-width="1.8" stroke-dasharray="2.4 2.6" stroke-linecap="round"/>`,
      anim: "cover"
    },
    serve: {
      zh: "盛/出锅", en: "serve",
      svg: `<circle cx="12" cy="13.6" r="7.4" fill="${C.white}" stroke="${C.line}" stroke-width="1.2"/>
        <path d="M8.6 12.4c1.6-2 5-2 6.6 0-1.2 2.2-5.4 2.2-6.6 0z" fill="${C.hot}"/>
        <circle cx="10.6" cy="15.6" r="1" fill="${C.leaf}"/><circle cx="13.6" cy="15.8" r="1" fill="${C.wood}"/>
        <path d="M5.4 21h13.2" stroke="${C.ironD}" stroke-width="1.8" stroke-linecap="round"/>`,
      anim: "serve"
    },
    wait: {
      zh: "腌制/静置", en: "rest",
      svg: `<circle cx="12" cy="12.4" r="7.6" fill="none" stroke="${C.line}" stroke-width="1.8"/>
        <path d="M12 8v4.8l3 1.8" stroke="${C.hot}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M12 3.4v1.6M20.6 12.4H19M12 20.8v-1.4M4.9 12.4H3.4" stroke="${C.line}" stroke-width="1.4" stroke-linecap="round"/>`,
      anim: "wait"
    }
  };

  /* 规则 v2：不看"出现没出现"，看"第一个动作动词是哪个"。
     中文菜谱几乎都是「动词开头」，所以位置最靠前的动词就是这一步的主动作。
     例：「肉糜中加入盐和酱油，搅拌均匀」——"加入"在最前，但调味料在该句里 →
     先做一次改写（见 SEASON_FIX），把它变成"调味"，再取最前动词。 */
  const RULES = [
    ["serve",  /(盛出|盛盘|装盘|摆盘|出锅|捞出|起锅|serv|plate)/i],
    ["cover",  /(盖上|盖好|盖盖|盖着|加盖|封上|焖|cover|lid)/i],
    ["pour",   /(倒入|倒进|加入|放入水|加水|注水|淋|浇|下锅|pour)/i],
    ["fry",    /(翻炒|炒|煸|爆香|煸炒|煎|炸|收汁|stir[- ]?fr|fry|saut)/i],
    ["boil",   /(开火|烧开|水开|煮|蒸|焯|炖|沸腾|boil|steam|simmer)/i],
    ["mix",    /(打散|搅|拌|调和|拌匀|调成|打蛋|whisk|mix|beat)/i],
    ["chop",   /(剁|拍碎|拍开|捶|碾|mash|chop|minc)/i],
    ["cut",    /(切|改刀|划几刀|片成|切成|丝|滚刀|slice|dice)/i],
    ["season", /(盐|糖|生抽|老抽|料酒|胡椒|蚝油|豆瓣|淀粉|调味|勾芡|腌|season|salt|sauce)/i],
    ["wait",   /(静置|等待|放凉|浸泡|泡|分钟|小时|rest|wait|minute|hour)/i]
  ];

  /* 「加入/放入 + 调味料」其实是在调味，不是在倒东西 */
  const SEASON_FIX = /(加入|放入|倒入|加|放)([^，。；]{0,10})(盐|糖|生抽|老抽|酱油|料酒|胡椒|蚝油|豆瓣|淀粉|醋)/;
  const LEAD = /^(将|把|取|用|先|再|然后|接着|之后|最后|同时|另|此时|待)/;

  /* 关键词只能做到 ~75%（中文菜谱的动词位置太飘，比如「鱼肚内塞上姜和葱白…蒸鱼的碟子」会被
     认成"蒸"）。这 20 道菜的 136 步我逐条看过，下面是人工校正表：命中就用校正值，
     以后新增菜谱走自动规则，标错再往这张表里加一行即可。 */
  const OVERRIDE = {
    "清蒸鲈鱼#3": "season",
    "清蒸鲈鱼#4": "boil",
    "白灼虾#1": "pour",
    "白灼虾#2": "cover",
    "白灼虾#3": "season",
    "蒜蓉虾#1": "season",
    "蒜蓉虾#2": "boil",
    "微波炉蒸蛋#0": "mix",
    "微波炉蒸蛋#2": "cover",
    "微波炉蒸蛋#3": "boil",
    "微波炉蒸蛋#5": "season",
    "可乐鸡翅#0": "pour",
    "可乐鸡翅#6": "serve",
    "辣椒炒肉#4": "fry",
    "辣椒炒肉#5": "fry",
    "辣椒炒肉#6": "fry",
    "青椒土豆炒肉#1": "fry",
    "青椒土豆炒肉#2": "fry",
    "青椒土豆炒肉#3": "fry",
    "香菇滑鸡#3": "cut",
    "麻婆豆腐#5": "cut",
    "麻婆豆腐#6": "pour",
    "麻婆豆腐#7": "fry",
    "西红柿鸡蛋汤#3": "fry",
    "西红柿鸡蛋汤#5": "pour",
    "西红柿鸡蛋汤#7": "serve",
    "蛋炒饭#0": "cut",
    "蛋炒饭#3": "mix",
    "蛋炒饭#4": "fry",
    "蛋炒饭#5": "pour",
    "蛋炒饭#6": "fry",
    "蛋炒饭#7": "fry",
    "西红柿鸡蛋挂面#3": "mix",
    "西红柿鸡蛋挂面#4": "pour",
    "西红柿鸡蛋挂面#7": "fry",
    "凉拌豆腐#3": "serve",
    "凉拌豆腐#7": "season",
    "洋葱炒鸡蛋#0": "mix",
    "洋葱炒鸡蛋#1": "fry",
    "炒茄子#4": "fry",
    "炒茄子#5": "pour",
    "炒茄子#6": "fry",
    "炒茄子#7": "fry",
    "炒青菜#0": "cut",
    "炒青菜#2": "pour",
    "炒青菜#3": "fry",
    "炒青菜#4": "pour",
    "炒青菜#5": "pour",
    "炒青菜#6": "cover",
    "蒜蓉空心菜#1": "pour",
    "蒜蓉空心菜#3": "fry",
    "蒜蓉西兰花#4": "serve",
    "蒜蓉西兰花#5": "pour",
  };

  function of(text, key) {
    if (key && OVERRIDE[key]) return Object.assign({ id: OVERRIDE[key], curated: true }, A[OVERRIDE[key]]);
    let s = String(text || "");
    if (SEASON_FIX.test(s)) return Object.assign({ id: "season" }, A.season);
    // 去掉句首的连接词，让"动词位置"更准
    let i = 0;
    while (i < 3 && LEAD.test(s)) { s = s.replace(LEAD, ""); i++; }

    let best = null;
    for (const [id, re] of RULES) {
      const m = s.match(re);
      if (!m) continue;
      const at = m.index;
      if (!best || at < best.at) best = { id, at };
    }
    if (!best) return Object.assign({ id: "wait", low: true }, A.wait);
    return Object.assign({ id: best.id }, A[best.id]);
  }

  function svg(id, cls) {
    const a = A[id] || A.wait;
    return `<svg class="act-art ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true">${a.svg}</svg>`;
  }

  g.COOK_STEPS = { of, svg, A, RULES };
})(window);
