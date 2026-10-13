import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cardHtml, shortDate, patternFor, pulledClosed } from '../js/card.js';

const trip = JSON.parse(readFileSync(new URL('../data/trip.json', import.meta.url)));
const day = (d) => trip.days.find((x) => x.date === d);

test('collapsed info: title, stay and next timed item', () => {
  const h = cardHtml(day('2026-10-25'), trip, null);
  assert.match(h, /Torii-toge Pass/);
  assert.match(h, /Nukumorino-yado Komanoyu/);
  assert.match(h, /href="https:\/\/japantravel\.navitime\.com[^"]*"[^>]*>Timetable/);
  assert.match(h, /class="next"[^]*17:30/);
});
test('no next row when the day has no timed items', () => {
  assert.doesNotMatch(cardHtml(day('2026-10-22'), trip, null), /class="next"/);
});
test('unknown meals show To confirm', () => {
  assert.match(cardHtml(day('2026-10-22'), trip, null), /To confirm/);
});
test('stay days link to Maps', () => {
  assert.match(cardHtml(day('2026-10-23'), trip, null), /href="https:\/\/maps\.app\.goo\.gl\/4aZhYQj8BVtysNHr5"/);
});
test('flight days show the flight instead of a sleep section', () => {
  const h = cardHtml(day('2026-11-04'), trip, null);
  assert.match(h, /BA006/);
  assert.doesNotMatch(h, /Open in Maps/);
});
test('text is escaped', () => {
  const d = { ...day('2026-10-22'), title: '<b>x</b>' };
  assert.match(cardHtml(d, trip, null), /&lt;b&gt;x&lt;\/b&gt;/);
});
test('dates read like "Sun 25 Oct" with no comma', () => {
  assert.equal(shortDate('2026-10-25'), 'Sun 25 Oct');
});
test('unknown terminal reads as "terminal to confirm"', () => {
  const t = { ...trip, flights: { ...trip.flights, back: { ...trip.flights.back, toTerminal: '?' } } };
  assert.match(cardHtml(day('2026-11-04'), t, null), /Heathrow terminal <span class="gap">to confirm/);
});
test('both flight days show the booking details', () => {
  for (const d of ['2026-10-20', '2026-11-04']) {
    const h = cardHtml(day(d), trip, null);
    assert.match(h, /YQ8JIX/);
    assert.match(h, /World Traveller/);
    assert.match(h, /23 kg/);
  }
});
test('every region gets a stencil pattern; the old road gets hemp leaf', () => {
  assert.equal(patternFor('Nakasendo'), 'hemp');
  for (const d of trip.days) assert.match(patternFor(d.region), /^(wave|hemp|peaks|rings)$/);
});
test('a pulled sheet closes past 80px or on a quick downward flick', () => {
  assert.equal(pulledClosed(120, 600), true);
  assert.equal(pulledClosed(40, 400), false);
  assert.equal(pulledClosed(40, 50), true);
  assert.equal(pulledClosed(10, 5), false);
  assert.equal(pulledClosed(-200, 100), false);
});
test('stay booking details: check-in/out, room, meals and a tap-to-call phone', () => {
  const h = cardHtml(day('2026-10-25'), trip, null);
  assert.match(h, /Check-in<\/span><span>15:00–18:00/);
  assert.match(h, /Check-out<\/span><span>07:30–10:00/);
  assert.match(h, /href="tel:\+81264232288"/);
  assert.match(h, /Superior Japanese-style room/);
  assert.doesNotMatch(h, /6227377873|1195/);
});
test('stays without booking details render no empty rows', () => {
  assert.doesNotMatch(cardHtml(day('2026-10-22'), trip, null), /Check-in/);
});
test('item links use linkText, defaulting to Timetable', () => {
  assert.match(cardHtml(day('2026-10-27'), trip, null), />Trail map /);
  assert.match(cardHtml(day('2026-10-25'), trip, null), />Timetable /);
});
test('brief summary shows under the title only when set', () => {
  assert.match(cardHtml(day('2026-10-26'), trip, null), /<\/h2>\n<p class="brief">The classic Nakasendo/);
  assert.doesNotMatch(cardHtml(day('2026-10-22'), trip, null), /class="brief"/);
});
