// Poirot's replies. Edit freely, then `npx wrangler deploy` from email-worker/.
// Each reply has a plain-text and an HTML version (multipart/alternative).
export const FROM_NAME = 'Hercule Poirot';
export const FROM_ADDR = 'poirot@fl300.xyz';

const NEXT = 'https://fl300.xyz/c7e04b9a1f5d2e83/';
import { GLYPH_PNG } from './glyph.js';
const GLYPH = 'https://fl300.xyz/g/v.png'; // plain-text fallback link; the HTML embeds the image (cid:) so no "load images" click is needed
const GLYPH_CID = 'fragmentum-v@fl300.xyz';

const p = s => `<p style="margin:0 0 14px">${s}</p>`;
const wrap = body => `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.5;color:#222;max-width:34em">${body}</div>`;

export const REPLIES = {
  correct: {
    text: `Précisément, mon ami.

Compartment No. 5, the one beside the dining car. Mineral water, a ticket to Zagreb, and crumbs on the sleeve: Nikola.

I shall say nothing to the Compagnie. A man is entitled to cake on a birthday journey, even when it is not his birthday.

Your journey continues: ${NEXT}

Fragmentum V — ${GLYPH}

Hercule Poirot`,
    html: wrap(
      p('Précisément, <i>mon ami</i>.') +
      p('Compartment No. 5, the one beside the dining car. Mineral water, a ticket to Zagreb, and crumbs on the sleeve: Nikola.') +
      p('I shall say nothing to the Compagnie. A man is entitled to cake on a birthday journey, even when it is not his birthday.') +
      p(`Your journey continues: <a href="${NEXT}" style="color:#222"><b>${NEXT}</b></a>`) +
      p(`<i>Fragmentum V</i><br><img src="cid:${GLYPH_CID}" alt="" width="72" height="72" style="display:block;margin-top:8px;background:#fff">`) +
      p('Hercule Poirot')),
    image: { cid: GLYPH_CID, name: 'fragmentum-v.png', b64: GLYPH_PNG },
  },
  wrong: {
    text: `Non, non, mon ami. That passenger slept far from the dining car. Read the conductor's notes again; the little grey cells, they must work.
— H.P.`,
    html: wrap(p('Non, non, <i>mon ami</i>. That passenger slept far from the dining car. Read the conductor’s notes again; the little grey cells, they must work.') + p('— H.P.')),
  },
};
