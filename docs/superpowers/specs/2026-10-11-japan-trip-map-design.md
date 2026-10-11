# Japan Trip Map: Design

## Intent

An app for one couple's 16-day trip to Japan (20 Oct to 4 Nov 2026). It does two jobs:

1. **Before the trip:** see the whole route on a map and get familiar with each day.
2. **During the trip:** open it each morning, usually on a phone, sometimes with no signal, and know what's happening today. That means where you sleep, the travel legs, anything at a fixed time, the activities, and any notes.

The trip notes are a working draft with gaps, so the app must make gaps visible and easy to fill in later.

## Goals

- An interactive real street map with one pin per stay. The pins are joined by a line in trip order.
- You can step through the days. Each step flies the map to that day's location and shows that day's card.
- A **daily card** with two states (see the mockups linked below):
  - **Collapsed (phone):** date and region, a short title for the day, where you sleep, and the next timed item (for example "17:30 hotel transfer").
  - **Expanded:** the full order of the day (timed and untimed items), sleep with an "Open in Maps" link, breakfast and dinner, travel legs, and notes. Unknowns ("?" or empty in the notes) show as "to confirm".
- On launch, the app opens on **today's card** when today falls within 20 Oct to 4 Nov (Japan time). Otherwise it opens on day 1.
- **Works offline.** After a one-time "Save for offline" while on wifi, the app, the trip data and the map for the trip areas all work with no signal. It can be added to a phone's home screen.
- **Phone and tablet layouts.** On a phone, the map fills the screen and the card is a bottom sheet you drag up to expand. On a tablet (landscape, roughly ≥ 900px), the map and the expanded card sit side by side.
- Smooth, polished animation (map fly-to, card transitions, pin states). It must respect reduced-motion settings.
- **Easy to edit.** All trip content lives in one human-editable data file in the repo. Changing a day means editing that file and pushing.

## Non-goals

- Editing inside the app, accounts, or syncing between devices. Edits are made in the data file.
- Turn-by-turn directions or live train times. The app links out to Google Maps instead.
- Bookings, budgets, packing lists, or weather.
- Desktop polish beyond "works". Phone first, tablet second.

## Anti-goals (what makes it a failure even if it works)

- On the trail with no signal, the app shows a blank map or no card.
- Unknowns are hidden or look confirmed when they aren't.
- It feels like a generic template: janky on a phone, or text too small to read on the move.

## Constraints and decisions made

- **Hosting (user's choice):** a static site on GitHub Pages from this repo (`mikebyte00/japan-trip`). There's no server.
- **Map (user's choice):** a real street map, cached for offline use. If that isn't workable, fall back to a custom illustrated map of Japan with the same pins and route.
- **Opening day (user's choice):** today's card if within the trip dates, otherwise day 1.
- **Card layout (user approved the mockups):** https://claude.ai/artifact/VTU1uFaHtmEGWECrompBT8. The look in the mockups is a placeholder; the layout and card content are what's approved.
- **Visual design (user's choice):** after the build plan, the impeccable skill sets the look, motion and polish.

## My calls (the user hasn't confirmed these)

- **Map approach:** MapLibre GL JS rendering vector map files in PMTiles format, cut from the Protomaps OpenStreetMap basemap and committed to the repo:
  - one Japan-wide low-zoom file for the overview (roughly zoom 0–8);
  - detailed street-level files (up to about zoom 15) around each area visited: Shinjuku/Shibuya, Haneda; Matsumoto and Kamikochi; the Nakasendo corridor from Kiso-Fukushima to Nakatsugawa; Nara/Kyoto/Osaka/Uji; Odawara and Hakone-Yumoto; Yokohama.
  - Map fonts (glyphs) and icons are hosted in the repo too, so nothing loads from a third party when offline.
  - This avoids OpenStreetMap's and Google's rules against bulk downloading map tiles. The target is under about 100 MB in total. If it's far bigger, reduce the zoom levels or area boxes before falling back to the illustrated map.
- **Offline:** a service worker caches the app and the trip data on first visit. The "Save for offline" button fetches the map files. A small badge shows whether offline maps are saved.
- **Stack:** plain static files with no build step if that's practical (HTML, CSS, JS modules, with MapLibre and pmtiles vendored into the repo). The builder may add a minimal build step if it's clearly better.
- **Data file:** `data/trip.json` (or YAML if the builder prefers). It has a list of stays (name, address, lat/lng, Google Maps link) and a list of days. Each day has: date, region, title, start, sleep (a stay reference), breakfast, dinner, items (each with an optional time, text and optional kind such as travel, activity or meal), and notes. A missing or "?" field is shown as "to confirm".
- **Pins:** one per **stay** (about 10). Day trips (Kamikochi, Kyoto, Osaka) don't get their own pin; the card says where you are going. Days that share a stay highlight the same pin. The flight days (20 Oct and 4 Nov) show London ↔ Haneda as the trip's start and end, not a Japan pin.
- **Day count:** 16 cards, 20 Oct to 4 Nov inclusive.
- **Navigation:** swipe the card or tap the arrows to move between days. Tapping a pin jumps to the first day of that stay. A day-dot strip shows where you are.
- **"Next timed item"** on the collapsed card: on today's card, the next timed item after the current Japan time. On other days, the first timed item of the day.
- **Preparation note** (Suica/Pasmo) goes on the day 1 card.

## Data clean-up in the first version

The source notes are in `docs/itinerary-notes.md`. Coordinates come from the addresses. These look like slips in the notes, and the builder should fix them in the data and flag each one with a note on its card:

- 3 and 4 Nov are a Tuesday and a Wednesday. The notes call both "Tuesday".
- 3 Nov "Start" says Odawara; it should be Hakone-Yumoto (RoheN).
- 3 Nov sleep is Sotetsu Hotels The Splaisir Yokohama, not RoheN. 4 Nov "Stay" (RoheN) is wrong; that's the flight home, so there's no stay.
- 2 Nov dinner "Station (~2 hrs)" and 1 Nov dinner (a pasted train line) were pasted in by mistake. Use the itinerary's dinner lines instead (Odawara Fishermen's Wharf; local dining).
- Return flight: Haneda has no Terminal 5. Assume Terminal 3 and mark it "to confirm". The Heathrow terminal is unknown.
- "Matsumoto status" on 25 Oct means Matsumoto station.
- 31 Oct mentions Byodoin (in Uji, not Osaka). Keep it as written; it's the user's to sort out.

## Left to the builder

The file layout, the exact data format, the tooling to make PMTiles extracts, the bottom-sheet implementation, and the test approach. Testing should include at least checking the data file (every day has a date, every stay has coordinates) and the "which day opens" logic.
