# Japan Trip Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static, offline-capable map of the 16-day Japan trip with a daily card per day, hosted on GitHub Pages.

**Architecture:** Plain static files, no build step. `data/trip.json` holds all content. Pure logic lives in `js/trip.js` and is unit-tested with Node's built-in test runner. `js/app.js` renders a MapLibre map from local PMTiles files and the card UI. `sw.js` handles offline: the app shell is cache-first, `trip.json` is network-first, and map files are cached on "Save for offline".

**Tech Stack:** HTML/CSS/ES modules; MapLibre GL JS 4.7.1 and pmtiles 3.2.1 (vendored into `vendor/`); Protomaps basemap (OpenStreetMap data) via the `pmtiles` CLI; `node --test` (Node ≥ 20) for tests; GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-11-japan-trip-map-design.md` (source notes: `docs/itinerary-notes.md`)

## Global Constraints

- Trip dates: 2026-10-20 to 2026-11-04 inclusive, so 16 days. The "today" logic uses the `Asia/Tokyo` time zone.
- Never include the user's home address or any home location. London is only "Home" / "Heathrow T5".
- Target Chrome on Android, phone and tablet. The side-by-side layout applies at widths ≥ 900px.
- No runtime requests to third-party hosts. Everything, including map glyphs and sprites, is served from the repo.
- Unknown values ("?", empty, or missing) display as "To confirm".
- Each map file must be < 100 MB (GitHub's file limit). The aim is a total under about 100 MB.
- Respect `prefers-reduced-motion` for map fly-to and card animations.

## Review Focus

- **Opening near midnight Japan time, or from a UK clock:** the app must open on the Japan-time date's card. This is tested in Task 1 (`todayIndex` with UTC timestamps on either side of 15:00Z).
- **Opening with no signal before "Save for offline" was ever pressed:** the app shell and card still load, and the map shows the pins and route on a blank background. This is checked by hand in Task 4, step 4.
- **A day with no timed items, or only untimed items:** the collapsed card shows no "next" row rather than a broken one. Tested in Task 1 (`nextTimed` returns `null`).
- **Today's last timed item has already passed:** `nextTimed` returns `null`, not the first item. Tested in Task 1.
- **Panning outside the detailed areas:** the overview map still shows; nothing errors. Checked by hand in Task 3, step 5.

---

### Task 1: Trip data and day logic

**Files:**
- Create: `data/trip.json`, `js/trip.js`, `test/trip.test.js`, `package.json` (`{"type":"module","scripts":{"test":"node --test"}}`)

**Interfaces:**
- Produces, in `js/trip.js`:
  - `todayIndex(days: Day[], now: Date) -> number`. Returns the index of the day whose `date` equals the Asia/Tokyo calendar date of `now`, otherwise `0`.
  - `nextTimed(day: Day, now: Date|null) -> Item|null`. If `now` is on the same Tokyo date as `day.date`, returns the first item with `time` ≥ the current Tokyo HH:MM. If `now` is null or another date, returns the first timed item. Returns `null` if there isn't one.
  - `display(v: any) -> string`. Returns `"To confirm"` for `undefined`, `null`, `""`, or any string containing only `?`; otherwise returns `v`.
  - `validate(trip: Trip) -> string[]`. Returns a list of error messages; empty means valid.
- Data shape for `trip.json`:
  - `{ stays: Stay[], days: Day[], flights: {out, back} }`
  - `Stay = {id, name, address, lat, lng, mapsUrl}`
  - `Day = {date:"YYYY-MM-DD", region, title, start, stay: stayId|null, breakfast, dinner, items: [{time?:"HH:MM", text, kind?:"travel"|"activity"|"meal"}], notes: string[]}`

- [ ] **Step 1: Write `data/trip.json`** from `docs/itinerary-notes.md`.
  - Write 16 days and 9 stays: Matsunoi Shurin, Nunoya, Komanoyu, Magome Chaya, hatago STAY Shinmachi, Onyado Nono Nara, Ryokan Plum (Odawara), RoheN Hakone-Yumoto, Sotetsu Splaisir Yokohama.
  - Look up the coordinates from each address.
  - Apply the spec's "Data clean-up" list. Each fix adds an entry to that day's `notes`, starting "Fixed from notes:".
  - Put the Suica/Pasmo note in day 1's `notes`.
  - Day 1 and day 16 have `stay: null` and point to `flights`.
- [ ] **Step 2: Write failing tests in `test/trip.test.js`:**
  - `todayIndex(days, new Date("2026-10-25T14:59:00Z"))` returns the index of `2026-10-25`.
  - `todayIndex(days, new Date("2026-10-25T15:01:00Z"))` returns the index of `2026-10-26`.
  - `todayIndex(days, new Date("2026-12-01T00:00:00Z"))` returns `0`.
  - `nextTimed(day25, new Date("2026-10-25T05:00:00Z"))` returns the item with `time` `"17:30"` (14:00 JST).
  - `nextTimed(day25, new Date("2026-10-25T09:00:00Z"))` returns `null` (18:00 JST, after the last item).
  - `nextTimed({items:[{text:"x"}]}, null)` returns `null`.
  - `display("?")` and `display("")` return `"To confirm"`; `display("Soba")` returns `"Soba"`.
  - `validate(real trip.json)` returns `[]`. It must check: there are 16 days with consecutive dates; every non-null `stay` exists; every stay has numeric `lat`/`lng` inside Japan's rough bounds (lat 24–46, lng 122–146); no field matches `/home address/i`.
- [ ] **Step 3: Run `npm test`.** Expected: FAIL, because the module has no exports yet.
- [ ] **Step 4: Implement `js/trip.js`.** Use `Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo', ...})` to get the Tokyo date and HH:MM. Don't use any date library.
- [ ] **Step 5: Run `npm test`.** Expected: all tests PASS.
- [ ] **Step 6: Commit** with the message `feat: trip data and day logic`.

### Task 2: Offline map files

**Files:**
- Create: `tools/make-tiles.sh`, `tiles/*.pmtiles`, `tiles/areas.json`, `vendor/glyphs/**`, `vendor/sprites/*`

**Interfaces:**
- Produces:
  - `tiles/areas.json`, an array of `{id, file, bbox:[w,s,e,n], minzoom, maxzoom}`.
  - One `tiles/<id>.pmtiles` file per area.
  - Glyphs at `vendor/glyphs/{fontstack}/{range}.pbf`.
  - Sprites at `vendor/sprites/light{,.json,.png}`.

- [ ] **Step 1: Write `tools/make-tiles.sh`.**
  - It downloads the `pmtiles` CLI (go-pmtiles v1.22.x).
  - For each area, it runs `pmtiles extract https://build.protomaps.com/<latest YYYYMMDD>.pmtiles tiles/<id>.pmtiles --bbox=... --maxzoom=...`.
  - It uses these areas:

    | id | bbox (w,s,e,n) | zoom |
    |---|---|---|
    | `japan` | 128.0,30.0,146.0,46.0 | 0–8 |
    | `tokyo` | 139.65,35.50,139.80,35.72 (includes Haneda) | 9–15 |
    | `matsumoto` | 137.55,36.15,138.00,36.30 (includes Kamikochi) | 9–15 |
    | `nakasendo` | 137.45,35.45,137.75,35.88 | 9–15 |
    | `kansai` | 135.40,34.60,135.90,35.05 (Nara, Kyoto, Osaka, Uji) | 9–15 |
    | `hakone` | 139.08,35.20,139.18,35.27 | 9–15 |
    | `yokohama` | 139.60,35.43,139.68,35.48 | 9–15 |

  - It also copies the Protomaps basemaps assets: Noto Sans glyphs, plus the `light` sprite.
- [ ] **Step 2: Run the script, then run `du -ch tiles/*.pmtiles`.**
  - Expected: every file is under 100 MB.
  - If the total is over about 150 MB, lower the `kansai` and `tokyo` max zoom to 14 and re-run.
  - Record the final sizes in `tiles/README.md`.
- [ ] **Step 3: Commit** with the message `feat: offline map extracts`.

### Task 3: Map and daily card

**Files:**
- Create: `index.html`, `css/app.css`, `js/app.js`, `js/map.js`, `js/card.js`, `vendor/maplibre-gl.{js,css}`, `vendor/pmtiles.js`
- Test: by hand in Chrome DevTools device mode (Pixel 7, and a tablet at 1280×800)

**Interfaces:**
- Consumes: `trip.js` exports (Task 1); `tiles/areas.json` and the vendored map assets (Task 2).
- Produces:
  - `createMap(el, trip, areas) -> {flyToDay(day), onPinTap(cb)}`, in `js/map.js`.
  - `renderCard(el, day, trip, now) -> void`, in `js/card.js`.

- [ ] **Step 1: Map.**
  - Register the `pmtiles://` protocol. Add one vector source per area and stack the layers with each area's zoom range, using the `protomaps-themes-base` light layers.
  - Draw the route as a line through the stays in trip order. For the flight days, draw a dashed line out toward the edge of the map.
  - Add a pin per stay. The current stay's pin gets the `on` style.
- [ ] **Step 2: Card**, matching the approved mockup.
  - Collapsed: eyebrow (date · region), title, sleep, and the `nextTimed` row (omit the row if it's `null`).
  - Expanded adds:
    - the day's timeline (items, with untimed ones shown in muted text);
    - the sleep section with an "Open in Maps ↗" link (`stay.mapsUrl`);
    - meals (through `display`);
    - notes.
  - Flight days show the flight details instead of a sleep section.
- [ ] **Step 3: Navigation.**
  - Prev/next buttons, a swipe on the card (horizontal pointer drag over 50px), and a day-dot strip.
  - Tapping a pin goes to the first day of that stay.
  - Each change calls `flyToDay`.
  - On load, open on `todayIndex(trip.days, new Date())`.
- [ ] **Step 4: Layout.**
  - Below 900px: the card is a bottom sheet. Dragging the handle up or down switches between collapsed and expanded.
  - At 900px and above: the map is on the left and the expanded card on the right.
- [ ] **Step 5: Check by hand** using `python3 -m http.server`.
  - Step through all 16 days on both viewports.
  - Pan to Hokkaido: only the overview map shows, and the console has no errors.
  - Run `npm test`; it still passes.
- [ ] **Step 6: Commit** with the message `feat: map and daily card`.

### Task 4: Offline and installable

**Files:**
- Create: `sw.js`, `manifest.webmanifest`, `icons/icon-192.png`, `icons/icon-512.png`
- Modify: `index.html` (link the manifest), `js/app.js` (register the service worker; add the save button and badge)

**Interfaces:**
- Consumes: `tiles/areas.json` (Task 2).
- Produces:
  - Cache names `shell-v1` and `tiles-v1`.
  - A `saveOffline()` function in `js/app.js`.

- [ ] **Step 1: `sw.js`.**
  - On install, precache the app shell: HTML, CSS, JS, vendor files, glyphs, sprites, `areas.json`.
  - `data/trip.json` is network-first with a cache fallback.
  - `tiles/*.pmtiles` requests are served from `tiles-v1`, and range requests are handled by slicing the cached full response. Anything else is cache-first.
- [ ] **Step 2: `saveOffline()`.**
  - Call `navigator.storage.persist()`.
  - Fetch each full `.pmtiles` file into `tiles-v1`, showing progress ("Saving maps 3/7").
  - Set the badge to "Saved offline" when every file is cached. The badge checks the cache on load.
- [ ] **Step 3: Manifest.** Name "Japan Trip", `display: standalone`, theme colour taken from the CSS tokens.
- [ ] **Step 4: Check by hand** in Chrome device mode.
  - Load the app, save offline, set the network to Offline, and reload. The map, pins and card all work.
  - Clear the site data, load once, go offline without saving, and reload. The shell, card and pins all work.
  - Lighthouse marks the app as installable.
- [ ] **Step 5: Commit** with the message `feat: offline support`.

### Task 5: Visual design pass

**Files:**
- Modify: `css/app.css`, `js/card.js`, `js/map.js` (styling only)

- [ ] **Step 1:** Invoke the `impeccable:impeccable` skill on the running app to set typography, colour, map styling, pin and route styling, and motion. Motion covers the card sheet transitions, the fly-to between days, and the pin pulse.
- [ ] **Step 2: Check.** `npm test` passes. Reduced motion turns off the fly-to animation (the map jumps instead) and the sheet animations. Repeat the Task 3 step 5 walkthrough.
- [ ] **Step 3: Commit** with the message `style: visual design pass`.

### Task 6: Publish on GitHub Pages

**Files:**
- Create: `.github/workflows/pages.yml` (run `npm test`, then deploy the repo root with `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`), and `README.md` (how to edit `data/trip.json`, how to re-run `tools/make-tiles.sh`, how to save offline)

- [ ] **Step 1:** Add the workflow and README. Push.
- [ ] **Step 2:** Tell the user to enable Pages, with the source set to "GitHub Actions" (repo Settings → Pages). They then open the URL on their Android phone and run "Save for offline".
- [ ] **Step 3: Commit** with the message `chore: deploy to GitHub Pages`.
