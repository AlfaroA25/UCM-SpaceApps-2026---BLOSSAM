const assert = require('node:assert/strict');
const test = require('node:test');
const research = require('../nasa-research.js');
const edaArchive = require('../data/nasa-eda-historical.json');
const osdrArchive = require('../data/nasa-human-spaceflight.json');

test('EDA telemetry is aggregated by UTC date while radiation samples retain source values', () => {
  const mission = research.aggregateMission(
    { id: 'TEST', title: 'Test mission' },
    [
      { time: '2024-01-02T00:00:00Z', temperature_iss: 20, humidity_iss: 40, co2_iss: 500 },
      { time: '2024-01-02T00:05:00Z', temperature_iss: 22, humidity_iss: 'NA', co2_iss: 700 },
      { time: '2024-01-01T23:55:00Z', temperature_iss: null, humidity_iss: 50, co2_iss: 600 }
    ],
    [
      { time: '2024-01-02T00:00:00Z', gcr: 0.1, saa: 0.05, total: 0.15 }
    ]
  );

  assert.deepEqual(mission.observations, [
    { date: '2024-01-01', humidityPercent: 50, co2Ppm: 600 },
    { date: '2024-01-02', temperatureC: 21, humidityPercent: 40, co2Ppm: 600, radiationGcr: 0.1, radiationSaa: 0.05, radiationTotal: 0.15 }
  ]);
});

test('human-spaceflight filter excludes non-human, non-flight, and cellular or tissue datasets', () => {
  const base = { organism: 'Homo sapiens', spaceflightPhase: 'in-flight', materialType: 'Peripheral blood' };
  assert.equal(research.validHumanStudy(base), true);
  assert.equal(research.validHumanStudy({ ...base, organism: 'Mus musculus' }), false);
  assert.equal(research.validHumanStudy({ ...base, spaceflightPhase: 'pre-flight' }), false);
  assert.equal(research.validHumanStudy({ ...base, materialType: 'Cell line' }), false);
  assert.equal(research.validHumanStudy({ ...base, materialType: 'Tissue' }), false);
});

test('bundled EDA and OSDR snapshots contain sourced, historical human and mission records', () => {
  assert.match(edaArchive.source, /NASA Environmental Data Application/);
  assert.equal(edaArchive.missions.length, 3);
  assert.deepEqual(edaArchive.missions.map((mission) => mission.id), ['RR-1', 'RR-3', 'RR-6']);
  for (const mission of edaArchive.missions) {
    assert.ok(mission.range.start);
    assert.ok(mission.range.end);
    assert.ok(mission.observations.length > 0);
    assert.ok(mission.observations.some((item) => Number.isFinite(item.temperatureC)));
    assert.ok(mission.observations.some((item) => Number.isFinite(item.radiationTotal)));
  }
  assert.deepEqual(osdrArchive.studies.map((study) => study.accession), ['OSD-174', 'OSD-483', 'OSD-530']);
  assert.ok(osdrArchive.studies.every(research.validHumanStudy));
});
