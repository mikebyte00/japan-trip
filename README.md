# Japan Trip Map

A map of our 16-day trip (20 Oct – 4 Nov 2026), with a card for each day. It works offline on Android Chrome.

## Use it

1. Open the site on your phone.
2. Install it: Chrome menu → **Add to Home screen**.
3. On wifi, tap **Save for offline**. This downloads the street maps, which are tens of MB.

The app opens on today's card (Japan time) during the trip, and on day 1 at any other time. When you have signal, it fetches the latest trip details; without signal it uses the saved copy.

## Edit the trip

Everything is in `data/trip.json`. Edit it and push, and the site redeploys. Any field left empty or set to `"?"` shows as **To confirm**. Run `npm test` before pushing; it checks the dates, the stays and the coordinates.

## Maps

The deploy workflow builds the street maps (`tools/make-tiles.sh`, areas listed in `tiles/areas.json`) from the Protomaps OpenStreetMap basemap. If you change `areas.json`, the maps are rebuilt on the next deploy. Map data © OpenStreetMap contributors.

## Publish

Go to repo **Settings → Pages → Source: GitHub Actions**. Every push to `main` (or the working branch) deploys.
