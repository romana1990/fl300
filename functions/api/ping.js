// POST /api/ping {c: callsign, s: stage} → remember when each team first reached each stage.
// Data lives in KV metadata so the board can read everything with one list() call.
const STAGES = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return new Response(null, { status: 400 }); }
  const s = String(b?.s ?? '');
  if (!STAGES.has(s)) return new Response(null, { status: 400 });
  const c = String(b?.c ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 24) || 'anon';
  const key = 't:' + c.toUpperCase();
  const { metadata } = await env.FL300.getWithMetadata(key);
  const m = metadata || { c, st: {} };
  if (m.st[s]) return new Response(null, { status: 204 }); // only the first visit counts; saves KV writes
  m.st[s] = Date.now();
  await env.FL300.put(key, '', { metadata: m });
  return new Response(null, { status: 204 });
}
