// Poirot: Cloudflare Email Worker for poirot@fl300.xyz.
// Always forwards to Dario, auto-replies to recognised answers, logs everything to the board's KV.
import PostalMime from 'postal-mime';
import { EmailMessage } from 'cloudflare:email';
import { classify } from './match.js';
import { REPLIES, FROM_NAME, FROM_ADDR } from './replies.js';

const b64 = s => { const bytes = new TextEncoder().encode(s); let bin = ''; for (const b of bytes) bin += String.fromCharCode(b); return btoa(bin).replace(/.{76}/g, '$&\r\n'); };
const hdr = s => /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s).replace(/\r\n/g, '')}?=`;

function buildReply({ to, subject, inReplyTo, reply }) {
  const boundary = 'fl300-' + crypto.randomUUID();
  const subj = /^re:/i.test(subject) ? subject : 'Re: ' + (subject || 'Orient Express');
  const lines = [
    `From: "${FROM_NAME}" <${FROM_ADDR}>`,
    `To: <${to}>`,
    `Subject: ${hdr(subj)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@fl300.xyz>`,
    ...(inReplyTo ? [`In-Reply-To: ${inReplyTo}`, `References: ${inReplyTo}`] : []),
    'Auto-Submitted: auto-replied',
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(reply.text),
    `--${boundary}`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(`<!doctype html><html><body>${reply.html}</body></html>`),
    `--${boundary}--`,
    '',
  ];
  return lines.join('\r\n');
}

export default {
  async email(message, env) {
    const time = Date.now();
    let outcome = 'none', subject = '';
    const raw = await new Response(message.raw).arrayBuffer();

    try { await message.forward(env.FORWARD_TO); } catch (e) { console.log('forward failed', String(e)); }

    try {
      const mail = await PostalMime.parse(raw);
      subject = mail.subject || '';
      const auto = (message.headers.get('auto-submitted') || '').trim().toLowerCase();
      const ar = (mail.headers || []).find(h => h.key === 'authentication-results' && /^\s*mx\.cloudflare\.net/i.test(h.value));
      if ((auto && auto !== 'no') || /@fl300\.xyz$/i.test(message.from) || !ar || !/dmarc=pass/i.test(ar.value)) {
        outcome = 'ignored';
      } else {
        const body = mail.text || (mail.html || '').replace(/<(br|\/p|\/div)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
        outcome = classify(subject + '\n' + body);
        const reply = REPLIES[outcome];
        if (reply) {
          const raw = buildReply({ to: message.from, subject, inReplyTo: message.headers.get('message-id'), reply });
          await message.reply(new EmailMessage(FROM_ADDR, message.from, raw));
        }
      }
    } catch (e) {
      console.log('poirot error', String(e));
      outcome = outcome + ' / error';
    }

    try {
      const key = `p:${String(1e13 - time).padStart(13, '0')}:${crypto.randomUUID().slice(0, 8)}`; // newest first
      await env.FL300.put(key, '', { metadata: { time, from: message.from, subject: subject.slice(0, 140), outcome } });
    } catch (e) { console.log('kv failed', String(e)); }
  },
};
