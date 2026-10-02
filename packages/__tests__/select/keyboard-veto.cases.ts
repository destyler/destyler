import type { UserDefinedContext } from '../../components/select/src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../../components/select/src/collection'
import { connect } from '../../components/select/src/connect'
import { machine } from '../../components/select/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const items = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Charlie' }]
const services: ReturnType<typeof machine>[] = []
const roots: HTMLElement[] = []
beforeEach(() => vi.useFakeTimers())
afterEach(async () => {
  try {
    // Let typeahead finish its debounce before the next independent key case.
    await vi.advanceTimersByTimeAsync(350)
    for (const service of services.splice(0))
      service.stop()
  }
  finally {
    vi.clearAllTimers()
    vi.useRealTimers()
    for (const root of roots.splice(0))
      root.remove()
  }
})

function setup(context: Partial<UserDefinedContext> = {}) {
  const onValueChange = vi.fn()
  const onOpenChange = vi.fn()
  const onHighlightChange = vi.fn()
  const service = machine({
    id: 'keyboard-veto',
    collection: collection({ items }),
    defaultOpen: true,
    onValueChange,
    onOpenChange,
    onHighlightChange,
    ...(Object.hasOwn(context, 'value') ? {} : { defaultValue: ['a'] }),
    ...context,
  })
  services.push(service)
  const api = () => connect(service.getState(), service.send, normalize)
  const trigger = document.createElement('button')
  trigger.id = api().getTriggerProps().id
  trigger.addEventListener('keydown', event => api().getTriggerProps().onKeyDown(event))
  const content = document.createElement('div')
  content.id = api().getContentProps().id
  content.tabIndex = 0
  content.setAttribute('role', 'listbox')
  content.addEventListener('keydown', event => api().getContentProps().onKeyDown(event))
  const root = document.createElement('div')
  roots.push(root)
  root.append(trigger, content)
  document.body.append(root)
  service.start()
  api().highlightValue('b')
  onHighlightChange.mockClear()
  function keydown(key: string, veto: boolean, target: HTMLElement = content) {
    if (veto)
      target.addEventListener('keydown', event => event.preventDefault(), { capture: true, once: true })
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    target.dispatchEvent(event)
    return event
  }
  return { service, api, trigger, content, keydown, onValueChange, onOpenChange, onHighlightChange }
}

const navigation = [
  ['ArrowUp', 'a'],
  ['ArrowDown', 'c'],
  ['Home', 'a'],
  ['End', 'c'],
  ['a', 'a'],
] as const

describe('select content keyboard cancellation', () => {
  for (const [key, next] of navigation) {
    it.each([false, true])(`${key} honors veto=%s`, (veto) => {
      const fixture = setup()
      fixture.keydown(key, veto)
      expect(fixture.api().highlightedValue).toBe(veto ? 'b' : next)
      expect(fixture.onHighlightChange).toHaveBeenCalledTimes(veto ? 0 : 1)
      expect(fixture.api().value).toEqual(['a'])
      expect(fixture.api().open).toBe(true)
      expect(fixture.onValueChange).not.toHaveBeenCalled()
      expect(fixture.onOpenChange).not.toHaveBeenCalled()
    })
  }

  for (const controlledOpen of [false, true]) {
    for (const controlledValue of [false, true]) {
      for (const key of ['Enter', ' ']) {
        it.each([false, true])(`${key} activation openControlled=${controlledOpen}, valueControlled=${controlledValue}, veto=%s`, async (veto) => {
          const fixture = setup({ ...(controlledOpen ? { open: true } : {}), ...(controlledValue ? { value: ['a'] } : {}) })
          fixture.keydown(key, veto)
          if (veto) {
            expect(fixture.onValueChange).not.toHaveBeenCalled()
            expect(fixture.onOpenChange).not.toHaveBeenCalled()
            expect(fixture.onHighlightChange).not.toHaveBeenCalled()
            expect(fixture.api().value).toEqual(['a'])
            expect(fixture.api().open).toBe(true)
            expect(fixture.api().highlightedValue).toBe('b')
          }
          else {
            expect(fixture.onValueChange.mock.calls).toEqual([[{ value: ['b'], items: [items[1]] }]])
            expect(fixture.onOpenChange.mock.calls).toEqual([[{ open: false }]])
            expect(fixture.api().value).toEqual(controlledValue ? ['a'] : ['b'])
            expect(fixture.api().open).toBe(controlledOpen)
            if (controlledValue)
              fixture.service.setContext({ value: ['b'] })
            if (controlledOpen)
              fixture.service.setContext({ open: false })
            await vi.advanceTimersByTimeAsync(0)
            expect(fixture.api().value).toEqual(['b'])
            expect(fixture.api().open).toBe(false)
            expect(fixture.onValueChange).toHaveBeenCalledTimes(1)
            expect(fixture.onOpenChange).toHaveBeenCalledTimes(1)
          }
        })
      }
    }
  }

  it.each(['disabled', 'readOnly'] as const)('preserves %s keyboard blocking', (property) => {
    const fixture = setup({ [property]: true })
    fixture.keydown('Enter', false)
    expect(fixture.onValueChange).not.toHaveBeenCalled()
    expect(fixture.onOpenChange).not.toHaveBeenCalled()
    expect(fixture.api().value).toEqual(['a'])
    expect(fixture.api().open).toBe(true)
  })

  it('preserves trigger keyboard cancellation', () => {
    const fixture = setup({ defaultOpen: false })
    fixture.service.send('TRIGGER.FOCUS')
    fixture.keydown('Enter', true, fixture.trigger)
    expect(fixture.onOpenChange).not.toHaveBeenCalled()
    expect(fixture.api().open).toBe(false)
  })

  it('leaves unrelated keys unconsumed', () => {
    const fixture = setup()
    const event = fixture.keydown('Shift', false)
    expect(event.defaultPrevented).toBe(false)
    expect(fixture.api().highlightedValue).toBe('b')
    expect(fixture.onValueChange).not.toHaveBeenCalled()
  })
})
