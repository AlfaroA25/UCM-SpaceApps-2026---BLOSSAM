# RUFUS

**Your Health. Your Mission. Your Companion.**

RUFUS is a local-first astronaut health and wellbeing companion prototype. It is a dependency-free HTML, CSS, and JavaScript PWA.

## Run locally

From this directory, serve the files over localhost:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serving over localhost enables the service worker; opening `index.html` directly does not.

## Share and install

After deployment, share the [RUFUS GitHub Pages app](https://alfaroa25.github.io/UCM-SpaceApps-2026---BLOSSAM/) with its link. Choose **Install app** on the welcome screen or **Install** in the app header. On desktop Chrome or Edge, accept the browser prompt (or choose **Install RUFUS** from the browser menu). On Android, open the link in Chrome and choose **Install app** or **Add to Home screen**. On iPhone or iPad, open the link in Safari, tap **Share**, then choose **Add to Home Screen**.

Installation and offline use require HTTPS or localhost. The GitHub Pages deployment workflow publishes the contents of this directory at the repository’s Pages URL.

## Implemented

- Crew members enter only a Personnel ID. Demo ID `1234` opens the local profile named Rufus; other IDs open or create separate local profiles named Crew Member by default.
- Personnel IDs are unverified local profile selectors, not authentication. There is no password, account security, backend, or cross-device sync. Anyone with access to the browser can enter an ID and open its local profile.
- Profiles from the prior email-based prototype remain in browser storage but are not automatically associated with Personnel IDs.
- Name, mission ID, language, time zone, hydration preferences, notification preference, and wellness interests can be updated in the app. No account or external service is required.
- The interface supports English, Spanish, French, German, Simplified Chinese, Japanese, and Arabic. UI translations are bundled locally, switching applies immediately, and Arabic uses a right-to-left layout. Dates and numbers follow the selected locale; personal journal notes are not translated.
- Translations are machine-generated and should be reviewed by fluent speakers before operational or medical use.
- Responsive navigation, a health monitor, daily missions, Mind Lab, and wellbeing log.
- A RUFUS companion panel with original temporary bobcat placeholder artwork and reactions to supported check-ins and activities.
- Hydration goal and unit setup, preview-before-confirm schedule planning, manual intake entries, edit/delete history, daily progress, and a seven-day summary.
- Hydration plans and intake entries remain on this device. The schedule appears only in the app; there are no background or operating-system notifications.
- NASA POWER Phase 1: a browser-based daily point query for 2 m temperature, 10 m wind speed/direction, surface pressure, and all-sky surface shortwave radiation, with unit-aware summaries, trend chart, date table, and source metadata.
- Offline app-shell caching for the current assets.

The NASA POWER query requires an internet connection and sends the selected coordinates and dates directly to NASA. NASA POWER does not require an API key, so no secret or `.env` configuration is needed. Results are cached in memory for up to six hours and duplicate in-flight requests are shared. Health readings remain illustrative sample data. Language catalogs are shipped with the app; no translation request or health-data upload is made when switching languages. Satellite imagery, NASA FIRMS, dataset discovery, meal and medication tracking, background notifications, IndexedDB, synchronization, Supabase, and actual sensor integrations are not implemented.

## Safety and limitations

Hydration goals are user-entered from an approved plan; RUFUS does not prescribe a target or recommend catch-up drinking. Configure or edit a goal on the Hydration Tracker, review its schedule preview, then explicitly confirm it. Entries are manually logged and can be edited or deleted. The app is a prototype, not a medical device or diagnostic system.

NASA POWER values are daily Earth-surface environmental estimates, not personal astronaut biometrics, spacecraft conditions, or personal space-radiation exposure. Surface solar radiation must not be interpreted as astronaut radiation dose. The Daily API reports a date and time standard rather than an exact observation timestamp; the UI labels the latest available day and retrieval time separately. Missing measurements are shown as unavailable, not replaced with sample values.

To test the integration, serve this directory over localhost, open **NASA Environmental Data**, choose coordinates and a date range, and select **Load NASA POWER Data**. For an independent API check, use NASA's documented Daily Point API with the same parameters shown in the UI. An internet connection is required; no credentials are needed. The NASA POWER Daily API documentation is linked in the environmental section.

The placeholder illustration is original temporary artwork and is **not** official UC Merced mascot art. Replace `rufus-placeholder.svg` with an approved asset when one is provided.

Later integration phases may add Worldview/GIBS imagery, FIRMS, NASA Earthdata and Data Portal discovery, and supported Giovanni, AppEEARS, and USGS connections.
