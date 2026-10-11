# Handoff: Japan Trip Map build

**Status (2026-10-11):** Design approved and plan written. No product code exists yet.

**Branch:** `claude/nifty-bell-1byy5f` on `mikebyte00/japan-trip`. Develop and push here. Don't open a PR unless the user asks.

**Read first:**
- Spec: `docs/superpowers/specs/2026-10-11-japan-trip-map-design.md`
- Plan: `docs/superpowers/plans/2026-10-11-japan-trip-map.md`
- Source notes: `docs/itinerary-notes.md`
- Approved card mockups: https://claude.ai/artifact/VTU1uFaHtmEGWECrompBT8. The layout and content are approved; the look is a placeholder.

**Execution method chosen by the user:** Native.
1. Use `superpowers:executing-plans`.
2. Implement Tasks 1 to 6 yourself, in order, committing after each task.
3. Task 5 must invoke the `impeccable:impeccable` skill for the visual design and animation.
4. When the build is done, have one fresh reviewer on the most capable model check the whole branch.

**Decisions made with the user:**
- Hosting is GitHub Pages and the repo can be public. The user's home address must never appear anywhere.
- Devices are Android only, Chrome on a phone and a tablet.
- The map is a real street map saved for offline use. If it's unworkable, fall back to a custom illustrated map.
- On open, show today's card (Japan time) during 20 Oct to 4 Nov 2026; otherwise show day 1.

**Watch out for:**
- The PMTiles size is unverified. Each file must be under 100 MB.
- Outbound network access goes through a proxy. If downloading `build.protomaps.com` or the pmtiles CLI fails, check the environment's network policy (use `read_documentation`, topic `environment.network`).
