# Targeted red/green evidence

Public seams authorized by the task: newGame, transition, inventory, hint, encodeSave and decodeSave. Tests operate through those boundaries; no UI run was populated with test fixtures.

1. Ribbon acquisition test first failed because domain.ts did not exist. Minimal acquisition implementation passed; repeated acquisition yielded one ribbon.
2. Cork + cup test first failed with actual [] vs expected ['buoy']. Implemented actual acquisition/combination semantics; both orders passed and ingredients disappeared once.
3. Persistence and observational hints tests first failed because decodeSave was not exported. Implemented version/shape/prerequisite validation and hints; roundtrip and impossible consumption assertions passed.
4. Independent review's terminal inspection regression failed: expected /courier/, received generic ending text. Permitting observational Look passed.
5. Actual browser's out-of-order lens recovery exposed stale hints. Regression expected /lens.*bag/, received a tide-pool hint. State-aware objective now passes.

The broader 16-test suite includes additional regression and exhaustive tests written after implementation; these are not claimed as red/green cycles. Initial test invocation also exposed tsx CLI's sandbox IPC restriction. `node --import tsx --test` avoids its unrelated pipe server and runs inside the sandbox.
