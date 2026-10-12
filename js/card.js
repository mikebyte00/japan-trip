// The daily card. cardHtml is pure (tested in Node); renderCard puts it in the page.
import { display, nextTimed } from './trip.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ESC[c]);
const shown = (v) => {
  const t = display(v);
  return t === 'To confirm' ? '<span class="gap">To confirm</span>' : esc(t);
};

// One icon set: 1.75 stroke, currentColor.
export const ICON = Object.fromEntries(Object.entries({
  out: 'M7 17 17 7M9 7h8v8', prev: 'M15 18l-6-6 6-6', next: 'M9 18l6-6-6-6',
}).map(([k, d]) => [k, `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`]));

export const shortDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB',
  { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
const terminal = (t) => (display(t) === 'To confirm' ? 'terminal <span class="gap">to confirm</span>' : `T${esc(t)}`);

function flightHtml(f, b) {
  const [dDate, dTime] = f.departs.split(' ');
  const [aDate, aTime] = f.arrives.split(' ');
  const plus = aDate !== dDate ? ' <span class="soft">+1 day</span>' : '';
  return `<div class="flight"><b>${esc(f.number)}</b>
    <div>${esc(f.from)} ${terminal(f.fromTerminal)} <span class="time">${esc(dTime)}</span></div>
    <div>→ ${esc(f.to)} ${terminal(f.toTerminal)} <span class="time">${esc(aTime)}</span>${plus}</div>
    ${f.duration ? `<div class="soft">${esc(f.duration)}</div>` : ''}</div>
    ${b ? `<div class="meals booking">
      <span>Booking</span><span><b>${esc(b.ref)}</b> ${esc(b.airline)}</span>
      <span>Passengers</span><span>${esc(b.passengers)}</span>
      <span>Cabin</span><span>${esc(b.cabin)}</span>
      <span>Baggage</span><span>${esc(b.baggage)}</span></div>` : ''}`;
}

export function cardHtml(day, trip, now) {
  const stay = trip.stays.find((s) => s.id === day.stay);
  const flight = day.flight && trip.flights[day.flight];
  const next = nextTimed(day, now);
  const timeline = day.items.map((it) => `<span class="t">${it.time ? esc(it.time) : ''}</span>
    <span>${esc(it.text)}</span>`).join('');

  return `
<h2 class="dtitle">${esc(day.title)}</h2>
<div class="summary">${stay
    ? `<span class="lab">Sleep</span> <b>${esc(stay.name)}</b>`
    : `<span class="lab">Flight</span> <b>${esc(flight.number)} ${esc(flight.from)} → ${esc(flight.to)}</b>`}</div>
${next ? `<div class="next"><span class="time">${esc(next.time)}</span><span>${esc(next.text)}</span></div>` : ''}
<div class="more"><div>
  ${stay ? `<div class="sec"><h3>Sleep</h3><b>${esc(stay.name)}</b>
    <div class="soft">${esc(stay.address)}</div>
    <a class="maps" href="${esc(stay.mapsUrl)}" target="_blank" rel="noopener">Open in Maps ${ICON.out}</a></div>`
    : `<div class="sec"><h3>Flight</h3>${flightHtml(flight, trip.booking)}</div>`}
  <div class="sec"><h3>The day</h3><div class="tl">${timeline}</div></div>
  <div class="sec"><h3>Meals</h3><div class="meals">
    <span>Start</span><span>${shown(day.start)}</span>
    <span>Breakfast</span><span>${shown(day.breakfast)}</span>
    <span>Dinner</span><span>${shown(day.dinner)}</span></div></div>
  ${day.notes.length ? `<div class="sec"><h3>Notes</h3>${day.notes.map((n) => `<div class="flag">${esc(n)}</div>`).join('')}</div>` : ''}
</div></div>`;
}

// Stencil repeat per region: sea coasts get waves, the mountains peaks, the old road hemp leaf, Kansai rings.
const PATTERNS = { Nakasendo: 'hemp', Matsumoto: 'peaks', Hakone: 'peaks', Nara: 'rings', Kyoto: 'rings', Osaka: 'rings' };
export const patternFor = (region) => PATTERNS[region] ?? 'wave';

export function renderCard(el, day, trip, now) {
  el.innerHTML = cardHtml(day, trip, now);
}

// Letting go of a pulled-down sheet: close past 80px, or on a quick flick (> 0.5px/ms).
export const pulledClosed = (dy, ms) => dy > 80 || (dy > 20 && dy / ms > 0.5);
