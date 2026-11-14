(() => {
  const ENDPOINT = 'https://power.larc.nasa.gov/api/temporal/daily/point';
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  const MAX_DAYS = 366;
  const PARAMETERS = [
    { code: 'T2M', label: '2 m air temperature' },
    { code: 'WS10M', label: 'Wind speed at 10 m' },
    { code: 'WD10M', label: 'Wind direction at 10 m' },
    { code: 'PS', label: 'Surface pressure' },
    { code: 'ALLSKY_SFC_SW_DWN', label: 'All-sky surface shortwave radiation' }
  ];
  const cache = new Map();
  const inFlight = new Map();

  function toDateCode(value, field) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Choose a valid ${field} date.`);
    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
      throw new Error(`Choose a valid ${field} date.`);
    }
    return value.replaceAll('-', '');
  }

  function validateRequest({ latitude, longitude, start, end }) {
    if (String(latitude).trim() === '' || String(longitude).trim() === '') {
      throw new Error('Enter both latitude and longitude.');
    }
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new Error('Latitude must be between −90 and 90 degrees.');
    if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new Error('Longitude must be between −180 and 180 degrees.');
    if (typeof start !== 'string' || typeof end !== 'string') throw new Error('Choose a start and end date.');
    const startCode = toDateCode(start, 'start');
    const endCode = toDateCode(end, 'end');
    if (start < '1981-01-01') throw new Error('NASA POWER daily data begins on January 1, 1981.');
    if (end < start) throw new Error('End date must be on or after the start date.');
    if (end > new Date().toISOString().slice(0, 10)) throw new Error('End date cannot be in the future.');
    const days = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000 + 1;
    if (days > MAX_DAYS) throw new Error(`Choose a date range of ${MAX_DAYS} days or less.`);
    return { latitude: lat, longitude: lon, start, end, startCode, endCode };
  }

  function parseResponse(payload, request) {
    const header = payload?.header;
    const rawParameters = payload?.properties?.parameter;
    const metadata = payload?.parameters;
    if (!header || !rawParameters || !metadata || typeof rawParameters !== 'object') {
      throw new Error('NASA POWER returned an incomplete data response.');
    }
    const dates = [...new Set(Object.values(rawParameters).flatMap((values) => Object.keys(values || {})))]
      .filter((date) => /^\d{8}$/.test(date))
      .sort();
    const fillValue = Number(header.fill_value ?? -999);
    const parameters = PARAMETERS.map(({ code, label }) => {
      const daily = rawParameters[code] || {};
      const info = metadata[code] || {};
      const observations = dates.map((date) => {
        const rawValue = daily[date];
        const value = Number(rawValue);
        return {
          date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
          value: rawValue !== null && rawValue !== undefined && Number.isFinite(value) && value !== fillValue ? value : null
        };
      });
      const latest = [...observations].reverse().find((item) => item.value !== null) || null;
      return {
        code,
        label,
        units: info.units || 'unit not supplied',
        observations,
        latest
      };
    });
    const latestDate = [...parameters]
      .flatMap((parameter) => parameter.observations.filter((item) => item.value !== null).map((item) => item.date))
      .sort()
      .at(-1) || null;
    return {
      location: {
        latitude: request.latitude,
        longitude: request.longitude,
        elevationMeters: payload.geometry?.coordinates?.[2] !== null
          && Number.isFinite(Number(payload.geometry?.coordinates?.[2]))
          ? Number(payload.geometry.coordinates[2])
          : null
      },
      requestedRange: { start: request.start, end: request.end },
      timeStandard: typeof header.time_standard === 'string' ? header.time_standard : 'not supplied',
      sourceSystems: Array.isArray(header.sources) ? header.sources.filter((source) => typeof source === 'string') : [],
      latestDate,
      parameters,
      messages: Array.isArray(payload.messages) ? payload.messages.filter((message) => typeof message === 'string') : [],
      fetchedAt: new Date().toISOString()
    };
  }

  async function fetchDaily(input) {
    const request = validateRequest(input);
    const key = `${request.latitude},${request.longitude},${request.start},${request.end}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) return cached.data;
    if (inFlight.has(key)) return inFlight.get(key);

    const url = new URL(ENDPOINT);
    url.searchParams.set('parameters', PARAMETERS.map(({ code }) => code).join(','));
    url.searchParams.set('community', 'RE');
    url.searchParams.set('longitude', String(request.longitude));
    url.searchParams.set('latitude', String(request.latitude));
    url.searchParams.set('start', request.startCode);
    url.searchParams.set('end', request.endCode);
    url.searchParams.set('time-standard', 'LST');
    url.searchParams.set('format', 'JSON');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const promise = fetch(url, { signal: controller.signal }).then(async (response) => {
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error('NASA POWER returned a response that was not valid JSON.');
      }
      if (!response.ok) {
        const details = Array.isArray(payload?.messages) ? payload.messages.filter(Boolean).join(' ') : '';
        throw new Error(details || `NASA POWER request failed (HTTP ${response.status}).`);
      }
      const data = parseResponse(payload, request);
      if (!data.parameters.some((parameter) => parameter.observations.some((item) => item.value !== null))) {
        throw new Error('NASA POWER returned no measurements for this location and date range. Try an earlier date range.');
      }
      cache.set(key, { data, cachedAt: Date.now() });
      return data;
    }).catch((error) => {
      if (error?.name === 'AbortError') throw new Error('NASA POWER request timed out. Try again in a moment.');
      if (error instanceof TypeError) throw new Error('Could not reach NASA POWER. Check your connection and try again.');
      throw error;
    }).finally(() => {
      clearTimeout(timeout);
      inFlight.delete(key);
    });
    inFlight.set(key, promise);
    return promise;
  }

  window.RufusNasaPower = Object.freeze({ fetchDaily });
})();
