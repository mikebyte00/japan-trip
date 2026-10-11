# Offline map files

Built by `tools/make-tiles.sh` from the Protomaps daily OpenStreetMap basemap
(© OpenStreetMap contributors). Areas and zoom ranges are in `areas.json`.

Every `.pmtiles` file must stay under 100 MB (GitHub's file limit); aim for
about 100 MB in total. If an area is too big, tighten its `bbox` to the places
visited, or lower its `maxzoom` to 14, in `areas.json`.

## Sizes

First CI build (Protomaps build 20261011, run 1 of `pages.yml`), extract sizes:

| Area | Size |
|---|---|
| japan (z0–8) | 9.8 MB |
| tokyo | 36 MB |
| matsumoto | 4.1 MB |
| nakasendo | 6.1 MB |
| kansai | **104 MB, over the limit** |
| hakone | 1.6 MB |
| yokohama | 5.4 MB |

So `kansai` was split into tight `kyoto`, `uji`, `nara` and `osaka` boxes, and
`nakasendo` was widened to take in the Torii-toge hike. Update this table from the
next run's `du -ch tiles/*.pmtiles` output.
