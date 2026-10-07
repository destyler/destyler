import { describe, expect, it, vi } from 'vitest'
import { normalizeProps } from '../src/normalize-props'
import { spreadProps } from '../src/spread-props'

describe('vanilla event lifecycle', () => {
  it.each([null, undefined, false])('removes a handler whose value becomes %s', (value) => {
    const button = document.createElement('button')
    const handler = vi.fn()
    spreadProps(button, { onclick: handler })
    button.click()
    expect(handler).toHaveBeenCalledTimes(1)
    spreadProps(button, { onclick: value })
    button.click()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('preserves capture behavior after prop normalization', () => {
    const parent = document.createElement('div')
    const button = document.createElement('button')
    parent.append(button)
    const calls: string[] = []
    spreadProps(parent, normalizeProps.element({ onClickCapture: () => calls.push('capture') }))
    button.addEventListener('click', () => calls.push('target'))
    button.click()
    expect(calls).toEqual(['capture', 'target'])
  })

  it.each(['onGotPointerCapture', 'onLostPointerCapture'])('retains the native event name for %s', (key) => {
    const button = document.createElement('button')
    const handler = vi.fn()
    spreadProps(button, { [key]: handler })
    button.dispatchEvent(new Event(key.slice(2).toLowerCase()))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['onChangeCapture', 'input'],
    ['onFocusCapture', 'focusin'],
    ['onBlurCapture', 'focusout'],
    ['onDoubleClickCapture', 'dblclick'],
  ])('normalizes %s to a capturing %s listener', (key, name) => {
    const parent = document.createElement('div')
    const input = document.createElement('input')
    parent.append(input)
    const calls: string[] = []
    spreadProps(parent, normalizeProps.element({ [key]: () => calls.push('capture') }))
    input.addEventListener(name, () => calls.push('target'))
    input.dispatchEvent(new Event(name, { bubbles: true }))
    expect(calls).toEqual(['capture', 'target'])
  })

  it('replaces and removes a normalized capture handler without disturbing other listeners', () => {
    const parent = document.createElement('div')
    const button = document.createElement('button')
    parent.append(button)
    const first = vi.fn()
    const next = vi.fn()
    const external = vi.fn()
    parent.addEventListener('click', external)
    const remove = vi.spyOn(parent, 'removeEventListener')
    spreadProps(parent, normalizeProps.element({ onClickCapture: first }))
    spreadProps(parent, normalizeProps.element({ onClickCapture: next }))
    expect(remove).toHaveBeenCalledWith('click', first, { capture: true })
    button.click()
    expect(first).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(external).toHaveBeenCalledTimes(1)

    spreadProps(parent, {})
    expect(remove).toHaveBeenCalledWith('click', next, { capture: true })
    button.click()
    expect(next).toHaveBeenCalledTimes(1)
    expect(external).toHaveBeenCalledTimes(2)
  })

  it.each(['onGotPointerCaptureCapture', 'onLostPointerCaptureCapture'])('supports capture listeners for the %s native event', (key) => {
    const parent = document.createElement('div')
    const button = document.createElement('button')
    parent.append(button)
    const phases: number[] = []
    spreadProps(parent, normalizeProps.element({ [key]: (event: Event) => phases.push(event.eventPhase) }))
    button.dispatchEvent(new Event(key.slice(2, -7).toLowerCase(), { bubbles: true }))
    expect(phases).toEqual([Event.CAPTURING_PHASE])
  })
})
