import { useActor, useMachine, useSelector, useService } from '@destyler/react'
import { expectTypeOf } from 'vitest'
// eslint-disable-next-line antfu/no-import-dist -- Validate the built public declaration boundary without an undeclared workspace dependency.
import { createMachine } from '../../xstate/dist/index.mjs'

const machine = createMachine<
  { count: number, items: string[] },
  { value: 'idle' | 'busy' },
  { type: 'INCREMENT', amount: number }
>({
  initial: 'idle',
  context: { count: 0, items: ['first'] },
  states: { idle: {}, busy: {} },
})
const service = useService(() => machine, { context: { count: 1 } })
expectTypeOf(service).toEqualTypeOf<typeof machine>()

const count = useSelector(service, state => state.context.count)
expectTypeOf(count).toEqualTypeOf<number>()
const stateValue = useSelector(service, state => state.value)
expectTypeOf(stateValue).toEqualTypeOf<'idle' | 'busy' | null>()
const items = useSelector(service, state => state.context.items)
expectTypeOf(items).toEqualTypeOf<string[]>()
const record = useSelector(service, state => ({ items: state.context.items }), (previous, next) => previous.items === next.items)
expectTypeOf(record).toEqualTypeOf<{ items: string[] }>()
const maybe = useSelector(service, state => state.context.count ? state.context.items : undefined)
expectTypeOf(maybe).toEqualTypeOf<string[] | undefined>()

const [actorState, actorSend] = useActor(service)
const [machineState, machineSend, ownedService] = useMachine(() => machine)
expectTypeOf(actorState).toEqualTypeOf<ReturnType<typeof service.getState>>()
expectTypeOf(machineState).toEqualTypeOf<typeof actorState>()
expectTypeOf(actorSend).toEqualTypeOf<typeof service.send>()
expectTypeOf(machineSend).toEqualTypeOf<typeof actorSend>()
expectTypeOf(ownedService).toEqualTypeOf<typeof service>()

// @ts-expect-error - Selector context is inferred, not any.
useSelector(service, state => state.context.missing)
// @ts-expect-error - Equality compares selected numbers, not strings.
useSelector(service, state => state.context.count, (previous: string, next: string) => previous === next)
// @ts-expect-error - Live service context keeps the machine's field types.
useService(() => machine, { context: { count: 'wrong' } })
actorSend({ type: 'INCREMENT', amount: 1 })
// @ts-expect-error - Typed event payloads remain checked through the hooks.
actorSend({ type: 'INCREMENT', amount: 'wrong' })
