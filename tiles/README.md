# Offline map files

Built by `tools/make-tiles.sh` from the Protomaps daily OpenStreetMap basemap
(© OpenStreetMap contributors). Areas and zoom ranges are in `areas.json`.

Every `.pmtiles` file must stay under 100 MB (GitHub's file limit); aim for
about 100 MB in total. If it's much bigger, lower the `kansai` and `tokyo`
`maxzoom` to 14 in `areas.json` and re-run.

## Sizes

Not built yet: the build environment could not reach `build.protomaps.com`.
Until the files exist, the app shows the pins and route on a plain background.
Record the `du -ch tiles/*.pmtiles` output here after the first run.
