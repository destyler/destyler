# Release compatibility notes

These notes supplement the [GitHub Releases](https://github.com/destyler/destyler/releases).
They are migration guidance, not a new release or a complete historical changelog.

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
