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

**Note:** a final whole-branch bug review was still running when this session ended, and its results weren't captured. Rerun one: check the service worker, the Tokyo date logic, the data against `docs/itinerary-notes.md`, and the workflow.
