// FL300 shared script: normalise, hash, submit, progress ping, footer glyph.
// Also loaded by tools/fl300.mjs (in a vm), so the hash scheme can never drift.
const FL = {
  norm: s => String(s).replace(/đ/gi, 'D')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]/g, '')
    .replace(/J/g, 'I').replace(/U/g, 'V'),

  async sha16(s) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 16);
  },

  async path(s) { return '/' + await FL.sha16('fl300:' + FL.norm(s)) + '/'; },

  // canonical radio frequency → audio file. COM: 3 decimals, NAV: 2 decimals.
  freq(f, nav) { return Number(f).toFixed(nav ? 2 : 3); },
  async audio(canon) { return '/a/' + await FL.sha16('fl300:a:' + canon) + '.mp3'; },

  callsign(v) {
    try {
      if (v !== undefined) localStorage.setItem('fl300.callsign', v);
      return localStorage.getItem('fl300.callsign') || '';
    } catch { return ''; }
  },

  ping(stage) {
    try {
      fetch('/api/ping', {
        method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ c: FL.callsign() || 'anon', s: String(stage) })
      }).catch(() => {});
    } catch {}
  },

  async submit(answer) {
    if (!FL.norm(answer)) return false;
    const p = await FL.path(answer);
    try {
      const r = await fetch(p, { method: 'HEAD', cache: 'no-store' });
      if (r.ok) { location.href = p; return true; }
    } catch {}
    return false;
  },

  // <form class="answer"> with one input and an output.verdict
  wire(form) {
    const input = form.querySelector('input'), out = form.querySelector('.verdict');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      out.textContent = '';
      form.classList.add('busy');
      const ok = await FL.submit(input.value);
      form.classList.remove('busy');
      if (!ok) { out.textContent = 'Verbum falsum est.'; input.select(); }
    });
  },

  // <footer data-frag="iv"> → glyph image + "Fragmentum IV"
  footer(el) {
    const n = el.dataset.frag;
    el.insertAdjacentHTML('afterbegin',
      `<span class="frag"><img src="/g/${n}.png" alt="" width="40" height="40"><span>Fragmentum ${n.toUpperCase()}</span></span>`);
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const stage = document.body.dataset.stage;
    if (stage) FL.ping(stage);
    document.querySelectorAll('form.answer:not(.callsign)').forEach(FL.wire);
    document.querySelectorAll('footer[data-frag]').forEach(FL.footer);
  });
}
