# LEONIDA HQ

A bilingual, mobile-first gaming companion project for GTA V / GTA Online and GTA VI.

## App sections

| AppCreator24 section | File |
|---|---|
| Dashboard | `01_Dashboard.html` |
| Goal Tracker | `02_Goal_Tracker.html` |
| Session Planner | `03_Session_Planner.html` |
| Backup & Restore | `04_Backup_Restore.html` |
| Interactive Map | `05_Interactive_Map.html` |
| Videos | `06_GTA_V_Videos.html` |

## Preview
Open `index.html` to use the project hub, or open any section file directly.

## AppCreator24 setup
1. Keep a backup of the current section code.
2. Replace each AppCreator24 HTML section with the matching file above.
3. Test the goal tracker, timer, backup/restore, map links, and video playback inside the actual WebView.
4. Each section is designed as a standalone HTML page. Shared progress is stored in WebView local storage; storage sharing depends on whether AppCreator24 uses the same WebView origin for all sections.

## YouTube search (optional)
The videos page uses the official YouTube embedded player. In-app search needs a Cloudflare Worker:
- Deploy `youtube-search-worker.js`.
- Add `YOUTUBE_API_KEY` as a Worker Secret (never place the key in HTML or GitHub).
- Set the Worker URL in the `SEARCH_API` constant inside `06_GTA_V_Videos.html`.

Autoplay can be blocked by Android WebView/browser policy. The page starts playback muted where supported and includes manual playback / YouTube fallback.

## Important
This is an unofficial fan project and is not affiliated with Rockstar Games or Take-Two Interactive. GTA names and imagery belong to their respective owners. No game files or copyrighted video files are hosted here.
