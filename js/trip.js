// Pure trip logic: no DOM, so it runs in Node tests and the browser alike.

const tokyo = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

// { date: "YYYY-MM-DD", time: "HH:MM" } for `now` in Japan.
export function tokyoParts(now) {
  const p = Object.fromEntries(tokyo.formatToParts(now).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

export function todayIndex(days, now) {
  const i = days.findIndex((d) => d.date === tokyoParts(now).date);
  return i < 0 ? 0 : i;
}

export function nextTimed(day, now) {
  const timed = day.items.filter((it) => it.time);
  if (!now) return timed[0] ?? null;
  const t = tokyoParts(now);
  if (t.date !== day.date) return timed[0] ?? null;
  return timed.find((it) => it.time >= t.time) ?? null;
}

export function display(v) {
  if (v === undefined || v === null || v === '') return 'To confirm';
  if (typeof v === 'string' && /^\?+$/.test(v.trim())) return 'To confirm';
  return v;
}

export function validate(trip) {
  const errs = [];
  const stayIds = new Set(trip.stays.map((s) => s.id));
  if (trip.days.length !== 16) errs.push(`expected 16 days, got ${trip.days.length}`);
  trip.days.forEach((d, i) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date ?? '')) errs.push(`day ${i + 1}: missing date`);
    if (i > 0) {
      const prev = new Date(`${trip.days[i - 1].date}T00:00:00Z`);
      const want = new Date(prev.getTime() + 86400000).toISOString().slice(0, 10);
      if (d.date !== want) errs.push(`day ${i + 1}: date ${d.date} not consecutive (want ${want})`);
    }
    if (d.stay !== null && !stayIds.has(d.stay)) errs.push(`day ${d.date}: unknown stay ${d.stay}`);
    if (d.stay === null && !trip.flights?.[d.flight]) errs.push(`day ${d.date}: no stay and no flight`);
  });
  for (const s of trip.stays) {
    const ok = typeof s.lat === 'number' && typeof s.lng === 'number'
      && s.lat >= 24 && s.lat <= 46 && s.lng >= 122 && s.lng <= 146;
    if (!ok) errs.push(`stay ${s.id}: lat/lng missing or outside Japan`);
  }
  if (/home address/i.test(JSON.stringify(trip))) errs.push('trip mentions a home address');
  return errs;
}
