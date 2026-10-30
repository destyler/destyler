import { ref } from '@destyler/store'
import { createMachine } from '@destyler/xstate'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it } from 'vitest'
import { useSelector } from '../index'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

it('selects cyclic objects, symbols and reference-marked instances without cloning or serialization', async () => {
  class Value {
    constructor(readonly amount: number) {}
    read() { return this.amount }
  }
  const flag = Symbol('flag')
  const file = ref(new File(['content'], 'example.txt'))
  const instance = ref(new Value(7))
  const cycle: { count: number, self?: object } = { count: 0 }
  const service = createMachine({ initial: 'idle', context: { file, instance, cycle, [flag]: 1, other: 0 }, states: { idle: {} } }).start()
  service.state.context.cycle.self = service.state.context.cycle
  const root = createRoot(document.createElement('div'))
  let selected!: typeof service.state.context.cycle
  let symbolValue = 0
  let renders = 0
  function View() {
    selected = useSelector(service, state => state.context.cycle)
    symbolValue = useSelector(service, state => state.context[flag])
    expect(useSelector(service, state => state.context.file)).toBe(file)
    expect(useSelector(service, state => state.context.instance)).toBe(instance)
    expect(instance.read()).toBe(7)
    renders++
    return null
  }
  try {
    await act(async () => root.render(createElement(View)))
    const initial = selected
    expect(initial.self).toBe(initial)
    expect(symbolValue).toBe(1)
    await act(async () => service.setContext({ other: 1 }))
    expect(renders).toBe(1)
    await act(async () => {
      service.state.context.cycle.count = 2
      service.state.context[flag] = 3
    })
    expect(selected).not.toBe(initial)
    expect(selected.self).toBe(selected)
    expect(selected.count).toBe(2)
    expect(initial.count).toBe(0)
    expect(symbolValue).toBe(3)
  }
  finally {
    await act(async () => root.unmount())
    service.stop()
  }
})
