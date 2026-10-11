# Offline map files

Built by `tools/make-tiles.sh` from the Protomaps daily OpenStreetMap basemap
(© OpenStreetMap contributors). Areas and zoom ranges are in `areas.json`.

Every `.pmtiles` file must stay under 100 MB (GitHub's file limit); aim for
about 100 MB in total. If an area is too big, tighten its `bbox` to the places
visited, or lower its `maxzoom` to 14, in `areas.json`.

## Sizes

Run 8 of `pages.yml` (Protomaps build 20261011), extract sizes. All are under 100 MB,
about 88 MB in total:

| Area | Size |
|---|---|
| japan (z0–8) | 9.8 MB |
| tokyo | 36 MB |
| matsumoto | 4.1 MB |
| nakasendo | 11 MB |
| kyoto | 6.2 MB |
| uji | 2.8 MB |
| nara | 3.4 MB |
| osaka | 7.6 MB |
| hakone | 1.6 MB |
| yokohama | 5.4 MB |

The first build had one `kansai` area at 104 MB, over the limit, so it was split
into the tight `kyoto`, `uji`, `nara` and `osaka` boxes above.
