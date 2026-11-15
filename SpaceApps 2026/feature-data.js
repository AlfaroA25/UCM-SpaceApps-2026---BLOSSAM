(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AstroVitalFeatureData = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function () {
  const MOODS = ['Low', 'Okay', 'Good', 'Great'];
  const CONNECTIONS = ['Connected', 'A little isolated', 'Isolated'];
  const ACTIVITY_CATEGORIES = ['Aerobic', 'Resistance', 'Mobility', 'Other approved activity'];
  const ENTRY_STATUSES = ['scheduled', 'completed', 'skipped'];
  const MEAL_STATUSES = ['scheduled', 'eaten', 'partial', 'skipped'];
  const MAX_ENTRIES = 500;

  function isDate(value) {
    return typeof value === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(value)
      && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
      && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  }

  function isTime(value) {
    return typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  }

  function text(value, limit) {
    return typeof value === 'string' ? value.trim().slice(0, limit) : '';
  }

  function optionalNumber(value, min, max) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? number : null;
  }

  function id(value, prefix, index) {
    return typeof value === 'string' && value.trim()
      ? value.trim().slice(0, 100)
      : `${prefix}-${index}`;
  }

  function normalizeWellbeingHistory(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.slice(0, MAX_ENTRIES).map((entry, index) => {
      if (!entry || !isDate(entry.date) || !MOODS.includes(entry.mood)) return null;
      const fatigue = optionalNumber(entry.fatigue, 1, 10);
      if (fatigue === null) return null;
      const stress = optionalNumber(entry.stress, 1, 10);
      const connection = CONNECTIONS.includes(entry.connection) ? entry.connection : null;
      return {
        id: id(entry.id, 'wellbeing', index),
        date: entry.date,
        time: text(entry.time, 30),
        mood: entry.mood,
        fatigue,
        stress,
        connection,
        note: text(entry.note, 500)
      };
    }).filter(Boolean);
  }

  function normalizeActivityEntries(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.slice(0, MAX_ENTRIES).map((entry, index) => {
      if (!entry || !isDate(entry.date) || !ACTIVITY_CATEGORIES.includes(entry.category)
        || !ENTRY_STATUSES.includes(entry.status)) return null;
      const name = text(entry.name, 80);
      const plannedMinutes = optionalNumber(entry.plannedMinutes, 1, 600);
      const actualMinutes = optionalNumber(entry.actualMinutes, 1, 600);
      if (!name || (entry.status === 'completed' && actualMinutes === null)) return null;
      return {
        id: id(entry.id, 'activity', index),
        date: entry.date,
        name,
        category: entry.category,
        status: entry.status,
        plannedMinutes,
        actualMinutes,
        note: text(entry.note, 300)
      };
    }).filter(Boolean);
  }

  function normalizeSleepSchedule(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.slice(0, MAX_ENTRIES).map((entry, index) => {
      if (!entry || !isDate(entry.date) || !isTime(entry.startTime) || !isTime(entry.endTime)
        || entry.startTime === entry.endTime) return null;
      return {
        id: id(entry.id, 'sleep-schedule', index),
        date: entry.date,
        label: text(entry.label, 80) || 'Sleep opportunity',
        startTime: entry.startTime,
        endTime: entry.endTime
      };
    }).filter(Boolean);
  }

  function sleepPeriodHours(startTime, endTime) {
    if (!isTime(startTime) || !isTime(endTime) || startTime === endTime) return null;
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    if (minutes < 0) minutes += 24 * 60;
    return minutes > 0 ? minutes / 60 : null;
  }

  function normalizeSleepLogs(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.slice(0, MAX_ENTRIES).map((entry, index) => {
      if (!entry || !isDate(entry.date)) return null;
      const entryId = id(entry.id, 'sleep', index);
      if (entry.kind === 'checkin') {
        const sleepHours = optionalNumber(entry.sleepHours, 0, 24);
        return sleepHours === null ? null : {
          id: entryId,
          kind: 'checkin',
          date: entry.date,
          sleepHours
        };
      }
      const durationHours = sleepPeriodHours(entry.startTime, entry.endTime);
      if (durationHours === null) return null;
      return {
        id: entryId,
        kind: 'period',
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        durationHours,
        quality: optionalNumber(entry.quality, 1, 5),
        restedness: optionalNumber(entry.restedness, 1, 5),
        interruptions: optionalNumber(entry.interruptions, 0, 30)
      };
    }).filter(Boolean);
  }

  function sleepTotalForDate(entries, date) {
    const matching = (Array.isArray(entries) ? entries : []).filter((entry) => entry.date === date);
    const periods = matching.filter((entry) => entry.kind === 'period');
    if (periods.length) return Math.round(periods.reduce((sum, entry) => sum + entry.durationHours, 0) * 100) / 100;
    const checkin = matching.filter((entry) => entry.kind === 'checkin').at(-1);
    return checkin ? checkin.sleepHours : null;
  }

  function normalizeMealEntries(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.slice(0, MAX_ENTRIES).map((entry, index) => {
      if (!entry || !isDate(entry.date) || !isTime(entry.time) || !MEAL_STATUSES.includes(entry.status)) return null;
      const name = text(entry.name, 100);
      if (!name) return null;
      return {
        id: id(entry.id, 'meal', index),
        date: entry.date,
        time: entry.time,
        name,
        status: entry.status,
        note: text(entry.note, 300),
        nutritionInfo: text(entry.nutritionInfo, 500),
        nutritionSource: text(entry.nutritionSource, 200)
      };
    }).filter(Boolean);
  }

  function hasTraceableNutrition(entry) {
    return Boolean(entry && text(entry.nutritionInfo, 500) && text(entry.nutritionSource, 200));
  }

  return {
    ACTIVITY_CATEGORIES,
    CONNECTIONS,
    MEAL_STATUSES,
    MOODS,
    ENTRY_STATUSES,
    hasTraceableNutrition,
    isDate,
    isTime,
    normalizeActivityEntries,
    normalizeMealEntries,
    normalizeSleepLogs,
    normalizeSleepSchedule,
    normalizeWellbeingHistory,
    sleepPeriodHours,
    sleepTotalForDate
  };
}));
