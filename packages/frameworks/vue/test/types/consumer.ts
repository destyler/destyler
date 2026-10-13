import type { PropTypes } from '@destyler/vue'
import type { Machine, XState } from '@destyler/xstate'
import type { Ref } from 'vue'
import { normalizeProps, useActor, useMachine } from '@destyler/vue'

interface Context { count: number }
interface State { value: 'idle' | 'active' }
type Event = { type: 'INC', amount: number } | { type: 'RESET' }
type Service = Machine<Context, State, Event>
type Snapshot = Ref<XState<Context, State, Event>>

declare const service: Service
const actor = useActor(service)
const machine = useMachine(service)
const expectedActor: readonly [Snapshot, Service['send']] = actor
const expectedMachine: readonly [Snapshot, Service['send'], Service] = machine
const actualActor: typeof actor = expectedActor
const actualMachine: typeof machine = expectedMachine
void [actualActor, actualMachine]

const count: number = actor[0].value.context.count
actor[1]({ type: 'INC', amount: count })
machine[1]('RESET')
// @ts-expect-error The returned actor tuple is readonly.
actor[0] = machine[0]
// @ts-expect-error The returned machine tuple is readonly.
machine[2] = service
// @ts-expect-error Typed event payloads must retain their fields.
actor[1]({ type: 'INC' })
// @ts-expect-error Unknown events must remain invalid.
machine[1]({ type: 'UNKNOWN' })
// @ts-expect-error Context values must retain their types.
const invalidCount: string = machine[0].value.context.count
void invalidCount

function accept<K extends keyof PropTypes>(tag: K, props: PropTypes[K]) {
  void [tag, props]
}

accept('a', { href: '/docs', target: '_blank' })
accept('button', { type: 'submit', disabled: true, onClick: event => event.button })
accept('input', { checked: true, type: 'checkbox' })
accept('textarea', { rows: 4 })
accept('video', { controls: true })
accept('webview', { src: '/app', allowpopups: true })
accept('abbr', { title: 'An abbreviation' })
accept('svg', { viewBox: '0 0 10 10' })
accept('feGaussianBlur', { stdDeviation: 2 })
accept('button', { ref: 'button' })
accept('button', {
  ref: (_element, refs) => {
    void refs
  },
})
accept('element', { key: Symbol('key'), ref: 'element' })
accept('style', { media: 'screen', color: 'red' })
// @ts-expect-error The finite tag vocabulary must not become a string fallback.
normalizeProps.madeUpTag({})
// @ts-expect-error Button props must not accept anchor-only attributes.
accept('button', { href: '/wrong' })
// @ts-expect-error Input attributes must retain their actual value types.
accept('input', { checked: 'checked' })
// @ts-expect-error Generic HTML elements must not accept SVG-only attributes.
accept('abbr', { viewBox: '0 0 10 10' })
// @ts-expect-error Native refs must not accept arbitrary numbers.
accept('button', { ref: 42 })
// @ts-expect-error Event handlers must preserve their event type.
accept('button', { onClick: (event: KeyboardEvent) => event.key })
// @ts-expect-error The style normalizer retains its native style element attributes.
accept('style', { media: 42 })
// @ts-expect-error Element refs exclude explicit undefined with exact optionals.
accept('element', { ref: undefined })
// @ts-expect-error Element keys exclude explicit undefined with exact optionals.
accept('element', { key: undefined })
