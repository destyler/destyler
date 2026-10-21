# Release notes and historical addenda

These notes supplement the [GitHub Releases](https://github.com/destyler/destyler/releases).
They provide migration guidance and evidence-backed historical addenda, not a new
release or a complete historical changelog.

## 0.2.12: BREAKING Tabs nullable value-change callbacks

**Upgrading `@destyler/tabs` from 0.2.11 or earlier to 0.2.12 or later requires
handlers to accept nullable selection requests.** This compatibility change
shipped in the 0.2.12 patch release. A range such as `^0.2.6` permits 0.2.12;
a patch update is not evidence that the previous callback contract is retained.

[PR #208](https://github.com/destyler/destyler/pull/208) widened
`ValueChangeDetails.value` from `string` to `string | null` and stopped suppressing
`onValueChange({ value: null })`. Under strict function checking, an explicitly
string-only TypeScript handler is no longer assignable. This does not mean every
TypeScript consumer fails to compile. JavaScript and loosely typed handlers also
need to handle null before using string operations.

Null notifications occur when `api.clearValue()` requests clearing a non-null
selection, or a `deselectable: true` interaction requests deselection (including
clicking the selected trigger or pressing Enter on it in manual activation mode).
`onFocusChange` is not widened by this change. Clearing an already-null accepted
value remains a no-op.

For a controlled machine, `onValueChange` reports a request, not an accepted
selection: the parent must sync `value`, including null, to accept it. A vetoed
request can be repeated; syncing the parent value does not echo a callback. An
uncontrolled machine updates its value before notifying the handler.

Use the exported `ValueChangeDetails` type (or a handler accepting `{ value: string | null }`) and
handle the null branch explicitly. See the
[Tabs migration guide](./packages/components/tabs/docs/tabs.mdx#migration-nullable-value-change-notifications)
for an example and ownership details. Do not cast away null to preserve a
string-only handler.

[PR #285](https://github.com/destyler/destyler/pull/285) separately corrected
programmatic selection. It did not introduce the nullable callback contract.
The [published UI compatibility issue](https://github.com/destyler/ui/issues/151)
is separate from this core migration note.

### Published Release correction

The [v0.2.12 Release](https://github.com/destyler/destyler/releases/tag/v0.2.12)
now opens with a BREAKING compatibility notice and a direct migration link.
The original Bug Fixes changelog remains below it. This is a documentation
correction to the existing Release, not a new package release or a tag change.

## Historical addendum: v0.2.8 source changes carried into v0.2.9

This addendum records the missing changelog range; it does not announce a new
release or establish that npm version 0.2.8 was ever published.

### Verified record (2026-10-21 UTC)

- The `v0.2.8` tag resolves to commit
  [`9b8a4fa6`](https://github.com/destyler/destyler/commit/9b8a4fa66b63dfa09e1302ef96bce7e95ccc7c01).
  The [v0.2.7...v0.2.8 comparison](https://github.com/destyler/destyler/compare/v0.2.7...v0.2.8)
  contains 17 commits, but the GitHub Releases list has no corresponding v0.2.8 entry.
- The [v0.2.9 Release](https://github.com/destyler/destyler/releases/tag/v0.2.9)
  lists only the generated-JSON final-newline fix (#136), comparing from v0.2.8.
  The v0.2.8 commit is an ancestor of v0.2.9; the
  [intervening range](https://github.com/destyler/destyler/compare/v0.2.8...v0.2.9)
  contains that docs fix and the v0.2.9 version bump. The source changes below
  therefore remain in the v0.2.9 tag, rather than being new v0.2.9-only changes.
- Current npm registry version lists for
  [`@destyler/tabs`](https://registry.npmjs.org/@destyler/tabs),
  [`@destyler/react`](https://registry.npmjs.org/@destyler/react), and
  [`@destyler/xstate`](https://registry.npmjs.org/@destyler/xstate)
  contain 0.2.7 and 0.2.9 but not 0.2.8. This is a three-package snapshot, not
  evidence for every package or proof of either a failed publication or an
  unpublish event. Git ancestry alone does not verify npm artifact contents.

### User-facing changes in the omitted range

- **XState:** Repeated `start()` calls preserve a running machine's state and tags
  ([#122](https://github.com/destyler/destyler/pull/122)); stopped machines reject
  transitions ([#123](https://github.com/destyler/destyler/pull/123)).
- **Number input:** Reconcile native input text after a controlled parent veto
  ([#128](https://github.com/destyler/destyler/pull/128)), while preserving accepted
  Solid editing drafts and caret position
  ([#126](https://github.com/destyler/destyler/pull/126)).
- **Carousel:** Scroll to the authoritative current page
  ([#129](https://github.com/destyler/destyler/pull/129)) and cancel stale scroll
  completion timers when a parent writes the page
  ([#131](https://github.com/destyler/destyler/pull/131)).
- **Hover card:** Honor API interruptions of pending open/close transitions
  ([#130](https://github.com/destyler/destyler/pull/130)).
- **Combobox:** Put group semantics on the option container rather than its label
  ([#132](https://github.com/destyler/destyler/pull/132)); apply the List's accessible
  name only when it owns listbox semantics
  ([#133](https://github.com/destyler/destyler/pull/133)).
- **Svelte:** Repair packed adapter imports and type resolution with explicit
  `.js` extensions ([#127](https://github.com/destyler/destyler/pull/127)).

### Documentation, verification, and release bookkeeping

The remaining seven commits are distinct from the ten runtime/adapter fixes above:

- [#124](https://github.com/destyler/destyler/pull/124) aligns project guidance with
  the core contract; [786bf879](https://github.com/destyler/destyler/commit/786bf879fc599835b7627dfb70c5e8e1369eb91f)
  updates generated API descriptions and default-value metadata.
- [#121](https://github.com/destyler/destyler/pull/121) enforces existing public type
  assertions; [#125](https://github.com/destyler/destyler/pull/125) gates release
  side effects on exact-commit verification; [#134](https://github.com/destyler/destyler/pull/134)
  strengthens Svelte packed-package dependency-closure verification, not the
  adapter runtime itself.
- [#135](https://github.com/destyler/destyler/pull/135) bumps package versions to
  0.2.8 (`ff7b51b2`); the later `9b8a4fa6` release commit has no tree changes.
  Neither commit by itself proves a registry publication.

The Releases list also contains a published v0.2.7 entry and a separate v0.2.7
draft. This addendum does not delete that draft, create a v0.2.8 Release, move
historical tags, or republish packages. The cause of the missing records and any
release-metadata cleanup remain tracked in [#354](https://github.com/destyler/destyler/issues/354).
