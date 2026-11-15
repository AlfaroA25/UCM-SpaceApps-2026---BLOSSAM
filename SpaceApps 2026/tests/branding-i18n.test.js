const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const appDirectory = path.resolve(__dirname, '..');

function loadI18n() {
  const documentElement = {
    dir: 'ltr',
    lang: 'en',
    matches: () => false,
    getAttribute: () => null,
    querySelectorAll: () => []
  };
  const context = {
    CustomEvent: class CustomEvent {
      constructor(type, options) {
        this.type = type;
        this.detail = options.detail;
      }
    },
    document: {
      documentElement,
      createTreeWalker: () => ({ nextNode: () => null }),
      dispatchEvent: () => {}
    },
    MutationObserver: class MutationObserver {
      observe() {}
    },
    Node: { ELEMENT_NODE: 1, TEXT_NODE: 3 },
    NodeFilter: { SHOW_TEXT: 4 },
    window: {}
  };

  for (const file of ['i18n-catalog.js', 'i18n.js']) {
    vm.runInNewContext(
      fs.readFileSync(path.join(appDirectory, file), 'utf8'),
      context,
      { filename: file }
    );
  }

  return context.window.RufusI18n;
}

test('new Rufus onboarding and chat identity copy is translated in every supported language', () => {
  const i18n = loadI18n();
  const languages = ['es', 'fr', 'de', 'zh', 'ja', 'ar'];
  const strings = [
    'AstroVital — Your Health. Your Mission.',
    'Rufus, your AI health companion.',
    'Meet Rufus, your personalized guide within AstroVital.',
    'Chat with Rufus',
    'Customize Rufus',
    'Tap Rufus to say hi',
    'Rufus companion',
    'Rufus companion bay',
    'Rufus avatar bay',
    'Install AstroVital',
    'AstroVital opens like an app and keeps your profile on this device.',
    'Rufus is happy you dropped by',
    'Rufus has a message for you',
    'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.',
    'Try AstroVital, the local-first astronaut health app.'
  ];

  for (const language of languages) {
    i18n.setLocale(language);
    for (const source of strings) {
      const translated = i18n.translate(source);
      assert.notEqual(translated, source, `${source} should be translated for ${language}`);
      if (source.includes('AstroVital')) assert.match(translated, /AstroVital/);
      if (source.includes('Rufus')) assert.match(translated, /Rufus/);
      assert.doesNotMatch(translated, /RUFUS|RUFO|鲁弗斯|ルーファス|روفوس/);
    }
  }
});

test('legacy catalog translations preserve canonical brand spelling after app renaming', () => {
  const i18n = loadI18n();
  const source = 'Follow your mission medical protocols and contact your crew medical officer. AstroVital does not replace medical care.';

  for (const language of ['es', 'fr', 'de', 'zh', 'ja', 'ar']) {
    i18n.setLocale(language);
    const translated = i18n.translate(source);
    assert.notEqual(translated, source, `The existing message should remain translated for ${language}`);
    assert.match(translated, /AstroVital/);
    assert.doesNotMatch(translated, /RUFUS|RUFO|鲁弗斯|ルーファス|روفوس/);
  }
});

test('health report interface and privacy copy are translated in every supported language', () => {
  const i18n = loadI18n();
  const languages = ['es', 'fr', 'de', 'zh', 'ja', 'ar'];
  const strings = [
    'ASTROVITAL HEALTH INSIGHTS',
    'Health insights',
    'Explore your personal baseline and reports built from locally saved data.',
    'PERSONAL RECORDS · LOCAL ONLY',
    'SYNTHETIC DEMO · ISOLATED',
    'View demo data',
    'Return to my data',
    'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.',
    'Health insights views',
    'Personal Baseline',
    'Daily Report',
    'Weekly Report',
    'ASTROVITAL HEALTH REPORTS',
    'Health reports',
    'Daily and weekly summaries of information saved in your profile.',
    'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.',
    'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.',
    'Weekly · 7 days ending on selected date',
    'Daily summary',
    'Weekly summary',
    'No records for this period.',
    'Health indicators',
    'Personal baseline comparison',
    'Resting heart rate',
    'Mood check-ins',
    'Completed sessions',
    'Medication log',
    'Export CSV',
    'Print / Save PDF',
    'Future report dates are unavailable.',
    'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.'
  ];

  for (const language of languages) {
    i18n.setLocale(language);
    for (const source of strings) {
      const translated = i18n.translate(source);
      assert.notEqual(translated, source, `${source} should be translated for ${language}`);
      if (source.includes('AstroVital')) assert.match(translated, /AstroVital/);
      if (source.includes('Rufus')) assert.match(translated, /Rufus/);
    }
  }
});
