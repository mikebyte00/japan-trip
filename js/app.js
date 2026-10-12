import { todayIndex } from './trip.js';
import { renderCard, shortDate, patternFor, ICON, pulledClosed } from './card.js';
import { createMap } from './map.js';

const $ = (id) => document.getElementById(id);
const wide = matchMedia('(min-width: 900px)');

const [trip, areas] = await Promise.all(['data/trip.json', 'tiles/areas.json']
  .map((u) => fetch(u).then((r) => r.json())));
const { days } = trip;
const tm = await createMap($('map'), trip, areas);

let index = todayIndex(days, new Date());

// Dots double as a jump list.
days.forEach((d, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('aria-label', `Day ${i + 1}, ${shortDate(d.date)}`);
  b.addEventListener('click', () => go(i));
  $('dots').append(b);
});

function go(i, dir = 0) {
  index = Math.max(0, Math.min(days.length - 1, i));
  const day = days[index];
  const card = $('card');
  card.dataset.dir = dir;
  renderCard(card, day, trip, new Date());
  const region = Object.assign(document.createElement('span'), { className: 'region', textContent: day.region });
  $('when').replaceChildren(shortDate(day.date), region);
  $('sheet').dataset.pattern = patternFor(day.region);
  for (const el of [card, $('head')]) { el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); }
  $('daychip').innerHTML = `Day <span>${index + 1}</span> of ${days.length}`;
  const near = (i) => (days[i] ? shortDate(days[i].date).replace(/ \w+$/, '') : '');
  $('prev').innerHTML = `${ICON.prev}${near(index - 1)}`;
  $('next').innerHTML = `${near(index + 1)}${ICON.next}`;
  $('prev').setAttribute('aria-label', index ? `Previous day, ${near(index - 1)}` : 'Previous day');
  $('next').setAttribute('aria-label', index < days.length - 1 ? `Next day, ${near(index + 1)}` : 'Next day');
  $('prev').disabled = index === 0;
  $('next').disabled = index === days.length - 1;
  [...$('dots').children].forEach((b, j) => b.classList.toggle('on', j === index));
  [...$('dots').children].forEach((b, j) => b.setAttribute('aria-current', j === index ? 'date' : 'false'));
  padMap();
  tm.flyToDay(day);
}

$('prev').addEventListener('click', () => go(index - 1, -1));
$('next').addEventListener('click', () => go(index + 1, 1));
tm.onPinTap((stayId) => go(days.findIndex((d) => d.stay === stayId)));

// Keep the current pin visible above the bottom sheet (or beside the side panel).
function padMap() {
  const r = $('sheet').getBoundingClientRect();
  tm.map.setPadding(wide.matches ? { right: 0, bottom: 0 } : { bottom: Math.min(r.height, innerHeight * 0.6) });
}

// Bottom sheet: drag or tap the handle to expand/collapse.
const sheet = $('sheet');
function setOpen(open) {
  sheet.classList.toggle('open', open);
  $('grab').setAttribute('aria-expanded', open);
  $('grab').setAttribute('aria-label', open ? 'Collapse day details' : 'Expand day details');
  padMap();
}
// Dragging an open sheet down moves it with the finger; on release it closes or springs back.
let drag = null;
function dragStart(x, y) { if (wide.matches) return; drag = { x, y, dy: 0, t: performance.now() }; sheet.classList.add('dragging'); }
function dragMove(x, y) {
  if (!drag) return;
  drag.dy = y - drag.y;
  const down = drag.dy > Math.abs(x - drag.x) ? drag.dy : 0; // ignore sideways day swipes
  if (sheet.classList.contains('open')) sheet.style.transform = `translateY(${down}px)`;
}
function dragEnd() {
  if (!drag) return null;
  const { dy, t } = drag;
  drag = null;
  sheet.classList.remove('dragging');
  sheet.style.transform = '';
  return { dy, ms: performance.now() - t };
}

// The whole header is the drag handle, not just the thin bar; a tap toggles.
$('head').addEventListener('pointerdown', (e) => { dragStart(e.clientX, e.clientY); $('head').setPointerCapture(e.pointerId); });
$('head').addEventListener('pointermove', (e) => dragMove(e.clientX, e.clientY));
$('head').addEventListener('pointercancel', dragEnd);
$('head').addEventListener('pointerup', () => {
  const r = dragEnd();
  if (!r) return;
  const open = sheet.classList.contains('open');
  setOpen(Math.abs(r.dy) < 10 ? !open : open ? !pulledClosed(r.dy, r.ms) : r.dy < 0);
});

// Swipe the card sideways to change day.
let start = null;
$('card').addEventListener('pointerdown', (e) => { start = { x: e.clientX, y: e.clientY }; });
$('card').addEventListener('pointerup', (e) => {
  if (!start) return;
  const dx = e.clientX - start.x, dy = e.clientY - start.y;
  start = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
});

// Pulling the card down from its top drags the sheet too. Touch events, because pan-y
// scrolling cancels pointer events.
$('card').addEventListener('touchstart', (e) => {
  if (sheet.classList.contains('open') && $('card').scrollTop <= 0) dragStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
$('card').addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
$('card').addEventListener('touchcancel', dragEnd, { passive: true });
$('card').addEventListener('touchend', () => {
  const r = dragEnd();
  if (r && pulledClosed(r.dy, r.ms)) setOpen(false);
}, { passive: true });

wide.addEventListener('change', padMap);

// Light/dark: the button overrides the phone's setting and is remembered.
const root = document.documentElement;
function showTheme() {
  const dark = root.dataset.theme === 'dark';
  $('theme').innerHTML = dark ? ICON.sun : ICON.moon;
  $('theme').setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
function setTheme(t, save) {
  root.dataset.theme = t;
  if (save) try { localStorage.setItem('theme', t); } catch {}
  showTheme();
  tm.restyle();
}
$('theme').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let saved; try { saved = localStorage.getItem('theme'); } catch {}
  if (!saved) setTheme(e.matches ? 'dark' : 'light', false);
});
showTheme();
go(index);

// Offline: the service worker keeps the app and trip data; map files are saved on request.
// Glyphs and sprites too: offline, one missing glyph range blanks the whole tile.
const badge = $('offline');
const extras = await fetch('vendor/offline.json').then((r) => (r.ok ? r.json() : [])).catch(() => []);
const files = [...areas.map((a) => a.file), ...extras];
const abs = (f) => new URL(f, location.href).href;
async function savedCount() {
  const cache = await caches.open('tiles-v1');
  const hits = await Promise.all(files.map((f) => cache.match(abs(f))));
  return hits.filter(Boolean).length;
}
export async function saveOffline() {
  badge.disabled = true;
  await navigator.storage?.persist?.();
  const cache = await caches.open('tiles-v1');
  const save = async (f) => {
    try {
      const res = await fetch(f, { cache: 'no-store' });
      if (res.ok) await cache.put(abs(f), res);
      return res.ok;
    } catch {
      return false;
    }
  };
  let missing = 0;
  for (const [i, a] of areas.entries()) {
    badge.textContent = `Saving maps ${i + 1}/${areas.length}`;
    if (!(await save(a.file))) missing++;
  }
  badge.textContent = 'Saving labels';
  const labelsOk = (await Promise.all(extras.map(save))).every(Boolean);
  badge.disabled = false;
  showBadge(missing ? `Saved, ${missing} map${missing > 1 ? 's' : ''} missing`
    : labelsOk ? null : 'Saved, some labels missing');
}
async function showBadge(override) {
  const all = (await savedCount()) === files.length;
  badge.hidden = false;
  badge.textContent = override ?? (all ? 'Saved offline' : 'Save for offline');
  badge.classList.toggle('saved', all);
}
badge.addEventListener('click', () => { if (!badge.classList.contains('saved')) saveOffline(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
if ('caches' in self) showBadge();
