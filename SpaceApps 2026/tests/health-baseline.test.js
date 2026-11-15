const test = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../health-baseline.js');

const recordsWithValues = (count, endDate = '2026-06-30') => {
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(end - (count - index - 1) * 86400000).toISOString().slice(0, 10);
    return {
      date,
      sleepHours: 7.4,
      sleepEfficiency: 92,
      restingHeartRate: 68,
      hrv: 58,
      activityScore: 71,
      reactionTime: 275,
      moodScore: 4.1
    };
  });
};

test('baseline uses the first 30 unique dates and averages available values', () => {
  const records = recordsWithValues(35);
  records[2].sleepHours = 6.4;
  records[4].sleepEfficiency = null;
  const baseline = engine.calculateBaseline(records);
  assert.equal(baseline.ready, true);
  assert.equal(baseline.sample_days, 30);
  assert.equal(baseline.start_date, '2026-05-27');
  assert.equal(baseline.end_date, '2026-06-25');
  assert.ok(Math.abs(baseline.values.sleepHours - 7.366666666666667) < 1e-10);
  assert.equal(baseline.values.sleepEfficiency, 92);
});

test('baseline requires 30 records spanning at least 30 calendar dates', () => {
  const compressed = recordsWithValues(30).map((record, index) => ({
    ...record,
    date: new Date(Date.parse('2026-06-01T00:00:00Z') + Math.floor(index / 2) * 86400000).toISOString().slice(0, 10)
  }));
  assert.equal(engine.calculateBaseline(compressed).ready, false);
  assert.equal(engine.calculateBaseline(recordsWithValues(29)).ready, false);
});

test('comparison reports signed changes and metric-aware trends', () => {
  const baseline = engine.calculateBaseline(recordsWithValues(30));
  const comparison = engine.compareToBaseline({ sleepHours: 6.1, restingHeartRate: 72 }, baseline);
  assert.equal(comparison.sleepHours.status, 'declining');
  assert.ok(Math.abs(comparison.sleepHours.percentChange - (-17.567567567567565)) < 1e-10);
  assert.equal(comparison.restingHeartRate.status, 'declining');
});

test('rolling windows classify improving and declining patterns', () => {
  const records = recordsWithValues(30).map((record, index) => ({
    ...record,
    sleepHours: index < 23 ? 8 : 8 - (index - 22) * 0.2,
    reactionTime: index < 23 ? 310 : 310 - (index - 22) * 3
  }));
  const trends = engine.analyzeTrends(records);
  assert.equal(trends[7].sleepHours, 'declining');
  assert.equal(trends[7].reactionTime, 'improving');
});

test('stable baseline score is excellent and score degrades for adverse deviations', () => {
  const baseline = engine.calculateBaseline(recordsWithValues(30));
  assert.deepEqual(engine.calculateHealthScore(recordsWithValues(30).at(-1), baseline), {
    score: 100,
    status: 'excellent',
    categories: { sleep: 100, cardiovascular: 100, activity: 100, cognition: 100, mood: 100 }
  });
  const score = engine.calculateHealthScore({ ...recordsWithValues(30).at(-1), sleepHours: 6 }, baseline);
  assert.ok(score.score < 100);
});

test('rule-based risk checks trigger for fatigue, mood, and cardiovascular patterns', () => {
  const baseline = engine.calculateBaseline(recordsWithValues(30));
  const current = {
    sleepHours: 6.1,
    sleepEfficiency: 80,
    restingHeartRate: 76,
    hrv: 48,
    activityScore: 60,
    reactionTime: 300,
    moodScore: 3.4
  };
  assert.deepEqual(engine.detectRisks(current, baseline).map((risk) => risk.risk), [
    'Fatigue',
    'Behavioral health',
    'Cardiovascular watch'
  ]);
});

test('risk thresholds do not trigger exactly at the specified boundaries', () => {
  const baseline = { values: {
    sleepHours: 100,
    sleepEfficiency: 100,
    restingHeartRate: 100,
    hrv: 100,
    activityScore: 100,
    reactionTime: 100,
    moodScore: 100
  } };
  const current = {
    sleepHours: 85,
    sleepEfficiency: 90,
    restingHeartRate: 110,
    hrv: 85,
    activityScore: 100,
    reactionTime: 105,
    moodScore: 85
  };
  assert.deepEqual(engine.detectRisks(current, baseline), []);
});

test('synthetic sample stays illustrative and contains a full personal baseline window', () => {
  const sample = engine.generateSampleData(180, '2026-11-14');
  assert.equal(sample.length, 180);
  assert.deepEqual(sample, engine.generateSampleData(180, '2026-11-14'));
  assert.equal(sample.at(-1).date, '2026-11-14');
  assert.equal(engine.calculateBaseline(sample).ready, true);
});
