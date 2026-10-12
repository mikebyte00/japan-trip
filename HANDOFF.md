# Handoff: Japan trip itinerary (next session)

Trip: 20 Oct – 4 Nov 2026. App is a static PWA deployed to GitHub Pages from `main`.

## Where things stand
- `main` (`b358ec8`) has everything; the live site deployed that commit.
- `claude/relaxed-cori-wjhb1w` was merged via mikebyte00/japan-trip#1. Start the next branch fresh from `main`.
- `claude/nifty-bell-1byy5f` is fully merged but still on GitHub; delete it from the Branches page (the session couldn't).
- GitHub Pages environment now only allows deploys from `main`. The last `main` deploy run was cancelled (not failed), so the first future push is the real test of that setting.

## How to edit the itinerary
- All trip data lives in `data/trip.json` (`flights`, `booking`, `stays`, `days`).
- Each day: `date`, `region`, `title`, `start`, `stay` (stay id), `breakfast`, `dinner`, `items`, `notes`.
- Item: `{ "time"?: "HH:MM", "text", "kind": travel|activity|meal|todo, "url"? }`. `kind` isn't rendered; `url` shows a "Timetable" link.
- The first timed item after "now" is the card's "next up" line, so adding `time` changes it.
- Run `npm test` (node --test) after edits. Tests pin a few values for 25 Oct (`test/card.test.js`, `test/trip.test.js`), e.g. the "Torii-toge Pass" title, 07:42 and 17:30.
- Phones cache the app: after a deploy, fully close and reopen it (maybe twice) to see changes.

## Done this session
- **25 Oct** — 07:42 Matsumoto → Narai (08:44, train 1824M); coffee and food in Narai; hike Narai → Yabuhara over Torii-toge Pass (~6 km, 3–3.5 h); 13:23 (or 14:27) Yabuhara → Kiso-Fukushima with the NAVITIME timetable link; 17:30 hotel shuttle to Komanoyu.
- **24 Oct** — TODO: ask Nunoya Ryokan staff to send suitcases by takkyubin to hatago STAY Shinmachi, Nakatsugawa (check-in 27 Oct). Nunoya confirmed they can arrange it.

## Open items
- Confirm hatago STAY Shinmachi can receive the suitcases before 27 Oct check-in.
- You'll be without suitcases on 25 Oct (Komanoyu) and 26 Oct (Magome Chaya): pack a day bag.
- Recheck the 25 Oct train times against JR's timetable nearer the date (JR Central publishes each month's schedule a month ahead). The 13:23 is tight after the hike; the 14:27 is safer. Train number 1824M and the timetable link were not verified.
- Meals still "?": breakfast on 22 (dinner too), 23, 30, 31 Oct and 1, 2, 4 Nov; 20 Oct breakfast is "On the go?".
- Gaps: 31 Oct "Afternoon: ?"; 30 Oct "Nintendo Museum?" (unconfirmed).
- Optional cleanup: `.github/workflows/pages.yml` still triggers on `claude/nifty-bell-1byy5f`; remove once that branch is deleted.
