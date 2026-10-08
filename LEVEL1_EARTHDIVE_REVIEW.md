# Level 1 "Earth Explorer / EarthDive" — Code Review

Scope read in full: `EarthDiveGame.tsx` (1988), `engine/zones.ts` (1736), `engine/gameEngine.ts` (1322), `engine/player.ts` (686), `engine/renderer.ts` (651), `engine/npcManager.ts` (769), `earthDiveData.ts` (824), `earthDiveSync.ts`, `TelemetryHUD.tsx`, `MiniChallengeModal.tsx`, `CoreChallengeModal.tsx`, `SuitMerchantModal.tsx`, `VisualNovelDialogue.tsx`, `Wordle/index.tsx`, `Level1/index.tsx`, `Level1/Level1.tsx`. `sprites.ts`/`npcSprites.ts` inventoried via structural read + grep. `dialogueData.ts`/`DiscoveryModal.tsx` sampled structurally (4060 / 3815 lines).

---

## 1. Feature inventory (verified)

**Movement / physics** (`player.ts`)
- Platformer mode (zones 0–4): `SPEED 3.6`, `GRAVITY 0.44`, `JUMP_FORCE -8.8`, `DOUBLE_JUMP_FORCE -7.8`, `MAX_FALL 9.0`, `COYOTE_FRAMES 6`, `JUMP_BUFFER_FRAMES 6` (`player.ts:37-44`). Cosine-eased continuous terrain (`groundProfile`) with slope traversal, ≥10 px/frame step detection, ceiling collision, landing squash, variable jump height, jet-thruster double jump (16-frame flame, `renderer.ts:264-276`).
- Swim mode (zone 5, `player.ts:346-440`): 4-way swim (`SWIM_SPEED_X 3.2`/`Y 2.8`), buoyancy bob, Y clamped between 54 and ground−4, magma hazard bounce.
- Top-down mode (zone 7, `player.ts:240-343`): 4-way walk, `jumpZ`/`jumpZVelocity` pseudo-jump (impulse 5.6, gravity 0.36), fault-fissure barrier between y=228 and y=252 that can only be crossed while airborne (`player.ts:301-318`).
- Health: 100, damage 25 per hazard hit, 50-frame invulnerability, full heal + respawn at `zone.playerSpawnX/Y` on death, y>600 void guard (`player.ts:598-654`). Hazard areas: Mantle ×2, Inner Core ×2 (`zones.ts:474-475, 729-730`), plus a Divergent lava hazard regenerated each frame (`zones.ts:1056`).
- Keyboard (`player.ts:96-121`): A/D/←/→, W/↑/Space jump, S/↓ down, E/Enter interact. Touch D-pad + LONCAT + AKSI buttons with `pointerdown/up/leave` (`EarthDiveGame.tsx:1648-1736`).
- **Fixed 60 fps assumption**: all timers/counters are frame-based (`state.frame++`, `player.ts` constants); no delta time.

**8 geological zones** (`zones.ts:1664-1673`): `surface, crust, mantle, outerCore, innerCore, divergent, convergent, transform`. Each is built by a builder fn (projections + platforms + objects + optional hazards + spawn), then `buildAndSnap` → `snapPlatformsToGround` → `snapObjectsToGround` (`zones.ts:1657-1662`). 40×15 tiles for zones 0–4, 43×15 (1376 px) divergent, 48×15 (1536 px) convergent + transform.

**NPC / dialogue / visual novel**
- 3 AI states per NPC (idle/walk L/R) with patrol anchor, `patrolRange`, `speed`, randomized idle timers 90–150 frames; NPCs stop and face the player within 54 px (`npcManager.ts:673-768`).
- ~84 dialogue trees / 159 registry entries in `dialogueData.ts` (`DIALOGUE_REGISTRY:4002-4167`), 36 character profiles. Nodes support typewriter text, choices, `discoveryIdToMark`, `triggerDiscoveryModal`, `triggerChallengeGate`.
- `VisualNovelDialogue.tsx`: dual transparent canvas portraits (NPC left / player right), typewriter at 22 ms/char, micro-bounce, RPG choices, history log, auto-play, skip, safe-close on missing node (`:150-156`).
- Extensive dynamic dialogue routing in `EarthDiveGame.tsx:477-631` (locked / ready / unlocked / review variants per zone).

**Progression gate system**: per-zone `challenge_gate` object whose id is the unlock key; portal_down refuses until `unlockedGates.has(gateId)`; discovery-count gate blocks the challenge until all discovery objects in the zone are read (`gameEngine.ts:576-601`); suit requirement gate (`checkSuitRequirements`, `gameEngine.ts:500-539`).

**Discovery/materi modals**: 17-entry `ALL_DISCOVERY_CATALOG` (`earthDiveData.ts:538-809`), `DiscoveryModal.tsx` with 20 illustration types (SVG/canvas, imports 3 components from `Level2/DiscoveryModal` at `DiscoveryModal.tsx:9`).

**Wordle gate**: `Wordle/index.tsx`, `MAX_GUESSES = 3`, adaptive tile sizing by word length, on-screen pixel keyboard, per-user deterministic shuffle from an 11-word `WORD_BANK` (`:15-27, 62-81`). Used for per-zone gates (`customWords` from `ZONE_GATE_QUESTIONS`), the final core synthesis (`CORE_SYNTHESIS_WORDS`, 5 words), and an optional "BONUS QUEST" modal (`EarthDiveGame.tsx:1899-1922`).

**Telemetry HUD**: collapsible pill (default collapsed) showing depth km, pressure GPa, temperature, crystals, area discoveries, HP bar (`TelemetryHUD.tsx:28-155`). Hidden for zone 6 (`EarthDiveGame.tsx:1327`).

**Progress tracker**: `JourneyProgressTracker` with `LEVEL1_TRACKER_AREAS` (8 zones + 6 Level-2 entries) at bottom-center, fed `totalPercent = ((zone + localRatio)/8)*100` each rAF (`EarthDiveGame.tsx:838-846`).

**Costume/suit system**: 4 suits (`mantle_suit`, `outer_core_suit`, `inner_core_suit`, `diver_suit`) with full catalog + SVG previews in `SuitMerchantModal.tsx:32-183`; 4 merchant NPCs in zones 1–4.

**Persistence**: per-user `localStorage` key `resqbox_earthdive_progress_${userId||'guest'}` (`gameEngine.ts:84-88, 110-161`); saves zone, x/y/dir, health, crystals, suits, discoveries, gates, challenges, quests, `zonePositions` map, tectonic progress. Autosave every 45 frames + on stop + `beforeunload`/`pagehide`/`visibilitychange` (`EarthDiveGame.tsx:392-415`). Supabase sync via `earthDiveSync.ts`.

**Audio**: `retroAudio` chiptune SFX throughout (`playSelect`, `playPowerup`, `playError`, `playWin`, `playExplosion`, `playEarthquakeRumble`, …) with a persisted sound toggle.

**Tectonic simulations**: Divergent 5-phase state machine (calm 70 → quake 90 → temp_rise 105 → diverging → cooling 100+180 frames) with fish panic, plant wilting, dynamic ground profile (`gameEngine.ts:726-847`); Convergent ~9.2 s collision with NPC evacuation and land/ocean mode toggle (`:849-953`); Transform top-down strike-slip ~10.4 s (`:955-976`). Replay buttons for each (`EarthDiveGame.tsx:1466-1521`).

**Tutorial/onboarding**: `ResqyTutorialOverlay` with 5 Level-1 steps (`tutorialConfig.ts:298-345`).

---

## 2. Data & content (concrete)

**Zones & object counts** (from `zones.ts`, programmatic counting from builders)

| # | id | name | depthLabel | cols | crystals | NPCs | discovery NPCs | info signs | portals |
|---|---|---|---|---|---|---|---|---|---|
|0|surface|Permukaan Bumi|0 km (0 mil)|40|1|2|0|0|1 (down)|
|1|crust|Kerak Bumi|0–100 km (0–50 mil)|40|1|5|1|0|1 up, 1 down|
|2|mantle|Mantel Bumi|660–2.900 km (1.800 mil)|40|1|4|2|0|1 up, 1 down|
|3|outerCore|Inti Luar|2.900–5.150 km (1.400 mil)|40|1|4|2|0|1 up, 1 down|
|4|innerCore|Inti Dalam|5.150–6.371 km (750 mil)|40|1|4|2|0|1 up, 1 down|
|5|divergent|Batas Divergen|'' (empty)|43|3|4|2|0|1 up, 1 down|
|6|convergent|Batas Konvergen & Subduksi|'' (empty)|48|3|4|2|1|1 up, 1 down|
|7|transform|Batas Transform|'' (empty)|48|3|4|1|0|1 up, 1 down|

**Total crystals = 16.** `totalCrystals` is computed at runtime (`gameEngine.ts:259`).

**NPCs by zone** (object id → `data.name` / `npcType`):
- 0: `npc_raditya` (Zidane), `npc_maya` (Zahra)
- 1: `npc_gea` (Zidane), `npc_andini` (Lintang, material `crust_disc_compare`), `npc_budi` (Ican), `npc_hendra` (Bu Tyas, gate `crust_challenge`), `crust_suit_merchant` (Teknisi Joko, `mantle_suit`)
- 2: `npc_sarah` (Zahra, `mantle_disc1`), `z2_npc_lintang` (Lintang, `mantle_disc2`), `npc_surya` (Bu Tyas, `mantle_challenge`), `mantle_suit_merchant` (Teknisi Rudi, `outer_core_suit`)
- 3: `npc_ratna` (Zahra, `oc_disc1`), `npc_aris` (Lintang, `oc_disc2`), `npc_teguh` (Bu Tyas, `oc_challenge`), `oc_suit_merchant` (Teknisi Dian, `inner_core_suit`)
- 4: `z4_npc_zahra` (Zahra, `ic_disc1`), `z4_npc_lintang` (Lintang, `ic_disc2`), `npc_bintang` (Bu Tyas, `ic_challenge`), `ic_suit_merchant` (Teknisi Arya, `diver_suit`)
- 5: `npc_taufik` (Zidane), `npc_maya` (Zahra, `div_disc1`), `npc_ilham` (Lintang, `div_disc2`), `npc_satria` (Bu Tyas, `divergent_challenge`)
- 6: `z6_npc_zidane` (Zidane, `conv_disc1`), `z6_npc_zahra` (Zahra, `conv_disc2`), `z6_npc_ican` (Ican), `z6_npc_bu_tyas` (Bu Tyas, `convergent_challenge`)
- 7: `z7_npc_ican` (Ican), `z7_npc_zahra` (Zahra, `trans_sanandreas`), `z7_npc_bu_tyas` (Bu Tyas, `transform_challenge`) — **3 NPC objects only** (no 4th; `z7` builder has 3 NPCs, not 4)

**Gate Wordle answers** (`EarthDiveGame.tsx:53-90`): `ZONE_GATE_QUESTIONS`
- 0: KERAK, BENUA, BATUAN (3)
- 1: KERAK, BENUA, SAMUDRA (3)
- 2: MANTEL, KONVEKSI (2)
- 3: NIKEL, CAIRAN, MAGNET (3)
- 4: INTIDALAM, PADAT (2)
- 5: PANGEA, MENJAUH, MAGMA (3)
- 6: PALUNG, MERAPI (2)
- 7: TRANSFORM, SANANDREAS (2)

**Core synthesis** (`earthDiveData.ts:481-535`): 1 multiple-choice causality question (4 options) + 5 Wordle words LEMPENG, KONVEKSI, MAGNET, TEKANAN, GEMPA.

**Discovery catalog** — 17 entries (index → id / title):
0 `disc-crust-compare`, 1 `disc-divergen`, 2 `disc-konvergen`, 3 `disc-transform`, 4 `disc-mantel-bawah`, 5 `disc-bridgmanite`, 6 `disc-inti-luar`, 7 `disc-geodynamo`, 8 `disc-inti-dalam`, 9 `disc-inti-dalam-center`, 10 `disc-wegener-pangea`, 11 `disc-divergent-anim`, 12 `disc-divergent-anim` (duplicate id), 13 `disc-convergent-subduction`, 14 `disc-convergent-landforms`, 15 `disc-seismograph-plates`, 16 `disc-transform-sanandreas`. Each has title/shortDesc/fact/iconName/imageSrc/illustrationType.

**Strata data** (`earthDiveData.ts:84-466`): 8 `EARTH_STRATA_DATA` entries + 8 `MiniChallenge` blocks (4 options + explanation + siagaClue each) + 8 badge ids (`surface-scout`, `tectonic-tracker`, `mantle-explorer`, `magneto-guardian`, `core-specialist`, `rift-divergent`, `subduction-master`, `transform-master`).

**Mission scoring** (`earthDiveSync.ts:20-29, 43-115`): `STRATA_LAYERS` fixed points 12 / 25 / 38 / 50 / 63 / 75 / 88 / 100; badges Surface Scout, Mantle Explorer, Magnetic Shield, Core Specialist, Rift Explorer, Subduction Tracker, Master of Tectonics. `submitLevelProgress` posts `details.total_crystals: 5` (hardcoded).

**Fish** (zone 5): 8 fish with id 1..8, colors `#f97316,#0284c7,#eab308,#06b6d4,#f43f5e,#10b981,#a855f7,#38bdf8` (`zones.ts:1725-1735`).

---

## 3. Architecture

- **Entry**: route → `Level1/index.tsx` (`fixed inset-0` wrapper) → `EarthDiveGame` (also re-exported by `Level1.tsx`).
- **State ownership**: a single mutable `GameState` object held in `gameRef` (React ref), **not** React state (`EarthDiveGame.tsx:104`). The engine mutates it in place; React mirrors a small `hudData` struct (`:162-190`) once per rAF. Modals are driven by `pending*` flags on `GameState` that the loop drains and converts into React state (`:445-775`).
- **Loop**: single `requestAnimationFrame` loop in a `useEffect` keyed on `[isPaused, avatarConfig]`; per frame → `tickGame(game)` (skipped while paused) → drain pending flags → `setHudData` → `renderGame(ctx, canvas.width, canvas.height, game, avatarConfig)` → tracker update (`:426-853`).
- **Coordinates**: world in pixels; terrain as per-pixel `groundProfile` / `ceilingProfile` arrays (length = map px), legacy `tiles[][]` kept for `isSolid`/`tileAtPx` (only used internally). `TILE = 32`. Y = player's feet; sprites draw at `y - PLAYER_FRAME_H`.
- **Camera & scaling**: `getGameScale(canvasW, canvasH) = max(0.7, round((canvasH/480)*100)/100)` — vertical only, DPR-aware because `canvas.height` is already DPR-scaled (`renderer.ts:36-41`). Canvas resized to `innerWidth*dpr × innerHeight*dpr`, dpr clamped at 2.5 (`EarthDiveGame.tsx:361-376`). Camera lerps 0.12 toward `player.x − viewW/2`, clamps to map, centred when the map is smaller than the viewport (`renderer.ts:43-71`). Transition overlay is a 240-frame (~4 s) dark card with the target zone name + depth (`gameEngine.ts:365-373`, `renderer.ts:530-651`).
- **Render pipeline** (`renderer.ts:102-357`): clear → parallax background → `ctx.scale(scale)` + `translate(−camera)` → terrain (cached offscreen canvas per zone for 0–4; procedural each frame for 5/6/7) → decorations → objects with per-type draw → player (squash/stretch, invuln blink, jet flame, top-down shadow) → mascot Resqy → restore.
- **Module graph**: `renderer` imports draw functions from `sprites.ts` + `npcSprites.ts`; `gameEngine` orchestrates `player` + `zones` + `npcManager` + `renderer`; `EarthDiveGame` is the only React consumer of `gameEngine`. `sprites.ts` re-exports `getPlayerSheet`/`clearSpriteCache` from `utils/studentAvatarSheet`.
- **Save/load**: `createGameState(userId)` loads the scoped key, restores zone + per-zone position + sets, applies backward-compat suits for zones 2–5, re-centres the camera; `saveEarthDiveProgress` merges `zonePositions` by re-reading the existing payload (`gameEngine.ts:110-320`).

---

## 4. Issues found

**High impact**

1. **Click hit-testing ignores `getGameScale`** — `handleCanvasClick` converts with `worldX = camera.x + clickX / scale` (`gameEngine.ts:1115-1118`) but the canvas is DPR-scaled and drawn at `scale`. The correct conversion is `camera.x + clickX / (scale * dpr)` (`scale = dpr·canvasH/480` etc.), so on any device with `devicePixelRatio > 1` clicks land at the wrong world position. I'm confident this is a bug (the renderer applies `scale` to the identity-transformed DPR canvas, `renderer.ts:139-140`); it is not covered by `EarthDiveGame.tsx:1220-1224`, which passes raw canvas pixels.
2. **Clicking a `challenge_gate` bypasses the discovery gate** — `handleCanvasClick` sets `state.pendingChallenge = obj` directly (`gameEngine.ts:1155-1158`), skipping the "all discoveries read" check that `handleInteraction` performs (`:576-596`). Tapping the gate therefore opens the Wordle without reading the materi.
3. **Suits never cost anything** — the catalog, HUD and copy all say "1 Kristal" (`SuitMerchantModal.tsx:198, 323, 358`), but `buyAndEquipSuit` only does `purchasedSuits.add` + `equippedSuit = suitType` (`gameEngine.ts:492-498`); no code anywhere removes from `collectedCrystals` (confirmed by exhaustive grep for `crystal` in `Level1/EarthDive`). Prices and the affordability check are cosmetic; 16 crystals are collectible but only ever displayed.
4. **Suit requirement is bypassable via the canvas click** — `checkSuitRequirements` (`gameEngine.ts:500-539`) is called only in the `[E]`-interaction path (`handleInteraction`, `:628, 672`). The on-screen "TURUN" button goes through `handleDiveClick → triggerDiveDown` (`EarthDiveGame.tsx:1250-1265`), and **`triggerDiveDown` has no suit check at all** (`gameEngine.ts:1055-1091`), same for `handleCanvasClick`'s `portal_down` branch (`:1135-1138`). So a click/tap on the portal (or the button) descends into the Mantle/Outer Core/Inner Core/Divergent without ever buying the suit. Conversely, the intended flow can dead-end until the player revisits the merchant and presses "KENAKAN SEKARANG". Separately, `buyAndEquipSuit` overwrites `equippedSuit` with just the newest suit (`gameEngine.ts:492-498`), so re-equipping the currently-required suit after buying a later one requires a trip back to the specific merchant.
5. **Frame-rate-dependent simulation** — every timer is a frame count (transition 240 frames, textures and shake divisors, `divergentProgress += 0.0035`, `convergentProgress += 0.0018`, `transformProgress += 0.0016`). On a 120 Hz display everything runs ~2× fast; on a throttled tab, slow.
6. **Duplicate, partly-fabricated Level-1 submission** — `CoreChallengeModal.handleWordleSuccess` posts a hardcoded payload (`score: 100`, `current_layer: 'Inti Dalam…'`, `current_zone: 4`, `crystals: 5`, `badges`, `words: ['LEMPENG','KONVEKSI','DINAMO','TEKANAN','SUBDUKSI']` — `'DINAMO'` is not one of the `CORE_SYNTHESIS_WORDS`) at `CoreChallengeModal.tsx:35-53`; then `EarthDiveGame.tsx:1857-1859` calls `onCoreChallengeComplete` + `syncEarthDiveProgress(game, student, true)`, which posts a *second* payload. `details.total_crystals: 5` (`earthDiveSync.ts:158`) contradicts the real 16.
7. **`earTHDiveSync.computeEarthDiveProgress` invents data** — it hardcodes `solvedWords` lists that don't match the actual gate answers: `'BOLABESIPADAT'`, `'SEPULUHRIBU'` (`earthDiveSync.ts:80`) appear nowhere in the codebase; `'PANAS'` (`:64`) is not a zone-2 gate word (`ZONE_GATE_QUESTIONS[2] = MANTEL, KONVEKSI`); `'SESAR'`/`'GEMPA'` (`:104`) are not zone-7 words; zone-2/3/4 lists are emitted from gate-unlock flags regardless of which words were actually solved. `STRATA_LAYERS[0].gateId = 'surface_gate'` (`:21`) — no such gate id exists (surface has no `challenge_gate` object).

**Medium**

8. **Zone ↔ strata off-by-one** — gameplay zone index is 1 ahead of `EARTH_STRATA_DATA` for the first five zones (`EarthDiveGame.tsx:778-791`), so `handleTriggerGateChallenge` computes `EARTH_STRATA_DATA[zoneIdx]` (`:1167`) and `ZONE_GATE_QUESTIONS[zoneIdx]` (`:1201`). For zone 0 the fallback `|| ZONE_GATE_QUESTIONS[1]` yields zone 1's questions, so the authored `ZONE_GATE_QUESTIONS[0]` (KERAK/BENUA/BATUAN) is dead. `isLevelEnd` also uses the mismatched `challenge.strata.index >= 7 && EARTH_STRATA_DATA.length >= 8` as a secondary condition (`:915`) — harmless today but semantically wrong.
9. **`isLevelEnd` early-unlock risk** — `unlockLevel(2)` fires whenever `game.currentZone >= 7` at gate success (`EarthDiveGame.tsx:915-918`). Because the transform gate is the only gate in zone 7 this is currently correct, but the condition does not verify *which* gate was solved.
10. **Double-fire on gate success** — `Wordle`'s completion screen calls `onSuccess?.()` **and** `onClose?.()` (`Wordle/index.tsx:249-253`); `EarthDiveGame` passes only `onSuccess` (`:1837`), so `onClose` is undefined there — but the same pattern is used at `CoreChallengeModal` and would double-invoke if a close handler is ever added. `handleChallengeSuccess` itself calls `syncEarthDiveProgress` twice in the level-end branch (`:919`) plus once more from `CoreChallengeModal.tsx:35`.
11. **`initInput()` re-registers listeners with no cleanup** — `gameEngine.initGame()` → `initInput()` adds `keydown`/`keyup`/`blur` on `window` (`player.ts:65-75`) and is called in a `useEffect` keyed on `activeUserId` with no teardown (`EarthDiveGame.tsx:249-250`). Every user switch (and React StrictMode double-mount) stacks another set of handlers; `resetInputKeys()` also doesn't reset the `mobile*Prev` latches (`player.ts:77-94`).
12. **`setHudData` allocates a new object every rAF** (`EarthDiveGame.tsx:817-831`) → a React re-render every frame while playing, in addition to `setPlayerHp` (`:474`). `npcTypes` never changes so it usually bails out, but `energy`/`nearObjectType` change often. Also `tickGame` does `document.querySelector('#earth-dive-canvas')` every frame (`gameEngine.ts:979`).
13. **Dead plumbing**: `GameState.pendingInfoSign` is written (`gameEngine.ts:1152`) and nulled (`:1187`) but never read by any component (verified by grep); info signs work through the separate `nearObject`-based reactive path (`EarthDiveGame.tsx:726-764`). `dismissInfoSign` (`gameEngine.ts:1186`) is unreferenced.
14. **`getDiscoveryItem`'s null branch is dead** — the return type is non-nullable (`earthDiveData.ts:811-822`), yet `EarthDiveGame.tsx:636` and `:1104` test `if (discItem)`. The fallback silently returns `EARTH_STRATA_DATA[0]` for any unknown index, so a bad discovery id would render the wrong materi rather than fail.
15. **Duplicated discovery-key bookkeeping in three places** — `EarthDiveGame.tsx:641-649` (pendingDiscovery), `:1093-1157` (`handleOpenDiscoveryModal`, a 14-branch nested ternary mapping index→key), `:1762-1772` (onClose for `transform-sanandreas`), plus `handleMarkDiscovery` (`:1089-1101`). Keys are added both as `disc_N` and as semantic aliases (`trans_seismo`, `oc_disc1`, …), and the discovery-completion checks in two different places (`EarthDiveGame.tsx:794-809` vs `gameEngine.ts:580-590`) don't test the same set — `EarthDiveGame` additionally special-cases transform.
16. **Duplicate/unused content**: `discoveryId` 11 and 12 are the same discovery (`earthDiveData.ts:715-744`, both `id: 'disc-divergent-anim'`); `EARTH_STRATA_DATA`'s 8 `challenge: MiniChallenge` blocks and all 8 `badgeId` values are never consumed (grep for `.challenge` → 0 hits); `MiniChallengeModal.tsx` (Level 1 copy) is imported by nothing — only `Level2/MiniChallengeModal` is used (`TectonicGame.tsx:34`); `MascotGuide.tsx` is a **0-byte file**; `GEOLOGICAL_APERTURE_INTRO` (`earthDiveData.ts:77`) and `STRATA_LAYERS` (`earthDiveSync.ts:20`) are unreferenced.
17. **Unreferenced exports** (grep: only their own definition site) — `drawGroundTile`, `drawWallTile` (`sprites.ts:5614, 5619`), `getObjectPos`, `isSolid`, `tileAtPx`, `getCeilingY`, `updateTransformGroundProfile` (`zones.ts:1570, 1685-1710`), `clearPortraitCache` (`npcSprites.ts:21`). `updateConvergentGroundProfile` and `updateDivergentGroundProfile` **are** used; `renderOrganicDivergentTerrain` is used by the renderer.
18. **Dead conditional** — `getEffectiveGround` returns `currentY` for transform (`player.ts:203-205`), so the subsequent `zone.id === 'transform' ? 200 : …` ternaries in `gameEngine.ts:439, 448` are unreachable-in-effect.
19. **Zone-7 mode never leaves `transform`** — `transformProgress` never resets on re-entry (`updateTransition` only resets it when `currentZone === 7` transitions in, `gameEngine.ts:431-433`; on load `createGameState` initialises it to 0 but never reads a saved value even though `transformProgress` is persisted, `gameEngine.ts:107, 152`). Re-entering the zone via portal_up/down resets it, but a page refresh mid-animation restarts at 0 while the saved value is ignored.
20. **Zone-7 renderer never consumes the saved progress** — `transformProgress` is passed to `renderOrganicTransformTerrain` (`renderer.ts:158`) but `updateTransformGroundProfile` is a no-op (`zones.ts:1570-1572`).

**Low / cosmetic**

21. Merchant dialogue ids `crust_merchant_dialogue`, `mantle_merchant_dialogue`, `oc_merchant_dialogue`, `ic_merchant_dialogue` are referenced by zone NPC data but absent from `DIALOGUE_REGISTRY` (verified by set difference over all 30 zone `dialogueId`s). They are currently harmless because suit merchants route through `pendingSuitMerchant` (`gameEngine.ts:558-560`), but any future `getDialogueTree` change would silently yield `null`.
22. `NpcState.npcType` (`npcManager.ts:11-48`) and `NpcWorldType` (`npcSprites.ts:28-65`) duplicate long string unions rather than sharing one type.
23. Several `NpcState` alias ids don't match any zone object id (`'npc_lestari'`, `'npc_farhan'`, `'npc_arya'`, `'npc_rudi_trans'`, `'npc_guntur_trans'`, `'z0_npc_lintang'`, …). These are only lookup fallbacks in `gameEngine` (`:399, 876-877`) and are silently dead.
24. `DiscoveryModal` ignores the `strataName`, `depthRange`, `tempRange`, `composition` props that `EarthDiveGame.tsx:1756-1761` carefully computes and passes (it destructures only `discovery`/`onClose`, `DiscoveryModal.tsx:20-23`), and `DiscoveryModal.tsx:9` imports illustration components from `Level2/` — an inverted dependency.
25. Zone 5 `depthLabel`/`temperature`/`pressure` are empty strings (`zones.ts:866-868`, and same for zones 6/7) while zones 0–4 have values; the transition card therefore omits the depth row for the last three zones (`renderer.ts:639-645`).
26. `any` usage: `(window as any).__resetEarthDive` (`EarthDiveGame.tsx:341-343`), `pt.icon as any` (`DiscoveryModal.tsx:101, 129`). No `TODO`/`FIXME`/`@ts-ignore` in the Level-1 engine or game folder.
27. `tsconfig.app.json` sets `noUnusedLocals`/`noUnusedParameters` but not `strict`; unused params are silenced with `_` prefixes (`renderer.ts:36`, `zones.ts:1570`, `sprites.ts:5614`).
28. Tiny oddity: `SuitMerchantModal` renders two emoji glyphs (`🔒`, `⚡` at `:351, 365`) in a file/codebase whose headers repeatedly claim "Zero Emoji OS".

**Things I could not confirm as bugs** — I'd flag these as "verify" rather than defects: the camera/dpr scale interaction in #1 (I reasoned it from the code, I did not run the game); whether the suit gate in #4 is actually reachable in normal play depends on which input path the tester uses; and the `progress < 0.5` zone swap inside `updateTransition` (`gameEngine.ts:377`) means the player is placed with `getEffectiveGround` before the target zone's dynamic profile exists for zones 5/6 (they are reset in the same block, so ordering looks intentional).

---

## 5. Gaps vs documentation

From `Readme.md` (Level-1 sections, lines 43–75, 286–295):

| Claim | Reality |
|---|---|
| "Area 6 (Batas Divergen) … rute 2.208 px (69 kolom)" with Komandan Satria at `px: 2060`, Wordle gate `px: 2110`, portal `px: 2160` (Readme:49) | Zone id `divergent` is **1376 px / 43 cols** (`zones.ts:745-746`); NPCs sit at px 170–1140 and the down portal at 1240 (`zones.ts:765-861`) |
| Portal label "Batas Transform" reached from `innerCore` (Readme:53) | Correct as labelled, but the final zone's depth/temp/pressure are empty strings |
| "Didampingi 5 NPC (Dr. Maya, Prof. Sarah, Dr. Taufik, Petugas Rudi, Komandan Guntur) … berdampingan dengan Kapsul Evakuasi" at Y=315 (Readme:60) | Zone 7 has **3** NPC objects: Ican (560,170), Zahra (880,160), Bu Tyas (1360,315) (`zones.ts:1475-1540`). None of the five named NPCs appears; those names exist only as registry aliases |
| "Evaluasi Wordle akhir (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`)" (Readme:60) | `SISMOGRAF` is not in `ZONE_GATE_QUESTIONS[7]`; it is in the generic `WORD_BANK` (`Wordle/index.tsx:26`) and the Level-2 crossword (`Readme:93`) |
| Area 2 (Kerak) "100 km", HUD metric "35 km" | `zones.ts:322` says 0–100 km; `JourneyProgressTracker` says 35 km; `earthDiveData` says 0–100 km |
| "Monitoring Multi-Level & Skoring Dinamis — Level 1 (20 poin/lapisan tuntas)" (Readme:109) | Nothing in Level 1 awards 20 points; `earthDiveSync.ts:20-29` uses 12/25/38/50/63/75/88/100, and the final score is force-set to 100 (`earthDiveSync.ts:140-144`) |
| Mini-challenge feature: `MiniChallengeModal.tsx` exists with "+1 Crystal & BADGE" copy (`MiniChallengeModal.tsx:84, 158`) | Not wired into EarthDive at all — no import site; the 8 authored `EARTH_STRATA_DATA[i].challenge` quizzes and badge ids are never shown, and no crystal is ever awarded for them |
| "9 Kristal Kumulatif" (Readme:83, Level 2) / `crystals: 5` (`earthDiveSync.ts:158`, `CoreChallengeModal.tsx:46`) | Level 1 actually has **16** crystal objects; the "5" and "5/5 Geo-Crystals" copy (`CoreChallengeModal.tsx:222`) are hardcoded |
| Visual-novel claim "soal tebak kata … tanpa membocorkan kunci jawaban" (Readme:67) | The gate `hint` strings in `ZONE_GATE_QUESTIONS` largely contain the answer in the sentence for several entries (e.g. `MANTEL`, `KONVEKSI`, `MAGNET`, `TRANSFORM`) — arguably intentional, but it contradicts the claim |

From `design.md` (688 lines): no Level-1 implementation claims beyond palette/typography; its Level-1 checklist items ("Redesain Level 1 materi pages", "Update Wordle game ke pixel aesthetic", `design.md:707, 709`) are **unchecked boxes**, and the Wordle is in fact fully pixel-styled (`Wordle/index.tsx:375-556`), i.e. the doc is stale, not the code.

**Files that are empty or unreferenced (verified):** `EarthDive/MascotGuide.tsx` (0 bytes, no references); `EarthDive/MiniChallengeModal.tsx` (referenced by nothing); the unused exports listed in §4.17; `GEOLOGICAL_APERTURE_INTRO`, `STRATA_LAYERS`.

*No files were modified during this review except this report.*
