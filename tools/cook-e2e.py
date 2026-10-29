"""cook.html 端到端自检：载入示例 → 选食材 → 推荐 → 真正扣库存。
用法: python tools/cook-e2e.py http://127.0.0.1:8899/cook.html <outdir>
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9336
PROFILE = os.path.join(os.environ["LOCALAPPDATA"], "Temp", "cdp-cook")


async def send(ws, mid, method, **params):
    await ws.send(json.dumps({"id": mid, "method": method, "params": params}))
    while True:
        m = json.loads(await ws.recv())
        if m.get("id") == mid:
            return m.get("result", m)


async def main(url, outdir):
    os.makedirs(outdir, exist_ok=True)
    p = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                          f"--remote-debugging-port={PORT}", f"--user-data-dir={PROFILE}",
                          "--window-size=1440,1000", "about:blank"],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ws_url = None
    for _ in range(40):
        try:
            d = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list", timeout=2))
            pg = [x for x in d if x["type"] == "page"]
            if pg:
                ws_url = pg[0]["webSocketDebuggerUrl"]; break
        except Exception:
            pass
        time.sleep(.3)
    if not ws_url:
        print("NO CDP"); p.kill(); return

    async with websockets.connect(ws_url, max_size=40 << 20) as ws:
        i = 0
        def nid():
            nonlocal i; i += 1; return i
        async def js(e):
            r = await send(ws, nid(), "Runtime.evaluate", expression=e,
                           returnByValue=True, awaitPromise=True)
            if r.get("exceptionDetails"):
                return {"EXC": str(r["exceptionDetails"])[:400]}
            return r.get("result", {}).get("value")
        async def shot(name):
            d = await send(ws, nid(), "Page.captureScreenshot", format="png")
            open(os.path.join(outdir, name + ".png"), "wb").write(base64.b64decode(d["data"]))
            print("SHOT", name)

        await send(ws, nid(), "Page.enable"); await send(ws, nid(), "Runtime.enable")
        await send(ws, nid(), "Runtime.consoleAPICalled")  # noop guard
        await send(ws, nid(), "Log.enable")
        await send(ws, nid(), "Page.navigate", url=url); await asyncio.sleep(1.8)

        out = {}
        out["boot"] = await js("""(() => ({
            title: document.title,
            tiles: document.querySelectorAll('.tile').length,
            empty: !document.getElementById('empty').hidden,
            askDisabled: document.getElementById('askBtn').disabled,
            errs: window.__errs || []
        }))()""")
        await shot("01-empty")

        # 载入示例
        out["demo"] = await js("""(async () => {
            document.getElementById('demoBtn').click();
            await new Promise(r => setTimeout(r, 400));
            return {tiles: document.querySelectorAll('.tile').length,
                    stored: JSON.parse(localStorage.getItem('fd.items.v1')||'[]').length};
        })()""")
        await shot("02-fridge")

        # 选三样：猪肉 / 鸡蛋 / 青椒
        out["pick"] = await js("""(async () => {
            ['pork','egg','chili'].forEach(c => document.querySelector('.tile[data-cat="'+c+'"]').click());
            await new Promise(r => setTimeout(r, 900));
            return {chips: [...document.querySelectorAll('.chip span')].map(e=>e.textContent),
                    pressed: [...document.querySelectorAll('.tile[aria-pressed="true"]')].map(e=>e.dataset.cat),
                    askDisabled: document.getElementById('askBtn').disabled};
        })()""")
        await shot("03-pot")

        # 推荐
        out["ask"] = await js("""(async () => {
            document.getElementById('askBtn').click();
            await new Promise(r => setTimeout(r, 700));
            const cards = [...document.querySelectorAll('#result .rcard')];
            return cards.map(c => ({
                name: c.querySelector('h3')?.textContent,
                meta: [...c.querySelectorAll('.meta span')].map(s=>s.textContent),
                cookDisabled: c.querySelector('.cook')?.disabled
            }));
        })()""")
        await shot("04-result")

        # 真正做一道：点第一张可用的卡
        out["cook"] = await js("""(async () => {
            const before = JSON.parse(localStorage.getItem('fd.items.v1')||'[]');
            const btn = [...document.querySelectorAll('#result .cook')].find(b=>!b.disabled);
            if (!btn) return {skipped:true, reason:'没有可做的菜'};
            const shown = btn.closest('.rcard').querySelector('h3').textContent;
            btn.click();
            await new Promise(r => setTimeout(r, 700));
            const after = JSON.parse(localStorage.getItem('fd.items.v1')||'[]');
            const log = JSON.parse(localStorage.getItem('fd.log.v1')||'[]');
            const sum = l => l.reduce((n,x)=>n+(x.qty==null?1:x.qty),0);
            return {dish: shown, beforeN: before.length, afterN: after.length,
                    beforeQty: sum(before), afterQty: sum(after),
                    log: log.slice(-1), toast: document.getElementById('toast').textContent};
        })()""")
        await shot("05-after-cook")

        # 手机
        await send(ws, nid(), "Emulation.setDeviceMetricsOverride",
                   width=390, height=844, deviceScaleFactor=2, mobile=True)
        await js("window.scrollTo({top:0,behavior:'instant'})")
        await asyncio.sleep(1.0)
        out["mobile"] = await js("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        await shot("06-mobile")
        await js("window.scrollTo({top:220,behavior:'instant'})"); await asyncio.sleep(.6)
        await shot("07-mobile-fridge")

        print(json.dumps(out, ensure_ascii=False, indent=1))
    p.kill()


asyncio.run(main(sys.argv[1], sys.argv[2]))
