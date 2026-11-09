// Classify an email to Poirot. Pure function: imported by the Worker and by tools/fl300.mjs verify.
const CORRECT = ['svi', 'sve', 'svako', 'svaki', 'svih', 'dvanaest', 'zajedno', 'everyone', 'everybody', 'all', 'twelve', '12', 'tous', 'toutes', 'ensemble'];
const STRANGER = ['stranger', 'stranac', 'stranca', 'nepoznat', 'nepoznati', 'uniform', 'uniforma', 'kondukter', 'conductor'];
const NAMES = ['milos', 'ema', 'danica', 'nikola', 'aleksa', 'aleksandra', 'ivan', 'nevena', 'pedja', 'peda', 'mikan', 'zorana'];

const fold = s => s.replace(/[đĐ]/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Drop quoted history: ">" lines, and everything from an "On … wrote:" / "… je napisao/la:" line on.
export function ownText(text) {
  const lines = String(text).split(/\r?\n/), out = [];
  for (const line of lines) {
    const l = fold(line);
    if (/(wrote|napisao(\/la)?|napisala|написао(\/ла)?|написала)\s*:\s*$/.test(l) || /^-+\s*original message\s*-+$/.test(l.trim())) {
      // Gmail wraps a long "On …, Name <addr> wrote:" over two lines: drop the first half too
      if (out.length && /^\s*(on |dana |uto|pon|sre|cet|pet|sub|ned)/.test(fold(out[out.length - 1]))) out.pop();
      break;
    }
    if (/^\s*>/.test(line)) continue;
    out.push(line);
  }
  return out.join('\n');
}

export function classify(text) {
  const t = fold(ownText(text))
    .replace(/\b\d{1,2}:\d{2}\b/g, ' ')             // times like 12:05 are not "12"
    .replace(/\b\d{1,2}\.\s?\d{1,2}\.(\s?\d{2,4}\.?)?/g, ' '); // nor dates like 12.11.
  const has = w => new RegExp(`(^|[^a-z0-9])${w}($|[^a-z0-9])`).test(t);
  if (CORRECT.some(has)) return 'correct';
  if (STRANGER.some(has)) return 'stranger';
  const names = new Set(NAMES.filter(has).map(n => n === 'peda' ? 'pedja' : n));
  if (names.size === 1) return 'wrong';
  return 'none';
}
