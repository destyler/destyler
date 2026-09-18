# Controlled API conventions (MACHINE layer)

> **中文摘要：** 本文档约定 Destyler **核心状态机**（framework-agnostic）的受控 / 非受控约定，供适配层作者参考。**Phase 3 HARD（BREAKING / major）**：公共 API 已移除显式 `*.controlled` 标志；受控性 = prop **presence**（`withControllableProvided` 戳记）+ 非受控种子仅用 `default*`。统一见 [#103](https://github.com/destyler/destyler/issues/103)。

This document is the **source of truth** for Destyler’s **MACHINE-layer** controlled conventions. It is written for adapter authors (Vue, React, Solid, Svelte, Lit, vanilla) who glue `useMachine` / normalizeProps / mergeProps onto the framework-agnostic core.

Adapters should not invent a second ownership model. When in doubt, match the machine contract described here.

---

## Current contract (Phase 3 HARD — presence + `default*` only)

**BREAKING CHANGE (major):** Explicit `'*.controlled'` flags are **removed** from PublicContext / props lists and are **not** honored at runtime. Ownership is:

| Mode | How |
|------|-----|
| **Controlled** | Pass the live value prop (`open` / `checked` / `value` / …) into `machine(...)` (or stamp via `withControllableProvided`) so presence marks it controlled; sync via `on*Change` + `setContext` / adapter `context` |
| **Uncontrolled** | **Omit** the live value key; seed with `defaultOpen` / `defaultChecked` / `defaultValue` / … only |

There is **no** `'*.controlled': false` escape hatch. Legacy `{ open: true }` without `defaultOpen` is **presence-controlled** (pass `defaultOpen: true` instead).

### 1. Overlay / open family

**Contract:**

| Piece | Role |
|-------|------|
| `open` | Parent sync field when **controlled** (presence) |
| `defaultOpen` | Preferred uncontrolled initial seed |
| `onOpenChange` | Fired when the machine requests a change |
| `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` | Internal events from `watch.open` |
| `watch.open` → `toggleVisibility` | Parent `open` prop changes → send `CONTROLLED.*` (no re-invoke) |

**Detection:** `isOpenControlled: ctx => isControlled(ctx, 'open')` — stamped presence of `open` via `withControllableProvided` before `compact`.

**Behavior:**

- Uncontrolled (`open` not stamped): user `OPEN` / `CLOSE` transition state and invoke `onOpenChange`.
- Controlled (`open` stamped): user `OPEN` / `CLOSE` **only** invoke `onOpenChange`; the parent must set `open`, which `watch.open` turns into `CONTROLLED.OPEN` / `CONTROLLED.CLOSE`.

**Components:** dialog (canonical), popover, tooltip, hover-card, collapsible, menu, select / combobox / color-picker / calendar (**open** side), floating-panel.

Shared helpers: `@destyler/utils` `resolveControllableOpen` / `isControlled` / `withControllableProvided`.

### 2. Edit mode

Same CONTROLLED pattern as open:

- `edit` + `onEditChange` (presence-controlled)
- Internal `CONTROLLED.*` + watch on `edit`
- Detection: `isControlled(ctx, 'edit')` after stamping `edit` (alongside `value`)
- **No `defaultEdit`:** omit `edit` and enter via gestures for uncontrolled; bare `{ edit }` is presence-controlled

### 3. Navigation menu

Openness is encoded as **which trigger is active** via `value`:

- `value` + `defaultValue` + `onValueChange`
- Detection: `isControlled(ctx, 'value')` after `withControllableProvided(..., ['value'])`
- Prefer `defaultValue` for uncontrolled seeds; bare `{ value }` into `machine()` is presence-controlled

### 4. Value / checked / selection machines

| Piece | Role |
|-------|------|
| `checked` / `value` / `page` / `step` / `pageSize` / `inputValue` / `expandedValue` / `selectedValue` / `size` | Controlled sync field (presence) |
| `defaultChecked` / `defaultValue` / `defaultPage` / `defaultStep` / `defaultPageSize` / `defaultInputValue` / `defaultExpandedValue` / `defaultSelectedValue` / `defaultSize` | Uncontrolled initial (`resolveControllableProp`) |
| `onCheckedChange` / `onValueChange` / `onPageChange` / `onStepChange` / `onExpandedChange` / `onSelectionChange` / `onSizeChange` / … | Fired when the machine requests a change |

**Detection:** `isControlled(ctx, prop)` — stamped presence only.

**Behavior:**

- Uncontrolled (prop not stamped): user gestures **mutate** context and invoke `on*Change`.
- Controlled (prop stamped): user gestures **only** invoke `on*Change`; parent must `setContext({ … })`. No `CONTROLLED.*` events for value fields — owned fields live in context.

**Coverage:** checkbox, switch, radio, tabs, collapse/accordion, toggle, select, combobox (+ `inputValue`), calendar, color-picker, slider, number-input, otp-input, pagination (`page` + `pageSize`), steps, carousel, edit **value**, tree (`expandedValue` + `selectedValue`), splitter (`size`), navigation-menu. See [#103](https://github.com/destyler/destyler/issues/103).

### 5. Presence (exit animation)

Always parent-driven via `present`. There is **no uncontrolled mode**. Watch `present`; exit completion is reported via `onExitComplete`.

### 6. Portal asymmetry (intentional)

| Adapters | Portal approach |
|----------|-----------------|
| React, Svelte, Lit, vanilla | Export Destyler `Portal` |
| Vue, Solid | Use framework native `Teleport` / `solid-js` `Portal` |

**Do not** add thin Destyler Portal wrappers for Vue/Solid.

### 7. `default*` seeds

| Family | Status |
|--------|--------|
| Open | `defaultOpen` on open-family machines |
| Checked | `defaultChecked` on checkbox / switch |
| Value / page / step / size / … | Matching `default*` on value-family machines |
| Edit mode | no `defaultEdit` — omit `edit`; enter via gestures |

Prefer `default*` for uncontrolled seeds. Passing `open` / `checked` / `value` into `machine()` is **presence-controlled**.

### 8. Shared helpers

`@destyler/utils`: `resolveControllableProp`, `resolveControllableOpen`, `isControlled`, `withControllableProvided`, `CONTROLLABLE_PROVIDED_KEY`.

`isControlledByFlag` remains exported as **@deprecated** (reads legacy `*.controlled` keys if somehow present) but is unused by machines; do not use it.

This is **not** Zag’s framework `bindable` — Destyler still uses full xstate machines. Pass controllable props into `machine(...)` (or stamp) so presence works.

---

## How to implement a new overlay

Use **dialog** as the canonical reference (`packages/components/dialog`).

Checklist:

1. **Types / props:** public `open?: boolean`, `defaultOpen?: boolean`, `onOpenChange`. **Do not** add `'open.controlled'`.
2. **Init:** `withControllableProvided(userContext, ['open'])` **before** `compact()`; `resolveControllableOpen(ctx)`.
3. **Guards:** `isOpenControlled: ctx => isControlled(ctx, 'open')`.
4. **Transitions:** user `OPEN` / `CLOSE` — if controlled, invoke callback only; else transition + invoke. Add `CONTROLLED.OPEN` / `CONTROLLED.CLOSE` targets that always transition (parent-driven).
5. **Watch:** `watch: { open: ['toggleVisibility'] }` where `toggleVisibility` sends `CONTROLLED.*` from `ctx.open` (do not re-invoke change).
6. **Tests:** uncontrolled via `defaultOpen`; controlled via live `open` presence (parent sync + `onOpenChange`).

---

## Migration history (option C)

Tracked in [#103](https://github.com/destyler/destyler/issues/103).

| Phase | What landed |
|-------|-------------|
| Phase 1 | `default*` + explicit `*.controlled` flags; gated setters |
| Phase 2 | Dual-track: flag **or** stamped presence (`withControllableProvided` + `isControlled`) |
| Phase 3 soft | Docs/JSDoc deprecate flags; behavior unchanged |
| **Phase 3 HARD (this document)** | **BREAKING:** remove `*.controlled` from public API; presence + `default*` only; no flag escape hatch |

### Adapter / consumer migration (HARD)

1. Stop passing `'*.controlled': true` — pass the live prop instead.
2. Stop using `'*.controlled': false` for legacy seeds — use `default*` and omit the live key.
3. Do **not** always include `open` / `checked` / `value` in reactive context bags when uncontrolled — omit the key or use `default*`.
4. **setContext-only injection:** examples that do `machine({ id })` + later `setContext({ open })` will **not** get presence-controlled behavior unless they also update `CONTROLLABLE_PROVIDED_KEY` (or remount with the prop passed into `machine()`).
5. Downstream **destyler/ui** / playground must migrate when they bump core.

### Residual risks

- **setContext-only injection** without updating the stamp (see above).
- **Always-present control keys** in story/control panels can false-positive if stamped from that bag — stamp only true user props.
- **`open: undefined` / `value: undefined`:** counted as provided (own key) before compact; stamp remains after compact removes the key.
- **Downstream ui / playground** may still pass `*.controlled` until they bump — those flags are now **ignored** (presence-only), so demos that relied on the flag without passing the live prop will appear uncontrolled.

## Related

End-user **Controlled usage** sections on shipping component MDX pages; Astro guide [controllable-state](./document/src/content/guide/controllable-state.mdx).

- [CONTRIBUTING.md](./CONTRIBUTING.md) — contribution workflow and framework-agnostic adapter guidance
- [TEST-GAPS.md](./TEST-GAPS.md) — known test coverage gaps
- Issue [#103](https://github.com/destyler/destyler/issues/103) — Controlled API unification
- PR [#102](https://github.com/destyler/destyler/pull/102) — floating-panel controlled open aligned with dialog
