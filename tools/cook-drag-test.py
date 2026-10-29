"""拖拽自检：鼠标拖 + 触摸按住拖，都要真的进锅（且只进一次）。
用法: python tools/cook-drag-test.py http://127.0.0.1:8899/cook.html <outdir>
"""
import asyncio, base64, json, os, subprocess, sys, time, urllib.request
import websockets

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9337
PROFILE = os.path.join(os.environ["LOCALAPPDATA"], "Temp", "cdp-drag")


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
                          "--window-size=1440,1000", "--force-device-scale-factor=1", "about:blank"],
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
            r = await send(ws, nid(), "Runtime.evaluate", expression=e, returnByValue=True, awaitPromise=True)
            if r.get("exceptionDetails"):
                return {"EXC": str(r["exceptionDetails"])[:300]}
            return r.get("result", {}).get("value")
        async def shot(n):
            d = await send(ws, nid(), "Page.captureScreenshot", format="png")
            open(os.path.join(outdir, n + ".png"), "wb").write(base64.b64decode(d["data"]))
            print("SHOT", n)
        async def rect(sel):
            return await js(f"""(() => {{ const e = document.querySelector({sel!r});
                if (!e) return null; const r = e.getBoundingClientRect();
                return {{x:r.left+r.width/2, y:r.top+r.height/2, l:r.left, t:r.top, w:r.width, h:r.height}}; }})()""")

        await send(ws, nid(), "Page.enable"); await send(ws, nid(), "Runtime.enable")
        await send(ws, nid(), "Page.navigate", url=url); await asyncio.sleep(1.6)

        # 保证有货
        await js("""(async () => {
            const dem = document.getElementById('empty');
            if (dem && !dem.hidden) { document.getElementById('demoBtn').click(); await new Promise(r=>setTimeout(r,300)); }
            return document.querySelectorAll('.tile').length;
        })()""")
        chips = lambda: js("[...document.querySelectorAll('.chip span')].map(e=>e.textContent)")
        out = {}

        # ---------- A. 鼠标拖拽 ----------
        tile = await rect('.tile[data-cat="pork"]')
        pot = await rect('#pot')
        await send(ws, nid(), "Input.dispatchMouseEvent", type="mousePressed",
                   x=tile["x"], y=tile["y"], button="left", buttons=1, clickCount=1)
        for k in range(1, 9):
            await send(ws, nid(), "Input.dispatchMouseEvent", type="mouseMoved",
                       x=tile["x"] + (pot["x"] - tile["x"]) * k / 8,
                       y=tile["y"] + (pot["y"] - tile["y"]) * k / 8,
                       button="left", buttons=1)
            await asyncio.sleep(.03)
        out["mouse_mid_state"] = await js("""(() => ({
            ghosts: document.querySelectorAll('.drag-ghost').length,
            potCanDrop: document.getElementById('pot').classList.contains('can-drop'),
            potOver: document.getElementById('pot').classList.contains('over'),
            bodyDragging: document.body.classList.contains('is-dragging')
        }))()""")
        await shot("10-mouse-dragging")
        await send(ws, nid(), "Input.dispatchMouseEvent", type="mouseReleased",
                   x=pot["x"], y=pot["y"], button="left", buttons=0, clickCount=1)
        await asyncio.sleep(.5)
        out["after_mouse"] = {"chips": await chips(),
                             "ghosts_left": await js("document.querySelectorAll('.drag-ghost').length"),
                             "pressed": await js("[...document.querySelectorAll('.tile[aria-pressed=\"true\"]')].map(e=>e.dataset.cat)")}
        await shot("11-after-mouse-drop")

        # 清空选择，准备触摸测试
        await js("""(() => { [...document.querySelectorAll('.chip button')].forEach(b=>b.click()); })()""")

        # ---------- B. 触摸（按住 220ms 再拖） ----------
        await send(ws, nid(), "Emulation.setTouchEmulationEnabled", enabled=True, maxTouchPoints=5)
        await send(ws, nid(), "Emulation.setDeviceMetricsOverride",
                   width=390, height=844, deviceScaleFactor=2, mobile=True)
        await asyncio.sleep(.8)
        await js("window.scrollTo({top:0,behavior:'instant'})")
        await asyncio.sleep(.4)
        tile = await rect('.tile[data-cat="egg"]')
        pot = await rect('#pot')
        out["touch_rects"] = {"tile": tile, "pot": pot}

        async def touch(kind, pts):
            await send(ws, nid(), "Input.dispatchTouchEvent", type=kind,
                       touchPoints=[{"x": x, "y": y, "radiusX": 12, "radiusY": 12, "force": 1, "id": 1} for x, y in pts])

        await touch("touchStart", [(tile["x"], tile["y"])])
        await asyncio.sleep(.30)          # 按住，跨过 170ms 阈值
        out["touch_hold"] = await js("""(() => ({
            ghosts: document.querySelectorAll('.drag-ghost').length,
            canDrop: document.getElementById('pot').classList.contains('can-drop')
        }))()""")
        steps = 6
        for k in range(1, steps + 1):
            await touch("touchMove", [(tile["x"] + (pot["x"] - tile["x"]) * k / steps,
                                       tile["y"] + (pot["y"] - tile["y"]) * k / steps)])
            await asyncio.sleep(.04)
        out["touch_moving"] = await js("""(() => ({
            ghosts: document.querySelectorAll('.drag-ghost').length,
            over: document.getElementById('pot').classList.contains('over'),
            scrollY: window.scrollY
        }))()""")
        await shot("12-touch-dragging")
        await touch("touchEnd", [(pot["x"], pot["y"])])
        await asyncio.sleep(.5)
        out["after_touch"] = {"chips": await chips(),
                              "ghosts_left": await js("document.querySelectorAll('.drag-ghost').length"),
                              "scrollY": await js("window.scrollY")}
        await shot("13-after-touch-drop")

        # ---------- C. 回滚到冰箱首页：导航里有没有「下锅」 ----------
        await send(ws, nid(), "Emulation.setDeviceMetricsOverride",
                   width=390, height=844, deviceScaleFactor=2, mobile=True)
        await send(ws, nid(), "Page.navigate", url=url.replace("cook.html", "index.html"))
        await asyncio.sleep(2.0)
        out["nav_entry"] = await js("""(() => {
            const a = document.querySelector('a[href="cook.html"]');
            if (!a) return {found:false};
            const r = a.getBoundingClientRect();
            return {found:true, text: a.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height),
                    visible: r.top < innerHeight && r.bottom > 0,
                    navItems: document.querySelectorAll('.nav .navin > *').length};
        })()""")
        await shot("14-index-nav")

        print(json.dumps(out, ensure_ascii=False, indent=1))
    p.kill()


asyncio.run(main(sys.argv[1], sys.argv[2]))
