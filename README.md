# Fridge Decision — 实验副本 ·「今天的锅」

> **这是实验仓库，不是生产站。** 生产站：[jellyfishhamburger.github.io/fridge-decision](https://jellyfishhamburger.github.io/fridge-decision/)。
> 这里的改动只为试一个新交互，不保证与生产同步；确认好用之后才会并回主仓库。
>
> **新入口（本仓库独有）**：https://jellyfishhamburger.github.io/fridge-decision-lab/cook.html
> 把冰箱里的食材拖进锅 → 看今晚能做什么 → 点「开始做饭」才真的扣库存。
> 实现说明、复用清单、自检记录：[COOK-LAB.md](COOK-LAB.md)。

## 本仓库新增的文件

| File | What it is |
|---|---|
| `cook.html` / `cook.css` | 「今天的锅」页面与皮肤（只在 cook.html 加载，不影响其它页面） |
| `cook-art.js` | 25 样食材的扁平插画（48×48、两色、无描边无渐变） |
| `cook.js` | 选中状态、拖拽（鼠标 + 触摸长按）、推荐、扣库存 |
| `COOK-LAB.md` | 这一版做了什么、复用了什么、三条边界、自检数据 |
| `tools/cook-e2e.py` · `tools/cook-drag-test.py` | 无头 Chrome 端到端自检（含鼠标/触摸拖拽） |

---

## 原有页面（未改动）

**App:** https://jellyfishhamburger.github.io/fridge-decision-lab/
**Fridge panel:** https://jellyfishhamburger.github.io/fridge-decision-lab/display.html
**Settings:** https://jellyfishhamburger.github.io/fridge-decision-lab/settings.html

IDAT7211 group project. No hardware and no image recognition: this exists to test the one
thing the research says people are missing — *a decision*, not another inventory list.

## Files

| File | What it is |
|---|---|
| `data.js` | **The content database.** 25 foods (shelf life + source tag) and 20 dishes (which foods, how long, greens or not, steps), plus 19 cupboard condiments. Everything the product knows starts here. |
| `logic.js` | The decision rule, the date maths, user settings, and the take/skip log. |
| `icons.js` | 16 line drawings covering all 21 foods, drawn for a 296×128 three-colour panel. |
| `index.html` | Phone app, three tabs + settings gear: **fridge** (stock, countdown) · **discover** (ranked recipes, filters) · **build** (pick what you want, then narrow by kcal / time / greens / fibre). |
| `display.html` | 2.9″ e-paper strip simulation with three physical buttons. |
| `disc.html` | The round puck (240×240 / 1.54″): a red-amber-green ring for how much is about to go off. |
| `settings.html` | What the panel shows, how fast it rotates, and the goals that drive ranking. |

## Cooking consumes stock

`FD.consume(items, recipe)` runs when the cooking mode finishes: every ingredient the
recipe uses loses one unit, and an item at zero is removed. One unit per ingredient is a
deliberate simplification — only 4 of 20 recipes parse reliable gram amounts, so the UI
says "扣减 1 份" instead of implying exact quantities. The action is undoable.

## The decision rule

```
score = urgency  Σ max(0, 8 − daysLeft) × 0.9   per used ingredient
      + greensBonus  4  if the dish lands a green and a greens goal is set
      − timePenalty  1.4 per minute over the user's weeknight limit
```

A dish is only eligible if every ingredient is in the fridge. Ranking pushes whatever is
about to die to the top — that is the whole product claim, and it is one function.

## Where the numbers come from

Shelf lives are tagged `src:"usda"` (taken from the FDA/USDA Cold Food Storage Chart,
refrigerated at 40 °F / 4 °C, conservative end of the range — 9 of 21 foods) or `src:"est"`
(practitioner estimate, **not yet sourced** — 12 of 21). The settings page shows which is
which, because a demo that quotes a shelf life nobody can defend is worse than no number.

## Deliberately not built

- Real ingredient recognition (vision).
- Portions, nutrition numbers, full recipes (the 3–4 step method is enough for the screen).
- Multi-user. A shared fridge is used by more than one person; this is single-device and
  single-user — a known limitation we state rather than hide.
- A sync channel between phone and panel (both read the same `localStorage` on one device;
  real hardware needs a gateway or a backend).

## Deploy

Static site, GitHub Pages from `main`. Any edit: commit + push, Pages rebuilds in ~1 min.
The service worker is network-first for HTML, so edits appear on reload.
