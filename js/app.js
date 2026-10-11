import { todayIndex } from './trip.js';
import { renderCard, shortDate, patternFor } from './card.js';
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
  $('prev').textContent = index ? `‹ ${shortDate(days[index - 1].date).replace(/ \w+$/, '')}` : '‹';
  $('next').textContent = index < days.length - 1 ? `${shortDate(days[index + 1].date).replace(/ \w+$/, '')} ›` : '›';
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
let grabY = null;
$('grab').addEventListener('pointerdown', (e) => { grabY = e.clientY; $('grab').setPointerCapture(e.pointerId); });
$('grab').addEventListener('pointerup', (e) => {
  const dy = e.clientY - grabY;
  grabY = null;
  setOpen(Math.abs(dy) < 10 ? !sheet.classList.contains('open') : dy < 0);
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

wide.addEventListener('change', padMap);
go(index);

// Offline: the service worker keeps the app and trip data; map files are saved on request.
const badge = $('offline');
async function savedCount() {
  const cache = await caches.open('tiles-v1');
  const hits = await Promise.all(areas.map((a) => cache.match(new URL(a.file, location.href).href)));
  return hits.filter(Boolean).length;
}
export async function saveOffline() {
  badge.disabled = true;
  await navigator.storage?.persist?.();
  const cache = await caches.open('tiles-v1');
  let missing = 0;
  for (const [i, a] of areas.entries()) {
    badge.textContent = `Saving maps ${i + 1}/${areas.length}`;
    try {
      const res = await fetch(a.file, { cache: 'no-store' });
      if (res.ok) await cache.put(new URL(a.file, location.href).href, res);
      else missing++;
    } catch {
      missing++;
    }
  }
  badge.disabled = false;
  showBadge(missing ? `Saved, ${missing} map${missing > 1 ? 's' : ''} missing` : null);
}
async function showBadge(override) {
  const all = (await savedCount()) === areas.length;
  badge.hidden = false;
  badge.textContent = override ?? (all ? 'Saved offline' : 'Save for offline');
  badge.classList.toggle('saved', all);
}
badge.addEventListener('click', () => { if (!badge.classList.contains('saved')) saveOffline(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
if ('caches' in self) showBadge();
