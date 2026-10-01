import type { State, UserDefinedContext } from '../../../components/number-input/src/types'
import { createSignal, untrack } from 'solid-js'
import { insert, render, spread } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../../../components/number-input/src/connect'
import { machine } from '../../../components/number-input/src/machine'
import { useMachine } from '../src/hooks/use-machine'
import { mergeProps } from '../src/utils/merge-props'
import { normalizeProps } from '../src/utils/normalize-props'

const dispose: Array<() => void> = []
const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

afterEach(() => dispose.splice(0).forEach(cleanup => cleanup()))

function mount(props: Partial<UserDefinedContext> = {}) {
  const host = document.createElement('div')
  document.body.append(host)
  const [value, setValue] = createSignal(props.value ?? '10')
  const [mounted, setMounted] = createSignal(true)
  let state!: State
  const cleanup = render(() => {
    const [snapshot, send] = useMachine(machine({ id: 'solid-number-input-veto', value: value(), ...props }), { context: () => ({ value: value() }) })
    state = snapshot
    const api = () => connect(snapshot, send, normalizeProps)
    const form = document.createElement('form')
    insert(form, () => mounted()
      ? untrack(() => {
          const input = document.createElement('input')
          spread(input, mergeProps(() => api().getInputProps()))
          return input
        })
      : null)
    return form
  }, host)
  dispose.push(() => {
    cleanup()
    host.remove()
  })
  return {
    get input() { return host.querySelector('input')! },
    setValue,
    setMounted,
    state: () => state,
  }
}

function edit(input: HTMLInputElement, value: string, caret = value.length, isComposing = false) {
  input.value = value
  input.setSelectionRange(caret, caret)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: isComposing ? 'insertCompositionText' : 'insertText', isComposing }))
}

describe('solid NumberInput controlled native veto', () => {
  it('restores the parent value and still accepts a later parent update', async () => {
    const onValueChange = vi.fn()
    const view = mount({ onValueChange })
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    expect(view.input.value).toBe('10')
    expect(view.state().context.value).toBe('10')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: '1.', valueAsNumber: 1 })
    view.setValue('25')
    await settle()
    expect(view.input.value).toBe('25')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('allows an asynchronously accepted parent update', async () => {
    let view: ReturnType<typeof mount>
    const onValueChange = vi.fn(({ value }: { value: string }) => queueMicrotask(() => view.setValue(value)))
    view = mount({ onValueChange })
    view.input.focus()
    edit(view.input, '12', 1)
    await settle()
    expect(view.input.value).toBe('12')
    expect(view.input.selectionStart).toBe(1)
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('defers a veto during composition and reconciles without a duplicate request', async () => {
    const onValueChange = vi.fn()
    const view = mount({ onValueChange })
    view.input.focus()
    view.input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    edit(view.input, '1.', 1, true)
    await settle()
    expect(view.input.value).toBe('1.')
    expect(view.input.selectionStart).toBe(1)
    view.input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '1.' }))
    await settle()
    expect(view.input.value).toBe('10')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('reconciles a remounted input without writing into the removed one', async () => {
    const view = mount()
    view.input.focus()
    edit(view.input, '1.', 1)
    const removed = view.input
    view.setMounted(false)
    view.setMounted(true)
    await settle()
    expect(removed.value).toBe('1.')
    expect(view.input.value).toBe('10')
    view.input.focus()
    edit(view.input, '20')
    await settle()
    expect(view.input.value).toBe('10')
  })
})
