(() => {
  const STORAGE_KEY = 'astrovital-mission-health-v1';
  const LEGACY_PROFILE_CLAIMED_KEY = `${STORAGE_KEY}:legacy-claimed`;
  const DEFAULT_TIME_ZONE = 'America/Los_Angeles';
  let today = new Date().toISOString().slice(0, 10);
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const demoMedication = {
    name: 'Fictional sample A',
    schedule: [
      { id: 'sample-morning', time: '08:00' },
      { id: 'sample-evening', time: '20:00' }
    ],
    supply: '12 sample packs',
    expiry: '2030-06'
  };
  const missions = [
    { id: 'checkin', title: 'Complete your health check-in', description: 'Log how you slept and how you are feeling.', icon: '⌁', reward: 30, action: 'checkin' },
    { id: 'move', title: 'Move your body', description: 'Log approved exercise or mobility; resistance minutes are tracked separately.', icon: '↗', reward: 50, action: 'activity' },
    { id: 'breathe', title: 'Take a mindful pause', description: 'Try a short breathing or relaxation break.', icon: '◌', reward: 30, action: 'breathe' },
    { id: 'mind', title: 'Exercise your attention', description: 'Complete an optional Mind Lab activity.', icon: '⌘', reward: 50, action: 'game' }
  ];
  const rufusArtwork = {
    wave: { src: './icons/rufus-wave.png', name: 'Mission wave', description: 'Rufus waves hello in his flight suit.' },
    confident: { src: './icons/rufus-confident.png', name: 'Steady orbit', description: 'Rufus stands ready with a confident smile.' },
    rest: { src: './icons/rufus-rest.png', name: 'Recharge', description: 'Rufus takes a comfortable moment to rest.' },
    sleep: { src: './icons/rufus-sleep.png', name: 'Sleep cycle', description: 'Rufus drifts off for a well-earned rest.' }
  };
  const rufusAccessories = {
    'orbit-satellite': { name: 'Pocket satellite', description: 'A tiny satellite companion circling Rufus.', src: './icons/rufus-layer-satellite.svg', cost: 0 },
    'wrist-computer': { name: 'Wrist computer', description: 'A compact mission communicator on Rufus’s cuff.', src: './icons/rufus-layer-wrist.svg', cost: 35 },
    'holo-slate': { name: 'Holographic slate', description: 'A luminous field slate for curious explorers.', src: './icons/rufus-layer-slate.svg', cost: 50 },
    'comms-pack': { name: 'Comms pack', description: 'A flight-ready communications pack.', src: './icons/rufus-layer-pack.svg', cost: 60 }
  };
  const futurePages = {
    meals: { title: 'Meals and nutrition', phase: 'PHASE 3', detail: 'Meal schedules and meal logs are planned for Phase 3. AstroVital will not invent nutrition information.' },
    activity: { title: 'Physical activity', phase: 'PHASE 5', detail: 'This prototype can log mission-approved activity through Daily Missions. A dedicated schedule and activity-history view are planned for Phase 5.' },
    mental: { title: 'Mental wellness', phase: 'PHASE 5', detail: 'The current wellbeing log supports private, local check-ins. Expanded stress, sleep-quality, and wellness-history tools are planned for Phase 5.' },
    sleep: { title: 'Sleep tracking', phase: 'PHASE 5', detail: 'Sleep duration can be entered in the simulated health check-in. Dedicated sleep schedules, quality check-ins, and trends are planned for Phase 5.' },
  };
  const languageNames = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', zh: '简体中文', ja: '日本語', ar: 'العربية' };
  const timeZoneCopy = {
    en: { field: 'TIME ZONE', filter: 'Filter IANA time zones', detected: 'Browser detected:', settings: 'Choose the zone used for local time, dates, and in-app schedules.', invalid: 'Choose a valid IANA time zone.' },
    es: { field: 'ZONA HORARIA', filter: 'Filtrar zonas horarias IANA', detected: 'Detectada en el navegador:', settings: 'Elige la zona para la hora local, las fechas y los horarios de la aplicación.', invalid: 'Elige una zona horaria IANA válida.' },
    fr: { field: 'FUSEAU HORAIRE', filter: 'Filtrer les fuseaux IANA', detected: 'Détecté par le navigateur :', settings: 'Choisissez le fuseau utilisé pour l’heure locale, les dates et les horaires de l’application.', invalid: 'Choisissez un fuseau horaire IANA valide.' },
    de: { field: 'ZEITZONE', filter: 'IANA-Zeitzonen filtern', detected: 'Vom Browser erkannt:', settings: 'Zeitzone für Ortszeit, Datumsangaben und App-Zeitpläne auswählen.', invalid: 'Wähle eine gültige IANA-Zeitzone.' },
    zh: { field: '时区', filter: '筛选 IANA 时区', detected: '浏览器检测到：', settings: '选择用于本地时间、日期和应用内日程的时区。', invalid: '请选择有效的 IANA 时区。' },
    ja: { field: 'タイムゾーン', filter: 'IANA タイムゾーンを絞り込む', detected: 'ブラウザーの検出結果：', settings: '現地時刻、日付、アプリ内予定に使うタイムゾーンを選択します。', invalid: '有効な IANA タイムゾーンを選択してください。' },
    ar: { field: 'المنطقة الزمنية', filter: 'تصفية مناطق IANA الزمنية', detected: 'اكتشف المتصفح:', settings: 'اختر المنطقة المستخدمة للوقت المحلي والتواريخ والجداول داخل التطبيق.', invalid: 'اختر منطقة زمنية صالحة من IANA.' }
  };
  const millilitersPerUnit = { mL: 1, L: 1000, 'fl oz': 29.5735295625 };
  const seed = {
    version: 1,
    profile: { name: 'Astronaut', personnelId: '', role: 'Crew Member', missionId: '', language: 'en', timezone: DEFAULT_TIME_ZONE, notifications: false, hydrationGoal: '', hydrationUnit: 'mL', reminderStart: '', reminderEnd: '', reminderCount: '', hydrationScheduleConfirmed: false, interests: [], onboarded: false, heartMin: 58, heartMax: 72, sleepMin: 7.5, sleepMax: 9, radiationReviewAt: 50 },
    rufus: { pose: 'wave', inventory: ['orbit-satellite'], accessories: ['orbit-satellite'], stardust: 0, bondXp: 0, petDate: today, petCount: 0, petStreak: 0, lastPetDate: '' },
    metrics: { heart: 64, sleep: 7.4, sleepEfficiency: null, hrv: null, activityScore: null, reactionTime: null, exercise: 42, resistanceExercise: 24, fatigue: 3, stress: 3, mood: 'Good', connection: 'Connected', immuneSymptoms: 'None', cognition: 92, radiation: 38 },
    companion: { state: 'hello' }, hydrationLogs: [], medicationLog: [], xp: 2480, streak: 6, lastCheckin: 'TODAY, 07:42', checkinDate: today, lastCheckinDate: today,
    checkinHistory: [], activityEntries: [], sleepSchedule: [], sleepLogs: [], mealEntries: [],
    healthBaseline: { records: [], baseline: null, isSynthetic: false, personalRecordsBackup: [], personalBaselineBackup: null },
    completed: [], completedDate: today, achievements: [], cognitiveSessions: 3, bestReaction: 284,
    heartHistory: [68, 66, 67, 65, 66, 64, 64], sleepHistory: [6.8, 7.1, 7.6, 6.9, 7.8, 7.2, 7.4]
  };  const clone = (value) => JSON.parse(JSON.stringify(value));
  const DEMO_PERSONNEL_ID = '1234';
  const normalizePersonnelId = (value) => String(value || '').trim().toUpperCase();
  const isValidPersonnelId = (value) => value.length <= 20 && /^[A-Z0-9][A-Z0-9-]*$/.test(value);
  const profileStorageKey = (personnelId) => `${STORAGE_KEY}:personnel:${encodeURIComponent(personnelId)}`;
  let activeStorageKey = STORAGE_KEY;
  let state = loadState(activeStorageKey);
  let activeGame = 'memory';
  let activeInsightTab = 'baseline';
  let insightDemoMode = false;
  let demoInsightData = null;
  let activeRange = 7;
  let baselineChartRange = 30;
  let activityRange = 30;
  let sleepRange = 30;
  let mealRange = 30;
  let wellbeingRange = 30;
  let rufusCheerIndex = 0;
  let toastTimer;
  let gameTimer;
  let reactionStart = 0;
  let memorySequence = [];
  let memoryInput = [];
  let gameLocked = false;
  let pendingHydrationPlan = null;
  let pendingHydrationDeleteId = null;
  let nasaPowerData = null;
  let nasaPowerRequestId = 0;
  let latestHealthReport = null;
  let welcomeLanguageTouched = false;
  let rufusDialogue = '';
  let rufusReactionPose = '';
  let rufusReactionTimer;
  const artworkImageCache = new Map();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const localeTag = () => window.RufusI18n.localeTag;
  const formatNumber = (value, options = {}) => new Intl.NumberFormat(localeTag(), options).format(value);
  const formatDecimal = (value, digits = 1) => formatNumber(value, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });

  function normalizeBaselineData(value) {
    const engine = window.AstroVitalBaseline;
    const validDate = (date) => typeof date === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(date)
      && Number.isFinite(Date.parse(`${date}T00:00:00Z`))
      && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
    const normalizeSnapshot = (saved) => {
      if (saved?.ready !== true || saved.sample_days !== engine.BASELINE_DAYS
        || !validDate(saved.start_date) || !validDate(saved.end_date)
        || saved.start_date > saved.end_date || !saved.values || typeof saved.values !== 'object') return null;
      const normalizedValues = engine.normalizeRecords([{ date: saved.end_date, ...saved.values }])[0];
      return normalizedValues ? {
        ready: true,
        sample_days: engine.BASELINE_DAYS,
        start_date: saved.start_date,
        end_date: saved.end_date,
        values: Object.fromEntries(engine.METRICS.map(({ key }) => [key, normalizedValues[key]]))
      } : null;
    };
    const records = engine.normalizeRecords(value?.records);
    const calculated = engine.calculateBaseline(records);
    const baseline = normalizeSnapshot(value?.baseline) || (calculated.ready ? calculated : null);
    const personalRecordsBackup = engine.normalizeRecords(value?.personalRecordsBackup);
    const personalBaselineBackup = normalizeSnapshot(value?.personalBaselineBackup);
    return { records, baseline, isSynthetic: value?.isSynthetic === true, personalRecordsBackup, personalBaselineBackup };
  }

  function loadState(storageKey = STORAGE_KEY) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return clone(seed);
      const parsed = JSON.parse(saved);
      if (!parsed || parsed.version !== 1 || typeof parsed.metrics !== 'object' || typeof parsed.profile !== 'object') throw new Error('Saved AstroVital data has an unsupported format.');
      const savedRufus = parsed.rufus && typeof parsed.rufus === 'object' ? parsed.rufus : {};
      const savedPose = typeof savedRufus.pose === 'string' ? savedRufus.pose : 'wave';
      const inventory = Array.isArray(savedRufus.inventory) ? [...new Set(savedRufus.inventory.filter((item) => Object.hasOwn(rufusAccessories, item)))] : clone(seed.rufus.inventory);
      const accessories = Array.isArray(savedRufus.accessories) ? [...new Set(savedRufus.accessories.filter((item) => inventory.includes(item) && Object.hasOwn(rufusAccessories, item)))] : clone(seed.rufus.accessories);
      const normalized = {
        ...clone(seed), ...parsed, profile: {
          ...seed.profile,
          ...parsed.profile,
          timezone: isValidTimeZone(parsed.profile?.timezone) ? parsed.profile.timezone.trim() : DEFAULT_TIME_ZONE
        },
        rufus: {
          pose: Object.hasOwn(rufusArtwork, savedPose) ? savedPose : seed.rufus.pose, inventory, accessories,
          stardust: Number.isFinite(savedRufus.stardust) ? Math.max(0, savedRufus.stardust) : seed.rufus.stardust,
          bondXp: Number.isFinite(savedRufus.bondXp) ? Math.max(0, savedRufus.bondXp) : seed.rufus.bondXp,
          petDate: typeof savedRufus.petDate === 'string' ? savedRufus.petDate : today,
          petCount: Number.isFinite(savedRufus.petCount) ? Math.max(0, savedRufus.petCount) : 0,
          petStreak: Number.isFinite(savedRufus.petStreak) ? Math.max(0, savedRufus.petStreak) : 0,
          lastPetDate: typeof savedRufus.lastPetDate === 'string' ? savedRufus.lastPetDate : ''
        },
        metrics: {
          ...seed.metrics,
          ...parsed.metrics,
          stress: Number.isFinite(Number(parsed.metrics?.stress)) && Number(parsed.metrics?.stress) >= 1 && Number(parsed.metrics?.stress) <= 10
            ? Number(parsed.metrics?.stress)
            : seed.metrics.stress
        },
        companion: { ...seed.companion, ...parsed.companion },
        hydrationLogs: Array.isArray(parsed.hydrationLogs) ? parsed.hydrationLogs : [],
        medicationLog: Array.isArray(parsed.medicationLog)
          ? parsed.medicationLog.filter((entry) => entry && typeof entry === 'object'
            && typeof entry.id === 'string'
            && demoMedication.schedule.some((item) => item.id === entry.scheduleId)
            && typeof entry.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
            && ['taken', 'skipped'].includes(entry.status)
            && typeof entry.recordedAt === 'string')
            .map((entry) => ({ ...entry, note: typeof entry.note === 'string' ? entry.note.slice(0, 200) : '' }))
            .slice(0, 100)
          : clone(seed.medicationLog),
        completed: Array.isArray(parsed.completed) ? parsed.completed : [], achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        checkinHistory: window.AstroVitalFeatureData.normalizeWellbeingHistory(parsed.checkinHistory),
        activityEntries: window.AstroVitalFeatureData.normalizeActivityEntries(parsed.activityEntries),
        sleepSchedule: window.AstroVitalFeatureData.normalizeSleepSchedule(parsed.sleepSchedule),
        sleepLogs: window.AstroVitalFeatureData.normalizeSleepLogs(parsed.sleepLogs),
        mealEntries: window.AstroVitalFeatureData.normalizeMealEntries(parsed.mealEntries),
        healthBaseline: normalizeBaselineData(parsed.healthBaseline),
        heartHistory: Array.isArray(parsed.heartHistory) ? parsed.heartHistory : clone(seed.heartHistory),
        sleepHistory: Array.isArray(parsed.sleepHistory) ? parsed.sleepHistory : clone(seed.sleepHistory)
      };
      const allowedKeys = ['pose', 'inventory', 'accessories', 'stardust', 'bondXp', 'petDate', 'petCount', 'petStreak', 'lastPetDate'];
      const needsGearCleanup = !Object.hasOwn(rufusArtwork, savedPose)
        || inventory.length !== (Array.isArray(savedRufus.inventory) ? new Set(savedRufus.inventory).size : inventory.length)
        || accessories.length !== (Array.isArray(savedRufus.accessories) ? new Set(savedRufus.accessories).size : accessories.length)
        || Object.keys(savedRufus).some((key) => !allowedKeys.includes(key));
      if (needsGearCleanup) { try { localStorage.setItem(storageKey, JSON.stringify(normalized)); } catch { /* The in-memory profile remains sanitized. */ } }
      return normalized;
    } catch (error) {
      console.error('Unable to load saved AstroVital data:', error);
      setTimeout(() => showToast('Saved data could not be read. Showing the sample profile.'), 0);
      return clone(seed);
    }
  }
  function persist() {
    try {
      localStorage.setItem(activeStorageKey, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Unable to save AstroVital data:', error);
      showToast('Unable to save locally. Check this browser’s storage settings.');
      return false;
    }
  }


  function resetDailyProgressIfNeeded() {
    if (state.completedDate !== today) {
      state.completed = [];
      state.completedDate = today;
    }
    if (state.checkinDate !== today) state.checkinDate = '';
    if (state.rufus.petDate !== today) {
      state.rufus.petDate = today;
      state.rufus.petCount = 0;
    }
  }

  function showToast(message) {
    const node = $('#toast');
    const messageNode = $('#toast-message');
    if (!node || !messageNode) return;
    messageNode.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 2700);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function isValidTimeZone(value) {
    try {
      new Intl.DateTimeFormat('en', { timeZone: String(value || '').trim() });
      return true;
    } catch {
      return false;
    }
  }

  function getSupportedTimeZones() {
    const zones = [DEFAULT_TIME_ZONE, 'UTC', localTimeZone];
    if (typeof Intl.supportedValuesOf === 'function') {
      try {
        zones.push(...Intl.supportedValuesOf('timeZone'));
      } catch {
        // Keep the valid detected, UTC, and demo zones as a fallback.
      }
    } else {
      zones.push('America/New_York', 'America/Chicago', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney');
    }
    return [...new Set(zones.filter(isValidTimeZone))].sort((first, second) => first.localeCompare(second));
  }

  function populateTimeZoneOptions(select, selectedTimeZone = DEFAULT_TIME_ZONE) {
    if (!select) return;
    const fragment = document.createDocumentFragment();
    getSupportedTimeZones().forEach((timeZone) => {
      const option = document.createElement('option');
      option.value = timeZone;
      option.textContent = timeZone;
      fragment.append(option);
    });
    select.replaceChildren(fragment);
    select.value = isValidTimeZone(selectedTimeZone) ? selectedTimeZone : DEFAULT_TIME_ZONE;
  }

  function filterTimeZoneOptions(query, select) {
    if (!select) return;
    const filter = String(query || '').trim().toLocaleLowerCase('en');
    for (const option of select.options) {
      option.hidden = Boolean(filter) && !option.value.toLocaleLowerCase('en').includes(filter) && !option.selected;
    }
  }

  function updateTimeZoneLanguage(language = state.profile.language) {
    const copy = timeZoneCopy[language] || timeZoneCopy.en;
    const setText = (selector, value) => {
      const node = $(selector);
      if (node) node.textContent = value;
    };
    setText('#timezone-profile-label', copy.field);
    setText('#timezone-detected-label', copy.detected);
    setText('#browser-timezone', localTimeZone);
    setText('#timezone-profile-help', copy.settings);
    const filterInput = $('#timezone-filter');
    if (filterInput) filterInput.setAttribute('placeholder', copy.filter);
    if (filterInput) filterInput.setAttribute('aria-label', copy.filter);
    const profileInput = $('#profile-timezone');
    if (profileInput) profileInput.setAttribute('aria-label', copy.field);
  }

  function currentAlerts() {
    const alerts = [];
    const { metrics, profile } = state;
    if (metrics.heart < Number(profile.heartMin) || metrics.heart > Number(profile.heartMax)) {
      alerts.push({ title: 'Resting heart rate outside your reference range', detail: `Your sample reading is ${metrics.heart} bpm; your saved personal reference is ${profile.heartMin}–${profile.heartMax} bpm. Consider repeating the check-in and discussing persistent concerns with your flight surgeon.` });
    }
    if (metrics.sleep < 5) {
      alerts.push({ title: 'Sleep duration notably below target', detail: `Your sample sleep entry is ${metrics.sleep} hours. If this reflects how you are feeling, prioritize recovery and follow your crew medical officer’s guidance.` });
    } else if (metrics.sleep < Number(profile.sleepMin) - 1) {
      alerts.push({ title: 'Sleep duration below your personal target', detail: `Your sample sleep entry is ${metrics.sleep} hours; your profile target starts at ${profile.sleepMin} hours. Consider protecting your next sleep opportunity.` });
    }
    if (metrics.fatigue >= 8) {
      alerts.push({ title: 'High fatigue check-in', detail: `You reported fatigue at ${metrics.fatigue}/10. Consider pausing non-essential activity and checking in with your crew medical officer, especially if this persists.` });
    }
    if (['Moderate', 'Severe'].includes(metrics.immuneSymptoms)) {
      alerts.push({ title: 'Review self-reported symptoms', detail: `You marked your symptoms as ${metrics.immuneSymptoms.toLowerCase()}. This check-in cannot identify a cause. Follow mission medical protocols and contact your crew medical officer for guidance.` });
    }
    if (metrics.connection === 'Isolated') {
      alerts.push({ title: 'Crew connection check-in', detail: 'You marked feeling isolated. If it feels helpful, reach out to a crewmate or use your private wellbeing log; contact behavioral health support if this persists or concerns you.' });
    }
    if (metrics.radiation >= Number(profile.radiationReviewAt)) {
      alerts.push({ title: 'Review cumulative radiation exposure', detail: `The illustrative exposure value is ${metrics.radiation} mSv, at or above the simulated mission review marker of ${profile.radiationReviewAt} mSv. Follow mission radiation-monitoring protocols and contact mission medical support for interpretation.` });
    }
    return alerts;
  }

  function metricStatus(metric) {
    if (metric === 'heart') return state.metrics.heart < Number(state.profile.heartMin) || state.metrics.heart > Number(state.profile.heartMax);
    if (metric === 'sleep') return state.metrics.sleep < Number(state.profile.sleepMin) - 1;
    if (metric === 'fatigue') return state.metrics.fatigue >= 8;
    if (metric === 'immuneSymptoms') return ['Moderate', 'Severe'].includes(state.metrics.immuneSymptoms);
    if (metric === 'connection') return state.metrics.connection === 'Isolated';
    if (metric === 'radiation') return state.metrics.radiation >= Number(state.profile.radiationReviewAt);
    return false;
  }

  function setInsightTab(tab, shouldRender = true) {
    activeInsightTab = ['baseline', 'daily', 'weekly'].includes(tab) ? tab : 'baseline';
    const activePanel = activeInsightTab === 'baseline' ? 'baseline' : 'reports';
    $$('[data-insight-tab]').forEach((button) => {
      const active = button.dataset.insightTab === activeInsightTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $$('[data-insight-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.insightPanel !== activePanel;
    });
    $('#view-reports').setAttribute('aria-labelledby', `insight-tab-${activeInsightTab}`);
    const translate = window.RufusI18n.translate;
    $('#insights-mode-label').textContent = translate(insightDemoMode
      ? 'SYNTHETIC DEMO · ISOLATED'
      : 'PERSONAL RECORDS · LOCAL ONLY');
    $('#insights-demo-notice').hidden = !insightDemoMode;
    $('#insight-demo-toggle').textContent = translate(insightDemoMode ? 'Return to my data' : 'View demo data');
    $('#insight-demo-toggle').setAttribute('aria-pressed', String(insightDemoMode));
    if (!shouldRender) return;
    if (activeInsightTab === 'baseline') renderBaseline();
    else renderHealthReports();
  }

  function setNav(view) {
    const newWellbeingView = Boolean($('#view-wellbeing'));
    const aliases = {
      journal: newWellbeingView ? 'wellbeing' : 'journal',
      mental: newWellbeingView ? 'wellbeing' : 'journal',
      baseline: 'insights',
      reports: 'insights'
    };
    if (view === 'baseline') activeInsightTab = 'baseline';
    if (view === 'reports') activeInsightTab = 'daily';
    const selectedView = aliases[view] || view;
    const isFuturePage = Boolean(futurePages[selectedView] && !$(`#view-${selectedView}`));
    const activeView = isFuturePage ? 'roadmap' : selectedView;
    $$('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${activeView}`));
    $$('.nav-link[data-nav]').forEach((button) => button.classList.toggle('active', button.dataset.nav === selectedView));
    const labels = {
      overview: 'HOME DASHBOARD', health: 'HEALTH MONITOR', hydration: 'HYDRATION TRACKER', environment: 'NASA ENVIRONMENTAL DATA',
      meals: 'MEALS & NUTRITION', medications: 'MEDICATION MANAGER', activity: 'PHYSICAL ACTIVITY',
      insights: 'HEALTH INSIGHTS', sleep: 'SLEEP TRACKING',
      alerts: 'ALERTS', missions: 'DAILY MISSIONS', cognitive: 'MIND LAB', wellbeing: 'WELLBEING', journal: 'WELLBEING LOG',
      settings: 'SETTINGS'
    };
    $('#page-crumb').textContent = labels[selectedView] || labels.overview;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'health') renderHealth();
    if (selectedView === 'insights') setInsightTab(activeInsightTab);
    if (view === 'hydration') renderHydration(true);
    if (view === 'medications') renderMedicationManager();
    if (view === 'activity') renderActivity();
    if (view === 'sleep') renderSleep();
    if (view === 'meals') renderMeals();
    if (view === 'missions') renderMissions();
    if (selectedView === 'wellbeing') renderWellbeing();
    if (view === 'settings') renderSettings();
    if (view === 'companion') renderCompanion();
    if (view === 'cognitive') speakRufus('A curious mind is ready for its next little puzzle.', 'Curious', 'confident');
    if (view === 'alerts') renderAlertsPage();
    if (isFuturePage) {
      $('#roadmap-title').textContent = futurePages[selectedView].title;
      $('#roadmap-phase').textContent = `${futurePages[selectedView].phase} · PLANNED`;
      $('#roadmap-detail').textContent = futurePages[selectedView].detail;
    }
  }

  function updateClock() {
    const timeZone = isValidTimeZone(state.profile.timezone) ? state.profile.timezone : DEFAULT_TIME_ZONE;
    const now = new Date();
    const profileDate = localDateKey(now, timeZone);
    const dateChanged = profileDate !== today;
    if (dateChanged) {
      today = profileDate;
      resetDailyProgressIfNeeded();
    }
    $('#clock').textContent = new Intl.DateTimeFormat(localeTag(), { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now);
    $('#profile-clock').textContent = new Intl.DateTimeFormat(localeTag(), { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now);
    $('#profile-clock-zone').textContent = timeZone;
    $('#local-date').textContent = new Intl.DateTimeFormat(localeTag(), { timeZone, dateStyle: 'full' }).format(now);
    if (dateChanged && !document.body.classList.contains('show-entry')) {
      renderOverview();
      renderWellbeing();
      renderHydration();
      renderMedicationManager();
      renderActivity();
      renderSleep();
      renderMeals();
      if ($('#view-insights').classList.contains('active')) setInsightTab(activeInsightTab);
    }
  }

  function updateProfileLabels() {
    $$('.user-lines strong,#welcome-name,.avatar,.top-avatar').forEach((node) => {
      node.dataset.userContent = '';
    });
    const missionIdentifier = $('#mission-identifier');
    if (state.profile.missionId) missionIdentifier.dataset.userContent = '';
    else delete missionIdentifier.dataset.userContent;
    $$('.user-lines strong').forEach((node) => { node.textContent = state.profile.name; });
    $$('.user-lines small').forEach((node) => { node.textContent = state.profile.role.toUpperCase(); });
    $('#welcome-name').textContent = `${state.profile.name.split(/\s+/)[0]}.`;
    const initials = state.profile.name.split(/\s+/).map((part) => part[0] || '').slice(0, 2).join('').toUpperCase();
    $$('.avatar,.top-avatar').forEach((node) => { node.textContent = initials; });
    $('#mission-identifier').textContent = state.profile.missionId || 'NOT SET';
  }

  function renderSettings() {
    const rows = [
      ['DISPLAY NAME', state.profile.name],
      ['PERSONNEL ID · LOCAL PROFILE', state.profile.personnelId || 'Not set'],
      ['MISSION IDENTIFIER', state.profile.missionId || 'Not set'],
      ['LANGUAGE PREFERENCE', languageNames[state.profile.language] || languageNames.en],
      ['TIME ZONE', state.profile.timezone],
      ['DAILY WATER GOAL', state.profile.hydrationGoal ? `${state.profile.hydrationGoal} ${state.profile.hydrationUnit}` : 'Not set'],
      ['HYDRATION SCHEDULE', state.profile.hydrationScheduleConfirmed
        ? `${state.profile.reminderStart}–${state.profile.reminderEnd}`
        : 'Not confirmed · open Hydration Tracker'],
      ['REMINDERS PER DAY', state.profile.hydrationScheduleConfirmed
        ? state.profile.reminderCount
        : state.profile.reminderCount ? 'Preference only · confirm on Hydration Tracker' : 'Not set'],
      ['REMINDER PREFERENCE', state.profile.notifications ? 'Saved as enabled · delivery not implemented' : 'Off'],
      ['WELLNESS INTERESTS', Array.isArray(state.profile.interests) && state.profile.interests.length ? state.profile.interests.join(', ') : 'None selected']
    ];
    $('#settings-summary').innerHTML = rows.map(([label, value]) => {
      const personalValue = ['DISPLAY NAME', 'PERSONNEL ID · LOCAL PROFILE', 'MISSION IDENTIFIER'].includes(label);
      return `<div class="settings-item"><small>${escapeHtml(label)}</small><strong${personalValue ? ' data-user-content' : ''}>${escapeHtml(value)}</strong></div>`;
    }).join('');
  }

  function renderAlertsPage() {
    const alerts = currentAlerts();
    $('#alerts-page-content').innerHTML = alerts.length
      ? alerts.map((alert) => `<div class="alert-card"><span class="alert-mark">ⓘ</span><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.detail)}</p></div></div>`).join('')
      : '<div class="alert-empty">No sample readings currently flag for review. This is not continuous or emergency monitoring.</div>';
  }

  function volumeToMl(amount, unit) {
    const value = Number(amount);
    const factor = millilitersPerUnit[unit];
    return Number.isFinite(value) && factor ? value * factor : NaN;
  }

  function formatVolume(amountMl, unit) {
    const value = amountMl / millilitersPerUnit[unit];
    const decimals = unit === 'mL' ? 0 : 2;
    const rounded = Number(value.toFixed(decimals));
    return `${new Intl.NumberFormat(localeTag(), { maximumFractionDigits: decimals }).format(rounded)} ${unit}`;
  }

  function localDateKey(date, timeZone) {
    const parts = new Intl.DateTimeFormat(localeTag(), {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit', numberingSystem: 'latn'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function previousDateKey(dateKey) {
    const date = new Date(`${dateKey}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  function currentLocalMinute(timeZone) {
    const parts = new Intl.DateTimeFormat(localeTag(), {
      timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', numberingSystem: 'latn'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return Number(values.hour) * 60 + Number(values.minute);
  }

  function localDayMinute(value) {
    const [hour, minute] = value.split(':').map(Number);
    return hour * 60 + minute;
  }

  function minuteTime(value) {
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    const date = new Date(Date.UTC(2020, 0, 1, hour, minute));
    return new Intl.DateTimeFormat(localeTag(), {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(date);
  }

  function currentHydrationPlan() {
    const goalMl = volumeToMl(state.profile.hydrationGoal, state.profile.hydrationUnit);
    const count = Number(state.profile.reminderCount);
    if (!state.profile.hydrationScheduleConfirmed || !(goalMl > 0) || !state.profile.reminderStart || !state.profile.reminderEnd || !(count > 0)) return null;
    return {
      goal: Number(state.profile.hydrationGoal),
      unit: state.profile.hydrationUnit,
      goalMl,
      start: state.profile.reminderStart,
      end: state.profile.reminderEnd,
      count
    };
  }

  function hydrationLogsForDate(dateKey) {
    return state.hydrationLogs.filter((log) => log.localDate === dateKey);
  }

  function hydrationTotalForDate(dateKey) {
    return hydrationLogsForDate(dateKey).reduce((total, log) => total + Number(log.amountMl || 0), 0);
  }

  function hydrationSummary() {
    const today = localDateKey(new Date(), state.profile.timezone || localTimeZone);
    const goalMl = volumeToMl(state.profile.hydrationGoal, state.profile.hydrationUnit);
    const consumedMl = hydrationTotalForDate(today);
    const hasGoal = Number.isFinite(goalMl) && goalMl > 0;
    return {
      today,
      goalMl: hasGoal ? goalMl : null,
      consumedMl,
      remainingMl: hasGoal ? Math.max(0, goalMl - consumedMl) : null,
      percent: hasGoal ? Math.min(100, consumedMl / goalMl * 100) : 0
    };
  }

  function planSlots(plan) {
    const start = localDayMinute(plan.start);
    const end = localDayMinute(plan.end);
    const interval = (end - start) / plan.count;
    return Array.from({ length: plan.count }, (_, index) => ({
      minute: Math.round(start + interval * index),
      time: minuteTime(Math.round(start + interval * index))
    }));
  }

  function remainingPlanSlots(plan, summary = hydrationSummary()) {
    if (!plan || summary.consumedMl >= plan.goalMl) return [];
    const now = currentLocalMinute(state.profile.timezone || localTimeZone);
    const future = planSlots(plan).filter((slot) => slot.minute > now);
    if (!future.length) return [];
    const baseAmount = plan.goalMl / plan.count;
    const remaining = Math.max(0, plan.goalMl - summary.consumedMl);
    const allocation = Math.min(baseAmount, remaining / future.length);
    return future.map((slot) => ({ ...slot, amountMl: allocation }));
  }

  function renderHydrationSchedule(plan = currentHydrationPlan(), preview = false) {
    const list = $('#hydration-schedule-list');
    const summary = hydrationSummary();
    const slots = preview
      ? planSlots(plan).map((slot) => ({ ...slot, amountMl: plan.goalMl / plan.count }))
      : remainingPlanSlots(plan, summary);

    if (!plan) {
      list.innerHTML = '<div class="hydration-empty">Save a goal and schedule to see planned times.</div>';
      $('#hydration-next-summary').textContent = 'No schedule';
      $('#hydration-next-detail').textContent = 'Choose a plan to preview times';
      return;
    }
    if (!preview && summary.consumedMl >= plan.goalMl) {
      list.innerHTML = '<div class="hydration-empty">Your configured target is reached. No more goal-based reminders are planned today.</div>';
      $('#hydration-next-summary').textContent = 'Target reached';
      $('#hydration-next-detail').textContent = 'No further goal-based reminders';
      return;
    }
    if (!slots.length) {
      list.innerHTML = '<div class="hydration-empty">No future times remain in today’s window. Past times are not counted as missed.</div>';
      $('#hydration-next-summary').textContent = 'No more times today';
      $('#hydration-next-detail').textContent = 'Follow your approved plan';
      return;
    }
    list.innerHTML = slots.map((slot) => `<div class="hydration-schedule-row"><time>${slot.time}</time><strong>${formatVolume(slot.amountMl, plan.unit)}</strong><span>${preview ? 'PREVIEW' : 'PLANNED'}</span></div>`).join('');
    if (!preview) {
      $('#hydration-next-summary').textContent = slots[0].time;
      $('#hydration-next-detail').textContent = `${formatVolume(slots[0].amountMl, plan.unit)} · in-app plan only`;
    }
  }

  function renderHydrationHistory() {
    const today = hydrationSummary().today;
    const todayLogs = hydrationLogsForDate(today);
    $('#hydration-entry-count').textContent = `${todayLogs.length} today`;
    const entries = [...state.hydrationLogs].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    $('#hydration-today-history').innerHTML = entries.length
      ? entries.slice(0, 40).map((log) => {
        const unit = state.profile.hydrationUnit || 'mL';
        const date = new Date(log.recordedAt);
        const dateLabel = log.localDate === today
          ? 'TODAY'
          : new Intl.DateTimeFormat(localeTag(), { timeZone: log.timeZone || state.profile.timezone, month: 'short', day: 'numeric' }).format(date);
        const timeLabel = new Intl.DateTimeFormat(localeTag(), {
          timeZone: log.timeZone || state.profile.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).format(date);
        return `<article class="hydration-log-row"><div class="hydration-log-value"><strong>${formatVolume(log.amountMl, unit)}</strong><small>${dateLabel} · ${timeLabel}</small></div><div class="hydration-log-actions"><button type="button" class="secondary-button" data-hydration-edit="${escapeHtml(log.id)}" aria-label="Edit intake entry">EDIT</button><button type="button" class="secondary-button delete-hydration-button" data-hydration-delete="${escapeHtml(log.id)}" aria-label="Delete intake entry">DELETE</button></div></article>`;
      }).join('')
      : '<div class="hydration-empty">No water intake logged yet. Add an entry whenever you want.</div>';
  }

  function renderHydrationWeek() {
    const today = hydrationSummary().today;
    const [year, month, day] = today.split('-').map(Number);
    const goalMl = volumeToMl(state.profile.hydrationGoal, state.profile.hydrationUnit);
    const dailyTotals = Array.from({ length: 7 }, (_, offset) => hydrationTotalForDate(
      new Date(Date.UTC(year, month - 1, day - (6 - offset), 12)).toISOString().slice(0, 10)
    ));
    const maxTotal = Number.isFinite(goalMl) && goalMl > 0 ? goalMl : Math.max(1, ...dailyTotals);
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(Date.UTC(year, month - 1, day - (6 - index), 12));
      const dateKey = date.toISOString().slice(0, 10);
      const total = hydrationTotalForDate(dateKey);
      const weekday = new Intl.DateTimeFormat(localeTag(), { weekday: 'short', timeZone: 'UTC' }).format(date);
      const dayLabel = new Intl.DateTimeFormat(localeTag(), { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
      return `<div class="hydration-day"><div class="hydration-day-label"><strong>${weekday}</strong><small>${dayLabel}</small></div><div class="hydration-day-track"><span style="width:${Math.min(100, total / maxTotal * 100)}%"></span></div><b>${formatVolume(total, state.profile.hydrationUnit || 'mL')}</b></div>`;
    });
    $('#hydration-week-history').innerHTML = days.join('');
  }

  function renderHydration(syncForms = false) {
    const summary = hydrationSummary();
    const unit = state.profile.hydrationUnit || 'mL';
    const plan = currentHydrationPlan();
    $('#hydration-goal-summary').textContent = summary.goalMl === null ? 'Not set' : formatVolume(summary.goalMl, unit);
    $('#hydration-consumed-summary').textContent = formatVolume(summary.consumedMl, unit);
    $('#hydration-remaining-summary').textContent = summary.remainingMl === null
      ? 'Not set'
      : summary.remainingMl === 0 ? 'Target reached' : formatVolume(summary.remainingMl, unit);
    $('#hydration-percent-summary').textContent = summary.goalMl === null ? 'Set your own target' : `${Math.round(summary.percent)}% of configured target`;
    $('#hydration-progress-label').textContent = summary.goalMl === null
      ? 'Set a personal target to track progress'
      : `${formatVolume(summary.consumedMl, unit)} of ${formatVolume(summary.goalMl, unit)}`;
    $('#hydration-progress-bar').style.width = `${summary.percent}%`;
    if (syncForms) {
      $('#hydration-log-unit').value = unit;
      $('#plan-goal').value = state.profile.hydrationGoal || '';
      $('#plan-unit').value = unit;
      $('#plan-start').value = state.profile.reminderStart || '';
      $('#plan-end').value = state.profile.reminderEnd || '';
      $('#plan-count').value = state.profile.reminderCount || '';
    }
    renderHydrationHistory();
    renderHydrationWeek();
    renderHydrationSchedule(plan);
  }

  function localDateInputValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function initializeNasaPowerDates() {
    const today = new Date();
    const latestEnd = new Date(today);
    latestEnd.setDate(latestEnd.getDate() - 2);
    const start = new Date(latestEnd);
    start.setDate(start.getDate() - 6);
    const todayValue = localDateInputValue(today);
    $('#power-start').max = todayValue;
    $('#power-end').max = todayValue;
    $('#power-end').value = localDateInputValue(latestEnd);
    $('#power-start').value = localDateInputValue(start);
  }

  function formatPowerDate(value) {
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat(localeTag(), { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
      : 'Date not available';
  }

  function formatAppDate(value) {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat(localeTag(), { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
      : value;
  }

  function formatPowerNumber(value) {
    return new Intl.NumberFormat(localeTag(), { maximumFractionDigits: 2 }).format(value);
  }

  function formatCoordinate(value) {
    return formatNumber(value, { maximumFractionDigits: 4 });
  }

  function renderPowerSummary(data) {
    $('#power-summary-grid').innerHTML = data.parameters.map((parameter) => {
      const latest = parameter.latest;
      const value = latest
        ? `${formatPowerNumber(latest.value)} ${escapeHtml(parameter.units)}`
        : 'No measurement available';
      const date = latest ? formatPowerDate(latest.date) : 'No valid date';
      return `<article class="power-summary-card"><small>${escapeHtml(parameter.label)}</small><strong>${value}</strong><span>Latest valid day · ${escapeHtml(date)}</span></article>`;
    }).join('');
  }

  function renderPowerChart(data) {
    const chart = $('#power-chart');
    const parameter = data.parameters.find((entry) => entry.code === $('#power-chart-parameter').value);
    const observations = parameter?.observations || [];
    const valid = observations.filter((item) => item.value !== null);
    if (!parameter || valid.length === 0) {
      chart.textContent = 'No valid measurements are available to plot for this parameter.';
      return;
    }

    const width = 900;
    const height = 270;
    const left = 64;
    const right = 18;
    const top = 24;
    const bottom = 38;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const values = valid.map((item) => item.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const padding = rawMin === rawMax ? Math.max(Math.abs(rawMin) * 0.1, 1) : (rawMax - rawMin) * 0.12;
    const min = rawMin - padding;
    const max = rawMax + padding;
    const x = (index) => left + (observations.length < 2 ? plotWidth / 2 : index / (observations.length - 1) * plotWidth);
    const y = (value) => top + (max - value) / (max - min) * plotHeight;
    const paths = [];
    let segment = [];
    observations.forEach((item, index) => {
      if (item.value === null) {
        if (segment.length) paths.push(segment);
        segment = [];
      } else {
        segment.push(`${segment.length ? 'L' : 'M'}${x(index)},${y(item.value)}`);
      }
    });
    if (segment.length) paths.push(segment);
    const grids = Array.from({ length: 5 }, (_, index) => {
      const value = max - (max - min) * index / 4;
      const gy = top + plotHeight * index / 4;
      return `<line x1="${left}" y1="${gy}" x2="${width - right}" y2="${gy}" class="power-grid-line"/><text x="${left - 8}" y="${gy + 3}" text-anchor="end" class="power-axis-label">${formatPowerNumber(value)}</text>`;
    }).join('');
    const tickIndices = [...new Set([0, Math.floor((observations.length - 1) / 2), observations.length - 1])];
    const xLabels = tickIndices.map((index) => `<text x="${x(index)}" y="${height - 10}" text-anchor="${index === 0 ? 'start' : index === observations.length - 1 ? 'end' : 'middle'}" class="power-axis-label">${escapeHtml(observations[index].date.slice(5))}</text>`).join('');
    const linePaths = paths.map((commands) => `<path d="${commands.join(' ')}" class="power-line"/>`).join('');
    const points = observations.map((item, index) => item.value === null
      ? ''
      : `<circle cx="${x(index)}" cy="${y(item.value)}" r="3" class="power-point"><title>${escapeHtml(item.date)} · ${formatPowerNumber(item.value)} ${escapeHtml(parameter.units)}</title></circle>`).join('');
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(parameter.label)} in ${escapeHtml(parameter.units)} from ${escapeHtml(data.requestedRange.start)} through ${escapeHtml(data.requestedRange.end)}">${grids}${linePaths}${points}${xLabels}</svg>`;
  }

  function renderPowerTable(data) {
    const headings = data.parameters.map((parameter) => `<th scope="col">${escapeHtml(parameter.label)}<small>${escapeHtml(parameter.units)}</small></th>`).join('');
    $('#power-table-head').innerHTML = `<tr><th scope="col">DATE</th>${headings}</tr>`;
    const byDate = new Map(data.parameters.map((parameter) => [
      parameter.code,
      new Map(parameter.observations.map((observation) => [observation.date, observation.value]))
    ]));
    const dates = [...new Set(data.parameters.flatMap((parameter) => parameter.observations.map((item) => item.date)))].sort().reverse();
    $('#power-table-body').innerHTML = dates.map((date) => {
      const cells = data.parameters.map((parameter) => {
        const value = byDate.get(parameter.code)?.get(date);
        return `<td>${value === null || value === undefined ? '<span class="power-missing">Unavailable</span>' : `${formatPowerNumber(value)} ${escapeHtml(parameter.units)}`}</td>`;
      }).join('');
      return `<tr><th scope="row">${escapeHtml(formatPowerDate(date))}</th>${cells}</tr>`;
    }).join('');
  }

  function renderPowerResults(data) {
    $('#power-results').hidden = false;
    const coordinates = `${formatCoordinate(data.location.latitude)}, ${formatCoordinate(data.location.longitude)}`;
    $('#power-location').textContent = `${coordinates} · lat/lon`;
    $('#power-range').textContent = `${formatPowerDate(data.requestedRange.start)} – ${formatPowerDate(data.requestedRange.end)}`;
    $('#power-latest-date').textContent = data.latestDate ? formatPowerDate(data.latestDate) : 'No valid measurements';
    $('#power-time-standard').textContent = data.timeStandard === 'LST' ? 'Local Solar Time (LST)' : data.timeStandard;
    $('#power-source-description').textContent = `NASA POWER Daily API · requested coordinates ${coordinates} · requested dates ${data.requestedRange.start} to ${data.requestedRange.end}. Measurements are daily surface/environmental estimates, not personal health readings.`;
    $('#power-source-systems').textContent = `Source systems reported by NASA POWER: ${data.sourceSystems.length ? data.sourceSystems.join(', ') : 'Not specified'}.`;
    $('#power-latest-time-note').textContent = `Latest available measurement day: ${data.latestDate ? formatPowerDate(data.latestDate) : 'none'}. The daily API provides a date and time standard, not a single observation timestamp. Data retrieved at ${new Intl.DateTimeFormat(localeTag(), { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'UTC' }).format(new Date(data.fetchedAt))} UTC.`;
    const selectedCode = $('#power-chart-parameter').value;
    $('#power-chart-parameter').innerHTML = data.parameters
      .map((parameter) => `<option value="${escapeHtml(parameter.code)}">${escapeHtml(parameter.label)} · ${escapeHtml(parameter.units)}</option>`)
      .join('');
    if (data.parameters.some((parameter) => parameter.code === selectedCode)) $('#power-chart-parameter').value = selectedCode;
    renderPowerSummary(data);
    renderPowerChart(data);
    renderPowerTable(data);
  }

  async function loadNasaPowerData() {
    const requestId = ++nasaPowerRequestId;
    const form = $('#nasa-power-form');
    const request = Object.fromEntries(new FormData(form));
    const button = $('#power-load-button');
    $('#power-results').hidden = true;
    $('#power-request-error').hidden = true;
    $('#power-request-status').textContent = 'Requesting daily measurements from NASA POWER…';
    button.disabled = true;
    button.textContent = 'LOADING…';
    try {
      nasaPowerData = await window.RufusNasaPower.fetchDaily(request);
      if (requestId !== nasaPowerRequestId) return;
      renderPowerResults(nasaPowerData);
      $('#power-request-status').textContent = `NASA POWER returned daily environmental data for ${nasaPowerData.location.latitude}, ${nasaPowerData.location.longitude}. Values may be delayed; latest available day: ${nasaPowerData.latestDate || 'not reported'}.`;
    } catch (error) {
      if (requestId !== nasaPowerRequestId) return;
      nasaPowerData = null;
      $('#power-request-error').textContent = error instanceof Error ? error.message : 'NASA POWER request failed. Try again.';
      $('#power-request-error').hidden = false;
      $('#power-request-status').textContent = 'No NASA POWER data loaded.';
    } finally {
      if (requestId === nasaPowerRequestId) {
        button.disabled = false;
        button.textContent = 'LOAD NASA POWER DATA';
      }
    }
  }

  function renderHydrationPreview(plan) {
    const perReminder = plan.goalMl / plan.count;
    $('#hydration-plan-preview').innerHTML = `<div class="hydration-preview-summary"><strong>Preview · ${formatVolume(plan.goalMl, plan.unit)} daily target</strong><span>${formatVolume(perReminder, plan.unit)} × ${plan.count} reminders · every ${Math.round((localDayMinute(plan.end) - localDayMinute(plan.start)) / plan.count)} min</span></div>`;
    renderHydrationSchedule(plan, true);
    $('#confirm-hydration-plan').hidden = false;
  }

  function clearHydrationPreview() {
    pendingHydrationPlan = null;
    $('#confirm-hydration-plan').hidden = true;
    $('#hydration-plan-preview').textContent = '';
    renderHydrationSchedule();
  }

  function recordHydration(amount, unit) {
    const amountMl = volumeToMl(amount, unit);
    if (!(amountMl > 0) || !Number.isFinite(amountMl)) {
      $('#hydration-feedback').textContent = 'Enter a positive amount and choose a supported unit.';
      return false;
    }
    const now = new Date();
    const timeZone = state.profile.timezone || localTimeZone;
    state.hydrationLogs.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amountMl: Math.round(amountMl * 10) / 10,
      recordedAt: now.toISOString(),
      localDate: localDateKey(now, timeZone),
      timeZone
    });
    clearHydrationPreview();
    $('#hydration-feedback').textContent = 'Intake recorded locally. AstroVital does not infer intake from reminders.';
    const summary = hydrationSummary();
    reactToActivity(summary.goalMl !== null && summary.consumedMl >= summary.goalMl ? 'hydration-complete' : 'hydration');
    persist();
    renderOverview();
    renderHydration();
    showToast('Water intake recorded on this device');
    return true;
  }

  function openHydrationEdit(id) {
    const log = state.hydrationLogs.find((entry) => entry.id === id);
    if (!log) {
      showToast('That intake entry is no longer available.');
      return;
    }
    const unit = state.profile.hydrationUnit || 'mL';
    const amount = (log.amountMl / millilitersPerUnit[unit]).toFixed(unit === 'mL' ? 0 : 2);
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> HYDRATION · EDIT ENTRY</div><h2 id="modal-title">Correct intake entry</h2><p>Change the recorded amount. The original time and date will be kept.</p><form id="hydration-edit-form"><input type="hidden" name="id" value="${escapeHtml(id)}"><div class="modal-form"><label>AMOUNT<input name="amount" type="number" min="0.1" max="20000" step="any" value="${amount}" required></label><label>UNIT<select name="unit"><option ${unit === 'mL' ? 'selected' : ''}>mL</option><option ${unit === 'L' ? 'selected' : ''}>L</option><option ${unit === 'fl oz' ? 'selected' : ''}>fl oz</option></select></label></div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE CORRECTION</button></div></form>`);
  }

  function confirmDeleteHydration(id) {
    if (!state.hydrationLogs.some((log) => log.id === id)) {
      showToast('That intake entry is no longer available.');
      return;
    }
    pendingHydrationDeleteId = id;
    openModal('<div class="eyebrow"><span class="eyebrow-line"></span> HYDRATION · REMOVE ENTRY</div><h2 id="modal-title">Delete this intake entry?</h2><p>This only removes the selected local record. Other entries stay unchanged.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="button" class="primary-button" data-action="confirm-delete-hydration">DELETE ENTRY</button></div>');
  }

  function renderRufus() {
    const reactions = {
      hello: { state: 'READY TO EXPLORE', title: 'Hi, {name}!', message: 'I’m here to help you keep track of your wellbeing. Want to start with a quick check-in?', button: 'LOG A CHECK-IN', expression: 'state-happy' },
      checkin: { state: 'CHECK-IN COMPLETE', title: 'Thanks for checking in.', message: 'Noticing how you feel is a good place to start. Your latest sample indicators are ready to review.', button: 'VIEW HEALTH INDICATORS', action: 'health', expression: 'state-happy' },
      activity: { state: 'ACTIVITY LOGGED', title: 'Nice work, {name}.', message: 'Your activity was recorded. Follow the exercise plan approved for your mission.', button: 'VIEW DAILY MISSIONS', action: 'missions', expression: 'state-celebrating' },
      pause: { state: 'PAUSE COMPLETE', title: 'A moment to reset.', message: 'Thanks for taking a comfortable pause. Take your time and follow your own mission guidance.', button: 'OPEN WELLBEING LOG', action: 'journal', expression: 'state-resting' },
      journal: { state: 'WELLBEING LOG SAVED', title: 'Thanks for checking in, {name}.', message: 'Your reflection is saved privately on this device. Take things at your own pace; support is available if you want it.', button: 'VIEW HEALTH INDICATORS', action: 'health', expression: 'state-resting' },
      hydration: { state: 'INTAKE RECORDED', title: 'Thanks for logging that, {name}.', message: 'I updated your intake record. Keep following the plan you chose with your mission team; no catch-up drinking is suggested.', button: 'VIEW HYDRATION', action: 'hydration', expression: 'state-happy' },
      'hydration-complete': { state: 'PERSONAL TARGET REACHED', title: 'Your configured target is logged.', message: 'I’ve stopped today’s goal-based schedule. Keep following your approved plan; there’s no need to drink beyond your target.', button: 'VIEW HYDRATION', action: 'hydration', expression: 'state-celebrating' },
      focus: { state: 'MIND LAB COMPLETE', title: 'Great focus, {name}.', message: 'That optional game is complete. Its score is for fun and is not a cognitive assessment.', button: 'OPEN MIND LAB', action: 'cognitive', expression: 'state-celebrating' }
    };
    const reaction = reactions[state.companion.state] || reactions.hello;
    const firstName = state.profile.name.split(/\s+/)[0] || 'astronaut';
    $('#rufus-state').textContent = reaction.state;
    $('#rufus-title').textContent = reaction.title.replace(/\{name\}/g, firstName);
    $('#rufus-message').textContent = reaction.message;
    const actionButton = $('#rufus-action');
    actionButton.innerHTML = `${reaction.button} <span>→</span>`;
    if (reaction.action) {
      actionButton.dataset.nav = reaction.action;
      delete actionButton.dataset.action;
    } else {
      actionButton.dataset.action = 'checkin';
      delete actionButton.dataset.nav;
    }
    $('#rufus-portrait').className = `rufus-portrait ${reaction.expression}`;    renderRufusArtwork();

  }

  function reactToActivity(stateName) {
    state.companion = { state: stateName };
    renderRufus();
  }

  function renderXp() {
    $('#xp-total').textContent = state.xp.toLocaleString(localeTag());
    $('#xp-progress').style.width = `${state.xp % 1000 / 10}%`;
    $('#xp-to-next').textContent = (1000 - state.xp % 1000).toLocaleString(localeTag());
    $('#streak-value').textContent = `${state.streak} day streak`;
    $('#mission-streak').textContent = state.streak;
  }

  function renderOverview() {
    resetDailyProgressIfNeeded();
    updateProfileLabels();
    renderXp();
    $('#metric-heart').textContent = formatNumber(state.metrics.heart);
    $('#metric-sleep').textContent = formatDecimal(state.metrics.sleep);
    $('#metric-exercise').textContent = formatNumber(state.metrics.exercise);
    $('#metric-fatigue').textContent = formatNumber(state.metrics.fatigue);
    const hydration = hydrationSummary();
    const hydrationUnit = state.profile.hydrationUnit || 'mL';
    $('#metric-hydration').textContent = formatVolume(hydration.consumedMl, hydrationUnit);
    $('#hydration-unit').textContent = hydration.goalMl === null
      ? 'logged today'
      : `of ${formatVolume(hydration.goalMl, hydrationUnit)}`;
    $('#hydration-status').textContent = hydration.goalMl === null
      ? (hydration.consumedMl > 0 ? 'LOGGED' : 'NO TARGET')
      : `${formatNumber(Math.round(hydration.percent))}%`;
    $('.checkin-panel h2').textContent = `How are you feeling, ${state.profile.name.split(/\s+/)[0]}?`;
    $$('.fatigue-bars i').forEach((bar, index) => bar.classList.toggle('filled', index < Number(state.metrics.fatigue)));
    $('#exercise-progress').style.width = `${Math.min(100, Number(state.metrics.exercise) / 60 * 100)}%`;
    const completedToday = missions.filter((mission) => state.completed.includes(mission.id)).length;
    const score = Math.max(0, Math.min(100, 92 - currentAlerts().length * 9 - (state.metrics.fatigue > 5 ? (state.metrics.fatigue - 5) * 2 : 0)));
    $('#readiness-score').textContent = formatNumber(score);
    const ring = $('.ring-value');
    ring.style.strokeDashoffset = String(320 * (1 - score / 100));
    $('.status-pill').innerHTML = `<span></span>${currentAlerts().length ? 'REVIEW INDICATORS' : 'MISSION READY'}`;
    $('.readiness-copy h2').innerHTML = currentAlerts().length ? 'Take a moment to<br>review your readings.' : 'Looking good,<br>crew member.';
    $('.readiness-copy p').textContent = currentAlerts().length
      ? 'One or more sample readings differ from your personal reference. Review the context and contact your flight surgeon if concerned.'
      : 'Your overall indicators are tracking close to your personal baseline. Keep your recovery routine on course.';
    $('#last-checkin').textContent = state.checkinDate === today ? state.lastCheckin : 'NOT LOGGED TODAY';
    $('#alert-count').textContent = formatNumber(currentAlerts().length);
    renderRufus();
    renderMedicationOverview();
    renderMissionList($('#overview-mission-list'), true);
    $$('.range-select').forEach((button) => { button.textContent = `${activeRange} DAYS⌄`; });
    renderHeartChart($('#heart-chart'), activeRange, false);
  }

  function renderMissionList(container, compact = false) {
    const list = compact ? missions.slice(0, 3) : missions;
    container.innerHTML = list.map((mission) => {
      const done = state.completed.includes(mission.id);
      const actionLabel = window.RufusI18n.translate(done ? 'Completed' : 'Complete');
      const missionLabel = window.RufusI18n.translate(mission.title);
      return `<div class="mission-row"><button class="mission-check ${done ? 'done' : ''}" data-complete="${mission.id}" aria-label="${escapeHtml(`${actionLabel} ${missionLabel}`)}">${done ? '✓' : ''}</button><div class="mission-copy"><strong>${escapeHtml(mission.title)}</strong><small>${escapeHtml(mission.description)}</small></div><span class="mission-reward">${done ? 'DONE' : `+${formatNumber(mission.reward)} XP`}</span></div>`;
    }).join('');
  }

  const metricCards = [
    { key: 'heart', icon: '♡', name: 'RESTING HEART RATE', unit: 'bpm', baseline: () => `${formatNumber(state.profile.heartMin)}–${formatNumber(state.profile.heartMax)} bpm personal range` },
    { key: 'sleep', icon: '☾', name: 'SLEEP DURATION', unit: 'hrs', baseline: () => `${formatNumber(state.profile.sleepMin)}–${formatNumber(state.profile.sleepMax)} hrs personal target` },
    { key: 'exercise', icon: '↗', name: 'EXERCISE', unit: 'min', baseline: () => '60 min daily activity goal' },
    { key: 'resistanceExercise', icon: '↗', name: 'RESISTANCE EXERCISE', unit: 'min', baseline: () => 'Self-reported bone-loading activity' },
    { key: 'fatigue', icon: '◌', name: 'FATIGUE', unit: '/ 10', baseline: () => 'Self-reported; personal tracking' },
    { key: 'mood', icon: '☀', name: 'MOOD', unit: '', baseline: () => 'Self-reported check-in' },
    { key: 'connection', icon: '◎', name: 'CREW CONNECTION', unit: '', baseline: () => 'Self-reported; not a behavioral assessment' },
    { key: 'immuneSymptoms', icon: '＋', name: 'SYMPTOM CHECK-IN', unit: '', baseline: () => 'Self-reported; not an immune-system test' },
    { key: 'cognition', icon: '⌘', name: 'COGNITIVE GAME', unit: '/ 100', baseline: () => 'Illustrative game score · not an assessment' },
    { key: 'radiation', icon: '◉', name: 'RADIATION EXPOSURE', unit: 'mSv', baseline: () => `Simulated mission review marker · ${state.profile.radiationReviewAt} mSv` }
  ];

  function renderHealth() {
    const alerts = currentAlerts();
    const alertRoot = $('#health-alerts');
    alertRoot.innerHTML = alerts.map((alert) => `<div class="alert-card"><span class="alert-mark">⚠</span><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.detail)}</p></div></div>`).join('');
    $('#health-metrics').innerHTML = metricCards.map((metric) => {
      const value = state.metrics[metric.key];
      const displayValue = metric.key === 'sleep' ? formatDecimal(Number(value))
        : Number.isFinite(Number(value)) ? formatNumber(Number(value)) : escapeHtml(value);
      const status = metricStatus(metric.key);
      return `<article class="health-metric ${status ? 'health-metric-alert' : ''}"><div class="health-metric-head"><span class="metric-icon ${metric.key}-icon">${metric.icon}</span><span class="health-status ${status ? 'watch' : ''}">${status ? 'REVIEW' : 'TRACKING'}</span></div><h3>${metric.name}</h3><div class="health-metric-value">${displayValue}<small>${metric.unit}</small></div><div class="health-metric-baseline">${escapeHtml(metric.baseline())}</div></article>`;
    }).join('');
    renderHeartChart($('#health-chart'), activeRange, true);
  }

  function upsertBaselineRecord(values) {
    const existing = state.healthBaseline.records.find((entry) => entry.date === today);
    const record = { ...existing, ...values, date: today };
    const records = state.healthBaseline.records.filter((entry) => entry.date !== today);
    records.push(record);
    state.healthBaseline.records = window.AstroVitalBaseline.normalizeRecords(records);
    if (!state.healthBaseline.baseline) {
      const baseline = window.AstroVitalBaseline.calculateBaseline(state.healthBaseline.records);
      if (baseline.ready) state.healthBaseline.baseline = baseline;
    }
  }

  function restorePersonalBaselineRecords() {
    if (!state.healthBaseline.isSynthetic) return true;
    if (!window.confirm('Replace the synthetic demo with personal check-in records?')) return false;
    const records = state.healthBaseline.personalRecordsBackup;
    state.healthBaseline = {
      records,
      baseline: state.healthBaseline.personalBaselineBackup
        || window.AstroVitalBaseline.calculateBaseline(records),
      isSynthetic: false,
      personalRecordsBackup: [],
      personalBaselineBackup: null
    };
    return true;
  }

  function getInsightData() {
    if (insightDemoMode) {
      if (!demoInsightData || demoInsightData.endDate !== today) {
        const engine = window.AstroVitalBaseline;
        const records = engine.generateSampleData(180, today);
        const baseline = engine.calculateBaseline(records);
        demoInsightData = {
          ...window.AstroVitalHealthReports.createDemoData(today, records, baseline),
          endDate: today
        };
      }
      return demoInsightData;
    }

    const storedBaseline = state.healthBaseline;
    const healthBaseline = storedBaseline.isSynthetic
      ? {
        records: storedBaseline.personalRecordsBackup,
        baseline: storedBaseline.personalBaselineBackup
          || window.AstroVitalBaseline.calculateBaseline(storedBaseline.personalRecordsBackup),
        isSynthetic: false
      }
      : storedBaseline;
    return {
      profileName: state.profile.name,
      sampleData: false,
      healthBaseline,
      wellbeingEntries: state.checkinHistory,
      activityEntries: state.activityEntries,
      sleepLogs: state.sleepLogs,
      hydrationLogs: state.hydrationLogs,
      mealEntries: state.mealEntries,
      medicationLog: state.medicationLog
    };
  }

  function renderBaseline() {
    if (!$('#view-baseline')) return;
    const engine = window.AstroVitalBaseline;
    const insightData = getInsightData();
    const data = insightData.healthBaseline;
    const records = data.records.slice().sort((first, second) => first.date.localeCompare(second.date));
    const baseline = data.baseline || engine.calculateBaseline(records);
    if (baseline.ready && !data.baseline && !insightDemoMode && !state.healthBaseline.isSynthetic) {
      data.baseline = baseline;
      persist();
    }

    const latest = records.at(-1);
    const count = Math.min(records.length, engine.BASELINE_DAYS);
    $('#baseline-record-count').textContent = `${formatNumber(count)} / ${engine.BASELINE_DAYS} records`;
    $('#baseline-progress-percent').textContent = `${Math.round(count / engine.BASELINE_DAYS * 100)}%`;
    $('#baseline-progress-fill').style.width = `${count / engine.BASELINE_DAYS * 100}%`;
    $('#baseline-state').textContent = baseline.ready ? 'Your personal baseline is ready' : 'Collecting personal records';
    $('#baseline-description').textContent = baseline.ready
      ? `Calculated from your first ${baseline.sample_days} dated records (${formatAppDate(baseline.start_date)}–${formatAppDate(baseline.end_date)}). Later entries do not change this reference.`
      : `Log ${Math.max(0, engine.BASELINE_DAYS - count)} more daily records. Your first 30 records, covering at least 30 calendar dates, establish your personal reference.`;
    $('#baseline-data-mode').textContent = insightDemoMode
      ? window.RufusI18n.translate('SYNTHETIC DEMO · ISOLATED')
      : window.RufusI18n.translate('PERSONAL RECORDS · LOCAL ONLY');
    $('#baseline-log-metrics').disabled = insightDemoMode;

    const comparisons = baseline.ready && latest ? engine.compareToBaseline(latest, baseline) : null;
    const score = comparisons ? engine.calculateHealthScore(latest, baseline) : { score: null, status: 'unavailable' };
    $('#baseline-score').textContent = score.score === null ? '—' : formatNumber(score.score);
    $('#baseline-score-status').textContent = score.status === 'unavailable' ? 'Collecting baseline' : score.status;
    if (!baseline.ready || !latest || !comparisons) {
      $('#baseline-summary-title').textContent = 'Your trends will appear here.';
      $('#baseline-summary').textContent = `You have ${count} of ${engine.BASELINE_DAYS} records needed to establish a personal baseline.`;
    } else {
      const declining = engine.METRICS.filter(({ key }) => comparisons[key].status === 'declining')
        .map((metric) => metric.label.toLowerCase());
      const risks = engine.detectRisks(latest, baseline);
      const changes = declining.length ? ` Changes to review: ${declining.join(', ')}.` : ' Your latest measurements are stable or improving against your baseline.';
      const flags = risks.length ? ` Rule-based flags to review: ${risks.map((risk) => risk.risk.toLowerCase()).join(', ')}.` : '';
      $('#baseline-summary-title').textContent = `Personal health score: ${score.score ?? '—'} · ${score.status}.`;
      $('#baseline-summary').textContent = `${changes}${flags} This is not a diagnosis.`;
    }

    $('#baseline-metrics').innerHTML = engine.METRICS.map((metric) => {
      const comparison = comparisons?.[metric.key];
      const value = comparison?.current;
      const reference = comparison?.baseline;
      const percent = comparison?.percentChange;
      const arrow = comparison?.status === 'declining' ? '↓' : comparison?.status === 'improving' ? '↑' : comparison?.status === 'stable' ? '→' : '·';
      const status = comparison?.status || 'unavailable';
      const digits = ['moodScore', 'sleepHours', 'sleepEfficiency'].includes(metric.key) ? 1 : 0;
      const currentText = Number.isFinite(value) ? formatDecimal(value, digits) : '—';
      const baselineText = Number.isFinite(reference) ? formatDecimal(reference, digits) : '—';
      const changeText = Number.isFinite(percent) ? `${percent > 0 ? '+' : ''}${formatDecimal(percent)}%` : '—';
      return `<article class="baseline-metric-card"><div class="baseline-metric-head"><h3>${escapeHtml(metric.label.toUpperCase())}</h3><span class="baseline-trend-status ${status}">${arrow} ${status.toUpperCase()}</span></div><div class="baseline-metric-current">${currentText}<small>${escapeHtml(metric.unit)}</small></div><div class="baseline-metric-detail"><span>BASELINE <strong>${baselineText} ${escapeHtml(metric.unit)}</strong></span><strong>${changeText}</strong></div></article>`;
    }).join('');

    if (!baseline.ready || !latest || !comparisons) {
      $('#baseline-risks').innerHTML = '<p class="baseline-empty">Rule-based review flags are available after your personal baseline is established.</p>';
      $('#baseline-trends').innerHTML = '<p class="baseline-empty">Trend windows become available after a personal baseline is established.</p>';
    } else {
      const risks = engine.detectRisks(latest, baseline);
      const review = {
        Fatigue: 'Review recent sleep and reaction-time entries. Protect recovery opportunities and follow crew medical guidance.',
        'Behavioral health': 'Consider checking in with a trusted crewmate or behavioral-health support. Contact your crew medical officer if changes persist or concern you.',
        'Cardiovascular watch': 'If practical, verify the measurement and follow mission guidance. Contact your flight surgeon about persistent or concerning changes.'
      };
      $('#baseline-risks').innerHTML = risks.length
        ? `<div class="baseline-risk-list">${risks.map((risk) => `<article class="baseline-risk-item"><strong>${escapeHtml(`${risk.risk.toLowerCase()} · ${risk.severity.toLowerCase()}`)}</strong><p>${risk.reasons.map(escapeHtml).join(' ')}</p><p>Rule strength ${Math.round(risk.ruleStrength * 100)}% · heuristic, not a medical probability.</p><p>Suggested review: ${escapeHtml(review[risk.risk])}</p></article>`).join('')}</div>`
        : '<p class="baseline-empty">No current review flags are triggered by the illustrative rules. Continue following mission medical guidance.</p>';
      const trends = engine.analyzeTrends(records);
      $('#baseline-trends').innerHTML = `<table class="baseline-trend-table"><thead><tr><th>INDICATOR</th><th>7 DAYS</th><th>14 DAYS</th><th>30 DAYS</th></tr></thead><tbody>${engine.METRICS.map(({ key, label }) => `<tr><th>${escapeHtml(label.toUpperCase())}</th>${[7, 14, 30].map((days) => `<td class="${trends[days][key]}">${trends[days][key]}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    renderBaselineCharts(records, baseline);
  }

  function renderHealthReports() {
    const form = $('#health-report-form');
    const reportEngine = window.AstroVitalHealthReports;
    if (!form || !reportEngine) return;
    const period = activeInsightTab === 'weekly' ? 'weekly' : 'daily';
    const dateInput = $('#health-report-date');
    dateInput.max = today;
    if (!dateInput.value) dateInput.value = today;
    const insightData = getInsightData();
    const report = reportEngine.summarize({
      healthRecords: insightData.healthBaseline.records,
      baseline: {
        ready: Boolean(insightData.healthBaseline.baseline?.ready),
        isSynthetic: insightData.sampleData,
        allowSyntheticComparison: insightData.sampleData,
        values: insightData.healthBaseline.baseline?.values || {}
      },
      sampleData: insightData.sampleData,
      wellbeingEntries: insightData.wellbeingEntries,
      activityEntries: insightData.activityEntries,
      sleepLogs: insightData.sleepLogs,
      hydrationLogs: insightData.hydrationLogs,
      mealEntries: insightData.mealEntries,
      medicationLog: insightData.medicationLog
    }, period, dateInput.value);
    report.profileName = insightData.profileName;
    latestHealthReport = report;

    const t = window.RufusI18n.translate;
    $('#health-report-privacy-copy').textContent = t(insightData.sampleData
      ? 'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.'
      : 'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.');
    const formatDate = (date) => new Intl.DateTimeFormat(localeTag(), {
      timeZone: 'UTC',
      dateStyle: 'medium'
    }).format(new Date(`${date}T12:00:00Z`));
    const formatValue = (value) => value === null
      ? '—'
      : formatNumber(value, { maximumFractionDigits: 1 });
    const metricRows = report.metricRows.map((metric) => {
      const baseline = metric.baseline === null ? '—' : `${formatValue(metric.baseline)} ${metric.unit}`;
      const difference = metric.difference === null
        ? '—'
        : `${metric.difference > 0 ? '+' : ''}${formatValue(metric.difference)} ${metric.unit}`;
      return `<div class="report-table-row"><span>${escapeHtml(t(metric.label))}</span><strong>${escapeHtml(formatValue(metric.average))}${metric.average === null ? '' : ` ${escapeHtml(metric.unit)}`}</strong><span>${formatNumber(metric.entryCount)}</span><span>${escapeHtml(baseline)}</span><span>${escapeHtml(difference)}</span></div>`;
    }).join('');
    const statsSection = (title, items, empty) => `
      <article class="panel health-report-section">
        <h3>${escapeHtml(t(title))}</h3>
        ${empty
          ? `<p class="report-no-entries">${escapeHtml(t('No entries recorded in this section.'))}</p>`
          : `<dl class="health-report-stats">${items.map(([label, value]) => `<div><dt>${escapeHtml(t(label))}</dt><dd>${escapeHtml(String(value))}</dd></div>`).join('')}</dl>`}
      </article>`;
    const hasHealthIndicators = report.metricRows.some((metric) => metric.entryCount > 0);
    const healthSection = `
      <article class="panel health-report-section">
        <h3>${escapeHtml(t('Health indicators'))}</h3>
        ${hasHealthIndicators
          ? `<div class="report-table" role="table" aria-label="${escapeHtml(t('Health indicators'))}">
              <div class="report-table-head" role="row"><span>${escapeHtml(t('Measure'))}</span><span>${escapeHtml(t('Average'))}</span><span>${escapeHtml(t('Records'))}</span><span>${escapeHtml(t('Baseline'))}</span><span>${escapeHtml(t('Difference'))}</span></div>
              ${metricRows}
            </div>
            ${insightData.healthBaseline.baseline?.ready
              ? `<p class="report-baseline-note">${escapeHtml(t('Baseline differences are descriptive only and do not indicate risk.'))}</p>`
              : `<p class="report-baseline-note">${escapeHtml(t('A personal baseline is not available yet. It will appear after enough dated records are saved.'))}</p>`}`
          : `<p class="report-no-entries">${escapeHtml(t('No entries recorded in this section.'))}</p>`}
      </article>`;
    const wellbeingItems = [
      ['Mood check-ins', formatNumber(report.wellbeing.entryCount)],
      ['Fatigue', report.wellbeing.averageFatigue === null ? '—' : formatValue(report.wellbeing.averageFatigue)],
      ['Stress', report.wellbeing.averageStress === null ? '—' : formatValue(report.wellbeing.averageStress)]
    ];
    const activityItems = [
      ['Completed sessions', formatNumber(report.activity.completed)],
      ['Completed minutes', formatNumber(report.activity.completedMinutes)],
      ['Scheduled sessions', formatNumber(report.activity.statuses.scheduled)],
      ['Skipped sessions', formatNumber(report.activity.statuses.skipped)]
    ];
    const sleepItems = [
      ['Total sleep', report.sleep.totalHours === null ? '—' : `${formatValue(report.sleep.totalHours)} h`],
      ['Average per logged night', report.sleep.averageHours === null ? '—' : `${formatValue(report.sleep.averageHours)} h`],
      ['Logged nights', formatNumber(report.sleep.loggedNights)]
    ];
    const hydrationItems = [
      ['Total intake', report.hydration.totalMl === null ? '—' : `${formatNumber(report.hydration.totalMl)} mL`],
      ['Entries', formatNumber(report.hydration.entryCount)]
    ];
    const mealItems = [
      ['Scheduled meals', formatNumber(report.meals.statuses.scheduled)],
      ['Eaten', formatNumber(report.meals.statuses.eaten)],
      ['Partial', formatNumber(report.meals.statuses.partial)],
      ['Skipped', formatNumber(report.meals.statuses.skipped)]
    ];
    const medicationItems = [
      ['Taken', formatNumber(report.medication.statuses.taken)],
      ['Skipped', formatNumber(report.medication.statuses.skipped)]
    ];

    $('#health-report-title').textContent = t(period === 'daily' ? 'Daily summary' : 'Weekly summary');
    $('#health-report-caption').textContent = t('Records in the selected date range.');
    $('#health-report-profile').textContent = insightData.profileName;
    $('#health-report-period-label').textContent = t(period === 'daily' ? 'Daily' : 'Weekly');
    $('#health-report-range').textContent = report.startDate === report.endDate
      ? formatDate(report.endDate)
      : `${formatDate(report.startDate)} – ${formatDate(report.endDate)}`;
    $('#health-report-recorded-days').textContent = `${formatNumber(report.recordedDays)} / ${formatNumber(report.dayCount)}`;
    $('#health-report-synthetic').hidden = !report.sampleData;
    $('#health-report-empty').hidden = !report.isEmpty;
    $('#health-report-feedback').textContent = '';
    $('#health-report-export').disabled = false;
    $('#health-report-content').innerHTML = [
      healthSection,
      statsSection('Wellbeing', wellbeingItems, report.wellbeing.entryCount === 0),
      statsSection('Activity', activityItems, report.activity.entryCount === 0),
      statsSection('Sleep', sleepItems, report.sleep.loggedNights === 0),
      statsSection('Hydration', hydrationItems, report.hydration.entryCount === 0),
      statsSection('Meals', mealItems, report.meals.entryCount === 0),
      statsSection('Medication log', medicationItems, report.medication.entryCount === 0)
    ].join('');
  }

  function exportHealthReport() {
    const feedback = $('#health-report-feedback');
    const t = window.RufusI18n.translate;
    if (!latestHealthReport) {
      feedback.textContent = t('Generate a report before exporting.');
      return;
    }
    try {
      const csv = window.AstroVitalHealthReports.toCsv(latestHealthReport, latestHealthReport.profileName, t);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const demoPrefix = latestHealthReport.sampleData ? 'demo-' : '';
      link.download = `astrovital-${demoPrefix}health-report-${latestHealthReport.startDate}-${latestHealthReport.endDate}.csv`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      feedback.textContent = t('CSV report downloaded.');
    } catch (error) {
      console.error('Unable to export AstroVital health report:', error);
      feedback.textContent = t('The CSV report could not be created.');
    }
  }

  function renderBaselineCharts(records, baseline) {
    const engine = window.AstroVitalBaseline;
    const latestDate = records.at(-1)?.date;
    const latestDay = latestDate ? Date.parse(`${latestDate}T00:00:00Z`) / 86400000 : null;
    const startDay = latestDay === null ? null : latestDay - baselineChartRange + 1;
    const points = records.filter((record) => startDay !== null && Date.parse(`${record.date}T00:00:00Z`) / 86400000 >= startDay);
    const definitions = [
      { key: 'sleepHours', title: 'SLEEP DURATION', unit: 'hrs' },
      { key: 'reactionTime', title: 'REACTION TIME', unit: 'ms' },
      { key: 'moodScore', title: 'MOOD CHECK-IN', unit: '/5' },
      { key: 'score', title: 'PERSONAL HEALTH SCORE', unit: '/100' }
    ];
    $('#baseline-charts').innerHTML = definitions.map((definition) => {
      const series = points.map((record) => ({
        date: record.date,
        value: definition.key === 'score'
          ? baseline.ready ? engine.calculateHealthScore(record, baseline).score : null
          : record[definition.key]
      })).filter((point) => Number.isFinite(point.value));
      const values = series.map((point) => point.value);
      const min = values.length ? Math.min(...values) : 0;
      const max = values.length ? Math.max(...values) : 1;
      const spread = max - min || 1;
      const coords = series.map((point, index) => {
        const x = 18 + index / Math.max(1, series.length - 1) * 564;
        const y = 104 - (point.value - min) / spread * 82;
        return `${x},${y}`;
      });
      const latestValue = values.at(-1);
      return `<article class="baseline-chart"><h3>${definition.title}</h3><p>${Number.isFinite(latestValue) ? `LATEST ${formatDecimal(latestValue)} ${definition.unit} · ` : ''}${series.length} records · ${baselineChartRange} day view</p><svg viewBox="0 0 600 130" role="img" aria-label="${definition.title.toLowerCase()} over the last ${baselineChartRange} days"><line class="baseline-chart-grid" x1="15" y1="22" x2="585" y2="22"/><line class="baseline-chart-grid" x1="15" y1="63" x2="585" y2="63"/><line class="baseline-chart-grid" x1="15" y1="104" x2="585" y2="104"/>${coords.length > 1 ? `<polyline class="baseline-chart-line" points="${coords.join(' ')}"/>` : ''}${coords.length ? `<circle class="baseline-chart-dot" cx="${coords.at(-1).split(',')[0]}" cy="${coords.at(-1).split(',')[1]}" r="3.5"/>` : ''}<text class="baseline-chart-label" x="15" y="124">${series[0]?.date || 'No data'}</text><text class="baseline-chart-label" x="585" y="124" text-anchor="end">${series.at(-1)?.date || ''}</text></svg></article>`;
    }).join('');
    $$('[data-baseline-range]').forEach((button) => {
      button.classList.toggle('active', Number(button.dataset.baselineRange) === baselineChartRange);
    });
  }

  function renderHeartChart(container, days, withSleep) {
    const width = 640;
    const height = withSleep ? 190 : 126;
    const left = 34, right = 12, top = 14, bottom = 23;
    let values = state.heartHistory.slice(-days);
    if (days === 30 && values.length < 30) {
      const history = [];
      for (let i = 0; i < 30 - values.length; i++) history.push(64 + Math.round(Math.sin(i * 1.7) * 3 + Math.cos(i * .49) * 2));
      values = history.concat(values);
    }
    const min = Math.min(50, ...values, Number(state.profile.heartMin) - 6);
    const max = Math.max(82, ...values, Number(state.profile.heartMax) + 6);
    const plotH = height - top - bottom;
    const plotW = width - left - right;
    const x = (index) => left + index / Math.max(1, values.length - 1) * plotW;
    const y = (value) => top + (max - value) / (max - min) * plotH;
    const points = values.map((value, index) => `${x(index)},${y(value)}`);
    const baselineY = y((Number(state.profile.heartMin) + Number(state.profile.heartMax)) / 2);
    const area = `${left},${height - bottom} ${points.join(' ')} ${x(values.length - 1)},${height - bottom}`;
    const grid = [0, 1, 2, 3].map((step) => {
      const value = max - (max - min) * step / 3;
      const gy = y(value);
      return `<line class="chart-grid-line" x1="${left}" y1="${gy}" x2="${width - right}" y2="${gy}"/><text class="chart-label" x="0" y="${gy + 3}">${formatNumber(Math.round(value))}</text>`;
    }).join('');
    const weekLabels = Array.from({ length: 7 }, (_, index) => {
      if (index === 6) return 'TODAY';
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (6 - index));
      return new Intl.DateTimeFormat(localeTag(), { weekday: 'short', timeZone: 'UTC' }).format(date);
    });
    const labels = (values.length === 7 ? weekLabels : ['30D AGO', '', '20D AGO', '', '10D AGO', '', 'TODAY']).map((label, index, array) => {
      if (!label) return '';
      const lx = left + index / (array.length - 1) * plotW;
      return `<text class="chart-label" x="${lx}" y="${height - 4}" text-anchor="${index === 0 ? 'start' : index === array.length - 1 ? 'end' : 'middle'}">${label}</text>`;
    }).join('');
    const pointsMarkup = values.map((value, index) => `<circle class="chart-point" cx="${x(index)}" cy="${y(value)}" r="${index === values.length - 1 ? 4 : 2.5}" tabindex="0" role="button" aria-label="${value} beats per minute, day ${index + 1}"><title>${value} bpm · ${index === values.length - 1 ? 'latest sample' : `day ${index + 1}`}</title></circle>`).join('');
    const sleepBars = withSleep ? state.sleepHistory.slice(-7).map((value, index) => {
      const barX = left + index / 6 * plotW - 8;
      const barH = Math.max(2, Number(value) / 10 * plotH);
      return `<rect class="chart-bar" x="${barX}" y="${top + plotH - barH}" width="16" height="${barH}" rx="2"><title>${formatDecimal(Number(value))} hours sleep · day ${index + 1}</title></rect>`;
    }).join('') : '';
    container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="${days} day personal health trend">${grid}<line class="chart-baseline" x1="${left}" y1="${baselineY}" x2="${width - right}" y2="${baselineY}"/><polygon class="chart-area" points="${area}" />${sleepBars}<polyline class="chart-line" points="${points.join(' ')}"/>${pointsMarkup}${labels}</svg>`;
    $$('.chart-point', container).forEach((point) => {
      const description = $('title', point).textContent;
      point.addEventListener('click', () => showToast(description));
      point.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showToast(description);
        }
      });
    });
    if (container.id === 'heart-chart') $('#chart-latest').textContent = String(state.metrics.heart);
  }

  function renderMissions() {
    resetDailyProgressIfNeeded();
    const doneCount = missions.filter((mission) => state.completed.includes(mission.id)).length;
    $('#mission-summary-text').textContent = `${doneCount} of ${missions.length} complete`;
    $('#mission-summary-progress').style.width = `${doneCount / missions.length * 100}%`;
    $('#mission-xp-today').textContent = `${missions.filter((mission) => state.completed.includes(mission.id)).reduce((total, mission) => total + mission.reward, 0)} / 160 XP`;
    const earnedSteadyOrbit = state.achievements.includes('steady-orbit');
    const earnedWeekStreak = state.achievements.includes('seven-day-streak');
    const achievementTitle = $('.achievement-panel>div:nth-child(2)>strong');
    const achievementDescription = $('.achievement-panel>div:nth-child(2)>p');
    const badgeLabel = $('.achievement-badge small');
    const badgeTitle = $('.achievement-badge strong');
    if (earnedSteadyOrbit) {
      achievementTitle.textContent = 'Steady Orbit insignia earned.';
      achievementDescription.textContent = 'You completed all four daily wellness objectives. Keep showing up for your health.';
      badgeLabel.textContent = 'INSIGNIA EARNED';
      badgeTitle.textContent = 'STEADY ORBIT';
    } else if (earnedWeekStreak) {
      achievementTitle.textContent = 'Seven-day check-in streak achieved.';
      achievementDescription.textContent = 'A full week of consistent check-ins. Keep building a healthy mission routine.';
      badgeLabel.textContent = 'INSIGNIA EARNED';
      badgeTitle.textContent = 'CHECK-IN STREAK';
    } else {
      achievementTitle.textContent = 'Consistency unlocks new insignia.';
      achievementDescription.textContent = 'Complete daily health check-ins and approved wellness activities to earn mission XP. XP and achievements are for motivation only.';
      badgeLabel.textContent = 'NEXT BADGE';
      badgeTitle.textContent = 'STEADY ORBIT';
    }
    $('#mission-objectives').innerHTML = missions.map((mission) => {
      const done = state.completed.includes(mission.id);
      return `<article class="objective-card ${done ? 'complete' : ''}"><div class="objective-icon">${mission.icon}</div><div class="objective-copy"><h3>${escapeHtml(mission.title)}</h3><p>${escapeHtml(mission.description)}</p></div><div class="objective-meta"><strong>${done ? 'COMPLETE' : `+${mission.reward} XP`}</strong></div><button class="objective-button ${done ? 'complete-button' : ''}" data-mission-action="${mission.id}" ${done ? 'disabled' : ''}>${done ? '✓ DONE' : mission.id === 'checkin' ? 'CHECK IN' : mission.id === 'move' ? 'LOG ACTIVITY' : mission.id === 'breathe' ? 'START PAUSE' : 'OPEN MIND LAB'}</button></article>`;
    }).join('');
  }

  function completeMission(id) {
    if (!missions.some((mission) => mission.id === id) || state.completed.includes(id)) return;
    const mission = missions.find((item) => item.id === id);
    state.completed.push(id);
    state.xp += mission.reward;
    const reactions = { checkin: 'checkin', move: 'activity', breathe: 'pause', mind: 'focus' };
    reactToActivity(reactions[id]);
    awardCompanionMission(id);
    const newBadges = unlockEligibleAchievements();
    if (newBadges.length) {
      speakRufus(`${$('#rufus-message').textContent} Milestone unlocked: ${newBadges.join(', ')}!`, 'NEW MISSION INSIGNIA', 'wave');
    }
    persist();
    renderOverview();
    renderMissions();
    if ($('#view-companion').classList.contains('active')) renderCompanion();
    showToast(`Objective complete · +${mission.reward} mission XP · +10 stardust${newBadges.length ? ` · ${newBadges.join(', ')} insignia earned` : ''}`);
  }

  function unlockEligibleAchievements() {
    if (!Array.isArray(state.achievements)) state.achievements = [];
    const unlocked = [];
    if (missions.every((mission) => state.completed.includes(mission.id)) && !state.achievements.includes('steady-orbit')) {
      state.achievements.push('steady-orbit');
      unlocked.push('Steady Orbit');
    }
    if (state.streak >= 7 && !state.achievements.includes('seven-day-streak')) {
      state.achievements.push('seven-day-streak');
      unlocked.push('Check-in Streak');
    }
    return unlocked;
  }

  function openModal(content) {
    $('#modal-content').innerHTML = content;
    $('#modal-backdrop').classList.add('open');
    $('#modal-backdrop').setAttribute('aria-hidden', 'false');
    const first = $('input,button,select,textarea', $('#modal-content'));
    if (first) first.focus();
  }

  function closeModal() {
    $('#modal-backdrop').classList.remove('open');
    $('#modal-backdrop').setAttribute('aria-hidden', 'true');
  }

  function openProfile() {
    const checkedInterests = (interest) => state.profile.interests.includes(interest) ? 'checked' : '';
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> LOCAL PROFILE</div>
      <h2 id="modal-title">Profile and preferences</h2>
      <p>Your crew profile and preferences stay in this browser. Set or edit hydration goals on the Hydration Tracker, where you can preview the schedule before saving it.</p>
      <form id="profile-form">
        <div class="modal-form">
          <label>PERSONNEL ID · LOCAL PROFILE<input value="${escapeHtml(state.profile.personnelId)}" readonly></label>
          <label>DISPLAY NAME<input name="name" maxlength="50" value="${escapeHtml(state.profile.name)}" required></label>
          <label>MISSION IDENTIFIER<input name="missionId" maxlength="40" value="${escapeHtml(state.profile.missionId)}"></label>
          <label>LANGUAGE<select name="language"><option value="en" ${state.profile.language === 'en' ? 'selected' : ''}>English</option><option value="es" ${state.profile.language === 'es' ? 'selected' : ''}>Español</option><option value="fr" ${state.profile.language === 'fr' ? 'selected' : ''}>Français</option><option value="de" ${state.profile.language === 'de' ? 'selected' : ''}>Deutsch</option><option value="zh" ${state.profile.language === 'zh' ? 'selected' : ''}>简体中文</option><option value="ja" ${state.profile.language === 'ja' ? 'selected' : ''}>日本語</option><option value="ar" ${state.profile.language === 'ar' ? 'selected' : ''}>العربية</option></select></label>
          <div class="timezone-field"><label for="profile-timezone" id="timezone-profile-label">TIME ZONE</label><input id="timezone-filter" class="entry-control timezone-filter" type="search" autocomplete="off" placeholder="Filter IANA time zones"><select id="profile-timezone" name="timezone" class="entry-control" required></select><small id="timezone-profile-help">Choose the zone used for local time, dates, and in-app schedules.</small><small class="timezone-detected"><span id="timezone-detected-label">Browser detected:</span> <code id="browser-timezone">${escapeHtml(localTimeZone)}</code></small></div>
          <label>RESTING HEART RATE MIN · BPM<input name="heartMin" type="number" min="35" max="110" value="${state.profile.heartMin}" required></label>
          <label>RESTING HEART RATE MAX · BPM<input name="heartMax" type="number" min="40" max="160" value="${state.profile.heartMax}" required></label>
          <label>SLEEP TARGET MIN · HOURS<input name="sleepMin" type="number" min="3" max="12" step=".1" value="${state.profile.sleepMin}" required></label>
          <label>SLEEP TARGET MAX · HOURS<input name="sleepMax" type="number" min="4" max="14" step=".1" value="${state.profile.sleepMax}" required></label>
          <label>SIMULATED RADIATION REVIEW · mSv<input name="radiationReviewAt" type="number" min="1" max="1000" step=".1" value="${state.profile.radiationReviewAt}" required></label>
        </div>
        <div class="profile-preferences">
          <label><input type="checkbox" name="notifications" ${state.profile.notifications ? 'checked' : ''}> Save in-app reminder preference <small>Delivery is not implemented in Phase 1.</small></label>
          <label><input type="checkbox" name="interests" value="movement" ${checkedInterests('movement')}> Movement</label>
          <label><input type="checkbox" name="interests" value="sleep" ${checkedInterests('sleep')}> Sleep</label>
          <label><input type="checkbox" name="interests" value="mindfulness" ${checkedInterests('mindfulness')}> Mindfulness</label>
        </div>
        <div class="modal-actions"><button type="button" class="secondary-button" data-action="sign-out">SIGN OUT</button><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE PROFILE</button></div>
      </form>`);
    populateTimeZoneOptions($('#profile-timezone'), state.profile.timezone);
    updateTimeZoneLanguage();
  }

  function openCheckin() {
    const recordedSleep = window.AstroVitalFeatureData.sleepTotalForDate(state.sleepLogs, today);
    const sleepValue = recordedSleep === null ? state.metrics.sleep : recordedSleep;
    const hasSleepPeriods = state.sleepLogs.some((entry) => entry.date === today && entry.kind === 'period');
    const optionalValue = (value) => Number.isFinite(value) ? value : '';
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> DAILY HEALTH · SIMULATED DATA</div><h2 id="modal-title">Health check-in</h2><p>Enter illustrative self-reported values. Optional measurements extend your private personal baseline; this prototype does not connect to sensors or provide medical advice.</p><form id="checkin-form"><div class="modal-form">
      <label>RESTING HEART RATE · BPM<input name="heart" type="number" min="30" max="220" value="${state.metrics.heart}" required></label>
      <label>SLEEP DURATION · HOURS<input name="sleep" type="number" min="0" max="24" step=".1" value="${sleepValue}" ${hasSleepPeriods ? 'readonly' : ''} required></label>
      <label>EXERCISE · MINUTES TODAY<input name="exercise" type="number" min="0" max="600" value="${state.metrics.exercise}" required></label>
      <label>RESISTANCE EXERCISE · MINUTES<input name="resistanceExercise" type="number" min="0" max="300" value="${state.metrics.resistanceExercise}" required></label>
      <label>SYMPTOMS TODAY<select name="immuneSymptoms"><option ${state.metrics.immuneSymptoms === 'None' ? 'selected' : ''}>None</option><option ${state.metrics.immuneSymptoms === 'Mild' ? 'selected' : ''}>Mild</option><option ${state.metrics.immuneSymptoms === 'Moderate' ? 'selected' : ''}>Moderate</option><option ${state.metrics.immuneSymptoms === 'Severe' ? 'selected' : ''}>Severe</option></select></label>
      <label>RADIATION · SIMULATED mSv<input name="radiation" type="number" min="0" max="1000" step=".1" value="${state.metrics.radiation}" required></label>
      <label>SLEEP EFFICIENCY · % · OPTIONAL<input name="sleepEfficiency" type="number" min="0" max="100" step=".1" value="${optionalValue(state.metrics.sleepEfficiency)}"></label>
      <label>HRV · ms · OPTIONAL<input name="hrv" type="number" min="0" max="300" step=".1" value="${optionalValue(state.metrics.hrv)}"></label>
      <label>DAILY ACTIVITY SCORE · 0–100 · OPTIONAL<input name="activityScore" type="number" min="0" max="100" step=".1" value="${optionalValue(state.metrics.activityScore)}"></label>
      <label>REACTION TIME · ms · OPTIONAL<input name="reactionTime" type="number" min="50" max="5000" step="1" value="${optionalValue(state.metrics.reactionTime)}"></label>
    </div><div class="health-note"><span>ⓘ</span><div><strong>Optional metrics</strong><p>Leave unavailable measurements blank. Self-reported values and sample data are not sensor readings or clinical assessments.</p></div></div><div class="wellbeing-link-note">Mood, fatigue, stress, and crew-connection check-ins are in <button type="button" class="text-button" data-nav="wellbeing">Wellbeing</button>. ${hasSleepPeriods ? 'Sleep duration is the total of today’s logged sleep periods.' : ''}</div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE CHECK-IN</button></div></form>`);
  }

  function renderRufusArtwork() {
    $$('[data-rufus-art]').forEach((image) => {
      const pose = image.matches('[data-rufus-live]')
        ? rufusReactionPose || state.rufus.pose
        : image.dataset.rufusArt;
      const art = rufusArtwork[pose] || rufusArtwork.wave;
      image.dataset.rufusArt = pose in rufusArtwork ? pose : 'wave';
      if (image.matches('[data-avatar-canvas]')) {
        paintRufusCanvas(image, pose);
        return;
      }
      image.src = art.src;
      if (image.dataset.rufusAlt) image.alt = image.dataset.rufusAlt;
      else image.alt = `Rufus: ${art.description}`;
    });
    const message = state.completed.length >= missions.length
      ? 'Flight plan complete! Take a moment to celebrate your effort.'
      : state.completed.length
        ? `Nice work, crew member. You have ${state.completed.length} small win${state.completed.length === 1 ? '' : 's'} logged today. Keep your own pace.`
        : state.checkinDate === today
          ? 'Thanks for checking in. Looking after yourself is a mission win.'
          : 'No pressure, crew member. Every small check-in is a win, and rest counts too.';
    if (!rufusDialogue) speakRufus(message);
    if ($('#rufus-mission-count')) $('#rufus-mission-count').textContent = `${state.completed.length} / ${missions.length}`;
  }

  function getArtworkImage(src) {
    if (!artworkImageCache.has(src)) {
      artworkImageCache.set(src, new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Unable to load Rufus artwork layer: ${src}`));
        image.src = src;
      }));
    }
    return artworkImageCache.get(src);
  }

  async function paintRufusCanvas(canvas, pose = canvas.dataset.rufusArt) {
    pose = Object.hasOwn(rufusArtwork, pose) ? pose : 'wave';
    const art = rufusArtwork[pose] || rufusArtwork.wave;
    const renderId = Number(canvas.dataset.renderId || 0) + 1;
    canvas.dataset.renderId = String(renderId);
    try {
      const image = await getArtworkImage(art.src);
      if (!canvas.isConnected || canvas.dataset.rufusArt !== pose || canvas.dataset.renderId !== String(renderId)) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      const layers = state.rufus.accessories.filter((item) => {
        if (!state.rufus.inventory.includes(item)) return false;
        return pose !== 'sleep' || item === 'orbit-satellite';
      });
      for (const item of layers) {
        if (canvas.dataset.renderId !== String(renderId)) return;
        const accessory = rufusAccessories[item];
        if (accessory) {
          const layer = await getArtworkImage(accessory.src);
          if (canvas.dataset.renderId !== String(renderId)) return;
          context.drawImage(layer, 0, 0, canvas.width, canvas.height);
        }
      }
    } catch (error) {
      console.error('Unable to render the customized Rufus avatar:', error);
      showToast('Rufus’s custom artwork could not be loaded. Check that the app assets are available.');
    }
  }

  function rufusImage(pose, className = '', alt) {
    const art = rufusArtwork[pose] || rufusArtwork.wave;
    const safePose = Object.hasOwn(rufusArtwork, pose) ? pose : 'wave';
    return `<img class="${className}" data-rufus-art="${safePose}" src="${art.src}" alt="${escapeHtml(alt || art.description)}" loading="lazy" decoding="async">`;
  }

  function rufusCanvas(pose, className, alt) {
    const art = rufusArtwork[pose] || rufusArtwork.wave;
    const safePose = Object.hasOwn(rufusArtwork, pose) ? pose : 'wave';
    const label = alt || `Rufus: ${art.description}`;
    return `<canvas class="${className}" width="245" height="360" data-rufus-art="${safePose}" data-avatar-canvas role="img" aria-label="${escapeHtml(label)}"></canvas>`;
  }

  function openRufusCustomizer() {
    const poses = Object.entries(rufusArtwork).map(([pose, art]) => `
      <button class="rufus-pose-choice ${state.rufus.pose === pose ? 'selected' : ''}" type="button" data-rufus-choice="${pose}" aria-pressed="${state.rufus.pose === pose}">
        ${rufusCanvas(pose, 'rufus-pose-thumb', `Rufus, ${art.name.toLowerCase()}: ${art.description}`)}
        <span><strong>${art.name}</strong><small>${art.description}</small></span>
      </button>`).join('');

    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> Rufus avatar bay</div><h2 id="modal-title">Choose Rufus’s mission moment</h2><p>Choose a pose from the supplied character art. Equip gear in the companion bay to personalize Rufus.</p><div class="rufus-preview" id="rufus-preview">${rufusImage(state.rufus.pose, 'rufus-preview-art')}<div><strong>Rufus</strong><span id="rufus-preview-caption">${rufusArtwork[state.rufus.pose].description}</span></div></div><form id="rufus-form"><input type="hidden" name="pose" value="${state.rufus.pose}"><div class="rufus-pose-grid">${poses}</div><div class="modal-actions"><button type="button" class="secondary-button" data-nav="companion">OPEN COMPANION BAY</button><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE POSE</button></div></form>`);
    renderRufusArtwork();
  }

  function speakRufus(message, reaction = 'READY FOR A LITTLE COMPANY', reactionPose = '') {
    rufusDialogue = message;
    $('#rufus-message').textContent = message;
    if ($('#rufus-home-dialogue')) $('#rufus-home-dialogue').textContent = message;
    if ($('#rufus-stage-caption')) $('#rufus-stage-caption').textContent = reaction;
    clearTimeout(rufusReactionTimer);
    if (Object.hasOwn(rufusArtwork, reactionPose)) {
      rufusReactionPose = reactionPose;
      renderRufusArtwork();
      rufusReactionTimer = setTimeout(() => {
        rufusReactionPose = '';
        renderRufusArtwork();
      }, 4200);
    } else {
      rufusReactionPose = '';
      renderRufusArtwork();
    }
  }

  function renderCompanion() {
    resetDailyProgressIfNeeded();
    const level = Math.floor(state.rufus.bondXp / 100) + 1;
    const levelXp = state.rufus.bondXp % 100;
    const titles = ['New crewmates', 'Trusted orbiters', 'Mission partners', 'Cosmic companions'];
    $('#rufus-bond-level').textContent = `LEVEL ${level}`;
    $('#rufus-bond-title').textContent = titles[Math.min(titles.length - 1, level - 1)];
    $('#rufus-bond-xp').textContent = String(levelXp);
    $('#rufus-bond-progress').style.width = `${levelXp}%`;
    $('#rufus-stardust').textContent = state.rufus.stardust.toLocaleString();
    $('#rufus-pet-streak').textContent = String(state.rufus.petStreak);
    $('#rufus-mission-count').textContent = `${state.completed.length} / ${missions.length}`;
    $('#rufus-inventory').innerHTML = state.rufus.inventory.map((id) => {
      const item = rufusAccessories[id];
      if (!item) return '';
      const equipped = state.rufus.accessories.includes(id);
      return `<article class="gear-item ${equipped ? 'equipped' : ''}"><span class="gear-art" data-gear-preview="${id}" style="--gear-image:url('${item.src}')" aria-hidden="true"></span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></div><button class="gear-toggle" data-toggle-accessory="${id}" aria-pressed="${equipped}">${equipped ? 'EQUIPPED' : 'EQUIP'}</button></article>`;
    }).join('') || '<p class="companion-help">Your locker is ready for its first mission reward.</p>';
    $('#rufus-shop').innerHTML = Object.entries(rufusAccessories).filter(([, item]) => item.cost > 0).map(([id, item]) => {
      const owned = state.rufus.inventory.includes(id);
      return `<article class="shop-item"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></div><button class="gear-buy" data-buy-accessory="${id}" ${owned || state.rufus.stardust < item.cost ? 'disabled' : ''}>${owned ? 'OWNED' : `${item.cost} ✦`}</button></article>`;
    }).join('');
    renderMissionList($('#companion-goals-list'));
    renderRufusArtwork();
  }

  function petRufus() {
    resetDailyProgressIfNeeded();
    if (state.rufus.lastPetDate !== today) {
      const previousDate = previousDateKey(today);
      state.rufus.petStreak = state.rufus.lastPetDate === previousDate ? state.rufus.petStreak + 1 : 1;
      state.rufus.lastPetDate = today;
    }
    state.rufus.petCount += 1;
    if (state.rufus.petCount <= 5) state.rufus.bondXp += 2;
    const greetings = [
      'Oh! A friendly space-pat. My whiskers are receiving excellent signals.',
      'You came back! I saved you the comfiest spot in the observation deck.',
      'Crew check: you are doing better than you think. No rush, okay?',
      'Boop received. Mission morale is now orbiting at a very respectable altitude.',
      'I would high-five you, but these astronaut gloves are delightfully enormous.'
    ];
    const avatar = $('#rufus-avatar') || $('#rufus-portrait') || $('#rufus-home-avatar');
    const homeAvatar = $('#rufus-home-avatar');
    [avatar, homeAvatar].filter(Boolean).forEach((node) => {
      node.classList.remove('rufus-bounce');
      void node.offsetWidth;
      node.classList.add('rufus-bounce');
    });
    speakRufus(greetings[(state.rufus.petCount - 1) % greetings.length], 'Rufus is happy you dropped by', 'wave');
    persist();
    renderCompanion();
    renderRufusArtwork();
  }

  function awardCompanionMission(id) {
    const mission = missions.find((item) => item.id === id);
    if (!mission) return;
    state.rufus.stardust += 10;
    state.rufus.bondXp += 8;
    const allDone = missions.every((item) => state.completed.includes(item.id));
    const message = allDone
      ? 'LOOK AT YOU! Your whole flight plan is complete. Rufus is doing a tiny victory dance!'
      : id === 'checkin' && Number(state.metrics.sleep) >= Number(state.profile.sleepMin)
        ? 'Mission accomplished, crew member! You checked in and made room for rest. Rufus is proud of you.'
        : id === 'checkin'
          ? 'Mission accomplished, crew member! Thanks for checking in with yourself. That counts.'
          : id === 'move'
            ? 'Nice work getting your movement mission logged. One small win, right on course.'
            : id === 'mind'
              ? 'Curiosity beacon: activated! Rufus loved exploring that Mind Lab puzzle with you.'
              : 'A mindful pause logged. Rufus says a little reset can be a lovely mission moment.';
    const reactionPose = allDone ? 'wave' : id === 'mind' ? 'confident' : id === 'breathe' || (id === 'checkin' && Number(state.metrics.sleep) >= Number(state.profile.sleepMin)) ? 'rest' : 'confident';
    speakRufus(message, allDone ? 'FLIGHT PLAN COMPLETE · CELEBRATION TIME' : 'MISSION MILESTONE · +10 STARDUST', reactionPose);
    if (allDone) {
      const avatar = $('#rufus-avatar') || $('#rufus-portrait') || $('#rufus-home-avatar');
      avatar?.classList.remove('rufus-bounce');
      if (avatar) {
        void avatar.offsetWidth;
        avatar.classList.add('rufus-bounce');
      }
    }
  }

  function cheerRufus() {
    const cheers = [
      'You do not have to do it all at once. One small step is plenty.',
      'Checking in with yourself is brave work. I am cheering you on!',
      'Your pace is the right pace. Rest is part of the mission, too.',
      'A little progress still counts as progress. You have got this, crew member!',
      'Fun fact: the stars are very far away, but your next small win is right here.'
    ];
    const cheerPose = ['confident', 'wave', 'rest'][rufusCheerIndex % 3];
    speakRufus(cheers[rufusCheerIndex % cheers.length], 'Rufus has a message for you', cheerPose);
    rufusCheerIndex += 1;
    const avatar = $('#rufus-avatar') || $('#rufus-portrait') || $('#rufus-home-avatar');
    avatar.classList.remove('rufus-bounce');
    void avatar.getBoundingClientRect();
    avatar.classList.add('rufus-bounce');
  }

  function openActivity() {
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> PHYSICAL WELLNESS · ACTIVITY LOG</div><h2 id="modal-title">Log an activity</h2><p>Record a completed mission-approved exercise or mobility activity. Follow your crew medical officer’s exercise plan.</p><form id="activity-form"><div class="modal-form"><label>ACTIVITY TYPE<select name="type"><option>Resistance exercise</option><option>Cardio session</option><option>Mobility / stretch</option><option>Other approved activity</option></select></label><label>DURATION · MINUTES<input name="minutes" type="number" min="1" max="300" value="18" required></label></div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE ACTIVITY</button></div></form>`);
  }

  function createFeatureId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function dateRangeStart(range) {
    return new Date(Date.parse(`${today}T00:00:00Z`) - (range - 1) * 86400000).toISOString().slice(0, 10);
  }

  function ensureFeatureDate(selector) {
    const input = $(selector);
    if (input && !input.value) input.value = today;
  }

  function renderActivity() {
    if (!$('#activity-history-list')) return;
    ensureFeatureDate('#activity-entry-form [name="date"]');
    const startDate = dateRangeStart(activityRange);
    const entries = state.activityEntries.filter((entry) => entry.status === 'scheduled' || entry.date >= startDate)
      .slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    const completed = entries.filter((entry) => entry.status === 'completed');
    $('#activity-completed-count').textContent = formatNumber(completed.length);
    $('#activity-total-minutes').textContent = `${formatNumber(completed.reduce((sum, entry) => sum + entry.actualMinutes, 0))} min`;
    $('#activity-scheduled-count').textContent = formatNumber(entries.filter((entry) => entry.status === 'scheduled').length);
    $('#activity-history-list').innerHTML = entries.length ? entries.map((entry) => `<article class="feature-row">
      <div class="feature-row-main"><div class="feature-row-heading"><strong>${escapeHtml(entry.name)}</strong><span class="feature-status ${entry.status}">${escapeHtml(entry.status)}</span></div>
      <small>${escapeHtml(formatAppDate(entry.date))} · ${escapeHtml(entry.category)}${entry.actualMinutes ? ` · ${formatNumber(entry.actualMinutes)} min logged` : ''}${entry.plannedMinutes ? ` · ${formatNumber(entry.plannedMinutes)} min planned` : ''}</small>
      ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}</div>
      <div class="feature-row-actions"><button type="button" class="secondary-button" data-activity-edit="${escapeHtml(entry.id)}">EDIT</button><button type="button" class="secondary-button" data-activity-delete="${escapeHtml(entry.id)}">DELETE</button></div>
    </article>`).join('') : '<p class="feature-empty">No activity scheduled or logged in this range. Add an activity from your approved plan above.</p>';
    $$('[data-activity-range]').forEach((button) => button.classList.toggle('active', Number(button.dataset.activityRange) === activityRange));
  }

  function adjustActivityMetrics(entry, multiplier) {
    if (entry.status !== 'completed' || entry.date !== today || !entry.actualMinutes) return;
    state.metrics.exercise = Math.max(0, Number(state.metrics.exercise || 0) + entry.actualMinutes * multiplier);
    if (entry.category === 'Resistance') {
      state.metrics.resistanceExercise = Math.max(0, Number(state.metrics.resistanceExercise || 0) + entry.actualMinutes * multiplier);
    }
  }

  function activityEntryFromForm(form, id = createFeatureId('activity')) {
    const values = new FormData(form);
    return window.AstroVitalFeatureData.normalizeActivityEntries([{
      id,
      date: String(values.get('date') || ''),
      name: String(values.get('name') || ''),
      category: String(values.get('category') || ''),
      status: String(values.get('status') || ''),
      plannedMinutes: values.get('plannedMinutes'),
      actualMinutes: values.get('actualMinutes'),
      note: String(values.get('note') || '')
    }])[0] || null;
  }

  function openActivityEntryEditor(id) {
    const entry = state.activityEntries.find((item) => item.id === id);
    if (!entry) {
      showToast('That activity entry is no longer available.');
      return;
    }
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> PHYSICAL ACTIVITY · EDIT ENTRY</div><h2 id="modal-title">Update activity</h2><form id="activity-edit-form" class="feature-form">
      <input type="hidden" name="id" value="${escapeHtml(entry.id)}">
      <label>ACTIVITY<input name="name" maxlength="80" value="${escapeHtml(entry.name)}" required></label>
      <label>CATEGORY<select name="category">${window.AstroVitalFeatureData.ACTIVITY_CATEGORIES.map((category) => `<option ${entry.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select></label>
      <label>DATE<input name="date" type="date" value="${escapeHtml(entry.date)}" required></label>
      <label>STATUS<select name="status">${window.AstroVitalFeatureData.ENTRY_STATUSES.map((status) => `<option value="${status}" ${entry.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label>
      <label>PLANNED MINUTES<input name="plannedMinutes" type="number" min="1" max="600" value="${entry.plannedMinutes || ''}"></label>
      <label>ACTUAL MINUTES<input name="actualMinutes" type="number" min="1" max="600" value="${entry.actualMinutes || ''}"></label>
      <label class="feature-full-width">NOTE<textarea name="note" rows="2" maxlength="300">${escapeHtml(entry.note)}</textarea></label>
      <div class="feature-full-width modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE CHANGES</button></div>
    </form>`);
  }

  function deleteActivityEntry(id) {
    const entry = state.activityEntries.find((item) => item.id === id);
    if (!entry || !window.confirm('Delete this activity entry from this local profile?')) return;
    adjustActivityMetrics(entry, -1);
    state.activityEntries = state.activityEntries.filter((item) => item.id !== id);
    persist();
    renderActivity();
    renderHealth();
    renderOverview();
    showToast('Activity entry deleted');
  }

  function renderSleep() {
    if (!$('#sleep-trend-list')) return;
    ensureFeatureDate('#sleep-schedule-form [name="date"]');
    ensureFeatureDate('#sleep-entry-form [name="date"]');
    const startDate = dateRangeStart(sleepRange);
    const periodRecords = state.sleepLogs.filter((entry) => entry.kind === 'period' && entry.date >= startDate);
    const dates = [...new Set(state.sleepLogs.filter((entry) => entry.date >= startDate).map((entry) => entry.date))].sort().reverse();
    const totals = dates.map((date) => ({ date, hours: window.AstroVitalFeatureData.sleepTotalForDate(state.sleepLogs, date) }));
    const loggedTotals = totals.filter((item) => Number.isFinite(item.hours));
    const quality = periodRecords.filter((entry) => Number.isFinite(entry.quality)).map((entry) => entry.quality);
    $('#sleep-average-duration').textContent = loggedTotals.length
      ? `${formatDecimal(loggedTotals.reduce((sum, item) => sum + item.hours, 0) / loggedTotals.length)} hr`
      : '—';
    $('#sleep-average-quality').textContent = quality.length
      ? `${formatDecimal(quality.reduce((sum, value) => sum + value, 0) / quality.length)} / 5`
      : '—';
    $('#sleep-logged-days').textContent = formatNumber(loggedTotals.length);
    $('#sleep-schedule-list').innerHTML = state.sleepSchedule.filter((entry) => entry.date >= startDate)
      .slice().sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .map((entry) => `<article class="feature-row compact"><div class="feature-row-main"><strong>${escapeHtml(entry.label)}</strong><small>${escapeHtml(formatAppDate(entry.date))} · ${escapeHtml(entry.startTime)}–${escapeHtml(entry.endTime)}</small></div><button type="button" class="secondary-button" data-sleep-schedule-delete="${escapeHtml(entry.id)}">REMOVE</button></article>`).join('')
      || '<p class="feature-empty">No sleep opportunities scheduled in this range.</p>';
    $('#sleep-trend-list').innerHTML = totals.length ? totals.map((item) => `<div class="feature-trend-row"><span>${escapeHtml(formatAppDate(item.date))}</span><div class="feature-bar"><i style="width:${Math.min(100, item.hours / 12 * 100)}%"></i></div><strong>${formatDecimal(item.hours)} hr</strong></div>`).join('')
      : '<p class="feature-empty">Sleep trends will appear after you record a sleep period or health check-in.</p>';
    const logs = state.sleepLogs.filter((entry) => entry.date >= startDate).slice()
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    $('#sleep-history-list').innerHTML = logs.length ? logs.map((entry) => {
      const details = entry.kind === 'period'
        ? `${entry.startTime}–${entry.endTime} · ${formatDecimal(entry.durationHours)} hr${entry.quality ? ` · quality ${entry.quality}/5` : ''}${entry.restedness ? ` · rested ${entry.restedness}/5` : ''}${entry.interruptions !== null ? ` · ${entry.interruptions} interruptions` : ''}`
        : `${formatDecimal(entry.sleepHours)} hr · entered in health check-in`;
      return `<article class="feature-row compact"><div class="feature-row-main"><strong>${escapeHtml(formatAppDate(entry.date))}</strong><small>${escapeHtml(details)}</small></div><button type="button" class="secondary-button" data-sleep-delete="${escapeHtml(entry.id)}">DELETE</button></article>`;
    }).join('') : '<p class="feature-empty">No sleep periods recorded in this range.</p>';
    $$('[data-sleep-range]').forEach((button) => button.classList.toggle('active', Number(button.dataset.sleepRange) === sleepRange));
  }

  function sleepEntryFromForm(form, id = createFeatureId('sleep')) {
    const values = new FormData(form);
    return window.AstroVitalFeatureData.normalizeSleepLogs([{
      id,
      kind: 'period',
      date: String(values.get('date') || ''),
      startTime: String(values.get('startTime') || ''),
      endTime: String(values.get('endTime') || ''),
      quality: values.get('quality'),
      restedness: values.get('restedness'),
      interruptions: values.get('interruptions')
    }])[0] || null;
  }

  function deleteSleepEntry(id) {
    if (!state.sleepLogs.some((entry) => entry.id === id) || !window.confirm('Delete this sleep record from this local profile?')) return;
    state.sleepLogs = state.sleepLogs.filter((entry) => entry.id !== id);
    const todayTotal = window.AstroVitalFeatureData.sleepTotalForDate(state.sleepLogs, today);
    if (todayTotal !== null) state.metrics.sleep = todayTotal;
    persist();
    renderSleep();
    renderHealth();
    renderOverview();
    showToast('Sleep record deleted');
  }

  function deleteSleepSchedule(id) {
    if (!state.sleepSchedule.some((entry) => entry.id === id) || !window.confirm('Remove this scheduled sleep opportunity?')) return;
    state.sleepSchedule = state.sleepSchedule.filter((entry) => entry.id !== id);
    persist();
    renderSleep();
    showToast('Sleep opportunity removed');
  }

  function renderMeals() {
    if (!$('#meal-history-list')) return;
    ensureFeatureDate('#meal-entry-form [name="date"]');
    const startDate = dateRangeStart(mealRange);
    const entries = state.mealEntries.filter((entry) => entry.status === 'scheduled' || entry.date >= startDate)
      .slice().sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    const scheduled = entries.filter((entry) => entry.status === 'scheduled');
    const logged = entries.filter((entry) => entry.status !== 'scheduled');
    const eatenToday = state.mealEntries.filter((entry) => entry.date === today && ['eaten', 'partial'].includes(entry.status));
    $('#meal-scheduled-count').textContent = formatNumber(scheduled.length);
    $('#meal-logged-count').textContent = formatNumber(logged.length);
    $('#meal-today-count').textContent = formatNumber(eatenToday.length);
    $('#meal-history-list').innerHTML = entries.length ? entries.map((entry) => {
      const nutrition = window.AstroVitalFeatureData.hasTraceableNutrition(entry)
        ? `<p class="feature-source-note"><strong>Nutrition details supplied:</strong> ${escapeHtml(entry.nutritionInfo)} <small>Source: ${escapeHtml(entry.nutritionSource)}</small></p>`
        : '<p class="feature-source-note">Nutrition information not available.</p>';
      return `<article class="feature-row"><div class="feature-row-main"><div class="feature-row-heading"><strong>${escapeHtml(entry.name)}</strong><span class="feature-status ${escapeHtml(entry.status)}">${escapeHtml(entry.status)}</span></div><small>${escapeHtml(formatAppDate(entry.date))} · ${escapeHtml(entry.time)}</small>${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}${nutrition}</div><div class="feature-row-actions"><button type="button" class="secondary-button" data-meal-edit="${escapeHtml(entry.id)}">EDIT</button><button type="button" class="secondary-button" data-meal-delete="${escapeHtml(entry.id)}">DELETE</button></div></article>`;
    }).join('') : '<p class="feature-empty">No meals scheduled or logged in this range. Add an entry from your approved meal plan.</p>';
    $$('[data-meal-range]').forEach((button) => button.classList.toggle('active', Number(button.dataset.mealRange) === mealRange));
  }

  function mealEntryFromForm(form, id = createFeatureId('meal')) {
    const values = new FormData(form);
    const raw = {
      id,
      date: String(values.get('date') || ''),
      time: String(values.get('time') || ''),
      name: String(values.get('name') || ''),
      status: String(values.get('status') || ''),
      note: String(values.get('note') || ''),
      nutritionInfo: String(values.get('nutritionInfo') || ''),
      nutritionSource: String(values.get('nutritionSource') || '')
    };
    if (raw.nutritionInfo.trim() && !raw.nutritionSource.trim()) return null;
    return window.AstroVitalFeatureData.normalizeMealEntries([raw])[0] || null;
  }

  function openMealEntryEditor(id) {
    const entry = state.mealEntries.find((item) => item.id === id);
    if (!entry) {
      showToast('That meal entry is no longer available.');
      return;
    }
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> MEALS · EDIT ENTRY</div><h2 id="modal-title">Update meal</h2><form id="meal-edit-form" class="feature-form">
      <input type="hidden" name="id" value="${escapeHtml(entry.id)}">
      <label>MEAL OR MENU ITEM<input name="name" maxlength="100" value="${escapeHtml(entry.name)}" required></label>
      <label>STATUS<select name="status">${window.AstroVitalFeatureData.MEAL_STATUSES.map((status) => `<option value="${status}" ${entry.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label>
      <label>DATE<input name="date" type="date" value="${escapeHtml(entry.date)}" required></label>
      <label>TIME<input name="time" type="time" value="${escapeHtml(entry.time)}" required></label>
      <label class="feature-full-width">NOTE<textarea name="note" rows="2" maxlength="300">${escapeHtml(entry.note)}</textarea></label>
      <label class="feature-full-width">NUTRITION INFORMATION · OPTIONAL<textarea name="nutritionInfo" rows="2" maxlength="500">${escapeHtml(entry.nutritionInfo)}</textarea></label>
      <label class="feature-full-width">SOURCE · REQUIRED IF INFORMATION IS ENTERED<input name="nutritionSource" maxlength="200" value="${escapeHtml(entry.nutritionSource)}"></label>
      <div class="feature-full-width modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE CHANGES</button></div>
    </form>`);
  }

  function deleteMealEntry(id) {
    if (!state.mealEntries.some((entry) => entry.id === id) || !window.confirm('Delete this meal entry from this local profile?')) return;
    state.mealEntries = state.mealEntries.filter((entry) => entry.id !== id);
    persist();
    renderMeals();
    showToast('Meal entry deleted');
  }

  function openAlerts() {
    const alerts = currentAlerts();
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> HEALTH MONITOR · SAMPLE DATA</div><h2 id="modal-title">Health alerts</h2><p>Changes are compared with personal reference values and are prompts for review, not diagnoses.</p><div class="alert-list">${alerts.length ? alerts.map((alert) => `<div class="alert-card"><span class="alert-mark">⚠</span><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.detail)}</p></div></div>`).join('') : '<div class="alert-empty">✓ &nbsp; No sample readings currently flag for review. Keep monitoring and contact your flight surgeon with health concerns.</div>'}</div><div class="modal-actions"><button class="secondary-button" data-action="close-modal">CLOSE</button><button class="primary-button" data-nav="health">VIEW HEALTH REPORT</button></div>`);
  }

  function setGame(game) {
    clearTimeout(gameTimer);
    gameLocked = false;
    activeGame = game;
    $$('.game-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.game === game));
    const settings = {
      memory: { kicker: 'MEMORY SEQUENCE', title: 'Sequence protocol', description: 'Watch the sequence, then repeat it in the same order. Each round adds one new step.', duration: '~1 MIN', emblem: '⌘' },
      reaction: { kicker: 'REACTION TIME', title: 'Signal response', description: 'Wait for the green signal, then tap as quickly as you can. Do not tap while the signal is amber.', duration: '~30 SEC', emblem: 'ϟ' },
      attention: { kicker: 'SELECTIVE ATTENTION', title: 'Target scan', description: 'Find the one symbol that differs from the rest. A new pattern appears each round.', duration: '~1 MIN', emblem: '⊙' }
    };
    const item = settings[game];
    $('#game-kicker').textContent = item.kicker;
    $('#game-title').textContent = item.title;
    $('#game-description').textContent = item.description;
    $('#game-duration').textContent = item.duration;
    $('#game-stage').innerHTML = `<div class="game-idle"><div class="game-emblem">${item.emblem}</div><span>COGNITIVE TRAINING MODULE</span><small>SELECT START TO BEGIN</small></div>`;
    $('#game-start').disabled = false;
  }

  function beginMemory() {
    memorySequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9));
    memoryInput = [];
    gameLocked = true;
    const stage = $('#game-stage');
    stage.innerHTML = `<div class="game-stage-inner"><p id="memory-instruction">Memorize the illuminated sequence</p><div class="sequence-display" id="sequence-display">••••</div><div class="memory-grid">${Array.from({ length: 9 }, (_, i) => `<button class="memory-cell" data-memory="${i}" aria-label="Sequence tile ${i + 1}">${i + 1}</button>`).join('')}</div></div>`;
    let index = 0;
    const lightNext = () => {
      if (index >= memorySequence.length) {
        gameLocked = false;
        $('#memory-instruction').textContent = 'Repeat the sequence in order';
        $('#sequence-display').textContent = 'YOUR TURN';
        return;
      }
      const button = $(`[data-memory="${memorySequence[index]}"]`, stage);
      button.classList.add('lit');
      setTimeout(() => button.classList.remove('lit'), 380);
      index++;
      gameTimer = setTimeout(lightNext, 680);
    };
    gameTimer = setTimeout(lightNext, 500);
  }

  function tapMemory(value) {
    if (gameLocked) return;
    memoryInput.push(value);
    if (value !== memorySequence[memoryInput.length - 1]) {
      $('#memory-instruction').textContent = 'Sequence missed. Try again when ready.';
      $('#sequence-display').textContent = 'NOT QUITE';
      gameLocked = true;
      setTimeout(beginMemory, 1000);
      return;
    }
    const button = $(`[data-memory="${value}"]`);
    if (button) button.classList.add('lit');
    if (memoryInput.length === memorySequence.length) finishGame('Memory sequence complete · +25 mission XP', 100);
  }

  function beginReaction() {
    const stage = $('#game-stage');
    stage.innerHTML = '<div class="game-stage-inner"><p id="reaction-instruction">Wait for the signal to turn green</p><button class="reaction-button waiting" id="reaction-target">WAIT FOR GREEN</button><p id="reaction-result">Stay ready · do not tap early</p></div>';
    const target = $('#reaction-target');
    target.addEventListener('click', () => {
      if (target.classList.contains('waiting')) {
        clearTimeout(gameTimer);
        $('#reaction-instruction').textContent = 'Too soon! Resetting the signal.';
        target.textContent = 'WAIT FOR GREEN';
        target.classList.remove('waiting', 'go');
        gameTimer = setTimeout(beginReaction, 1100);
        return;
      }
      if (target.classList.contains('go')) {
        const time = Math.round(performance.now() - reactionStart);
        if (time < 100) {
          $('#reaction-instruction').textContent = 'That response was too fast to record reliably. Try again.';
          $('#reaction-result').textContent = 'Likely an early tap · score not saved';
          target.disabled = true;
          $('#game-start').disabled = false;
          showToast('Response too fast to record reliably. Try another round.');
          return;
        }
        $('#reaction-result').textContent = `${time} ms · ${time < 300 ? 'Quick response!' : 'Signal received.'}`;
        target.disabled = true;
        if (time < state.bestReaction) state.bestReaction = time;
        $('#cog-best').innerHTML = `${state.bestReaction} <small>ms</small>`;
        const score = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, time - 200) / 6)));
        finishGame(`Reaction recorded: ${time} ms · +25 mission XP`, score);
      }
    });
    gameTimer = setTimeout(() => {
      if (!$('#reaction-target')) return;
      $('#reaction-instruction').textContent = 'Signal detected · respond now';
      target.textContent = 'TAP NOW';
      target.classList.remove('waiting');
      target.classList.add('go');
      reactionStart = performance.now();
    }, 1400 + Math.random() * 2500);
  }

  function beginAttention() {
    const symbols = ['◈', '○', '△', '⌑', '⊙', '◇', '□'];
    const base = symbols[Math.floor(Math.random() * symbols.length)];
    let odd = symbols[(symbols.indexOf(base) + 1 + Math.floor(Math.random() * (symbols.length - 1))) % symbols.length];
    const oddIndex = Math.floor(Math.random() * 25);
    const stage = $('#game-stage');
    stage.innerHTML = `<div class="game-stage-inner"><p id="attention-instruction">Select the symbol that differs</p><div class="attention-grid">${Array.from({ length: 25 }, (_, i) => `<button class="attention-cell" data-attention="${i}">${i === oddIndex ? odd : base}</button>`).join('')}</div></div>`;
    $$('[data-attention]', stage).forEach((button) => button.addEventListener('click', () => {
      if (Number(button.dataset.attention) === oddIndex) {
        button.classList.add('correct');
        finishGame('Target identified · +25 mission XP', 92);
      } else {
        $('#attention-instruction').textContent = 'Not that one — scan again.';
      }
    }, { once: true }));
  }

  function startGame() {
    $('#game-start').disabled = true;
    if (activeGame === 'memory') beginMemory();
    if (activeGame === 'reaction') beginReaction();
    if (activeGame === 'attention') beginAttention();
  }

  function finishGame(message, score) {
    clearTimeout(gameTimer);
    gameLocked = true;
    $$('.memory-cell,.attention-cell').forEach((button) => { button.disabled = true; });
    state.cognitiveSessions += 1;
    state.metrics.cognition = score;
    state.xp += 25;
    if (!state.completed.includes('mind')) {
      const mission = missions.find((item) => item.id === 'mind');
      state.completed.push('mind');
      state.xp += mission.reward;
      awardCompanionMission('mind');
      message += ` · Daily objective +${mission.reward} XP`;
    }
    reactToActivity('focus');
    const newBadges = unlockEligibleAchievements();
    if (newBadges.length) {
      message += ` · ${newBadges.join(', ')} insignia earned`;
      speakRufus(`${$('#rufus-message').textContent} Milestone unlocked: ${newBadges.join(', ')}!`, 'NEW MISSION INSIGNIA', 'wave');
    }
    persist();
    renderXp();
    renderMissions();
    renderOverview();
    if ($('#view-companion').classList.contains('active')) renderCompanion();
    $('#cog-sessions').innerHTML = `${state.cognitiveSessions} <small>sessions</small>`;
    $('#game-start').disabled = false;
    showToast(message);
  }

  function saveWellbeing(mood, fatigue, stress, connection, note, entryId = null) {
    const existing = entryId
      ? state.checkinHistory.find((entry) => entry.id === entryId)
      : state.checkinHistory.find((entry) => entry.date === today);
    const entry = window.AstroVitalFeatureData.normalizeWellbeingHistory([{
      id: existing?.id || createFeatureId('wellbeing'),
      date: existing?.date || today,
      time: existing?.time || new Date().toLocaleTimeString(localeTag(), { timeZone: state.profile.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
      mood,
      fatigue,
      stress,
      connection,
      note
    }])[0];
    if (!entry) {
      showToast('Check the wellbeing values and try again.');
      return false;
    }
    if (entry.date === today && !restorePersonalBaselineRecords()) return false;
    if (existing) {
      state.checkinHistory = state.checkinHistory.map((item) => item.id === existing.id ? entry : item);
    } else {
      state.checkinHistory.unshift(entry);
    }
    state.checkinHistory = state.checkinHistory.slice()
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
      .slice(0, 365);
    if (entry.date === today) {
      state.metrics.mood = entry.mood;
      state.metrics.fatigue = entry.fatigue;
      state.metrics.stress = entry.stress;
      state.metrics.connection = entry.connection;
      const moodScores = { Low: 1, Okay: 2.5, Good: 4, Great: 5 };
      upsertBaselineRecord({ moodScore: moodScores[entry.mood] ?? null });
    }
    reactToActivity('journal');
    persist();
    renderOverview();
    renderHealth();
    renderWellbeing();
    renderBaseline();
    if ($('#journal-feedback')) $('#journal-feedback').textContent = 'Your check-in has been saved on this device.';
    showToast(entryId ? 'Wellbeing entry updated locally' : 'Wellbeing check-in saved locally');
    return true;
  }

  function renderWellbeing() {
    if (!$('#view-wellbeing')) return;
    const todayEntry = state.checkinHistory.find((entry) => entry.date === today);
    $('#wellbeing-greeting').textContent = `How are you feeling, ${state.profile.name || 'crew member'}?`;
    $$('input[name="mood"]').forEach((input) => { input.checked = input.value === state.metrics.mood; });
    $('#energy-slider').value = String(state.metrics.fatigue);
    $('#fatigue-value').textContent = String(state.metrics.fatigue);
    $('#stress-slider').value = String(state.metrics.stress || 3);
    $('#stress-value').textContent = String(state.metrics.stress || 3);
    $('#wellbeing-connection').value = state.metrics.connection;
    if (todayEntry) $('#journal-note').value = todayEntry.note;
    const startDate = dateRangeStart(wellbeingRange);
    const entries = state.checkinHistory.filter((entry) => entry.date >= startDate);
    const withStress = entries.filter((entry) => Number.isFinite(entry.stress));
    const withFatigue = entries.filter((entry) => Number.isFinite(entry.fatigue));
    const avg = (values) => values.length ? formatDecimal(values.reduce((sum, value) => sum + value, 0) / values.length) : '—';
    $('#wellbeing-summary').innerHTML = `<div class="wellbeing-stat"><span>CHECK-INS</span><strong>${formatNumber(entries.length)}</strong></div><div class="wellbeing-stat"><span>AVG. SELF-REPORTED FATIGUE</span><strong>${avg(withFatigue.map((entry) => entry.fatigue))} / 10</strong></div><div class="wellbeing-stat"><span>AVG. SELF-REPORTED STRESS</span><strong>${avg(withStress.map((entry) => entry.stress))} / 10</strong></div>`;
    renderWellbeingHistory();
    $$('[data-wellbeing-range]').forEach((button) => button.classList.toggle('active', Number(button.dataset.wellbeingRange) === wellbeingRange));
  }

  function initializeInspirationCarousel() {
    const carousel = $('[data-inspiration-carousel]');
    if (!carousel) return;
    const quoteNode = $('#inspiration-quote', carousel);
    const headingNode = $('#inspiration-label', carousel);
    const countNode = $('#inspiration-count', carousel);
    const copyNode = $('#inspiration-copy', carousel);
    const controls = $('.inspiration-controls', carousel);
    const previousButton = $('[data-inspiration-prev]', carousel);
    const nextButton = $('[data-inspiration-next]', carousel);
    if (!quoteNode || !headingNode || !countNode || !copyNode || !controls || !previousButton || !nextButton) return;

    const quotesByLanguage = {
      en: [
        'The mission matters, but so does the person carrying it.',
        'Failure is only the opportunity to begin again.',
        'In the darkest times, hope is something you give yourself.',
        'While it is always best to believe in oneself, a little help from others can be a great blessing.',
        'Life happens wherever you are, whether you make it or not.',
        "Courage isn't the absence of fear. It's choosing to move forward."
      ],
      es: [
        'La misión importa, pero también importa quien la lleva adelante.',
        'El fracaso es solo la oportunidad de empezar de nuevo.',
        'En los momentos más oscuros, la esperanza es algo que puedes darte.',
        'Aunque siempre es mejor creer en uno mismo, un poco de ayuda de los demás puede ser una gran bendición.',
        'La vida sucede dondequiera que estés, te esfuerces por cambiarla o no.',
        'El valor no es no tener miedo. Es elegir seguir adelante.'
      ],
      fr: [
        'La mission compte, mais la personne qui la porte compte aussi.',
        'L’échec est seulement l’occasion de recommencer.',
        'Dans les moments les plus sombres, l’espoir est quelque chose que l’on se donne.',
        'Il est toujours préférable de croire en soi, mais un peu d’aide des autres peut être une grande bénédiction.',
        'La vie se déroule où que vous soyez, que vous cherchiez à la façonner ou non.',
        'Le courage, ce n’est pas l’absence de peur. C’est choisir d’avancer.'
      ],
      de: [
        'Die Mission ist wichtig, aber genauso wichtig ist der Mensch, der sie trägt.',
        'Scheitern ist nur die Gelegenheit, neu anzufangen.',
        'In den dunkelsten Zeiten ist Hoffnung etwas, das man sich selbst geben kann.',
        'An sich selbst zu glauben ist immer am besten, doch ein wenig Hilfe von anderen kann ein großer Segen sein.',
        'Das Leben findet statt, wo immer du bist, ob du es gestaltest oder nicht.',
        'Mut bedeutet nicht, keine Angst zu haben. Mut bedeutet, trotzdem weiterzugehen.'
      ],
      zh: [
        '任务固然重要，承担任务的人也同样重要。',
        '失败只是重新开始的机会。',
        '在最黑暗的时刻，希望是你可以给予自己的东西。',
        '相信自己固然最好，但他人的帮助也可能成为一份珍贵的祝福。',
        '无论你身在何处，生活都在继续，不论你是否参与其中。',
        '勇气不是没有恐惧，而是选择继续前行。'
      ],
      ja: [
        '任務は大切です。でも、それを担う人も同じくらい大切です。',
        '失敗は、もう一度始めるための機会にすぎません。',
        '最も暗い時こそ、希望は自分自身に与えるものです。',
        '自分を信じるのが一番ですが、誰かの助けも大きな支えになります。',
        'どこにいても人生は続きます。自分が何かをしようとしまいと。',
        '勇気とは恐れがないことではありません。それでも前に進むと決めることです。'
      ],
      ar: [
        'المهمة مهمة، لكن الشخص الذي يحمل مسؤوليتها مهم أيضًا.',
        'الفشل ليس إلا فرصة للبدء من جديد.',
        'في أحلك الأوقات، يكون الأمل شيئًا تمنحه لنفسك.',
        'من الأفضل دائمًا أن تؤمن بنفسك، لكن قليلًا من مساعدة الآخرين قد يكون نعمة كبيرة.',
        'الحياة تمضي أينما كنت، سواء شاركت فيها أم لم تفعل.',
        'الشجاعة ليست غياب الخوف، بل اختيار المضي قدمًا.'
      ]
    };
    const labelsByLanguage = {
      en: { carousel: 'Crew inspiration', heading: 'A MOMENT OF INSPIRATION', controls: 'Quote controls', previous: 'Previous quote', next: 'Next quote', slide: 'Slide' },
      es: { carousel: 'Inspiración para la tripulación', heading: 'UN MOMENTO DE INSPIRACIÓN', controls: 'Controles de citas', previous: 'Cita anterior', next: 'Cita siguiente', slide: 'Diapositiva' },
      fr: { carousel: 'Inspiration pour l’équipage', heading: 'UN MOMENT D’INSPIRATION', controls: 'Commandes des citations', previous: 'Citation précédente', next: 'Citation suivante', slide: 'Diapositive' },
      de: { carousel: 'Inspiration für die Crew', heading: 'EIN MOMENT DER INSPIRATION', controls: 'Zitatsteuerung', previous: 'Vorheriges Zitat', next: 'Nächstes Zitat', slide: 'Folie' },
      zh: { carousel: '给乘组的灵感', heading: '片刻灵感', controls: '引言控制', previous: '上一条引言', next: '下一条引言', slide: '第' },
      ja: { carousel: 'クルーへのひとこと', heading: '心に残るひとこと', controls: '引用の操作', previous: '前の引用', next: '次の引用', slide: 'スライド' },
      ar: { carousel: 'إلهام للطاقم', heading: 'لحظة إلهام', controls: 'عناصر التحكم في الاقتباسات', previous: 'الاقتباس السابق', next: 'الاقتباس التالي', slide: 'الشريحة' }
    };
    const interval = 10000;
    const view = carousel.closest('.view');
    let activeIndex = 0;
    let rotationTimer;
    let transitionTimer;
    let hoverPaused = false;
    let focusPaused = false;

    const currentLanguage = () => Object.hasOwn(quotesByLanguage, state.profile.language) ? state.profile.language : 'en';
    const currentQuotes = () => quotesByLanguage[currentLanguage()];
    const currentLabels = () => labelsByLanguage[currentLanguage()];
    const isActive = () => !document.hidden
      && !document.body.classList.contains('show-entry')
      && view?.classList.contains('active');

    const scheduleRotation = () => {
      clearTimeout(rotationTimer);
      copyNode.setAttribute('aria-live', hoverPaused || focusPaused || !isActive() ? 'polite' : 'off');
      if (hoverPaused || focusPaused || !isActive()) return;
      rotationTimer = setTimeout(() => showQuote(activeIndex + 1), interval);
    };

    const showQuote = (index, animate = true) => {
      const quotes = currentQuotes();
      const labels = currentLabels();
      activeIndex = (index + quotes.length) % quotes.length;
      clearTimeout(transitionTimer);
      const delay = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 240 : 0;
      if (delay) copyNode.classList.add('is-transitioning');
      transitionTimer = setTimeout(() => {
        quoteNode.textContent = quotes[activeIndex];
        countNode.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(quotes.length).padStart(2, '0')}`;
        copyNode.setAttribute('aria-label', `${labels.slide} ${activeIndex + 1} / ${quotes.length}`);
        copyNode.classList.remove('is-transitioning');
        scheduleRotation();
      }, delay);
    };

    const applyLanguage = () => {
      const labels = currentLabels();
      carousel.setAttribute('aria-label', labels.carousel);
      headingNode.textContent = labels.heading;
      controls.setAttribute('aria-label', labels.controls);
      previousButton.setAttribute('aria-label', labels.previous);
      previousButton.setAttribute('title', labels.previous);
      nextButton.setAttribute('aria-label', labels.next);
      nextButton.setAttribute('title', labels.next);
      activeIndex = 0;
      showQuote(activeIndex, false);
    };

    previousButton.addEventListener('click', () => showQuote(activeIndex - 1));
    nextButton.addEventListener('click', () => showQuote(activeIndex + 1));
    carousel.addEventListener('pointerenter', () => {
      hoverPaused = true;
      scheduleRotation();
    });
    carousel.addEventListener('pointerleave', () => {
      hoverPaused = false;
      scheduleRotation();
    });
    controls.addEventListener('focusin', () => {
      focusPaused = true;
      scheduleRotation();
    });
    controls.addEventListener('focusout', () => {
      setTimeout(() => {
        focusPaused = controls.contains(document.activeElement);
        scheduleRotation();
      }, 0);
    });
    document.addEventListener('visibilitychange', scheduleRotation);
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-nav]')) setTimeout(scheduleRotation, 0);
    });
    document.addEventListener('rufus:localechange', applyLanguage);
    applyLanguage();
  }

  function renderWellbeingHistory() {
    const target = $('#wellbeing-history') || $('#journal-history');
    if (!target) return;
    const startDate = dateRangeStart(wellbeingRange);
    const entries = state.checkinHistory.filter((entry) => entry.date >= startDate);
    if (!entries.length) {
      target.innerHTML = `<div class="journal-entry journal-empty">${rufusImage('confident', 'journal-empty-art')}<div><strong>No saved reflections in this range</strong><small>YOUR DEVICE</small><p>Your check-ins and journal notes stay in this local profile.</p></div></div>`;
      return;
    }
    target.innerHTML = entries.map((entry) => `<article class="journal-entry">
      <span>${entry.mood === 'Great' ? '✦' : entry.mood === 'Good' ? '☀' : entry.mood === 'Okay' ? '◒' : '☁'}</span>
      <div class="wellbeing-entry-copy"><strong>${escapeHtml(entry.mood)} · Fatigue ${formatNumber(entry.fatigue)}/10${Number.isFinite(entry.stress) ? ` · Stress ${formatNumber(entry.stress)}/10` : ''}</strong>
      <small>${escapeHtml(formatAppDate(entry.date))} · ${escapeHtml(entry.time || 'time not recorded')}${entry.connection ? ` · ${escapeHtml(entry.connection)}` : ''}</small>
      ${entry.note ? `<p data-user-content>${escapeHtml(entry.note)}</p>` : ''}</div>
      <div class="feature-row-actions"><button type="button" class="secondary-button" data-wellbeing-edit="${escapeHtml(entry.id)}">EDIT</button><button type="button" class="secondary-button" data-wellbeing-delete="${escapeHtml(entry.id)}">DELETE</button></div>
    </article>`).join('');
  }

  function openWellbeingEditor(id) {
    const entry = state.checkinHistory.find((item) => item.id === id);
    if (!entry) {
      showToast('That wellbeing entry is no longer available.');
      return;
    }
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> WELLBEING · EDIT ENTRY</div><h2 id="modal-title">Update your reflection</h2><p>${escapeHtml(formatAppDate(entry.date))} · Stored in this local profile.</p><form id="wellbeing-edit-form">
      <input type="hidden" name="id" value="${escapeHtml(entry.id)}">
      <div class="modal-form">
        <label>MOOD<select name="mood">${window.AstroVitalFeatureData.MOODS.map((mood) => `<option ${entry.mood === mood ? 'selected' : ''}>${mood}</option>`).join('')}</select></label>
        <label>CREW CONNECTION<select name="connection">${window.AstroVitalFeatureData.CONNECTIONS.map((connection) => `<option ${entry.connection === connection ? 'selected' : ''}>${escapeHtml(connection)}</option>`).join('')}</select></label>
        <label>FATIGUE · 1–10<input name="fatigue" type="number" min="1" max="10" value="${entry.fatigue}" required></label>
        <label>STRESS · 1–10<input name="stress" type="number" min="1" max="10" value="${entry.stress || ''}"></label>
      </div>
      <label class="feature-full-width">PRIVATE NOTE<textarea name="note" rows="4" maxlength="500">${escapeHtml(entry.note)}</textarea></label>
      <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE CHANGES</button></div>
    </form>`);
  }

  function deleteWellbeingEntry(id) {
    const entry = state.checkinHistory.find((item) => item.id === id);
    if (!entry || !window.confirm('Delete this check-in and journal note from this local profile?')) return;
    state.checkinHistory = state.checkinHistory.filter((item) => item.id !== id);
    if (entry.date === today) {
      const replacement = state.checkinHistory.find((item) => item.date === today);
      state.metrics.mood = replacement?.mood || seed.metrics.mood;
      state.metrics.fatigue = replacement?.fatigue || seed.metrics.fatigue;
      state.metrics.stress = replacement?.stress || seed.metrics.stress;
      state.metrics.connection = replacement?.connection || seed.metrics.connection;
    }
    persist();
    renderOverview();
    renderHealth();
    renderWellbeing();
    showToast('Wellbeing entry deleted');
  }

  function renderMedicationOverview() {
    const count = state.medicationLog.filter((entry) => entry.date === today).length;
    $('#medication-overview-count').textContent = `${count} / ${demoMedication.schedule.length}`;
    $('#medication-overview-status').textContent = count ? 'DEMO LOG UPDATED' : 'DEMO SCHEDULE';
  }

  function renderMedicationManager() {
    const scheduleRoot = $('#medication-schedule-list');
    if (!scheduleRoot) return;
    const todayEntries = state.medicationLog.filter((entry) => entry.date === today);
    $('#medication-today-count').textContent = `${todayEntries.length} / ${demoMedication.schedule.length}`;
    $('#medication-supply-value').textContent = demoMedication.supply;
    $('#medication-expiry-value').textContent = `${demoMedication.expiry} · demo`;

    scheduleRoot.innerHTML = demoMedication.schedule.map((item, index) => {
      const entry = todayEntries.find((record) => record.scheduleId === item.id);
      const status = entry ? entry.status : 'pending';
      const statusLabel = status === 'taken' ? 'TAKEN' : status === 'skipped' ? 'SKIPPED' : 'NOT LOGGED';
      return `<article class="medication-schedule-row">
        <div class="medication-schedule-time"><time>${item.time}</time><small>${index === 0 ? 'Morning' : 'Evening'}</small></div>
        <div class="medication-schedule-copy"><strong>${escapeHtml(demoMedication.name)}</strong><small>Fictional · no dose specified</small><span class="medication-status ${status}">${statusLabel}</span></div>
        <div class="medication-actions"><button class="secondary-button ${status === 'taken' ? 'selected' : ''}" type="button" data-medication-status="taken" data-medication-slot="${item.id}" aria-pressed="${status === 'taken'}">TAKEN</button><button class="secondary-button ${status === 'skipped' ? 'selected' : ''}" type="button" data-medication-status="skipped" data-medication-slot="${item.id}" aria-pressed="${status === 'skipped'}">SKIP</button></div>
      </article>`;
    }).join('');

    const history = state.medicationLog.slice().sort((first, second) => second.recordedAt.localeCompare(first.recordedAt)).slice(0, 6);
    $('#medication-history-list').innerHTML = history.length ? history.map((entry) => {
      const slot = demoMedication.schedule.find((item) => item.id === entry.scheduleId);
      const time = new Date(entry.recordedAt).toLocaleTimeString(localeTag(), { timeZone: state.profile.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
      return `<article class="medication-history-row"><span class="medication-history-mark ${entry.status}">${entry.status === 'taken' ? '✓' : '–'}</span><div><strong>${entry.status === 'taken' ? 'Taken' : 'Skipped'} · ${slot ? slot.time : ''}</strong><small>${escapeHtml(formatAppDate(entry.date))} · ${escapeHtml(time)}</small>${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}</div><span class="sim-tag">DEMO</span></article>`;
    }).join('') : '<p class="medication-empty">No demo entries yet.</p>';
  }

  function openMedicationLogModal(scheduleId, status) {
    const item = demoMedication.schedule.find((slot) => slot.id === scheduleId);
    if (!item || !['taken', 'skipped'].includes(status)) return;
    const label = status === 'taken' ? 'taken' : 'skipped';
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> DEMO ENTRY</div>
      <h2 id="modal-title">Mark ${label}?</h2>
      <p>Fictional entry · saved on this device only.</p>
      <form id="medication-log-form">
        <input type="hidden" name="scheduleId" value="${item.id}">
        <input type="hidden" name="status" value="${status}">
        <label class="medication-note-label">NOTE · OPTIONAL<textarea name="note" maxlength="200" rows="3" placeholder="Add a note"></textarea></label>
        <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE ENTRY</button></div>
      </form>`);
  }

  function recordMedicationStatus(scheduleId, status, note) {
    const item = demoMedication.schedule.find((slot) => slot.id === scheduleId);
    if (!item || !['taken', 'skipped'].includes(status)) return;
    const now = new Date();
    const existingIndex = state.medicationLog.findIndex((entry) => entry.date === today && entry.scheduleId === scheduleId);
    const entry = {
      id: existingIndex >= 0 ? state.medicationLog[existingIndex].id : `demo-${Date.now()}`,
      scheduleId,
      date: today,
      status,
      recordedAt: now.toISOString(),
      note: String(note || '').trim().slice(0, 200)
    };
    if (existingIndex >= 0) state.medicationLog[existingIndex] = entry;
    else state.medicationLog.unshift(entry);
    persist();
    renderMedicationManager();
    renderMedicationOverview();
    showToast('Demo entry saved');
  }

  const mobileNavToggle = $('#mobile-nav-toggle');
  const mobileNavBackdrop = $('#mobile-nav-backdrop');
  const navSidebar = $('#nav-sidebar');

  function setMobileNavOpen(open) {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const isOpen = isMobile && open;
    document.body.classList.toggle('mobile-nav-open', isOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNavToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    navSidebar.inert = isMobile && !isOpen;
    mobileNavBackdrop.hidden = !isOpen;
  }

  mobileNavToggle.addEventListener('click', () => {
    setMobileNavOpen(mobileNavToggle.getAttribute('aria-expanded') !== 'true');
  });
  mobileNavBackdrop.addEventListener('click', () => setMobileNavOpen(false));
  window.matchMedia('(max-width: 760px)').addEventListener('change', () => setMobileNavOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
      setMobileNavOpen(false);
      mobileNavToggle.focus();
    }
  });
  setMobileNavOpen(false);

  document.addEventListener('keydown', (event) => {
    const currentTab = event.target.closest('[data-insight-tab]');
    if (!currentTab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = $$('[data-insight-tab]');
    const currentIndex = tabs.indexOf(currentTab);
    const forwardKey = document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backwardKey = forwardKey === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (currentIndex + (event.key === forwardKey ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    setInsightTab(tabs[nextIndex].dataset.insightTab);
    tabs[nextIndex].focus();
  });

  document.addEventListener('click', (event) => {
    const insightTab = event.target.closest('[data-insight-tab]');
    if (insightTab) {
      setInsightTab(insightTab.dataset.insightTab);
      return;
    }
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      event.preventDefault();
      const view = nav.dataset.nav;
      closeModal();
      setNav(view);
      if (document.body.classList.contains('mobile-nav-open')) {
        setMobileNavOpen(false);
        mobileNavToggle.focus();
      }
      return;
    }
    if (event.target.closest('#health-report-export')) {
      exportHealthReport();
      return;
    }
    if (event.target.closest('#health-report-print')) {
      window.print();
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    const medicationStatusButton = event.target.closest('[data-medication-status]');
    if (medicationStatusButton) {
      openMedicationLogModal(medicationStatusButton.dataset.medicationSlot, medicationStatusButton.dataset.medicationStatus);
      return;
    }
    if (action === 'sign-out') {
      closeModal();
      insightDemoMode = false;
      demoInsightData = null;
      activeInsightTab = 'baseline';
      $('#login-form').reset();
      $('#login-feedback').textContent = '';
      $('#welcome-language').value = languageNames[state.profile.language] ? state.profile.language : 'en';
      welcomeLanguageTouched = false;
      document.body.classList.add('show-entry');
      $('#login-personnel-id').focus();
    }
    if (action === 'profile') openProfile();
    if (action === 'checkin') openCheckin();
    if (action === 'toggle-insight-demo') {
      insightDemoMode = !insightDemoMode;
      setInsightTab(activeInsightTab);
      return;
    }
    if (action === 'alerts') openAlerts();
    if (action === 'rufus-cheer') cheerRufus();
    if (action === 'pet-rufus') petRufus();
    if (action === 'customize-rufus') openRufusCustomizer();
    if (action === 'close-modal') closeModal();
    if (action === 'dismiss-notice') event.target.closest('.notice-strip').remove();
    if (action === 'confirm-hydration-plan') {
      if (!pendingHydrationPlan) {
        showToast('Preview and review a schedule before saving it.');
        return;
      }
      state.profile = {
        ...state.profile,
        hydrationGoal: pendingHydrationPlan.goal,
        hydrationUnit: pendingHydrationPlan.unit,
        reminderStart: pendingHydrationPlan.start,
        reminderEnd: pendingHydrationPlan.end,
        reminderCount: pendingHydrationPlan.count,
        hydrationScheduleConfirmed: true
      };
      clearHydrationPreview();
      persist();
      renderOverview();
      renderHydration(true);
      renderSettings();
      $('#hydration-feedback').textContent = 'Your personal hydration plan was saved on this device.';
      showToast('Hydration plan saved');
    }
    if (action === 'confirm-delete-hydration') {
      const id = pendingHydrationDeleteId;
      if (!id || !state.hydrationLogs.some((log) => log.id === id)) {
        closeModal();
        pendingHydrationDeleteId = null;
        showToast('That intake entry is no longer available.');
        return;
      }
      state.hydrationLogs = state.hydrationLogs.filter((log) => log.id !== id);
      pendingHydrationDeleteId = null;
      clearHydrationPreview();
      closeModal();
      persist();
      renderOverview();
      renderHydration();
      showToast('Intake entry deleted');
    }

    const accessoryToggle = event.target.closest('[data-toggle-accessory]');
    if (accessoryToggle) {
      const item = accessoryToggle.dataset.toggleAccessory;
      if (!state.rufus.inventory.includes(item) || !Object.hasOwn(rufusAccessories, item)) {
        showToast('That gear is not in Rufus’s locker yet.');
        return;
      }
      state.rufus.accessories = state.rufus.accessories.includes(item)
        ? state.rufus.accessories.filter((equipped) => equipped !== item)
        : [...state.rufus.accessories, item];
      persist();
      renderCompanion();
      speakRufus(`${rufusAccessories[item].name} ${state.rufus.accessories.includes(item) ? 'equipped' : 'put away'}. Mix and match any gear you own.`, 'LOCKER UPDATED');
      return;
    }

    const accessoryPurchase = event.target.closest('[data-buy-accessory]');
    if (accessoryPurchase) {
      const item = accessoryPurchase.dataset.buyAccessory;
      const accessory = rufusAccessories[item];
      if (!accessory || state.rufus.inventory.includes(item) || state.rufus.stardust < accessory.cost) {
        showToast('That gear is unavailable or you need more mission stardust.');
        return;
      }
      state.rufus.stardust -= accessory.cost;
      state.rufus.inventory.push(item);
      state.rufus.accessories.push(item);
      persist();
      renderCompanion();
      speakRufus(`${accessory.name} unlocked and equipped! That is some excellent mission gear.`, 'NEW GEAR UNLOCKED');
      showToast(`${accessory.name} added to Rufus’s locker.`);
      return;
    }

    const rufusChoice = event.target.closest('[data-rufus-choice]');
    if (rufusChoice) {
      const pose = rufusChoice.dataset.rufusChoice;
      if (!Object.hasOwn(rufusArtwork, pose)) {
        showToast('Choose one of Rufus’s available mission poses.');
        return;
      }
      const art = rufusArtwork[pose];
      $('#rufus-form [name="pose"]').value = pose;
      const preview = $('.rufus-preview-art', $('#modal-content'));
      preview.dataset.rufusArt = pose;
      preview.setAttribute('aria-label', `Rufus: ${art.description}`);
      paintRufusCanvas(preview, pose);
      $('#rufus-preview-caption').textContent = art.description;
      $$('[data-rufus-choice]').forEach((choice) => {
        const selected = choice === rufusChoice;
        choice.classList.toggle('selected', selected);
        choice.setAttribute('aria-pressed', String(selected));
      });
      return;
    }

    const missionAction = event.target.closest('[data-mission-action]')?.dataset.missionAction;
    if (missionAction === 'checkin') openCheckin();
    if (missionAction === 'move') openActivity();
    if (missionAction === 'breathe') {
      openModal('<div class="eyebrow"><span class="eyebrow-line"></span> RECOVERY · MINDFUL PAUSE</div><h2 id="modal-title">A moment to reset</h2><p>Follow your own comfort and mission guidance. Try a slow, comfortable breath in and out for one minute. Stop if you feel unwell.</p><div class="health-note"><span>◌</span><div><strong>Optional, self-paced pause</strong><p>This is a general relaxation prompt, not a medical breathing protocol.</p></div></div><div class="modal-actions"><button class="secondary-button" data-action="close-modal">NOT NOW</button><button class="primary-button" data-action="complete-breath">I TOOK A PAUSE · +30 XP</button></div>');
    }
    if (missionAction === 'mind' || missionAction === 'game') {
      closeModal();
      setNav('cognitive');
      return;
    }
    if (action === 'complete-breath') {
      closeModal();
      completeMission('breathe');
    }
    const completeId = event.target.closest('[data-complete]')?.dataset.complete;
    if (completeId) completeMission(completeId);
    const quickAmount = event.target.closest('[data-hydration-quick]')?.dataset.hydrationQuick;
    if (quickAmount) recordHydration(Number(quickAmount), 'mL');
    const editHydrationId = event.target.closest('[data-hydration-edit]')?.dataset.hydrationEdit;
    if (editHydrationId) openHydrationEdit(editHydrationId);
    const deleteHydrationId = event.target.closest('[data-hydration-delete]')?.dataset.hydrationDelete;
    if (deleteHydrationId) confirmDeleteHydration(deleteHydrationId);
    const activityEditId = event.target.closest('[data-activity-edit]')?.dataset.activityEdit;
    if (activityEditId) openActivityEntryEditor(activityEditId);
    const activityDeleteId = event.target.closest('[data-activity-delete]')?.dataset.activityDelete;
    if (activityDeleteId) deleteActivityEntry(activityDeleteId);
    const sleepDeleteId = event.target.closest('[data-sleep-delete]')?.dataset.sleepDelete;
    if (sleepDeleteId) deleteSleepEntry(sleepDeleteId);
    const sleepScheduleDeleteId = event.target.closest('[data-sleep-schedule-delete]')?.dataset.sleepScheduleDelete;
    if (sleepScheduleDeleteId) deleteSleepSchedule(sleepScheduleDeleteId);
    const mealEditId = event.target.closest('[data-meal-edit]')?.dataset.mealEdit;
    if (mealEditId) openMealEntryEditor(mealEditId);
    const mealDeleteId = event.target.closest('[data-meal-delete]')?.dataset.mealDelete;
    if (mealDeleteId) deleteMealEntry(mealDeleteId);
    const wellbeingEditId = event.target.closest('[data-wellbeing-edit]')?.dataset.wellbeingEdit;
    if (wellbeingEditId) openWellbeingEditor(wellbeingEditId);
    const wellbeingDeleteId = event.target.closest('[data-wellbeing-delete]')?.dataset.wellbeingDelete;
    if (wellbeingDeleteId) deleteWellbeingEntry(wellbeingDeleteId);
    const activityRangeButton = event.target.closest('[data-activity-range]');
    if (activityRangeButton) {
      activityRange = Number(activityRangeButton.dataset.activityRange);
      renderActivity();
    }
    const sleepRangeButton = event.target.closest('[data-sleep-range]');
    if (sleepRangeButton) {
      sleepRange = Number(sleepRangeButton.dataset.sleepRange);
      renderSleep();
    }
    const mealRangeButton = event.target.closest('[data-meal-range]');
    if (mealRangeButton) {
      mealRange = Number(mealRangeButton.dataset.mealRange);
      renderMeals();
    }
    const wellbeingRangeButton = event.target.closest('[data-wellbeing-range]');
    if (wellbeingRangeButton) {
      wellbeingRange = Number(wellbeingRangeButton.dataset.wellbeingRange);
      renderWellbeing();
    }
    const baselineRangeButton = event.target.closest('[data-baseline-range]');
    if (baselineRangeButton) {
      baselineChartRange = Number(baselineRangeButton.dataset.baselineRange);
      renderBaseline();
    }
    const gameTab = event.target.closest('[data-game]')?.dataset.game;
    if (gameTab) setGame(gameTab);
    const rangeButton = event.target.closest('[data-range]');
    const range = rangeButton?.dataset.range;
    if (range) {
      activeRange = rangeButton.classList.contains('range-select') ? (activeRange === 7 ? 30 : 7) : Number(range);
      $$('.range-select').forEach((button) => { button.textContent = `${activeRange} DAYS⌄`; });
      $$('[data-range].range-tab').forEach((button) => button.classList.toggle('active', Number(button.dataset.range) === activeRange));
      renderHealth();
      renderHeartChart($('#heart-chart'), activeRange, false);
    }
    const memoryCell = event.target.closest('[data-memory]')?.dataset.memory;
    if (memoryCell !== undefined) tapMemory(Number(memoryCell));
    if (event.target.closest('#game-start')) startGame();
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'health-report-form') {
      event.preventDefault();
      const endDate = $('#health-report-date').value;
      const feedback = $('#health-report-feedback');
      feedback.textContent = '';
      if (endDate > today) {
        latestHealthReport = null;
        $('#health-report-export').disabled = true;
        feedback.textContent = window.RufusI18n.translate('Future report dates are unavailable.');
        return;
      }
      renderHealthReports();
      return;
    }
    if (event.target.id === 'medication-log-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      recordMedicationStatus(String(form.get('scheduleId')), String(form.get('status')), String(form.get('note') || ''));
      closeModal();
      return;
    }
    if (event.target.id === 'login-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const personnelId = normalizePersonnelId(form.get('personnelId'));
      const feedback = $('#login-feedback');
      feedback.textContent = '';
      if (!isValidPersonnelId(personnelId)) {
        feedback.textContent = 'Enter a valid Personnel ID using letters, numbers, or hyphens (up to 20 characters).';
        return;
      }
      const accountKey = profileStorageKey(personnelId);
      const savedAccount = localStorage.getItem(accountKey);
      const claimedLegacyProfile = !savedAccount
        && localStorage.getItem(STORAGE_KEY)
        && !localStorage.getItem(LEGACY_PROFILE_CLAIMED_KEY);
      const returningProfile = Boolean(savedAccount || claimedLegacyProfile);
      let migrationWarning = false;
      activeStorageKey = savedAccount ? accountKey : STORAGE_KEY;
      state = savedAccount
        ? loadState(accountKey)
        : claimedLegacyProfile
          ? loadState(STORAGE_KEY)
          : clone(seed);
      const preferredLanguage = savedAccount && !welcomeLanguageTouched
        ? state.profile.language
        : $('#welcome-language').value;
      activeStorageKey = accountKey;
      state.profile = {
        ...state.profile,
        name: personnelId === DEMO_PERSONNEL_ID
          ? 'Rufus'
          : savedAccount && state.profile.name
            ? state.profile.name
            : 'Crew Member',
        personnelId,
        role: state.profile.role || 'Crew Member',
        language: languageNames[preferredLanguage] ? preferredLanguage : 'en',
        timezone: returningProfile && isValidTimeZone(state.profile.timezone)
          ? state.profile.timezone
          : DEFAULT_TIME_ZONE,
        onboarded: true
      };
      today = localDateKey(new Date(), state.profile.timezone);
      resetDailyProgressIfNeeded();
      delete state.profile.email;
      delete state.profile.username;
      if (!persist()) {
        feedback.textContent = 'Unable to save this local profile. Check this browser’s storage settings and try again.';
        return;
      }
      if (claimedLegacyProfile) {
        try {
          localStorage.setItem(LEGACY_PROFILE_CLAIMED_KEY, personnelId);
        } catch (error) {
          console.error('Unable to mark legacy RUFUS data as migrated:', error);
          migrationWarning = true;
        }
      }
      document.body.classList.remove('show-entry');
      welcomeLanguageTouched = false;
      updateProfileLabels();
      window.RufusI18n.setLocale(state.profile.language);
      showToast(migrationWarning
        ? 'Your profile was saved, but legacy profile migration could not be marked in this browser.'
        : `Crew profile opened: ${state.profile.name}.`);
    }
    if (event.target.id === 'profile-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const timezone = String(form.get('timezone') || '').trim();
      const next = {
        ...state.profile,
        name: String(form.get('name')).trim(),
        missionId: String(form.get('missionId') || '').trim(),
        language: String(form.get('language') || 'en'),
        timezone,
        notifications: form.get('notifications') === 'on',
        interests: form.getAll('interests').map(String),
        heartMin: Number(form.get('heartMin')),
        heartMax: Number(form.get('heartMax')),
        sleepMin: Number(form.get('sleepMin')),
        sleepMax: Number(form.get('sleepMax')),
        radiationReviewAt: Number(form.get('radiationReviewAt'))
      };
      if (!isValidTimeZone(next.timezone)) {
        showToast(timeZoneCopy[next.language]?.invalid || timeZoneCopy.en.invalid);
        $('#profile-timezone').focus();
        return;
      }
      if (!next.name || next.heartMin >= next.heartMax || next.sleepMin >= next.sleepMax) {
        showToast('Enter a name, valid time zone, and valid ranges.');
        return;
      }
      state.profile = next;
      today = localDateKey(new Date(), next.timezone);
      resetDailyProgressIfNeeded();
      persist();
      closeModal();
      window.RufusI18n.setLocale(next.language);
      updateClock();
      renderOverview();
      renderWellbeing();
      renderHydration();
      renderMedicationManager();
      showToast('Crew profile updated');
    }
    if (event.target.id === 'hydration-plan-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const goal = Number(form.get('goal'));
      const unit = String(form.get('unit'));
      const start = String(form.get('start'));
      const end = String(form.get('end'));
      const count = Number(form.get('count'));
      const span = localDayMinute(end) - localDayMinute(start);
      const goalMl = volumeToMl(goal, unit);
      if (!(goal > 0) || !Number.isFinite(goalMl) || !(count >= 1 && count <= 24) || !Number.isInteger(count)
        || span <= 0 || count > span) {
        $('#hydration-plan-preview').textContent = 'Enter a positive goal, a valid same-day time window, and 1–24 reminders that fit in that window.';
        $('#confirm-hydration-plan').hidden = true;
        pendingHydrationPlan = null;
        return;
      }
      pendingHydrationPlan = { goal, unit, goalMl, start, end, count };
      renderHydrationPreview(pendingHydrationPlan);
    }
    if (event.target.id === 'nasa-power-form') {
      event.preventDefault();
      loadNasaPowerData();
    }
    if (event.target.id === 'hydration-log-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      if (recordHydration(form.get('amount'), String(form.get('unit')))) event.target.reset();
      $('#hydration-log-unit').value = state.profile.hydrationUnit || 'mL';
    }
    if (event.target.getAttribute('id') === 'hydration-edit-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const log = state.hydrationLogs.find((entry) => entry.id === String(form.get('id')));
      const amountMl = volumeToMl(form.get('amount'), String(form.get('unit')));
      if (!log || !(amountMl > 0) || !Number.isFinite(amountMl)) {
        showToast('Enter a positive amount and choose a supported unit.');
        return;
      }
      log.amountMl = Math.round(amountMl * 10) / 10;
      clearHydrationPreview();
      closeModal();
      persist();
      renderOverview();
      renderHydration();
      showToast('Intake entry updated');
    }
    if (event.target.id === 'activity-entry-form') {
      event.preventDefault();
      const entry = activityEntryFromForm(event.target);
      if (!entry) {
        $('#activity-feedback').textContent = 'Enter a name, valid date, category, and status. Completed activities need an actual duration.';
        return;
      }
      state.activityEntries.unshift(entry);
      adjustActivityMetrics(entry, 1);
      persist();
      if (entry.status === 'completed' && entry.date === today) completeMission('move');
      renderActivity();
      renderHealth();
      renderOverview();
      $('#activity-feedback').textContent = 'Activity saved in this local profile.';
      return;
    }
    if (event.target.id === 'activity-edit-form') {
      event.preventDefault();
      const values = new FormData(event.target);
      const id = String(values.get('id') || '');
      const previous = state.activityEntries.find((entry) => entry.id === id);
      const updated = activityEntryFromForm(event.target, id);
      if (!previous || !updated) {
        showToast('Enter a valid activity. Completed activities need an actual duration.');
        return;
      }
      adjustActivityMetrics(previous, -1);
      adjustActivityMetrics(updated, 1);
      state.activityEntries = state.activityEntries.map((entry) => entry.id === id ? updated : entry);
      closeModal();
      persist();
      if (updated.status === 'completed' && updated.date === today) completeMission('move');
      renderActivity();
      renderHealth();
      renderOverview();
      showToast('Activity entry updated');
      return;
    }
    if (event.target.id === 'sleep-schedule-form') {
      event.preventDefault();
      const values = new FormData(event.target);
      const entry = window.AstroVitalFeatureData.normalizeSleepSchedule([{
        id: createFeatureId('sleep-schedule'),
        date: String(values.get('date') || ''),
        label: String(values.get('label') || ''),
        startTime: String(values.get('startTime') || ''),
        endTime: String(values.get('endTime') || '')
      }])[0];
      if (!entry) {
        $('#sleep-schedule-list').insertAdjacentHTML('afterbegin', '<p class="form-feedback" role="alert">Choose a valid date and different start and end times.</p>');
        return;
      }
      state.sleepSchedule.unshift(entry);
      persist();
      event.target.reset();
      renderSleep();
      showToast('Sleep opportunity saved locally');
      return;
    }
    if (event.target.id === 'sleep-entry-form') {
      event.preventDefault();
      const entry = sleepEntryFromForm(event.target);
      if (!entry) {
        $('#sleep-feedback').textContent = 'Enter a valid date and different start and end times for this sleep period.';
        return;
      }
      state.sleepLogs = state.sleepLogs.filter((item) => !(item.date === entry.date && item.kind === 'checkin'));
      state.sleepLogs.unshift(entry);
      const totalForToday = window.AstroVitalFeatureData.sleepTotalForDate(state.sleepLogs, today);
      if (entry.date === today && totalForToday !== null) state.metrics.sleep = totalForToday;
      persist();
      event.target.reset();
      renderSleep();
      renderHealth();
      renderOverview();
      $('#sleep-feedback').textContent = 'Sleep period saved in this local profile.';
      return;
    }
    if (event.target.id === 'meal-entry-form') {
      event.preventDefault();
      const entry = mealEntryFromForm(event.target);
      if (!entry) {
        $('#meal-feedback').textContent = 'Enter a valid meal, date, and time. Nutrition information requires a source.';
        return;
      }
      state.mealEntries.unshift(entry);
      persist();
      event.target.reset();
      renderMeals();
      $('#meal-feedback').textContent = 'Meal entry saved in this local profile.';
      return;
    }
    if (event.target.id === 'meal-edit-form') {
      event.preventDefault();
      const values = new FormData(event.target);
      const id = String(values.get('id') || '');
      const updated = mealEntryFromForm(event.target, id);
      if (!updated || !state.mealEntries.some((entry) => entry.id === id)) {
        showToast('Enter a valid meal entry. Nutrition information requires a source.');
        return;
      }
      state.mealEntries = state.mealEntries.map((entry) => entry.id === id ? updated : entry);
      closeModal();
      persist();
      renderMeals();
      showToast('Meal entry updated');
      return;
    }
    if (event.target.id === 'wellbeing-edit-form') {
      event.preventDefault();
      const values = new FormData(event.target);
      const stress = values.get('stress') === '' ? null : Number(values.get('stress'));
      if (saveWellbeing(
        String(values.get('mood')),
        Number(values.get('fatigue')),
        stress,
        String(values.get('connection')),
        String(values.get('note') || ''),
        String(values.get('id') || '')
      )) closeModal();
      return;
    }
    if (event.target.id === 'checkin-form') {
      event.preventDefault();
      if (!restorePersonalBaselineRecords()) return;
      const form = new FormData(event.target);
      const optionalMetric = (name) => {
        const value = String(form.get(name) || '').trim();
        return value && Number.isFinite(Number(value)) ? Number(value) : null;
      };
      if (state.checkinDate !== today) {
        const previousDate = previousDateKey(today);
        state.streak = state.lastCheckinDate === previousDate ? state.streak + 1 : 1;
      }
      state.metrics.heart = Number(form.get('heart'));
      state.metrics.exercise = Number(form.get('exercise'));
      state.metrics.resistanceExercise = Number(form.get('resistanceExercise'));
      const sleepPeriods = state.sleepLogs.filter((entry) => entry.date === today && entry.kind === 'period');
      if (sleepPeriods.length) {
        state.metrics.sleep = window.AstroVitalFeatureData.sleepTotalForDate(state.sleepLogs, today);
        state.sleepLogs = state.sleepLogs.filter((entry) => !(entry.date === today && entry.kind === 'checkin'));
      } else {
        state.metrics.sleep = Number(form.get('sleep'));
        const checkinSleep = {
          id: state.sleepLogs.find((entry) => entry.date === today && entry.kind === 'checkin')?.id || createFeatureId('sleep-checkin'),
          kind: 'checkin',
          date: today,
          sleepHours: state.metrics.sleep
        };
        state.sleepLogs = state.sleepLogs.filter((entry) => !(entry.date === today && entry.kind === 'checkin'));
        state.sleepLogs.push(checkinSleep);
      }
      state.metrics.immuneSymptoms = String(form.get('immuneSymptoms'));
      state.metrics.radiation = Number(form.get('radiation'));
      state.metrics.sleepEfficiency = optionalMetric('sleepEfficiency');
      state.metrics.hrv = optionalMetric('hrv');
      state.metrics.activityScore = optionalMetric('activityScore');
      state.metrics.reactionTime = optionalMetric('reactionTime');
      upsertBaselineRecord({
        sleepHours: state.metrics.sleep,
        sleepEfficiency: state.metrics.sleepEfficiency,
        restingHeartRate: state.metrics.heart,
        hrv: state.metrics.hrv,
        activityScore: state.metrics.activityScore,
        reactionTime: state.metrics.reactionTime
      });
      reactToActivity('checkin');
      state.heartHistory.push(state.metrics.heart);
      state.sleepHistory.push(state.metrics.sleep);
      state.heartHistory = state.heartHistory.slice(-30);
      state.sleepHistory = state.sleepHistory.slice(-30);
      state.lastCheckin = `TODAY, ${new Date().toLocaleTimeString(localeTag(), { timeZone: state.profile.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`;
      state.checkinDate = today;
      state.lastCheckinDate = today;
      closeModal();
      persist();
      completeMission('checkin');
      renderOverview();
      renderHealth();
      renderSleep();
      renderBaseline();
      showToast('Health check-in saved · simulated data only');
    }
    if (event.target.id === 'activity-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const duration = Number(form.get('minutes'));
      const type = String(form.get('type'));
      const category = type === 'Resistance exercise' ? 'Resistance'
        : type === 'Cardio session' ? 'Aerobic'
          : type === 'Mobility / stretch' ? 'Mobility' : 'Other approved activity';
      const entry = window.AstroVitalFeatureData.normalizeActivityEntries([{
        id: createFeatureId('activity'),
        date: today,
        name: type,
        category,
        status: 'completed',
        actualMinutes: duration
      }])[0];
      if (!entry) {
        showToast('Enter a valid activity duration.');
        return;
      }
      state.activityEntries.unshift(entry);
      adjustActivityMetrics(entry, 1);
      reactToActivity('activity');
      closeModal();
      persist();
      completeMission('move');
      renderActivity();
      renderOverview();
      renderHealth();
      showToast(`${escapeHtml(type)} logged · ${duration} min`);
    }
    if (event.target.id === 'wellness-form') {
      event.preventDefault();
      const values = new FormData(event.target);
      saveWellbeing(
        String(values.get('mood')),
        Number($('#energy-slider').value),
        $('#stress-slider') ? Number($('#stress-slider').value) : null,
        String(values.get('connection') || state.metrics.connection),
        String(values.get('note') || $('#journal-note')?.value || '')
      );
    }
    if (event.target.id === 'rufus-form') {
      event.preventDefault();
      const pose = String(new FormData(event.target).get('pose'));
      if (!Object.hasOwn(rufusArtwork, pose)) {
        showToast('Choose a valid look for Rufus.');
        return;
      }
      state.rufus.pose = pose;
      rufusReactionPose = '';
      clearTimeout(rufusReactionTimer);
      persist();
      closeModal();
      renderRufus();
      showToast('Rufus’s new look is saved on this device.');
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'energy-slider') $('#fatigue-value').textContent = event.target.value;
    if (event.target.id === 'stress-slider') $('#stress-value').textContent = event.target.value;
    if (event.target.id === 'timezone-filter') filterTimeZoneOptions(event.target.value, $('#profile-timezone'));
    if (event.target.closest('#hydration-plan-form')) {
      clearHydrationPreview();
    }
  });
  document.addEventListener('change', (event) => {
    if (event.target.id === 'power-chart-parameter' && nasaPowerData) renderPowerChart(nasaPowerData);
    if (event.target.id === 'welcome-language') {
      welcomeLanguageTouched = true;
      window.RufusI18n.setLocale(event.target.value);
    }
    if (event.target.name === 'language' && event.target.closest('#profile-form')) {
      window.RufusI18n.setLocale(event.target.value);
    }
    if (event.target.id === 'health-report-date') {
      const endDate = $('#health-report-date').value;
      if (endDate > today) {
        latestHealthReport = null;
        $('#health-report-export').disabled = true;
        $('#health-report-feedback').textContent = window.RufusI18n.translate('Future report dates are unavailable.');
      } else {
        renderHealthReports();
      }
    }
  });

  document.addEventListener('rufus:localechange', () => {
    updateTimeZoneLanguage(window.RufusI18n.locale);
    updateClock();
    if (document.body.classList.contains('show-entry')) return;
    updateProfileLabels();
    renderOverview();
    renderHealth();
    renderMissions();
    renderActivity();
    renderSleep();
    renderMeals();
    renderWellbeing();
    renderMedicationManager();
    renderHydration();
    renderSettings();
    if ($('#view-insights').classList.contains('active')) setInsightTab(activeInsightTab);
    if (nasaPowerData) renderPowerResults(nasaPowerData);
  });
  $('#modal-backdrop').addEventListener('click', (event) => {
    if (event.target.id === 'modal-backdrop') closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  today = localDateKey(new Date(), state.profile.timezone || DEFAULT_TIME_ZONE);
  resetDailyProgressIfNeeded();
  document.body.classList.add('show-entry');
  const initialLocale = languageNames[state.profile.language] ? state.profile.language : 'en';
  $('#welcome-language').value = initialLocale;
  window.RufusI18n.setLocale(initialLocale);
  initializeNasaPowerDates();
  updateClock();
  setInterval(updateClock, 1000);
  renderOverview();
  renderHealth();
  renderMissions();
  renderActivity();
  renderSleep();
  renderMeals();
  renderWellbeing();
  initializeInspirationCarousel();
  renderSettings();
  $('#cog-sessions').innerHTML = `${state.cognitiveSessions} <small>sessions</small>`;
  $('#cog-best').innerHTML = `${state.bestReaction} <small>ms</small>`;
  $('#energy-slider').value = state.metrics.fatigue;
  $('#fatigue-value').textContent = state.metrics.fatigue;

  let installPrompt = null;
  const shareButton = $('#share-button');
  shareButton.addEventListener('click', async () => {
    const shareUrl = new URL($('link[rel="canonical"]')?.href || location.href);
    shareUrl.hash = '';
    const shareData = {
      title: document.title,
      text: window.RufusI18n.translate('Try AstroVital, the local-first astronaut health app.'),
      url: shareUrl.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Unable to share AstroVital:', error);
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast('AstroVital link copied. Share it with your crew.');
    } catch (error) {
      console.error('Unable to copy the AstroVital link:', error);
      openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> SHARE APP</div><h2 id="modal-title">Copy this app link</h2><p>Share this link to open AstroVital:</p><div class="modal-form"><label>APP LINK<input id="share-url" type="url" value="${escapeHtml(shareData.url)}" readonly></label></div><div class="modal-actions"><button class="primary-button" data-action="close-modal">CLOSE</button></div>`);
      $('#share-url').select();
    }
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    showToast('AstroVital is installed on this device.');
  });
  const installApp = async () => {
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) {
      showToast('AstroVital is already installed on this device.');
      return;
    }

    if (!installPrompt) {
      const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const instructions = isAppleMobile
        ? 'Open this link in Safari, tap the Share button, then choose <strong>Add to Home Screen</strong>.'
        : /Android/i.test(navigator.userAgent)
          ? 'In Chrome, open the menu <strong>⋮</strong> and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.'
          : 'In Chrome or Edge, use the install icon in the address bar or choose <strong>Install AstroVital</strong> from the browser menu.';
      const secureOrigin = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      const availability = secureOrigin
        ? ''
        : '<p>Home-screen installation requires the published HTTPS link or a local development server; opening this file directly is not installable.</p>';
      openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> Install AstroVital</div><h2 id="modal-title">Add to your Home Screen</h2><p>${instructions}</p><p>AstroVital opens like an app and keeps your profile on this device.</p>${availability}<div class="modal-actions"><button class="primary-button" data-action="close-modal">GOT IT</button></div>`);
      return;
    }

    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      showToast(outcome === 'accepted' ? 'AstroVital is installed on this device.' : 'Installation canceled.');
    } catch (error) {
      console.error('Unable to install AstroVital:', error);
      showToast('Unable to start installation. Use your browser menu to install the app.');
    }
  };
  [$('#entry-install-button'), $('#install-button')].forEach((button) => {
    button.addEventListener('click', installApp);
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(() => {
        $('#sync-label').textContent = 'OFFLINE READY';
      }).catch((error) => {
        console.error('Unable to register the offline app cache:', error);
        $('#sync-label').textContent = 'LOCAL MODE';
      });
    });
  }
})();
