# QA evidence — 2026-10-12 UTC

## Automated domain verification

16 tests passed. Exhaustive public-transition enumeration found **1,473 reachable progression states**, with **6,180 successful progression transitions**. All states passed save roundtrip/validation and observational-hint checks; every state has a route to the ending. Movement is factored out only because every unlocked scene is freely reachable through the chart; candidate fort actions still go through the public permit-and-signal gate. Terminal progress is stable. A reverse proof processes states by decreasing milestone count, not incidental discovery order.

Targeted tests cover exactly-once acquisitions/rewards/consumption, both recipe orders, absent items, wrong targets and verbs, premature lens use, locked bell, both gate requirements, revisitable dialogue, stage prerequisites, wrong answers after accepted answers, appeal before lighthouse, terminal inspection, restart isolation, corrupt/unknown/duplicate/inconsistent saves and hints after out-of-order lens recovery. TDD evidence is in [TDD.md](TDD.md). These automated routes are fixtures, not claimed as browser playthroughs.

TypeScript strict typecheck and Vite production build passed. Dependency audit found **0 vulnerabilities**. No runtime dependencies, fonts, image hosts, analytics or backend. Bundled page, JavaScript, CSS and favicon must each return HTTP 200; final verification commands and results are recorded in the delivery response.

## Actual visible Chrome completion

Supported local Chrome extension browser, ordinary native clicks and key input plus visible Playwright button clicks. No unlock, restriction bypass, injected state, localStorage fixture, console progression call or hidden solution API was used. Native keyboard 1–4 / M / J / Esc worked.

One complete adventure was played through visible controls, segmented by manual save/resume across reviewed production rebuilds. **Hint-assisted QA:** all three optional hint levels were deliberately displayed to verify graduation. This is not an unassisted-play claim.

Visible route: wharf ribbon → early Customs visit and blocked fort → out-of-order appeal answers and hat brag → save/reload → Orrin storm clue and crank → Miri repair clue/cork → wrong ribbon-on-cork → ribbon trade → Pella soap before toast, repeated soap branch, cup → interrupted combine/cancel → wrong cup+soap pair → cork+cup (reverse recipe order) → tide-pool lens → journal nudge/direction/full solution → premature lens use preserving lens → crank+cloth (reverse order) → vane repair → lens installation → signal-only blocked fort → Ada contribution-before-benefit → benefit, wrong brag, contribution, responsibility → permit → restart cancel → fort → locked bell take → latch observation → soap use and bell acquisition on mobile → repeated bell take → manual save → actual restart → load cancel then actual load → return to wharf and hang bell → **THE END**.

The completed screen showed Ada taking a seat, Juniper's original ending narration, the restored bell, and only the permit remaining in the bag. Post-ending Look at Juniper and the bell stand worked; attempting another acquisition changed no progress. Completed save resumed after the final code rebuild.

Second **partial replay**, not a second full completion: actual fresh restart, then **Pella → Miri → Orrin** civic clues (first run was **Orrin → Miri → Pella**), followed by all three Ada answers. Permit acquired before any lighthouse repairs; fort remained blocked without the signal. This verifies alternate order and independence through real controls.

## Visual and accessibility checks

All six illustrated locations were visited and screenshots inspected. Evidence includes [tavern](tavern.jpg), [market](market.jpg), [weather](weather.jpg), [customs](customs.jpg), [mobile fort](mobile-fort.jpg), [mobile ending](mobile-ending.jpg) and [desktop ending](desktop-ending.jpg).

390×844 responsive viewport tested (Chrome reported 375px document client width due to its scrollbar). Final document scrollWidth = clientWidth = 375; scene width 341; no horizontal overflow. Mobile named controls were enlarged to 44px targets and used to release/take the bell and complete the ending. Narrative, satchel, chart, and confirmation controls remained accessible with vertical scrolling. Desktop default viewport was restored.

Tab from the journal's last button wrapped to its first button; Esc closed it. Background controls were inert while modals were open. Named alternatives below the art offer the same scene actions; live narration reports outcomes. Developer emulation of prefers-reduced-motion yielded boat animationName **none** and was reset. No application console errors observed; browser-extension warnings were distinguished from game logs.

## Independent reviews and remaining limits

Two separate agents reviewed specification and standards, then rechecked the fixes. Spec reviewer independently ran 16 tests and typecheck; no remaining substantive findings. Standards reviewer found no hard violation; optional final milestone-query typing refinement was also applied. See [reviews](../reviews.md).

Manual saves are browser-local and explicit; no cloud sync. Corrupt save rejection is automated domain evidence, not a deliberately corrupted Chrome-storage experiment. No screen-reader-device audit, touch hardware, Safari/Firefox run, music, voice acting or public deployment. The production server is loopback-only and session-only; restart after reboot is manual. Existing projects and ports 5173–5207 were not changed. No sidebar registration is claimed.
