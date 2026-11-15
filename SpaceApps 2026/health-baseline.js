(function attachBaselineEngine(root, factory) {
  const engine = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = engine;
  if (root) root.AstroVitalBaseline = engine;
}(typeof window !== 'undefined' ? window : globalThis, function createBaselineEngine() {
  const BASELINE_DAYS = 30;
  const MAX_RECORDS = 365;
  const METRICS = [
    { key: 'sleepHours', label: 'Sleep duration', unit: 'hrs', direction: 'higher' },
    { key: 'sleepEfficiency', label: 'Sleep efficiency', unit: '%', direction: 'higher' },
    { key: 'restingHeartRate', label: 'Resting heart rate', unit: 'bpm', direction: 'lower' },
    { key: 'hrv', label: 'Heart rate variability', unit: 'ms', direction: 'higher' },
    { key: 'activityScore', label: 'Daily activity score', unit: '/100', direction: 'higher' },
    { key: 'reactionTime', label: 'Reaction time', unit: 'ms', direction: 'lower' },
    { key: 'moodScore', label: 'Mood check-in', unit: '/5', direction: 'higher' }
  ];
  const METRIC_LIMITS = {
    sleepHours: [0, 24],
    sleepEfficiency: [0, 100],
    restingHeartRate: [20, 250],
    hrv: [0, 300],
    activityScore: [0, 100],
    reactionTime: [20, 10000],
    moodScore: [1, 5]
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const isValidDate = (value) => typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  const dayNumber = (value) => Date.parse(`${value}T00:00:00Z`) / 86400000;
  const numeric = (value) => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))
    ? Number(value)
    : null;

  function normalizeRecords(records) {
    if (!Array.isArray(records)) return [];
    const byDate = new Map();
    records.filter((record) => record && isValidDate(record.date)).forEach((record) => {
      byDate.set(record.date, Object.fromEntries([
        ['date', record.date],
        ...METRICS.map(({ key }) => {
          const value = numeric(record[key]);
          const [min, max] = METRIC_LIMITS[key];
          return [key, value !== null && value >= min && value <= max ? value : null];
        })
      ]));
    });
    return [...byDate.values()]
      .sort((first, second) => first.date.localeCompare(second.date))
      .slice(-MAX_RECORDS);
  }

  const mean = (values) => {
    const available = values.filter(Number.isFinite);
    return available.length ? available.reduce((sum, value) => sum + value, 0) / available.length : null;
  };

  function calculateBaseline(records) {
    const sample = normalizeRecords(records).slice(0, BASELINE_DAYS);
    const startDate = sample[0]?.date || null;
    const endDate = sample.at(-1)?.date || null;
    const ready = sample.length === BASELINE_DAYS && dayNumber(endDate) - dayNumber(startDate) >= BASELINE_DAYS - 1;
    return {
      ready,
      sample_days: sample.length,
      start_date: startDate,
      end_date: endDate,
      values: Object.fromEntries(METRICS.map(({ key }) => [key, ready ? mean(sample.map((record) => record[key])) : null]))
    };
  }

  function compareToBaseline(current, baseline) {
    return Object.fromEntries(METRICS.map((metric) => {
      const currentValue = numeric(current?.[metric.key]);
      const baselineValue = numeric(baseline?.values?.[metric.key]);
      const difference = currentValue === null || baselineValue === null ? null : currentValue - baselineValue;
      const percentChange = difference === null || baselineValue === 0 ? null : difference / Math.abs(baselineValue) * 100;
      const deviation = percentChange === null ? null : metric.direction === 'higher' ? percentChange : -percentChange;
      const status = deviation === null ? 'unavailable' : Math.abs(deviation) <= 3 ? 'stable' : deviation > 0 ? 'improving' : 'declining';
      return [metric.key, { current: currentValue, baseline: baselineValue, difference, percentChange, status }];
    }));
  }

  function analyzeTrends(records, windows = [7, 14, 30]) {
    const ordered = normalizeRecords(records);
    const latestDay = ordered.length ? dayNumber(ordered.at(-1).date) : null;
    return Object.fromEntries(windows.map((windowDays) => {
      const sample = ordered.filter((record) => latestDay !== null && dayNumber(record.date) > latestDay - windowDays);
      const metricTrends = Object.fromEntries(METRICS.map(({ key, direction }) => {
        const values = sample.map((record) => record[key]).filter(Number.isFinite);
        if (values.length < Math.min(3, windowDays)) return [key, 'unavailable'];
        const split = Math.floor(values.length / 2);
        const first = mean(values.slice(0, split));
        const second = mean(values.slice(split));
        const change = first === 0 ? 0 : (second - first) / Math.abs(first) * 100;
        const favorableChange = direction === 'higher' ? change : -change;
        return [key, Math.abs(favorableChange) <= 3 ? 'stable' : favorableChange > 0 ? 'improving' : 'declining'];
      }));
      return [windowDays, metricTrends];
    }));
  }

  function calculateHealthScore(current, baseline) {
    const comparisons = compareToBaseline(current, baseline);
    const categories = [
      { key: 'sleep', weight: 30, metrics: ['sleepHours', 'sleepEfficiency'] },
      { key: 'cardiovascular', weight: 25, metrics: ['restingHeartRate', 'hrv'] },
      { key: 'activity', weight: 20, metrics: ['activityScore'] },
      { key: 'cognition', weight: 15, metrics: ['reactionTime'] },
      { key: 'mood', weight: 10, metrics: ['moodScore'] }
    ];
    const available = categories.map((category) => {
      const scores = category.metrics.map((key) => {
        const comparison = comparisons[key];
        if (comparison.percentChange === null) return null;
        const metric = METRICS.find((item) => item.key === key);
        const adverseChange = metric.direction === 'higher'
          ? Math.max(0, -comparison.percentChange)
          : Math.max(0, comparison.percentChange);
        return clamp(100 - adverseChange * 2.5, 0, 100);
      }).filter(Number.isFinite);
      return { ...category, score: mean(scores) };
    }).filter((category) => category.score !== null);
    const totalWeight = available.reduce((sum, category) => sum + category.weight, 0);
    if (!totalWeight) return { score: null, status: 'unavailable', categories: {} };
    const score = Math.round(available.reduce((sum, category) => sum + category.score * category.weight, 0) / totalWeight);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'watch' : 'alert';
    return {
      score,
      status,
      categories: Object.fromEntries(available.map(({ key, score: categoryScore }) => [key, Math.round(categoryScore)]))
    };
  }

  function detectRisks(current, baseline) {
    const comparison = compareToBaseline(current, baseline);
    const change = (key) => comparison[key].percentChange;
    const risks = [];
    const sleep = change('sleepHours');
    const efficiency = change('sleepEfficiency');
    const reaction = change('reactionTime');
    const mood = change('moodScore');
    const heart = change('restingHeartRate');
    const hrv = change('hrv');
    if ((sleep !== null && sleep < -15) || (efficiency !== null && efficiency < -10 && reaction !== null && reaction > 5)) {
      risks.push({
        risk: 'Fatigue',
        severity: sleep !== null && sleep < -25 ? 'High' : 'Moderate',
        ruleStrength: 0.86,
        reasons: [sleep !== null && sleep < -15 ? `Sleep duration is ${Math.abs(sleep).toFixed(1)}% below baseline.` : '', efficiency !== null && efficiency < -10 ? `Sleep efficiency is ${Math.abs(efficiency).toFixed(1)}% lower.` : '', reaction !== null && reaction > 5 ? `Reaction time is ${reaction.toFixed(1)}% slower.` : ''].filter(Boolean)
      });
    }
    if (mood !== null && mood < -15 && sleep !== null && sleep < -10) {
      risks.push({
        risk: 'Behavioral health',
        severity: 'Moderate',
        ruleStrength: 0.88,
        reasons: [`Mood score is ${Math.abs(mood).toFixed(1)}% below baseline.`, `Sleep duration is ${Math.abs(sleep).toFixed(1)}% below baseline.`]
      });
    }
    if ((heart !== null && heart > 10) || (hrv !== null && hrv < -15)) {
      risks.push({
        risk: 'Cardiovascular watch',
        severity: (heart !== null && heart > 15) || (hrv !== null && hrv < -25) ? 'High' : 'Moderate',
        ruleStrength: 0.8,
        reasons: [heart !== null && heart > 10 ? `Resting heart rate is ${heart.toFixed(1)}% above baseline.` : '', hrv !== null && hrv < -15 ? `HRV is ${Math.abs(hrv).toFixed(1)}% below baseline.` : ''].filter(Boolean)
      });
    }
    return risks;
  }

  function generateSampleData(days = 180, endDate = new Date().toISOString().slice(0, 10)) {
    if (!Number.isInteger(days) || days < BASELINE_DAYS || !isValidDate(endDate)) {
      throw new TypeError('Sample data needs at least 30 days and a valid end date.');
    }
    const start = dayNumber(endDate) - days + 1;
    return Array.from({ length: days }, (_, index) => {
      const date = new Date((start + index) * 86400000).toISOString().slice(0, 10);
      const degradation = clamp((index - (days - 45)) / 44, 0, 1);
      return {
        date,
        sleepHours: Number((7.4 - degradation * 1.9 + Math.sin(index * 0.71) * 0.16).toFixed(2)),
        sleepEfficiency: Number((92 - degradation * 15 + Math.cos(index * 0.4) * 1.1).toFixed(1)),
        restingHeartRate: Number((68 + degradation * 6 + Math.sin(index * 0.52) * 1.4).toFixed(1)),
        hrv: Number((58 - degradation * 15 + Math.cos(index * 0.61) * 2.2).toFixed(1)),
        activityScore: Number((71 - degradation * 21 + Math.sin(index * 0.37) * 4).toFixed(1)),
        reactionTime: Number((275 + degradation * 38 + Math.cos(index * 0.33) * 7).toFixed(1)),
        moodScore: Number((4.1 - degradation * 0.8 + Math.sin(index * 0.29) * 0.18).toFixed(2))
      };
    });
  }

  return {
    BASELINE_DAYS,
    METRICS,
    analyzeTrends,
    calculateBaseline,
    calculateHealthScore,
    compareToBaseline,
    detectRisks,
    generateSampleData,
    normalizeRecords
  };
}));
