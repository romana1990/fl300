// Classify an email to Poirot. Pure function: imported by the Worker and by tools/fl300.mjs verify.
// The culprit, in any Serbian case (Nikola, Nikole, Nikoli, Nikolu, Nikolom). Any other guest's name alone is a wrong guess.
const CULPRIT = 'nikol(a|e|i|u|om)';
const NAMES = ['milos', 'milosa', 'ema', 'emu', 'ivan', 'ivana', 'nevena', 'nevenu', 'pedja', 'peda', 'pedju', 'pedu', 'danica', 'danicu', 'aleksa', 'aleksu',
  'aleksandra', 'aleksandru', 'mikan', 'mikana', 'zorana', 'zoranu'];

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
  const t = fold(ownText(text));
  const has = w => new RegExp(`(^|[^a-z0-9])(${w})($|[^a-z0-9])`).test(t);
  if (has(CULPRIT)) return 'correct';
  if (NAMES.some(has)) return 'wrong';
  return 'none';
}
