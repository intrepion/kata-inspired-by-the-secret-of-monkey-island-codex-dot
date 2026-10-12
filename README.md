# The Last Laugh Lagoon

An original pirate comedy point-and-click browser adventure. Junior courier Juniper Quill must recover the community's Laughing Bell from Commodore Clasp's Paper Fort—and find a seat for a lonely customs clerk.

Six illustrated scenes, four conversable characters, two commutative inventory recipes, interlocking lighthouse and civic-appeal puzzles, optional graduated hints, manual local saves, safe restart, and a complete ending. All prose and SVG art are original. Genre inspiration: The Secret of Monkey Island's comic exploration and inventory reasoning; no copied characters, names, art, maps, dialogue, insults, music, or puzzle solutions. No runtime network requests, paid services, music or voice acting.

## Play locally

Requires Node 24 and npm. This is a private repository; no public deployment was created.

```sh
npm ci
npm run build
npm run preview
```

Open **http://127.0.0.1:5208/**. The server binds loopback only and refuses to use another port if 5208 is occupied. Existing projects and servers on 5173–5207 are preserved.

Exact restart from any directory:

```sh
cd /Users/intrepion/Documents/Codex/2026-10-11/task-24/kata-inspired-by-the-secret-of-monkey-island-codex-dot && npm run preview
```

The delivered production preview runs as a detached session-only Node process (PID recorded in ignored `preview.pid`, output in ignored `preview.log`). It has no boot/login autostart. If it is already running, use the play URL; do not launch a second copy. To stop only this game, verify `ps -p "$(cat preview.pid)" -o command=` names this repo's Vite preview, then `kill "$(cat preview.pid)"`. PID files can become stale after reboot: never kill an unverified PID.

## Controls

Click scene labels or the equivalent named buttons below the illustration. Select Look, Talk, Take or Use (keys 1–4). Click a satchel item to Use it on a target. Choose Combine items, then click two items; either recipe order works. Esc cancels a selected item or closes a modal. M opens the chart, J the field journal. Every action is available with Tab and Enter. Mobile buttons have named alternatives to small scene labels; reduced motion disables bobbing.

Save is manual and browser-local. Reload offers Resume saved voyage. Load and Restart have a cancelable confirmation. Restart preserves the last manual save until you save again. Browser storage is not a cloud backup. Invalid saves are refused with feedback.

## Verification

```sh
npm test
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

See [specification](docs/specification.md), [glossary](GLOSSARY.md), [architectural decisions](docs/adr/0001-progress-and-inventory.md), [independent reviews](docs/reviews.md), and [QA evidence](docs/qa/REPORT.md). Domain tests include every reachable progression state; this is distinct from the recorded real Chrome completion.
