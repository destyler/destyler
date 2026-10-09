import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { createMachine } from '@destyler/xstate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const cleanups: VoidFunction[] = []
let clock: ReturnType<typeof createFrameClock>
let nextId = 0

function createFrameClock() {
  let id = 0
  const callbacks = new Map<number, FrameRequestCallback>()
  const request = vi.fn((callback: FrameRequestCallback) => {
    callbacks.set(++id, callback)
    return id
  })
  const cancel = vi.fn((id: number) => callbacks.delete(id))
  return {
    callbacks,
    request,
    cancel,
    flush() {
      for (const [id, callback] of Array.from(callbacks)) {
        if (callbacks.delete(id))
          callback(0)
      }
    },
  }
}

beforeEach(() => {
  clock = createFrameClock()
  vi.stubGlobal('requestAnimationFrame', clock.request)
  vi.stubGlobal('cancelAnimationFrame', clock.cancel)
})

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.unstubAllGlobals()
})

function setup(context: Partial<UserDefinedContext> = {}, options: { indicator?: boolean, sync?: boolean, scope?: ShadowRoot } = {}) {
  const original = machine({ id: `frame-lifetime-${nextId++}`, defaultValue: 'a', ...(options.scope ? { getRootNode: () => options.scope! } : {}), ...context })
  // Public constructor options, using the actual Tabs configuration and actions.
  const service = options.sync ? createMachine(original.config, { ...original.options, sync: true }) : original
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const list = document.createElement('div')
  list.id = api().getListProps().id!
  root.append(list)
  const panels: HTMLElement[] = []
  const triggers = ['a', 'b', 'c'].map((value) => {
    const props = api().getTriggerProps({ value })
    const trigger = document.createElement('button')
    trigger.id = props.id!
    trigger.setAttribute('role', 'tab')
    trigger.setAttribute('data-ownedby', list.id)
    trigger.dataset.value = value
    trigger.addEventListener('focus', event => Reflect.apply(props.onFocus!, trigger, [event]))
    list.append(trigger)
    const panel = document.createElement('div')
    panel.id = api().getContentProps({ value }).id!
    root.append(panel)
    panels.push(panel)
    return trigger
  })
  if (options.indicator) {
    const indicator = document.createElement('div')
    indicator.id = api().getIndicatorProps().id!
    root.append(indicator)
  }
  ;(options.scope ?? document.body).append(root)
  cleanups.push(() => root.remove(), () => service.stop())
  service.start()
  clock.flush()
  return { service, api, triggers, panels }
}

describe('tabs deferred effect ownership', () => {
  it.each(['ARROW_NEXT', 'ARROW_PREV', 'HOME', 'END'])('cancels pending %s focus and selection on stop', (type) => {
    const onValueChange = vi.fn()
    const { service, api, triggers } = setup({ defaultValue: 'b', onValueChange })
    triggers[1].focus()
    service.send({ type })
    service.stop()
    expect(clock.callbacks.size).toBe(0)
    clock.flush()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('b')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('does not apply old focus or selection after an immediate restart', () => {
    const onValueChange = vi.fn()
    const { service, api, triggers } = setup({ onValueChange })
    triggers[0].focus()
    api().selectNext('a')
    service.stop()
    service.start()
    clock.flush()
    expect(document.activeElement).toBe(triggers[0])
    expect(api().value).toBe('a')
    expect(onValueChange).not.toHaveBeenCalled()
    api().selectNext('a')
    clock.flush()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('b')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })

  it('cancels panel tab-index mutation before its frame', () => {
    const { service, api, panels } = setup()
    panels[0].removeAttribute('tabindex')
    api().syncTabIndex()
    service.stop()
    expect(clock.callbacks.size).toBe(0)
    clock.flush()
    expect(panels[0].hasAttribute('tabindex')).toBe(false)
  })

  it('does not resurrect pending work when a focus callback stops the actor', () => {
    let stop = () => {}
    const onValueChange = vi.fn()
    const { service, api, triggers } = setup({
      onValueChange,
      onFocusChange(details) {
        if (details.focusedValue === 'b')
          stop()
      },
    })
    stop = () => service.stop()
    triggers[0].focus()
    api().selectNext('a')
    clock.flush()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('a')
    expect(clock.callbacks.size).toBe(0)
    expect(onValueChange).not.toHaveBeenCalled()
    clock.flush()
    expect(clock.callbacks.size).toBe(0)
  })

  it('keeps another actor’s frames when one actor stops', () => {
    const first = setup({ id: 'independent-a', composite: false })
    const second = setup({ id: 'independent-b', composite: false })
    first.api().selectNext('a')
    second.api().selectNext('a')
    first.service.stop()
    clock.flush()
    expect(first.api().value).toBe('a')
    expect(second.api().value).toBe('b')
  })

  it('keeps duplicate public ids independent across separate shadow roots', () => {
    const hosts = [document.createElement('div'), document.createElement('div')]
    document.body.append(...hosts)
    cleanups.push(() => hosts.forEach(host => host.remove()))
    const [firstRoot, secondRoot] = hosts.map(host => host.attachShadow({ mode: 'open' }))
    const first = setup({ id: 'same-public-id', composite: false }, { scope: firstRoot })
    const second = setup({ id: 'same-public-id', composite: false }, { scope: secondRoot })
    first.api().selectNext('a')
    second.api().selectNext('a')
    first.service.stop()
    clock.flush()
    expect(first.api().value).toBe('a')
    expect(second.api().value).toBe('b')
  })

  it('releases completed handles rather than retaining them until teardown', () => {
    const { service, api } = setup()
    for (let index = 0; index < 50; index++)
      api().syncTabIndex()
    clock.flush()
    expect(clock.callbacks.size).toBe(0)
    clock.cancel.mockClear()
    service.stop()
    expect(clock.cancel).not.toHaveBeenCalled()
  })

  it('preserves native-frame focus-before-selection timing while running', async () => {
    vi.unstubAllGlobals()
    const calls: string[] = []
    const { api, triggers } = setup({
      onFocusChange: details => calls.push(`focus:${details.focusedValue}`),
      onValueChange: details => calls.push(`value:${details.value}`),
    })
    triggers[0].focus()
    api().selectNext('a')
    expect(document.activeElement).toBe(triggers[0])
    expect(calls).toEqual([])
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('b')
    expect(calls).toEqual(['focus:b', 'value:b'])
  })

  it('preserves running manual navigation and Enter activation order', () => {
    const onValueChange = vi.fn()
    const { service, api, triggers } = setup({ activationMode: 'manual', onValueChange })
    triggers[0].focus()
    api().selectNext('a')
    expect(document.activeElement).toBe(triggers[0])
    clock.flush()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('a')
    service.send({ type: 'ENTER' })
    expect(api().value).toBe('a')
    clock.flush()
    expect(api().value).toBe('b')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })

  it('preserves controlled proposals and delayed parent acceptance', async () => {
    const onValueChange = vi.fn()
    const { service, api, triggers } = setup({ value: 'a', onValueChange })
    triggers[0].focus()
    api().selectNext('a')
    clock.flush()
    expect(document.activeElement).toBe(triggers[1])
    expect(api().value).toBe('a')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
    service.setContext({ value: 'b' })
    await Promise.resolve()
    clock.flush()
    expect(api().value).toBe('b')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('stops both stages of indicator transition follow-up work', () => {
    const { service, api } = setup({}, { indicator: true })
    service.send({ type: 'SET_INDICATOR_RECT' })
    clock.flush()
    service.stop()
    expect(clock.callbacks.size).toBe(0)
    const before = api().getIndicatorProps().style
    clock.flush()
    expect(api().getIndicatorProps().style).toEqual(before)
  })

  it('refuses follow-up scheduling when a synchronous state observer stops during an indicator action', () => {
    const { service, triggers } = setup({}, { indicator: true, sync: true })
    Object.defineProperty(triggers[1], 'offsetWidth', { value: 41 })
    let stopped = false
    const cleanup = service.subscribe((state) => {
      if (stopped || state.context.indicatorState.rect.width !== '41px')
        return
      // A once guard keeps this independent of the separate core recursive-stop fix.
      stopped = true
      service.stop()
    })
    service.send({ type: 'SET_INDICATOR_RECT', id: 'b' })
    cleanup()
    expect(stopped).toBe(true)
    expect(clock.callbacks.size).toBe(0)
    clock.flush()
    expect(clock.callbacks.size).toBe(0)
  })

  it('keeps repeated stop and mount cycles free of pending handles', () => {
    const { service, api } = setup({ composite: false })
    for (let index = 0; index < 3; index++) {
      api().selectNext('a')
      service.stop()
      service.stop()
      expect(clock.callbacks.size).toBe(0)
      service.start()
      clock.flush()
    }
    service.stop()
    expect(clock.callbacks.size).toBe(0)
  })

  it('preserves direct empty-string focus notifications from the existing contract', () => {
    const onFocusChange = vi.fn()
    const { service } = setup({ onFocusChange })
    service.send({ type: 'TAB_FOCUS', value: '' })
    expect(onFocusChange).toHaveBeenCalledExactlyOnceWith({ focusedValue: '' })
  })

  it('does not schedule browser work before machine start', () => {
    const service = machine({ id: 'ssr-before-start', defaultValue: 'a' })
    const api = connect(service.getState(), service.send, normalize)
    expect(api.value).toBe('a')
    expect(api.getContentProps({ value: 'a' }).hidden).toBe(false)
    expect(clock.request).not.toHaveBeenCalled()
    service.stop()
    expect(clock.callbacks.size).toBe(0)
  })
})
