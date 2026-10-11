// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let api: typeof import('../index')
const cleanups: VoidFunction[] = []
let originalFocus: typeof HTMLElement.prototype.focus

beforeEach(async () => {
  vi.resetModules()
  originalFocus = HTMLElement.prototype.focus
  api = await import('../index')
})

afterEach(() => {
  for (const cleanup of cleanups.splice(0))
    cleanup()
  window.dispatchEvent(new Event('beforeunload'))
  HTMLElement.prototype.focus = originalFocus
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function pointerDown() {
  document.dispatchEvent(typeof window.PointerEvent === 'undefined'
    ? new MouseEvent('mousedown', { bubbles: true })
    : new PointerEvent('pointerdown', { bubbles: true }))
}

function keyboard(key: string, options: KeyboardEventInit = {}, target: EventTarget = document) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }))
}

describe('focus-visible public modality and window contracts', () => {
  it('reports initial state, autofocus override, and explicit modality changes', () => {
    const onChange = vi.fn()
    const onModality = vi.fn()
    expect(api.getInteractionModality()).toBe(null)
    expect(api.isFocusVisible()).toBe(false)
    cleanups.push(api.trackFocusVisible({ autoFocus: true, onChange }))
    cleanups.push(api.trackInteractionModality({ onChange: onModality }))
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: null })
    expect(onModality).toHaveBeenLastCalledWith({ modality: null })
    api.setInteractionModality('keyboard')
    expect(api.isFocusVisible()).toBe(true)
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: 'keyboard' })
    api.setInteractionModality('pointer')
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: false, modality: 'pointer' })
  })

  it('releases only its subscription, repeatedly, without disabling a peer', () => {
    const first = vi.fn()
    const peer = vi.fn()
    const release = api.trackFocusVisible({ onChange: first })
    cleanups.push(release, api.trackFocusVisible({ onChange: peer }))
    release()
    release()
    keyboard('Tab')
    expect(first).toHaveBeenCalledTimes(1)
    expect(peer).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: 'keyboard' })
  })

  it('uses one window listener installation and restores native focus on unload', () => {
    const release = api.trackInteractionModality({ onChange: vi.fn() })
    cleanups.push(release)
    const patchedFocus = HTMLElement.prototype.focus
    cleanups.push(api.trackFocusVisible())
    expect(api.listenerMap.size).toBe(1)
    expect(patchedFocus).not.toBe(originalFocus)
    expect(HTMLElement.prototype.focus).toBe(patchedFocus)
    release()
    // Per-subscriber cleanup intentionally does not own shared window listeners.
    expect(api.listenerMap.size).toBe(1)
    window.dispatchEvent(new Event('beforeunload'))
    expect(api.listenerMap.size).toBe(0)
    expect(HTMLElement.prototype.focus).toBe(originalFocus)
    cleanups.push(api.trackFocusVisible())
    expect(api.listenerMap.size).toBe(1)
  })

  it('tracks pointer and valid keyboard events while ignoring modifiers', () => {
    const onChange = vi.fn()
    cleanups.push(api.trackFocusVisible({ onChange }))
    pointerDown()
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: false, modality: 'pointer' })
    keyboard('Tab', { ctrlKey: true })
    keyboard('Shift')
    expect(api.getInteractionModality()).toBe('pointer')
    keyboard('Tab')
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: 'keyboard' })
  })

  it('filters ordinary typing in text inputs but keeps Tab and Escape changes', () => {
    const input = document.createElement('input')
    document.body.append(input)
    const onChange = vi.fn()
    cleanups.push(api.trackFocusVisible({ onChange }))
    pointerDown()
    const count = onChange.mock.calls.length
    keyboard('a', {}, input)
    expect(onChange).toHaveBeenCalledTimes(count)
    keyboard('Tab', {}, input)
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: 'keyboard' })
    keyboard('Escape', {}, input)
    expect(onChange).toHaveBeenCalledTimes(count + 2)
  })

  it('treats checkbox keyboard interactions as non-text and honors explicit text-input mode', () => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    document.body.append(checkbox)
    const ordinary = vi.fn()
    const text = vi.fn()
    cleanups.push(api.trackFocusVisible({ onChange: ordinary }))
    cleanups.push(api.trackFocusVisible({ isTextInput: true, onChange: text }))
    keyboard(' ', {}, checkbox)
    expect(ordinary).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: 'keyboard' })
    expect(text).toHaveBeenCalledTimes(1)
  })

  it('forwards programmatic focus options and reports virtual modality', () => {
    const focus = vi.fn()
    HTMLElement.prototype.focus = focus
    const onChange = vi.fn()
    cleanups.push(api.trackFocusVisible({ onChange }))
    const button = document.createElement('button')
    const options = { preventScroll: true }
    button.focus(options)
    expect(focus).toHaveBeenCalledWith(options)
    expect(focus.mock.contexts[0]).toBe(button)
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: false, modality: 'virtual' })
  })

  it('supports a shadow root while retaining documented global modality notifications', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const onChange = vi.fn()
    cleanups.push(api.trackFocusVisible({ root: shadow, onChange }))
    keyboard('Tab')
    expect(onChange).toHaveBeenLastCalledWith({ isFocusVisible: true, modality: 'keyboard' })
    expect(api.listenerMap.has(window)).toBe(true)
  })
})
