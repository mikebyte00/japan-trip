/* global maplibregl, pmtiles, basemaps */
// The street map: local PMTiles areas (when built), the route, and one pin per stay.

const HANEDA = [139.7798, 35.5494];

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const base = new URL('.', location.href).href;

// Only areas whose file was built; missing tiles leave pins and route on a plain background.
async function builtAreas(areas) {
  const ok = await Promise.all(areas.map((a) =>
    fetch(a.file, { method: 'HEAD' }).then((r) => r.ok, () => false)));
  return areas.filter((_, i) => ok[i]);
}

function style(areas) {
  const s = {
    version: 8,
    sources: {},
    layers: [{ id: 'bg', type: 'background', paint: { 'background-color': getCss('--sea', '#d7dde3') } }],
  };
  if (!areas.length) return s;
  s.glyphs = `${base}vendor/glyphs/{fontstack}/{range}.pbf`;
  s.sprite = `${base}vendor/sprites/light`;
  const flavor = basemaps.namedFlavor(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  for (const a of areas) {
    s.sources[a.id] = { type: 'vector', url: `pmtiles://${base}${a.file}`, attribution: '© OpenStreetMap' };
    const detail = a.minzoom > 0;
    for (const l of basemaps.layers(a.id, flavor, { lang: 'en' })) {
      if (l.type === 'background') continue;
      const layer = { ...l, id: `${a.id}-${l.id}` };
      // Overview labels give way to the detailed areas' labels once zoomed in.
      if (!detail && l.type === 'symbol') layer.maxzoom = Math.min(l.maxzoom ?? 24, 10);
      if (detail) layer.minzoom = Math.max(l.minzoom ?? 0, a.minzoom);
      s.layers.push(layer);
    }
  }
  return s;
}

function getCss(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export async function createMap(el, trip, areas) {
  const protocol = new pmtiles.Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);

  const stays = new Map(trip.stays.map((s) => [s.id, s]));
  const order = [];
  for (const d of trip.days) if (d.stay && order.at(-1) !== d.stay) order.push(d.stay);
  const route = order.map((id) => [stays.get(id).lng, stays.get(id).lat]);

  const built = await builtAreas(areas);
  const map = new maplibregl.Map({
    container: el,
    style: style(built),
    bounds: [[135.3, 34.5], [140.0, 36.5]],
    fitBoundsOptions: { padding: 40 },
    maxBounds: [[110, 20], [160, 50]],
    attributionControl: { compact: true },
    localIdeographFontFamily: 'sans-serif',
  });

  let tapCb = () => {};
  const pins = new Map();
  for (const id of order) {
    const s = stays.get(id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pin';
    b.setAttribute('aria-label', s.name);
    b.addEventListener('click', (e) => { e.stopPropagation(); tapCb(id); });
    pins.set(id, b);
    new maplibregl.Marker({ element: b }).setLngLat([s.lng, s.lat]).addTo(map);
  }

  // The trip so far is solid green; the rest stays dashed indigo. The airport legs
  // (Haneda → first stay, last stay → Haneda) are dotted, green once travelled.
  let current = null;
  const line = (coordinates, props = {}) => ({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates } });
  const done = (day) => {
    const last = day && day === trip.days.at(-1);
    const i = day?.stay ? order.indexOf(day.stay) + 1 : last ? order.length : 0;
    return line(i > 1 ? route.slice(0, i) : []);
  };
  const airport = (day) => {
    const last = day && day === trip.days.at(-1);
    return { type: 'FeatureCollection', features: [
      line([HANEDA, route[0]], { done: Boolean(day?.stay || last) }),
      line([route.at(-1), HANEDA], { done: Boolean(last) }),
    ] };
  };

  // Runs on first load and again after a theme change swaps the style.
  map.on('style.load', () => {
    const color = getCss('--route', '#1d3557'), green = getCss('--route-done', '#2f7d4f');
    const round = { 'line-cap': 'round', 'line-join': 'round' };
    map.addSource('route', { type: 'geojson', data: line(route) });
    map.addLayer({ id: 'route', type: 'line', source: 'route', layout: round, paint: { 'line-color': color, 'line-width': 2, 'line-dasharray': [1, 2], 'line-opacity': 0.45 } });
    map.addSource('airport', { type: 'geojson', data: airport(current) });
    map.addLayer({ id: 'airport', type: 'line', source: 'airport', layout: round, paint: {
      'line-color': ['case', ['get', 'done'], green, color], 'line-opacity': ['case', ['get', 'done'], 1, 0.45],
      'line-width': ['case', ['get', 'done'], 4, 3], 'line-dasharray': [0, 2] } });
    map.addSource('route-done', { type: 'geojson', data: done(current) });
    map.addLayer({ id: 'route-done', type: 'line', source: 'route-done', layout: round, paint: { 'line-color': green, 'line-width': 4 } });
  });

  return {
    map,
    flyToDay(day) {
      current = day;
      map.getSource('route-done')?.setData(done(day));
      map.getSource('airport')?.setData(airport(day));
      for (const [id, b] of pins) b.classList.toggle('on', id === day.stay);
      const s = stays.get(day.stay);
      const target = s ? { center: [s.lng, s.lat], zoom: 12.5 } : { center: HANEDA, zoom: 6 };
      if (reduced()) map.jumpTo(target);
      else map.flyTo({ ...target, duration: 2200, essential: false });
    },
    onPinTap(cb) { tapCb = cb; },
    restyle() { map.setStyle(style(built), { diff: false }); },
  };
}
