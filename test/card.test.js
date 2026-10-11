import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cardHtml, shortDate, patternFor } from '../js/card.js';

const trip = JSON.parse(readFileSync(new URL('../data/trip.json', import.meta.url)));
const day = (d) => trip.days.find((x) => x.date === d);

test('collapsed info: title, stay and next timed item', () => {
  const h = cardHtml(day('2026-10-25'), trip, null);
  assert.match(h, /Torii-toge Pass/);
  assert.match(h, /Nukumorino-yado Komanoyu/);
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
  assert.match(cardHtml(day('2026-11-04'), trip, null), /Heathrow terminal <span class="gap">to confirm/);
});
test('every region gets a stencil pattern; the old road gets hemp leaf', () => {
  assert.equal(patternFor('Nakasendo'), 'hemp');
  for (const d of trip.days) assert.match(patternFor(d.region), /^(wave|hemp|peaks|rings)$/);
});
