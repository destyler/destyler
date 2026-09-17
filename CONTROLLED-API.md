# Controlled API conventions (MACHINE layer)

> **中文摘要：** 本文档约定 Destyler **核心状态机**（framework-agnostic）的受控 / 非受控约定，供适配层作者参考。长期方向为 option C（双轨）。Phase 1 已落地 `default*` + `*.controlled`；**Phase 2 已铺开** prop-presence（`withControllableProvided` + `isControlled`）；**Phase 3 soft** 仅文档 / JSDoc 弃用显式 `*.controlled`（行为不变，硬删除待 major）。统一见 [#103](https://github.com/destyler/destyler/issues/103)。

This document is the **source of truth** for Destyler’s **MACHINE-layer** controlled conventions. It is written for adapter authors (Vue, React, Solid, Svelte, Lit, vanilla) who glue `useMachine` / normalizeProps / mergeProps onto the framework-agnostic core.

Adapters should not invent a second ownership model. When in doubt, match the machine contract described here.

---

## Current contract (option C dual-track in progress)

Open family and value/checked machines share Phase 2 dual-track ownership: explicit `*.controlled` **or** stamped prop presence, plus `default*` for uncontrolled seeds. **Phase 3 soft** deprecates explicit flags in docs/JSDoc but keeps them supported; hard flag removal is a future major ([#103](https://github.com/destyler/destyler/issues/103)).

### 1. Overlay / open family

**Contract:**

| Piece | Role |
|-------|------|
| `open` | Seed (uncontrolled) **and** parent sync field when controlled |
| `open.controlled` | Explicit flag: parent owns open state |
| `onOpenChange` | Fired when the machine requests a change |
| `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` | Internal events from `watch.open` |
| `watch.open` → `toggleVisibility` | Parent `open` prop changes → send `CONTROLLED.*` (no re-invoke) |

**Detection (Phase 2):** `isOpenControlled: ctx => isControlled(ctx, 'open')` — explicit `open.controlled` wins; else stamped presence of `open` (via `withControllableProvided` before `compact`).

**Behavior:**

- Uncontrolled (flag absent and `open` not stamped, or `'open.controlled': false`): user `OPEN` / `CLOSE` transition state and invoke `onOpenChange`.
- Controlled (flag true, or `open` stamped without flag false): user `OPEN` / `CLOSE` **only** invoke `onOpenChange`; the parent must set `open`, which `watch.open` turns into `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` to enter the matching state.

**Components that follow this pattern:**

- dialog (canonical)
- popover
- tooltip
- hover-card
- collapsible
- menu
- select / combobox / color-picker / calendar (**open** only — see value family below)
- floating-panel (aligned with dialog after [#102](https://github.com/destyler/destyler/pull/102))

Shared helper (Phase 2): `@destyler/utils` `resolveControllableOpen` / `isControlled` / `withControllableProvided` — used across the **open family** (dialog + popover, tooltip, hover-card, collapsible, menu, floating-panel, and open-only on select / combobox / calendar / color-picker).

### 2. Edit mode

Same CONTROLLED pattern as open, with different names (Phase 2 dual-track):

- `edit` + `edit.controlled` + `onEditChange`
- Internal `CONTROLLED.*` + watch on `edit` (parallel to overlay open)
- Detection: `isControlled(ctx, 'edit')` after stamping `edit` (alongside `value`) via `withControllableProvided`
- **No `defaultEdit`:** uncontrolled start-in-edit uses `'edit.controlled': false` (or omit `edit` and enter via gestures). Presence of bare `{ edit }` without flag false is presence-controlled.

### 3. Navigation menu

Openness is encoded as **which trigger is active** via `value`, not a boolean `open` (Phase 2 dual-track):

- `value` + `value.controlled` + `defaultValue` + `onValueChange`
- Detection: `isControlled(ctx, 'value')` after `withControllableProvided(..., ['value'])`
- Prefer `defaultValue` for uncontrolled seeds; bare `{ value }` into `machine()` is presence-controlled

### 4. Value / checked / selection machines

**Phase 1 (value / checked / page / step):** same dual-track spirit as open family:

| Piece | Role |
|-------|------|
| `checked` / `value` / `page` / `step` / `pageSize` / `inputValue` / `expandedValue` / `selectedValue` / `size` | Controlled sync field **and** legacy uncontrolled seed |
| `defaultChecked` / `defaultValue` / `defaultPage` / `defaultStep` / `defaultPageSize` / `defaultInputValue` / `defaultExpandedValue` / `defaultSelectedValue` / `defaultSize` | Preferred uncontrolled initial (`resolveControllableProp`) |
| `*.controlled` | Explicit flag: parent owns the field |
| `onCheckedChange` / `onValueChange` / `onPageChange` / `onStepChange` / `onExpandedChange` / `onSelectionChange` / `onSizeChange` / … | Fired when the machine requests a change |

**Detection (Phase 2):** `isControlled(ctx, prop)` — explicit `*.controlled` wins; else stamped presence of the prop.

**Behavior:**

- Uncontrolled (flag absent and prop not stamped, or `'*.controlled': false`): user gestures **mutate** context and invoke `on*Change`.
- Controlled (flag true, or prop stamped without flag false): user gestures **only** invoke `on*Change` with the proposed value; parent must `setContext({ … })`. No `CONTROLLED.*` events — owned fields live in context (watch syncs DOM).

**Phase 1 coverage (complete for shipping packages):** checkbox, switch, radio, tabs, collapse/accordion, toggle, select, combobox (+ `inputValue`), calendar, color-picker, slider, number-input, otp-input, pagination (`page` + `pageSize`), steps, carousel, edit **value**, tree (`expandedValue` + `selectedValue`), splitter (`size`), navigation-menu (`value` + historical `defaultValue`). Edit **mode** and navigation-menu finished Phase 2 leftovers after #113. No rating package. See [#103](https://github.com/destyler/destyler/issues/103).

### 5. Presence

Always parent-driven via `present`. There is **no uncontrolled mode**. Watch `present`; exit completion is reported via `onExitComplete`.

### 6. Portal asymmetry (intentional)

| Adapters | Portal approach |
|----------|-----------------|
| React, Svelte, Lit, vanilla | Export Destyler `Portal` |
| Vue, Solid | Use framework native `Teleport` / `solid-js` `Portal` |

**Do not** add thin Destyler Portal wrappers for Vue/Solid. DOM/`portalled` behavior in examples should still stay consistent across frameworks when they demonstrate the same primitive.

### 7. `defaultOpen` / `defaultChecked` / `defaultValue`

| Family | Status |
|--------|--------|
| Open | `defaultOpen` on dialog, popover, tooltip, hover-card, collapsible, menu, floating-panel, select, combobox, calendar, color-picker (open side) |
| Checked / value Phase 1 | `defaultChecked` on checkbox + switch; `defaultValue` on radio, tabs, collapse, toggle, select, combobox, calendar, color-picker, slider, number-input, otp-input, edit; combobox also `defaultInputValue`; pagination `defaultPage` / `defaultPageSize`; steps `defaultStep`; carousel `defaultPage`; tree `defaultExpandedValue` / `defaultSelectedValue`; splitter `defaultSize` |
| Navigation menu | `defaultValue` (Phase 2 presence on `value`) |
| Edit mode | no `defaultEdit` — use `'edit.controlled': false` for uncontrolled seed |

Prefer `default*` for uncontrolled seeds. Passing `open` / `checked` / `value` into `machine()` without a flag is **presence-controlled** after Phase 2. Escape: `'*.controlled': false` or omit the key. See [#103](https://github.com/destyler/destyler/issues/103).

### 8. Shared helpers

Phase 1–2 helpers in `@destyler/utils`: `resolveControllableProp`, `resolveControllableOpen`, `isControlled` / `isControlledByFlag`, `withControllableProvided`. This is **not** Zag’s framework `bindable` — Destyler still uses full xstate machines. Prefer passing controllable props into `machine(...)` (or stamping) so Phase 2 presence works; explicit `'*.controlled': true` remains supported. Escape hatch: `'*.controlled': false` when seeding with the value key uncontrolled.

---

## How to implement a new overlay

Use **dialog** as the canonical reference (`packages/components/dialog`).

Checklist:

1. **Types / props:** public `open?: boolean`, `defaultOpen?: boolean`, `'open.controlled'?: boolean`, `onOpenChange`.
2. **Guards:** `isOpenControlled: ctx => isControlled(ctx, 'open')` after `withControllableProvided(userContext, ['open'])` before `compact` (via `@destyler/utils`).
3. **Transitions:** user `OPEN` / `CLOSE` — if controlled, invoke callback only; else transition + invoke. Add `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` targets that always transition (parent-driven).
4. **Watch:** `watch: { open: ['toggleVisibility'] }` where `toggleVisibility` sends `CONTROLLED.OPEN` or `CONTROLLED.CLOSE` from `ctx.open` (do not re-invoke change).
5. **Connect:** `setOpen` / trigger handlers send `OPEN` / `CLOSE` the same way dialog does.
6. **Tests:** cover uncontrolled open/close and controlled open/close (parent buttons + `'open.controlled'`), similar to dialog / collapsible / floating-panel harnesses.
7. **Do not** invent a new flag name or skip `CONTROLLED.*` for “simplicity” — that is how floating-panel drifted before [#102](https://github.com/destyler/destyler/pull/102).

For multi-state open trees (e.g. floating-panel `open` / `open.dragging` / `open.resizing`), duplicate the CONTROLLED / guarded CLOSE handlers on each open-tagged state, matching existing house style (tooltip, color-picker).

---

---

## Migration Phase 1 (open family — option C dual-track)

Tracked in [#103](https://github.com/destyler/destyler/issues/103). **Long-term direction is option C** (split `default*` vs value, shared helper, eventual prop-presence detection). Phase 1 is **additive** and does **not** rewrite the status-quo contract above.

What landed:

| Piece | Change |
|-------|--------|
| Shared helper | `@destyler/utils` — `resolveControllableProp` / `resolveControllableOpen` / `isControlledByFlag` |
| Open family `defaultOpen` | dialog (pilot), then popover, tooltip, hover-card, collapsible, menu, floating-panel, select, combobox, calendar, color-picker (**open** only) |
| Initial open | `defaultOpen ?? open ?? false` via `resolveControllableOpen` (adapt open/closed state names per machine, e.g. menu/select `idle`, combobox `suggesting`) |
| Controlled detection | Phase 2: `isControlled` (flag + stamped presence) across open family |
| Compat | Initial `open: true` still seeds open; ownership is presence-controlled unless `'open.controlled': false` |

Passing `open` into `machine()` (stamped presence) **does** make it controlled unless `'open.controlled': false`. Prefer `defaultOpen` for uncontrolled.

Skipped in Phase 1 open-family rollout: navigation-menu (already had `value.controlled`), presence, edit mode (`edit.controlled` — value side landed in wave 4; both later migrated in Phase 2 leftovers).

### Migration Phase 1 (value / checked)

| Piece | Change |
|-------|--------|
| checkbox / switch | `defaultChecked` + `checked.controlled`; gated `set.checked` via `isControlledByFlag` (#107) |
| radio | `defaultValue` + `value.controlled`; gated `set.value` (#107) |
| tabs / collapse / toggle | `defaultValue` + `value.controlled`; gated `set.value` (#108) |
| select / combobox / calendar / color-picker | `defaultValue` + `value.controlled`; gated value setters (#109); combobox also `defaultInputValue` + `inputValue.controlled` |
| slider / number-input / otp-input / edit value | `defaultValue` + `value.controlled`; gated `set.value` (+ index setters) (wave 4) |
| pagination | `defaultPage` + `page.controlled`; `defaultPageSize` + `pageSize.controlled` (wave 4) |
| steps | `defaultStep` + `step.controlled` (wave 4) |
| carousel | `defaultPage` + `page.controlled` (wave 4) |
| tree | `defaultExpandedValue` + `expandedValue.controlled`; `defaultSelectedValue` + `selectedValue.controlled` (tree/splitter leftovers) |
| splitter | `defaultSize` + `size.controlled`; gated `set.size` (tree/splitter leftovers) |
| Initial | `default* ?? value ?? fallback` via `resolveControllableProp` |
| Controlled detection | Phase 2: `isControlled` (flag + stamped presence) across value family |
| Compat | Absent flag + no stamped prop → mutate; stamped prop without flag → presence-controlled |

### Migration Phase 2 (prop-presence dual-track)

Tracked in [#103](https://github.com/destyler/destyler/issues/103). Phase 2 extends `@destyler/utils` controllable helpers so **ownership** can come from **user prop presence**, without removing Phase 1 `*.controlled` flags.

#### Rule (dual-track)

1. Explicit `*.controlled === true` → **controlled**
2. Explicit `*.controlled === false` → **uncontrolled** (escape hatch for legacy seed when the value key is also passed)
3. Flag **absent** → controlled iff the prop was **user-provided** (own-key presence recorded before `compact()`)

Initial value is unchanged: `default* ?? value ?? fallback`.

#### Why a side channel (`controllable.provided`)

`compact()` drops keys whose value is `undefined`, and adapters often merge reactive control bags that always include `open` / `checked`. Naive `hasProp(ctx, 'open')` on live machine context **false-positives**.

**Smallest correct fix:** stamp `controllable.provided: string[]` onto the user context **before** `compact()` via `withControllableProvided(userContext, ['open'])`. The array survives compaction. Machine guards call `isControlled(ctx, prop)` which reads the flag first, then the stamp.

#### Helpers (`@destyler/utils`)

| Export | Role |
|--------|------|
| `resolveIsControlled(flag, valueProvided)` | Pure dual-track boolean |
| `resolveControllableProp` | Initial + dual-track `isControlled` (`valueProvided` optional) |
| `isControlled(ctx, prop)` | Guard/setter resolver (flag + stamped presence) |
| `isControlledByFlag` | Phase 1 flag-only (kept for escape / older call sites; prefer `isControlled`) |
| `withControllableProvided` / `collectUserProvidedProps` / `isPropUserProvided` | Record / read presence before compact |
| `CONTROLLABLE_PROVIDED_KEY` | `'controllable.provided'` |

#### Adapter guidance

- Prefer passing controllable props into `machine({ open, checked, ... })` so pilots can stamp presence at init.
- Or call `withControllableProvided(props, ['open'])` before `machine` / when building a context patch.
- Do **not** always include `open` / `checked` in reactive context bags when the mode is uncontrolled — omit the key, use `default*`, or set `'*.controlled': false`.
- Props that only arrive later via `setContext` / `useMachine({ context })` are **not** auto-detected unless the adapter stamps `controllable.provided` on that patch.
- Legacy uncontrolled seed `{ open: true }` without a flag becomes **presence-controlled** on Phase 2 pilots — migrate to `defaultOpen` or `'open.controlled': false`.

#### Rollout status

Phase 2 is **rolled out** beyond the dialog/checkbox pilots:

| Family | Machines / props |
|--------|------------------|
| Open | dialog, popover, tooltip, hover-card, collapsible, menu, floating-panel; select / combobox / calendar / color-picker **`open`** |
| Value / checked | checkbox, switch, radio, tabs, collapse, toggle, select / combobox (+ `inputValue`), calendar / color-picker **value**, slider, number-input, otp-input, pagination (`page` + `pageSize`), steps, carousel, edit **value**, tree (`expandedValue` + `selectedValue`), splitter (`size`), **navigation-menu** (`value`) |
| Edit mode | edit (`edit` — Phase 2 dual-track; no `defaultEdit`) |

Skipped: presence (always parent-driven).

Pattern per machine: `withControllableProvided(userContext, [...props])` **before** `compact()`; guards/setters use `isControlled`; `resolveControllableProp` / `resolveControllableOpen` pass `valueProvided`. CONTROLLED/watch/gating retained; `*.controlled` flags **not** removed (Phase 3).

#### Residual risks

- **setContext-only injection:** examples that do `machine({ id })` + `useMachine({ context: controls })` will **not** get presence-controlled behavior unless they stamp or pass props into `machine()`.
- **Always-present control keys:** e.g. checkbox story controls that always expose `checked` would false-positive if stamped from that bag — stamp only true user props.
- **`open: undefined` / `value: undefined`:** counted as provided (own key) before compact; after compact the key is gone but the stamp remains. Zag uses `!= undefined` (undefined → uncontrolled); Destyler Phase 2 treats own-key undefined as provided.
- **Behavior change:** bare `{ open }` / `{ value }` / `{ checked }` without flag is now **presence-controlled**. Migrate uncontrolled seeds to `default*` or `'*.controlled': false`.

### Migration Phase 3 soft (deprecate flags — non-breaking)

Tracked in [#103](https://github.com/destyler/destyler/issues/103). **Soft** Phase 3 is **docs / JSDoc only**. Machine behavior is unchanged: dual-track still honors explicit `*.controlled`, and flags remain fully supported.

#### Recommended API (adapters / consumers)

| Mode | Prefer |
|------|--------|
| Controlled | Pass the value prop into `machine(...)` (or stamp via `withControllableProvided`) so Phase 2 presence marks it controlled; sync via `setContext` + `on*Change` |
| Uncontrolled | Prefer `defaultOpen` / `defaultChecked` / `defaultValue` / … for the initial seed; **omit** the live value key |

Do **not** rely on explicit `'*.controlled': true` for new code — presence + `default*` is the long-term contract.

#### Explicit `*.controlled` — deprecated but supported

Setting `'open.controlled' | 'checked.controlled' | 'value.controlled' | …` remains valid and wins over presence (Phase 2 dual-track). Soft Phase 3 marks these flags **@deprecated** in PublicContext JSDoc (sample: dialog `open.controlled`, checkbox `checked.controlled`; **other machines follow the same wording** when touched).

#### Escape hatch (legacy seed)

When a value key must be passed for historical seeding but ownership should stay uncontrolled:

```ts
const openSeed = {
  'open': true,
  'open.controlled': false,
} // or defaultOpen: true
const checkedSeed = {
  'checked': true,
  'checked.controlled': false,
} // or defaultChecked: true
```

`'*.controlled': false` still overrides stamped presence. Prefer migrating to `default*` instead of keeping the escape long-term.

#### Hard Phase 3 (future major) — removal checklist

Do **not** remove flags in this soft phase. Hard removal waits for a **major** semver and [destyler/ui](https://github.com/destyler/ui) adoption. Checklist before hard Phase 3:

1. [ ] All shipping machines already on Phase 2 `isControlled` + `withControllableProvided`
2. [ ] Adapters / examples / story controls use presence + `default*` (no required `'*.controlled': true`)
3. [ ] destyler/ui wrappers migrated off explicit flags (or pass presence correctly)
4. [ ] Audit playground / docs demos for leftover `'*.controlled': true` and legacy `{ open: true }` seeds without `default*`
5. [ ] Major bump: drop `*.controlled` from PublicContext / props lists; keep only presence + `default*` (+ document any remaining escape if needed)
6. [ ] Update this document: remove dual-track flag rules; Phase 3 soft section becomes historical

## Out of scope / future

RFC: **Controlled value ownership** — [#103](https://github.com/destyler/destyler/issues/103). Long-term direction is **option C**. **Phase 1 complete**; **Phase 2 rolled out** (prop-presence dual-track across open + value families, plus navigation-menu `value` and edit **mode**). **Phase 3 soft** (this section): flags deprecated-but-supported in docs/JSDoc. **Hard Phase 3** (flag removal) remains a future major.

---

## Related

- [CONTRIBUTING.md](./CONTRIBUTING.md) — contribution workflow and framework-agnostic adapter guidance
- [TEST-GAPS.md](./TEST-GAPS.md) — known test coverage gaps
- Issue [#103](https://github.com/destyler/destyler/issues/103) — Controlled API unification
- PR [#102](https://github.com/destyler/destyler/pull/102) — floating-panel controlled open aligned with dialog
