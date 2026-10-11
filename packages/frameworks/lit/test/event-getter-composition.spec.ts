import { html, nothing, render } from 'lit'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mergeProps } from '../../../xstate/src/merge-props'
import { spread } from '../src/directives/spread-props'
import { normalizeProps } from '../src/utils/normalize-props'

const cleanups: Array<() => void> = []

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
})

function accessor(values: unknown[], enumerable = true) {
  let reads = 0
  const props = normalizeProps.element({})
  Object.defineProperty(props, '@click', {
    enumerable,
    get() {
      const value = values[Math.min(reads++, values.length - 1)]
      return value
    },
  })
  return { props: Object.freeze(props), reads: () => reads }
}

function mount(props: Record<string, unknown>, host?: object) {
  const container = document.createElement('div')
  document.body.append(container)
  const view = (value: Record<string, unknown>) => html`<div ${spread(value)}><button></button></div>`
  render(view(props), container, { host })
  cleanups.push(() => {
    render(nothing, container)
    container.remove()
  })
  return {
    button: container.querySelector('button')!,
    update(value: Record<string, unknown>) {
      render(view(value), container, { host })
    },
  }
}

describe('normalized listener getter replacement compatibility', () => {
  it('retains the existing callback when the first read is undefined or missing', () => {
    const internal = () => {}
    const consumer = () => {}
    const incoming = accessor([undefined, consumer])
    expect(mergeProps({ '@click': internal }, incoming.props)['@click']).toBe(internal)
    expect(incoming.reads()).toBe(1)
    expect(mergeProps({ '@click': internal }, {})['@click']).toBe(internal)
  })

  it.each([undefined, null, false, 0, 'not a listener', {}])('retains the selected fallback value %s', (selected) => {
    const incoming = accessor([() => {}, selected])
    const props = mergeProps({ '@click': () => {} }, incoming.props)
    expect(props['@click']).toBe(selected)
    expect(incoming.reads()).toBe(selected === undefined ? 3 : 2)
  })

  it('retains the final enumerable refill after the selected value becomes undefined', () => {
    const replacement = () => {}
    const incoming = accessor([() => {}, undefined, replacement])
    expect(mergeProps({ '@click': () => {} }, incoming.props)['@click']).toBe(replacement)
    expect(incoming.reads()).toBe(3)
  })

  it('does not refill a nonenumerable getter', () => {
    const incoming = accessor([() => {}, undefined, () => {}], false)
    expect(mergeProps({ '@click': () => {} }, incoming.props)['@click']).toBeUndefined()
    expect(incoming.reads()).toBe(2)
  })

  it('preserves inherited enumerable getter replacement', () => {
    const incoming = accessor([() => {}, null])
    const props = Object.freeze(Object.create(incoming.props))
    expect(mergeProps({ '@click': () => {} }, props)['@click']).toBeNull()
    expect(incoming.reads()).toBe(2)
  })

  it.each([1, 2])('preserves an error thrown on getter read %s', (throwAt) => {
    const failure = new Error('getter failed')
    let reads = 0
    const incoming = Object.freeze({
      get '@click'() {
        if (++reads === throwAt)
          throw failure
        return () => {}
      },
    })
    let caught: unknown
    try {
      mergeProps({ '@click': () => {} }, incoming)
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(failure)
    expect(reads).toBe(throwAt)
  })

  it.each(['capture', 'once', 'passive', 'signal'] as const)('classifies the selected callback with %s metadata', (option) => {
    for (const inherited of [false, true]) {
      const selected = () => {}
      if (inherited) {
        Object.setPrototypeOf(selected, Object.assign(Object.create(Function.prototype), { [option]: false }))
      }
      else {
        Object.defineProperty(selected, option, { value: false })
      }
      Object.freeze(selected)
      const incoming = accessor([() => {}, selected, () => {}])
      expect(mergeProps({ '@click': () => {} }, incoming.props)['@click']).toBe(selected)
      expect(incoming.reads()).toBe(2)
    }
  })

  it('retains replacement when the existing callback has options', () => {
    const internal = Object.freeze(Object.assign(() => {}, { once: false }))
    const selected = () => {}
    const incoming = accessor([() => {}, selected, null])
    expect(mergeProps({ '@click': internal }, incoming.props)['@click']).toBe(selected)
    expect(incoming.reads()).toBe(2)
  })

  it.each([undefined, null])('removes a disappeared listener from the actual normalized spread consumer (%s)', (selected) => {
    const internal = vi.fn()
    const consumer = vi.fn()
    const initial = normalizeProps.element({ onClick: internal })
    const mounted = mount(initial)
    mounted.button.click()
    const incoming = accessor([consumer, selected])
    mounted.update(mergeProps(initial, incoming.props))
    mounted.button.click()
    expect(internal).toHaveBeenCalledTimes(1)
    expect(consumer).not.toHaveBeenCalled()
    expect(incoming.reads()).toBe(selected === undefined ? 3 : 2)
  })

  it('preserves a selected once callback and its host in the real consumer', () => {
    const internal = vi.fn()
    const calls: unknown[] = []
    const host = {}
    const selected = Object.freeze(Object.assign(function (this: unknown) {
      calls.push(this)
    }, { once: true }))
    const incoming = accessor([() => {}, selected, () => {}])
    const props = mergeProps(normalizeProps.element({ onClick: internal }), incoming.props)
    const mounted = mount(props, host)
    mounted.button.click()
    mounted.button.click()
    expect(props['@click']).toBe(selected)
    expect(calls).toEqual([host])
    expect(internal).not.toHaveBeenCalled()
    expect(incoming.reads()).toBe(2)
  })

  it('preserves a selected capture callback in the real consumer', () => {
    const phases: number[] = []
    const selected = Object.freeze(Object.assign((event: Event) => phases.push(event.eventPhase), { capture: true }))
    const incoming = accessor([() => {}, selected])
    mount(mergeProps({ '@click': () => {} }, incoming.props)).button.click()
    expect(phases).toEqual([Event.CAPTURING_PHASE])
    expect(incoming.reads()).toBe(2)
  })

  it('preserves a selected passive callback in the real consumer', () => {
    const selected = Object.freeze(Object.assign((event: Event) => event.preventDefault(), { passive: true }))
    const incoming = accessor([() => {}, selected])
    const mounted = mount(mergeProps({ '@click': () => {} }, incoming.props))
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    mounted.button.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(incoming.reads()).toBe(2)
  })

  it('preserves a selected signal callback in the real consumer', () => {
    const controller = new AbortController()
    const consumer = vi.fn()
    const selected = Object.freeze(Object.assign(consumer, { signal: controller.signal }))
    const incoming = accessor([() => {}, selected])
    const mounted = mount(mergeProps({ '@click': () => {} }, incoming.props))
    mounted.button.click()
    controller.abort()
    mounted.button.click()
    expect(consumer).toHaveBeenCalledTimes(1)
    expect(incoming.reads()).toBe(2)
  })
})

describe('normalized listener getter composition selection', () => {
  it.each([null, false, 0])('composes the selected plain function after an initial %s', (first) => {
    const calls: string[] = []
    const selected = () => calls.push('selected')
    const incoming = accessor([first, selected])
    mergeProps({ '@click': () => calls.push('internal') }, incoming.props)['@click']()
    expect(calls).toEqual(['selected', 'internal'])
    expect(incoming.reads()).toBe(2)
  })

  it('classifies and captures the same selected function without a third read', () => {
    const calls: Array<{ name: string, receiver: unknown, args: unknown[] }> = []
    const record = (name: string) => Object.freeze(function (this: unknown, ...args: unknown[]) {
      calls.push({ name, receiver: this, args })
    })
    const internal = record('internal')
    const selected = record('selected')
    const ignored = Object.freeze(Object.assign(record('ignored').bind(null), { once: true }))
    const incoming = accessor([record('first'), selected, ignored])
    const props = mergeProps(normalizeProps.element({ onClick: internal }), incoming.props)
    expect(incoming.reads()).toBe(2)
    const host = {}
    const mounted = mount(props, host)
    const event = new MouseEvent('click', { bubbles: true })
    mounted.button.dispatchEvent(event)
    expect(calls).toEqual([
      { name: 'selected', receiver: host, args: [event] },
      { name: 'internal', receiver: host, args: [event] },
    ])
    calls.length = 0
    const extra = {}
    props['@click'].call(host, event, extra, 0, false)
    expect(calls).toEqual([
      { name: 'selected', receiver: host, args: [event, extra, 0, false] },
      { name: 'internal', receiver: host, args: [event, extra, 0, false] },
    ])
    expect(incoming.reads()).toBe(2)
  })

  it('classifies the selected function even when the first function carries options', () => {
    const calls: string[] = []
    const first = Object.freeze(Object.assign(() => {}, { once: true }))
    const incoming = accessor([first, () => calls.push('selected')])
    mergeProps({ '@click': () => calls.push('internal') }, incoming.props)['@click']()
    expect(calls).toEqual(['selected', 'internal'])
    expect(incoming.reads()).toBe(2)
  })

  it('preserves the selected callback error identity and stops before the internal callback', () => {
    const failure = new Error('selected listener failed')
    const internal = vi.fn()
    const incoming = accessor([() => {}, () => {
      throw failure
    }])
    const props = mergeProps({ '@click': internal }, incoming.props)
    let caught: unknown
    try {
      props['@click']()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(failure)
    expect(internal).not.toHaveBeenCalled()
    expect(incoming.reads()).toBe(2)
  })
})
