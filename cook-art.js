/* ============================================================
   COOK_ART — one flat illustrated pictogram per food, 48x48.
   Same subject order as FD_ICONS (line-drawn) but filled, so the
   fridge can look like a cookbook without a second icon language:
   two tones per food, no outlines, no gradients.
   ============================================================ */
(function (g) {
  "use strict";

  const C = {
    eggW: "#FFF6E2", yolk: "#F2B33D", yolkD: "#DF9A22",
    meat: "#E79080", meatD: "#CB6A5E", beef: "#B4554B", beefD: "#8E3F38",
    fish: "#CFE3E6", fishD: "#9FBFC6", ink: "#4A4038",
    green: "#8FB98A", greenD: "#6B9A6A", leaf: "#AEC98F", leafD: "#8AAB6C",
    tomato: "#D4553F", tomatoD: "#B23F2C", stalk: "#7E9C82",
    tofu: "#F7F2DF", tofuD: "#DFD5B8",
    bread: "#E8C48A", breadD: "#C9A05F", wheat: "#F4E0AE",
    dairy: "#FFFDF6", dairyD: "#E4DCC6", blue: "#A8CBDD",
    shroom: "#CDAB88", shroomD: "#AC8767",
    purple: "#9C80B4", purpleD: "#7E6495",
    potato: "#D9B77E", potatoD: "#BC9A63",
    bowl: "#F1E7D2", bowlD: "#D8C9AC", chop: "#8B6F52"
  };

  const A = {
    /* ---------- protein ---------- */
    shrimp: `<path d="M37 12c-11-3-21 4-21 13 0 6 5 10 11 10 3 0 5-2 5-5" fill="${C.meat}"/>
      <path d="M37 12c-4 1-7 3-9 6M37 12c1 4 0 7-2 10" stroke="${C.meatD}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M32 35c3 2 7 2 9 0-1 5-4 7-9 6z" fill="${C.meatD}"/>
      <circle cx="19" cy="17" r="1.9" fill="${C.ink}"/>`,
    chicken: `<path d="M20 12a10 10 0 1 0 8 16 10 10 0 0 0-8-16z" fill="${C.meat}"/>
      <path d="M27 27l11 9" stroke="${C.meatD}" stroke-width="5" stroke-linecap="round"/>
      <path d="M36 34a5 5 0 1 0 7 7 5 5 0 0 0-7-7z" fill="${C.eggW}"/>
      <path d="M14 18a7 7 0 0 1 6-4" stroke="#F5C0B2" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    pork: `<rect x="8" y="14" width="32" height="20" rx="7" fill="${C.meat}"/>
      <path d="M13 24c4-6 9 4 13 0s7 3 10-1" stroke="#F8D9D0" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M12 30c5-3 9 1 13-1" stroke="${C.meatD}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    beef: `<rect x="8" y="14" width="32" height="20" rx="6" fill="${C.beef}"/>
      <path d="M14 20c5 0 6 4 11 4s7-5 9-1" stroke="#E3A79E" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M15 29c6 1 8-3 12-2s5 3 7 1" stroke="${C.beefD}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    fish: `<path d="M8 25c6-9 18-9 25 0-7 9-19 9-25 0z" fill="${C.fish}"/>
      <path d="M33 25l7-6v12z" fill="${C.fishD}"/>
      <path d="M20 17c2 3 2 5 0 8" stroke="${C.fishD}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="15" cy="22" r="1.8" fill="${C.ink}"/>`,
    ham: `<rect x="10" y="13" width="28" height="22" rx="9" fill="${C.meat}"/>
      <path d="M18 16v16" stroke="#F8D9D0" stroke-width="2.6"/>
      <circle cx="27" cy="24" r="3.4" fill="${C.eggW}"/>`,
    egg: `<path d="M15 14c7 0 11 7 11 12a11 11 0 0 1-22 0c0-5 4-12 11-12z" fill="${C.eggW}"/>
      <circle cx="15" cy="27" r="5.6" fill="${C.yolk}"/>
      <circle cx="13" cy="25" r="1.6" fill="${C.yolkD}" opacity=".45"/>
      <path d="M30 18a6 6 0 0 1 0 12 6 6 0 0 1 0-12z" fill="${C.eggW}" opacity=".85"/>`,
    tofu: `<path d="M12 17l9-4 18 3-9 4z" fill="#FFFDF4"/>
      <path d="M12 17v15l9 5V20z" fill="#E1D5B6"/>
      <path d="M21 20l18 3v15l-18-3z" fill="${C.tofu}"/>
      <path d="M21 20l18 3v3l-18-3z" fill="#FFFCF0"/>`,

    /* ---------- greens / veg ---------- */
    greens: `<path d="M24 40c-1-11 3-19 12-22 1 12-4 20-12 22z" fill="${C.green}"/>
      <path d="M24 40c0-9-4-15-11-17-1 10 3 16 11 17z" fill="${C.leaf}"/>
      <path d="M24 40V22" stroke="${C.leafD}" stroke-width="2.4" stroke-linecap="round"/>`,
    broccoli: `<circle cx="17" cy="19" r="6" fill="${C.green}"/><circle cx="24" cy="16" r="6.6" fill="${C.greenD}"/>
      <circle cx="31" cy="20" r="5.6" fill="${C.green}"/>
      <path d="M24 22v16" stroke="${C.stalk}" stroke-width="5" stroke-linecap="round"/>
      <path d="M24 28l-6 5M24 28l6 5" stroke="${C.stalk}" stroke-width="4" stroke-linecap="round"/>`,
    tomato: `<circle cx="24" cy="27" r="12" fill="${C.tomato}"/>
      <path d="M24 16l-6-4 4 6-7-1 5 5h8l5-5-7 1 4-6z" fill="${C.stalk}"/>
      <path d="M16 30c2-5 6-7 10-7" stroke="#E88C74" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    chili: `<path d="M24 16c7 0 11 7 11 14s-5 11-11 11-11-4-11-11 4-14 11-14z" fill="${C.green}"/>
      <path d="M24 16c-2-3-1-6 2-7 1 3 0 6-2 7z" fill="${C.stalk}"/>
      <path d="M20 24v10" stroke="${C.greenD}" stroke-width="2.2" stroke-linecap="round"/>`,
    onion: `<path d="M24 38c7 0 11-6 11-12s-5-11-11-11-11 5-11 11 4 12 11 12z" fill="#E8CEA8"/>
      <path d="M24 15v23M19 17c-2 7-2 14 1 20M29 17c2 7 2 14-1 20" stroke="#C9A87B" stroke-width="1.8" fill="none"/>
      <path d="M24 15c0-3 1-5 3-6" stroke="${C.stalk}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    carrot: `<path d="M23 20l9 8-18 12 4-16z" fill="#E08A3C"/>
      <path d="M23 20l3 3M20 27l3 3M17 33l3 2" stroke="#C06E24" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M24 19c-1-5 1-9 5-11-1 5-1 9-2 11zM24 19c-4-2-8-2-11 0 4 1 8 3 10 4z" fill="${C.leaf}"/>`,
    potato: `<ellipse cx="24" cy="26" rx="13" ry="10" fill="${C.potato}"/>
      <circle cx="19" cy="23" r="1.6" fill="${C.potatoD}"/><circle cx="28" cy="21" r="1.4" fill="${C.potatoD}"/>
      <circle cx="25" cy="30" r="1.8" fill="${C.potatoD}"/><circle cx="31" cy="27" r="1.3" fill="${C.potatoD}"/>`,
    eggplant: `<path d="M31 13c7 6 5 17-4 22s-17 2-17-6c0-6 8-8 12-12s5-6 9-4z" fill="${C.purple}"/>
      <path d="M31 13c2-4 5-5 8-4-2 3-4 5-8 6z" fill="${C.stalk}"/>
      <path d="M22 22c-3 3-4 7-3 10" stroke="${C.purpleD}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    mushroom: `<path d="M11 23c0-7 6-12 13-12s13 5 13 12z" fill="${C.shroom}"/>
      <path d="M16 16a9 9 0 0 1 7-4" stroke="#E7CDB2" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M20 23v10a4 4 0 0 0 8 0V23z" fill="#F2E4D2"/>
      <circle cx="30" cy="19" r="1.6" fill="#E7CDB2"/>`,

    /* ---------- carb ---------- */
    rice: `<path d="M11 24h26l-3 13a4 4 0 0 1-4 3H18a4 4 0 0 1-4-3z" fill="${C.bowl}"/>
      <path d="M11 24h26l-1 5H12z" fill="${C.bowlD}"/>
      <path d="M14 24c1-7 5-11 10-11s9 4 10 11z" fill="#FEFCF3"/>
      <path d="M17 21c2-3 4-4 7-4s5 1 7 4" stroke="#E8E0CB" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M24 8v4M19 9l1 3M29 9l-1 3" stroke="${C.dairyD}" stroke-width="2" stroke-linecap="round"/>`,
    noodle: `<path d="M11 24h26l-3 13a4 4 0 0 1-4 3H18a4 4 0 0 1-4-3z" fill="${C.bowl}"/>
      <path d="M13 24c2-3 5-4 8-2s5 3 8 1 6-2 8 1" stroke="#EFD08A" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M30 12l6-6M34 14l6-6" stroke="${C.chop}" stroke-width="2.2" stroke-linecap="round"/>`,
    dumpling: `<path d="M9 27c0-8 7-13 15-13s15 5 15 13c0 3-3 5-6 5H15c-3 0-6-2-6-5z" fill="#F7E6C4"/>
      <path d="M16 18c1 2 1 3 0 5M21 15c1 3 1 5 0 7M26 15c1 3 1 5 0 7M31 18c1 2 1 3 0 5"
        stroke="#E0C79C" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    bread: `<path d="M9 24c0-7 5-11 15-11s15 4 15 11v9c0 3-2 5-5 5H14c-3 0-5-2-5-5z" fill="${C.bread}"/>
      <path d="M9 24c0-7 5-11 15-11s15 4 15 11" fill="${C.breadD}" opacity=".45"/>
      <path d="M16 22c3-2 6 2 9 0s5-1 7 1" stroke="${C.breadD}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,

    /* ---------- dairy ---------- */
    milk: `<path d="M17 18l3-6h8l3 6v20H17z" fill="${C.dairy}" stroke="${C.dairyD}" stroke-width="1.6"/>
      <path d="M20 12l4 6 4-6z" fill="${C.blue}"/>
      <rect x="17" y="25" width="14" height="6" fill="${C.blue}" opacity=".55"/>`,
    cheese: `<path d="M8 30l22-11 10 4v11H8z" fill="#F5CE6A"/>
      <path d="M8 30l22-11 10 4-22 11z" fill="#FBE3A6"/>
      <circle cx="22" cy="30" r="2.2" fill="#E5B34F"/><circle cx="30" cy="27" r="1.6" fill="#E5B34F"/>`,
    yogurt: `<path d="M16 18h16l-2 20a3 3 0 0 1-3 2h-6a3 3 0 0 1-3-2z" fill="${C.dairy}" stroke="${C.dairyD}" stroke-width="1.6"/>
      <rect x="14" y="13" width="20" height="5" rx="2" fill="${C.blue}"/>
      <circle cx="24" cy="30" r="4" fill="#F3D7E0"/>`,
    cola: `<rect x="17" y="11" width="14" height="27" rx="5" fill="#B8402F"/>
      <rect x="17" y="18" width="14" height="5" fill="#F1E7D2"/>
      <ellipse cx="24" cy="12" rx="7" ry="2.4" fill="#8E3225"/>`
  };

  const FALLBACK = `<circle cx="24" cy="24" r="13" fill="#E7DFCF"/>
    <path d="M24 14v20M14 24h20" stroke="#B9AE99" stroke-width="2.4" stroke-linecap="round"/>`;

  /* 冰箱层架上的东西：给每样食材一个方向，避免全都正着站 */
  const TILT = { carrot: -14, fish: -6, eggplant: 8, bread: -3, chili: 10, milk: 0, cola: -4 };

  function svg(id, cls) {
    const body = A[id] || FALLBACK;
    const rot = TILT[id] || 0;
    return `<svg class="art ${cls || ""}" viewBox="0 0 48 48" role="img" aria-hidden="true"
      style="transform:rotate(${rot}deg)"><g transform="translate(24 24) scale(1.14) translate(-24 -26)">${body}</g></svg>`;
  }

  g.COOK_ART = { svg, has: id => !!A[id], ids: Object.keys(A) };
})(window);
