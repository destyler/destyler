import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine as checkboxMachine } from '../../../components/checkbox/src/machine'
import { machine as switchMachine } from '../../../components/switch/src/machine'
import { trackPress } from '../src/press'

const cleanups: VoidFunction[] = []
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
  document.body.replaceChildren()
})

function setup(initiallyFocused = false) {
  const target = document.createElement('button')
  const other = document.createElement('button')
  document.body.append(target, other)
  if (initiallyFocused)
    target.focus()
  const onPress = vi.fn()
  const onPressStart = vi.fn()
  const onPressEnd = vi.fn()
  const cleanup = trackPress({ pointerNode: target, onPress, onPressStart, onPressEnd })
  cleanups.push(cleanup)
  return { target, other, onPress, onPressStart, onPressEnd, cleanup }
}

function key(target: HTMLElement, type: 'keydown' | 'keyup') {
  target.dispatchEvent(new KeyboardEvent(type, { key: 'Enter', bubbles: true }))
}

function pointer(target: HTMLElement, type: 'pointerdown' | 'pointerup' | 'pointercancel') {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'mouse', button: 0 }))
}

describe('press listener ownership', () => {
  it('tracks keyboard gestures when the node is already focused at setup', () => {
    const { target, onPressStart, onPress } = setup(true)
    key(target, 'keydown')
    key(target, 'keyup')
    expect(onPressStart).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('owns one keyboard listener set after repeated focus and blur', () => {
    const { target, other, onPressStart, onPress } = setup()
    target.focus()
    other.focus()
    target.focus()
    key(target, 'keydown')
    key(target, 'keyup')
    expect(onPressStart).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('leaves no old keyboard listeners after cleanup following repeated focus', () => {
    const { target, other, onPressStart, onPress, cleanup } = setup()
    target.focus()
    other.focus()
    target.focus()
    cleanup()
    cleanup()
    key(target, 'keydown')
    key(target, 'keyup')
    expect(onPressStart).not.toHaveBeenCalled()
    expect(onPress).not.toHaveBeenCalled()
  })

  it('completes a keyboard gesture only once and allows the next gesture', () => {
    const { target, onPress, onPressEnd } = setup()
    target.focus()
    key(target, 'keydown')
    key(target, 'keyup')
    key(target, 'keyup')
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPressEnd).toHaveBeenCalledTimes(1)
    key(target, 'keydown')
    key(target, 'keyup')
    expect(onPress).toHaveBeenCalledTimes(2)
    expect(onPressEnd).toHaveBeenCalledTimes(2)
  })

  it('cancels keyboard release after focus leaves the press target', () => {
    const { target, other, onPress, onPressEnd } = setup()
    target.focus()
    key(target, 'keydown')
    other.focus()
    expect(onPressEnd).toHaveBeenCalledTimes(1)
    key(target, 'keyup')
    expect(onPress).not.toHaveBeenCalled()
    expect(onPressEnd).toHaveBeenCalledTimes(1)
  })

  it('completes a pointer gesture only once and allows the next gesture', () => {
    const { target, onPress } = setup()
    pointer(target, 'pointerdown')
    pointer(target, 'pointerup')
    pointer(target, 'pointerup')
    expect(onPress).toHaveBeenCalledTimes(1)
    pointer(target, 'pointerdown')
    pointer(target, 'pointerup')
    expect(onPress).toHaveBeenCalledTimes(2)
  })

  it('cancels a pointer gesture once without accepting its later release', () => {
    const { target, onPress, onPressEnd } = setup()
    pointer(target, 'pointerdown')
    pointer(target, 'pointercancel')
    pointer(target, 'pointercancel')
    pointer(target, 'pointerup')
    expect(onPress).not.toHaveBeenCalled()
    expect(onPressEnd).toHaveBeenCalledTimes(1)
  })

  it('cleanup prevents all callbacks from pending gestures and future focus', () => {
    const { target, other, onPress, onPressStart, onPressEnd, cleanup } = setup()
    pointer(target, 'pointerdown')
    expect(onPressStart).toHaveBeenCalledTimes(1)
    cleanup()
    pointer(target, 'pointerup')
    pointer(target, 'pointercancel')
    target.focus()
    key(target, 'keydown')
    key(target, 'keyup')
    other.focus()
    expect(onPress).not.toHaveBeenCalled()
    expect(onPressEnd).not.toHaveBeenCalled()
    expect(onPressStart).toHaveBeenCalledTimes(1)
  })
})

it.each([['checkbox', checkboxMachine], ['switch', switchMachine]] as const)('%s stops tracking keyboard activity after repeated focus and machine teardown', (name, machine) => {
  const root = document.createElement('label')
  root.id = `${name}:press-owner`
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.id = `${name}:press-owner:input`
  root.append(input)
  const other = document.createElement('button')
  document.body.append(root, other)
  const service = machine({ id: 'press-owner', getRootNode: () => document }).start()
  cleanups.push(() => service.stop())

  input.focus()
  other.focus()
  input.focus()
  input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(service.state.context.active).toBe(true)
  input.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }))
  expect(service.state.context.active).toBe(false)
  service.stop()
  input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(service.state.context.active).toBe(false)
})
