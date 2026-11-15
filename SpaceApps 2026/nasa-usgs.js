(() => {
  const GIBS_WMS = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
  const WATER_API = 'https://api.waterdata.usgs.gov/ogcapi/v1';
  const QUAKE_FEEDS = {
    hour: 'all_hour',
    day: 'all_day',
    week: 'all_week'
  };
  const LANDSAT_SEARCH = 'https://landsatlook.usgs.gov/stac-server/search';
  const requestCache = new Map();

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (quoted && character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (!quoted && character === ',') {
        row.push(field);
        field = '';
      } else if (!quoted && (character === '\n' || character === '\r')) {
        if (character === '\r' && text[index + 1] === '\n') index += 1;
        row.push(field);
        if (row.some((cell) => cell !== '')) rows.push(row);
        row = [];
        field = '';
      } else {
        field += character;
      }
    }
    if (field || row.length) {
      row.push(field);
      if (row.some((cell) => cell !== '')) rows.push(row);
    }
    if (!rows.length) return [];
    const headers = rows.shift();
    return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])));
  }

  function buildLandsatSearchUrl({ latitude, longitude, start, end }) {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new Error('Latitude must be between −90 and 90 degrees.');
    if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new Error('Longitude must be between −180 and 180 degrees.');
    const isValidDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const date = new Date(`${value}T00:00:00Z`);
      return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
    };
    if (!isValidDate(start) || !isValidDate(end) || start > end) {
      throw new Error('Choose a valid date range with the start on or before the end.');
    }
    const halfWidth = 0.2;
    const bbox = [
      Math.max(-180, lon - halfWidth),
      Math.max(-90, lat - halfWidth),
      Math.min(180, lon + halfWidth),
      Math.min(90, lat + halfWidth)
    ].map((coordinate) => Number(coordinate.toFixed(4)));
    const query = new URLSearchParams({
      collections: 'landsat-c2l2-sr',
      bbox: bbox.join(','),
      datetime: `${start}T00:00:00Z/${end}T23:59:59Z`,
      limit: '10'
    });
    return `${LANDSAT_SEARCH}?${query}`;
  }

  const api = { parseCsv, buildLandsatSearchUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window === 'undefined' || !window.document) return;

  const $ = (selector) => document.querySelector(selector);
  const safeLandsatUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'landsatlook.usgs.gov'
        ? url.href
        : '';
    } catch {
      return '';
    }
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const formatNumber = (value, digits = 2) => Number.isFinite(Number(value))
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(Number(value))
    : 'Not reported';
  const formatDateTime = (value) => {
    const date = new Date(value);
    return Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(date) + ' UTC'
      : 'Time not supplied';
  };

  async function fetchJson(url, ttlMs = 5 * 60 * 1000) {
    const cached = requestCache.get(url);
    if (cached && Date.now() - cached.at < ttlMs) return cached.value;
    const response = await fetch(url, { headers: { Accept: 'application/geo+json, application/json' } });
    if (!response.ok) throw new Error(`The source returned HTTP ${response.status}.`);
    const value = await response.json();
    requestCache.set(url, { at: Date.now(), value });
    return value;
  }

  function setStatus(id, message) {
    const element = $(`#${id}`);
    if (element) element.textContent = message;
  }

  function setError(id, message = '') {
    const element = $(`#${id}`);
    if (!element) return;
    element.textContent = message;
    element.hidden = !message;
  }

  function configureWorldview() {
    const form = $('#worldview-form');
    const dateInput = $('#worldview-date');
    const image = $('#worldview-image');
    const empty = $('#worldview-empty');
    if (!form || !dateInput || !image || !empty) return;
    const latestCandidate = new Date();
    latestCandidate.setUTCDate(latestCandidate.getUTCDate() - 1);
    dateInput.max = new Date().toISOString().slice(0, 10);
    dateInput.value = latestCandidate.toISOString().slice(0, 10);
    image.addEventListener('load', () => {
      image.hidden = false;
      empty.hidden = true;
      setError('worldview-error');
      setStatus('worldview-status', `NASA GIBS imagery loaded for ${dateInput.value}. Source layer: ${$('#worldview-layer').selectedOptions[0].textContent}.`);
    });
    image.addEventListener('error', () => {
      image.hidden = true;
      empty.hidden = false;
      setError('worldview-error', 'NASA GIBS did not return an image for this layer and date. Choose another date or layer.');
      setStatus('worldview-status', 'Imagery unavailable for the selected date.');
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const date = dateInput.value;
      if (!date) {
        setError('worldview-error', 'Choose an image date.');
        return;
      }
      setError('worldview-error');
      empty.hidden = false;
      image.hidden = true;
      setStatus('worldview-status', 'Loading the selected image from NASA GIBS…');
      const query = new URLSearchParams({
        SERVICE: 'WMS',
        VERSION: '1.1.1',
        REQUEST: 'GetMap',
        LAYERS: $('#worldview-layer').value,
        STYLES: '',
        SRS: 'EPSG:4326',
        BBOX: '-180,-90,180,90',
        WIDTH: '960',
        HEIGHT: '480',
        FORMAT: 'image/jpeg',
        TIME: date
      });
      image.src = `${GIBS_WMS}?${query}`;
    });
    form.requestSubmit();
  }

  function renderEarthquakes(features, minMagnitude) {
    const results = $('#earthquake-results');
    const matching = features
      .filter((feature) => Number.isFinite(feature.properties?.mag) && feature.properties.mag >= minMagnitude)
      .sort((first, second) => second.properties.time - first.properties.time)
      .slice(0, 12);
    if (!matching.length) {
      results.innerHTML = '<p class="source-empty">No events match this magnitude filter in the selected time window.</p>';
      return 0;
    }
    results.innerHTML = matching.map((feature) => {
      const properties = feature.properties;
      const coordinates = feature.geometry?.coordinates || [];
      const eventUrl = /^https:\/\/earthquake\.usgs\.gov\//.test(properties.url || '') ? properties.url : 'https://earthquake.usgs.gov/earthquakes/feed/';
      return `<article class="source-result-card"><div><strong>M ${formatNumber(properties.mag, 1)}</strong><span>${escapeHtml(properties.place || 'Location not reported')}</span></div><small>${escapeHtml(formatDateTime(properties.time))} · Depth ${formatNumber(coordinates[2], 1)} km</small><a href="${escapeHtml(eventUrl)}" target="_blank" rel="noopener noreferrer">USGS event details ↗</a></article>`;
    }).join('');
    return matching.length;
  }

  function configureEarthquakes() {
    const form = $('#earthquake-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const range = $('#earthquake-range').value;
      button.disabled = true;
      setError('earthquake-error');
      setStatus('earthquake-status', 'Loading the USGS GeoJSON feed…');
      try {
        const feed = QUAKE_FEEDS[range];
        const payload = await fetchJson(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`, 60 * 1000);
        if (!Array.isArray(payload.features)) throw new Error('The USGS feed did not contain an event list.');
        const count = renderEarthquakes(payload.features, Number($('#earthquake-min-mag').value));
        setStatus('earthquake-status', `USGS ${payload.metadata?.title || 'earthquake feed'} · ${count} matching event${count === 1 ? '' : 's'} shown from ${payload.metadata?.count ?? payload.features.length} reported.`);
      } catch (error) {
        $('#earthquake-results').innerHTML = '';
        setError('earthquake-error', error.message || 'The USGS earthquake feed could not be loaded.');
        setStatus('earthquake-status', 'USGS earthquake data unavailable. No events were substituted.');
      } finally {
        button.disabled = false;
      }
    });
    $('#earthquake-min-mag').addEventListener('change', () => form.requestSubmit());
    form.requestSubmit();
  }

  function haversineKm(firstLat, firstLon, secondLat, secondLon) {
    const radians = (value) => value * Math.PI / 180;
    const deltaLat = radians(secondLat - firstLat);
    const deltaLon = radians(secondLon - firstLon);
    const arc = Math.sin(deltaLat / 2) ** 2
      + Math.cos(radians(firstLat)) * Math.cos(radians(secondLat)) * Math.sin(deltaLon / 2) ** 2;
    const boundedArc = Math.min(1, Math.max(0, arc));
    return 6371 * 2 * Math.atan2(Math.sqrt(boundedArc), Math.sqrt(1 - boundedArc));
  }

  function waterSearchUrl(latitude, longitude) {
    const radius = 0.5;
    const bbox = [
      Math.max(-180, longitude - radius),
      Math.max(-90, latitude - radius),
      Math.min(180, longitude + radius),
      Math.min(90, latitude + radius)
    ].map((coordinate) => Number(coordinate.toFixed(4)));
    const query = new URLSearchParams({ bbox: bbox.join(','), f: 'json', limit: '100' });
    return `${WATER_API}/collections/monitoring-locations/items?${query}`;
  }

  function renderWaterLocations(features, latitude, longitude) {
    const results = $('#usgs-water-results');
    const nearby = features
      .filter((feature) => feature.geometry?.type === 'Point'
        && Array.isArray(feature.geometry.coordinates)
        && !/\btest\b/i.test(String(feature.properties?.monitoring_location_name || '')))
      .map((feature) => {
        const [siteLon, siteLat] = feature.geometry.coordinates;
        return { feature, distance: haversineKm(latitude, longitude, siteLat, siteLon) };
      })
      .sort((first, second) => first.distance - second.distance)
      .slice(0, 8);
    if (!nearby.length) {
      results.innerHTML = '<p class="source-empty">No geolocated USGS monitoring sites were returned near this coordinate.</p>';
      return 0;
    }
    results.innerHTML = nearby.map(({ feature, distance }) => {
      const properties = feature.properties || {};
      const number = String(properties.monitoring_location_number || '');
      const safeNumber = /^\w[\w.-]{0,40}$/.test(number) ? number : '';
      const [siteLon, siteLat] = feature.geometry.coordinates;
      return `<article class="source-result-card"><div><strong>${escapeHtml(properties.monitoring_location_name || 'USGS monitoring site')}</strong><span>${escapeHtml(properties.site_type || 'Site type not supplied')} · ${formatNumber(distance, 1)} km away</span></div><small>${escapeHtml(properties.state_name || properties.country_name || 'Location not supplied')} · ${escapeHtml(safeNumber || 'Station number not supplied')} · ${formatNumber(siteLat, 4)}, ${formatNumber(siteLon, 4)}</small>${safeNumber ? `<button type="button" class="secondary-button" data-usgs-station="${escapeHtml(safeNumber)}">VIEW LATEST REPORTED VALUES</button>` : ''}</article>`;
    }).join('');
    return nearby.length;
  }

  function configureWater() {
    const form = $('#usgs-water-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const latitude = Number($('#usgs-water-lat').value);
      const longitude = Number($('#usgs-water-lon').value);
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      $('#usgs-water-results').innerHTML = '';
      $('#usgs-water-measurements').innerHTML = '';
      setError('usgs-water-error');
      setStatus('usgs-water-status', 'Searching the USGS Water Data OGC API for monitoring locations…');
      try {
        const data = await fetchJson(waterSearchUrl(latitude, longitude));
        if (!Array.isArray(data.features)) throw new Error('USGS Water Data returned an incomplete monitoring-location response.');
        const count = renderWaterLocations(data.features, latitude, longitude);
        setStatus('usgs-water-status', `${count} nearby geolocated monitoring site${count === 1 ? '' : 's'} shown from the USGS Water Data API. Select a site to inspect its latest available continuous records.`);
      } catch (error) {
        setError('usgs-water-error', error.message || 'USGS monitoring locations could not be loaded.');
        setStatus('usgs-water-status', 'USGS water data unavailable. No locations or measurements were substituted.');
      } finally {
        button.disabled = false;
      }
    });
    $('#usgs-water-results').addEventListener('click', async (event) => {
      const button = event.target.closest('[data-usgs-station]');
      if (!button) return;
      const station = button.dataset.usgsStation;
      const query = new URLSearchParams({ monitoring_location_number: station, f: 'json', limit: '10' });
      const results = $('#usgs-water-measurements');
      results.innerHTML = '<p class="source-status">Loading the latest continuous records for this station…</p>';
      try {
        const data = await fetchJson(`${WATER_API}/collections/latest-continuous/items?${query}`);
        const records = (data.features || []).map((feature) => feature.properties || {}).filter((item) => item.time !== undefined);
        if (!records.length) {
          const stationUrl = `https://waterdata.usgs.gov/monitoring-location/USGS-${encodeURIComponent(station)}/`;
          results.innerHTML = `<p class="source-empty">No latest-continuous observations are currently available for this station. <a href="${escapeHtml(stationUrl)}" target="_blank" rel="noopener noreferrer">Open the official USGS station page ↗</a></p>`;
          return;
        }
        results.innerHTML = `<h4>USGS reported observations · ${escapeHtml(station)}</h4>${records.map((record) => `<article class="source-result-card"><div><strong>${formatNumber(record.value, 3)} ${escapeHtml(record.unit_of_measure || 'unit not supplied')}</strong><span>Parameter ${escapeHtml(record.parameter_code || 'not supplied')} · Statistic ${escapeHtml(record.statistic_id || 'not supplied')}</span></div><small>Observation time: ${escapeHtml(formatDateTime(record.time))} · ${escapeHtml(record.approval_status || 'Approval status not supplied')}</small></article>`).join('')}<p class="source-attribution">The record date can be historical; values are not represented as current conditions.</p>`;
      } catch (error) {
        results.innerHTML = `<p class="source-error">${escapeHtml(error.message || 'USGS measurements could not be loaded.')}</p>`;
      }
    });
    form.requestSubmit();
  }

  function configureLandsat() {
    const form = $('#landsat-form');
    if (!form) return;
    const start = $('#landsat-start');
    const end = $('#landsat-end');
    const today = new Date();
    end.value = today.toISOString().slice(0, 10);
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - 30);
    start.value = startDate.toISOString().slice(0, 10);
    start.max = end.value;
    end.max = end.value;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const results = $('#landsat-results');
      const button = form.querySelector('button[type="submit"]');
      let searchUrl;
      try {
        searchUrl = buildLandsatSearchUrl({
          latitude: $('#landsat-lat').value,
          longitude: $('#landsat-lon').value,
          start: start.value,
          end: end.value
        });
      } catch (error) {
        setError('landsat-error', error.message);
        return;
      }
      button.disabled = true;
      setError('landsat-error');
      results.innerHTML = `<a class="source-search-link" href="${escapeHtml(searchUrl)}" target="_blank" rel="noopener noreferrer">Open this parameterized search on the official USGS STAC API ↗</a>`;
      setStatus('landsat-status', 'Searching USGS LandsatLook for surface-reflectance scenes…');
      try {
        const data = await fetchJson(searchUrl, 10 * 60 * 1000);
        const scenes = data.features || [];
        if (!scenes.length) {
          setStatus('landsat-status', 'The USGS STAC query returned no scenes for this location and date range.');
          results.innerHTML += '<p class="source-empty">No Landsat Collection 2 scenes matched this query. Try a wider date range.</p>';
          return;
        }
        results.innerHTML += scenes.slice(0, 5).map((scene) => {
          const date = scene.properties?.datetime || 'Date not supplied';
          const thumbnailHref = scene.assets?.thumbnail?.href || scene.assets?.reduced_resolution_browse?.href;
          const thumbnail = safeLandsatUrl(thumbnailHref);
          const safeHref = safeLandsatUrl((scene.links || []).find((link) => link.rel === 'self')?.href)
            || 'https://landsatlook.usgs.gov/stac-server/';
          return `<article class="source-result-card landsat-result-card">${thumbnail ? `<img src="${escapeHtml(thumbnail)}" alt="USGS Landsat scene thumbnail for ${escapeHtml(scene.id)}" loading="lazy">` : ''}<div><strong>${escapeHtml(scene.id || 'Landsat scene')}</strong><span>${escapeHtml(scene.properties?.platform || 'Platform not supplied')} · ${escapeHtml(formatDateTime(date))}</span></div><a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">USGS scene metadata ↗</a></article>`;
        }).join('');
        setStatus('landsat-status', `${scenes.length} USGS Landsat Collection 2 scene${scenes.length === 1 ? '' : 's'} returned${data.numberMatched > scenes.length ? ` (${data.numberMatched} total match)` : ''}.`);
      } catch (error) {
        setStatus('landsat-status', 'The USGS catalog could not be read directly from this browser.');
        setError('landsat-error', `${error.message || 'Cross-origin access is unavailable.'} Use the official USGS search link below to open this exact query; no scene metadata was substituted.`);
      } finally {
        button.disabled = false;
      }
    });
  }

  function configureFirms() {
    const form = $('#firms-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const mapKeyInput = $('#firms-map-key');
      const mapKey = mapKeyInput.value.trim();
      const country = $('#firms-country').value.trim().toUpperCase();
      const source = $('#firms-source').value;
      const days = Number($('#firms-days').value);
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      $('#firms-results').innerHTML = '';
      setError('firms-error');
      setStatus('firms-status', 'Requesting detections from NASA FIRMS…');
      try {
        const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${encodeURIComponent(mapKey)}/${encodeURIComponent(source)}/${encodeURIComponent(country)}/${days}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`NASA FIRMS returned HTTP ${response.status}. Check the MAP_KEY and try again.`);
        const text = await response.text();
        if (/^(invalid|error|unauthorized)/i.test(text.trim())) throw new Error(text.trim().slice(0, 300));
        const rows = parseCsv(text);
        const preview = rows.slice(0, 8);
        if (!rows.length) {
          $('#firms-results').innerHTML = '<p class="source-empty">NASA FIRMS returned no detections for this country, feed, and period.</p>';
        } else {
          const headings = Object.keys(rows[0]);
          const field = (row, key) => row[key] || row[key.toUpperCase()] || '';
          $('#firms-results').innerHTML = preview.map((row) => `<article class="source-result-card"><div><strong>${escapeHtml(field(row, 'acq_date') || 'Date not supplied')} · ${escapeHtml(field(row, 'acq_time') || 'Time not supplied')} UTC</strong><span>${escapeHtml(field(row, 'latitude') || 'Lat n/a')}, ${escapeHtml(field(row, 'longitude') || 'Lon n/a')}</span></div><small>Confidence ${escapeHtml(field(row, 'confidence') || 'not supplied')} · FRP ${escapeHtml(field(row, 'frp') || 'not supplied')} MW · ${escapeHtml(field(row, 'satellite') || source)}</small></article>`).join('');
          if (!headings.length) throw new Error('NASA FIRMS returned an unexpected CSV structure.');
        }
        setStatus('firms-status', `NASA FIRMS returned ${rows.length} detection${rows.length === 1 ? '' : 's'} for ${country} over ${days} day${days === 1 ? '' : 's'}; showing up to ${preview.length}.`);
      } catch (error) {
        setError('firms-error', error.message || 'NASA FIRMS data could not be loaded.');
        setStatus('firms-status', 'NASA FIRMS data unavailable. No detections were substituted.');
      } finally {
        mapKeyInput.value = '';
        button.disabled = false;
      }
    });
  }

  function init() {
    configureWorldview();
    configureFirms();
    configureEarthquakes();
    configureWater();
    configureLandsat();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
