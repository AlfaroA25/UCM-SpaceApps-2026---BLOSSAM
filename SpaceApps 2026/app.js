(() => {
  const STORAGE_KEY = 'astrovital-mission-health-v1';
  const today = new Date().toISOString().slice(0, 10);
  const missions = [
    { id: 'checkin', title: 'Complete your health check-in', description: 'Log how you slept and how you are feeling.', icon: '⌁', reward: 30, action: 'checkin' },
    { id: 'move', title: 'Move your body', description: 'Log an approved exercise or mobility session.', icon: '↗', reward: 50, action: 'activity' },
    { id: 'breathe', title: 'Take a mindful pause', description: 'Try a short breathing or relaxation break.', icon: '◌', reward: 30, action: 'breathe' },
    { id: 'mind', title: 'Exercise your attention', description: 'Complete an optional Mind Lab activity.', icon: '⌘', reward: 50, action: 'game' }
  ];
  const rufusArtwork = {
    wave: { src: './icons/rufus-wave.png', name: 'Mission wave', description: 'Rufus waves hello in his flight suit.' },
    confident: { src: './icons/rufus-confident.png', name: 'Steady orbit', description: 'Rufus stands ready with a confident smile.' },
    rest: { src: './icons/rufus-rest.png', name: 'Recharge', description: 'Rufus takes a comfortable moment to rest.' },
    sleep: { src: './icons/rufus-sleep.png', name: 'Sleep cycle', description: 'Rufus drifts off for a well-earned rest.' },
    study: { src: './icons/rufus-study.png', name: 'Curious mind', description: 'Rufus explores a mission display.' }
  };
  const seed = {
    version: 1,
    profile: { name: 'Maya Chen', role: 'Flight Specialist', heartMin: 58, heartMax: 72, sleepMin: 7.5, sleepMax: 9, radiationReviewAt: 50 },
    rufus: { pose: 'wave' },
    metrics: { heart: 64, sleep: 7.4, exercise: 42, fatigue: 3, mood: 'Good', cognition: 92, radiation: 38 },
    xp: 2480,
    streak: 6,
    lastCheckin: 'TODAY, 07:42',
    checkinDate: today,
    lastCheckinDate: today,
    checkinHistory: [],
    completed: [],
    completedDate: today,
    achievements: [],
    cognitiveSessions: 3,
    bestReaction: 284,
    heartHistory: [68, 66, 67, 65, 66, 64, 64],
    sleepHistory: [6.8, 7.1, 7.6, 6.9, 7.8, 7.2, 7.4]
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = loadState();
  let activeGame = 'memory';
  let activeRange = 7;
  let rufusCheerIndex = 0;
  let toastTimer;
  let gameTimer;
  let reactionStart = 0;
  let memorySequence = [];
  let memoryInput = [];
  let gameLocked = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return clone(seed);
      const parsed = JSON.parse(saved);
      if (!parsed || parsed.version !== 1 || typeof parsed.metrics !== 'object' || typeof parsed.profile !== 'object') {
        throw new Error('Saved AstroVital data has an unsupported format.');
      }
      const savedPose = parsed.rufus && typeof parsed.rufus.pose === 'string' ? parsed.rufus.pose : 'wave';
      return {
        ...clone(seed),
        ...parsed,
        profile: { ...seed.profile, ...parsed.profile },
        rufus: { pose: Object.hasOwn(rufusArtwork, savedPose) ? savedPose : seed.rufus.pose },
        metrics: { ...seed.metrics, ...parsed.metrics },
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        checkinHistory: Array.isArray(parsed.checkinHistory) ? parsed.checkinHistory : [],
        heartHistory: Array.isArray(parsed.heartHistory) ? parsed.heartHistory : clone(seed.heartHistory),
        sleepHistory: Array.isArray(parsed.sleepHistory) ? parsed.sleepHistory : clone(seed.sleepHistory)
      };
    } catch (error) {
      console.error('Unable to load saved AstroVital data:', error);
      setTimeout(() => showToast('Saved data could not be read. Showing the sample profile.'), 0);
      return clone(seed);
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Unable to save AstroVital data:', error);
      showToast('Unable to save locally. Check this browser’s storage settings.');
    }
  }

  function resetDailyProgressIfNeeded() {
    if (state.completedDate !== today) {
      state.completed = [];
      state.completedDate = today;
    }
    if (state.checkinDate !== today) state.checkinDate = '';
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
    if (metrics.radiation >= Number(profile.radiationReviewAt)) {
      alerts.push({ title: 'Review cumulative radiation exposure', detail: `The illustrative exposure value is ${metrics.radiation} mSv, at or above the simulated mission review marker of ${profile.radiationReviewAt} mSv. Follow mission radiation-monitoring protocols and contact mission medical support for interpretation.` });
    }
    return alerts;
  }

  function metricStatus(metric) {
    if (metric === 'heart') return state.metrics.heart < Number(state.profile.heartMin) || state.metrics.heart > Number(state.profile.heartMax);
    if (metric === 'sleep') return state.metrics.sleep < Number(state.profile.sleepMin) - 1;
    if (metric === 'fatigue') return state.metrics.fatigue >= 8;
    if (metric === 'radiation') return state.metrics.radiation >= Number(state.profile.radiationReviewAt);
    return false;
  }

  function setNav(view) {
    $$('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
    $$('.nav-link[data-nav]').forEach((button) => button.classList.toggle('active', button.dataset.nav === view));
    const labels = { overview: 'OVERVIEW', health: 'HEALTH MONITOR', missions: 'DAILY MISSIONS', cognitive: 'MIND LAB', journal: 'WELLBEING LOG' };
    $('#page-crumb').textContent = labels[view] || 'OVERVIEW';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'health') renderHealth();
    if (view === 'missions') renderMissions();
    if (view === 'journal') renderJournalHistory();
  }

  function updateClock() {
    $('#clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  }

  function updateProfileLabels() {
    $$('.user-lines strong').forEach((node) => { node.textContent = state.profile.name; });
    $$('.user-lines small').forEach((node) => { node.textContent = state.profile.role.toUpperCase(); });
    $('#welcome-name').textContent = `${state.profile.name.split(/\s+/)[0]}.`;
    const initials = state.profile.name.split(/\s+/).map((part) => part[0] || '').slice(0, 2).join('').toUpperCase();
    $$('.avatar,.top-avatar').forEach((node) => { node.textContent = initials; });
  }

  function renderXp() {
    $('#xp-total').textContent = state.xp.toLocaleString();
    $('#xp-progress').style.width = `${state.xp % 1000 / 10}%`;
    $('#xp-to-next').textContent = (1000 - state.xp % 1000).toLocaleString();
    $('#streak-value').textContent = `${state.streak} day streak`;
    $('#mission-streak').textContent = state.streak;
  }

  function renderOverview() {
    resetDailyProgressIfNeeded();
    updateProfileLabels();
    renderXp();
    $('#metric-heart').textContent = state.metrics.heart;
    $('#metric-sleep').textContent = Number(state.metrics.sleep).toFixed(1);
    $('#metric-exercise').textContent = state.metrics.exercise;
    $('#metric-fatigue').textContent = state.metrics.fatigue;
    $$('.fatigue-bars i').forEach((bar, index) => bar.classList.toggle('filled', index < Number(state.metrics.fatigue)));
    $('#exercise-progress').style.width = `${Math.min(100, Number(state.metrics.exercise) / 60 * 100)}%`;
    const completedToday = missions.filter((mission) => state.completed.includes(mission.id)).length;
    const score = Math.max(0, Math.min(100, 92 - currentAlerts().length * 9 - (state.metrics.fatigue > 5 ? (state.metrics.fatigue - 5) * 2 : 0)));
    $('#readiness-score').textContent = score;
    const ring = $('.ring-value');
    ring.style.strokeDashoffset = String(320 * (1 - score / 100));
    $('.status-pill').innerHTML = `<span></span>${currentAlerts().length ? 'REVIEW INDICATORS' : 'MISSION READY'}`;
    $('.readiness-copy h2').innerHTML = currentAlerts().length ? 'Take a moment to<br>review your readings.' : 'Looking good,<br>crew member.';
    $('.readiness-copy p').textContent = currentAlerts().length
      ? 'One or more sample readings differ from your personal reference. Review the context and contact your flight surgeon if concerned.'
      : 'Your overall indicators are tracking close to your personal baseline. Keep your recovery routine on course.';
    $('#last-checkin').textContent = state.checkinDate === today ? state.lastCheckin : 'NOT LOGGED TODAY';
    $('#alert-count').textContent = String(currentAlerts().length);
    renderRufus();
    renderMissionList($('#overview-mission-list'), true);
    $$('.range-select').forEach((button) => { button.textContent = `${activeRange} DAYS⌄`; });
    renderHeartChart($('#heart-chart'), activeRange, false);
  }

  function renderMissionList(container, compact = false) {
    const list = compact ? missions.slice(0, 3) : missions;
    container.innerHTML = list.map((mission) => {
      const done = state.completed.includes(mission.id);
      return `<div class="mission-row"><button class="mission-check ${done ? 'done' : ''}" data-complete="${mission.id}" aria-label="${done ? 'Completed' : 'Complete'} ${escapeHtml(mission.title)}">${done ? '✓' : ''}</button><div class="mission-copy"><strong>${escapeHtml(mission.title)}</strong><small>${escapeHtml(mission.description)}</small></div><span class="mission-reward">${done ? 'DONE' : `+${mission.reward} XP`}</span></div>`;
    }).join('');
  }

  const metricCards = [
    { key: 'heart', icon: '♡', name: 'RESTING HEART RATE', unit: 'bpm', baseline: () => `${state.profile.heartMin}–${state.profile.heartMax} bpm personal range` },
    { key: 'sleep', icon: '☾', name: 'SLEEP DURATION', unit: 'hrs', baseline: () => `${state.profile.sleepMin}–${state.profile.sleepMax} hrs personal target` },
    { key: 'exercise', icon: '↗', name: 'EXERCISE', unit: 'min', baseline: () => '60 min daily activity goal' },
    { key: 'fatigue', icon: '◌', name: 'FATIGUE', unit: '/ 10', baseline: () => 'Self-reported; personal tracking' },
    { key: 'mood', icon: '☀', name: 'MOOD', unit: '', baseline: () => 'Self-reported check-in' },
    { key: 'cognition', icon: '⌘', name: 'COGNITIVE GAME', unit: '/ 100', baseline: () => 'Illustrative game score · not an assessment' },
    { key: 'radiation', icon: '◉', name: 'RADIATION EXPOSURE', unit: 'mSv', baseline: () => `Simulated mission review marker · ${state.profile.radiationReviewAt} mSv` }
  ];

  function renderHealth() {
    const alerts = currentAlerts();
    const alertRoot = $('#health-alerts');
    alertRoot.innerHTML = alerts.map((alert) => `<div class="alert-card"><span class="alert-mark">⚠</span><div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.detail)}</p></div></div>`).join('');
    $('#health-metrics').innerHTML = metricCards.map((metric) => {
      const value = state.metrics[metric.key];
      const displayValue = metric.key === 'sleep' ? Number(value).toFixed(1) : escapeHtml(value);
      const status = metricStatus(metric.key);
      return `<article class="health-metric ${status ? 'health-metric-alert' : ''}"><div class="health-metric-head"><span class="metric-icon ${metric.key}-icon">${metric.icon}</span><span class="health-status ${status ? 'watch' : ''}">${status ? 'REVIEW' : 'TRACKING'}</span></div><h3>${metric.name}</h3><div class="health-metric-value">${displayValue}<small>${metric.unit}</small></div><div class="health-metric-baseline">${escapeHtml(metric.baseline())}</div></article>`;
    }).join('');
    renderHeartChart($('#health-chart'), activeRange, true);
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
      return `<line class="chart-grid-line" x1="${left}" y1="${gy}" x2="${width - right}" y2="${gy}"/><text class="chart-label" x="0" y="${gy + 3}">${Math.round(value)}</text>`;
    }).join('');
    const weekLabels = Array.from({ length: 7 }, (_, index) => {
      if (index === 6) return 'TODAY';
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (6 - index));
      return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(date).toUpperCase();
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
      return `<rect class="chart-bar" x="${barX}" y="${top + plotH - barH}" width="16" height="${barH}" rx="2"><title>${Number(value).toFixed(1)} hours sleep · day ${index + 1}</title></rect>`;
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
    const newBadges = unlockEligibleAchievements();
    persist();
    renderOverview();
    renderMissions();
    showToast(`Objective complete · +${mission.reward} mission XP${newBadges.length ? ` · ${newBadges.join(', ')} insignia earned` : ''}`);
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
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> CREW HEALTH PROFILE</div>
      <h2 id="modal-title">Personal reference profile</h2>
      <p>Adjust this simulated crew profile. Personal ranges are for context; radiation review markers must follow mission medical guidance.</p>
      <aside class="rufus-profile-buddy">${rufusImage('confident', 'rufus-profile-art')}<div><strong>Rufus is on your crew.</strong><span>Make his mission pose yours.</span></div><button class="secondary-button" type="button" data-action="customize-rufus">CUSTOMIZE</button></aside>
      <form id="profile-form"><div class="modal-form">
        <label>CREW NAME<input name="name" maxlength="50" value="${escapeHtml(state.profile.name)}" required></label>
        <label>CREW ROLE<input name="role" maxlength="50" value="${escapeHtml(state.profile.role)}"></label>
        <label>RESTING HR MIN · BPM<input name="heartMin" type="number" min="35" max="110" value="${state.profile.heartMin}" required></label>
        <label>RESTING HR MAX · BPM<input name="heartMax" type="number" min="40" max="160" value="${state.profile.heartMax}" required></label>
        <label>SLEEP TARGET MIN · HOURS<input name="sleepMin" type="number" min="3" max="12" step=".1" value="${state.profile.sleepMin}" required></label>
        <label>SLEEP TARGET MAX · HOURS<input name="sleepMax" type="number" min="4" max="14" step=".1" value="${state.profile.sleepMax}" required></label>
        <label>SIMULATED RADIATION REVIEW · mSv<input name="radiationReviewAt" type="number" min="1" max="1000" step=".1" value="${state.profile.radiationReviewAt}" required></label>
      </div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE PROFILE</button></div></form>`);
    renderRufus();
  }

  function renderRufus() {
    $$('[data-rufus-art]').forEach((image) => {
      const pose = image.id === 'rufus-avatar' ? state.rufus.pose : image.dataset.rufusArt;
      const art = rufusArtwork[pose] || rufusArtwork.wave;
      image.dataset.rufusArt = pose in rufusArtwork ? pose : 'wave';
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
    $('#rufus-message').textContent = message;
  }

  function rufusImage(pose, className = '', alt) {
    const art = rufusArtwork[pose] || rufusArtwork.wave;
    const safePose = Object.hasOwn(rufusArtwork, pose) ? pose : 'wave';
    return `<img class="${className}" data-rufus-art="${safePose}" src="${art.src}" alt="${escapeHtml(alt || art.description)}" loading="lazy" decoding="async">`;
  }

  function openRufusCustomizer() {
    const poses = Object.entries(rufusArtwork).map(([pose, art]) => `
      <button class="rufus-pose-choice ${state.rufus.pose === pose ? 'selected' : ''}" type="button" data-rufus-choice="${pose}" aria-pressed="${state.rufus.pose === pose}">
        ${rufusImage(pose, 'rufus-pose-thumb', `${art.name}: ${art.description}`)}
        <span><strong>${art.name}</strong><small>${art.description}</small></span>
      </button>`).join('');

    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> RUFUS AVATAR BAY</div><h2 id="modal-title">Choose Rufus’s mission moment</h2><p>Pick one of Rufus’s illustrated poses from the character sheet. Your choice is saved only in this browser on this device.</p><div class="rufus-preview" id="rufus-preview">${rufusImage(state.rufus.pose, 'rufus-preview-art')}<div><strong>Rufus</strong><span id="rufus-preview-caption">${rufusArtwork[state.rufus.pose].description}</span></div></div><form id="rufus-form"><input type="hidden" name="pose" value="${state.rufus.pose}"><div class="rufus-pose-grid">${poses}</div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE AVATAR</button></div></form>`);
    renderRufus();
  }

  function cheerRufus() {
    const cheers = [
      'You do not have to do it all at once. One small step is plenty.',
      'Checking in with yourself is brave work. I am cheering you on!',
      'Your pace is the right pace. Rest is part of the mission, too.',
      'A little progress still counts as progress. You have got this, crew member!'
    ];
    $('#rufus-message').textContent = cheers[rufusCheerIndex % cheers.length];
    rufusCheerIndex += 1;
    const avatar = $('#rufus-avatar');
    avatar.classList.remove('rufus-bounce');
    void avatar.getBoundingClientRect();
    avatar.classList.add('rufus-bounce');
  }

  function openCheckin() {
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> DAILY WELLNESS · SIMULATED DATA</div>
      <h2 id="modal-title">Health check-in</h2>
      <p>Enter illustrative self-reported values. This prototype does not connect to sensors or provide medical advice.</p>
      <aside class="rufus-modal-note">${rufusImage('confident', 'rufus-modal-art')}<span><strong>There’s no perfect score.</strong> Just share what feels comfortable today.</span></aside>
      <form id="checkin-form"><div class="modal-form">
        <label>RESTING HEART RATE · BPM<input name="heart" type="number" min="30" max="220" value="${state.metrics.heart}" required></label>
        <label>SLEEP DURATION · HOURS<input name="sleep" type="number" min="0" max="24" step=".1" value="${state.metrics.sleep}" required></label>
        <label>EXERCISE · MINUTES TODAY<input name="exercise" type="number" min="0" max="600" value="${state.metrics.exercise}" required></label>
        <label>FATIGUE · 1–10<input name="fatigue" type="number" min="1" max="10" value="${state.metrics.fatigue}" required></label>
        <label>MOOD<select name="mood"><option ${state.metrics.mood === 'Low' ? 'selected' : ''}>Low</option><option ${state.metrics.mood === 'Okay' ? 'selected' : ''}>Okay</option><option ${state.metrics.mood === 'Good' ? 'selected' : ''}>Good</option><option ${state.metrics.mood === 'Great' ? 'selected' : ''}>Great</option></select></label>
        <label>RADIATION · SIMULATED mSv<input name="radiation" type="number" min="0" max="1000" step=".1" value="${state.metrics.radiation}" required></label>
      </div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE CHECK-IN</button></div></form>`);
    renderRufus();
  }

  function openActivity() {
    openModal(`<div class="eyebrow"><span class="eyebrow-line"></span> PHYSICAL WELLNESS · ACTIVITY LOG</div><h2 id="modal-title">Log an activity</h2><p>Record a completed mission-approved exercise or mobility activity. Follow your crew medical officer’s exercise plan.</p><form id="activity-form"><div class="modal-form"><label>ACTIVITY TYPE<select name="type"><option>Resistance exercise</option><option>Cardio session</option><option>Mobility / stretch</option><option>Other approved activity</option></select></label><label>DURATION · MINUTES<input name="minutes" type="number" min="1" max="300" value="18" required></label></div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">CANCEL</button><button type="submit" class="primary-button">SAVE ACTIVITY</button></div></form>`);
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
      message += ` · Daily objective +${mission.reward} XP`;
    }
    const newBadges = unlockEligibleAchievements();
    if (newBadges.length) message += ` · ${newBadges.join(', ')} insignia earned`;
    persist();
    renderXp();
    renderMissions();
    renderOverview();
    $('#cog-sessions').innerHTML = `${state.cognitiveSessions} <small>sessions</small>`;
    $('#game-start').disabled = false;
    showToast(message);
  }

  function saveJournal(mood, fatigue, note) {
    const entry = { date: today, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mood, fatigue, note: note.trim() };
    state.checkinHistory.unshift(entry);
    state.checkinHistory = state.checkinHistory.slice(0, 20);
    state.metrics.mood = mood;
    state.metrics.fatigue = fatigue;
    persist();
    renderOverview();
    renderHealth();
    renderJournalHistory();
    $('#journal-feedback').textContent = 'Your check-in has been saved on this device.';
    showToast('Wellbeing check-in saved locally');
  }

  function renderJournalHistory() {
    const target = $('#journal-history');
    if (!target) return;
    if (!state.checkinHistory.length) {
      target.innerHTML = `<div class="journal-entry journal-empty">${rufusImage('study', 'journal-empty-art')}<div><strong>No saved reflections yet</strong><small>YOUR DEVICE</small><p>Rufus is ready when you are. Save a wellbeing check-in to begin your personal log.</p></div></div>`;
      return;
    }
    target.innerHTML = state.checkinHistory.slice(0, 5).map((entry) => `<article class="journal-entry"><span>${entry.mood === 'Great' ? '✦' : entry.mood === 'Good' ? '☀' : entry.mood === 'Okay' ? '◒' : '☁'}</span><div><strong>${escapeHtml(entry.mood)} · Fatigue ${escapeHtml(entry.fatigue)}/10</strong><small>${escapeHtml(entry.date)} · ${escapeHtml(entry.time)}</small>${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}</div></article>`).join('');
  }

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      event.preventDefault();
      const view = nav.dataset.nav;
      closeModal();
      setNav(view);
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'profile') openProfile();
    if (action === 'checkin') openCheckin();
    if (action === 'alerts') openAlerts();
    if (action === 'rufus-cheer') cheerRufus();
    if (action === 'customize-rufus') openRufusCustomizer();
    if (action === 'close-modal') closeModal();
    if (action === 'dismiss-notice') event.target.closest('.notice-strip').remove();

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
      preview.src = art.src;
      preview.alt = art.description;
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
    if (missionAction === 'game') {
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
    if (event.target.id === 'profile-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const next = {
        name: String(form.get('name')).trim(),
        role: String(form.get('role')).trim() || 'Flight Specialist',
        heartMin: Number(form.get('heartMin')),
        heartMax: Number(form.get('heartMax')),
        sleepMin: Number(form.get('sleepMin')),
        sleepMax: Number(form.get('sleepMax')),
        radiationReviewAt: Number(form.get('radiationReviewAt'))
      };
      if (!next.name || next.heartMin >= next.heartMax || next.sleepMin >= next.sleepMax) {
        showToast('Enter a name and valid minimum / maximum ranges.');
        return;
      }
      state.profile = next;
      persist();
      closeModal();
      renderOverview();
      renderHealth();
      showToast('Crew profile updated');
    }
    if (event.target.id === 'checkin-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      if (state.checkinDate !== today) {
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const previousDate = yesterday.toISOString().slice(0, 10);
        state.streak = state.lastCheckinDate === previousDate ? state.streak + 1 : 1;
      }
      state.metrics.heart = Number(form.get('heart'));
      state.metrics.sleep = Number(form.get('sleep'));
      state.metrics.exercise = Number(form.get('exercise'));
      state.metrics.fatigue = Number(form.get('fatigue'));
      state.metrics.mood = String(form.get('mood'));
      state.metrics.radiation = Number(form.get('radiation'));
      state.heartHistory.push(state.metrics.heart);
      state.sleepHistory.push(state.metrics.sleep);
      state.heartHistory = state.heartHistory.slice(-30);
      state.sleepHistory = state.sleepHistory.slice(-30);
      state.lastCheckin = `TODAY, ${new Date().toLocaleTimeString([], { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} UTC`;
      state.checkinDate = today;
      state.lastCheckinDate = today;
      closeModal();
      persist();
      completeMission('checkin');
      renderOverview();
      renderHealth();
      showToast('Health check-in saved · simulated data only');
    }
    if (event.target.id === 'activity-form') {
      event.preventDefault();
      const form = new FormData(event.target);
      const duration = Number(form.get('minutes'));
      state.metrics.exercise += duration;
      closeModal();
      persist();
      completeMission('move');
      renderOverview();
      renderHealth();
      showToast(`${escapeHtml(form.get('type'))} logged · ${duration} min`);
    }
    if (event.target.id === 'wellness-form') {
      event.preventDefault();
      const mood = new FormData(event.target).get('mood');
      saveJournal(String(mood), Number($('#energy-slider').value), $('#journal-note').value);
      event.target.reset();
      $('#energy-slider').value = state.metrics.fatigue;
      $('#fatigue-value').textContent = $('#energy-slider').value;
    }
    if (event.target.id === 'rufus-form') {
      event.preventDefault();
      const pose = String(new FormData(event.target).get('pose'));
      if (!Object.hasOwn(rufusArtwork, pose)) {
        showToast('Choose a valid look for Rufus.');
        return;
      }
      state.rufus.pose = pose;
      persist();
      closeModal();
      renderRufus();
      showToast('Rufus’s new look is saved on this device.');
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'energy-slider') $('#fatigue-value').textContent = event.target.value;
  });
  $('#modal-backdrop').addEventListener('click', (event) => {
    if (event.target.id === 'modal-backdrop') closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  resetDailyProgressIfNeeded();
  updateClock();
  setInterval(updateClock, 1000);
  renderOverview();
  renderHealth();
  renderMissions();
  renderJournalHistory();
  $('#cog-sessions').innerHTML = `${state.cognitiveSessions} <small>sessions</small>`;
  $('#cog-best').innerHTML = `${state.bestReaction} <small>ms</small>`;
  $('#energy-slider').value = state.metrics.fatigue;
  $('#fatigue-value').textContent = state.metrics.fatigue;

  let installPrompt = null;
  const installButton = $('#install-button');
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    showToast('AstroVital is installed on this device.');
  });
  installButton.addEventListener('click', async () => {
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) {
      showToast('AstroVital is already installed on this device.');
      return;
    }

    if (!installPrompt) {
      const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isAppleMobile) {
        openModal('<div class="eyebrow"><span class="eyebrow-line"></span> INSTALL ASTROVITAL</div><h2 id="modal-title">Add to your Home Screen</h2><p>In Safari, tap the Share button, then choose <strong>Add to Home Screen</strong>. AstroVital runs as a standalone app and keeps your entries on this device.</p><div class="modal-actions"><button class="primary-button" data-action="close-modal">GOT IT</button></div>');
      } else {
        showToast('Open your browser menu and choose Install AstroVital or Add to Home Screen.');
      }
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
