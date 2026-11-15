const assert = require('node:assert/strict');
const test = require('node:test');
const reports = require('../health-reports.js');

function reportData() {
  return {
    healthRecords: [
      { date: '2025-06-02', restingHeartRate: 62, sleepHours: 7, sleepEfficiency: 88, hrv: 44, activityScore: 70, reactionTime: 280 },
      { date: '2025-06-08', restingHeartRate: 66, sleepHours: 8, sleepEfficiency: 90, hrv: 48, activityScore: 80, reactionTime: 300 },
      { date: '2025-06-09', restingHeartRate: 100, sleepHours: 3 }
    ],
    baseline: {
      ready: true,
      isSynthetic: false,
      values: { restingHeartRate: 60, sleepHours: 7.5, sleepEfficiency: 85, hrv: 40, activityScore: 65, reactionTime: 290 }
    },
    wellbeingEntries: [
      { date: '2025-06-02', mood: 'Good', fatigue: 3, stress: 2, connection: 'Connected', note: 'private wellbeing note' },
      { date: '2025-06-09', mood: 'Low', fatigue: 8, stress: 8, note: 'out of range' }
    ],
    activityEntries: [
      { date: '2025-06-02', name: '=HYPERLINK("https://example.invalid")', category: 'aerobic', status: 'completed', actualMinutes: 30, note: 'private activity note' },
      { date: '2025-06-08', name: 'Stretching', category: 'mobility', status: 'scheduled', plannedMinutes: 15 },
      { date: '2025-06-09', name: 'Out of range', status: 'completed', actualMinutes: 60 }
    ],
    sleepLogs: [
      { date: '2025-06-02', kind: 'checkin', sleepHours: 6 },
      { date: '2025-06-02', kind: 'period', startTime: '22:00', endTime: '06:00', durationHours: 8, quality: 4, restedness: 4, interruptions: 1 },
      { date: '2025-06-09', kind: 'checkin', sleepHours: 2 }
    ],
    hydrationLogs: [
      { localDate: '2025-06-02', amountMl: 500, recordedAt: '2025-06-02T10:00:00Z' },
      { localDate: '2025-06-09', amountMl: 900 }
    ],
    mealEntries: [
      { date: '2025-06-02', time: '12:00', name: '=1+1', status: 'eaten', note: 'private meal note', nutritionInfo: 'private nutrition details' },
      { date: '2025-06-08', time: '18:00', name: 'Dinner', status: 'partial' }
    ],
    medicationLog: [
      { date: '2025-06-02', scheduleId: 'sample-morning', status: 'taken', note: 'private medication note' },
      { date: '2025-06-09', scheduleId: 'sample-evening', status: 'skipped' }
    ]
  };
}

test('daily report includes only the selected date and labels available sample data', () => {
  const report = reports.summarize({ ...reportData(), sampleData: true }, 'daily', '2025-06-02');

  assert.equal(report.startDate, '2025-06-02');
  assert.equal(report.endDate, '2025-06-02');
  assert.equal(report.recordedDays, 1);
  assert.equal(report.sampleData, true);
  assert.equal(report.activity.completedMinutes, 30);
  assert.equal(report.sleep.totalHours, 8);
  assert.equal(report.hydration.totalMl, 500);
  assert.equal(report.meals.statuses.eaten, 1);
  assert.equal(report.medication.statuses.taken, 1);
  assert.equal(report.metricRows.find((metric) => metric.key === 'restingHeartRate').average, 62);
  assert.equal(report.metricRows.find((metric) => metric.key === 'restingHeartRate').baseline, 60);
});

test('weekly range spans seven calendar days and keeps missing readings unavailable', () => {
  const report = reports.summarize(reportData(), 'weekly', '2025-06-08');

  assert.equal(report.startDate, '2025-06-02');
  assert.equal(report.dayCount, 7);
  assert.equal(report.recordedDays, 2);
  assert.equal(report.healthRecordCount, 2);
  assert.equal(report.wellbeing.entryCount, 1);
  assert.equal(report.sleep.totalHours, 16);
  assert.equal(report.activity.completed, 1);
  assert.equal(report.activity.statuses.scheduled, 1);
  assert.equal(report.hydration.totalMl, 500);
  assert.equal(report.medication.entryCount, 1);
  assert.equal(report.metricRows.find((metric) => metric.key === 'restingHeartRate').average, 64);
});

test('reports do not compare synthetic baselines and empty periods remain explicit', () => {
  const synthetic = reports.summarize({
    healthRecords: [{ date: '2025-01-01', restingHeartRate: 64 }],
    baseline: { ready: true, isSynthetic: true, values: { restingHeartRate: 60 } }
  }, 'daily', '2025-01-01');
  const demo = reports.summarize({
    healthRecords: [{ date: '2025-01-01', restingHeartRate: 64 }],
    baseline: {
      ready: true,
      isSynthetic: true,
      allowSyntheticComparison: true,
      values: { restingHeartRate: 60 }
    }
  }, 'daily', '2025-01-01');
  const empty = reports.summarize({}, 'weekly', '2025-01-07');

  assert.equal(synthetic.metricRows.find((metric) => metric.key === 'restingHeartRate').baseline, null);
  assert.equal(demo.metricRows.find((metric) => metric.key === 'restingHeartRate').difference, 4);
  assert.equal(empty.isEmpty, true);
  assert.equal(empty.recordedDays, 0);
  assert.equal(empty.metricRows.find((metric) => metric.key === 'restingHeartRate').average, null);
});

test('isolated demo data populates reports without carrying private fields or mutating input records', () => {
  const endDate = '2025-04-15';
  const healthRecords = Array.from({ length: 45 }, (_, index) => {
    const date = new Date(Date.parse(`${endDate}T00:00:00Z`) - (44 - index) * 86400000)
      .toISOString()
      .slice(0, 10);
    return {
      date,
      sleepHours: 7 + index % 3 / 2,
      restingHeartRate: 62 + index % 5,
      sleepEfficiency: 88,
      hrv: 45,
      activityScore: 72,
      reactionTime: 280,
      moodScore: 4,
      note: 'must not be copied'
    };
  });
  const original = JSON.stringify(healthRecords);
  const demo = reports.createDemoData(endDate, healthRecords, {
    ready: true,
    isSynthetic: true,
    values: { restingHeartRate: 64 }
  });
  const report = reports.summarize({
    healthRecords: demo.healthBaseline.records,
    baseline: {
      ...demo.healthBaseline.baseline,
      isSynthetic: true,
      allowSyntheticComparison: true
    },
    sampleData: demo.sampleData,
    wellbeingEntries: demo.wellbeingEntries,
    activityEntries: demo.activityEntries,
    sleepLogs: demo.sleepLogs,
    hydrationLogs: demo.hydrationLogs,
    mealEntries: demo.mealEntries,
    medicationLog: demo.medicationLog
  }, 'weekly', endDate);
  const csv = reports.toCsv(report, demo.profileName);

  assert.equal(JSON.stringify(healthRecords), original);
  assert.equal(demo.sampleData, true);
  assert.equal(demo.profileName, 'Demo crew member');
  assert.equal(demo.healthBaseline.records.length, 45);
  assert.equal(demo.wellbeingEntries.length, 30);
  assert.ok(demo.activityEntries.length > 0);
  assert.ok(demo.hydrationLogs.length > 0);
  assert.ok(demo.mealEntries.length > 0);
  assert.ok(demo.medicationLog.length > 0);
  assert.equal(report.recordedDays, 7);
  assert.equal(report.sampleData, true);
  assert.notEqual(report.metricRows.find((metric) => metric.key === 'restingHeartRate').baseline, null);
  assert.match(csv, /"Synthetic demo data","Yes"/);
  assert.match(csv, /"Demo crew member"/);
  assert.doesNotMatch(JSON.stringify(demo), /must not be copied/);
  assert.equal(demo.mealEntries.every((entry) => !entry.note && !entry.nutritionInfo), true);
});

test('CSV export excludes private notes and nutrition details and neutralizes spreadsheet formulas', () => {
  const report = reports.summarize(reportData(), 'weekly', '2025-06-08');
  const csv = reports.toCsv(report, '=Crew member');

  assert.match(csv, /"'=Crew member"/);
  assert.match(csv, /'=HYPERLINK/);
  assert.match(csv, /'=1\+1/);
  assert.doesNotMatch(csv, /private wellbeing note|private activity note|private meal note|private nutrition details|private medication note/);
  assert.doesNotMatch(csv, /2025-06-09/);
});

test('invalid report periods and dates are rejected', () => {
  assert.throws(() => reports.getRange('monthly', '2025-01-01'), TypeError);
  assert.throws(() => reports.getRange('daily', '2025-02-30'), TypeError);
});
