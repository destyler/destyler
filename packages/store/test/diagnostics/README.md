# Unresolved version-protocol diagnostics

These assertion-based reproductions are intentionally outside the passing `*.test.ts` suite. They describe unresolved findings, not supported guarantees or fixed behavior.

Run from the repository root:

```sh
pnpm exec vitest run --config packages/store/test/diagnostics/vitest.config.ts
```

All four cases currently fail on both the baseline protocol and the membership-only dispatch repair:

- An aliased child can propagate an older version after a nested synchronous write. This assertion originally shipped in PR #152; restoring the baseline version protocol explicitly defers it here rather than pretending the dispatch lifetime fix solves version ordering.
- An unobserved parent can retain a stale snapshot when a child from a second module copy changes.
- Equal version tokens from different copies can suppress an observed child notification, including the first update before re-subscription.
- Separately loaded copies have independent clocks; cross-copy mutation versions are not monotonically ordered.

PR #152 now addresses dispatch membership only. Numeric ordering, global clocks, and operation-origin tracking are not part of its fix. A shared-clock/origin experiment passed two-node probes but introduced an observed three-node stale-snapshot regression through a legacy intermediary. The all-legacy and mixed-copy passing controls in `legacy-copy-lifecycle.test.ts` retain that minimized regression.

A future version-protocol fix must rerun these diagnostics and the legacy interoperability controls; it must not merely replace `!==` with `<` or assume older module copies adopt a new global clock.
