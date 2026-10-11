import type { UserContext } from '@destyler/xstate'

export interface ContextSource<TContext> {
  get?: () => Partial<TContext> | undefined
  subscribe: (fn: (ctx: Partial<TContext>) => void) => () => void
}

declare const contextInputKey: unique symbol

interface ValueInput<TValue> {
  readonly [contextInputKey]: { kind: 'value', value: TValue }
}

interface SourceInput<TContext> {
  readonly [contextInputKey]: { kind: 'source', value: ContextSource<TContext> }
}

/** An explicit context selection created by contextValue or contextSource. */
export type ContextInput<TContext> = ValueInput<UserContext<TContext>> | SourceInput<TContext>

type ContextEntry<TContext> = ContextInput<TContext>[typeof contextInputKey]

// Recognize only our wrappers, without reading any property of legacy inputs.
// In particular, classification must not trigger a source's Proxy or accessors.
const contextInputs = new WeakMap<object, ContextEntry<any>>()

function createContextInput<TEntry extends ContextEntry<any>>(entry: TEntry): { readonly [contextInputKey]: TEntry } {
  const input = Object.freeze({}) as { readonly [contextInputKey]: TEntry }
  contextInputs.set(input, entry)
  return input
}

/** Treat all supplied fields, including get and subscribe, as ordinary context. */
export function contextValue<TValue extends object>(value: TValue): ValueInput<TValue> {
  return createContextInput({ kind: 'value', value })
}

/** Read and subscribe to a source, without inferring its role from its fields. */
export function contextSource<TContext>(source: ContextSource<TContext>): SourceInput<TContext> {
  return createContextInput({ kind: 'source', value: source })
}

export function getContextInput<TContext>(value: unknown): ContextEntry<TContext> | undefined {
  return contextInputs.get(value as object)
}

export function unwrapContextValue<TContext>(value: UserContext<TContext> | ContextInput<TContext>): UserContext<TContext> {
  const input = getContextInput<TContext>(value)
  return (input?.kind === 'value' ? input.value : value) as UserContext<TContext>
}
