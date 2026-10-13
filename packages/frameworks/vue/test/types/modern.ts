import type { PropTypes } from '@destyler/vue'
import type * as Vue from 'vue'
import { normalizeProps } from '@destyler/vue'

declare module 'vue' {
  interface IntrinsicElementAttributes {
    'my-control': { modelValue?: string }
  }
}

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Expected = Vue.NativeElements & {
  element: Vue.HTMLAttributes & { key?: string | number | symbol, ref?: Vue.VNodeRef }
  style: Vue.CSSProperties
}

declare function assert<T extends true>(): T

// Audit the whole upstream map when the development Vue version changes.
assert<Equal<keyof PropTypes, keyof Expected>>()
assert<Expected extends PropTypes ? true : false>()
assert<PropTypes extends Expected ? true : false>()
assert<Equal<{ [K in keyof Expected]: Equal<PropTypes[K], Expected[K]> }[keyof Expected], true>>()

// Preserve the installed Vue's native reserved-property optional semantics.
declare const upstreamNative: Vue.NativeElements['button']
const native: PropTypes['button'] = upstreamNative
const symbolKey: PropTypes['button'] = { key: Symbol('button') }
void [native, symbolKey]
// @ts-expect-error ref_for is still boolean.
const invalidRefFor: PropTypes['button'] = { ref_for: 'yes' }
// @ts-expect-error ref_key is still a string.
const invalidRefKey: PropTypes['button'] = { ref_key: 42 }
// @ts-expect-error Native props must not inherit VNode lifecycle hooks.
const invalidHook: PropTypes['button'] = { onVnodeMounted: () => {} }
void [invalidRefFor, invalidRefKey, invalidHook]

// Consumer-added intrinsic tags must reach the public adapter and its normalizer.
const upstreamCustom: Vue.NativeElements['my-control'] = { modelValue: 'value' }
const custom: PropTypes['my-control'] = upstreamCustom
const normalizeCustom = normalizeProps['my-control']
declare const normalizedCustom: ReturnType<typeof normalizeCustom>
const normalized: PropTypes['my-control'] = normalizedCustom
const expectedNormalized: ReturnType<typeof normalizeCustom> = custom
void [custom, normalizeCustom, normalized, expectedNormalized]
// @ts-expect-error Custom-tag attributes must keep their declared types.
const invalidCustom: PropTypes['my-control'] = { modelValue: 42 }
// @ts-expect-error Custom tags must not accept unrelated attributes.
const invalidCustomAttribute: PropTypes['my-control'] = { href: '/wrong' }
void [invalidCustom, invalidCustomAttribute]
