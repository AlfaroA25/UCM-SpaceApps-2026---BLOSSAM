const assert = require('node:assert/strict');
const test = require('node:test');
const { parseCsv, buildLandsatSearchUrl } = require('../nasa-usgs.js');

test('FIRMS CSV parser handles quoted commas and escaped quotes', () => {
  assert.deepEqual(parseCsv('place,note\r\n"North, valley","He said ""watch"""\r\n'), [
    { place: 'North, valley', note: 'He said "watch"' }
  ]);
});

test('Landsat STAC query uses the official collection, local bounding box, and requested dates', () => {
  const url = new URL(buildLandsatSearchUrl({
    latitude: '37.365',
    longitude: '-120.425',
    start: '2026-11-01',
    end: '2026-11-15'
  }));
  assert.equal(url.origin, 'https://landsatlook.usgs.gov');
  assert.equal(url.pathname, '/stac-server/search');
  assert.equal(url.searchParams.get('collections'), 'landsat-c2l2-sr');
  assert.equal(url.searchParams.get('bbox'), '-120.625,37.165,-120.225,37.565');
  assert.equal(url.searchParams.get('datetime'), '2026-11-01T00:00:00Z/2026-11-15T23:59:59Z');
});

test('Landsat STAC query rejects invalid coordinates and date order', () => {
  assert.throws(() => buildLandsatSearchUrl({
    latitude: '91',
    longitude: '0',
    start: '2026-11-01',
    end: '2026-11-15'
  }), /Latitude/);
  assert.throws(() => buildLandsatSearchUrl({
    latitude: '0',
    longitude: '0',
    start: '2026-11-15',
    end: '2026-11-01'
  }), /date range/);
  assert.throws(() => buildLandsatSearchUrl({
    latitude: '0',
    longitude: '0',
    start: '2026-02-31',
    end: '2026-03-01'
  }), /date range/);
});
