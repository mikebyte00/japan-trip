# Handoff: Japan Trip Map

**Status (2026-10-11):** Plan Tasks 1–6 are built and pushed to `claude/nifty-bell-1byy5f` (`mikebyte00/japan-trip`). There are 19 tests (`npm test`) and all pass. Keep working on this branch, and don't open a PR unless the user asks.

**Read first:**
- `docs/superpowers/specs/2026-10-11-japan-trip-map-design.md`
- `docs/superpowers/plans/2026-10-11-japan-trip-map.md`
- `PRODUCT.md`
- `DESIGN.md` (the tenugui look: indigo dye, cotton, persimmon for anything timed, a stencil band per region)
- `.impeccable/surfaces/index-html.md` (the direction contract)

**How it works:**
- Static site, no build step.
- Content lives in `data/trip.json`.
- Logic is in `js/trip.js` and `js/card.js`, and is tested.
- The map is MapLibre plus local PMTiles (`js/map.js`).
- Offline is handled by `sw.js`, with the "Save for offline" button in `js/app.js`.

**Deploy:**
- `.github/workflows/pages.yml` runs the tests, then `tools/make-tiles.sh`, then deploys to Pages.
- The map files, glyphs and sprite are built in CI and cached by a hash of `tiles/areas.json`. They are not committed.
- The user removed their duplicate `static.yml`.

**Not yet verified:**
1. **The first Pages run.** Check that Pages is set to "GitHub Actions", that `make-tiles.sh` succeeds in CI, and that every `.pmtiles` file is under 100 MB. Record the sizes in `tiles/README.md`. The dev container can't reach `build.protomaps.com`, so street-map rendering has never been seen.
2. **Offline map labels.** Glyph and sprite files aren't fetched by "Save for offline", so labels may be missing offline in areas never viewed online. Fix this by having `saveOffline()` also fetch the glyph ranges and sprites.
3. **Real-device check.** Test on an Android phone and tablet: install, save offline, and use airplane mode.

**Deferred on purpose:** the reviewer suggested replacing the 16 day dots with a slider. The Prev/Next buttons cover this.

**Open data items for the user**, marked "To confirm" in the app:
- the Heathrow terminal;
- the return flight's Haneda terminal (assumed T3);
- the breakfasts marked "?";
- the Osaka afternoon and dinner (31 Oct);
- Byodoin is in Uji, not Osaka.

**Final review findings, not yet fixed. Do these first, in this order:**
1. **Missing map fonts can blank whole map squares.** `tools/make-tiles.sh` copies glyph ranges only up to 8447. Characters such as ー, ・ and （） then 404, and in MapLibre 4.7.1 that blanks the whole tile. Fix: loop the ranges 0–65280 and write an empty `.pbf` for any range the font lacks.
2. **"Save for offline" skips glyphs and sprites.** Offline, that blanks tiles the same way. Fix: have CI write a list of the glyph and sprite files, and include it in `saveOffline` and `savedCount`. (This replaces the "offline map labels" item above.)
3. **The Torii-toge hike is outside the detailed map.** Yabuhara (about 35.93N, 137.77E) falls outside the extract areas. Fix: in `tiles/areas.json`, widen the `nakasendo` bbox to about N 36.0 and E 137.85.
4. **A weak signal can blank the screen.** `trip.json` is fetched network-first with no timeout, and `!res.ok` responses aren't caught. Fix: add a timeout of about 3 s and fall back to the cached copy on timeout or `!res.ok`.
5. **Departure morning shows no next item.** Day 1's times are London times but are compared in Tokyo time. Fix: add a per-day `tz` and use it in `nextTimed`.
6. **Smaller items:**
   - Change `fromTerminal: "3 (to confirm)"` to `"?"` so it renders as "To confirm".
   - Drop the false "3 Nov is a Tuesday" fix note.
   - Replace the placeholder coordinates for Matsunoi and Komanoyu with real ones.
   - Version the shell cache per deploy, so a half-updated set of JS modules can't break the app.
   - Let the deploy continue if the map rebuild fails.

(The review's two-workflows finding is already fixed: `static.yml` is deleted.)
