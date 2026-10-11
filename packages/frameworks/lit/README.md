# Lit machine context

Use `contextValue` for ordinary machine context and `contextSource` for a source
that provides snapshots or subscriptions. Both are exported from `@destyler/lit`
and work in the constructor and `setOptions`.

```ts
import { contextSource, contextValue, MachineController } from '@destyler/lit'

const controller = new MachineController(host, machine, {
  context: contextValue({ count: 1, subscribe: 'ordinary-data' }),
})

controller.setOptions({
  context: contextSource({
    get: () => store.current,
    subscribe: listener => store.subscribe(listener),
  }),
})

controller.setOptions({ context: contextValue({ count: 2 }) })
```

## Choosing an input

`contextValue(value)` passes the supplied fields to the machine as ordinary
context. Fields named `get` and `subscribe`, including callable values, are data:
the controller does not invoke them as a source. Machine context getters still
have the normal property-reading behavior of `setContext`. The initial value is
applied before `created`; later `setOptions` calls apply it immediately. Connecting
or reconnecting does not reapply an old ordinary value over newer machine state.

`contextSource(source)` always selects a subscription source. Its optional `get`
returns a partial context or `undefined`. Its `subscribe(listener)` must return a
cleanup function, and emitted contexts retain the machine's context types. A
subscribe-only source is supported. The wrapper itself reads no source members.

The controller reads `get` once per initialization or refresh and calls that exact
function with the original source as `this`. It applies an initial snapshot before
`created`. While connected it refreshes `get` before reading and invoking
`subscribe`, again with the original source as `this`. Disconnected option changes
can read `get`, but do not subscribe. Reconnection reads a fresh snapshot and starts
a new subscription. Replacing or clearing the context option releases the previous
subscription; callbacks from retired subscriptions cannot update the controller.

An explicit source is never reinterpreted as ordinary context. Invalid JavaScript
members fail when used: a non-nullish, non-callable `get` throws during a snapshot
read, and an invalid `subscribe` throws when connecting. The strict TypeScript
contract rejects those members and requires callable cleanup. JavaScript `get:
null` is treated as an absent getter, matching the legacy source behavior.

The helpers return opaque identity-based values. Pass them unchanged to a
controller imported from the same `@destyler/lit` module instance. Do not spread,
clone, serialize, or Proxy-wrap the returned wrapper, or pass it between separately
bundled copies. Wrap the underlying context/source again at the receiving entry
point instead. The supplied context or source may itself be frozen or proxied;
the helpers neither mutate it nor inspect its properties.

## Migrating existing calls

Replace `context: data` with `context: contextValue(data)` when `data` is ordinary
machine context, especially when it has a field named `subscribe`. Replace
`context: store` with `context: contextSource(store)` when it is intentionally a
subscription source. Apply the same choice in `setOptions`. `context: undefined`
continues to clear the selected input and unsubscribe without resetting machine
context.

Unwrapped `context` inputs retain their legacy interpretation and observable
getter, `created`, connection, and cleanup ordering. That entry still infers a
source from a `subscribe` property, except for the existing ordinary-context case
with a non-nullish, non-callable `get`. It cannot determine whether other
source-shaped objects were intended as ordinary data. The explicit helpers resolve
that ambiguity without changing existing calls.

The four historical broad-classification assertions remain in
`test/diagnostics/context-classification.repro.ts`. They intentionally request
different behavior from the unwrapped legacy entry and continue to fail there.
`test/explicit-context.test.ts` covers the equivalent ordinary-data cases through
the explicit entry. Those passes do not turn the historical diagnostic failures
into passing tests.
