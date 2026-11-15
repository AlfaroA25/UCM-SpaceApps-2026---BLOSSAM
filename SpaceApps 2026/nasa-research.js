((root) => {
  const EDA_API = 'https://visualization.osdr.nasa.gov/eda/api/';
  const OSDR_API = 'https://visualization.osdr.nasa.gov/biodata/api/v2/';
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  const REQUEST_TIMEOUT_MS = 20000;
  const cache = new Map();
  const inFlight = new Map();

  function numberOrNull(value) {
    if (value === null || value === undefined || value === '' || value === 'NA') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function aggregateMission(mission, telemetryRows, radiationRows) {
    if (!Array.isArray(telemetryRows) || !Array.isArray(radiationRows)) {
      throw new Error('NASA EDA returned an unexpected mission data format.');
    }
    const days = new Map();
    const getDay = (timestamp) => {
      if (typeof timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(timestamp)) return null;
      const date = timestamp.slice(0, 10);
      if (!days.has(date)) days.set(date, { date, totals: {}, counts: {}, radiation: {} });
      return days.get(date);
    };
    const telemetryFields = [
      ['temperature_iss', 'temperatureC'],
      ['humidity_iss', 'humidityPercent'],
      ['co2_iss', 'co2Ppm']
    ];
    telemetryRows.forEach((row) => {
      const day = getDay(row?.time);
      if (!day) return;
      telemetryFields.forEach(([source, target]) => {
        const value = numberOrNull(row[source]);
        if (value === null) return;
        day.totals[target] = (day.totals[target] || 0) + value;
        day.counts[target] = (day.counts[target] || 0) + 1;
      });
    });
    const radiationFields = [
      ['gcr', 'radiationGcr'],
      ['saa', 'radiationSaa'],
      ['total', 'radiationTotal']
    ];
    radiationRows.forEach((row) => {
      const day = getDay(row?.time);
      if (!day) return;
      radiationFields.forEach(([source, target]) => {
        const value = numberOrNull(row[source]);
        if (value !== null) day.radiation[target] = value;
      });
    });
    const observations = [...days.values()].sort((first, second) => first.date.localeCompare(second.date)).map((day) => {
      const result = { date: day.date };
      Object.entries(day.totals).forEach(([key, total]) => {
        result[key] = Math.round(total / day.counts[key] * 10000) / 10000;
      });
      Object.assign(result, day.radiation);
      return result;
    });
    if (!observations.length) throw new Error('NASA EDA returned no dated measurements for this mission.');
    return { ...mission, observations };
  }

  function validHumanStudy(study) {
    if (study?.organism !== 'Homo sapiens') return false;
    if (typeof study.spaceflightPhase !== 'string' || !study.spaceflightPhase.toLowerCase().includes('in-flight')) return false;
    const material = String(study.materialType || '').toLowerCase();
    return !['cell', 'tissue', 'mouse', 'rat', 'mice', 'animal'].some((term) => material.includes(term));
  }

  function requestJson(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    return fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(async (response) => {
        let payload;
        try {
          payload = await response.json();
        } catch {
          throw new Error('NASA returned a response that was not valid JSON.');
        }
        if (!response.ok) {
          throw new Error(`NASA data request failed (HTTP ${response.status}).`);
        }
        return payload;
      })
      .catch((error) => {
        if (error?.name === 'AbortError') throw new Error('NASA data request timed out.');
        if (error instanceof TypeError) throw new Error('NASA data could not be reached from this browser. The static app may be blocked by cross-origin policy.');
        throw error;
      })
      .finally(() => clearTimeout(timeout));
  }

  function requestNasaApiJson(url) {
    const appOrigin = root.location?.origin;
    if (appOrigin && new URL(url, root.location.href).origin !== appOrigin) {
      throw new Error('NASA’s API does not permit cross-origin reads from this static app. Using the bundled NASA snapshot instead.');
    }
    return requestJson(url);
  }

  function cachedRequest(key, load) {
    const saved = cache.get(key);
    if (saved && Date.now() - saved.at < CACHE_TTL_MS) return Promise.resolve(saved.value);
    if (inFlight.has(key)) return inFlight.get(key);
    const promise = load().then((value) => {
      cache.set(key, { value, at: Date.now() });
      return value;
    }).finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  }

  function loadArchive() {
    return cachedRequest('eda-archive', async () => {
      const archive = await requestJson('./data/nasa-eda-historical.json');
      if (!Array.isArray(archive?.missions) || !archive.missions.length) {
        throw new Error('The bundled NASA EDA archive is missing or invalid.');
      }
      return archive;
    });
  }

  async function loadMission(missionId) {
    const archivePromise = loadArchive();
    try {
      const safeId = /^[A-Z0-9-]+$/.test(missionId) ? missionId : '';
      if (!safeId) throw new Error('Choose a valid NASA EDA mission.');
      const liveMission = await cachedRequest(`eda-live:${safeId}`, async () => {
        const [missionInfo, telemetry, radiation] = await Promise.all([
          requestNasaApiJson(`${EDA_API}missions/${encodeURIComponent(safeId)}/`),
          requestNasaApiJson(`${EDA_API}missions/${encodeURIComponent(safeId)}/telemetry_data/`),
          requestNasaApiJson(`${EDA_API}missions/${encodeURIComponent(safeId)}/radiation_data/`)
        ]);
        const archive = await archivePromise;
        const fallbackMission = archive.missions.find((item) => item.id === safeId);
        const mission = {
          ...(fallbackMission || {}),
          id: safeId,
          title: missionInfo?.title || fallbackMission?.title || safeId,
          description: missionInfo?.description || fallbackMission?.description || '',
          link: missionInfo?.link || fallbackMission?.link || 'https://visualization.osdr.nasa.gov/eda/'
        };
        return aggregateMission(mission, telemetry, radiation);
      });
      const [archive] = await Promise.all([archivePromise]);
      return {
        mission: liveMission,
        sourceMode: 'live',
        notice: 'Loaded directly from NASA EDA’s documented mission API.'
      };
    } catch (error) {
      const archive = await archivePromise;
      const mission = archive.missions.find((item) => item.id === missionId);
      if (!mission) throw error;
      return {
        mission,
        archive,
        sourceMode: 'archive',
        notice: `NASA’s live API was unavailable from this browser (${error.message}). Showing the verified, NASA-sourced offline daily archive.`
      };
    }
  }

  async function loadHumanStudies() {
    return cachedRequest('osdr-human-inflight', async () => {
      const params = new URLSearchParams();
      params.set('study.characteristics.organism', 'Homo sapiens');
      params.set('study.factor value.spaceflight', 'in-flight|In-flight');
      params.set('format', 'json.records');
      const rows = await requestNasaApiJson(`${OSDR_API}query/datasets/?${params}`);
      if (!Array.isArray(rows)) throw new Error('NASA OSDR returned an unexpected dataset search format.');
      const candidateRows = rows.filter((row) => typeof row?.['id.accession'] === 'string'
        && /^[A-Z]+-\d+$/.test(row['id.accession'])
        && String(row['study.characteristics.organism'] || '').toLowerCase() === 'homo sapiens'
        && String(row['study.factor value.spaceflight'] || '').toLowerCase().includes('in-flight'));
      const studies = await Promise.all(candidateRows.map(async (row) => {
        const accession = row['id.accession'];
        const payload = await requestNasaApiJson(`${OSDR_API}dataset/${encodeURIComponent(accession)}/`);
        const metadata = payload?.[accession]?.metadata;
        if (!metadata || typeof metadata !== 'object') return null;
        const mission = metadata.mission && typeof metadata.mission === 'object' ? metadata.mission : {};
        const study = {
          accession,
          title: metadata['study title'] || accession,
          description: metadata['study description'] || '',
          organism: metadata.organism,
          materialType: metadata['material type'],
          spaceflightPhase: row['study.factor value.spaceflight'],
          mission: mission.name || '',
          missionStartDate: mission['start date'] || '',
          missionEndDate: mission['end date'] || '',
          assay: metadata['study assay measurement type'] || 'Not supplied',
          releaseTimestamp: metadata['study public release date'],
          apiUrl: `${OSDR_API}dataset/${accession}/`,
          repositoryUrl: `https://osdr.nasa.gov/bio/repo/data/studies/${accession}`
        };
        return validHumanStudy(study) ? study : null;
      }));
      return { studies: studies.filter(Boolean), sourceMode: 'live', notice: 'Search results retrieved from NASA OSDR’s documented API.' };
    });
  }

  async function loadStudyArchive() {
    return cachedRequest('osdr-human-archive', async () => {
      const archive = await requestJson('./data/nasa-human-spaceflight.json');
      if (!Array.isArray(archive?.studies)) throw new Error('The bundled NASA OSDR study archive is missing or invalid.');
      return {
        studies: archive.studies.filter(validHumanStudy),
        sourceMode: 'archive',
        notice: 'NASA OSDR’s API could not be reached from this browser. Showing verified human in-flight study metadata from the bundled NASA API snapshot.'
      };
    });
  }

  async function searchHumanStudies() {
    try {
      return await loadHumanStudies();
    } catch (error) {
      const archive = await loadStudyArchive();
      return { ...archive, warning: error.message };
    }
  }

  root.RufusNasaResearch = Object.freeze({
    aggregateMission,
    loadMission,
    searchHumanStudies,
    validHumanStudy
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.RufusNasaResearch;

  if (root.document) {
    const init = () => {
      const $ = (selector) => root.document.querySelector(selector);
      const missionSelect = $('#eda-mission');
      const compareSelect = $('#eda-compare-mission');
      const metricSelect = $('#eda-measurement');
      const startInput = $('#eda-start-date');
      const endInput = $('#eda-end-date');
      const status = $('#eda-status');
      const error = $('#eda-error');
      const chart = $('#eda-chart');
      const summary = $('#eda-summary');
      const sourceInfo = $('#eda-source-info');
      const studySearch = $('#osdr-search');
      const studyStatus = $('#osdr-status');
      const studyError = $('#osdr-error');
      const studyResults = $('#osdr-results');
      let activeMission = null;
      let activeComparison = null;
      let activeStudies = [];

      const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[character]);
      const metrics = {
        temperatureC: { label: 'ISS-side temperature', unit: '°C' },
        co2Ppm: { label: 'Carbon dioxide (CO₂)', unit: 'ppm' },
        humidityPercent: { label: 'Relative humidity', unit: '% RH' },
        radiationGcr: { label: 'Galactic cosmic ray dose', unit: 'mGy/day' },
        radiationSaa: { label: 'South Atlantic Anomaly dose', unit: 'mGy/day' },
        radiationTotal: { label: 'Total radiation dose', unit: 'mGy/day' }
      };
      const formatNumber = (value) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
      const formatDate = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));

      function selectedObservations(mission) {
        if (!mission) return [];
        return mission.observations.filter((item) => (!startInput.value || item.date >= startInput.value)
          && (!endInput.value || item.date <= endInput.value));
      }

      function renderSummary() {
        const metric = metrics[metricSelect.value];
        const missions = [activeMission, activeComparison].filter(Boolean);
        const entries = missions.map((mission) => {
          const point = selectedObservations(mission).slice().reverse().find((item) => Number.isFinite(item[metricSelect.value]));
          return `<article class="eda-summary-card"><small>${escapeHtml(mission.title)} · ${escapeHtml(metric.label)}</small><strong>${point ? `${formatNumber(point[metricSelect.value])} ${escapeHtml(metric.unit)}` : 'Unavailable'}</strong><span>${point ? `Latest available · ${escapeHtml(formatDate(point.date))}` : 'No measurement in selected range'}</span></article>`;
        });
        summary.innerHTML = entries.join('');
      }

      function renderChart() {
        const metric = metrics[metricSelect.value];
        const missions = [activeMission, activeComparison].filter(Boolean);
        const series = missions.map((mission) => ({
          mission,
          points: selectedObservations(mission).filter((item) => Number.isFinite(item[metricSelect.value]))
        })).filter((item) => item.points.length);
        if (!series.length) {
          chart.innerHTML = '<p class="eda-empty">No measurements are available for this metric and date range. Choose another period or measurement.</p>';
          renderSummary();
          return;
        }
        const dates = series.flatMap((item) => item.points.map((point) => point.date)).sort();
        const minDate = Date.parse(`${dates[0]}T00:00:00Z`);
        const maxDate = Date.parse(`${dates.at(-1)}T00:00:00Z`);
        const values = series.flatMap((item) => item.points.map((point) => point[metricSelect.value]));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valuePadding = minValue === maxValue ? Math.max(Math.abs(minValue) * 0.1, 1) : (maxValue - minValue) * 0.12;
        const low = minValue - valuePadding;
        const high = maxValue + valuePadding;
        const width = 900;
        const height = 300;
        const left = 68;
        const right = 22;
        const top = 26;
        const bottom = 42;
        const plotWidth = width - left - right;
        const plotHeight = height - top - bottom;
        const x = (date) => left + (maxDate === minDate ? plotWidth / 2 : (Date.parse(`${date}T00:00:00Z`) - minDate) / (maxDate - minDate) * plotWidth);
        const y = (value) => top + (high - value) / (high - low) * plotHeight;
        const colors = ['#5be3ed', '#f2bf72'];
        const grids = Array.from({ length: 5 }, (_, index) => {
          const value = high - (high - low) * index / 4;
          const yPosition = top + plotHeight * index / 4;
          return `<line x1="${left}" y1="${yPosition}" x2="${width - right}" y2="${yPosition}" class="eda-grid"/><text x="${left - 9}" y="${yPosition + 4}" text-anchor="end" class="eda-axis">${formatNumber(value)}</text>`;
        }).join('');
        const xLabels = [...new Set([dates[0], dates[Math.floor((dates.length - 1) / 2)], dates.at(-1)])].map((date, index, list) => {
          const anchor = index === 0 ? 'start' : index === list.length - 1 ? 'end' : 'middle';
          return `<text x="${x(date)}" y="${height - 12}" text-anchor="${anchor}" class="eda-axis">${escapeHtml(date)}</text>`;
        }).join('');
        const traces = series.map(({ mission, points }, index) => {
          const color = colors[index % colors.length];
          const segments = [];
          let segment = [];
          let previousDay = null;
          points.forEach((point) => {
            const day = Date.parse(`${point.date}T00:00:00Z`);
            if (previousDay !== null && day - previousDay > 36 * 60 * 60 * 1000) {
              if (segment.length > 1) segments.push(segment);
              segment = [];
            }
            segment.push(`${segment.length ? 'L' : 'M'}${x(point.date)},${y(point[metricSelect.value])}`);
            previousDay = day;
          });
          if (segment.length > 1) segments.push(segment);
          const paths = segments.map((commands) => `<path d="${commands.join(' ')}" fill="none" stroke="${color}" stroke-width="2.3"/>`).join('');
          const circles = points.map((point) => `<circle cx="${x(point.date)}" cy="${y(point[metricSelect.value])}" r="3" fill="${color}" class="eda-point"><title>${escapeHtml(mission.title)} · ${escapeHtml(point.date)} · ${formatNumber(point[metricSelect.value])} ${escapeHtml(metric.unit)}</title></circle>`).join('');
          return `${paths}${circles}`;
        }).join('');
        const legend = series.map(({ mission }, index) => `<span><i style="--eda-series-color:${colors[index % colors.length]}"></i>${escapeHtml(mission.title)}</span>`).join('');
        chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(metric.label)} in ${escapeHtml(metric.unit)} across historical NASA EDA mission dates">${grids}${traces}${xLabels}</svg><div class="eda-legend">${legend}</div><p class="eda-chart-note">X-axis shows source UTC dates; daily means are not exact sensor timestamps. Separate missions are not synchronized, and missing dates are not interpolated.</p>`;
        renderSummary();
      }

      function renderSourceInfo(result) {
        const mission = activeMission;
        const range = mission.range || {};
        const description = mission.description ? `<p>${escapeHtml(mission.description)}</p>` : '';
        const apiLabel = result.sourceMode === 'live' ? 'Live NASA EDA API response' : 'Archived NASA EDA API response';
        sourceInfo.innerHTML = `<div class="eda-source-meta"><div><small>MISSION / DATASET</small><strong>${escapeHtml(mission.title)} (${escapeHtml(mission.id)})</strong></div><div><small>SOURCE DATE RANGE</small><strong>${escapeHtml(range.start || 'Not supplied')} – ${escapeHtml(range.end || 'Not supplied')}</strong></div><div><small>DATA CLASS</small><strong>Historical · ISS mission telemetry</strong></div><div><small>RETRIEVAL MODE</small><strong>${escapeHtml(apiLabel)}</strong></div></div>${description}<p>Temperature: °C · CO₂: ppm · relative humidity: % RH · radiation dose: mGy/day. Temperature, humidity, and CO₂ are reported for the ISS-side mission hardware, not as individual astronaut measurements or a general spacecraft cabin reading. Telemetry trends are daily arithmetic means from valid ISS-side NASA EDA samples; radiation values are shown as reported by EDA.</p><p><a href="${escapeHtml(mission.link || 'https://visualization.osdr.nasa.gov/eda/')}" target="_blank" rel="noopener noreferrer">NASA mission / associated dataset ↗</a> · <a href="${escapeHtml(mission.telemetryApi || `${EDA_API}missions/${encodeURIComponent(mission.id)}/telemetry_data/`)}" target="_blank" rel="noopener noreferrer">NASA EDA telemetry API ↗</a> · <a href="${escapeHtml(mission.radiationApi || `${EDA_API}missions/${encodeURIComponent(mission.id)}/radiation_data/`)}" target="_blank" rel="noopener noreferrer">NASA EDA radiation API ↗</a> · <a href="https://visualization.osdr.nasa.gov/eda/api_reference" target="_blank" rel="noopener noreferrer">NASA EDA API documentation ↗</a></p><p>${escapeHtml(result.archive?.retrievedAt ? `Archived snapshot retrieved ${result.archive.retrievedAt}.` : 'Data source: NASA Environmental Data Application (EDA).')}</p>`;
      }

      function renderResearchResults(query = '') {
        const normalized = query.trim().toLocaleLowerCase();
        const shown = activeStudies.filter((study) => `${study.title} ${study.description} ${study.accession} ${study.materialType}`.toLocaleLowerCase().includes(normalized));
        if (!shown.length) {
          studyResults.innerHTML = '<p class="eda-empty">No NASA human in-flight studies match this search. Try another term.</p>';
          return;
        }
        studyResults.innerHTML = shown.map((study) => {
          const missionRange = study.missionStartDate || study.missionEndDate
            ? `${study.missionStartDate || 'Not supplied'} – ${study.missionEndDate || 'Not supplied'}`
            : 'Mission date range not supplied by OSDR';
          const releaseDate = Number.isFinite(study.releaseTimestamp)
            ? formatDate(new Date(study.releaseTimestamp * 1000).toISOString().slice(0, 10))
            : 'Not supplied';
          return `<article class="osdr-study-card"><div class="osdr-study-heading"><span class="sim-tag">HUMAN · IN-FLIGHT · NASA OSDR</span><strong>${escapeHtml(study.accession)}</strong></div><h3>${escapeHtml(study.title)}</h3><div class="osdr-study-meta"><span>Organism <strong>${escapeHtml(study.organism)}</strong></span><span>Sample material <strong>${escapeHtml(study.materialType || 'Not supplied')}</strong></span><span>Assay <strong>${escapeHtml(Array.isArray(study.assay) ? study.assay.join(', ') : study.assay)}</strong></span><span>Mission dates <strong>${escapeHtml(missionRange)}</strong></span><span>OSDR release date <strong>${escapeHtml(releaseDate)}</strong></span></div><p class="osdr-study-description">${escapeHtml(study.description || 'NASA OSDR does not supply an abstract for this study.')}</p><p class="osdr-study-links"><a href="${escapeHtml(study.repositoryUrl || `https://osdr.nasa.gov/bio/repo/data/studies/${encodeURIComponent(study.accession)}`)}" target="_blank" rel="noopener noreferrer">Open study in NASA OSDR ↗</a> · <a href="${escapeHtml(study.apiUrl || `${OSDR_API}dataset/${encodeURIComponent(study.accession)}/`)}" target="_blank" rel="noopener noreferrer">Dataset metadata API ↗</a></p></article>`;
        }).join('');
      }

      async function loadMissionData() {
        const missionId = missionSelect.value;
        const button = $('#eda-load-button');
        button.disabled = true;
        error.hidden = true;
        status.textContent = `Loading historical ${missionId} telemetry and radiation data from NASA EDA…`;
        try {
          const result = await loadMission(missionId);
          activeMission = result.mission;
          const compareMissionId = compareSelect.value;
          activeComparison = compareMissionId && compareMissionId !== missionId
            ? (await loadMission(compareMissionId)).mission
            : null;
          const allDates = [activeMission, activeComparison].filter(Boolean)
            .flatMap((mission) => mission.observations.map((item) => item.date)).sort();
          if (allDates.length) {
            startInput.min = allDates[0];
            endInput.min = allDates[0];
            startInput.max = allDates.at(-1);
            endInput.max = allDates.at(-1);
          }
          renderChart();
          renderSourceInfo(result);
          status.textContent = result.notice;
          if (activeComparison) status.textContent += ` Comparison: ${activeComparison.title}.`;
        } catch (loadError) {
          activeMission = null;
          activeComparison = null;
          chart.innerHTML = '';
          summary.innerHTML = '';
          error.textContent = loadError.message || 'NASA EDA data could not be loaded.';
          error.hidden = false;
          status.textContent = 'NASA data unavailable. No measurements were substituted.';
        } finally {
          button.disabled = false;
        }
      }

      async function loadStudies() {
        const button = $('#osdr-load-button');
        button.disabled = true;
        studyError.hidden = true;
        studyStatus.textContent = 'Searching NASA OSDR for human in-flight datasets…';
        try {
          const result = await searchHumanStudies();
          activeStudies = result.studies;
          renderResearchResults(studySearch.value);
          studyStatus.textContent = result.notice;
          if (result.warning) studyStatus.textContent += ` Live search limitation: ${result.warning}`;
          if (!activeStudies.length) studyStatus.textContent = 'NASA OSDR returned no human in-flight studies matching the documented filters.';
        } catch (loadError) {
          studyResults.innerHTML = '';
          studyError.textContent = loadError.message || 'NASA OSDR could not be searched and its local archive is unavailable.';
          studyError.hidden = false;
          studyStatus.textContent = 'Research records unavailable. No datasets were substituted.';
        } finally {
          button.disabled = false;
        }
      }

      if (missionSelect) {
        $('#eda-load-button').addEventListener('click', loadMissionData);
        compareSelect.addEventListener('change', () => {
          if (activeMission) loadMissionData();
        });
        metricSelect.addEventListener('change', renderChart);
        startInput.addEventListener('change', renderChart);
        endInput.addEventListener('change', renderChart);
        $('#eda-reset-range').addEventListener('click', () => {
          startInput.value = '';
          endInput.value = '';
          renderChart();
        });
      }
      if ($('#osdr-load-button')) {
        $('#osdr-load-button').addEventListener('click', loadStudies);
        studySearch.addEventListener('input', () => renderResearchResults(studySearch.value));
      }
    };
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
