import { hasProp } from './guard'

/**
 * Controllable / bindable-style helpers for MACHINE-layer dual-track (option C).
 *
 * Phase 1 (this module): resolve **initial** value and **isControlled** while still
 * honoring Destyler’s legacy explicit `*.controlled` flags (e.g. `open.controlled`).
 *
 * Phase 2 (planned, see destyler/destyler#103): `isControlled` may switch to
 * prop-presence (`value` / `open` provided on the props object) while still
 * respecting an explicit `*.controlled` flag during dual-track. Do not flip that
 * detection here until adapters and context merging are ready — Destyler’s
 * `compact()` strips `undefined` keys and reactive context sources often always
 * pass `open`, so presence detection is not a drop-in yet.
 */

export interface ResolveControllablePropParams<T> {
  /**
   * Controlled sync field / legacy uncontrolled seed (e.g. `open`).
   */
  value?: T | undefined
  /**
   * Preferred uncontrolled initial (e.g. `defaultOpen`).
   */
  defaultValue?: T | undefined
  /**
   * Legacy Destyler ownership flag (e.g. `ctx['open.controlled']`).
   * Phase 1: this alone determines controlledness.
   */
  controlledFlag?: boolean | undefined
  /**
   * Fallback when neither defaultValue nor value is set.
   */
  fallback: T
}

export interface ControllablePropResolved<T> {
  /** Value used to seed machine initial state / context. */
  initial: T
  /** Whether the parent owns the value (Phase 1: legacy flag). */
  isControlled: boolean
}

/**
 * Resolve initial value and controlledness for a single prop pair.
 *
 * Initial: `defaultValue ?? value ?? fallback`
 * Controlled (Phase 1): `!!controlledFlag`
 */
export function resolveControllableProp<T>(
  params: ResolveControllablePropParams<T>,
): ControllablePropResolved<T> {
  const { value, defaultValue, controlledFlag, fallback } = params
  return {
    initial: (defaultValue ?? value ?? fallback) as T,
    isControlled: !!controlledFlag,
  }
}

/**
 * Phase 1 controlled detection via legacy dotted flag (`prop.controlled`).
 * Prefer this in machine guards so stringly `'open.controlled'` access is centralized.
 *
 * Phase 2 may add a prop-presence overload; keep calling this (or a successor)
 * rather than inlining `!!ctx['*.controlled']`.
 */
export function isControlledByFlag(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  return !!ctx[`${prop}.controlled`]
}

/**
 * Whether `prop` is present as an own key on `ctx` (Phase 2 candidate).
 * Not used for Phase 1 ownership — documented for migration planning only.
 *
 * Caveat: Destyler `compact()` drops keys whose value is `undefined`, so
 * adapters that pass `open: undefined` lose presence after compact.
 */
export function hasControllableProp(
  ctx: Record<string, unknown>,
  prop: string,
): boolean {
  return hasProp(ctx, prop)
}

export interface ControllableOpenContext {
  'open'?: boolean | undefined
  'defaultOpen'?: boolean | undefined
  'open.controlled'?: boolean | undefined
}

/**
 * Open-family convenience: `defaultOpen ?? open ?? false` + Phase 1 `open.controlled`.
 */
export function resolveControllableOpen(ctx: ControllableOpenContext): {
  initialOpen: boolean
  isOpenControlled: boolean
} {
  const resolved = resolveControllableProp({
    value: ctx.open,
    defaultValue: ctx.defaultOpen,
    controlledFlag: ctx['open.controlled'],
    fallback: false,
  })
  return {
    initialOpen: resolved.initial,
    isOpenControlled: resolved.isControlled,
  }
}
