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

**Done this session:** all "Final review findings" are fixed (glyph ranges 0–65280 with empty fillers; `vendor/offline.json` saved with the maps; Nakasendo widened; 3 s trip.json timeout with cache fallback; per-day `tz`; data fixes; per-deploy cache-first shell; the deploy survives a failed map build). The OpenStreetMap credit no longer covers the Next button: it sits at the top on phones.
- First Pages runs: build OK, Pages set to GitHub Actions. `kansai` came out at 104 MB, so it was split into `kyoto`, `uji`, `nara` and `osaka`. Sizes are in `tiles/README.md`. Re-check the sizes after the next build.

**Still open:**
1. **Real-device check.** Test on an Android phone and tablet: install, save offline, and use airplane mode. Street rendering has still never been looked at.

**Deferred on purpose:** the reviewer suggested replacing the 16 day dots with a slider. The Prev/Next buttons cover this.

**Open data items for the user**, marked "To confirm" in the app:
- the Heathrow terminal;
- the return flight's Haneda terminal (assumed T3);
- the breakfasts marked "?";
- the Osaka afternoon and dinner (31 Oct);
- Byodoin is in Uji, not Osaka;
- Matsunoi Shurin's address (1-11-32 Hyakunincho, from one listing).
