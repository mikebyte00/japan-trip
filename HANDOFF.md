# Handoff: enriching the Japan trip itinerary

Trip: 20 Oct – 4 Nov 2026 (Michael and Sophie). The app is a static PWA; GitHub Pages deploys only from `main`.

## Git state
- Everything is merged to `main`: mikebyte00/japan-trip#1 (24–25 Oct), mikebyte00/japan-trip#2 (21, 26–28 Oct), mikebyte00/japan-trip#3 (20, 24, 27–29 Oct incl. the Nara rework).
- After a squash merge, restart the work branch from `origin/main` before new commits.
- `claude/nifty-bell-1byy5f` may still exist on GitHub; it's fully merged and safe to delete (the session's git access couldn't).

## How to edit
- All trip data is in `data/trip.json` (`flights`, `booking`, `stays`, `days`).
- Day: `date`, `region`, `title`, `start`, `stay` (stay id), `breakfast`, `dinner`, `items`, `notes`.
- Item: `{ "time"?: "HH:MM", "text", "kind": travel|activity|meal|todo, "url"?, "linkText"? }`.
  - `kind` isn't rendered; TODOs are written as "TODO: ..." in the text.
  - `url` renders a link labelled `linkText` (default "Timetable").
  - The first timed item after "now" becomes the card's "next up" line.
- Alternatives (two train options, fallbacks) go as untimed items with times in the text, or in `notes`.
- Run `npm test` after every edit. Tests pin some 25 Oct values (title contains "Torii-toge Pass", 07:42 first timed item, 17:30) and the 27 Oct "Trail map" link label.
- The app reloads itself once when a new version installs; if not, close and reopen it.

## Day-by-day status
| Date | Day | State |
|---|---|---|
| 20 Oct | Fly to Japan | Done; TODO book Heathrow T5 parking |
| 21 Oct | Land, Shinjuku | TODO book 28 Oct Nara trains |
| 22 Oct | Meiji Jingu, Harajuku, Shibuya | Thin: no times, breakfast and dinner "?" |
| 23 Oct | Azusa to Matsumoto Castle | 1 timed item; breakfast "?" |
| 24 Oct | A simple Matsumoto day | Untimed; options in notes, Kamikochi as alternative; takkyubin TODO |
| 25 Oct | Torii-toge Pass: Narai to Yabuhara | Detailed |
| 26 Oct | Tsumago to Magome | Detailed |
| 27 Oct | Ochiai cobblestones to Nakatsugawa | Detailed with rough timings |
| 28 Oct | Trains to Nara, Kofuku-ji and Naramachi | Detailed; AONIYOSHI / Miyakoji options, afternoon timed |
| 29 Oct | Nara Park, Todai-ji, Kasuga Taisha | Detailed and timed; rainy-day swap |
| 30 Oct | Day trip to Kyoto | Thin; "Nintendo Museum?" unconfirmed; breakfast "?" |
| 31 Oct | Day trip to Osaka | Thin; "Afternoon: ?"; breakfast "?" |
| 1 Nov | Shinkansen to Odawara Castle | 1 timed item; breakfast "?" |
| 2 Nov | Up to Hakone-Yumoto | Thin: no times; breakfast "?" |
| 3 Nov | Daimyo procession, Yokohama | Partly timed |
| 4 Nov | Fly home | Breakfast "?" |

Suggested next: 22 Oct, 30–31 Oct and 2 Nov have the least detail.

## Open questions and checks
- Confirm hatago STAY Shinmachi can receive the suitcases before the 27 Oct check-in; pack a day bag for 25–26 Oct.
- Recheck train times nearer the date (JR Central publishes a month ahead): 25 Oct (13:23 tight, 14:27 safer; train number 1824M not verified), 26 Oct (09:08 listed as arriving 10:02 but noted as 45 min), 28 Oct.
- Not checked: Toson Memorial Museum hours, Onyado Nono check-in time, Alps Park coaster (listed as summer-only).
- None of the links added (NAVITIME, japan-guide, Gifu/Nakatsugawa guides) were opened to verify.
