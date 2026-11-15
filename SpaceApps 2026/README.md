# AstroVital

**Your Health. Your Mission.**

AstroVital is a local-first astronaut health and wellbeing app. Rufus, your AI health companion, is the personalized guide within AstroVital. The app is a static HTML, CSS, and JavaScript PWA with locally bundled Three.js planet backdrops and star-travel transitions.

## Run locally

From this directory, serve the files over localhost:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serving over localhost enables the service worker; opening `index.html` directly does not.

## Share and install

After deployment, share the [AstroVital GitHub Pages app](https://alfaroa25.github.io/UCM-SpaceApps-2026---BLOSSAM/) with its link. Choose **Install app** on the welcome screen or **Install** in the app header. On desktop Chrome or Edge, accept the browser prompt (or choose **Install AstroVital** from the browser menu). On Android, open the link in Chrome and choose **Install app** or **Add to Home screen**. On iPhone or iPad, open the link in Safari, tap **Share**, then choose **Add to Home Screen**.

Installation and offline use require HTTPS or localhost. The GitHub Pages deployment workflow publishes the contents of this directory at the repository’s Pages URL.

Both `index.html` and `AstroVital_Mission_Health.html` load the same translated app and PWA assets. The alternate `Astro_Vital_Health.html` filename redirects to the full app page.

## Try a browser notification

1. Open the hosted HTTPS app (or a localhost development URL) and select **Alerts and notifications**.
2. Select **Enable browser notifications**, then allow notifications in the browser or device prompt. If permission was previously blocked, change it in that site’s browser/device settings.
3. Select **Send demo notification** to display a real operating-system notification, or **Preview in-app demo** to see a preview without granting permission.

The demo notification is sent only after you press its button. Health review prompts are saved to the in-app inbox; the app does not schedule hydration reminders or send alerts while closed. Automatic background delivery requires a push subscription and a server-side push service, which are not configured. On iPhone/iPad, add the HTTPS app to the Home Screen first; notification support depends on the iOS version and device settings.

## Implemented

- Crew members enter only a Personnel ID. Demo ID `1234` opens the local profile named Rufus; other IDs open or create separate local profiles named Crew Member by default.
- Personnel IDs are unverified local profile selectors, not authentication. There is no password, account security, backend, or cross-device sync. Anyone with access to the browser can enter an ID and open its local profile.
- Profiles from the prior email-based prototype remain in browser storage but are not automatically associated with Personnel IDs.
- Name, mission ID, language, time zone, hydration preferences, notification preference, and wellness interests can be updated in the app. No account or external service is required.
- The interface supports English, Spanish, French, German, Simplified Chinese, Japanese, and Arabic. UI translations are bundled locally, switching applies immediately, and Arabic uses a right-to-left layout. Dates and numbers follow the selected locale; personal journal notes are not translated.
- Translations are machine-generated and should be reviewed by fluent speakers before operational or medical use.
- Responsive navigation, a health monitor, daily missions, Mind Lab, and a unified wellbeing check-in and private journal.
- Sidebar navigation moves between sections through a fast Three.js starfield transition, then fades the destination content into view. Major layout changes ease between responsive breakpoints; reduced-motion preferences skip animations. The locally bundled renderer works offline.
- Each app section has a distinct procedurally textured planet or moon in a slow-rotating 3D space backdrop with a denser, multicolored starfield and destination-tinted nebula glows. No remote textures or planetary assets are required.
- Physical Activity: schedule and log approved activities, track planned/completed/skipped status, review recent history, and sync completed activity minutes with Daily Missions.
- Sleep Tracking: create sleep-opportunity schedules, log timed sleep periods with optional quality/restedness check-ins, and review duration trends. Periods can cross midnight; health-check-in sleep is integrated without double-counting manual periods.
- Meals and Nutrition: schedule meals and record eaten, partial, or skipped entries with optional notes. Nutrition details appear only when entered with a source; AstroVital does not calculate or invent nutrition information.
- Wellbeing: mood, fatigue, stress, crew connection, and optional private reflections are kept together in one local journal with editable history. Existing wellbeing entries are preserved when profiles load.
- Personal Health Baseline: collect daily self-reported indicators, establish a reference from the first 30 unique dated records spanning at least 30 calendar days, and review personal trends, illustrative scores, and rule-based flags. A generic synthetic demo is available and is clearly labeled.
- Health check-ins can include optional symptom notes; recent notes, age, weight, and optional medical-context notes are stored only in the selected local browser profile.
- Daily mission completion can be toggled back to uncompleted. Reversing an objective removes its mission XP and Rufus rewards but does not delete personal check-in records.
- Mind Lab includes timed target-scan and Memory Match stopwatches, plus a six-pair Memory Match game. Match time can be paused, resumed, and reset; these are optional games, not cognitive assessments.
- A Rufus companion panel with original temporary bobcat placeholder artwork and reactions to supported check-ins and activities.
- Hydration goal and unit setup, preview-before-confirm schedule planning, manual intake entries, edit/delete history, daily progress, and a seven-day summary.
- Hydration plans and intake entries remain on this device. The schedule appears only in the app; no scheduled or background hydration reminders are implemented.
- Self-reported health review prompts are also added to a local inbox, with unread counts and read/unread controls. Inbox messages are saved per local profile on this device; push notifications and cross-device delivery are not configured.
- The Alerts page includes a browser-permission demo for sending a user-triggered operating-system notification; it does not schedule or remotely deliver alerts.
- NASA POWER Phase 1: a browser-based daily point query for 2 m temperature, 10 m wind speed/direction, surface pressure, and all-sky surface shortwave radiation, with unit-aware summaries, trend chart, date table, and source metadata.
- NASA Research & Mission Data: NASA EDA mission telemetry for ISS-side temperature, CO₂, relative humidity, and historical radiation, with mission comparison, date filters, chart tooltips, units, and source links. Bundled, daily aggregates cover RR-1 (2014), RR-3 (2016), and RR-6 (2017–2018); telemetry means are calculated from valid NASA EDA samples and radiation readings are preserved as reported.
- NASA OSDR discovery: human in-flight datasets queried using the documented OSDR API, restricted to `Homo sapiens` and in-flight studies and excluding cell, tissue, and animal material types. The bundled snapshot includes OSD-174, OSD-483, and OSD-530 with study-provided descriptions and links to NASA metadata/repository pages.
- NASA and USGS source explorer: NASA GIBS/Worldview image layers, NASA FIRMS country feeds, the USGS Earthquake GeoJSON feed, USGS Water Data monitoring locations and latest reported continuous observations, and USGS Landsat Collection 2 STAC scene discovery with an official-query-link fallback when browser CORS blocks the API.
- Offline app-shell caching for the current assets.

The NASA POWER query requires an internet connection and sends the selected coordinates and dates directly to NASA. NASA POWER does not require an API key, so no secret or `.env` configuration is needed. Results are cached in memory for up to six hours and duplicate in-flight requests are shared. NASA EDA and OSDR live API requests are attempted and cached in memory; the static app may be prevented from reading those APIs by browser cross-origin restrictions, so verified NASA-sourced snapshots are bundled as an offline fallback. The NASA EDA API documentation is linked in the dashboard. Health readings remain illustrative sample data. Language catalogs are shipped with the app; no translation request or health-data upload is made when switching languages. NASA RadLab was returning HTTP 500 during integration; the dashboard labels this limitation and does not fabricate RadLab data. Push subscriptions and server-side background delivery, scheduled reminders, IndexedDB, synchronization, Supabase, and actual personal sensor integrations are not implemented.

NASA GIBS imagery uses its public EPSG:4326 WMS. NASA FIRMS requests require a user-provided MAP_KEY; AstroVital sends it directly to the official FIRMS endpoint for that request and does not save it. USGS earthquake and Water Data OGC API v1 endpoints are queried directly and are cached briefly in memory; returned water records may be historical, and their source timestamps and units are displayed. USGS LandsatLook STAC search is attempted in-browser, but the service may reject cross-origin reads from a static localhost or hosted origin; the explorer then provides a link to the exact official USGS STAC query rather than substituting scene metadata.

## Safety and limitations

Hydration goals are user-entered from an approved plan; AstroVital does not prescribe a target or recommend catch-up drinking. Configure or edit a goal on the Hydration Tracker, review its schedule preview, then explicitly confirm it. Entries are manually logged and can be edited or deleted. The app is a prototype, not a medical device or diagnostic system.

Activity and sleep schedules are personal planning aids and do not replace crew medical guidance. Wellbeing entries are self-reported and non-clinical. Meal entries are not a nutrition analysis tool; use only mission-approved menus and verified nutrition sources.

The personal baseline uses only records saved in the selected local profile; it does not import NASA participant-level data or compare against astronaut populations. Its scores, trends, and review flags are illustrative heuristics, not validated medical measures, diagnosis, or calibrated risk probabilities. Optional indicators can be left blank. Loading the synthetic demo replaces the displayed records after confirmation; personal records are kept in a local backup and restored when the demo is cleared or replaced with a personal check-in.

NASA POWER values are daily Earth-surface environmental estimates, not personal astronaut biometrics, spacecraft conditions, or personal space-radiation exposure. Surface solar radiation must not be interpreted as astronaut radiation dose. The Daily API reports a date and time standard rather than an exact observation timestamp; the UI labels the latest available day and retrieval time separately. Missing measurements are shown as unavailable, not replaced with sample values.

NASA EDA values in this dashboard are historical ISS mission telemetry—not live data, current astronaut exposure, or individual vital signs. The bundled RR datasets describe research-hardware/ISS-side measurements associated with Rodent Research missions; they are not a general cabin-environment monitor or measurements of human study participants. Temperature, CO₂, and humidity are daily means of valid NASA EDA telemetry samples. Radiation values are historical mission-specific EDA series in mGy/day and are not an astronaut’s dose. NASA OSDR descriptions are study metadata/abstracts, not personalized findings or clinical recommendations; the study date range is shown as unavailable when NASA metadata does not supply it. AstroVital is an educational prototype, not a medical diagnostic system.

To test the integration, serve this directory over localhost and open **NASA Environmental Data**. Select an EDA mission, optional comparison, measurement, and date range, then select **Load NASA Mission Data**. Use **Search NASA OSDR** to load the human in-flight study list and filter its titles/descriptions. When live requests are blocked, status text identifies the fallback snapshot and its retrieval date. The source endpoints are NASA EDA’s documented `/eda/api/missions/{mission}/telemetry_data/` and `/eda/api/missions/{mission}/radiation_data/`, plus NASA OSDR `/biodata/api/v2/query/datasets/` and `/biodata/api/v2/dataset/{accession}/`. The OSDR API filter uses `study.characteristics.organism=Homo sapiens` and `study.factor value.spaceflight=in-flight|In-flight`. No API key or additional server setup is required.

In the same view, load NASA GIBS imagery and USGS earthquake events, search USGS water monitoring sites by coordinates, and discover Landsat scenes by coordinates/date range. Landsat results link to the official STAC API search if CORS prevents in-page results. NASA FIRMS requires a valid MAP_KEY obtained from NASA; without it, no fire observations are requested or fabricated.

The placeholder illustration is original temporary artwork and is **not** official UC Merced mascot art. Replace `rufus-placeholder.svg` with an approved asset when one is provided.

Future work could add NASA Earthdata and Data Portal discovery, Giovanni, AppEEARS, or a server-side integration for NASA sources whose APIs block browser access; those additions need separate API and deployment validation.
