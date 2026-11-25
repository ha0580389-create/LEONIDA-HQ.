/**
 * LEONIDA HQ — YouTube Search Worker
 * Deploy as a Cloudflare Worker.
 * Add YOUTUBE_API_KEY as a Secret in Worker settings.
 * Optional: add ALLOWED_ORIGIN as a Text variable with your app's exact origin.
 */
export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const corsOrigin = allowedOrigin === '*' ? '*' : (origin === allowedOrigin ? allowedOrigin : 'null');
    const headers = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    const json = (body, status = 200) => new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60' }
    });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
    if (allowedOrigin !== '*' && origin && origin !== allowedOrigin && origin !== 'null') {
      return json({ error: 'Origin not allowed. Check ALLOWED_ORIGIN.' }, 403);
    }
    if (requestUrl.pathname === '/health') return json({ ok: true, service: 'LEONIDA HQ YouTube Search' });
    if (requestUrl.pathname !== '/search') return json({ error: 'Use /search?q=GTA+V' }, 404);
    if (!env.YOUTUBE_API_KEY) return json({ error: 'Missing YOUTUBE_API_KEY secret' }, 500);

    const q = (requestUrl.searchParams.get('q') || '').trim().slice(0, 120);
    if (q.length < 2) return json({ error: 'Search query must contain at least 2 characters' }, 400);
    const maxResults = Math.min(20, Math.max(5, Number(requestUrl.searchParams.get('maxResults') || 20)));
    const pageToken = requestUrl.searchParams.get('pageToken') || '';
    const lang = requestUrl.searchParams.get('lang') === 'ar' ? 'ar' : 'en';

    const apiUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    apiUrl.searchParams.set('part', 'snippet');
    apiUrl.searchParams.set('type', 'video');
    apiUrl.searchParams.set('q', q);
    apiUrl.searchParams.set('maxResults', String(maxResults));
    apiUrl.searchParams.set('order', 'relevance');
    apiUrl.searchParams.set('videoEmbeddable', 'true');
    apiUrl.searchParams.set('relevanceLanguage', lang);
    apiUrl.searchParams.set('regionCode', lang === 'ar' ? 'EG' : 'US');
    apiUrl.searchParams.set('key', env.YOUTUBE_API_KEY);
    if (pageToken) apiUrl.searchParams.set('pageToken', pageToken);

    try {
      const apiResponse = await fetch(apiUrl.toString());
      const data = await apiResponse.json();
      if (!apiResponse.ok) {
        const message = data?.error?.message || 'YouTube API request failed';
        return json({ error: message, status: apiResponse.status }, apiResponse.status === 403 ? 429 : 502);
      }
      const items = (data.items || []).map(item => ({
        id: item.id?.videoId || '',
        title: item.snippet?.title || '',
        channel: item.snippet?.channelTitle || '',
        description: item.snippet?.description || '',
        publishedAt: item.snippet?.publishedAt || '',
        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || ''
      })).filter(item => item.id);
      return json({ items, nextPageToken: data.nextPageToken || '', totalResults: data.pageInfo?.totalResults || 0 });
    } catch (error) {
      return json({ error: 'Could not reach YouTube API: ' + String(error?.message || error) }, 502);
    }
  }
};
