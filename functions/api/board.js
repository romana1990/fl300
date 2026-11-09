// GET /api/board?k=BOARD_KEY → teams + Poirot's post, for Dario only.
export async function onRequestGet({ request, env }) {
  const k = new URL(request.url).searchParams.get('k');
  if (!env.BOARD_KEY || k !== env.BOARD_KEY) return new Response('Forbidden', { status: 403 });
  const all = async prefix => {
    const out = []; let cursor;
    do {
      const r = await env.FL300.list({ prefix, cursor });
      out.push(...r.keys.map(x => x.metadata).filter(Boolean));
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
    return out;
  };
  const [teams, post] = await Promise.all([all('t:'), all('p:')]); // p: keys sort newest first
  return Response.json({ now: Date.now(), teams, post }, { headers: { 'cache-control': 'no-store' } });
}
