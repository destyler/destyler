import type { MachineApi, State, UserDefinedContext } from '../../../components/number-input/src/types'
import type { PropTypes } from '../src/utils/normalize-props'
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

afterEach(() => {
  dispose.splice(0).forEach(cleanup => cleanup())
})

function mount(props: Partial<UserDefinedContext> = {}, controlled = false) {
  const host = document.createElement('div')
  document.body.append(host)
  const [value, setValue] = createSignal(props.value)
  const [mounted, setMounted] = createSignal(true)
  let api!: () => MachineApi<PropTypes>
  let state!: State
  const cleanup = render(() => {
    const [snapshot, send] = useMachine(machine({ id: 'solid-number-input', ...props }), controlled ? { context: () => ({ value: value() }) } : {})
    state = snapshot
    api = () => connect(snapshot, send, normalizeProps)
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
    form: host.querySelector('form')!,
    setValue,
    setMounted,
    api: () => api(),
    state: () => state,
  }
}

function edit(input: HTMLInputElement, value: string, caret: number, isComposing = false) {
  input.value = value
  input.setSelectionRange(caret, caret)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: isComposing ? 'insertCompositionText' : 'insertText', isComposing }))
}

describe('solid NumberInput native editing', () => {
  it.each([false, true])('keeps accepted partial text and caret (controlled=%s)', async (controlled) => {
    let view: ReturnType<typeof mount>
    const onValueChange = vi.fn((details: { value: string }) => {
      if (controlled)
        view.setValue(details.value)
    })
    view = mount({ [controlled ? 'value' : 'defaultValue']: '10', onValueChange }, controlled)
    expect(view.input.value).toBe('10')
    view.input.focus()
    for (const [index, value] of ['1.', '1.2', '-', '-1.', '-1.2', ''].entries()) {
      const caret = Math.min(1, value.length)
      edit(view.input, value, caret)
      await Promise.resolve()
      expect(view.input.value).toBe(value)
      expect(view.input.selectionStart).toBe(caret)
      await settle()
      expect(view.input.value).toBe(value)
      expect(view.input.selectionStart).toBe(caret)
      expect(view.input.selectionEnd).toBe(caret)
      expect(onValueChange).toHaveBeenCalledTimes(index + 1)
      expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value }))
    }
  })

  it('formats initialization and blur without formatting an accepted draft', async () => {
    const view = mount({ defaultValue: '12.5', formatOptions: { minimumFractionDigits: 2 } })
    expect(view.input.value).toBe('12.50')
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    expect(view.input.value).toBe('1.')
    expect(view.input.selectionStart).toBe(1)
    expect(view.api().value).toBe('1.00')
    view.input.blur()
    await settle()
    expect(view.input.value).toBe('1.00')
  })

  it('keeps composing text and ignores composing navigation keys', async () => {
    const onValueChange = vi.fn()
    const view = mount({ defaultValue: '10', onValueChange })
    view.input.focus()
    view.input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    edit(view.input, '1.', 1, true)
    await settle()
    expect(view.input.value).toBe('1.')
    expect(view.input.selectionStart).toBe(1)
    view.input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp', isComposing: true }))
    await settle()
    expect(view.input.value).toBe('1.')
    expect(onValueChange).toHaveBeenCalledTimes(1)
    view.input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '2' }))
    edit(view.input, '1.2', 1)
    await settle()
    expect(view.input.value).toBe('1.2')
    expect(view.input.selectionStart).toBe(1)
    expect(onValueChange).toHaveBeenLastCalledWith({ value: '1.2', valueAsNumber: 1.2 })
  })

  it('keeps controlled ownership and applies later parent updates', async () => {
    const onValueChange = vi.fn()
    const view = mount({ value: '10', onValueChange }, true)
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    expect(view.state().context.value).toBe('10')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: '1.', valueAsNumber: 1 })
    view.setValue('25')
    await settle()
    expect(view.input.value).toBe('25')
    view.input.blur()
    view.setValue('30')
    await settle()
    expect(view.input.value).toBe('30')
  })

  it('formats imperative writes after native editing', async () => {
    const view = mount({ defaultValue: '10', formatOptions: { minimumFractionDigits: 2 } })
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    view.api().setValue(12.5)
    await settle()
    expect(view.input.value).toBe('12.50')
    view.api().increment()
    await settle()
    expect(view.input.value).toBe('13.50')
  })

  it('resets an uncontrolled draft to its initial value', async () => {
    const view = mount({ defaultValue: '10' })
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    view.form.reset()
    await settle()
    expect(view.input.value).toBe('10')
    expect(view.state().context.value).toBe('10')
  })

  it('seeds a remounted input from the current accepted value', async () => {
    const view = mount({ defaultValue: '10' })
    view.input.focus()
    edit(view.input, '1.2', 1)
    await settle()
    const previous = view.input
    view.setMounted(false)
    view.setMounted(true)
    await settle()
    expect(view.input).not.toBe(previous)
    expect(view.input.value).toBe('1.2')
    view.input.focus()
    edit(view.input, '2.', 1)
    await settle()
    expect(view.input.value).toBe('2.')
    expect(view.input.selectionStart).toBe(1)
  })
})
