# RUNBOOK — FL300: ITER TRIGINTA

Dario's checklist for the 30th‑birthday hunt. The build spec for Claude is `PROMPT.md`.

- **Send opener:** Wed 11 Nov 2026, 20:00 (WhatsApp group)
- **Party:** Sat 14 Nov 2026, 20:00, Grand Central Pizza Bar, Belgrade
- **Players:** 12 people / 8 teams: Milos & Ema · Danica & Nikola · Aleksa & Danica · Aleksandra & Ivan · Nevena · Peđa · Zorana · Mikan (remote, not at the party)

---

## 1. Answer key (keep private)

| # | Stage | Players do | Answer | Off‑site |
|---|---|---|---|---|
| 0 | INITIVM | Find faint text in the black image; `ROT XXX` = shift 4 back | pastelink URL + password **TRIGINTA** (`XVMKMRXE`) | WhatsApp, pastelink |
| 1 | LAPIS | Sum the capital Roman numerals in the chronogram | **1331** at fl300.xyz | pastelink |
| 2 | NAVIGATIO | PWR on → tune 133.100 Radar → hear "transmissions on 121.5" → tune 121.500 → numbers station → find fixes on the ILS 12L chart | **DRAKUL** | — |
| 3 | CORVINVS | Book cipher on Harker's diary (hosted): date · paragraph · word, first letter | **TRAIANUS** | — |
| 4 | COLVMNA | Slide windings to 23 (Trajan's Column frieze) → Latin reads → cryptex plates (line·letter) pick D A C I A; also ends CLAVIS DACIA. APPLE is a red herring | **DACIA** | — |
| 5 | CINEMA | Watch six clips, name each film's star; the one film all six share is *Murder on the Orient Express* (2017) | **ORIENT** (also ORIENT EXPRESS, THE ORIENT EXPRESS, MURDER ON THE ORIENT EXPRESS) | IMDb |
| 6 | ORIENT EXPRESS | Warm the burnt note (Poirot's question + address); integram from the conductor's 10 notes → who is in No. 5, next to the dining car | email **"Nikola"** to poirot@fl300.xyz | email |
| 7 | CRVCIVERBVM | Skandinavka, shaded cells | **MALTEŠKI KRST** | — |
| 8 | MELITA | Decode the six footer glyphs with the Templar cipher | **MELITA** | — |
| 9 | Invite | — | — | — |

Glyphs: I cockpit **M** · II Corvin **E** · III Column **L** · IV Cinema **I** · V Poirot's email **T** · VI Skandinavka **A**.

Numbers station decode: 15.7 BGD·1 **D**EVDA · 12.9 BGD·3 OB**R** · 11.7 BGD·2 L**A**BUD · R321 BGD·3 TI**K**VU · 11.7 BGD·4 LAB**U**D · 28.0 VAL·1 **L**OGAR.

Cinema clips (in this order) → star → role in *Murder on the Orient Express* (2017): 1 Harry Potter and the Chamber of Secrets → Kenneth Branagh (Lockhart) → Poirot · 2 Pirates of the Caribbean → Johnny Depp → Ratchett · 3 Star Wars: The Force Awakens → Daisy Ridley → Mary Debenham · 4 Frozen → Josh Gad (Olaf) → MacQueen · 5 Skyfall → Judi Dench (M) → Princess Dragomiroff · 6 Spider-Man (2002) → Willem Dafoe (Green Goblin) → Hardman.

---

## 2. Timeline

### Mon 9 Nov (tonight)
- [ ] Buy **fl300.xyz** on Cloudflare Registrar.
- [ ] Create **private** GitHub repo (e.g. `romana1990/fl300`), push this folder.
- [ ] Open Claude Code in `~/Documents/Projects/30Party`, say: *"Read PROMPT.md and build it."*
- [ ] ElevenLabs account (free tier is enough).

### Tue 10 Nov
- [ ] Record the 4 audio files (§4) → process (§4) → give to Claude, who renames them with `node tools/fl300.mjs audio <freq>`.
- [ ] Cut the cinema reel (§5) → `/v/reel.mp4`.
- [ ] As soon as Claude writes `content/pastelink.txt`: create the pastelink bin (§3), password `TRIGINTA`, note the URL.
- [ ] `node tools/fl300.mjs rot4 "<pastelink URL>"` → make the opener image (§3).
- [ ] Review Orient Express suspects: swap any `<!-- DARIO: check -->` trait for real, harmless details about each friend.
- [ ] Review skandinavka clues (Serbian, tone, difficulty).
- [ ] Fill the venue address in the invite.
- [ ] Cloudflare: connect Pages to the repo, custom domain fl300.xyz, KV namespace bound, `BOARD_KEY` env var set. Bookmark `fl300.xyz/board/?k=…`.
- [ ] Poirot email: Email Routing + Email Worker (§6).
- [ ] Evening: Claude's build is complete and `node tools/fl300.mjs verify` passes.

### Wed 11 Nov
- [ ] Morning: **full playtest** (§7) on your phone, starting from the WhatsApp image sent to yourself.
- [ ] Fix, redeploy, re‑run `verify`, re‑test the stages you touched.
- [ ] Clear the board data from your test (or use test callsign `TEST` and ignore it).
- [ ] **20:00 send the opener** to the WhatsApp group. No caption — just the image (tradition).

### Thu 12 – Sat 14 Nov
- [ ] Check the board morning, noon, evening. If a team has been stuck on one stage > ~3 h in active hours, DM a nudge (not a solution).
- [ ] Answer Poirot emails the Worker didn't reply to: highlighted rows in **"Poirot's post"** on the board. You have a copy of each one in Proton; reply from there.
- [ ] Sat afternoon: DM any team not finished with the venue so nobody misses the party.

### Sun 15 Nov
- [ ] Optional: show everyone the board as a "flight log" recap. Delete the pastelink later; keep the site as a memento.

---

## 3. Opener & pastelink

**Opener image** (yours, same template as every year):

> Hello. I am looking for highly intelligent individuals. To find them, I have devised a test.
>
> There is a message hidden in the darkness of this image.
>
> Find it, and it will lead you on the road to finding the location of my **30th** birthday party. I am looking forward to meeting the few that will make it all the way through.
>
> Good luck.
>
> 12.11.1996.

- Top, near‑black: ROT4 of the pastelink URL (from the tool).
- Where `ROT13` was: `R O T  X X X`
- Bottom, spaced, near‑black: `X  V  M  K  M  R  X  E`
- Check on a phone with brightness up that it's findable but invisible at a glance — and that WhatsApp compression doesn't destroy it (send it to yourself first).

**Pastelink bin:** paste `content/pastelink.txt` exactly, lock with password **TRIGINTA**. Test the URL from a private browser window.

---

## 4. Cockpit audio (NAVIGATIO)

**Voices:** ElevenLabs. Radar/Tower/ATIS: calm male or female controller voice, slightly faster than conversational. Pilot: a different male voice. Numbers station: flat, slow female voice. You're the authority on phraseology — fix anything that sounds wrong to you.

**ICAO pronunciation** used in scripts: 0 ZE‑RO · 1 WUN · 2 TOO · 3 TREE · 4 FOW‑ER · 5 FIFE · 6 SIX · 7 SEV‑EN · 8 AIT · 9 NIN‑ER · decimal DAY‑SEE‑MAL.

### 125.025 — ATIS (loop)
> This is Beograd information Kilo, time one eight zero zero. Expect ILS approach runway one two left. Runway in use one two left. Wind one two zero degrees, eight knots. Visibility ten kilometres or more. Few three thousand five hundred feet. Temperature six, dew point two. QNH one zero one eight. Transition level one one zero. Acknowledge receipt of information Kilo and advise aircraft type on first contact.

### 133.100 — Beograd Radar (loop, ~10 s gap)
> **P:** Beograd Radar, Yankee Uniform Delta November Victor, PA38, two thousand five hundred feet, information Kilo, request ILS approach runway one two left.
> **R:** Yankee Uniform Delta November Victor, Beograd Radar, squawk tree tree zero wun.
> **P:** Squawk tree tree zero wun, Yankee Uniform Delta November Victor.
> **R:** Yankee Uniform Delta November Victor, identified. Climb altitude four thousand feet, QNH one zero one eight, proceed direct DEVDA, expect ILS approach runway one two left.
> **P:** Climb four thousand feet, QNH one zero one eight, direct DEVDA, expect ILS one two left, Yankee Uniform Delta November Victor.
> **R:** Yankee Uniform Delta November Victor, be advised, unidentified transmissions reported on one two one decimal fife.
> **P:** Copied, Yankee Uniform Delta November Victor.

*(Adjust altitudes/instructions to whatever is realistic for a PA38 inbound to LYBE — your call.)*

### 118.100 — Beograd Tower (loop)
> **T:** Yankee Uniform Delta November Victor, Beograd Tower, wind one two zero degrees eight knots, runway one two left, cleared to land.
> **P:** Runway one two left, cleared to land, Yankee Uniform Delta November Victor.

### 121.500 — numbers station (loop)
Short three‑tone chime, then slowly, ~3 s pause between groups, repeat from the top after ~10 s:
> Six groups.
> Wun fife day‑see‑mal seven. Bravo Golf Delta. Wun.
> Wun too day‑see‑mal nin‑er. Bravo Golf Delta. Tree.
> Wun wun day‑see‑mal seven. Bravo Golf Delta. Too.
> Radial tree too wun. Bravo Golf Delta. Tree.
> Wun wun day‑see‑mal seven. Bravo Golf Delta. Fow‑er.
> Too ait day‑see‑mal ze‑ro. Victor Alfa Lima. Wun.
> Repeat.

### Processing (Audacity)
- ATC: high‑pass 300 Hz, low‑pass 3000 Hz, light distortion, a little background hiss; normalise to −3 dB.
- Numbers station: same band‑pass, more hiss, faint slow fading in/out.
- Export mono MP3, 64 kbps. Give the four files to Claude to name via `tools/fl300.mjs audio 125.025` etc.

---

## 5. Cinema reel

- Six clips, ~10–15 s each, in order: **Harry Potter and the Chamber of Secrets** (Hedwig's Theme, Lockhart on screen) · **Pirates of the Caribbean** (He's a Pirate, Jack Sparrow) · **Star Wars: The Force Awakens** (Rey's Theme, Rey) · **Frozen** ("In Summer", Olaf) · **Skyfall** (Adele's "Skyfall" or the score under M) · **Spider-Man 2002** (Elfman's theme, the Green Goblin).
- **Show the star on screen** in each clip: the face identifies both the film and which cast member counts; the soundtrack plays underneath for atmosphere. Josh Gad is a voice, so Olaf singing is the clip. Clip number (1–6) in a corner.
- On the page: the reel, a film strip of six frames (tap to replay that reel; start times in `START` in the page script, thumbnails `site/v/t1–t6.jpg`), then a "Coming soon" poster with six "?" stars, "Six stars. One train. Name it." and the answer box. If you re-cut the reel, tell Claude to redo the start times and thumbnails.
- Each clip should be recognisable from the picture alone; the music is atmosphere.
- H.264 MP4, ≤ 1080p, **< 25 MB** (Cloudflare Pages limit).

---

## 6. Poirot email (Cloudflare Email Worker + you)

No Gmail, no n8n, nothing on your home server. Everything runs on Cloudflare's free plan.

**How it works:**
1. A player emails `poirot@fl300.xyz`.
2. The Email Worker (Claude builds it in `email-worker/`) **forwards a copy to your Proton**. It always does this.
3. It checks the text, matching whole words only, and replies **from `poirot@fl300.xyz`** in the same thread:
   - **Correct**: `Nikola` in any case (Nikola, Nikole, Nikoli, Nikolu, Nikolom) → Correct reply.
   - **Another guest's name** (no Nikola) → Wrong reply.
   - **Anything else** → no reply. It shows up highlighted in **"Poirot's post"** on your board, and you answer it by hand from Proton. Those replies come from your Proton address, which is fine because everyone knows Poirot is you.
4. Senders whose email provider fails DMARC (rare: Gmail, iCloud, Outlook and Proton all pass) get no automatic reply and appear highlighted too.

**Setup (Tuesday, ~20 min):**
1. Cloudflare → fl300.xyz → **Email** → **Email Routing** → Enable (it adds the DNS records).
2. **Destination addresses** → add your Proton address → click the verification link in Proton.
3. In `email-worker/wrangler.toml` set `FORWARD_TO` to your Proton address, then `npx wrangler deploy` from `email-worker/` (Claude will walk you through it).
4. Email Routing → **Routing rules** → custom address `poirot` → action **Send to a Worker** → the Poirot worker.
5. Test from your Gmail/iCloud (not Proton, so the test is realistic): send "Nikola", "Uhvatili smo Nikolu", "Ema", "hmm". Check the replies, the Proton copies and the board.

The reply texts live in `email-worker/replies.js`. Edit there, then `npx wrangler deploy` again.

**If the Worker breaks mid‑game:** in Routing rules, switch `poirot@` to **Send to an email → your Proton** and reply to everything by hand with the texts below. Players won't notice anything except slower replies.

**Correct reply** (Claude fills in the skandinavka URL and the Fragmentum V image; keep a copy handy for manual replies):
> Précisément, mon ami.
>
> Compartment No. 5, the one beside the dining car. Mineral water, a ticket to Zagreb, and crumbs on the sleeve: Nikola.
>
> I shall say nothing to the Compagnie. A man is entitled to cake on a birthday journey, even when it is not his birthday.
>
> Your journey continues: **https://fl300.xyz/…/**
>
> *Fragmentum V* — [glyph]
>
> Hercule Poirot

**Wrong reply:**
> Non, non, mon ami. That passenger slept far from the dining car. Read the conductor's notes again; the little grey cells, they must work.
> — H.P.

---

## 7. Playtest (Wed morning, ~2 h)

Use your **phone**, mobile data, private browser tab. Callsign `TEST`.

- [ ] Send the opener image to yourself on WhatsApp; open it from WhatsApp; find the faint text with brightness up.
- [ ] ROT4‑decode by hand (or dCode Caesar, shift 4) → pastelink opens with TRIGINTA.
- [ ] Chronogram: count by hand → 1331.
- [ ] Door: callsign + 1331 → cockpit. Wrong code → "Verbum falsum est."
- [ ] Cockpit: PWR required before audio; tune each of 125.025 / 133.100 / 118.100 / 121.500 by **knob** and by **typing**; swap works; static elsewhere; NAV idents on 112.05 / 110.30 / 116.60 sound right (you're the judge). Audio works on iPhone Safari with the silent switch on and off.
- [ ] Decode the numbers station from the chart only → DRAKUL. Zoom chart on phone; PDF link opens.
- [ ] Corvin: decode all 8 refs by actually counting on the page → TRAIANUS.
- [ ] Column: slider at 23 reads clearly; no other value looks like Latin.
- [ ] Cinema: video plays inline on iPhone; check each clip is recognisable on a phone screen; the six stars → Murder on the Orient Express → ORIENT.
- [ ] Orient: warm the note on the phone; solve the grid honestly (or check the README walkthrough); send emails: "Nikola", "Uhvatili smo Nikolu", "Ema", "hmm no idea" → check each reply, the Proton copies, and that "hmm no idea" is highlighted in Poirot's post on the board.
- [ ] Skandinavka: fill on phone (tap‑typing usable?), print the PDF once, shaded → MALTEŠKI KRST; both `MALTESKI KRST` and `malteški krst` accepted.
- [ ] Meta: collect glyphs I–VI (incl. the one in the email), decode with dCode Templar → MELITA.
- [ ] Invite: details correct, address correct.
- [ ] Board shows `TEST` progressing through every stage with times.
- [ ] Open the site with no callsign (link shared directly) → still works, shows as `anon`.
- [ ] Quick look on desktop Chrome too.
- [ ] `node tools/fl300.mjs verify` green after the last fix.

---

## 8. Fact‑check (before Wednesday)
- [ ] Trajan's Column frieze winds **23** times.
- [ ] Column base inscription text as used.
- [ ] Corvinus arms: raven with a gold ring in its beak.
- [ ] *Orient Express*: snowdrift between Vinkovci and Brod; 12 wounds; Poirot's two solutions.
- [ ] Dracula diary dates/paragraphs as hosted.
- [ ] dCode Templar alphabet matches the glyphs.
- [ ] Chronogram Latin checked by someone who isn't playing.
- [ ] ATC phraseology (you).

## 9. If something breaks mid‑game
- **Site down / bad deploy:** roll back in Cloudflare Pages → Deployments → previous → "Rollback".
- **Audio won't play for someone:** DM them the 121.500 transcript as a voice note.
- **Email not answered:** check Poirot's post on the board and the Worker logs (Cloudflare → Workers → poirot → Logs); reply by hand from Proton. If the Worker is broken, switch the routing rule to forward to Proton (§6).
- **Team totally stuck:** one nudge per DM, phrased as a question, never the answer.
