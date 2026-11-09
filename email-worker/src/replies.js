// Poirot's replies. Edit freely, then `npx wrangler deploy` from email-worker/.
// Each reply has a plain-text and an HTML version (multipart/alternative).
export const FROM_NAME = 'Hercule Poirot';
export const FROM_ADDR = 'poirot@fl300.xyz';

const NEXT = 'https://fl300.xyz/c7e04b9a1f5d2e83/';
const GLYPH = 'https://fl300.xyz/g/v.png'; // Fragmentum V; alt="" so the letter isn't given away

const p = s => `<p style="margin:0 0 14px">${s}</p>`;
const wrap = body => `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.5;color:#222;max-width:34em">${body}</div>`;

export const REPLIES = {
  correct: {
    text: `Mes amis,

Twelve marks upon the cake. Some deep, some timid, one from a left hand, one that hesitated. Not the work of one hand, but of twelve. Each of you had a reason; each of you swore for another; and so each of you is guilty.

There are, as always, two solutions. The first: a stranger in the uniform of the Wagon-Lit boarded at Vinkovci, ate the cake, and disappeared into the snow. The second you have just written to me. I shall offer the first to the Yugoslav police — and say nothing more.

Your journey continues: ${NEXT}

Fragmentum V — ${GLYPH}

Hercule Poirot`,
    html: wrap(
      p('Mes amis,') +
      p('Twelve marks upon the cake. Some deep, some timid, one from a left hand, one that hesitated. Not the work of one hand, but of twelve. Each of you had a reason; each of you swore for another; and so each of you is guilty.') +
      p('There are, as always, two solutions. The first: a stranger in the uniform of the Wagon-Lit boarded at Vinkovci, ate the cake, and disappeared into the snow. The second you have just written to me. I shall offer the first to the Yugoslav police — and say nothing more.') +
      p(`Your journey continues: <a href="${NEXT}" style="color:#222"><b>${NEXT}</b></a>`) +
      p(`<i>Fragmentum V</i><br><img src="${GLYPH}" alt="" width="72" height="72" style="display:block;margin-top:8px">`) +
      p('Hercule Poirot')),
  },
  stranger: {
    text: `Ah, the man in the Wagon-Lit uniform who vanished at Vinkovci. C'est possible. That is the solution I shall give to the police. But to me, mon ami, you will tell the truth.
— H.P.`,
    html: wrap(p('Ah, the man in the Wagon-Lit uniform who vanished at Vinkovci. C’est possible. That is the solution I shall give to the police. But to me, <i>mon ami</i>, you will tell the truth.') + p('— H.P.')),
  },
  wrong: {
    text: `Non, non, mon ami. The little grey cells, they are not yet working.
— H.P.`,
    html: wrap(p('Non, non, <i>mon ami</i>. The little grey cells, they are not yet working.') + p('— H.P.')),
  },
};
