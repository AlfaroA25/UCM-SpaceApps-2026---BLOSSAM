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
    'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.',
    'In-app alerts are saved in this profile on this device. Push notifications are not configured.',
    'Alert inbox',
    'Messages',
    'Health review prompts use self-reported records only. They are descriptive and are not diagnoses or continuous monitoring.',
    'Hydration, activity, sleep, meals, wellbeing, medication entries, and inbox alerts are saved on this device. Push notifications and cloud sync are not configured.',
    'Mark all as read',
    'Read',
    'Unread',
    'Mark as read',
    'Mark as unread',
    'No inbox alerts yet.',
    'INSTALL APP',
    'INSTALL',
    'SHARE',
    'Share AstroVital',
    'OPEN WELLBEING',
    'VIEW HEALTH LOG',
    'LOCAL LOG',
    'MEALS',
    'check meal schedule',
    'MEAL TRACKING',
    'AVAILABLE · LOCAL',
    'DEMO SCHEDULE',
    'MEDICATION DEMO',
    'SAMPLE DATA',
    'LOCAL ONLY',
    'DONE',
    'DAILY HEALTH · SELF-REPORTED',
    'CANCEL',
    'Health check-in',
    'Enter values you choose to record. Empty fields stay unavailable; this prototype does not connect to medical sensors or assess health status.',
    'Not recorded',
    'None',
    'Mild',
    'Moderate',
    'Severe',
    'SYMPTOM NOTES · OPTIONAL',
    'HRV · ms · OPTIONAL',
    'Optional measurements',
    'Leave unavailable measurements blank. Check-in values are self-reported, not sensor readings or clinical assessments.',
    'SAVE CHECK-IN'
  ];

  for (const language of languages) {
    i18n.setLocale(language);
    for (const source of strings) {
      const translated = i18n.translate(source);
      if (source !== 'Messages') {
        assert.notEqual(translated, source, `${source} should be translated for ${language}`);
      }
      if (source.includes('AstroVital')) assert.match(translated, /AstroVital/);
      if (source.includes('Rufus')) assert.match(translated, /Rufus/);
    }
  }
});

test('Rufus companion page copy and dynamic labels are translated in every supported language', () => {
  const i18n = loadI18n();
  const languages = ['es', 'fr', 'de', 'zh', 'ja', 'ar'];
  const strings = [
    'Your crewmate,',
    'your mission.',
    'Drop in, say hello, and choose Rufus’s pose and mission gear. Your companion progress stays on this device.',
    'Pet Rufus. Each visit can build your friendship.',
    'Rufus in his customized astronaut suit',
    'CREW BOND',
    'LEVEL __RUFUS_VAR_0__',
    'New crewmates',
    'Trusted orbiters',
    'Mission partners',
    'Cosmic companions',
    '/ 100 BOND XP · EARNED BY SHOWING UP',
    'MISSION STARDUST',
    'HELLO STREAK',
    'MISSIONS TODAY',
    'Pocket satellite put away. Mix and match any gear you own.',
    '__RUFUS_VAR_0__ equipped. Mix and match any gear you own.',
    '__RUFUS_VAR_0__ put away. Mix and match any gear you own.',
    'VIEW TODAY’S MISSIONS',
    'GEAR LOCKER',
    'Accessories & inventory',
    'EARNED WITH MISSIONS',
    'Equip any gear you own. Complete a daily mission to earn stardust toward new items.',
    'Your locker is ready for its first mission reward.',
    'Pocket satellite',
    'A tiny satellite companion circling Rufus.',
    'Wrist computer',
    'A compact mission communicator on Rufus’s cuff.',
    'Holographic slate',
    'A luminous field slate for curious explorers.',
    'Comms pack',
    'A flight-ready communications pack.',
    'EQUIP',
    'EQUIPPED',
    'OWNED',
    'MISSION SUPPLY',
    'Unlock new gear',
    'GROW TOGETHER',
    'Today’s crew missions',
    'ALL WELLNESS GOALS ↗',
    'Rufus celebrates actions already supported by AstroVital. Mission data is illustrative and isn’t medical advice.',
    'Rufus is a friendly wellness companion, not a medical diagnostic system. Progress and rewards are motivational only.',
    'No pressure, crew member. Every small check-in is a win, and rest counts too.',
    'Thanks for checking in. Looking after yourself is a mission win.',
    'Flight plan complete! Take a moment to celebrate your effort.',
    'Every mission starts with a little hello. Want to see the flight plan?',
    'Oh! A friendly space-pat. My whiskers are receiving excellent signals.',
    'You came back! I saved you the comfiest spot in the observation deck.',
    'Crew check: you are doing better than you think. No rush, okay?',
    'Boop received. Mission morale is now orbiting at a very respectable altitude.',
    'I would high-five you, but these astronaut gloves are delightfully enormous.',
    'You do not have to do it all at once. One small step is plenty.',
    'Checking in with yourself is brave work. I am cheering you on!',
    'Your pace is the right pace. Rest is part of the mission, too.',
    'A little progress still counts as progress. You have got this, crew member!',
    'Fun fact: the stars are very far away, but your next small win is right here.',
    'LOOK AT YOU! Your whole flight plan is complete. Rufus is doing a tiny victory dance!',
    'Mission accomplished, crew member! Thanks for checking in with yourself. That counts.',
    'Nice work getting your movement mission logged. One small win, right on course.',
    'Curiosity beacon: activated! Rufus loved exploring that Mind Lab puzzle with you.',
    'A mindful pause logged. Rufus says a little reset can be a lovely mission moment.',
    'FLIGHT PLAN COMPLETE · CELEBRATION TIME',
    'MISSION MILESTONE · +10 STARDUST',
    'NEW MISSION INSIGNIA',
    'NEW GEAR UNLOCKED',
    'Curious',
    'Mission wave',
    'Rufus waves hello in his flight suit.',
    'Steady orbit',
    'Rufus stands ready with a confident smile.',
    'Recharge',
    'Rufus takes a comfortable moment to rest.',
    'Sleep cycle',
    'Rufus drifts off for a well-earned rest.',
    'Choose Rufus’s mission moment',
    'Choose a pose from the supplied character art. Equip gear in the companion bay to personalize Rufus.',
    'OPEN COMPANION BAY',
    'SAVE POSE',
    'Milestone unlocked: __RUFUS_VAR_0__!',
    '__RUFUS_VAR_0__ unlocked and equipped! That is some excellent mission gear.',
    'LOCKER UPDATED',
    'Mark completed __RUFUS_VAR_0__',
    'Mark uncompleted __RUFUS_VAR_0__'
  ];

  for (const language of languages) {
    i18n.setLocale(language);
    for (const source of strings) {
      assert.notEqual(i18n.translate(source), source, `${source} should be translated for ${language}`);
    }

    const level = i18n.translate('LEVEL 2');
    assert.notEqual(level, 'LEVEL 2', `Companion levels should be translated for ${language}`);
    assert.ok(level.includes('2'), `Translated companion levels should retain the level for ${language}`);

    const accessibleMission = i18n.translate('Mark completed Complete your health check-in');
    assert.notEqual(accessibleMission, 'Mark completed Complete your health check-in', `Mission accessibility labels should be translated for ${language}`);
    assert.doesNotMatch(accessibleMission, /Complete your health check-in/, `Mission names in accessibility labels should be translated for ${language}`);
    assert.doesNotMatch(accessibleMission, /__RUFUS_VAR_/);

    const companionGreeting = i18n.translate('Nice work, crew member. You have 2 small wins logged today. Keep your own pace.');
    assert.doesNotMatch(companionGreeting, /Nice work|crew member|small wins/, `Dynamic companion messages should be translated for ${language}`);

    const gearUnlock = i18n.translate('Pocket satellite unlocked and equipped! That is some excellent mission gear.');
    assert.doesNotMatch(gearUnlock, /Pocket satellite|excellent mission gear/, `Dynamic gear messages should be translated for ${language}`);
  }
});

test('notification demo controls and guidance are translated in every supported language', () => {
  const i18n = loadI18n();
  const strings = [
    'BROWSER PERMISSION TEST',
    'Demo notifications',
    'TEST ONLY',
    'To try a notification, open AstroVital over HTTPS or localhost, enable browser notifications, allow the browser prompt, then send a demo notification.',
    'Enable browser notifications',
    'Send demo notification',
    'Preview in-app demo',
    'The test notification is sent only when you press the button. Scheduled alerts and delivery after closing the app require a push service and server; they are not configured. In-app inbox alerts remain available.',
    'Browser notifications are unsupported in this browser.',
    'Notifications require HTTPS or localhost.',
    'Notifications are enabled. Use Send demo notification to test them.',
    'Notifications are blocked. Allow them in this site’s browser or device settings.',
    'Enable browser notifications to try the demo.',
    'Allow browser notifications first, then send the demo.',
    'Notification permission was not granted.',
    'Demo notification sent.',
    'Unable to send the demo notification. Check your browser settings.',
    'This is a demo notification preview.',
    'AstroVital notification demo',
    'This is a test notification from AstroVital. Notifications are sent only when you request them.'
  ];

  for (const language of ['es', 'fr', 'de', 'zh', 'ja', 'ar']) {
    i18n.setLocale(language);
    for (const source of strings) {
      assert.notEqual(i18n.translate(source), source, `${source} should be translated for ${language}`);
    }
  }
});

test('both app HTML entry points expose install metadata and the translated alert inbox', () => {
  const entries = ['index.html', 'AstroVital_Mission_Health.html'];
  for (const entry of entries) {
    const html = fs.readFileSync(path.join(appDirectory, entry), 'utf8');
    assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/, `${entry} should link its PWA manifest`);
    assert.match(html, /rel="icon" type="image\/svg\+xml" href="\.\/icons\/astrovital\.svg"/, `${entry} should use the square SVG icon`);
    assert.match(html, /id="inbox-unread-badge"/, `${entry} should show the unread inbox count`);
    assert.match(html, /id="alerts-page-content"/, `${entry} should render the inbox`);
    assert.match(html, /data-action="enable-browser-notifications"/, `${entry} should let users grant browser notification permission`);
    assert.match(html, /data-action="send-demo-notification"/, `${entry} should include a native notification demo`);
    assert.match(html, /data-action="preview-inapp-notification"/, `${entry} should include an in-app notification preview`);
    assert.match(html, /src="\.\/app\.js"/, `${entry} should load the shared app behavior`);
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(appDirectory, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.icons.some((icon) => icon.purpose === 'maskable'));
  const icon = fs.readFileSync(path.join(appDirectory, 'icons/astrovital.svg'), 'utf8');
  assert.match(icon, /<rect width="512" height="512" fill="#080d16"\/>/);
  assert.doesNotMatch(icon, /<rect[^>]*rx=/);
  const appScript = fs.readFileSync(path.join(appDirectory, 'app.js'), 'utf8');
  assert.match(appScript, /Notification\.requestPermission\(\)/);
  assert.match(appScript, /registration\.showNotification/);
  assert.match(appScript, /data-action === 'send-demo-notification'/);
  for (const symptom of ['None', 'Mild', 'Moderate', 'Severe']) {
    assert.ok(appScript.includes(`<option value="${symptom}"`), `${symptom} must keep a stable value when its label is translated`);
  }
});

test('Astro_Vital_Health alias redirects to the installable full app page', () => {
  const alias = fs.readFileSync(path.join(appDirectory, 'Astro_Vital_Health.html'), 'utf8');
  assert.match(alias, /http-equiv="refresh" content="0; url=\.\/AstroVital_Mission_Health\.html"/);
  assert.match(alias, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(alias, /name="apple-mobile-web-app-capable" content="yes"/);

  const serviceWorker = fs.readFileSync(path.join(appDirectory, 'sw.js'), 'utf8');
  assert.match(serviceWorker, /'\.\/Astro_Vital_Health\.html'/, 'the alias should be available offline');
});
