LEONIDA HQ — REPAIRED SIX SECTIONS

Replace the HTML code in AppCreator24 section by section.

01 Dashboard                -> 01_Dashboard.html
02 Goal Tracker             -> 02_Goal_Tracker.html
03 Session Planner          -> 03_Session_Planner.html
04 Backup & Restore         -> 04_Backup_Restore.html
05 Interactive Map         -> 05_Interactive_Map.html
06 Videos                  -> 06_GTA_V_Videos.html

FIXES
- Goal tracker uses a separate state variable and a real change listener; the old inline handler used the name `checked`, which collided with the checkbox element's own `checked` property in inline event scope. This made a click fail to update the saved progress.
- Session planner defaults to 30 SECONDS, supports seconds/minutes, uses a wall-clock deadline so countdown timing does not drift, and has separate Start/Pause/Reset/Save actions.
- All six sections use the same language key LEONIDA_HQ_LANGUAGE, with Arabic/English text and placeholder translation.
- Backup includes tracker/session data and imports previous LEONIDA_HQ v2 backup format.
- Map uses Six Intel's documented embed URL and also provides direct-open links.
- Videos use the official YouTube embed player. In-app search requires a deployed Cloudflare Worker and a YouTube Data API v3 key. The included youtube-search-worker.js is the backend. Until configured, the page shows four curated starter videos and a direct YouTube search fallback rather than pretending live results loaded. Autoplay starts muted as cards enter view; tap Play to retry with sound if the WebView blocks autoplay.

IMPORTANT
Keep a copy of your current code before replacing it. AppCreator24/WebView storage and autoplay permissions can vary by configuration; these files were checked in a local Chromium test, but final in-app testing is still required.

YOUTUBE SEARCH SETUP
1. Create a Cloudflare Worker and paste youtube-search-worker.js.
2. Add a Worker Secret named YOUTUBE_API_KEY with your YouTube Data API v3 key.
3. Deploy the Worker and copy its https://...workers.dev URL.
4. In 06_GTA_V_Videos.html replace the empty quotes in const SEARCH_API='' with that URL (change this line only).
5. The search results then load inside the app; YouTube video playback still uses the official embedded player.
