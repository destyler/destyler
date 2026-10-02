# Native form comparison: validation only, do not merge

This temporary validation branch retains immutable baseline evidence and now compares a narrow accepted-state resynchronization candidate against it. Do not merge this branch or treat its expected diagnostic failures as an implementation readiness signal. Keep it open until cleanup is explicitly authorized.

## Current candidate scope

Only Checkbox/Switch trusted CHECKED.SET handlers, Radio trusted SET_VALUE/input synchronization, and Radio's synchronization-only includeDisabled selector option change. The candidate reuses existing synchronization actions after a proposal. Dispatch and focus filters retain their defaults. No reset timing, initial mount, accepted-update/late-cancellation, dependency, configuration or version change is included.

The same 43 diagnostic assertions are byte-identical to baseline commit `ac0bed51431d4bef2ffd7d3288195fad79f20a8a` (test SHA256 `13feeafba9ebf28b81764d9da4f3631f10adcfc049541f6d27722b16fc99d149`). Compare each case, not just totals. Every baseline-passing case that newly fails blocks the candidate. Unchanged baseline failures must remain visible and explicitly unresolved.

## Immutable baseline evidence

- `5d68e0049a4d781316b68055547b93830cde6ae1`: original 26 cases, 12 expected contract failures and 14 passes on Node 20/22/24 in Chromium; all six original platform sentinels pass.
- `501db29b750623486b39d7f76f5623133c291252`: 30 cases, 14 expected failures and 16 passes on all three Node versions; scripted versus trusted reset-button microtask ordering controls pass.
- `ac0bed51431d4bef2ffd7d3288195fad79f20a8a`: 43 cases, 20 expected failures and 23 passes with identical per-case results on all three Node versions; all nine platform controls pass. Ordinary trusted acceptance and veto-with-late-cancellation pass; ordinary veto and acceptance-with-late-cancellation fail for all three components.

All those baseline commits retain production source from `346dfee0a6c2c243900ffcabf0648a1d58b6f4a6`. The current candidate must not be described as unchanged-baseline production.

## Harness limits

Component cases using HTMLInputElement.click exercise programmatic native activation. The separately named trusted cases use actual browser-locator clicks and assert event.isTrusted. They compare final native checkedness/FormData with accepted context, without demanding retroactive removal of an already-delivered proposal. No adapter rendering, layout, assistive-technology or general mount-order guarantee is inferred.

Platform-order controls are distinct from normative library-contract assertions. No skip/fails or wrong-behavior assertions hide a defect. Tests settle an event-loop turn; canceled-reset cases still require zero callbacks. The DOM emulator has known native-reset errors, so local observations alone are not native evidence. The spec lives outside a workspace package to avoid duplicate pnpm alias discoveries. Existing press draft #158 and independent implementation drafts #205/#209 remain separate.
