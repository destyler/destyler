import { createSignal } from 'solid-js'
import { isServer, render, spread } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mergeProps } from '../src/utils/merge-props'

const cleanups: (() => void)[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

function mount(props: Record<string, unknown>) {
  expect(isServer).toBe(false)
  const host = document.createElement('div')
  document.body.append(host)
  const button = document.createElement('button')
  button.setAttribute('aria-pressed', 'false')
  const dispose = render(() => {
    spread(button, props)
    return button
  }, host)
  cleanups.push(() => {
    dispose()
    host.remove()
  })
  return button
}

describe('solid tuple event composition', () => {
  it.each([true, false])('composes the consumer with internal behavior (tuple=%s)', (tuple) => {
    const calls: string[] = []
    const payload = { label: 'payload' }
    const consumer = vi.fn(function (this: HTMLButtonElement, data: typeof payload, event: MouseEvent) {
      expect(data).toBe(payload)
      expect(this).toBe(event.currentTarget)
      calls.push('consumer')
    })
    const internal = (event: MouseEvent) => {
      calls.push('internal')
      ;(event.currentTarget as HTMLButtonElement).setAttribute('aria-pressed', 'true')
    }
    const button = mount(mergeProps({ onClick: internal }, {
      onClick: tuple ? [consumer, payload] : (event: MouseEvent) => consumer.call(event.currentTarget as HTMLButtonElement, payload, event),
    }))
    button.click()
    expect(calls).toEqual(['consumer', 'internal'])
    expect(consumer).toHaveBeenCalledTimes(1)
    expect(button.getAttribute('aria-pressed')).toBe('true')
  })

  it('passes the same default-prevented event to the internal handler', () => {
    const payload = { cancel: true }
    let consumerEvent: MouseEvent | undefined
    const internal = vi.fn((event: MouseEvent) => {
      expect(event).toBe(consumerEvent)
      if (!event.defaultPrevented)
        (event.currentTarget as HTMLButtonElement).setAttribute('aria-pressed', 'true')
    })
    const button = mount(mergeProps({ onClick: internal }, {
      onClick: [(data: typeof payload, event: MouseEvent) => {
        expect(data).toBe(payload)
        consumerEvent = event
        event.preventDefault()
      }, payload],
    }))
    button.click()
    expect(internal).toHaveBeenCalledTimes(1)
    expect(button.getAttribute('aria-pressed')).toBe('false')
  })

  it('keeps last-source-first ordering when multiple tuples are composed', () => {
    const calls: string[] = []
    const first = (data: string, _event: MouseEvent) => calls.push(data)
    const second = (data: string, _event: MouseEvent) => calls.push(data)
    const button = mount(mergeProps(
      { onClick: () => calls.push('internal') },
      { onClick: [first, 'first'] },
      { onClick: [second, 'second'] },
    ))
    button.click()
    expect(calls).toEqual(['second', 'first', 'internal'])
  })

  it('reactively replaces tuple data and handlers without losing internal behavior', () => {
    const calls: string[] = []
    const [consumer, setConsumer] = createSignal<unknown>([(data: string) => calls.push(data), 'first'])
    const button = mount(mergeProps(
      { onClick: () => calls.push('internal') },
      () => ({ onClick: consumer() }),
    ))
    button.click()
    setConsumer([(data: string) => calls.push(data), 'second'])
    button.click()
    setConsumer(() => () => calls.push('function'))
    button.click()
    setConsumer(undefined)
    button.click()
    expect(calls).toEqual(['first', 'internal', 'second', 'internal', 'function', 'internal', 'internal'])
  })

  it('does not mutate a frozen non-delegated tuple handler', () => {
    const consumer = vi.fn()
    const internal = vi.fn()
    const tuple = Object.freeze([consumer, { value: 0 }] as const)
    const button = mount(mergeProps({ onFocus: internal }, { onFocus: tuple }))
    button.dispatchEvent(new FocusEvent('focus'))
    expect(consumer).toHaveBeenCalledExactlyOnceWith(tuple[1], expect.any(FocusEvent))
    expect(internal).toHaveBeenCalledTimes(1)
    expect(tuple[0]).toBe(consumer)
  })

  it('leaves arrays outside event props unchanged', () => {
    const values = [() => {}, 'data']
    expect(mergeProps({ values }).values).toBe(values)
  })

  it.each([0, false, null])('preserves the tuple payload %s without coercion', (payload) => {
    const consumer = vi.fn()
    const internal = vi.fn()
    const button = mount(mergeProps({ onClick: internal }, { onClick: [consumer, payload] }))
    button.click()
    expect(consumer).toHaveBeenCalledExactlyOnceWith(payload, expect.any(MouseEvent))
    expect(internal).toHaveBeenCalledTimes(1)
  })
})
