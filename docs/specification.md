# The Last Laugh Lagoon

An original, complete 20–35 minute pirate comedy adventure. Juniper Quill, a junior courier with an oversized hat and an undersized boat, must return the community's Laughing Bell before the annual evening toast. Commodore Clasp impounded it for being 'an unlicensed expression of maritime joy'. The ending returns the bell and invites the embarrassed customs clerk to the party.

## Autonomous design tree

User authorization accepts recommended defaults in place of an interview. Round 1: original island comedy; six locations; no combat, death or timers. Round 2: visible illustrated hotspots plus equivalent named controls; contextual Look/Talk/Take/Use; inventory combining; all locations except fort initially open. Round 3: three intersecting puzzle chains, revisitable conversations, three-stage civic negotiation, optional graduated hints, validated local saves. Round 4: pure transition and persistence seams for TDD; native Chrome completion; private GitHub only. Every frontier is settled. Browser runtime has no network dependency or external assets.

## World

Lantern Wharf ↔ Crooked Cup ↔ Button Market ↔ Weather House ↔ Customs Steps ↔ Paper Fort, with a map permitting convenient travel among known destinations. The fort requires both a permit and the lighthouse signal. Original authored vector stage art, prominent focusable hotspots, lighting, character portraits and environmental details. No pixel hunts.

## Puzzle dependency specification

- Take cup at tavern and cork at market. Combine in either order → corked cup. Use corked cup on wharf tide pool → rescue lamp lens, consuming the cup once.
- Take ribbon at wharf; use it on tailor at market → trade for sailcloth. Take crank at Weather House; combine sailcloth/crank in either order → wind scoop. Use scoop on weather vane → repair beacon drive. Use lens on beacon only after drive repair → send signal. Needed components cannot be consumed elsewhere.
- Talk tavern keeper about toast → learn belonging; talk tailor about repairs → learn usefulness; talk weather keeper about storms → learn shared responsibility. Revisits always available. At Customs ask to appeal, then answer three questions with those ideas. Wrong replies reset no successful stages. Clues gate each correct reply, with explicit feedback; permit follows three stages.
- Talk tavern keeper about sticky paperwork → receive soap once. With signal and permit enter fort; use soap on latch → free bell, consuming soap once. Take bell; return to wharf and use bell on mooring → ending.

## Guarantees

Acquisition and consumption occur once. Wrong verbs, absent items, wrong targets, repeated actions and premature actions preserve progression and explain why. Cancel clears transient intent. No required item can be dropped. Terminal state allows inspection and restart but no progression. Hints are three graduated levels per current objective and never change state. Restart requires an explicit confirmation with safe cancel. Save validation checks version, shape, known flags, uniqueness, prerequisites, location access and inventory consistency (inventory is derived); corrupt/incompatible saves preserve the live state. Save/reload and restart are separate controls. Storage failures are disclosed.

## Verification seams

Authorized task explicitly requests tests for progression and persistence: test public newGame/transition/inventory/hint/decodeSave boundaries. Domain tests catch puzzle and softlock defects; visible Chrome run catches UI wiring, focus, layout and presentation. Exhaustively enumerate reachable progression states and prove each can reach the ending, with movement factored out because every unlocked scene is bidirectionally reachable. Separate spec and standards agents review committed diff from initial docs commit. Responsive layout, reduced motion, readable text, keyboard named buttons, live narration, and safe focus preservation are required.

## Inspiration and limits

Inspired by the genre's exploration, interconnected inventory reasoning and comic conversations. No Monkey Island names, characters, dialogue, insults, map, puzzle solutions, art or music are used. All art is authored SVG. No music, voice acting, backend, paid service, public deployment or registration claim. Manual local saves use this browser's storage; no cloud sync.
