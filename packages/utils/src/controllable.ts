import { hasProp } from './guard'

/**
 * Controllable / bindable-style helpers for MACHINE-layer ownership (option C).
 *
 * **Phase 3 HARD (BREAKING):** controlledness is **prop presence only** —
 * recorded via {@link CONTROLLABLE_PROVIDED_KEY} *before* `compact()` strips
 * `undefined` keys. Explicit `*.controlled` flags are **removed** from the
 * public API and are **not** honored at runtime.
 *
 * - Controlled → user provided the value prop (stamped presence)
 * - Uncontrolled → omit the value key; seed with `default*` only
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
   * @deprecated Phase 3 HARD — ignored. Kept optional for call-site migration;
   * remove at call sites. Controlledness is `valueProvided` only.
   */
  controlledFlag?: boolean | undefined
  /**
   * Whether the user provided the value prop (own-key / stamped presence).
   */
  valueProvided?: boolean | undefined
  /** Fallback when neither defaultValue nor value is set. */
  fallback: T
}

export interface ControllablePropResolved<T> {
  /** Value used to seed machine initial state / context. */
  initial: T
  /** Whether the parent owns the value (presence only). */
  isControlled: boolean
}

/**
 * Phase 3 HARD: controlledness = `!!valueProvided` only.
 * `controlledFlag` is ignored (deprecated param kept for call-site churn).
 */
export function resolveIsControlled(
  _controlledFlag?: boolean | undefined,
  valueProvided?: boolean | undefined,
): boolean {
  return !!valueProvided
}

/**
 * Resolve initial value and controlledness for a single prop pair.
 *
 * Initial: `defaultValue ?? value ?? fallback`
 * Controlled: {@link resolveIsControlled}(ignoredFlag, valueProvided)
 */
export function resolveControllableProp<T>(
  params: ResolveControllablePropParams<T>,
): ControllablePropResolved<T> {
  const { value, defaultValue, valueProvided, fallback } = params
  return {
    initial: (defaultValue ?? value ?? fallback) as T,
    isControlled: resolveIsControlled(undefined, valueProvided),
  }
}

/**
 * @deprecated Phase 3 HARD — `*.controlled` flags removed. Use {@link isControlled}
 * (stamped presence via {@link withControllableProvided}).
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
 * Phase 3 HARD: ownership from stamped {@link CONTROLLABLE_PROVIDED_KEY} only.
 * Explicit `*.controlled` flags are ignored.
 */
export function isControlled(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  return isPropUserProvided(ctx, prop)
}

export interface ControllableOpenContext {
  'open'?: boolean | undefined
  'defaultOpen'?: boolean | undefined
  [CONTROLLABLE_PROVIDED_KEY]?: string[] | undefined
}

/**
 * Open-family convenience: `defaultOpen ?? open ?? false` + presence of `open`.
 */
export function resolveControllableOpen(ctx: ControllableOpenContext): {
  initialOpen: boolean
  isOpenControlled: boolean
} {
  const resolved = resolveControllableProp({
    value: ctx.open,
    defaultValue: ctx.defaultOpen,
    valueProvided: isPropUserProvided(ctx as Record<string, unknown>, 'open'),
    fallback: false,
  })
  return {
    initialOpen: resolved.initial,
    isOpenControlled: resolved.isControlled,
  }
}
