# Fridge Decision — prototype v0.4

**App:** https://jellyfishhamburger.github.io/fridge-decision/
**Fridge panel:** https://jellyfishhamburger.github.io/fridge-decision/display.html
**Settings:** https://jellyfishhamburger.github.io/fridge-decision/settings.html

IDAT7211 group project. No hardware and no image recognition: this exists to test the one
thing the research says people are missing — *a decision*, not another inventory list.

## Files

| File | What it is |
|---|---|
| `data.js` | **The content database.** 21 foods (shelf life + source tag) and 18 dishes (which foods, how long, greens or not, steps). Everything the product knows starts here. |
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
