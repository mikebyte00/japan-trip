#!/usr/bin/env bash
# Rebuild the offline map: one PMTiles extract per area in tiles/areas.json,
# plus the Protomaps glyphs and sprite. Needs network access to
# build.protomaps.com and github.com, plus python3 and either Go or curl+tar.
# Usage: tools/make-tiles.sh [YYYYMMDD]   (default: newest daily build)
set -euo pipefail
cd "$(dirname "$0")/.."

PMTILES_VERSION=1.22.3
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT

# 1. pmtiles CLI
if command -v pmtiles >/dev/null; then PMTILES=pmtiles
elif command -v go >/dev/null; then
  GOBIN="$WORK" go install "github.com/protomaps/go-pmtiles@v$PMTILES_VERSION"; PMTILES="$WORK/go-pmtiles"
else
  curl -fsSL "https://github.com/protomaps/go-pmtiles/releases/download/v$PMTILES_VERSION/go-pmtiles_${PMTILES_VERSION}_Linux_x86_64.tar.gz" | tar -xz -C "$WORK"
  PMTILES="$WORK/pmtiles"
fi

# 2. newest daily basemap build (they are kept for a limited time)
BUILD=${1:-}
if [ -z "$BUILD" ]; then
  for i in $(seq 0 14); do
    d=$(date -u -d "-$i day" +%Y%m%d)
    if curl -fsI "https://build.protomaps.com/$d.pmtiles" >/dev/null; then BUILD=$d; break; fi
  done
fi
[ -n "$BUILD" ] || { echo "no Protomaps build found in the last 15 days" >&2; exit 1; }
SRC="https://build.protomaps.com/$BUILD.pmtiles"
echo "source: $SRC"

# 3. one extract per area
python3 -c 'import json
for a in json.load(open("tiles/areas.json")):
    print(a["file"], ",".join(map(str, a["bbox"])), a["minzoom"], a["maxzoom"])' |
while read -r file bbox minz maxz; do
  echo "extract $file z$minz-$maxz"
  "$PMTILES" extract "$SRC" "$file" --bbox="$bbox" --minzoom="$minz" --maxzoom="$maxz"
done

# 4. glyphs (Latin ranges only; CJK labels use the device font) and the light sprite
curl -fsSL https://github.com/protomaps/basemaps-assets/archive/refs/heads/main.tar.gz | tar -xz -C "$WORK"
A="$WORK/basemaps-assets-main"
rm -rf vendor/glyphs vendor/sprites; mkdir -p vendor/sprites
for stack in "Noto Sans Regular" "Noto Sans Medium" "Noto Sans Italic"; do
  mkdir -p "vendor/glyphs/$stack"
  for start in $(seq 0 256 8192); do
    f="$start-$((start + 255)).pbf"
    [ -f "$A/fonts/$stack/$f" ] && cp "$A/fonts/$stack/$f" "vendor/glyphs/$stack/"
  done
done
cp "$A"/sprites/v4/light.json "$A"/sprites/v4/light.png vendor/sprites/
cp "$A"/sprites/v4/light@2x.json "$A"/sprites/v4/light@2x.png vendor/sprites/ 2>/dev/null || true

echo "build $BUILD" > tiles/SOURCE
du -ch tiles/*.pmtiles
