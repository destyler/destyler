# Release notes and historical addenda

These notes supplement the [GitHub Releases](https://github.com/destyler/destyler/releases).
They provide migration guidance and evidence-backed historical addenda, not a new
release or a complete historical changelog.

## Unreleased: BREAKING Node.js support floor

The next release containing this change requires Node.js **22.22.3 or newer**
for all public `@destyler/*` packages, including adapters and shared/type packages.
Node 20 and Node 22 versions below 22.22.3 are no longer supported. Previously
published packages, versions, and tags are unchanged; this is not a new release.

Upgrade application development, build, CI, and SSR environments before installing
that release. Follow the [Node support migration](./document/src/content/guide/node-support.mdx#migration)
for strict engine checks and validation. The private development workspace retains
its separate, narrower toolchain engine range. No framework peer ranges change.

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
- The original changelog in the [v0.2.9 Release](https://github.com/destyler/destyler/releases/tag/v0.2.9)
  lists only the generated-JSON final-newline fix (#136), comparing from v0.2.8;
  a later historical notice links to this addendum.
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

### Verified v0.2.8 release attempt

The tag-triggered [Release run 36821067201](https://github.com/destyler/destyler/actions/runs/36821067201)
on 2026-10-01 checked commit `9b8a4fa6` and failed verification. Its
[Node 24 verification job](https://github.com/destyler/destyler/actions/runs/36821067201/job/110236537864)
reported `style/eol-last` errors for `packages/docs/data/api.json` and
`packages/docs/data/data-attr.json`: both lacked a final newline. The Node 20 and
Node 22 verification jobs succeeded, but Generate Changelog, Release Package,
and Deploy Release Page were skipped. This establishes why **this automatic
attempt** did not generate a GitHub Release or publish packages; it does not
establish the complete publication or removal history through other routes.

[PR #136](https://github.com/destyler/destyler/pull/136), commit
[`cbd83cc6`](https://github.com/destyler/destyler/commit/cbd83cc6f9b71bbba0be81ca448e3ef5c9691ea2),
subsequently added final newlines to both files, fixed both generators to preserve
them, and added regression tests. The subsequent
[v0.2.9 Release run](https://github.com/destyler/destyler/actions/runs/36823841057)
passed verification and its changelog, package-release, and deployment jobs.
The newline defect is already fixed; this note does not propose another release.

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

### Separate v0.2.7 draft record

As checked on 2026-10-21 UTC, the
[published v0.2.7 entry](https://github.com/destyler/destyler/releases/tag/v0.2.7)
and [separate draft](https://github.com/destyler/destyler/releases/tag/untagged-9e103bfd14344c0097b9)
have identical bodies, names, and `tag_name` values, and both have empty asset
lists. The draft is release ID `392389123`; the published entry is `392389464`.

On 2026-09-20 UTC, the
[first changelog job](https://github.com/destyler/destyler/actions/runs/35504083224/job/106060807164)
checked out `v0.2.7` at `03b8d335` and reported creating release notes at 10:05:43.
The draft record retains a `published_at` timestamp of 10:05:43 and an `updated_at`
timestamp of 10:06:48. The published entry's `created_at` is 10:06:48 and its
`published_at` is 10:07:06. A
[later changelog job](https://github.com/destyler/destyler/actions/runs/35504152292/job/106061770101)
checked out the same tag at `70efa839` and reported creating release notes at
10:07:06. These records establish the matching contents and observed sequence,
but do not identify the event or actor that changed the older entry to a draft.

This addendum does not delete that draft, create a v0.2.8 Release, move historical
tags, or republish packages. The complete npm publication history, the older
entry's draft-transition history, and any release-metadata cleanup remain outside
the verified record above and tracked in [#354](https://github.com/destyler/destyler/issues/354).
