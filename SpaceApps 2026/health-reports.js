(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.AstroVitalHealthReports = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const METRICS = [
    { key: 'restingHeartRate', label: 'Resting heart rate', unit: 'bpm' },
    { key: 'sleepHours', label: 'Sleep duration', unit: 'h' },
    { key: 'sleepEfficiency', label: 'Sleep efficiency', unit: '%' },
    { key: 'hrv', label: 'Heart rate variability', unit: 'ms' },
    { key: 'activityScore', label: 'Daily activity score', unit: '/100' },
    { key: 'reactionTime', label: 'Reaction time', unit: 'ms' }
  ];
  const STATUSES = ['scheduled', 'completed', 'skipped', 'partial', 'eaten', 'taken'];

  function isDateKey(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function addDays(dateKey, days) {
    return new Date(Date.parse(`${dateKey}T00:00:00.000Z`) + days * DAY_MS)
      .toISOString()
      .slice(0, 10);
  }

  function getRange(period, endDate) {
    if (period !== 'daily' && period !== 'weekly') throw new TypeError('Report period must be daily or weekly.');
    if (!isDateKey(endDate)) throw new TypeError('Report end date must be a valid YYYY-MM-DD date.');
    const dayCount = period === 'daily' ? 1 : 7;
    return {
      period,
      endDate,
      startDate: addDays(endDate, -(dayCount - 1)),
      dayCount
    };
  }

  function createDemoData(endDate, healthRecords, baseline) {
    if (!isDateKey(endDate) || !Array.isArray(healthRecords) || healthRecords.length < 30) {
      throw new TypeError('Demo data needs a valid end date and at least 30 health records.');
    }
    const records = healthRecords
      .filter((record) => record && isDateKey(record.date) && record.date <= endDate)
      .map((record) => ({
        date: record.date,
        ...Object.fromEntries([...METRICS.map(({ key }) => key), 'moodScore']
          .map((key) => [key, finiteNumber(record[key])]))
      }));
    if (records.length < 30) throw new TypeError('Demo data needs at least 30 dated health records.');

    const recentRecords = records.filter((record) => record.date >= addDays(endDate, -29));
    const categories = ['Aerobic', 'Resistance', 'Mobility'];
    const mealNames = ['Demo breakfast', 'Demo lunch', 'Demo dinner'];
    const mealTimes = ['08:00', '13:00', '19:00'];
    const wellbeingEntries = recentRecords.map((record, index) => {
      const moodScore = finiteNumber(record.moodScore) || 3;
      return {
        id: `demo-wellbeing-${record.date}`,
        date: record.date,
        mood: moodScore >= 4.5 ? 'Great' : moodScore >= 3.7 ? 'Good' : moodScore >= 2.8 ? 'Okay' : 'Low',
        fatigue: Math.max(1, Math.min(10, Math.round(7 - (finiteNumber(record.sleepHours) || 7) * 0.4))),
        stress: Math.max(1, Math.min(10, Math.round(8 - moodScore * 1.1))),
        connection: index % 6 === 0 ? 'A little isolated' : 'Connected',
        note: ''
      };
    });
    const activityEntries = recentRecords.map((record, index) => {
      const status = index % 5 === 0 ? 'scheduled' : index % 7 === 0 ? 'skipped' : 'completed';
      return {
        id: `demo-activity-${record.date}`,
        date: record.date,
        name: `Demo ${categories[index % categories.length].toLowerCase()} activity`,
        category: categories[index % categories.length],
        status,
        plannedMinutes: 30,
        actualMinutes: status === 'completed' ? 25 + index % 16 : null,
        note: ''
      };
    });
    const sleepLogs = records.map((record) => ({
      id: `demo-sleep-${record.date}`,
      kind: 'checkin',
      date: record.date,
      sleepHours: finiteNumber(record.sleepHours)
    })).filter((entry) => entry.sleepHours !== null);
    const hydrationLogs = recentRecords.flatMap((record, index) => [
      { id: `demo-water-am-${record.date}`, localDate: record.date, amountMl: 300 + index % 4 * 50 },
      { id: `demo-water-pm-${record.date}`, localDate: record.date, amountMl: 250 + index % 5 * 50 }
    ]);
    const mealEntries = recentRecords.flatMap((record, index) => mealNames.map((name, mealIndex) => ({
      id: `demo-meal-${record.date}-${mealIndex}`,
      date: record.date,
      time: mealTimes[mealIndex],
      name,
      status: mealIndex === 0
        ? 'eaten'
        : mealIndex === 1
          ? index % 3 === 0 ? 'partial' : 'eaten'
          : index % 7 === 0 ? 'skipped' : 'scheduled',
      note: '',
      nutritionInfo: '',
      nutritionSource: ''
    })));
    const medicationLog = recentRecords.flatMap((record, index) => [
      { id: `demo-med-am-${record.date}`, date: record.date, scheduleId: 'demo-morning', status: index % 9 === 0 ? 'skipped' : 'taken' },
      { id: `demo-med-pm-${record.date}`, date: record.date, scheduleId: 'demo-evening', status: index % 11 === 0 ? 'skipped' : 'taken' }
    ]);

    return {
      profileName: 'Demo crew member',
      sampleData: true,
      healthBaseline: { records, baseline, isSynthetic: true },
      wellbeingEntries,
      activityEntries,
      sleepLogs,
      hydrationLogs,
      mealEntries,
      medicationLog
    };
  }

  function inRange(value, range) {
    return isDateKey(value) && value >= range.startDate && value <= range.endDate;
  }

  function finiteNumber(value) {
    return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))
      ? Number(value)
      : null;
  }

  function average(values) {
    const numbers = values.map(finiteNumber).filter((value) => value !== null);
    if (!numbers.length) return null;
    return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  }

  function countByStatus(entries) {
    const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
    entries.forEach((entry) => {
      if (Object.prototype.hasOwnProperty.call(counts, entry.status)) counts[entry.status] += 1;
    });
    return counts;
  }

  function safeRecords(entries, project) {
    return entries.filter((entry) => entry && typeof entry === 'object').map(project);
  }

  function summarize(data, period, endDate) {
    const range = getRange(period, endDate);
    const source = data && typeof data === 'object' ? data : {};
    const within = (entries, dateSelector) => (Array.isArray(entries) ? entries : [])
      .filter((entry) => entry && inRange(dateSelector(entry), range));
    const healthRecords = within(source.healthRecords, (entry) => entry.date);
    const wellbeing = within(source.wellbeingEntries, (entry) => entry.date);
    const activities = within(source.activityEntries, (entry) => entry.date);
    const sleepLogs = within(source.sleepLogs, (entry) => entry.date);
    const hydration = within(source.hydrationLogs, (entry) => entry.localDate || entry.date);
    const meals = within(source.mealEntries, (entry) => entry.date);
    const medications = within(source.medicationLog, (entry) => entry.date);
    const baseline = source.baseline && source.baseline.ready
      && (!source.baseline.isSynthetic || source.baseline.allowSyntheticComparison)
      ? source.baseline.values || {}
      : {};

    const sleepByDate = [];
    for (let offset = 0; offset < range.dayCount; offset += 1) {
      const date = addDays(range.startDate, offset);
      const dailyLogs = sleepLogs.filter((entry) => entry.date === date);
      const periods = dailyLogs.filter((entry) => entry.kind === 'period');
      const checkins = dailyLogs.filter((entry) => entry.kind === 'checkin');
      const healthRecord = healthRecords.filter((entry) => entry.date === date).at(-1);
      const sleepHours = periods.length
        ? periods.reduce((total, entry) => total + (finiteNumber(entry.durationHours) || 0), 0)
        : checkins.length
          ? finiteNumber(checkins[checkins.length - 1].sleepHours)
          : finiteNumber(healthRecord?.sleepHours);
      if (sleepHours !== null) sleepByDate.push({
        date,
        sleepHours,
        entries: dailyLogs.length || (finiteNumber(healthRecord?.sleepHours) !== null ? 1 : 0)
      });
    }

    const metricRows = METRICS.map((metric) => {
      const values = metric.key === 'sleepHours'
        ? sleepByDate.map((entry) => entry.sleepHours)
        : healthRecords.map((record) => record[metric.key]);
      const mean = average(values);
      const baselineValue = finiteNumber(baseline[metric.key]);
      return {
        ...metric,
        average: mean,
        entryCount: values.filter((value) => finiteNumber(value) !== null).length,
        baseline: baselineValue,
        difference: mean !== null && baselineValue !== null ? mean - baselineValue : null
      };
    });

    const dates = new Set();
    [
      ...healthRecords,
      ...wellbeing,
      ...activities,
      ...sleepLogs,
      ...hydration,
      ...meals,
      ...medications
    ].forEach((entry) => {
      const date = entry.localDate || entry.date;
      if (inRange(date, range)) dates.add(date);
    });

    const completedActivities = activities.filter((entry) => entry.status === 'completed');
    const mealStatuses = countByStatus(meals);
    const medicationStatuses = countByStatus(medications);
    const hydrationTotalMl = hydration.reduce((total, entry) => total + (finiteNumber(entry.amountMl) || 0), 0);
    const sleepTotalHours = sleepByDate.reduce((total, entry) => total + entry.sleepHours, 0);
    const moods = {};
    wellbeing.forEach((entry) => {
      if (typeof entry.mood === 'string' && entry.mood.trim()) {
        moods[entry.mood] = (moods[entry.mood] || 0) + 1;
      }
    });

    return {
      ...range,
      recordedDays: dates.size,
      isEmpty: dates.size === 0,
      sampleData: Boolean(source.sampleData),
      healthRecordCount: healthRecords.length,
      metricRows,
      wellbeing: {
        entryCount: wellbeing.length,
        averageFatigue: average(wellbeing.map((entry) => entry.fatigue)),
        averageStress: average(wellbeing.map((entry) => entry.stress)),
        moods
      },
      activity: {
        entryCount: activities.length,
        completed: completedActivities.length,
        completedMinutes: completedActivities.reduce((total, entry) => total + (finiteNumber(entry.actualMinutes) || 0), 0),
        statuses: countByStatus(activities)
      },
      sleep: {
        totalHours: sleepByDate.length ? sleepTotalHours : null,
        averageHours: sleepByDate.length ? sleepTotalHours / sleepByDate.length : null,
        loggedNights: sleepByDate.length,
        daily: sleepByDate
      },
      hydration: {
        totalMl: hydration.length ? hydrationTotalMl : null,
        entryCount: hydration.length
      },
      meals: {
        entryCount: meals.length,
        statuses: mealStatuses
      },
      medication: {
        entryCount: medications.length,
        statuses: medicationStatuses
      },
      records: {
        health: safeRecords(healthRecords, (entry) => ({
          date: entry.date,
          restingHeartRate: finiteNumber(entry.restingHeartRate),
          sleepHours: finiteNumber(entry.sleepHours),
          sleepEfficiency: finiteNumber(entry.sleepEfficiency),
          hrv: finiteNumber(entry.hrv),
          activityScore: finiteNumber(entry.activityScore),
          reactionTime: finiteNumber(entry.reactionTime)
        })),
        wellbeing: safeRecords(wellbeing, (entry) => ({
          date: entry.date,
          mood: entry.mood || '',
          fatigue: finiteNumber(entry.fatigue),
          stress: finiteNumber(entry.stress),
          connection: entry.connection || ''
        })),
        activity: safeRecords(activities, (entry) => ({
          date: entry.date,
          name: entry.name || '',
          category: entry.category || '',
          status: entry.status || '',
          plannedMinutes: finiteNumber(entry.plannedMinutes),
          actualMinutes: finiteNumber(entry.actualMinutes)
        })),
        sleep: safeRecords(sleepLogs, (entry) => ({
          date: entry.date,
          kind: entry.kind || '',
          durationHours: finiteNumber(entry.durationHours),
          sleepHours: finiteNumber(entry.sleepHours),
          quality: finiteNumber(entry.quality),
          restedness: finiteNumber(entry.restedness),
          interruptions: finiteNumber(entry.interruptions)
        })),
        hydration: safeRecords(hydration, (entry) => ({
          date: entry.localDate || entry.date,
          amountMl: finiteNumber(entry.amountMl)
        })),
        meals: safeRecords(meals, (entry) => ({
          date: entry.date,
          time: entry.time || '',
          name: entry.name || '',
          status: entry.status || ''
        })),
        medication: safeRecords(medications, (entry) => ({
          date: entry.date,
          scheduleId: entry.scheduleId || '',
          status: entry.status || ''
        }))
      }
    };
  }

  function csvCell(value) {
    let text = value === null || value === undefined ? '' : String(value);
    if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function toCsv(report, profileName, translate) {
    if (!report || !report.records) throw new TypeError('A generated health report is required.');
    const t = typeof translate === 'function' ? translate : (value) => value;
    const rows = [
      ['AstroVital', t('Health report')],
      [t('Profile'), profileName || ''],
      [t('Report period'), t(report.period === 'daily' ? 'Daily' : 'Weekly')],
      [t('Date range'), `${report.startDate} – ${report.endDate}`],
      [t('Synthetic demo data'), report.sampleData ? t('Yes') : t('No')],
      [],
      [t('Category'), t('Metric'), t('Date'), t('Value'), t('Unit'), t('Details')]
    ];
    const addRow = (category, metric, date, value, unit, details, metricIsUserContent = false) => {
      rows.push([t(category), metricIsUserContent ? metric : t(metric), date, value, unit, details || '']);
    };

    addRow('Summary', 'Recorded days', '', report.recordedDays, '',
      `${t('Date range')}: ${report.startDate} – ${report.endDate}`);
    report.metricRows.forEach((metric) => {
      if (metric.average === null) return;
      const baselineDetail = metric.baseline === null
        ? ''
        : `${t('Baseline')}: ${metric.baseline} ${metric.unit}; ${t('Difference')}: ${metric.difference} ${metric.unit}`;
      addRow('Health indicators', metric.label, '', metric.average, metric.unit, baselineDetail);
    });
    [
      ['Wellbeing', 'Mood check-ins', report.wellbeing.entryCount, ''],
      ['Wellbeing', 'Fatigue', report.wellbeing.averageFatigue, ''],
      ['Wellbeing', 'Stress', report.wellbeing.averageStress, ''],
      ['Activity', 'Completed sessions', report.activity.completed, ''],
      ['Activity', 'Completed minutes', report.activity.completedMinutes, 'min'],
      ['Activity', 'Scheduled sessions', report.activity.statuses.scheduled, ''],
      ['Activity', 'Skipped sessions', report.activity.statuses.skipped, ''],
      ['Sleep', 'Total sleep', report.sleep.totalHours, 'h'],
      ['Sleep', 'Average per logged night', report.sleep.averageHours, 'h'],
      ['Sleep', 'Logged nights', report.sleep.loggedNights, ''],
      ['Hydration', 'Total intake', report.hydration.totalMl, 'mL'],
      ['Hydration', 'Entries', report.hydration.entryCount, ''],
      ['Meals', 'Scheduled meals', report.meals.statuses.scheduled, ''],
      ['Meals', 'Eaten', report.meals.statuses.eaten, ''],
      ['Meals', 'Partial', report.meals.statuses.partial, ''],
      ['Meals', 'Skipped', report.meals.statuses.skipped, ''],
      ['Medication log', 'Taken', report.medication.statuses.taken, ''],
      ['Medication log', 'Skipped', report.medication.statuses.skipped, '']
    ].forEach(([category, metric, value, unit]) => {
      if (value !== null) addRow('Summary', metric, '', value, unit, t(category));
    });

    report.records.health.forEach((record) => {
      METRICS.filter((metric) => metric.key !== 'sleepHours').forEach((metric) => {
        const value = record[metric.key];
        if (value !== null) addRow('Health indicators', metric.label, record.date, value, metric.unit);
      });
    });
    report.sleep.daily.forEach((entry) => {
      addRow('Sleep', 'Sleep duration', entry.date, entry.sleepHours, 'h');
    });
    report.records.wellbeing.forEach((entry) => {
      [['Mood check-ins', entry.mood, ''], ['Fatigue', entry.fatigue, ''], ['Stress', entry.stress, '']]
        .forEach(([metric, value, unit]) => {
          if (value !== '' && value !== null) addRow('Wellbeing', metric, entry.date, value, unit);
        });
    });
    report.records.activity.forEach((entry) => {
      addRow('Activity', entry.name || entry.category || 'Activity', entry.date,
        entry.actualMinutes === null ? entry.plannedMinutes : entry.actualMinutes, 'min', t(entry.status), true);
    });
    report.records.hydration.forEach((entry) => {
      addRow('Hydration', 'Total intake', entry.date, entry.amountMl, 'mL');
    });
    report.records.meals.forEach((entry) => {
      addRow('Meals', entry.name || 'Meal', entry.date, t(entry.status), '', entry.time, true);
    });
    report.records.medication.forEach((entry) => {
      addRow('Medication log', entry.scheduleId || 'Medication', entry.date, t(entry.status), '', '', true);
    });

    return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
  }

  return { createDemoData, getRange, summarize, toCsv };
}));
