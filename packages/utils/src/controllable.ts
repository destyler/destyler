import { hasProp } from './guard'

/**
 * Controllable / bindable-style helpers for MACHINE-layer dual-track (option C).
 *
 * Phase 1: resolve **initial** value; **isControlled** from legacy `*.controlled` flags.
 *
 * Phase 2 (see destyler/destyler#103): dual-track ownership —
 *   1. explicit `*.controlled === true`  → controlled
 *   2. explicit `*.controlled === false` → uncontrolled (escape hatch)
 *   3. flag absent → controlled iff the prop was **user-provided** (presence)
 *
 * Presence is recorded via {@link CONTROLLABLE_PROVIDED_KEY} *before* `compact()`
 * strips `undefined` keys. Do **not** infer presence from compacted machine context
 * after defaults/spread — reactive bags and control panels often always include keys.
 *
 * Adapter guidance: pass controllable props into `machine(userContext)` (or stamp
 * with {@link withControllableProvided}) so presence is visible at init. Props that
 * only arrive later via `setContext` / `useMachine({ context })` are **not**
 * auto-detected unless the adapter stamps the side channel on that patch.
 */

/** Context side-channel: prop names the user provided (survives `compact`). */
export const CONTROLLABLE_PROVIDED_KEY = 'controllable.provided' as const

export interface ResolveControllablePropParams<T> {
  /** Controlled sync field / legacy uncontrolled seed (e.g. `open`). */
  value?: T | undefined
  /** Preferred uncontrolled initial (e.g. `defaultOpen`). */
  defaultValue?: T | undefined
  /**
   * Legacy Destyler ownership flag (e.g. `ctx['open.controlled']`).
   * `true` / `false` win over presence; absent → fall through to `valueProvided`.
   */
  controlledFlag?: boolean | undefined
  /**
   * Whether the user provided the value prop (own-key / stamped presence).
   * Phase 2: used only when `controlledFlag` is absent.
   */
  valueProvided?: boolean | undefined
  /** Fallback when neither defaultValue nor value is set. */
  fallback: T
}

export interface ControllablePropResolved<T> {
  /** Value used to seed machine initial state / context. */
  initial: T
  /** Whether the parent owns the value (Phase 2 dual-track). */
  isControlled: boolean
}

/**
 * Dual-track controlledness (Phase 2).
 *
 * - `controlledFlag === true`  → controlled
 * - `controlledFlag === false` → uncontrolled
 * - flag absent → `!!valueProvided`
 */
export function resolveIsControlled(
  controlledFlag?: boolean | undefined,
  valueProvided?: boolean | undefined,
): boolean {
  if (controlledFlag === true)
    return true
  if (controlledFlag === false)
    return false
  return !!valueProvided
}

/**
 * Resolve initial value and controlledness for a single prop pair.
 *
 * Initial: `defaultValue ?? value ?? fallback`
 * Controlled: {@link resolveIsControlled}(controlledFlag, valueProvided)
 */
export function resolveControllableProp<T>(
  params: ResolveControllablePropParams<T>,
): ControllablePropResolved<T> {
  const { value, defaultValue, controlledFlag, valueProvided, fallback } = params
  return {
    initial: (defaultValue ?? value ?? fallback) as T,
    isControlled: resolveIsControlled(controlledFlag, valueProvided),
  }
}

/**
 * Phase 1 flag-only detection (`prop.controlled`). Prefer {@link isControlled}
 * for Phase 2 dual-track (flag + presence).
 */
export function isControlledByFlag(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  return !!ctx[`${prop}.controlled`]
}

/**
 * Whether `prop` is present as an own key on `ctx`.
 * Prefer {@link collectUserProvidedProps} / stamped side channel for ownership —
 * post-defaults context often always has the key.
 */
export function hasControllableProp(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  return hasProp(ctx, prop)
}

/**
 * Collect which of `props` are own keys on `source` (call **before** `compact`).
 * `undefined` values still count as provided (key present).
 */
export function collectUserProvidedProps(
  source: Record<string, unknown> | undefined | null,
  props: readonly string[],
): string[] {
  if (!source)
    return []
  return props.filter(p => hasProp(source, p))
}

/**
 * Read stamped user-provided prop names from context (side channel).
 */
export function getControllableProvided(
  ctx: Record<string, unknown> | undefined | null,
): string[] {
  if (!ctx)
    return []
  const raw = ctx[CONTROLLABLE_PROVIDED_KEY]
  return Array.isArray(raw) ? (raw as string[]).filter(k => typeof k === 'string') : []
}

/**
 * Whether `prop` was recorded as user-provided on the side channel.
 */
export function isPropUserProvided(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  return getControllableProvided(ctx).includes(prop)
}

/**
 * Stamp {@link CONTROLLABLE_PROVIDED_KEY} onto a copy of `userContext` for the
 * given prop names that are own keys. Safe to call before `compact()` — the
 * array value survives compaction.
 *
 * Merges with any existing stamped list on `userContext`.
 */
export function withControllableProvided<T extends Record<string, unknown>>(
  userContext: T,
  props: readonly string[],
): T & { [CONTROLLABLE_PROVIDED_KEY]: string[] } {
  const collected = collectUserProvidedProps(userContext, props)
  const existing = getControllableProvided(userContext)
  const merged = Array.from(new Set([...existing, ...collected]))
  return {
    ...userContext,
    [CONTROLLABLE_PROVIDED_KEY]: merged,
  }
}

/**
 * Phase 2 dual-track resolver for machine guards / gated setters.
 *
 * Explicit `*.controlled` wins; otherwise uses stamped {@link CONTROLLABLE_PROVIDED_KEY}.
 */
export function isControlled(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  const flag = ctx[`${prop}.controlled`]
  if (flag === true)
    return true
  if (flag === false)
    return false
  return isPropUserProvided(ctx, prop)
}

export interface ControllableOpenContext {
  'open'?: boolean | undefined
  'defaultOpen'?: boolean | undefined
  'open.controlled'?: boolean | undefined
  [CONTROLLABLE_PROVIDED_KEY]?: string[] | undefined
}

/**
 * Open-family convenience: `defaultOpen ?? open ?? false` + Phase 2 dual-track
 * `open.controlled` / stamped presence of `open`.
 */
export function resolveControllableOpen(ctx: ControllableOpenContext): {
  initialOpen: boolean
  isOpenControlled: boolean
} {
  const resolved = resolveControllableProp({
    value: ctx.open,
    defaultValue: ctx.defaultOpen,
    controlledFlag: ctx['open.controlled'],
    valueProvided: isPropUserProvided(ctx as Record<string, unknown>, 'open'),
    fallback: false,
  })
  return {
    initialOpen: resolved.initial,
    isOpenControlled: resolved.isControlled,
  }
}
