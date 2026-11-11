#!/usr/bin/env node
// FL300 tooling. No dependencies. Usage:
//   node tools/fl300.mjs hash <answer>      → folder for an answer
//   node tools/fl300.mjs rot4 <text>        → shift letters +4 (opener)
//   node tools/fl300.mjs audio <freq>       → /a/<hex>.mp3 for a radio frequency
//   node tools/fl300.mjs glyphs             → (re)draw site/g/i..vi .svg (+ .png if ImageMagick is installed)
//   node tools/fl300.mjs verify [baseUrl]   → all checks; with a URL also checks the live site
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

// The browser's own common.js, so hashing here can never drift from the site.
const FL = vm.runInNewContext(read('site/js/common.js') + ';FL', { crypto: webcrypto, TextEncoder });

// ---- answer key (tools/ is never deployed) ---------------------------------
export const STAGES = [
  // [stage, name, answer that unlocks it]
  [2, 'NAVIGATIO', '1331'],
  [3, 'CORVINVS', 'DRAKUL'],
  [4, 'COLVMNA', 'TRAIANUS'],
  [5, 'CINEMA', 'DACIA'],
  [6, 'ORIENT EXPRESS', 'ORIENT'],
  [8, 'MELITA', 'MALTEŠKI KRST'],
  [9, 'INVITE', 'MELITA'],
];
export const STAGE7 = '/c7e04b9a1f5d2e83/'; // random, delivered by Poirot's email
const WRONG = ['1330', 'DRACULA', 'DRAKULA', 'TRAJAN', 'DAKIJA', 'APPLE', 'MURDER', 'MALTA', 'KRST', 'TEMPLAR', 'POIROT'];

const rot = (s, k) => s.replace(/[a-z]/gi, ch => {
  const b = ch <= 'Z' ? 65 : 97; return String.fromCharCode((ch.charCodeAt(0) - b + k + 26) % 26 + b);
});

const canonFreq = f => { const n = Number(f); if (!(n > 100 && n < 140)) throw new Error('bad frequency ' + f); return FL.freq(n, n < 118); };

// ---- Templar cipher: dCode "Normal, historical version (1)" -----------------
// shape: chevron (open, 3 points), tri (closed, 3), kite (closed, 4), x. dir = where the point/apex is.
export const TEMPLAR = {
  A: ['chevron', 'down', 0], B: ['chevron', 'left', 0], C: ['chevron', 'up', 0], D: ['chevron', 'right', 0],
  E: ['tri', 'right', 0], F: ['tri', 'left', 0], G: ['tri', 'up', 0], H: ['tri', 'down', 0],
  I: ['kite', 'down', 0], K: ['kite', 'left', 0], L: ['kite', 'up', 0], M: ['kite', 'right', 0], N: ['x', '-', 0],
  O: ['chevron', 'down', 1], P: ['chevron', 'left', 1], Q: ['chevron', 'up', 1], R: ['chevron', 'right', 1],
  S: ['tri', 'down', 1], T: ['tri', 'left', 1], U: ['tri', 'up', 1], V: ['tri', 'right', 1],
  W: ['kite', 'up', 1], X: ['kite', 'down', 1], Y: ['kite', 'left', 1], Z: ['kite', 'right', 1],
};
export const FRAGMENTS = [['i', 'M'], ['ii', 'E'], ['iii', 'L'], ['iv', 'I'], ['v', 'T'], ['vi', 'A']];

function glyphSVG(letter) {
  const [shape, dir, dot] = TEMPLAR[letter];
  // drawn pointing down, then rotated
  const base = { chevron: '14,12 50,88 86,12', tri: '12,14 88,14 50,88', kite: '50,10 24,38 50,90 76,38' }[shape];
  const rotDeg = { down: 0, left: 90, up: 180, right: 270, '-': 0 }[dir];
  const pts = base && base.split(' ').map(p => p.split(',').map(Number)).map(([x, y]) => {
    const a = rotDeg * Math.PI / 180, dx = x - 50, dy = y - 50;
    return [50 + dx * Math.cos(a) - dy * Math.sin(a), 50 + dx * Math.sin(a) + dy * Math.cos(a)].map(v => +v.toFixed(2)).join(',');
  }).join(' ');
  const st = 'fill="none" stroke="#000" stroke-width="9" stroke-linejoin="miter" stroke-miterlimit="10"';
  const body = shape === 'x' ? `<path d="M15 15 85 85M85 15 15 85" ${st}/>`
    : shape === 'chevron' ? `<polyline points="${pts}" ${st}/>` : `<polygon points="${pts}" ${st}/>`;
  const dotXY = { chevron: [50, 36], tri: [50, 36], kite: [50, 40] }[shape] || [50, 50];
  const d = dot ? (() => { const a = rotDeg * Math.PI / 180, dx = dotXY[0] - 50, dy = dotXY[1] - 50;
    return `<circle cx="${+(50 + dx * Math.cos(a) - dy * Math.sin(a)).toFixed(2)}" cy="${+(50 + dx * Math.sin(a) + dy * Math.cos(a)).toFixed(2)}" r="7" fill="#000" stroke="none"/>`; })() : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120">${body}${d}</svg>\n`;
}

// Stage 8 frame: every Templar glyph in a fixed scrambled order (NOT alphabetical, so the border is no key).
const BORDER_ORDER = 'QKEXTBNHZAWOGLDRVIMSUCYFP';
function borderSVG(vertical, color = '#8e1b17') {
  const step = 150, n = BORDER_ORDER.length, glyphs = [...BORDER_ORDER].map((L, i) => {
    const inner = glyphSVG(L).replace(/^<svg[^>]*>|<\/svg>\s*$/g, '').replaceAll('#000', color);
    const [x, y] = vertical ? [0, i * step + 25] : [i * step + 25, 0];
    return `<g transform="translate(${x} ${y})">${inner}</g>`;
  }).join('');
  const [w, h] = vertical ? [100, n * step] : [n * step, 100];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${glyphs}</svg>\n`;
}

function classifySVG(svg) {
  const pts = s => s.trim().split(/\s+/).map(p => p.split(',').map(Number));
  const dot = /<circle/.test(svg) ? 1 : 0;
  const dirOf = (from, to) => { const dx = to[0] - from[0], dy = to[1] - from[1];
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); };
  const c = P => [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];
  let m;
  if ((m = svg.match(/<polyline points="([^"]+)"/))) { const P = pts(m[1]); return ['chevron', dirOf(c([P[0], P[2]]), P[1]), dot]; }
  if ((m = svg.match(/<polygon points="([^"]+)"/))) {
    const P = pts(m[1]), C = c(P);
    if (P.length === 3) { // apex = vertex with two equal edges
      const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const apex = P.find((p, i) => Math.abs(d(p, P[(i + 1) % 3]) - d(p, P[(i + 2) % 3])) < 0.5);
      return ['tri', dirOf(c(P.filter(p => p !== apex)), apex), dot];
    }
    const far = P.reduce((a, p) => Math.hypot(p[0] - C[0], p[1] - C[1]) > Math.hypot(a[0] - C[0], a[1] - C[1]) ? p : a);
    return ['kite', dirOf(C, far), dot];
  }
  if (/<path d="M15 15 85 85M85 15 15 85"/.test(svg)) return ['x', '-', dot];
  return null;
}
const letterOf = sig => Object.keys(TEMPLAR).find(k => TEMPLAR[k].join() === sig?.join());

// ---- Orient Express: the clue logic -----------------------------------------
// Stage 6 integram. People / destinations / drinks by index; c = compartment 0..4 (No. 1..5, No. 5 is next to the dining car).
// Each clue mirrors one line of "The conductor's notes" on the page, in the same order.
export const ORIENT = {
  people: ['Ema', 'Ivan', 'Nevena', 'Nikola', 'Pedja'],
  dest: ['Trieste', 'Zagreb', 'Belgrade', 'Sofia', 'Istanbul'], // route order
  drink: ['tea', 'coffee', 'champagne', 'rakija', 'water'],
  answer: 'Nikola', last: 4,
};
{
  const by = (a, v) => a.indexOf(v);
  const [EM, IV, NE, NI, PE] = [0, 1, 2, 3, 4], [TRI, ZAG, BEL, SOF, IST] = [0, 1, 2, 3, 4], [TEA, COF, CHA, RAK, WAT] = [0, 1, 2, 3, 4];
  ORIENT.clues = [
    s => s.k[by(s.c, 0)] === CHA,       //  1 champagne went to No. 1
    s => s.k[PE] === RAK,               //  2 Peđa drank rakija
    s => s.d[IV] === IST,               //  3 Ivan to the end of the line
    s => s.c[by(s.d, SOF)] === 3,       //  4 Sofia is in No. 4
    s => s.d[by(s.k, RAK)] === BEL,     //  5 rakija gets off at Belgrade
    s => s.k[NE] === COF,               //  6 Nevena coffee
    s => s.c[IV] === 1,                 //  7 Ivan in No. 2
    s => s.d[by(s.k, WAT)] === ZAG,     //  8 Zagreb drank water
    s => s.c[PE] === 2,                 //  9 Peđa in No. 3
    s => s.d[EM] !== ZAG,               // 10 Ema not to Zagreb
  ];
}
function solveOrient(clues = ORIENT.clues) {
  const perms = a => a.length < 2 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(r => [x, ...r]));
  const P5 = perms([0, 1, 2, 3, 4]), out = [];
  for (const c of P5) for (const k of P5) for (const d of P5) { const s = { c, k, d }; if (clues.every(f => f(s))) out.push(s); }
  return out;
}

// ---- verify -----------------------------------------------------------------
async function verify(base) {
  let fails = 0;
  const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fails++; };
  const exists = p => fs.existsSync(path.join(SITE, p));

  console.log('1. answers → folders');
  ok(exists('404.html'), '404.html exists');
  for (const [n, name, ans] of STAGES) { const p = await FL.path(ans); ok(exists(p + 'index.html'), `stage ${n} ${name}: "${ans}" → ${p}`); }
  for (const ans of ['ORIENT EXPRESS', 'THE ORIENT EXPRESS', 'MURDER ON THE ORIENT EXPRESS']) {
    const p = await FL.path(ans), f = p + 'index.html';
    ok(exists(f) && fs.readFileSync(path.join(SITE, f), 'utf8').includes(await FL.path('ORIENT')), `alias "${ans}" → ${p} redirects to stage 6`);
  }
  ok(exists(STAGE7 + 'index.html'), `stage 7 CRVCIVERBVM (Poirot's link) → ${STAGE7}`);
  for (const w of WRONG) { const p = await FL.path(w); ok(!exists(p), `wrong "${w}" → ${p} absent`); }
  for (const [a, b] of [['malteški krst', 'MALTESKI KRST'], ['Drakul', 'DRAKVL'], ['traianus', 'TRAJANUS']])
    ok(await FL.path(a) === await FL.path(b), `"${a}" ≡ "${b}"`);
  if (base) {
    for (const [n, , ans] of STAGES) { const r = await fetch(base + await FL.path(ans), { method: 'HEAD' }); ok(r.status === 200, `live stage ${n}: HTTP ${r.status}`); }
    const r7 = await fetch(base + STAGE7, { method: 'HEAD' }); ok(r7.status === 200, `live stage 7: HTTP ${r7.status}`);
    for (const w of WRONG.slice(0, 4)) { const r = await fetch(base + await FL.path(w), { method: 'HEAD' }); ok(r.status === 404, `live wrong "${w}": HTTP ${r.status}`); }
  }

  console.log('2. opener');
  ok(rot('TRIGINTA', 4) === 'XVMKMRXE', 'ROT4(TRIGINTA) = XVMKMRXE');

  console.log('3. chronogram');
  {
    const txt = read('content/pastelink.txt'), chrono = txt.split('\n\n')[0];
    const V = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const sum = [...chrono].reduce((a, ch) => a + (V[ch] || 0), 0);
    ok(sum === 1331, `sum of capital numerals = ${sum}`);
    ok(!/[ivxlcdm]/.test(chrono), 'no lowercase numeral letters in the chronogram');
    ok(!/[A-Z]/.test(chrono.replace(/[IVXLCDM]/g, '')), 'only numerals are capitalised');
    ok(/Summa litterarum numeralium clavis est\./.test(txt) && /Porta: fl300\.xyz/.test(txt), 'key line and door line present');
  }

  console.log('4. book cipher (Corvinus)');
  {
    const html = fs.readFileSync(path.join(SITE, await FL.path('DRAKUL'), 'index.html'), 'utf8');
    const refs = [...html.matchAll(/<li class="ref">([^<]+)<\/li>/g)].map(m => m[1].split('·').map(s => s.trim()));
    const book = html.slice(html.indexOf('<article class="book"'));
    const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    // sections: <h3>DATE…</h3> then <p>… until next h3 / hr / h2
    const sections = {};
    for (const m of book.matchAll(/<h3>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3>|<hr>|<h2>|<\/article>)/g)) {
      const head = strip(m[1]); const date = (head.match(/^\d+ (May|June)/) || [])[0];
      if (!date) continue;
      (sections[date] ||= []).push([...m[2].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(p => strip(p[1]).split(/\s+/).filter(Boolean)));
    }
    let out = '';
    for (const [date, p, w] of refs) {
      const secs = sections[date];
      const unique = secs && secs.length === 1;
      const word = unique ? secs[0][+p - 1]?.[+w - 1] : undefined;
      const prefix = unique ? secs[0][+p - 1].slice(0, +w - 1).join(' ') : '';
      ok(unique && word && !/[-—–\d]/.test(prefix), `${date} · ${p} · ${w} → ${word} (heading unique, clean prefix)`);
      out += word ? word[0].toUpperCase() : '?';
    }
    ok(out === 'TRAIANUS', `refs spell ${out}`);
    ok(/From Jonathan Harker’s diary\. First letter\./.test(html), 'instruction line present');
  }

  console.log('5. scytale (Columna)');
  {
    const html = fs.readFileSync(path.join(SITE, await FL.path('TRAIANUS'), 'index.html'), 'utf8');
    const strip = html.match(/data-strip="([A-Z]+)"/)[1], L = strip.length;
    // same model as the page: column c = strip[⌊c·L/w⌋ … ⌊(c+1)·L/w⌋−1], read rows left → right
    const readAt = w => { const f = c => Math.floor(c * L / w), k = Math.ceil(L / w); let s = '';
      for (let r = 0; r < k; r++) for (let c = 0; c < w; c++) if (f(c) + r < f(c + 1)) s += strip[f(c) + r]; return s; };
    ok(L % 23 === 0, `strip length ${L} = 23 × ${L / 23}`);
    const plain = readAt(23);
    ok(plain.startsWith('SENATVSPOPVLVSQVEROMANVS') && plain.endsWith('CLAVISDACIA'), 'w = 23 reads SENATVS … CLAVIS DACIA');
    const hits = []; for (let w = 2; w <= 40; w++) if (/CLAVISDACIA|SENATVS/.test(readAt(w))) hits.push(w);
    ok(hits.join() === '23', `only w = 23 produces the plaintext (hits: ${hits.join(',')})`);
    const rom = r => { const v = { I: 1, V: 5, X: 10, L: 50 }; let n = 0; for (let i = 0; i < r.length; i++) n += v[r[i]] < v[r[i + 1]] ? -v[r[i]] : v[r[i]]; return n; };
    const at = [...html.matchAll(/class="ring" data-at="([IVXL]+)·([IVXL]+)"/g)].map(m => [rom(m[1]), rom(m[2])]);
    const code = at.map(([l, c]) => plain[(l - 1) * 23 + c - 1]).join('');
    ok(code === 'DACIA', `cryptex plates (line·letter at w = 23) read ${code}`);
    ok(at.every(([l, c]) => !(l === 7 && c >= 18)), 'plates avoid the CLAVIS DACIA ending');
  }

  console.log('6. Orient Express (integram)');
  {
    const sols = solveOrient(), O = ORIENT;
    ok(sols.length === 1, `the conductor's notes have exactly one solution (${sols.length})`);
    if (sols.length === 1) {
      const s = sols[0], six = O.people[s.c.indexOf(O.last)];
      ok(six === O.answer, `No. ${O.last + 1}, next to the dining car: ${six}`);
      console.log('       ' + O.people.map((p, i) => `${p} No.${s.c[i] + 1} ${O.dest[s.d[i]]} ${O.drink[s.k[i]]}`).join(' · '));
    }
    const needed = O.clues.map((_, i) => solveOrient(O.clues.filter((_, j) => j !== i)).length > 1);
    ok(needed.every(Boolean), 'every note is needed' + (needed.every(Boolean) ? '' : ' (redundant: ' + needed.map((n, i) => n ? '' : i + 1).filter(Boolean) + ')'));
    const html = fs.readFileSync(path.join(SITE, await FL.path('ORIENT'), 'index.html'), 'utf8');
    const notes = (html.match(/<ol class="notes">([\s\S]*?)<\/ol>/) || [, ''])[1].match(/<li>/g) || [];
    ok(notes.length === O.clues.length, `page lists ${notes.length} notes (model has ${O.clues.length})`);
    ok(/poirot&#64;fl300\.xyz/.test(html), 'burnt note carries poirot@fl300.xyz');
    ok(!/<form class="answer"/.test(html), 'no answer box (the answer goes to Poirot)');
  }

  console.log('7. skandinavka');
  {
    const sol = JSON.parse(read('tools/skandinavka.json'));
    const html = fs.readFileSync(path.join(SITE, STAGE7, 'index.html'), 'utf8');
    const page = JSON.parse(html.match(/<script type="application\/json" id="puzzle">([\s\S]*?)<\/script>/)[1]);
    const G = sol.grid, H = G.length, W = G[0].length;
    ok(page.w === W && page.h === H, `size ${W}×${H}`);
    ok(!/[A-ZČĆŠŽĐ]{2,}/.test(JSON.stringify(page.cells.filter(c => c.t === 'L'))), 'page carries no solution letters');
    // words from the solution grid, per clue on the page
    let bad = 0, words = [];
    for (const cl of page.clues) {
      let [r, c] = cl.start; const [dr, dc] = cl.dir === 'A' ? [0, 1] : [1, 0]; let w = '';
      while (r < H && c < W && G[r][c] && G[r][c] !== '#') { w += G[r][c]; r += dr; c += dc; }
      words.push(w);
      if (w.length < 2 || w !== sol.answers[cl.id]) { bad++; console.log('       entry mismatch', cl.id, w, sol.answers[cl.id]); }
      if (/LJ|NJ|DŽ/.test(w)) { bad++; console.log('       forbidden digraph', w); }
      if (/MALT/.test(w)) { bad++; console.log('       gives answer away', w); }
      if (!cl.text) { bad++; console.log('       no clue text', cl.id); }
    }
    ok(bad === 0, `${page.clues.length} entries, all match their clues, no LJ/NJ/DŽ, no MALTA`);
    // every letter cell is covered by a clued entry
    const cov = new Set(); for (const cl of page.clues) { let [r, c] = cl.start; const [dr, dc] = cl.dir === 'A' ? [0, 1] : [1, 0]; while (r < H && c < W && G[r][c] && G[r][c] !== '#') { cov.add(r + ',' + c); r += dr; c += dc; } }
    let letters = 0; G.forEach((row, r) => row.forEach((v, c) => { if (v && v !== '#') { letters++; if (!cov.has(r + ',' + c)) { bad++; console.log('       uncovered', r, c); } } }));
    ok(cov.size === letters, `all ${letters} letter cells belong to a clued entry`);
    ok(new Set(words).size === words.length, 'no repeated entries');
    const shaded = page.shaded.map(([r, c]) => G[r][c]).join('');
    ok(FL.norm(shaded) === FL.norm('MALTESKIKRST'), `shaded 1–12 = ${shaded}`);
    const flat = G.flat().filter(v => v && v !== '#').join('');
    ok(page.check === await FL.sha16('fl300:grid:' + FL.norm(flat)), 'check-grid hash matches the solution');
  }

  console.log('8. footer glyphs');
  for (const [n, L] of FRAGMENTS) {
    const f = path.join(SITE, 'g', n + '.svg');
    const got = fs.existsSync(f) ? letterOf(classifySVG(fs.readFileSync(f, 'utf8'))) : null;
    ok(got === L, `Fragmentum ${n.toUpperCase()} (g/${n}.svg) reads ${got} — expected ${L}`);
    ok(fs.existsSync(path.join(SITE, 'g', n + '.png')), `g/${n}.png exists`);
  }
  {
    const pages = [[await FL.path('1331'), 'i'], [await FL.path('DRAKUL'), 'ii'], [await FL.path('TRAIANUS'), 'iii'], [await FL.path('DACIA'), 'iv'], [STAGE7, 'vi']];
    for (const [p, n] of pages) { const h = fs.readFileSync(path.join(SITE, p, 'index.html'), 'utf8'); ok(h.includes(`data-frag="${n}"`), `${p} shows Fragmentum ${n.toUpperCase()}`); }
    const replies = read('email-worker/src/replies.js');
    ok(replies.includes('/g/v.png') && replies.includes(STAGE7), "Poirot's correct reply carries Fragmentum V and the stage 7 link");
  }

  console.log('9. cockpit audio files (Dario supplies the mp3s)');
  for (const [f, what] of [['125.025', 'ATIS'], ['133.100', 'Beograd Radar'], ['118.100', 'Beograd Tower'], ['121.500', 'numbers station']]) {
    const a = await FL.audio(canonFreq(f));
    console.log(`       ${f} ${what.padEnd(16)} → site${a} ${exists(a) ? '(present)' : '(missing)'}`);
  }

  console.log('10. Poirot matcher');
  {
    const { classify } = await import(path.join(ROOT, 'email-worker/src/match.js'));
    const cases = [['Nikola', 'correct'], ['Mislimo da je Nikola!', 'correct'], ['Bio je to nikola iz broja 6', 'correct'], ['Uhvatili smo Nikolu', 'correct'],
      ['It was Nikola, No. 6', 'correct'], ['Milos', 'wrong'], ['Ema i Milos', 'wrong'], ['Peđa', 'wrong'], ['Mislimo da je Pedja', 'wrong'],
      ['svi', 'none'], ['hmm no idea', 'none'], ['Nikolaj Tesla', 'none'], ['> Nikola\nhmm', 'none'],
      ['Milos\n\nOn Tue, 10 Nov 2026 Poirot wrote:\n> Nikola', 'wrong']];
    for (const [t, want] of cases) { const got = classify(t); ok(got === want, `"${t.replace(/\n/g, '⏎')}" → ${got}`); }
  }

  console.log(fails ? `\n${fails} check(s) FAILED` : '\nAll checks passed.');
  process.exitCode = fails ? 1 : 0;
}

// ---- CLI ----------------------------------------------------------------------
const [cmd, ...args] = process.argv.slice(2);
const arg = args.join(' ');
if (cmd === 'hash') console.log(`${FL.norm(arg)} → ${await FL.path(arg)}`);
else if (cmd === 'rot4') console.log(rot(arg, 4));
else if (cmd === 'audio') { const c = canonFreq(arg); console.log(`${c} → site${await FL.audio(c)}`); }
else if (cmd === 'glyphs') {
  for (const [n, L] of FRAGMENTS) {
    const f = path.join(SITE, 'g', n + '.svg'); fs.writeFileSync(f, glyphSVG(L));
    try { execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--default-background-color=00000000', '--window-size=120,120', '--screenshot=' + path.join(SITE, 'g', n + '.png'), 'file://' + f], { stdio: 'ignore' }); }
    catch { console.log('Chrome not found: PNG not written for', n); }
    console.log(`g/${n}.svg  Fragmentum ${n.toUpperCase()}`);
  }
  if (args[0] === 'all' && args[1]) for (const L in TEMPLAR) fs.writeFileSync(path.join(args[1], L + '.svg'), glyphSVG(L)); // whole alphabet, for comparing with dCode
}
else if (cmd === 'border') {
  fs.writeFileSync(path.join(SITE, 'img', 'templar-border-h.svg'), borderSVG(false));
  fs.writeFileSync(path.join(SITE, 'img', 'templar-border-v.svg'), borderSVG(true));
  console.log('img/templar-border-h.svg, img/templar-border-v.svg (order ' + BORDER_ORDER + ')');
}
else if (cmd === 'verify') await verify(args[0]?.replace(/\/$/, ''));
else console.log('usage: node tools/fl300.mjs hash <answer> | rot4 <text> | audio <freq> | glyphs | border | verify [https://fl300.xyz]');
