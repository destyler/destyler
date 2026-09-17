# Controlled API conventions (MACHINE layer)

> **中文摘要：** 本文档约定 Destyler **核心状态机**（framework-agnostic）的受控 / 非受控约定，供适配层作者参考。长期方向为 option C（双轨）：遮罩类已有 `defaultOpen` + `open.controlled`；值 / 勾选类 Phase 1 已在 checkbox / switch / radio 落地 `defaultChecked`/`defaultValue` + `*.controlled`。统一见 [#103](https://github.com/destyler/destyler/issues/103)。

This document is the **source of truth** for Destyler’s **MACHINE-layer** controlled conventions. It is written for adapter authors (Vue, React, Solid, Svelte, Lit, vanilla) who glue `useMachine` / normalizeProps / mergeProps onto the framework-agnostic core.

Adapters should not invent a second ownership model. When in doubt, match the machine contract described here.

---

## Current contract (option C dual-track in progress)

Open family and a **value/checked pilot** (checkbox, switch, radio) share the explicit `*.controlled` + `default*` pattern. Remaining value/selection machines still always-mutate. Longer-term unification is tracked in [#103](https://github.com/destyler/destyler/issues/103).

### 1. Overlay / open family

**Contract:**

| Piece | Role |
|-------|------|
| `open` | Seed (uncontrolled) **and** parent sync field when controlled |
| `open.controlled` | Explicit flag: parent owns open state |
| `onOpenChange` | Fired when the machine requests a change |
| `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` | Internal events from `watch.open` |
| `watch.open` → `toggleVisibility` | Parent `open` prop changes → send `CONTROLLED.*` (no re-invoke) |

**Detection:** `isOpenControlled: ctx => isControlledByFlag(ctx, 'open')` (Phase 1 still equals `!!ctx['open.controlled']`).

**Behavior:**

- Uncontrolled (`open.controlled` falsy): user `OPEN` / `CLOSE` transition state and invoke `onOpenChange`.
- Controlled: user `OPEN` / `CLOSE` **only** invoke `onOpenChange`; the parent must set `open`, which `watch.open` turns into `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` to enter the matching state.

**Components that follow this pattern:**

- dialog (canonical)
- popover
- tooltip
- hover-card
- collapsible
- menu
- select / combobox / color-picker / calendar (**open** only — see value family below)
- floating-panel (aligned with dialog after [#102](https://github.com/destyler/destyler/pull/102))

Shared helper (Phase 1): `@destyler/utils` `resolveControllableOpen` / `isControlledByFlag` — used across the **open family** (dialog + popover, tooltip, hover-card, collapsible, menu, floating-panel, and open-only on select / combobox / calendar / color-picker).

### 2. Edit mode

Same CONTROLLED pattern as open, with different names:

- `edit.controlled` + `onEditChange`
- Internal `CONTROLLED.*` + watch on `edit` (parallel to overlay open)

### 3. Navigation menu

Openness is encoded as **which trigger is active** via `value`, not a boolean `open`:

- `value` + `value.controlled` + `defaultValue` + `onValueChange`

Historically the only `default*` companion; checkbox/switch (`defaultChecked`) and radio (`defaultValue`) now share the Phase 1 pattern.

### 4. Value / checked / selection machines

**Phase 1 (pilot — checkbox, switch, radio):** same dual-track spirit as open family:

| Piece | Role |
|-------|------|
| `checked` / `value` | Controlled sync field **and** legacy uncontrolled seed |
| `defaultChecked` / `defaultValue` | Preferred uncontrolled initial (`resolveControllableProp`) |
| `checked.controlled` / `value.controlled` | Explicit flag: parent owns the value |
| `onCheckedChange` / `onValueChange` | Fired when the machine requests a change |

**Detection:** `isControlledByFlag(ctx, 'checked' | 'value')`.

**Behavior:**

- Uncontrolled (`*.controlled` falsy): user gestures **mutate** context and invoke `on*Change` (legacy default).
- Controlled: user gestures **only** invoke `on*Change` with the proposed value; parent must `setContext({ checked | value })`. No `CONTROLLED.*` events — checked/value live in context (watch syncs DOM).

**Still always-mutate (not yet migrated):** tabs, collapse/accordion, toggle, select/combobox/calendar/color-picker **value**, tree, slider, number-input, etc. See [#103](https://github.com/destyler/destyler/issues/103).

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
| Checked / value pilot | `defaultChecked` on checkbox + switch; `defaultValue` on radio |
| Navigation menu | `defaultValue` (historical) |
| Remaining value machines | still missing `default*` |

Uncontrolled seeds via `open` / `checked` / `value` without `*.controlled` remain supported (compat). Prefer `default*` going forward. See Migration Phase 1 / [#103](https://github.com/destyler/destyler/issues/103).

### 8. Shared helpers

Phase 1 introduces machine-layer helpers in `@destyler/utils` (`resolveControllableProp`, `resolveControllableOpen`, `isControlledByFlag`). This is **not** Zag’s framework `bindable` — Destyler still uses full xstate machines; adapters are unchanged. Framework hooks (`useMachine` / `useService`) still do **not** auto-infer or inject `*.controlled`. Adapters must pass `'open.controlled': true`, `'checked.controlled': true`, `'value.controlled': true` (or the edit/nav-menu equivalents) explicitly when the parent owns state.

---

## How to implement a new overlay

Use **dialog** as the canonical reference (`packages/components/dialog`).

Checklist:

1. **Types / props:** public `open?: boolean`, `defaultOpen?: boolean`, `'open.controlled'?: boolean`, `onOpenChange`.
2. **Guards:** `isOpenControlled: ctx => isControlledByFlag(ctx, 'open')` (via `@destyler/utils`).
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
| Controlled detection | **Still** `!!ctx['open.controlled']` (via `isControlledByFlag`) — do **not** rely on prop-presence yet |
| Compat | Uncontrolled `open: true` seed without `open.controlled` still starts open |

**Phase 1 controlled usage still requires `'open.controlled': true`.** Passing only `open` does not make the component controlled.

Skipped in Phase 1 open-family rollout: navigation-menu (`value.controlled`), presence, edit (`edit.controlled`). Value/checked ownership on select/combobox/calendar/color-picker is unchanged.

### Migration Phase 1 (value / checked pilot)

| Piece | Change |
|-------|--------|
| checkbox / switch | `defaultChecked` + `checked.controlled`; gated `set.checked` via `isControlledByFlag` |
| radio | `defaultValue` + `value.controlled`; gated `set.value` |
| Initial | `default* ?? value ?? fallback` via `resolveControllableProp` |
| Controlled detection | **Still** explicit `*.controlled` flag — not prop-presence |
| Compat | Absent flag → legacy always-mutate |

**Deferred:** tabs, collapse/accordion, toggle, select/combobox **value**, tree, slider, number-input, etc.

Later phases: eventually switch `isControlled` to prop-presence while dual-tracking the explicit flag; deprecate overloaded seed props once adapters adopt `default*`.

## Out of scope / future

RFC: **Controlled value ownership** — [#103](https://github.com/destyler/destyler/issues/103). Long-term direction is **option C** (dual-track → eventual prop-presence). Open-family + checkbox/switch/radio Phase 1 have started; remaining value machines follow in later PRs.

Still open:

- Rolling `default*` + `*.controlled` to remaining value/selection machines
- Shared guards vs continued per-machine `set.*` gating
- Deprecating overloaded seed semantics once adapters adopt `default*`
- Phase 2 prop-presence `isControlled`

---

## Related

- [CONTRIBUTING.md](./CONTRIBUTING.md) — contribution workflow and framework-agnostic adapter guidance
- [TEST-GAPS.md](./TEST-GAPS.md) — known test coverage gaps
- Issue [#103](https://github.com/destyler/destyler/issues/103) — Controlled API unification
- PR [#102](https://github.com/destyler/destyler/pull/102) — floating-panel controlled open aligned with dialog
