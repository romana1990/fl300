# FL300 · ITER TRIGINTA

The 2026 hunt. Static site in `site/` (Cloudflare Pages), two Pages Functions for the board, one Email Worker for Poirot, one tooling script.

```
site/                 ← Pages build output directory (the only thing served)
  index.html          door (stage 1)
  404.html            must exist, or wrong answers would "succeed"
  <16 hex>/           stage pages (see map below)
  board/              Dario's progress board  (/board/?k=BOARD_KEY)
  js/common.js        the one shared script: normalise, hash, submit, ping, footer glyph
  css/fl300.css       the one shared style: answer box + footer glyph
  g/i … vi .svg/.png  Templar footer glyphs (PNG on the pages and in the email)
  a/                  cockpit audio (Dario's mp3s, hashed names, see below)
  v/reel.mp4          cinema reel (Dario)
  chart/              LYBE ILS 12L: PDF + rendered page 1
functions/api/        ping.js, board.js (Pages Functions, KV binding FL300), metar.js (live LYBE METAR proxy, no binding)
email-worker/         Poirot (its own wrangler.toml; only npm dep: postal-mime)
tools/fl300.mjs       hash | rot4 | audio | glyphs | verify
tools/skandinavka.json  crossword solution (never deployed)
content/pastelink.txt   paste this into the pastelink bin
```

`node tools/fl300.mjs verify` → all checks green except the four audio files, which are listed as "missing" until you drop them in. With a URL (`verify https://fl300.xyz`) it also checks the live site with HEAD requests.

## Stage → folder map (keep private)

| # | Stage | Unlocked by | Folder | Footer |
|---|---|---|---|---|
| 1 | Door | — | `/` | — |
| 2 | NAVIGATIO | **1331** | `/dc4892a5a1ccc163/` | Fragmentum I (M) |
| 3 | CORVINVS | **DRAKUL** | `/33f115cf73b329ab/` | Fragmentum II (E) |
| 4 | COLVMNA | **TRAIANUS** | `/865b5cef27b1243a/` | Fragmentum III (L) |
| 5 | CINEMA | **DACIA** | `/841f818ac83ee3d2/` | Fragmentum IV (I) |
| 5→6 aliases | — | ORIENT EXPRESS · THE ORIENT EXPRESS · MURDER ON THE ORIENT EXPRESS | `/e0a3672389f0e4eb/` · `/75e2bc7a03fdc335/` · `/0441a86d623d5ebf/` (redirect to stage 6) | — |
| 6 | ORIENT EXPRESS | **ORIENT** | `/16d9da12cbbc3cf8/` | (V is in Poirot's email) |
| 7 | CRVCIVERBVM | Poirot's email (random folder) | `/c7e04b9a1f5d2e83/` | Fragmentum VI (A) |
| 8 | MELITA | **MALTEŠKI KRST** | `/aa3f5a505fca74eb/` | — |
| 9 | Invite | **MELITA** | `/91ee14eed62944e3/` | — |

Answers are normalised before hashing (diacritics off, đ→D, J→I, U→V, only A–Z0–9), so `malteški krst`, `MALTESKI KRST`, `Trajanus`, `133.1` all work.

## Opener strings (stage 0)

- Key at the bottom, spaced: `X  V  M  K  M  R  X  E` (ROT4 of TRIGINTA)
- Tag where ROT13 was: `R O T  X X X`
- Top line: `node tools/fl300.mjs rot4 "<pastelink URL>"` once you have the URL. It shifts letters by +4, keeps case, leaves digits and punctuation.

## Stage 1 · LAPIS — the chronogram

`content/pastelink.txt`:

```
aLIs VoLat proprIIs.
post tenebras LVX.
Labor oMnIa VInCIt.
```

*"She flies on her own wings. After darkness, light. Work conquers all."* Three real mottos: *alis volat propriis* (Oregon), *post tenebras lux* (Geneva, nod to the dark opener image), *labor omnia vincit* (Virgil, Georgics I). L 4×50 + I 6×1 + V 3×5 + X 10 + C 100 + M 1000 = **1331**. Written with V for U (classical and chronogram practice), so no lowercase u can be mistaken for an uncounted V. No D, one M.

## Cockpit audio (stage 2)

Drop the four mp3s into `site/a/` under these names (`node tools/fl300.mjs audio <freq>` prints them too):

| Freq | Station | File |
|---|---|---|
| 125.025 | ATIS | `site/a/8128a0eb5994c7e2.mp3` |
| 133.100 | Beograd Radar | `site/a/98f23ceef9abcd39.mp3` |
| 118.100 | Beograd Tower | `site/a/30d782d8129d0c49.mp3` |
| 121.500 | numbers station | `site/a/845ae3004954db51.mp3` |

One COM and one NAV radio, each with an audio switch (COM on, NAV off at power-up). You hear the active frequency ("RX"/"ID" next to it); the knob tunes the standby. Transponder shows 3301. A COM file loops; no file → soft static. NAV idents BGD 112.05 / YUB 110.30 / VAL 116.60 play `site/a/40cc6b96ed663ba3.mp3` / `f91e4cd2f571f483.mp3` / `fdd4598154d9f5be.mp3` if present (looped as-is, so put the gap in the file); otherwise they're generated live (1020 Hz, 10 wpm, every 8 s). PWR unlocks audio and sets `navigator.audioSession.type = 'playback'` where Safari supports it, so the iPhone silent switch shouldn't mute it. **Test on your iPhone with the switch both ways.** Starting frequencies are harmless (COM 121.900 / 122.150, NAV 109.10 / 114.30).

Numbers-station decode (from the chart): 15.7 BGD·1 **D**EVDA · 12.9 BGD·3 OB**R** · 11.7 BGD·2 L**A**BUD · R321 BGD·3 TI**K**VU · 11.7 BGD·4 LAB**U**D · 28.0 VAL·1 **L**OGAR → DRAKUL.

## Stage 3 · Corvinus — book cipher

Refs (date · paragraph · word) → T R A I A N U S: 3 May·4·5 *Transylvania* · 18 May·1·9 *room* · 7 May·2·5 *absent* · 15 May·1·4 *I* · 29 June·2·3 *awakened* · 25 June·1·1 *No* · 12 May·3·12 *under* · 17 June·1·6 *sitting*.
Paragraphs count from the first paragraph under the date heading. 5 May appears twice in the book, so it is never used; every ref has no number, hyphen or dash before its word, and hyphenation is off on the page so no word gets split at a line end. `verify` re-decodes them from the hosted HTML.

## Stage 4 · Columna — scytale

Plaintext (161 = 7 × 23 letters): SENATVS POPVLVSQVE ROMANVS IMP CAESARI DIVI NERVAE F NERVAE TRAIANO AVG ~~GERM DACICO PONTIF MAXIMO~~ TRIB POT XVII IMP VI COS VI P P AD DECLARANDVM QVANTAE ALTITVDINIS MONS ET LOCVS TANTIS OPERIBVS SIT EGESTVS **CLAVIS DACIA**. One block of titulature is trimmed to hit 23 × 7 exactly; nothing is padded. At *w* windings, column *c* holds strip letters ⌊c·L/w⌋ … ⌊(c+1)·L/w⌋−1, so every value except 23 misaligns (verified for 2–40).

**Cryptex.** The answer box is a five-ring cryptex. Each ring's brass plate gives *line · letter* in the strip wound at 23: II·XII **D** (DIVI) · I·IV **A** (SENATVS) · IV·IX **C** (VICOS) · III·IX **I** (TRAIANO) · V·I **A** (DECLAR**A**NDVM). The verse (original, Langdon-style): *Where Peter stands, an emperor once stood* (St Peter replaced Trajan's statue on top in 1587) / *his war is wound in marble, turn on turn* / *Unwind the stone as only Romans could,* / *then line and letter, ring by ring, discern.* CLAVIS DACIA stays at the end as a shortcut for sharp eyes. Red herring: **APPLE** jams the rings with "Wrong orb, Professor Langdon. This is not London." Rings: drag, tap top/bottom half, wheel, or focus and type letters; **Aperi** opens. `verify` checks the plates spell DACIA.

## Stage 5 · Cinema — six stars, one train

Each clip's film shares one actor with *Murder on the Orient Express* (2017): Chamber of Secrets → **Kenneth Branagh** (Poirot) · Pirates → **Johnny Depp** (Ratchett) · The Force Awakens → **Daisy Ridley** (Mary Debenham) · Frozen → **Josh Gad** (MacQueen) · Skyfall → **Judi Dench** (Princess Dragomiroff) · Spider-Man → **Willem Dafoe** (Hardman). The one picture all six share is the train → **ORIENT**. The answer box accepts ORIENT, ORIENT EXPRESS, THE ORIENT EXPRESS and MURDER ON THE ORIENT EXPRESS (three alias folders redirect to stage 6).

## Stage 6 · Orient Express — the burnt note and the conductor's notes

**Mechanics.** A charred note from the dining-car stove: players warm it with a finger (or mouse) and the char clears, revealing Poirot: *the crumbs lead from the dining car to the compartment beside it; who slept there? Write me the name. — poirot@fl300.xyz*. Revealed once, it stays revealed on that device. Below: the route, a coach of five compartments (No. 5 is coupled to the dining car), the conductor's 10 notes, and an **integram** notebook in the magazine staircase layout (Passenger × Compartment/Destination/Drink, Drink × Compartment/Destination, Destination × Compartment); tap ✗ / ✓, a ✓ crosses out its row and column. No answer box: the answer is emailed.

**Solution** (every note is needed; `verify` proves the solution is unique):

| No. | Passenger | Destination | Drink |
|---|---|---|---|
| 1 | Ema | Trieste | champagne |
| 2 | Ivan | Istanbul | tea |
| 3 | Peđa | Belgrade | rakija |
| 4 | Nevena | Sofia | coffee |
| 5 | **Nikola** | Zagreb | water |

Walkthrough: Peđa is No. 3 (9), rakija (2) → Belgrade (5). Ivan is No. 2 (7) → Istanbul (3). Ivan can't have water (water → Zagreb, 8) or champagne (champagne → No. 1, 1), so tea. Nevena has coffee (6): not No. 1 (champagne), not Zagreb (water), so she's the Sofia passenger in No. 4 (4). Ema and Nikola share No. 1/No. 5, Trieste/Zagreb, champagne/water; Ema isn't going to Zagreb (10) → Ema No. 1, Trieste, champagne; **Nikola No. 5, Zagreb, water**.

**Poirot's email:** `Nikola` in any Serbian case → Correct reply (next link + Fragmentum V); another guest's name → Wrong reply; anything else → forwarded only, highlighted on the board for you to answer.

**If you change a note,** change the matching clue in `ORIENT.clues` (`tools/fl300.mjs`) and run `verify`: it checks the solution is still unique, that Nikola is still in No. 5, and that no note is redundant.

## Stage 7 · Skandinavka — solution (keep private)

```
    ▪ T ▪ A ▪ K ▪ A ▪ M ▪ M ▪
    R E M I ▪ I L S ▪ I R A K
    ▪ L O P A T A ▪ T R O J A
    V O R ▪ R O N D A ▪ D A N
    ▪ ▪ Z E T ▪ Č O R B A ▪ ▪
    S M E H ▪ K I P A R ▪ Č A
    ▪ A ▪ O B I Ć I ▪ A M A N
    V R T ▪ O M ▪ S A V E S T
    ▪ Š E R L O K ▪ R A T N I
    L A M A ▪ N O N A ▪ L I K
    ▪ L A K ▪ O D A ▪ B A K A
```

Shaded 1–12: M(r6c2) A(r1c4) L(r10c1) T(r3c6) E(r8c11) Š(r9c2) K(r2c13) I(r7c8) K(r11c4) R(r4c5) S(r8c8) T(r5c5) → **MALTEŠKI KRST**.

52 entries, every letter checked across and down except the top row and left column (as in real skandinavke), no LJ/NJ/DŽ, no MALTA. Nods: ŠERLOK, TROJA, KIPAR, ANTIKA, MORZE, ILS, VOR, AIP. LYBJ couldn't go in: no Serbian word can cross its Y. Generated from a frequency-ranked Serbian lemma list, then curated by hand. **Please read every clue** (tone, difficulty, Serbian):

| Entry | Where | Clue |
|---|---|---|
| TELO | ↓ r1 c2 | Trup, organizam |
| AIP | ↓ r1 c4 | Zbornik vazduh. informacija (skr.) |
| KITO | ↓ r1 c6 | Glavni grad Ekvadora |
| AS | ↓ r1 c8 | Najjača karta |
| MIR | ↓ r1 c10 | Spokoj, tišina |
| MAJA | ↓ r1 c12 | Pčelica iz crtanog filma |
| REMI | → r2 c1 | Nerešena partija šaha |
| MORZE | ↓ r2 c3 | … azbuka (tačka-crta) |
| ILS | → r2 c6 | Instrumentalno sletanje (skr.) |
| LANČIĆ | ↓ r2 c7 | Tanka ogrlica |
| IRAK | → r2 c10 | Država sa Bagdadom |
| RODA | ↓ r2 c11 | Ptica koja „donosi bebe“ |
| KAN | ↓ r2 c13 | Grad filmskog festivala |
| LOPATA | → r3 c2 | Alat za kopanje |
| ART | ↓ r3 c5 | Umetnost (engl.) |
| TROJA | → r3 c9 | Grad Helene i Parisa |
| TARA | ↓ r3 c9 | Planina iznad Drine |
| VOR | → r4 c1 | VHF omnidirekcioni opseg (skr.) |
| RONDA | → r4 c5 | Grad u Andaluziji |
| DOPIS | ↓ r4 c8 | Službeno pismo |
| DAN | → r4 c11 | Suprotno od noći |
| ZET | → r5 c3 | Sestrin muž |
| EHO | ↓ r5 c4 | Odjek |
| ČORBA | → r5 c7 | Gusta supa |
| BRAVA | ↓ r5 c10 | Otključava se ključem |
| SMEH | → r6 c1 | Ha-ha-ha |
| MARŠAL | ↓ r6 c2 | Najviši vojni čin |
| KIPAR | → r6 c6 | Ostrvo Afrodite |
| KIMONO | ↓ r6 c6 | Japanska haljina |
| ČA | → r6 c12 | Čačak (reg. oznaka) |
| ČASNIK | ↓ r6 c12 | Oficir (starinski) |
| ANTIKA | ↓ r6 c13 | Grčko-rimsko doba |
| OBIĆI | → r7 c4 | Posetiti redom, obilaziti |
| BOL | ↓ r7 c5 | Patnja, muka |
| AMAN | → r7 c10 | Uzvik nestrpljenja |
| METLA | ↓ r7 c11 | Veštičje prevozno sredstvo |
| VRT | → r8 c1 | Bašta |
| TEMA | ↓ r8 c3 | Predmet razgovora |
| OM | → r8 c5 | Jedinica električnog otpora |
| SAVEST | → r8 c8 | Unutrašnji glas morala |
| ARA | ↓ r8 c9 | Šareni papagaj |
| ŠERLOK | → r9 c2 | Holms, Dojlov detektiv |
| RAK | ↓ r9 c4 | Zodijački znak |
| KOD | ↓ r9 c7 | Šifra |
| RATNI | → r9 c9 | Koji se tiče rata |
| LAMA | → r10 c1 | Andska životinja |
| NONA | → r10 c6 | Baka, u primorju |
| NA | ↓ r10 c8 | Simbol natrijuma |
| LIK | → r10 c11 | Junak romana |
| LAK | → r11 c2 | Za nokte; lagan |
| ODA | → r11 c6 | Svečana pesma |
| BAKA | → r11 c10 | Majka roditelja |

To change a clue, edit its `"text"` in the JSON block at the bottom of `site/c7e04b9a1f5d2e83/index.html`, then reprint the PDF (Chrome → Print → Save as PDF to `skandinavka.pdf` in the same folder; the print stylesheet hides everything but the grid). Changing an *entry* means changing the grid: ask Claude, since the check hash and `tools/skandinavka.json` must change with it.

The page never contains the solution letters: "Proveri" compares a hash of the filled grid. Progress is kept in the phone's localStorage.

## Stage 8 · Melita

Page: a vellum manuscript leaf (tab title **TEMPLVM**, so the answer isn't in the tab). Six cryptex wheels, I–VI: each turns (tap, ▲/▼, or swipe) through all 25 Templar glyphs in the frame's scrambled order, and players set each one themselves from the fragments they collected. Nothing is filled in automatically. The glyphs are cut from the frame sprite (`img/templar-border-h.svg`, glyph k at x = 25 + 150k), so no letter names reach the page; wheel positions are remembered per device (`fl300.wheels`). The wheels are only a workbench: the answer is still typed, so the page holds no solution.

The frame is a band of all 25 Templar glyphs, repeating, in a fixed **scrambled** order (`QKEXTBNHZAWOGLDRVIMSUCYFP`), so it says "this is an alphabet you've seen" without being a key. Generated by `node tools/fl300.mjs border` → `site/img/templar-border-h.svg` / `-v.svg`.

Templar alphabet = dCode **"Normal, historical version (1)"** (the default). Glyphs: I kite→ (M) · II triangle▷ (E) · III kite↑ (L) · IV kite↓ (I) · V triangle◁ with dot (T) · VI V-shape (A). dCode's alternative "scout" alphabet swaps E/H and K/L, exactly the letters in MELITA; a team using it reads *M H K I T A*. If someone is stuck there, the nudge is "use dCode's default alphabet". All 25 glyphs were rendered next to dCode's own images and match. `verify` classifies the geometry of each SVG against the alphabet table in the tool.

## Stage 9 · Invite

An **ACARS uplink** feeding out of the cockpit's thermal printer (a dark panel with a slot; the paper slides out line by line, torn zigzag edge). Stamped with the current Zulu time, FROM LYBE TWR 118.100 TO **the team's own callsign** from the door (`fl300.callsign` on that device, falling back to YU-DNV), TYPE PA38; then "<CALLSIGN> RWY 12L CLEARED TO LAND", the party as message fields (EVENT / DATE / TIME 2000 LT / PLACE), WHEELS DOWN AT EIGHT., the live LYBE METAR, and a printed `[MAP]` link. Reduced-motion users get the paper without the feed.

## Type choices (approve or swap)

| Object | Face | Why |
|---|---|---|
| Door, 404 | Helvetica Neue → Helvetica → Arial (system) | Same face as the opener image; native on iPhones, so continuity at zero cost. |
| Cockpit displays | DSEG7 Classic Bold (OFL, self-hosted) | Real seven-segment geometry, with unlit "8" ghosts like an actual LCD. |
| Cockpit labels | B612 | Airbus's cockpit-display typeface, designed for legibility on panels. |
| Count's letter | IM Fell English + IM Fell English SC | Fell types: old-world printing for an old-world aristocrat. Not fake handwriting. |
| Harker's journal | Libre Caslon Text; dates in IM Fell English SC | Caslon was *the* English book face of the 1890s; real small caps for the diary dates. |
| Column strip | Marcellus | Flared Roman inscriptional capitals (Cinzel is banned), painted in minium red as the originals were. |
| Museum label | Libre Franklin | Franklin Gothic is a stock museum-label face. |
| Cinema programme | Oswald | Descendant of Alternate Gothic, the condensed face of mid-century film bills. |
| Orient dossier | Courier Prime | Clean typewriter face, carbon-copy blue. Courier itself is 1955, a few decades late for 1934; swap for *Special Elite* if you want it rougher. |
| Skandinavka | Barlow Condensed / Semi Condensed | Serbian puzzle magazines use condensed grotesques (Arial Narrow / Helvetica Condensed); Barlow has full Latin Extended (Č Ć Š Ž Đ). |
| Melita | EB Garamond | Quiet humanist old-style; the cross and the seal carry the page. |
| Invite | B612 + B612 Mono | Your cockpit font, as suggested; the METAR line in the mono. |

## Image credits

- Radio panel: drawn in SVG/CSS after `reference/radio-panel-reference.png`, no RemoteFlight branding.
- LYBE ILS RWY 12L: AIP Serbia/Montenegro, AD 2 LYBE 12.1–1, AIRAC AMDT 9/26 (SMATSA). Page 1 rendered to JPEG; PDF linked as-is.
- Corvinus seal: raven-with-ring silhouette from *Coa Hungary Family Hunyadi v2.svg* by Madboy74, Wikimedia Commons, public domain (shield removed, rendered as a single-colour wax impression).
- Trajan's Column: *Forum met de Zuil van Trajanus in Rome*, albumen print, Rijksmuseum RP-F-F01143-AI, CC0, via Wikimedia Commons.
- Templar seal: *Seal of Templars.jpg*, from T. A. Archer & C. L. Kingsford, *The Crusades* (1894), public domain, via Wikimedia Commons.
- Dracula chapters I–IV: Bram Stoker, 1897, public domain (plain text from Project Gutenberg #345, header and footer removed).
- Templar alphabet: geometry after dCode.fr "Templars Cipher" (CC BY): https://www.dcode.fr/templars-cipher
- DSEG7: Keshikan, SIL Open Font License (`site/fonts/DSEG-LICENSE.txt`).

## Dario designs / check

- [ ] **Opener image** (strings above).
- [ ] **Cinema reel** → `site/v/reel.mp4` (< 25 MB, H.264). Until then the page shows "Reel not loaded".
- [ ] **Four audio mp3s** → `site/a/…` (names above).
- [ ] **Orient Express traits**: 12 × `<!-- DARIO: check -->` in `site/16d9da12cbbc3cf8/index.html`.
- [ ] **Venue address** → `<!-- DARIO: address -->` in `site/91ee14eed62944e3/index.html`.
- [ ] **Skandinavka clues** (table above), then reprint the PDF if you change any.
- [ ] **Chronogram Latin**: a Latinist who isn't playing.
- [ ] **Poirot's reply texts** in `email-worker/src/replies.js` (copied from RUNBOOK §6).
- [ ] Look at every page on your phone; anything that feels off, say so.

## Deploy

**Pages (site + board)**
1. Cloudflare → Workers & Pages → Create → Pages → connect the private GitHub repo.
2. Build settings: framework *None*, build command *(empty)*, **build output directory `site`**. Root directory: repo root (so `functions/` is picked up).
3. Storage → KV → create a namespace `fl300`. Pages project → Settings → Bindings → add KV binding **`FL300`** → that namespace (Production and Preview).
4. Settings → Variables and secrets → add **`BOARD_KEY`** (any long random string). Redeploy.
5. Custom domains → `fl300.xyz`.
6. Bookmark `https://fl300.xyz/board/?k=<BOARD_KEY>`.
7. `node tools/fl300.mjs verify https://fl300.xyz`.

**Poirot (Email Worker)**
1. Email → Email Routing → enable for fl300.xyz; Destination addresses → add and verify your Proton address.
2. In `email-worker/wrangler.toml`: set `FORWARD_TO` to that Proton address, and `id` to the KV namespace id from step 3 above (same namespace as the board).
3. `cd email-worker && npm install && npx wrangler login && npx wrangler deploy`
4. Email Routing → Routing rules → custom address `poirot@fl300.xyz` → *Send to a Worker* → `poirot`.
5. Test from Gmail/iCloud: "Nikola", "Uhvatili smo Nikolu", "Ema", "hmm no idea". Check the replies, the Proton copies, and Poirot's post on the board.

What the Worker does: always forwards to `FORWARD_TO`; ignores (forward only) mail with `Auto-Submitted` other than `no`, mail from `@fl300.xyz`, and mail whose first `mx.cloudflare.net` Authentication-Results lacks `dmarc=pass`; strips quoted history (`>` lines and everything from an "On … wrote:" / "… napisao:" line on); matches whole words: Nikola (any case) → correct, another guest's name → wrong, else none; replies once in-thread (multipart, hand-built MIME); logs `{time, from, subject, outcome}` to KV. If a reply throws, the outcome is logged with "/ error" and highlighted on the board.

**Local preview:** `cd site && python3 -m http.server 8000` (pages and answers work, the board API doesn't), or `npx wrangler pages dev site` for the functions too.

## Facts to confirm

| Fact | As used | Source |
|---|---|---|
| Trajan's Column frieze winds 23 times | 23 | Wikipedia, "Trajan's Column" (frieze "winds around the shaft 23 times"); F. Coarelli, *The Column of Trajan* (2000). |
| Base inscription | CIL VI 960, as quoted above; TANT[IS OPERI]BVS is a restored lacuna | CIL VI 960; Wikipedia "Trajan's Column" (Inscription). |
| Corvinus arms | Raven with a gold ring in its beak (Hunyadi family; Matthias Corvinus) | Wikipedia "Hunyadi family", "Matthias Corvinus"; source SVG above. The PD SVG also has a crescent; kept. |
| Orient Express | Snowdrift between Vincovci (Christie's spelling) and Brod; 12 wounds; Poirot offers two solutions | Agatha Christie, *Murder on the Orient Express* (1934): Part 1 (the snowdrift, Dr Constantine on the wounds) and the final chapter (the two solutions). Chapter numbers not checked. |
| Harker diary dates, ch. I–IV | 3, 4, 5 (twice), 7, 8, 12, 15, 18, 19, 28, 31 May; 17, 24, 25, 29, 30 June | Gutenberg #345 as hosted; `verify` checks the refs. |
| dCode Templar alphabet | default "Normal, historical version (1)" | https://www.dcode.fr/templars-cipher (checked 10 Nov 2026). |
| ICAO codes in the grid | AIP, ILS, VOR as abbreviations | — |
| Invite METAR | Live from aviationweather.gov through `/api/metar` (their API has no CORS, so a Pages Function fetches it, edge-cached 10 min). If it fails, the printed `LYBE 141900Z …` (= 20:00 local) stays. | — |
