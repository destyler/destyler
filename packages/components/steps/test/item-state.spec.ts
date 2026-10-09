import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

function mount(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'item-state-dom', count: 3, defaultStep: 1, ...context }).start()
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const items = [0, 1, 2].map(() => document.createElement('div'))
  root.append(...items)
  document.body.append(root)
  function render() {
    items.forEach((element, index) => {
      for (const [key, value] of Object.entries(api().getItemProps({ index }))) {
        if (value == null)
          element.removeAttribute(key)
        else
          element.setAttribute(key, String(value))
      }
    })
  }
  const unsubscribe = service.subscribe(render)
  cleanups.push(() => root.remove(), () => service.stop(), unsubscribe)
  return { service, api, items, render }
}

function expectSelectors(items: HTMLElement[], step: number) {
  items.forEach((element, index) => {
    for (const [status, matches] of [['complete', index < step], ['current', index === step], ['incomplete', index > step]] as const)
      expect(element.matches(`[data-scope="steps"][data-part="item"][data-${status}]`)).toBe(matches)
  })
}

describe('documented Steps item selectors in native DOM', () => {
  it('matches current, completed, and incomplete item selectors at the same time', () => {
    const { items } = mount()
    expectSelectors(items, 1)
    expect(items[1].getAttribute('aria-current')).toBe('step')
  })

  it('removes obsolete attributes while advancing, completing, and resetting', async () => {
    const { api, items } = mount({ defaultStep: 0 })
    expectSelectors(items, 0)
    api().setStep(2)
    await Promise.resolve()
    expectSelectors(items, 2)
    api().goToNextStep()
    await Promise.resolve()
    expectSelectors(items, 3)
    api().resetStep()
    await Promise.resolve()
    expectSelectors(items, 0)
  })

  it('keeps CSS selectors unchanged during a controlled veto and updates only on acceptance', async () => {
    const onStepChange = vi.fn()
    const { service, api, items } = mount({ defaultStep: undefined, step: 0, onStepChange })
    api().setStep(2)
    await Promise.resolve()
    expectSelectors(items, 0)
    expect(onStepChange).toHaveBeenCalledExactlyOnceWith({ step: 2 })
    service.setContext({ step: 2 })
    await Promise.resolve()
    expectSelectors(items, 2)
    expect(onStepChange).toHaveBeenCalledTimes(1)
  })
})
