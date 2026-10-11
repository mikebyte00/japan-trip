import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { todayIndex, nextTimed, display, validate } from '../js/trip.js';

const trip = JSON.parse(readFileSync(new URL('../data/trip.json', import.meta.url)));
const { days } = trip;
const idx = (d) => days.findIndex((x) => x.date === d);
const day25 = days[idx('2026-10-25')];

test('todayIndex uses the Tokyo date just before midnight JST', () => {
  assert.equal(todayIndex(days, new Date('2026-10-25T14:59:00Z')), idx('2026-10-25'));
});
test('todayIndex rolls over at 15:00Z (midnight JST)', () => {
  assert.equal(todayIndex(days, new Date('2026-10-25T15:01:00Z')), idx('2026-10-26'));
});
test('todayIndex outside the trip opens day 1', () => {
  assert.equal(todayIndex(days, new Date('2026-12-01T00:00:00Z')), 0);
});
test('nextTimed today returns the next item after Tokyo time', () => {
  assert.equal(nextTimed(day25, new Date('2026-10-25T05:00:00Z')).time, '17:30');
});
test('nextTimed today returns null once the last item has passed', () => {
  assert.equal(nextTimed(day25, new Date('2026-10-25T09:00:00Z')), null);
});
test('nextTimed on another day returns the first timed item', () => {
  assert.equal(nextTimed(day25, new Date('2026-10-20T05:00:00Z')).time, '17:30');
});
test('nextTimed on departure morning uses London time', () => {
  assert.equal(nextTimed(days[0], new Date('2026-10-20T09:00:00Z')).time, '13:05');
});
test('nextTimed with no timed items returns null', () => {
  assert.equal(nextTimed({ items: [{ text: 'x' }] }, null), null);
});
test('display marks unknowns as To confirm', () => {
  assert.equal(display('?'), 'To confirm');
  assert.equal(display('??'), 'To confirm');
  assert.equal(display(''), 'To confirm');
  assert.equal(display(undefined), 'To confirm');
  assert.equal(display(null), 'To confirm');
  assert.equal(display('Soba'), 'Soba');
});
test('the real trip.json is valid', () => {
  assert.deepEqual(validate(trip), []);
});
test('validate catches broken data', () => {
  const bad = structuredClone(trip);
  bad.days[3].date = '2026-10-30';
  bad.days[4].stay = 'nowhere';
  bad.stays[0].lat = 51.5;
  bad.days[5].notes.push('Home address: 1 Example St');
  bad.days.pop();
  const errs = validate(bad);
  assert.ok(errs.some((e) => /16 days/.test(e)), errs.join('\n'));
  assert.ok(errs.some((e) => /consecutive|date/.test(e)));
  assert.ok(errs.some((e) => /nowhere/.test(e)));
  assert.ok(errs.some((e) => /matsunoi/.test(e)));
  assert.ok(errs.some((e) => /home address/i.test(e)));
});
