import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

// Real CSS/AnimationEvent tests run in the repository's Chromium project.
describe('presence native animation identity', () => {
  const cleanups: (() => void)[] = []

  afterEach(() => {
    cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  })

  function setup() {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes presence-enter { from { opacity: 0.8 } to { opacity: 1 } }
      @keyframes presence-exit { from { opacity: 1 } to { opacity: 0.8 } }
      @keyframes presence-second-exit { from { opacity: 1 } to { opacity: 0.7 } }
    `
    const node = document.createElement('div')
    node.textContent = 'Presence animation target'
    node.style.animation = 'presence-enter 60s linear'
    cleanups.push(() => {
      node.remove()
      style.remove()
    })
    document.head.append(style)
    document.body.append(node)
    const onExitComplete = vi.fn()
    const service = machine({ present: true, immediate: true, onExitComplete })
    cleanups.push(() => service.stop())
    service.start()
    const api = () => connect(service.getState(), service.send, null as any)
    api().setNode(node)
    const events: AnimationEvent[] = []
    for (const type of ['animationstart', 'animationend', 'animationcancel'] as const) {
      const listener = (event: AnimationEvent) => events.push(event)
      node.addEventListener(type, listener)
      cleanups.push(() => node.removeEventListener(type, listener))
    }
    const waitForEvent = async (type: string, name: string) => {
      await expect.poll(() => events.some(event => event.type === type && event.animationName === name)).toBe(true)
      return events.find(event => event.type === type && event.animationName === name)!
    }
    const close = async (name = 'presence-exit', native = true) => {
      node.style.animationName = name
      service.setContext({ present: false })
      await Promise.resolve()
      await Promise.resolve()
      expect(service.state.value).toBe('unmountSuspended')
      // Force CSS animation resolution, then wait for its real playback timeline.
      if (native) {
        const animations = node.getAnimations()
        expect(animations).toHaveLength(1)
        await animations[0].ready
      }
    }
    return { node, service, api, onExitComplete, events, close, waitForEvent }
  }

  it('does not complete the exit when Chromium cancels the preceding enter animation', async () => {
    const { node, service, onExitComplete, close, waitForEvent } = setup()
    expect((await waitForEvent('animationstart', 'presence-enter')).isTrusted).toBe(true)
    await close()
    const cancellation = await waitForEvent('animationcancel', 'presence-enter')
    expect(cancellation.isTrusted).toBe(true)
    expect(cancellation.target).toBe(node)
    expect(getComputedStyle(node).animationName).toBe('presence-exit')
    const exit = node.getAnimations().find(animation => (animation as CSSAnimation).animationName === 'presence-exit')!
    expect(exit.playState).toBe('running')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    // Finish the actual CSSAnimation timeline; the browser supplies the trusted event.
    exit.finish()
    expect((await waitForEvent('animationend', 'presence-exit')).isTrusted).toBe(true)
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('ignores native cancellation from an interrupted exit after reopen and another close', async () => {
    const { node, service, onExitComplete, close, waitForEvent } = setup()
    await waitForEvent('animationstart', 'presence-enter')
    await close()
    await waitForEvent('animationstart', 'presence-exit')
    // The first enter cancellation is itself a regression assertion.
    expect(service.state.value).toBe('unmountSuspended')
    service.setContext({ present: true })
    await Promise.resolve()
    await Promise.resolve()
    expect(service.state.value).toBe('mounted')
    await close('presence-second-exit')
    const cancellation = await waitForEvent('animationcancel', 'presence-exit')
    expect(cancellation.isTrusted).toBe(true)
    expect(getComputedStyle(node).animationName).toBe('presence-second-exit')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    node.getAnimations()[0].finish()
    await waitForEvent('animationend', 'presence-second-exit')
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('still completes on native cancellation of the current exit', async () => {
    const { node, service, onExitComplete, close, waitForEvent } = setup()
    await waitForEvent('animationstart', 'presence-enter')
    // Finish enter before closing so it cannot emit the unrelated cancellation.
    node.getAnimations()[0].finish()
    await waitForEvent('animationend', 'presence-enter')
    await close()
    await waitForEvent('animationstart', 'presence-exit')
    node.getAnimations()[0].cancel()
    const cancellation = await waitForEvent('animationcancel', 'presence-exit')
    expect(cancellation.isTrusted).toBe(true)
    expect(getComputedStyle(node).animationName).toBe('presence-exit')
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each([
    ['presence\\,exit', 'presence,exit'],
    ['presence\\2c exit', 'presence,exit'],
    ['presence\\ exit', 'presence exit'],
    ['pr\u00E9sence', 'pr\u00E9sence'],
    ['presence\u00A0exit', 'presence\u00A0exit'],
    ['presence\\"exit', 'presence"exit'],
    ['presence\\\\exit', 'presence\\exit'],
    ['presence\\ ', 'presence '],
  ])('completes the native CSS animation serialized as %s', async (serializedName, name) => {
    const { node, service, onExitComplete, close, waitForEvent } = setup()
    await waitForEvent('animationstart', 'presence-enter')
    node.getAnimations()[0].finish()
    await waitForEvent('animationend', 'presence-enter')
    const style = document.createElement('style')
    style.textContent = `@keyframes ${serializedName} { from { opacity: 1 } to { opacity: 0.9 } }`
    cleanups.push(() => style.remove())
    document.head.append(style)
    await close(serializedName)
    const started = await waitForEvent('animationstart', name)
    expect(started.isTrusted).toBe(true)
    expect((node.getAnimations()[0] as CSSAnimation).animationName).toBe(name)
    expect(getComputedStyle(node).animationName).not.toBe('none')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    node.getAnimations()[0].finish()
    expect((await waitForEvent('animationend', name)).isTrusted).toBe(true)
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each([
    ['animationend', 'generic'],
    ['animationcancel', 'generic'],
    ['animationend', 'empty-name'],
    ['animationcancel', 'empty-name'],
  ])('preserves %s %s manual DOM controls', async (type, kind) => {
    const { node, service, onExitComplete, close } = setup()
    await close('presence-exit', false)
    node.dispatchEvent(kind === 'generic' ? new Event(type) : new AnimationEvent(type))
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each(['animationend', 'animationcancel'])('ignores matching %s from actual light/shadow descendants', async (type) => {
    const { node, service, onExitComplete, close } = setup()
    // These events intentionally exercise DOM delivery, not native CSS scheduling.
    await close('presence-exit', false)
    const child = document.createElement('span')
    node.append(child)
    child.dispatchEvent(new AnimationEvent(type, { animationName: 'presence-exit', bubbles: true }))
    expect(service.state.value).toBe('unmountSuspended')
    const shadowChild = document.createElement('span')
    node.attachShadow({ mode: 'open' }).append(shadowChild)
    let retargeted: EventTarget | null | undefined
    let original: EventTarget | undefined
    node.addEventListener(type, (event) => {
      retargeted = event.target
      original = event.composedPath()[0]
    }, { once: true })
    shadowChild.dispatchEvent(new AnimationEvent(type, { animationName: 'presence-exit', bubbles: true, composed: true }))
    expect(retargeted).toBe(node)
    expect(original).toBe(shadowChild)
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    node.dispatchEvent(new AnimationEvent(type, { animationName: 'presence-exit' }))
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })
})
