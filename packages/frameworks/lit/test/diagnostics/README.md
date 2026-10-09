# Unresolved context-classification diagnostics

These assertion-based reproductions are intentionally outside the passing `*.test.ts` suite. They preserve unmet requirements, not fixed behavior. No test is inverted with `it.fails`, so an unrelated exception is never reported as a passing diagnostic.

Run from the repository root after building the Lit dependency closure:

```sh
pnpm --filter '@destyler/lit...' build
pnpm exec vitest run --config packages/frameworks/lit/test/diagnostics/vitest.config.ts
```

All four cases currently fail at the before-created ordinary-context assertion. Their later connection and context-update assertions remain intact:

- `get` absent: `created` observes the machine's initial count, not the ordinary context's count.
- `get: undefined`: the same classification remains unresolved.
- `get: null`: the same JavaScript boundary remains unresolved.
- Callable `get`: `created` observes the result of `get`, not the ordinary context data; the unwanted call also occurs.

The absent-`get` case preserves the original ordinary-subscribe-data requirement from PR #200. The other three make the same classification boundary explicit. All use a non-callable `subscribe` field that should be treated as ordinary data under the unresolved broad-discrimination requirement. Running them should produce four failures and a nonzero exit status. These are not four passing tests or four fixes.

The narrow repair handles ordinary context with a non-nullish, non-callable `get`. It deliberately keeps the legacy subscribe-presence test. Reading `subscribe` earlier would change valid accessor/Proxy traces, exception order, and initialization before `created`; late validation cannot undo those side effects. Broad callable source discrimination therefore remains on hold pending an explicit compatible policy.

A future classification change must rerun these diagnostics along with the normal accessor, lifecycle, ownership, and strict-consumer tests. The callable browser-only `document.all` control must run in an actual browser. Do not suppress these failures or widen the normal suite's success count to claim the broad requirement is resolved.
