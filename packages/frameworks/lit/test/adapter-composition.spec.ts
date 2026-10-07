import { normalizeProps, portal, spread } from '@destyler/lit'
import { mergeProps as solidMerge } from '@destyler/solid'
import { useActor } from '@destyler/vanilla'
import { createMachine, mergeProps } from '@destyler/xstate'
import { html, nothing, render } from 'lit'
import { createSignal } from 'solid-js'
import { isServer, render as solidRender, spread as solidSpread } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'

const cleanups: (() => void)[] = []
afterEach(() => {
  const errors: unknown[] = []
  for (const cleanup of cleanups.splice(0).reverse()) {
    try {
      cleanup()
    }
    catch (error) {
      errors.push(error)
    }
  }
  if (errors.length)
    throw errors[0]
})
async function settle() {
  for (let index = 0; index < 12; index++)
    await Promise.resolve()
}

describe('combined portal and event consumers', () => {
  it('releases and restores composed spread listeners across iframe portal reconnect and handler replacement', async () => {
    const iframe = document.createElement('iframe')
    const host = document.createElement('main')
    document.body.append(iframe, host)
    cleanups.push(() => iframe.remove(), () => host.remove())
    const target = iframe.contentDocument!
    const calls: string[] = []
    const content = (label: string) => html`<button ${spread(mergeProps(
      normalizeProps.element({ onClick() { calls.push('internal') } }),
      normalizeProps.element({ onClick() { calls.push(label) } }),
    ))}>button</button>`
    const view = (label: string) => html`${portal(content(label), undefined, { getRootNode: () => target })}`
    cleanups.push(() => render(nothing, host))
    const root = render(view('first'), host)
    await settle()
    const button = target.body.querySelector('button')!
    expect(button).not.toBeNull()
    const foreign = () => calls.push('foreign')
    button.addEventListener('click', foreign)
    cleanups.push(() => button.removeEventListener('click', foreign))
    button.click()
    expect(calls).toEqual(['first', 'internal', 'foreign'])
    calls.length = 0
    root.setConnected(false)
    button.click()
    expect(calls).toEqual(['foreign'])
    calls.length = 0
    root.setConnected(true)
    await settle()
    expect(target.body.querySelector('button')).toBe(button)
    button.click()
    expect(calls).toEqual(['foreign', 'first', 'internal'])
    calls.length = 0
    render(view('next'), host)
    await settle()
    button.click()
    expect(calls).toEqual(['foreign', 'next', 'internal'])
    calls.length = 0
    root.setConnected(false)
    button.click()
    expect(calls).toEqual(['foreign'])
    calls.length = 0
    root.setConnected(true)
    await settle()
    render(nothing, host)
    expect(target.body.childNodes).toHaveLength(0)
    button.click()
    expect(calls).toEqual(['foreign'])
  })

  it('combines Solid tuple normalization with native receiver preservation and reactive payloads', () => {
    expect(isServer).toBe(false)
    const calls: unknown[][] = []
    const [payload, setPayload] = createSignal(0)
    const host = document.createElement('main')
    const button = document.createElement('button')
    document.body.append(host)
    cleanups.push(() => host.remove())
    const dispose = solidRender(() => {
      solidSpread(button, solidMerge({
        onFocus(this: unknown, event: Event) { calls.push(['internal', this, event]) },
      }, () => ({
        onFocus: [function (this: unknown, data: number, event: Event) { calls.push(['consumer', this, event, data]) }, payload()],
      })))
      return button
    }, host)
    cleanups.push(dispose)
    const first = new FocusEvent('focus')
    button.dispatchEvent(first)
    expect(calls).toEqual([['consumer', button, first, 0], ['internal', button, first]])
    calls.length = 0
    setPayload(5)
    const next = new FocusEvent('focus')
    button.dispatchEvent(next)
    expect(calls).toEqual([['consumer', button, next, 5], ['internal', button, next]])
  })

  it('retains current Vanilla actor reads beside on-event receiver composition', () => {
    const actor = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
    cleanups.push(() => actor.stop())
    const target = {}
    const [before] = useActor(target, actor)
    expect(before.value).toBe('idle')
    const owner = { marker: true }
    const event = new Event('update')
    const calls: unknown[] = []
    const merged = mergeProps({ onUpdate(this: unknown, value: Event) {
      calls.push(this, value, useActor(target, actor)[0].context.count)
    } }, { onUpdate() { actor.setContext({ count: 4 }) } })
    merged.onUpdate.call(owner, event)
    expect(calls).toEqual([owner, event, 4])
    expect(before.context.count).toBe(0)
    expect(useActor(target, actor)[0]).toBe(useActor(target, actor)[0])
  })
})
