// GET /api/metar → the latest LYBE METAR from aviationweather.gov (which sends no CORS header, so the invite can't fetch it directly).
// Cached at Cloudflare's edge for 10 minutes; on any failure the page keeps its printed fallback.
export async function onRequestGet() {
  try {
    const r = await fetch('https://aviationweather.gov/api/data/metar?ids=LYBE&format=json', {
      headers: { 'user-agent': 'fl300-invite' },
      cf: { cacheTtl: 600, cacheEverything: true },
    });
    if (!r.ok) throw new Error('upstream ' + r.status);
    const [m] = await r.json();
    if (!m?.rawOb) throw new Error('no METAR');
    const out = { raw: m.rawOb.replace(/^METAR\s+/, ''), time: m.reportTime, temp: m.temp, wdir: m.wdir, wspd: m.wspd, qnh: m.altim, cat: m.fltCat };
    return Response.json(out, { headers: { 'cache-control': 'public, max-age=300' } });
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 502 });
  }
}
