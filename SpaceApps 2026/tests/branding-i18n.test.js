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
