# Standards

Keep game rules in pure typed public domain functions. The view must dispatch those rules rather than mutate progression. Saves are untrusted input and must be validated. Use no runtime dependencies or external image/font requests. Use textContent for player-visible strings; HTML templates contain only authored identifiers/content. All pointer actions have named focusable button equivalents. Motion respects prefers-reduced-motion. Tests express specification behavior at public boundaries.
