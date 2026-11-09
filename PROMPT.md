# Build prompt — FL300: ITER TRIGINTA

> Paste this into Claude Code opened in this folder (`~/Documents/Projects/30Party`).
> Companion document for Dario: `RUNBOOK.md` (do not build from it; it is his checklist).

---

## Who you are building for

Dario (pilot, PPL/CPL, designer) runs a Cicada‑3301‑style puzzle hunt every year as the invitation to his birthday. This is the 4th year: his **30th**. 12 players in 8 teams (4 couples + 4 solo), all Serbian, mostly non‑technical, they love escape rooms, crosswords, film/TV. His wife Zorana (Latin PhD on Emperor Trajan, studied Ancient Greek, Poirot and Dracula fan) is a player.

Last year's hunt for reference: `~/Documents/Projects/29Party` (read it to understand the tone; do **not** copy its look — its rounded Tailwind tiles and green shimmer are exactly the "AI look" to avoid).

**Hard deadline:** the opener is sent **Wednesday 11 Nov 2026, 20:00**. Everything must be working end to end by **Tuesday 10 Nov evening** so Dario can playtest Wednesday. Party: Sat 14 Nov, 20:00.

Reference files in `reference/`:
- `radio-panel-reference.png` — the look of the cockpit radio panel.
- `LYBE_ILS_RWY12L.pdf` — real AIP approach chart used in stage 2 (AIRAC 9/26).
- `opener-2025.jpg` — last year's opener image (Dario makes this year's himself).

---

## Design rules (Dario is a designer — this matters more than anything else)

1. **Every page is a real object, not a website**: a radio panel, an approach chart, a letter and a printed book, a museum strip, a case file, a magazine crossword. No shared "app chrome". The only shared elements: the answer box, the footer glyph, `<title>`.
2. **Banned:** gradients, glow, glassmorphism, rounded "cards", drop‑shadow panels, shimmer/pulse animations, emoji, default Tailwind look (don't use Tailwind at all), stock parchment‑texture backgrounds, Cinzel, Poiret One, fake handwriting fonts, decorative icons for their own sake.
3. **Real reference material over invention**: the real AIP chart, public‑domain photos/heraldry from Wikimedia Commons (credit in an HTML comment), period‑appropriate typefaces (self‑host or Google Fonts).
4. **Typography is chosen per object** and listed in `README.md` with one line of reasoning each, so Dario can approve or swap.
5. **If you can't make something convincing, don't fake it.** Put a correctly sized, clearly labelled placeholder and add it to the **"Dario designs"** list in `README.md`. Dario himself will supply only the opener image and the cinema video; everything else is yours, so aim high and keep it restrained.
6. Mobile first (players are on phones), works on desktop. Large tap targets, labelled inputs, readable contrast.

---

## Tech (keep it boring)

- Plain static HTML/CSS/JS. No framework, no bundler, no npm dependencies.
- Hosting: **Cloudflare Pages** from a **private** GitHub repo, domain **fl300.xyz**. Pages Functions + one KV namespace for the progress board.
- **One Email Worker** (`email-worker/`, its own `wrangler.toml`) for Poirot's replies, see stage 6. It's the only place an npm dependency is allowed: `postal-mime` for MIME parsing.
- **One** shared script `js/common.js`: normalise, hash, submit, progress ping, footer glyph.
- **One** tooling script `tools/fl300.mjs` (Node, no deps) with subcommands: `hash <answer>`, `rot4 <text>`, `audio <freq>`, `verify`.
- `404.html` **must exist** (otherwise Pages falls back to `index.html` with HTTP 200 and every wrong answer "succeeds").

### Answer → URL scheme (no answers in source)

```
norm(s) = s.replace(/đ/gi,'D')
           .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
           .toUpperCase().replace(/[^A-Z0-9]/g,'')
           .replace(/J/g,'I').replace(/U/g,'V')
path(s) = '/' + sha256hex('fl300:' + norm(s)).slice(0,16) + '/'
```

Submitting an answer: compute `path`, `fetch(path, {method:'HEAD'})`; 200 → navigate, else show **"Verbum falsum est."** (Latin, keep it). Stage pages live in those hashed folders. `README.md` keeps the stage → folder map.

### Progress board

- Door page asks for a **team callsign** (free text, stored in `localStorage`).
- Every stage page on load: `POST /api/ping {c: callsign||'anon', s: stageId}` → KV (`functions/api/ping.js`). Fire‑and‑forget, never blocks the page.
- `/board/?k=TOKEN` (token = env var `BOARD_KEY`, checked in `functions/api/board.js`): one row per callsign — latest stage, time reached, time per stage. Plain and functional; only Dario sees it. Auto‑refresh 60 s.

### Footer glyphs (meta layer)

Stages 2–7 show a small **Templar cipher** glyph in the footer, labelled `Fragmentum I … VI`, spelling **M E L I T A**:

| Fragmentum | Stage | Letter |
|---|---|---|
| I | 2 Navigatio | M |
| II | 3 Corvinus | E |
| III | 4 Columna | L |
| IV | 5 Cinema | I |
| V | 6 Orient Express (in Poirot's email, not on the page) | T |
| VI | 7 Cruciverbum | A |

Use the **dCode "Templars cipher"** alphabet exactly (that's what players will find); draw glyphs as SVG from its geometry; verify every glyph against dCode before finishing. Put the email glyph at a neutral URL (`/g/v.svg` style) for the email to embed.

---

## The stages

Player‑facing instruction lines are fixed — use them verbatim.

### 0 · INITIVM — opener (Dario makes the image; you only provide strings)
Black Cicada image. Faint ROT4 pastelink URL at top, faint spaced key at bottom, tiny tag `R O T  X X X` (ROT 30 = shift 4). Key **TRIGINTA** → `X V M K M R X E`. Provide `tools/fl300.mjs rot4` (shift letters +4, keep case, leave digits/punctuation) so Dario can encrypt the pastelink URL once he has it.

### 1 · LAPIS — pastelink bin (Dario pastes; you write the text)
Write `content/pastelink.txt`:
- A short Latin **chronogram**: lowercase text where every letter that is a Roman numeral (I V X L C D M) is capitalised, and those capitals sum to **exactly 1331**. Every I/V/X/L/C/D/M in the text must be capitalised (none may hide in lowercase). Simple, correct Latin; ideally about flight, dawn or thirty years. `verify` must check the sum.
- Then: `Summa litterarum numeralium clavis est.` and `Porta: fl300.xyz`
- Flag in README that the Latin needs a Latinist's check (not Zorana — she's playing).

### Door — `fl300.xyz/`
Black, white neo‑grotesque type like the opener image (continuity). Two fields: callsign, code. Answer **1331** → stage 2. (1331 is also Beograd Radar's 133.1 — don't point it out.)

### 2 · NAVIGATIO — the cockpit → answer **DRAKUL**
- **Radio panel**: redraw `reference/radio-panel-reference.png` as crisp SVG/CSS — same layout language, materials and orange 7‑segment digits (use the OFL **DSEG7** font), but **no RemoteFlight branding, no iPad frame, no autopilot block**. Keep: PWR, COM1/COM2 active+standby, NAV1/NAV2 active+standby, the ↔ swap buttons, the 1/2 selector toggles, two dual concentric knobs (COM, NAV), transponder showing `7000`.
  - **PWR** must be pressed first (it's the user gesture that unlocks audio on mobile). Digits blank until powered.
  - Standby digits are tappable fields (type a frequency) **and** tunable by the knob: outer ring = MHz, inner = kHz (drag to rotate; tap left/right halves as fallback). COM 118.000–136.975 in 25 kHz steps (accept 121.5 typed as 121.500); NAV 108.00–117.95 in 50 kHz.
  - ↔ swaps standby → active. Active frequencies play audio; everything else plays soft radio static.
- **Audio lookup without leaking**: canonical freq string (`133.100`, `112.05`) → `tools/fl300.mjs audio <freq>` gives `/a/<16hex>.mp3`. The page just tries that file; 404 → static. Dario supplies the mp3s (scripts in RUNBOOK). COM stations with audio: 125.025 ATIS, 133.100 Radar, 118.100 Tower, 121.500 numbers station.
- **NAV idents** generated live with WebAudio (1020 Hz, correct Morse timing, repeat every ~8 s): BGD 112.05, YUB 110.30, VAL 116.60. These may be in source (they're printed on the chart).
- **Chart**: render page 1 of the PDF to a high‑res image with pinch/zoom, plus a link to the PDF itself (non‑pilots will search its text for numbers).
- Line on page: `YU-DNV, contact Beograd Radar.` Answer box below.
- Decoding (for `verify`/README only — never on page): 15.7 BGD·1 **D**EVDA, 12.9 BGD·3 OB**R**, 11.7 BGD·2 L**A**BUD, R321 BGD·3 TI**K**VU, 11.7 BGD·4 LAB**U**D, 28.0 VAL·1 **L**OGAR.

### 3 · CORVINVS — the Count's letter + Dracula → answer **TRAIANUS**
- A short letter from Castle Dracula, headed *Castrum Corvinorum*, with a raven seal (the **Corvinus coat of arms** — raven with a ring — from Wikimedia, rendered as a single‑colour wax impression). Contains 8 references `date · ¶ · word` and the line: **"From Jonathan Harker's diary. First letter."**
- Below it, **host the text** of *Dracula* chapters I–IV (Jonathan Harker's journal; public domain; source the Gutenberg #345 plain text, strip the Project Gutenberg header/footer and don't use their name). Typeset like an 1897 printed book: a Caslon/Fell‑style face, diary dates as small‑caps headings, paragraphs clearly separated but **not numbered** (players count them).
- Pick 8 refs whose first letters spell TRAIANUS. Rules: paragraph = paragraph as rendered on our page under that date heading; avoid paragraphs with hyphenated words, numbers, or dashes before the target word; ensure each date heading is unique. `verify` must decode the refs from the hosted HTML.

### 4 · COLVMNA — Trajan's Column scytale → answer **DACIA**
- Public‑domain photo of Trajan's Column. A long strip of letters styled as a carved/painted band in Roman inscriptional capitals. Line: **"Wrap the strip as many times as the frieze winds around the column."**
- **Windings slider 2–40.** At value `w`, show the strip as `w` vertical columns (column c = strip letters `c·k … c·k+k−1`, k = L/w) drawn as an unrolled cylinder (subtle edge shading only); players read **rows left → right**. Encryption: `strip[c·k + r] = plain[r·w + c]`.
- Plaintext: the real **base inscription of Trajan's Column** (SENATVS POPVLVSQVE ROMANVS IMP CAESARI DIVI NERVAE F NERVAE TRAIANO AVG GERM DACICO PONTIF MAXIMO TRIB POT XVII IMP VI COS VI P P AD DECLARANDVM QVANTAE ALTITVDINIS MONS ET LOCVS TANTIS OPERIBVS SIT EGESTVS — verify against a scholarly source) followed by **CLAVIS DACIA**. Letters only, no spaces. Length must be exactly `23·k`: adjust by trimming inscription words, never by padding after DACIA.
- `verify`: only w = 23 produces the plaintext.

### 5 · CINEMA — soundtrack reel → answer **ORIENT**
- Embed Dario's video (`/v/reel.mp4`, he supplies it, < 25 MB; leave a placeholder). Line: **"Listen. Recognise. Identify."**
- Below the video, six typeset rows (clip number, blanks, Roman numeral):

| Clip | Blanks | Film (never shown) |
|---|---|---|
| 1 | `_ _ _ _ _ _ · II` | POIROT → O |
| 2 | `_ _ _ _ _ _ _ · III` | PIRATES → R |
| 3 | `_ _ _ _ _ _ _ _ _ · V` | GLADIATOR → I |
| 4 | `_ _ _ _ _ _ _ _ · III` | SHERLOCK → E |
| 5 | `_ _ _ _ _ _ · VI` | TOPGUN → N |
| 6 | `_ _ _ _ · I` | TROY → T |

### 6 · ORIENT EXPRESS — "everyone did it" → solved by email
- Case file, Poirot style. The Simplon‑Orient is stuck in a snowdrift near Vinkovci. The birthday cake was found in the dining car **stabbed 12 times** — marks of different depth, angle, one left‑handed, one hesitant, etc., exactly as in the novel's 12 wounds.
- **12 suspects = the 12 players**, each in a compartment: Milos (with Ema), Ema, Danica (with Nikola), Nikola, Aleksa, Danica (with Aleksa), Aleksandra (with Ivan), Ivan, Nevena, Peđa, Mikan, Zorana. Couples vouch for each other (as in the novel); pair the solos as mutual alibis too (Nevena–Peđa, Mikan–Zorana).
- Each suspect: one short statement. Clues tie each of the 12 marks to exactly one suspect; alibis interlock so the **only** consistent conclusion is **all twelve**. Leave the "stranger in a Wagon‑Lit uniform who got off at Vinkovci" as a tempting false solution, as in the book.
- Tone: warm and funny, never mean — these are his friends. Mark every per‑person trait as `<!-- DARIO: check -->` so he can swap in real harmless details.
- Write `tools/` check (inside `verify`) that encodes the clue logic and proves the unique solution = all 12.
- **No answer box.** Last line: **"Send your conclusion to Monsieur Poirot: poirot@fl300.xyz"**
- Look: evoke a 1930s typed police/railway dossier (typewriter face, rubber‑stamp red, carbon‑copy feel) — not Art Deco pastiche.
- The next stage's URL is a random 16‑hex folder (not answer‑derived); it's delivered by Poirot's reply.

#### Poirot Email Worker (`email-worker/`)
Cloudflare Email Routing sends `poirot@fl300.xyz` to this Worker (free plan). Docs: https://developers.cloudflare.com/email-routing/email-workers/reply-email-workers/
- **Always** `message.forward(env.FORWARD_TO)` (Dario's Proton address, a verified destination in Email Routing) so he sees every email.
- Ignore (forward only, never reply): messages with an `Auto-Submitted` header other than `no`, messages from `*@fl300.xyz`, and messages whose first `Authentication-Results` header from `mx.cloudflare.net` lacks `dmarc=pass` (`reply()` would throw anyway).
- Parse with `postal-mime`; text = subject + plain body (fall back to HTML stripped of tags). Drop quoted history (lines starting `>` and everything after a `On … wrote:` / `… je napisao/la:` line). Lowercase, strip diacritics (đ→d).
- Match **whole words** (`\b…\b`), in this order:
  1. **Correct**: svi, sve, svako, svaki, svih, dvanaest, zajedno, everyone, everybody, all, twelve, 12, tous, toutes, ensemble → correct reply.
  2. **Stranger**: stranger, stranac, stranca, nepoznat, nepoznati, uniform, uniforma, kondukter, conductor → stranger reply.
  3. **Exactly one** player first name (milos, ema, danica, nikola, aleksa, aleksandra, ivan, nevena, pedja, peda, mikan, zorana) → wrong reply.
  4. Anything else → no reply (Dario answers by hand from Proton).
- Reply once with `message.reply()`: From `"Hercule Poirot" <poirot@fl300.xyz>`, To the sender, `Re: <subject>`, `In-Reply-To` + `References` = original `Message-ID`. Build the MIME (multipart/alternative, plain + simple HTML) by hand; no `mimetext`.
- Reply texts are in `RUNBOOK.md` §6. Put them in `email-worker/replies.js` so Dario can edit them. The correct reply contains the skandinavka URL and Fragmentum V as a **PNG** (`/g/v.png`, ~120 px; Gmail blocks SVG in email) with `alt=""` so the letter isn't given away. Same rule for all glyphs on the pages.
- Log every email to the board's KV: `{time, from, subject, outcome: correct|stranger|wrong|none|ignored}`. The board page shows a **"Poirot's post"** table under the teams, newest first, with `none`/`ignored` rows highlighted. That tells Dario which emails he must answer by hand.
- Unit‑test the matcher in `verify` with: "svi", "Svi su krivi!", "all of them", "Tous.", "small", "nema", "Ema", "Ema i Milos", "a stranger", "hmm no idea" → correct, correct, correct, correct, none, none, wrong, none, stranger, none.

### 7 · CRVCIVERBVM — skandinavka → answer **MALTEŠKI KRST**
- A real Serbian‑magazine‑style **skandinavka** in Serbian Latin script: clue cells with tiny condensed text and arrows, dense grid (~13×11), off‑white newsprint feel.
- **Avoid all words containing LJ, NJ, DŽ.** Grid inputs accept Š/S, Č/C etc. equivalently.
- Mostly general knowledge, plus a few nods to the hunt (e.g. LYBJ, TROJA, POARO, ŠERLOK, RIM, DUNAV). Don't use MALTA as an entry — it would give the answer away. 12 shaded cells numbered 1–12 spell **MALTEŠKI KRST**.
- Tap‑to‑type interactive grid (mobile!) + **printable PDF** of the empty grid. Optional "check grid" button that only says correct/incorrect.
- `verify`: every across/down entry is a real word matching its clue list; shaded letters spell MALTESKIKRST. If you can't produce a grid of real‑magazine quality, stop and tell Dario rather than shipping a weak one.

### 8 · MELITA — meta → answer **MELITA**
- Restrained page with Templar iconography: cross pattée, the two‑knights seal (*Sigillum Militum Xpisti*, public domain), *Non nobis Domine*. Six empty slots labelled I–VI. Line: **"Fragmenta collige."** Answer box.

### 9 · Invite (answer‑derived from MELITA)
A landing‑clearance themed invite: *YU‑DNV, cleared to land.* **Grand Central Pizza Bar, Belgrade · Saturday 14 November 2026 · 20:00.** Address placeholder `<!-- DARIO: address -->`. Elegant, quiet; B612 is a nice nod (his cockpit font). This is the payoff — give it care.

---

## `verify` must check
1. Every answer's `path()` resolves to an existing folder; wrong answers 404.
2. ROT4 of TRIGINTA = XVMKMRXE.
3. Chronogram sum = 1331, no lowercase numeral letters.
4. Book‑cipher refs decode to TRAIANUS from the hosted HTML.
5. Scytale decodes only at w = 23.
6. Orient logic: unique solution = all 12.
7. Skandinavka integrity + shaded = MALTESKIKRST.
8. Glyph SVGs I–VI map to M E L I T A (against the dCode alphabet table you embed in the tool).
9. Audio filenames for the 4 COM frequencies printed for Dario.
10. Poirot matcher test cases (stage 6).

## Deliverables / done means
- All pages working end to end with placeholders only for Dario's video and audio.
- `README.md`: stage → folder map, answers, type choices with reasons, image credits, **"Dario designs / check"** list, deploy steps (Pages, KV binding, `BOARD_KEY`; Email Worker: `wrangler deploy`, `FORWARD_TO` var, Email Routing rule `poirot@` → Worker), the fact‑check list below.
- `verify` passes.
- Ask Dario before any visual decision you're unsure about; show him screenshots of each stage at phone width.

## Facts to confirm (list in README, cite sources)
Trajan's Column frieze winds 23 times · exact base inscription text · Corvinus arms: raven holding a gold ring · *Murder on the Orient Express* train stuck in snow between Vinkovci and Brod, 12 wounds, two solutions · Harker diary dates in chapters I–IV · dCode Templar alphabet.
