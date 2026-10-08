import { html, nothing, render } from 'lit'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../../../components/menu/src/connect'
import { machine } from '../../../components/menu/src/machine'
import { mergeProps } from '../../../xstate/src/merge-props'
import { spread } from '../src/directives/spread-props'
import { normalizeProps } from '../src/utils/normalize-props'

const cleanups: Array<() => void> = []

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
})

function mount(props: Record<string, unknown>, host?: object) {
  const container = document.createElement('div')
  document.body.append(container)
  render(html`<button ${spread(props)}></button>`, container, { host })
  cleanups.push(() => {
    render(nothing, container)
    container.remove()
  })
  return container.querySelector('button')!
}

describe('lit normalized event composition', () => {
  it('runs consumer handlers before internal behavior in a real spread consumer', () => {
    const calls: string[] = []
    const props = mergeProps(
      normalizeProps.element({ onClick: () => calls.push('internal') }),
      normalizeProps.element({ onClick: () => calls.push('consumer') }),
    )
    mount(props).click()
    expect(calls).toEqual(['consumer', 'internal'])
  })

  it('preserves the Lit host receiver and every argument without mutating frozen inputs', () => {
    const receiver = { name: 'host' }
    const calls: Array<{ receiver: unknown, args: unknown[] }> = []
    const internal = Object.freeze(function (this: unknown, ...args: unknown[]) {
      calls.push({ receiver: this, args })
    })
    const consumer = Object.freeze(function (this: unknown, ...args: unknown[]) {
      calls.push({ receiver: this, args })
    })
    const first = Object.freeze(normalizeProps.element({ onClick: internal }))
    const second = Object.freeze(normalizeProps.element({ onClick: consumer }))
    const props = mergeProps(first, second)
    const event = new MouseEvent('click', { bubbles: true })
    mount(props, receiver).dispatchEvent(event)
    expect(calls).toEqual([{ receiver, args: [event] }, { receiver, args: [event] }])
    calls.length = 0
    const extra = { payload: true }
    props['@click'].call(receiver, event, extra, 0, false)
    expect(calls).toEqual([
      { receiver, args: [event, extra, 0, false] },
      { receiver, args: [event, extra, 0, false] },
    ])
    expect(first['@click']).toBe(internal)
    expect(second['@click']).toBe(consumer)
    expect(Object.isFrozen(first)).toBe(true)
    expect(Object.isFrozen(second)).toBe(true)
  })

  it('invokes frozen callbacks with their own non-callable apply metadata', () => {
    const calls: string[] = []
    const internal = Object.freeze(Object.defineProperty(() => calls.push('internal'), 'apply', { value: 'metadata' }))
    const consumer = Object.freeze(Object.defineProperty(() => calls.push('consumer'), 'apply', { value: null }))
    const props = mergeProps(normalizeProps.element({ onClick: internal }), normalizeProps.element({ onClick: consumer }))
    mount(props).click()
    expect(calls).toEqual(['consumer', 'internal'])
    expect(internal.apply).toBe('metadata')
    expect(consumer.apply).toBeNull()
  })

  it('preserves last-source-first order and the same default-prevented event', () => {
    const calls: string[] = []
    let observed: unknown
    const internal = vi.fn((event: { defaultPrevented: boolean }) => {
      expect(event).toBe(observed)
      expect(event.defaultPrevented).toBe(true)
      calls.push('internal')
    })
    const props = mergeProps(
      normalizeProps.element({ onClick: internal }),
      normalizeProps.element({ onClick: () => calls.push('first consumer') }),
      normalizeProps.element({ onClick(event) {
        observed = event
        event.preventDefault()
        calls.push('last consumer')
      } }),
    )
    mount(props).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(calls).toEqual(['last consumer', 'first consumer', 'internal'])
    expect(internal).toHaveBeenCalledTimes(1)
  })

  it('propagates a consumer error without invoking later callbacks', () => {
    const failure = new Error('consumer failed')
    const internal = vi.fn()
    const earlierConsumer = vi.fn()
    const props = mergeProps(
      normalizeProps.element({ onClick: internal }),
      normalizeProps.element({ onClick: earlierConsumer }),
      normalizeProps.element({ onClick() { throw failure } }),
    )
    expect(() => props['@click']()).toThrow(failure)
    expect(earlierConsumer).not.toHaveBeenCalled()
    expect(internal).not.toHaveBeenCalled()
  })

  it('preserves a single callback identity and leaves ordinary function props uncomposed', () => {
    const first = () => {}
    const second = () => {}
    expect(mergeProps({ '@click': first })['@click']).toBe(first)
    expect(mergeProps({ callback: first }, { callback: second }).callback).toBe(second)
  })

  it('retains existing on-prefixed composition order', () => {
    const calls: string[] = []
    mergeProps({ onClick: () => calls.push('internal') }, { onClick: () => calls.push('consumer') }).onClick()
    expect(calls).toEqual(['consumer', 'internal'])
  })

  it('allows native Lit event parts to replace and remove composed callback identities', () => {
    const container = document.createElement('div')
    document.body.append(container)
    cleanups.push(() => {
      render(nothing, container)
      container.remove()
    })
    const internal = vi.fn()
    const first = vi.fn()
    const next = vi.fn()
    const view = (callback: unknown) => html`<button @click=${callback}></button>`
    const initial = mergeProps(normalizeProps.element({ onClick: internal }), normalizeProps.element({ onClick: first }))
    render(view(initial['@click']), container)
    const button = container.querySelector('button')!
    button.click()
    const replacement = mergeProps(normalizeProps.element({ onClick: internal }), normalizeProps.element({ onClick: next }))
    render(view(replacement['@click']), container)
    button.click()
    render(view(undefined), container)
    button.click()
    expect(first).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledTimes(1)
    expect(internal).toHaveBeenCalledTimes(2)
  })
})

describe('lit listener option exclusions', () => {
  it.each(['capture', 'once', 'passive', 'signal'] as const)('retains last-value semantics when %s is present, even false or inherited', (option) => {
    for (const inherited of [false, true]) {
      const plain = Object.freeze(() => {})
      const decorated = () => {}
      if (inherited) {
        Object.setPrototypeOf(decorated, Object.assign(Object.create(Function.prototype), { [option]: false }))
      }
      else {
        Object.defineProperty(decorated, option, { value: false })
      }
      Object.freeze(decorated)
      expect(mergeProps({ '@click': plain }, { '@click': decorated })['@click']).toBe(decorated)
      expect(mergeProps({ '@click': decorated }, { '@click': plain })['@click']).toBe(plain)
      expect(Object.isFrozen(decorated)).toBe(true)
    }
  })

  it('retains the last frozen once callback and its native event behavior', () => {
    const internal = vi.fn()
    const consumer = vi.fn()
    const decorated = Object.freeze(Object.assign(consumer, { once: true }))
    const props = mergeProps(normalizeProps.element({ onClick: internal }), normalizeProps.element({ onClick: decorated }))
    expect(props['@click']).toBe(decorated)
    const button = mount(props)
    button.click()
    button.click()
    expect(consumer).toHaveBeenCalledTimes(1)
    expect(internal).not.toHaveBeenCalled()
  })

  it('retains listener-object replacement and the object receiver', () => {
    const first = Object.freeze({ handleEvent: vi.fn() })
    const calls: unknown[] = []
    const second = Object.freeze({
      handleEvent(this: unknown) {
        calls.push(this)
      },
    })
    const props = mergeProps({ '@click': first }, { '@click': second })
    expect(props['@click']).toBe(second)
    mount(props).click()
    expect(first.handleEvent).not.toHaveBeenCalled()
    expect(calls).toEqual([second])
  })
})

describe('lit Menu connector composition', () => {
  it('preserves parent item behavior when the core connector merges a child trigger', () => {
    const parent = machine({ id: 'lit-composition-parent' }).start()
    const child = machine({ id: 'lit-composition-child' }).start()
    cleanups.push(() => {
      child.stop()
      parent.stop()
    })
    child.send({ type: 'PARENT.SET', value: parent, id: parent.state.context.id })
    expect(child.getState().context.isSubmenu).toBe(true)
    const calls: string[] = []
    const parentApi = connect(parent.getState(), event => calls.push(`parent:${typeof event === 'string' ? event : event.type}`), normalizeProps)
    const childApi = connect(child.getState(), event => calls.push(`child:${typeof event === 'string' ? event : event.type}`), normalizeProps)
    const button = mount(parentApi.getTriggerItemProps(childApi))
    button.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }))
    expect(calls).toEqual(['child:TRIGGER_POINTERMOVE', 'parent:ITEM_POINTERMOVE'])
    calls.length = 0
    button.click()
    expect(calls).toEqual(['child:TRIGGER_CLICK', 'parent:ITEM_CLICK'])
  })
})
