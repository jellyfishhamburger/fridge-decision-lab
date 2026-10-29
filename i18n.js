/* ============================================================
   FD_I18N — one app, two audiences.
   zh: for the person actually using the fridge (her mother's case).
   en: for the mid-term presentation, without machine-translated Chinese.
   Load AFTER data.js and BEFORE the page script.
   ============================================================ */
(function (g) {
  "use strict";

  const LS_LANG = "fd.lang";

  const STR = {
    zh: {
      "nav.fridge": "冰箱", "nav.discover": "推荐", "nav.build": "自己选", "nav.settings": "设置",
      "title.fridge": "冰箱里有什么", "title.discover": "今晚吃什么", "title.build": "自己做主",

      "fridge.lede": "右边数字＝还能放几天，越红越要先吃。数据存在这台设备里。",
      "fridge.stock": "存货", "fridge.count": "{n} 样",
      "fridge.empty": "还没记录任何东西 —— 用下面的按钮加一样。",
      "fridge.add": "＋ 加一样", "fridge.demo": "载入示例",
      "fridge.decide": "今晚吃什么 →",
      "fridge.left": "还剩 {n} 天", "fridge.today": "今天到期", "fridge.oneDay": "还剩 1 天",

      "disc.lede": "按「先用掉快坏的」排序。差一样的菜也算能做饭，会告诉你去买什么。",
      "disc.all": "全部", "disc.ready": "现在就能做", "disc.shop1": "差一样",
      "disc.greens": "有绿叶菜", "disc.light": "≤ 500 kcal",
      "disc.empty": "这个条件下没有菜。换个筛选，或者往冰箱里再加一样。",
      "disc.uses": "用掉：", "disc.steps": "看做法", "disc.cook": "开始做（一步一屏）",
      "disc.none": "还做不了菜", "disc.noneHint": "冰箱里的东西凑不出任何一道菜。再加一样，或者载入示例。",
      "disc.other": "其他选择", "disc.otherSub": "不一定马上能做",
      "disc.ready1": "现在能做", "disc.gapN": "差 {n} 样",

      "build.lede": "先选你今天想吃的（从冰箱里挑），再用条件收窄 —— 不是在搜菜谱，是在做决定。",
      "build.want": "我想吃", "build.picked": "已选 {n} 样", "build.none": "未选",
      "build.kcal": "热量上限", "build.mins": "最多用时", "build.mustGreens": "必须有绿叶菜",
      "build.fibre": "只看纤维较高的", "build.clear": "清空选择",
      "build.fibreNote": "「纤维较高」是按食材推断的粗分档（含绿叶菜 / 西兰花 / 茄子 / 香菇 / 胡萝卜等），<b>不是克数</b> —— 我们的菜谱数据里没有纤维含量。",
      "build.empty": "条件太紧了 —— 把热量上限调高，或者取消「必须绿叶菜」。",
      "build.total": "共 {n} 道符合。", "build.pickFirst": "冰箱是空的，先去第一页加东西。",

      "card.tonight": "今晚", "card.shop1": "差一样就能做",
      "card.min": "{n} 分钟", "card.greens": "有绿叶菜", "card.noGreens": "无绿叶菜",
      "card.missing": "还差一样：", "card.missingHint": "买回来就能做，不用改计划。",
      "card.why": "为什么推这道", "card.whyUses": "用掉 {items}",
      "card.whyGreens": "正好补上今天那份绿叶菜 —— 累了最容易跳过的那样。",
      "card.whyTime": "<b>{n} 分钟</b>，一口锅，比点外卖快。",
      "card.whySlow": "{n} 分钟，超过你设的 {max} 分钟上限，所以排在后面。",
      "card.whyGap": "只差一样，买了就能做，不用换计划。",
      "card.pantry": "这道菜还要调味：", "card.pantryHint": "点一下标记「家里有」。",
      "card.src": "菜谱与热量：", "card.srcNote": "个人份估算，非实测",
      "card.seeThis": "看这个",

      "days.today": "今天", "days.n": "{n} 天",

      "sheet.title": "加入一样东西",
      "sheet.hint": "选食物 —— 原型还不会替你认。保质期按食物预设，可以自己改。",
      "sheet.cam": "打开相机", "sheet.flip": "换镜头", "sheet.shoot": "拍摄", "sheet.reshoot": "重拍",
      "sheet.zoom": "焦距", "sheet.scan": "扫商品条码",
      "sheet.camMsg": "原型还不会认食物：拍下来之后请选下面是哪一种。条码能扫的商品可以直接出名字。",
      "sheet.camReady": "拍下来之后请选下面哪一种食物 —— 原型还不会自动认。",
      "sheet.camFail": "相机打不开（需要 HTTPS + 授权）。可以直接在下面选食物。",
      "sheet.camDone": "拍到了。原型还不会替你认 —— 在下面选是哪一种（这是有意的限制，不是 bug）。",
      "sheet.qty": "这次带回来几份", "sheet.qtyUnit": "{n} {unit}",
      "sheet.keepFor": "可以放到 <b>{n} 天后</b>", "sheet.save": "加进冰箱", "sheet.cancel": "取消",
      "sheet.pickFirst": "先选一样食物",

      "cook.title": "做饭模式", "cook.prev": "上一步", "cook.next": "下一步",
      "cook.last": "最后一步", "cook.done": "做完了 · 扣减库存",
      "undo.done": "{dish} 做好了 · 扣减 {items}", "undo.btn": "撤销", "undo.ok": "已撤销扣减",
      "undo.usedUp": "{n}×{q}（用完）", "undo.left": "{n}×{q}（剩 {left}）",

      "toast.added": "{name} ×{n} 已加入 · 放 {days} 天",
      "toast.demo": "示例：猪肉、青椒、鸡蛋、青菜、米饭、豆腐",
      "toast.tip": "提示：第一页有「载入示例」",
      "toast.took": "记下了 —— 采纳率 +1",

      "foot.line": "原型 v0.6 · 无硬件、无图像识别",
      "foot.disc": "圆片（黑色圆盘）→", "foot.strip": "长条墨水屏 →", "foot.settings": "设置 →",

      "set.title": "设置",
      "set.sub": "冰箱那块屏显示什么、多久翻一次、它按什么目标做决定。都只存在这台设备上。",
      "set.langH": "语言 / Language", "set.langHint": "给用户看中文，给老师讲英文 —— 同一个 App，随时切换。",
      "set.panelH": "冰箱屏", "set.panelHint": "三色电子墨水，不会滚动；自己翻页，或者按按键翻。",
      "set.rot4": "每 4 秒", "set.rot6": "每 6 秒", "set.rot10": "每 10 秒", "set.rot20": "每 20 秒", "set.rotManual": "只按键翻页",
      "set.screensH": "显示哪些屏 · 顺序", "set.screensHint": "取消勾选就不再出现。用箭头调顺序，最上面那屏先出现。",
      "set.hidden": "已隐藏：",
      "set.goalH": "它在追什么", "set.goalHint": "这两个数字决定一道菜排多高。",
      "set.greens": "每天绿叶菜份数", "set.off": "关", "set.mins": "周中最长做饭时间",
      "set.keysH": "屏上的三个按键", "set.keysHint": "三个物理键，固件固定：",
      "set.keyNext": "下一屏", "set.keyNextSub": "next screen",
      "set.keyTake": "就吃这个", "set.keyTakeSub": "记一次采纳 —— 这是最要紧的那个数",
      "set.keySkip": "不想吃", "set.keySkipSub": "换下一道建议，并记一次跳过",
      "set.taken": "采纳", "set.skipped": "跳过", "set.rate": "采纳率", "set.clearLog": "清空记录",
      "set.dbH": "数据", "set.dbHint": "{foods} 种食材 · {recipes} 道菜谱 · 其中 {usda} 条保质期来自 FDA/USDA 冷藏表，{est} 条仍是估计。",
      "set.foodCol": "食材", "set.catCol": "类别", "set.daysCol": "可放", "set.srcCol": "来源",
      "set.showAll": "显示全部 {n} 种", "set.showFew": "只看最快坏的",
      "set.pantryH": "橱柜常备", "set.pantryHint": "调味料不是冰箱里的菜。只有菜谱用到、你又没勾的那几样才会问你。",
      "set.hhH": "家庭共用", "set.hhHint": "一块屏在冰箱上，多支手机。所有人用同一个家庭码加入，谁买了什么大家都看得到。",
      "set.hhCode": "家庭码", "set.hhPanel": "已绑定为面板", "set.hhNew": "生成家庭码",
      "set.hhBind": "把这台设备设为面板", "set.hhNone": "还没有手机加入。",
      "set.hhJoined": "已加入的手机：",
      "set.hhLimit": "诚实的限制：家庭码和成员列表只存在这台设备上。两台真手机共享一个冰箱需要后端 —— 那是下一步，这一页不会假装有。",
      "set.rcH": "菜谱库", "set.rcHint": "{n} 道真实菜谱，来自 {src}（{lic}），每道自带热量估算。",
      "set.rcDish": "菜", "set.rcTime": "用时", "set.rcKcal": "热量", "set.rcNeeds": "需要",
      "set.rcAll": "显示全部 {n} 道", "set.rcFew": "只看前 8 道",
      "set.back": "← 回 App", "set.toPuck": "看圆片 →", "set.toStrip": "看长条屏 →",
      "set.foot": "原型 · 数据在 data.js · App 和屏读的是同一份",
      "gate.lede": "虚线框 = 门口。手进入框里停 0.2 秒才抓拍。",
      "gate.start": "打开摄像头", "gate.stop": "停止", "gate.sim": "模拟一次（演示用）",
      "gate.what": "刚才放进去的是什么？", "gate.ignore": "忽略这次（不是食物）",
      "gate.state.idle": "待机", "gate.state.mon": "监控门口", "gate.state.conf": "等你确认",
      "gate.frame": "框住门口", "gate.pos": "框的位置", "gate.size": "框的大小",
      "gate.hand": "手部检测（推荐）", "gate.hold": "停留帧数"
    },

    en: {
      "nav.fridge": "Fridge", "nav.discover": "Tonight", "nav.build": "Build", "nav.settings": "Settings",
      "title.fridge": "What's in your fridge", "title.discover": "What can I cook", "title.build": "You choose",

      "fridge.lede": "The number is how many days are left. The redder, the sooner it must be eaten.",
      "fridge.stock": "In stock", "fridge.count": "{n} items",
      "fridge.empty": "Nothing logged yet — add something below.",
      "fridge.add": "+ Add an item", "fridge.demo": "Load demo fridge",
      "fridge.decide": "What should I cook →",
      "fridge.left": "{n} days", "fridge.today": "use today", "fridge.oneDay": "1 day",

      "disc.lede": "Sorted by what dies first. A dish one ingredient short still counts — it tells you what to buy.",
      "disc.all": "All", "disc.ready": "Cookable now", "disc.shop1": "One short",
      "disc.greens": "With greens", "disc.light": "≤ 500 kcal",
      "disc.empty": "Nothing under these filters. Loosen one, or add something to the fridge.",
      "disc.uses": "Uses: ", "disc.steps": "Method", "disc.cook": "Start cooking (one step a screen)",
      "disc.none": "Nothing cookable yet", "disc.noneHint": "Nothing in your fridge pairs into a dish. Add one more thing, or load the demo fridge.",
      "disc.other": "Or these", "disc.otherSub": "not necessarily cookable now",
      "disc.ready1": "Cookable now", "disc.gapN": "{n} short",

      "build.lede": "Pick what you feel like eating from the fridge, then narrow it down. This is not a search box — it is a decision.",
      "build.want": "I want to eat", "build.picked": "{n} picked", "build.none": "none picked",
      "build.kcal": "Calorie ceiling", "build.mins": "Longest I'll cook", "build.mustGreens": "Must include greens",
      "build.fibre": "Higher fibre only", "build.clear": "Clear selection",
      "build.fibreNote": "“Higher fibre” is a coarse bucket inferred from the ingredients (greens, broccoli, aubergine, mushrooms, carrot…). It is <b>not grams</b> — our recipe data has no fibre values.",
      "build.empty": "Too tight — raise the calorie ceiling or untick “must include greens”.",
      "build.total": "{n} dishes match.", "build.pickFirst": "Your fridge is empty — add something on the first tab.",

      "card.tonight": "Tonight", "card.shop1": "One thing away",
      "card.min": "{n} min", "card.greens": "with greens", "card.noGreens": "no greens",
      "card.missing": "Missing just one: ", "card.missingHint": "Buy it on the way home and the plan stands.",
      "card.why": "Why this one", "card.whyUses": "Uses {items}",
      "card.whyGreens": "Counts as today's greens — the thing you skip when you're tired.",
      "card.whyTime": "<b>{n} minutes</b>, one pan — faster than ordering in.",
      "card.whySlow": "{n} minutes, over your {max}-minute limit, so it ranks lower.",
      "card.whyGap": "One ingredient short — buy it and the plan still works.",
      "card.pantry": "Still needs seasoning: ", "card.pantryHint": "Tap to mark it as already in the cupboard.",
      "card.src": "Recipe & calories: ", "card.srcNote": "per-serving estimate, not measured",
      "card.seeThis": "Use this",

      "days.today": "today", "days.n": "{n} d",

      "sheet.title": "Add something you just bought",
      "sheet.hint": "Pick the food — the prototype does not recognise it yet. Shelf life is preset per food; adjust if you like.",
      "sheet.cam": "Open camera", "sheet.flip": "Switch lens", "sheet.shoot": "Shoot", "sheet.reshoot": "Retake",
      "sheet.zoom": "Zoom", "sheet.scan": "Scan barcode",
      "sheet.camMsg": "No recognition yet: shoot, then pick the food below. For packaged goods a barcode can name the item.",
      "sheet.camReady": "Shoot, then pick which food it was — recognition is not implemented.",
      "sheet.camFail": "Camera blocked (needs HTTPS + permission). Pick the food below instead.",
      "sheet.camDone": "Captured. The prototype still will not recognise it — choose below (a deliberate limit, not a bug).",
      "sheet.qty": "How many did you bring home", "sheet.qtyUnit": "{n} {unit}",
      "sheet.keepFor": "Good until <b>{n} days from now</b>", "sheet.save": "Add to fridge", "sheet.cancel": "Cancel",
      "sheet.pickFirst": "Pick a food first",

      "cook.title": "Cooking mode", "cook.prev": "Back", "cook.next": "Next",
      "cook.last": "Last step", "cook.done": "Done — deduct from stock",
      "undo.done": "{dish} cooked · deducted {items}", "undo.btn": "Undo", "undo.ok": "Deduction undone",
      "undo.usedUp": "{n}×{q} (used up)", "undo.left": "{n}×{q} ({left} left)",

      "toast.added": "{name} ×{n} added · good for {days} days",
      "toast.demo": "Demo fridge: pork, chilli, eggs, greens, rice, tofu",
      "toast.tip": "Tip: tap “Load demo fridge” on the first tab",
      "toast.took": "Logged — acceptance +1",

      "foot.line": "Prototype v0.6 · no hardware, no image recognition",
      "foot.disc": "Round puck →", "foot.strip": "Strip e-paper →", "foot.settings": "Settings →",

      "set.title": "Settings",
      "set.sub": "What the fridge panel shows, how often it changes, and what it is aiming for. Stored on this device only.",
      "set.langH": "Language / 语言", "set.langHint": "Chinese for the person using the fridge, English for the presentation. Same app, one tap apart.",
      "set.panelH": "Fridge panel", "set.panelHint": "Three-colour e-paper. It never scrolls; it moves on its own or on the button.",
      "set.rot4": "Every 4 s", "set.rot6": "Every 6 s", "set.rot10": "Every 10 s", "set.rot20": "Every 20 s", "set.rotManual": "Button only",
      "set.screensH": "Screens & order", "set.screensHint": "Untick one and it stops appearing. Arrows change the order; the top one shows first.",
      "set.hidden": "Hidden: ",
      "set.goalH": "What it aims for", "set.goalHint": "These two numbers decide which dish ranks first.",
      "set.greens": "Greens servings per day", "set.off": "Off", "set.mins": "Longest weeknight cooking",
      "set.keysH": "The three buttons", "set.keysHint": "Three physical buttons, fixed in firmware:",
      "set.keyNext": "Next", "set.keyNextSub": "next screen",
      "set.keyTake": "I'll cook this", "set.keyTakeSub": "logs a take — the number that matters",
      "set.keySkip": "Not this one", "set.keySkipSub": "shows the next suggestion and logs a skip",
      "set.taken": "taken", "set.skipped": "skipped", "set.rate": "accept rate", "set.clearLog": "Clear the log",
      "set.dbH": "The database", "set.dbHint": "{foods} foods · {recipes} recipes · {usda} shelf lives from the FDA/USDA cold storage chart, {est} still estimates.",
      "set.foodCol": "Food", "set.catCol": "Category", "set.daysCol": "Good for", "set.srcCol": "Source",
      "set.showAll": "Show all {n} foods", "set.showFew": "Shortest-lived only",
      "set.pantryH": "Cupboard basics", "set.pantryHint": "Condiments are not fridge contents. Only the ones a recipe needs, and you have not ticked, get asked about.",
      "set.hhH": "Household", "set.hhHint": "One panel on the fridge, several phones. Everyone joins with the same code, so anyone's shopping trip is visible to all.",
      "set.hhCode": "household code", "set.hhPanel": "panel bound", "set.hhNew": "Create a household code",
      "set.hhBind": "Bind this device as the panel", "set.hhNone": "No phone has joined yet.",
      "set.hhJoined": "Joined phones: ",
      "set.hhLimit": "Honest limit: the code and member list live on this device only. Sharing one fridge between two real phones needs a backend — that is the next build, not something this page fakes.",
      "set.rcH": "Recipe library", "set.rcHint": "{n} real recipes from {src} ({lic}), each with its own calorie estimate.",
      "set.rcDish": "Dish", "set.rcTime": "Time", "set.rcKcal": "kcal", "set.rcNeeds": "Needs",
      "set.rcAll": "Show all {n} recipes", "set.rcFew": "Show the first 8",
      "set.back": "← Back to the app", "set.toPuck": "See the round puck →", "set.toStrip": "See the strip panel →",
      "set.foot": "Prototype · data in data.js · app and panel read the same file",
      "gate.lede": "Dashed box = the door plane. A hand has to rest in it for 0.2 s to trigger.",
      "gate.start": "Open camera", "gate.stop": "Stop", "gate.sim": "Simulate one (demo)",
      "gate.what": "What did you just put in?", "gate.ignore": "Ignore this (not food)",
      "gate.state.idle": "Idle", "gate.state.mon": "Watching the door", "gate.state.conf": "Waiting for you",
      "gate.frame": "Frame the door", "gate.pos": "Box position", "gate.size": "Box size",
      "gate.hand": "Hand detection (recommended)", "gate.hold": "Frames to hold"
    }
  };

  /* English names for the 20 recipes, plus condensed English method steps.
     Condensed, not literal: the source recipes are long prose; one-step-per-screen
     needs short lines. Attribution stays on every card. */
  const RECIPE_EN = {
    "清蒸鲈鱼":        {name:"Steamed sea bass",        steps:["Slice ginger and spring onion; soak the green parts in cold water","Score the fish, rub salt inside and out, rest 10 min","Stuff ginger and scallion into the belly","Steam over high heat 10 min, then dress with hot oil and soy"]},
    "白灼虾":          {name:"Poached prawns",          steps:["Lay sliced onion and ginger in a cold pan","Rinse the prawns and lay them on top","Add cooking wine, cover: medium 1 min, low 5 min, off 5 min","Serve with a dipping sauce"]},
    "蒜蓉虾":          {name:"Garlic prawns",           steps:["Split each prawn down the back","Spread garlic sauce over the flesh, plate it","Steam over high heat 3 min","Pour over hot oil and a little soy"]},
    "微波炉蒸蛋":      {name:"Microwave steamed egg",   steps:["Beat eggs with warm water, salt and soy — avoid bubbles","Strain into a heatproof bowl, prick any bubbles","Cover with cling film and pierce 8–10 holes","Microwave, rest 1 min, finish with sesame oil and scallion"]},
    "可乐鸡翅":        {name:"Cola chicken wings",      steps:["Blanch wings in cold water with ginger and wine; skim the foam","Score the wings, marinate in soy 10 min","Fry ginger, then the wings until golden on both sides","Add cola to cover, boil, skim; season and reduce to a glaze"]},
    "宫保鸡丁":        {name:"Kung pao chicken",        steps:["Debone the leg, dice to 1.5 cm, soak 10 min and drain","Marinate with salt, dark soy, wine and cornflour for an hour","Toast dried chillies and Sichuan pepper, then set aside","Sear the chicken, add aromatics and scallion, braise 2 min","Add peanuts, vinegar and sugar, thicken with starch"]},
    "洋葱炒猪肉":      {name:"Pork with onion",         steps:["Slice onion and pork; crush the garlic","Sear the pork in a hot pan until it changes colour","Add garlic, then set both aside","Stir-fry the onion 3–4 min, season, return the pork"]},
    "辣椒炒肉":        {name:"Hunan chilli pork",       steps:["Deseed the green chillies and cut on the roll","Smash garlic, mince ginger","Slice the pork against the grain","Marinate the pork in soy, oyster sauce and salt 10 min","Dry-fry the chillies to a blistered skin, set aside","Fry garlic and ginger, add pork 2 min, then the chillies"]},
    "青椒土豆炒肉":    {name:"Pork, potato & pepper",   steps:["Slice chilli, potato and pork thinly; mince the aromatics","Sear the pork, colour it with soy and salt","Fry aromatics, add potato, cook until just tender","Add chilli over high heat, then thicken with starch water"]},
    "香菇滑鸡":        {name:"Chicken with shiitake",   steps:["Soak dried shiitake; keep the soaking water","Debone and cube the chicken thigh","Blanch the chicken 1 min, drain","Marinate in wine, soy and dark soy","Sear the chicken golden, then braise with the mushrooms"]},
    "麻婆豆腐":        {name:"Mapo tofu",               steps:["Mince garlic and ginger; slice the chilli","Mince the pork, season with salt and soy","Cut the tofu into 2.5 × 3 cm blocks","Fry aromatics and chilli paste 20 s, add pork","Add stock and tofu, simmer, thicken with starch"]},
    "西红柿鸡蛋汤":    {name:"Tomato & egg soup",       steps:["Chop the tomato; mince aromatics","Beat the eggs","Fry aromatics 30 s, then the tomato 1 min","Add water, bring to a boil, season","Stream in the egg, stir once, finish with sesame oil"]},
    "蛋炒饭":          {name:"Egg fried rice",          steps:["Break up cold rice","Dice the ham, carrot and cucumber","Separate yolks from whites and beat each","Fry the whites, set aside","Fry the yolk, add rice and toss until every grain is coated","Add the diced extras, then the whites, season and serve"]},
    "西红柿鸡蛋挂面":  {name:"Tomato egg noodles",      steps:["Chop scallion and tomato; cut the chilli into diamonds","Beat the eggs with a splash of vinegar","Scramble the eggs soft and set aside","Fry aromatics, add tomato down to a sauce","Add water, noodles and the egg; season and serve"]},
    "凉拌豆腐":        {name:"Cold tofu",               steps:["Cube the tofu to 2 cm","Boil water, blanch the tofu 1–2 min, drain","Make the dressing: soy, sesame oil, vinegar, sugar","Mince garlic and scallion, pour the dressing over"]},
    "洋葱炒鸡蛋":      {name:"Onion omelette",          steps:["Beat eggs with onion slices and salt for a minute","Fry one side 30–45 s, flip, toss 2–3 min","Splash in cooking wine, plate, scatter scallion"]},
    "炒茄子":          {name:"Braised aubergine",       steps:["Cut the aubergine into diamonds","Heat a generous amount of oil","Fry aromatics, add the aubergine","Braise until soft, season, plate"]},
    "炒青菜":          {name:"Stir-fried greens",       steps:["Wash and tear the greens; mince the garlic","Heat the pan, add oil, wait 30 s","Add the greens and stir until they wilt, about 1 min","Add garlic, a splash of water and salt, cover 2 min"]},
    "蒜蓉空心菜":      {name:"Garlic water spinach",    steps:["Wash, trim and cut the water spinach into 2–3 lengths","Heat a little oil, swirl it around the pan","Fry the garlic 10–15 s on low heat","Add the greens over high heat and keep tossing until they wilt","Season with salt, sugar and soy; 10 more seconds and serve"]},
    "蒜蓉西兰花":      {name:"Garlic broccoli",         steps:["Cut the broccoli into florets and wash","Boil water, blanch 2–3 min until bright green","Drain and plate","Fry garlic in oil, add soy, oyster sauce, sugar and water","Pour the sauce over the broccoli"]}
  };

  function getLang(){
    try { return localStorage.getItem(LS_LANG) || "zh"; } catch(e){ return "zh"; }
  }
  function setLang(l){
    try { localStorage.setItem(LS_LANG, l); } catch(e){}
    document.documentElement.lang = l === "en" ? "en" : "zh-CN";
  }

  function t(key, vars){
    const lang = getLang();
    let s = (STR[lang] && STR[lang][key]) || (STR.zh[key] || key);
    if(vars) Object.keys(vars).forEach(k => { s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]); });
    return s;
  }

  /* 计量单位也要跟着语言走：3 盒 → 3 boxes */
  const UNIT_EN = {"份":"portion","盒":"box","个":"pcs","把":"bunch","颗":"head","根":"pcs",
                   "包":"pack","袋":"bag","罐":"can","条":"piece","杯":"cup","碗":"bowl",
                   "块":"piece","片":"slice","斤":"jin","克":"g","勺":"tbsp"};

  function unit(u){
    if(getLang() !== "en") return u || "份";
    return UNIT_EN[u] || u || "portion";
  }

  function foodName(id){
    const f = (g.FD && g.FD.byId) ? g.FD.byId[id] : null;
    if(!f) return id;
    return getLang() === "en" ? f.name : f.cn;
  }

  function recipeName(r){
    if(getLang() === "en"){
      const e = RECIPE_EN[r.id] || RECIPE_EN[r.name];
      if(e) return e.name;
    }
    return r.name;
  }

  function recipeSteps(r){
    if(getLang() === "en"){
      const e = RECIPE_EN[r.id] || RECIPE_EN[r.name];
      if(e && e.steps && e.steps.length) return e.steps;
    }
    return r.steps;
  }

  /* 把带 data-i18n 的静态元素一次性翻译好 */
  function apply(root){
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(el=>{
      const k = el.dataset.i18n;
      el.innerHTML = t(k);
    });
    scope.querySelectorAll("[data-i18n-ph]").forEach(el=>{
      el.setAttribute("placeholder", t(el.dataset.i18nPh));
    });
    document.documentElement.lang = getLang() === "en" ? "en" : "zh-CN";
  }

  setLang(getLang());
  g.I18N = {t, getLang, setLang, apply, foodName, recipeName, recipeSteps, unit, STR, RECIPE_EN, LS_LANG};
})(window);
