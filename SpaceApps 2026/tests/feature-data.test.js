const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../feature-data.js');

test('sleep periods support midnight crossings and reject zero-length intervals', () => {
  assert.equal(data.sleepPeriodHours('22:30', '06:00'), 7.5);
  assert.equal(data.sleepPeriodHours('13:00', '14:15'), 1.25);
  assert.equal(data.sleepPeriodHours('08:00', '08:00'), null);
});

test('sleep totals combine split periods instead of double-counting check-in summaries', () => {
  const entries = [
    { id: 'checkin', kind: 'checkin', date: '2026-11-14', sleepHours: 7 },
    { id: 'night', kind: 'period', date: '2026-11-14', startTime: '22:30', endTime: '06:00', durationHours: 7.5 },
    { id: 'nap', kind: 'period', date: '2026-11-14', startTime: '13:00', endTime: '14:00', durationHours: 1 }
  ];
  assert.equal(data.sleepTotalForDate(entries, '2026-11-14'), 8.5);
  assert.equal(data.sleepTotalForDate(entries, '2026-11-13'), null);
});

test('legacy wellbeing entries survive normalization with new fields optional', () => {
  const entries = data.normalizeWellbeingHistory([{
    date: '2026-11-14',
    time: '07:30 PM',
    mood: 'Good',
    fatigue: 3,
    note: 'A private reflection'
  }]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].note, 'A private reflection');
  assert.equal(entries[0].stress, null);
  assert.equal(entries[0].connection, null);
});

test('completed activity entries require a valid duration', () => {
  assert.equal(data.normalizeActivityEntries([{
    id: 'missing-duration',
    date: '2026-11-14',
    name: 'Mobility session',
    category: 'Mobility',
    status: 'completed'
  }]).length, 0);
  assert.equal(data.normalizeActivityEntries([{
    id: 'logged',
    date: '2026-11-14',
    name: 'Mobility session',
    category: 'Mobility',
    status: 'completed',
    actualMinutes: 20
  }]).length, 1);
});

test('nutrition details are only traceable when a source is present', () => {
  const [unverified, verified] = data.normalizeMealEntries([
    {
      date: '2026-11-14',
      time: '12:00',
      name: 'Sample lunch',
      status: 'eaten',
      nutritionInfo: 'User-entered nutrient notes'
    },
    {
      date: '2026-11-14',
      time: '13:00',
      name: 'Mission menu lunch',
      status: 'eaten',
      nutritionInfo: 'Menu lists 20 g protein',
      nutritionSource: 'Approved mission menu'
    }
  ]);
  assert.equal(data.hasTraceableNutrition(unverified), false);
  assert.equal(data.hasTraceableNutrition(verified), true);
});
