import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const cleanup: Array<() => void> = []
const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
const normalize = createNormalizer<any>(props => props)

afterEach(() => cleanup.splice(0).forEach(dispose => dispose()))

function mount(props: Partial<UserDefinedContext> = {}) {
  const form = document.createElement('form')
  document.body.append(form)
  const service = machine({ id: 'native-number-input', ...props })
  const api = () => connect(service.getState(), service.send, normalize)
  function mountInput() {
    const input = document.createElement('input')
    const props = api().getInputProps()
    input.id = props.id
    input.type = props.type
    input.defaultValue = props.defaultValue
    for (const event of ['focus', 'blur', 'input', 'compositionstart', 'compositionend', 'keydown']) {
      const key = Object.keys(props).find(key => key.toLowerCase() === `on${event}`)
      if (key)
        input.addEventListener(event, event => api().getInputProps()[key](event))
    }
    form.append(input)
    return input
  }
  let input = mountInput()
  service.start()
  cleanup.push(() => {
    service.stop()
    form.remove()
  })
  return {
    service,
    api,
    form,
    get input() { return input },
    remount() {
      input.remove()
      input = mountInput()
    },
  }
}

function edit(input: HTMLInputElement, value: string, caret = value.length, isComposing = false) {
  input.value = value
  input.setSelectionRange(caret, caret)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: isComposing ? 'insertCompositionText' : 'insertText', isComposing }))
}

describe('number input controlled native text', () => {
  it.each(['1.', '-', '', '25'])('restores the parent value after rejecting %j', async (draft) => {
    const onValueChange = vi.fn()
    const view = mount({ value: '10', onValueChange })
    view.input.focus()
    edit(view.input, draft)
    await settle()
    expect(view.service.state.context.value).toBe('10')
    expect(view.input.value).toBe('10')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: draft, valueAsNumber: draft === '-' || draft === '' ? Number.NaN : Number(draft) })
  })

  it.each(['sync', 'microtask'] as const)('keeps accepted partial text and caret after %s parent writeback', async (timing) => {
    let view: ReturnType<typeof mount>
    const onValueChange = vi.fn(({ value }: { value: string }) => {
      const accept = () => view.service.setContext({ value })
      if (timing === 'sync')
        accept()
      else
        queueMicrotask(accept)
    })
    view = mount({ value: '10', onValueChange })
    view.input.focus()
    for (const [index, draft] of ['1.', '1.2', '-', '-1.', ''].entries()) {
      const caret = Math.min(1, draft.length)
      edit(view.input, draft, caret)
      await settle()
      expect(view.input.value).toBe(draft)
      expect(view.service.state.context.value).toBe(draft)
      expect(view.input.selectionStart).toBe(caret)
      expect(onValueChange).toHaveBeenCalledTimes(index + 1)
    }
  })

  it('applies a later parent acceptance after reconciling the rejected draft', async () => {
    const onValueChange = vi.fn()
    const view = mount({ value: '10', onValueChange })
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    expect(view.input.value).toBe('10')
    view.service.setContext({ value: '1.' })
    await settle()
    expect(view.input.value).toBe('1.')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('reads the latest parent value and does not replay an earlier draft', async () => {
    const onValueChange = vi.fn()
    const view = mount({ value: '10', onValueChange })
    view.input.focus()
    edit(view.input, '1.', 1)
    edit(view.input, '12.', 2)
    view.service.setContext({ value: '30' })
    await settle()
    expect(view.input.value).toBe('30')
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })

  it.each([true, false])('defers rejected composition until it ends (start event=%s)', async (withStart) => {
    const onValueChange = vi.fn()
    const view = mount({ value: '10', onValueChange })
    view.input.focus()
    if (withStart)
      view.input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    edit(view.input, '1.', 1, true)
    await settle()
    expect(view.input.value).toBe('1.')
    expect(view.input.selectionStart).toBe(1)
    view.input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp', isComposing: true }))
    view.input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '1.' }))
    await settle()
    expect(view.input.value).toBe('10')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('defers a queued veto when composition starts before reconciliation', async () => {
    const view = mount({ value: '10' })
    view.input.focus()
    edit(view.input, '1.', 1)
    view.input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    await settle()
    expect(view.input.value).toBe('1.')
    view.input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '1.' }))
    await settle()
    expect(view.input.value).toBe('10')
  })

  it('ends deferred composition on blur if no compositionend arrives', async () => {
    const onValueChange = vi.fn()
    const view = mount({ value: '10', onValueChange })
    view.input.focus()
    edit(view.input, '1.', 1, true)
    await settle()
    expect(view.input.value).toBe('1.')
    view.input.blur()
    await settle()
    expect(view.input.value).toBe('10')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('keeps accepted composition and processes the final input only once', async () => {
    let view: ReturnType<typeof mount>
    const onValueChange = vi.fn(({ value }: { value: string }) => view.service.setContext({ value }))
    view = mount({ value: '10', onValueChange })
    view.input.focus()
    view.input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    edit(view.input, '1.', 1, true)
    await settle()
    expect(view.input.value).toBe('1.')
    view.input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '1.2' }))
    edit(view.input, '1.2', 1)
    await settle()
    expect(view.input.value).toBe('1.2')
    expect(view.input.selectionStart).toBe(1)
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })

  it('does not overwrite a later formatted blur', async () => {
    const view = mount({ value: '10', formatOptions: { minimumFractionDigits: 2 } })
    view.input.focus()
    edit(view.input, '1.', 1)
    view.input.blur()
    await settle()
    expect(view.input.value).toBe('10.00')
    expect(view.service.state.context.value).toBe('10')
  })

  it('leaves uncontrolled editing and form reset intact', async () => {
    const view = mount({ defaultValue: '10' })
    view.input.focus()
    edit(view.input, '1.', 1)
    await settle()
    expect(view.input.value).toBe('1.')
    expect(view.input.selectionStart).toBe(1)
    view.form.reset()
    await settle()
    expect(view.input.value).toBe('10')
  })

  it('does not write to a replaced input and initializes its replacement from the parent', async () => {
    const view = mount({ value: '10' })
    view.input.focus()
    edit(view.input, '1.', 1)
    const oldInput = view.input
    view.remount()
    await settle()
    expect(oldInput.value).toBe('1.')
    expect(view.input.value).toBe('10')
    view.input.focus()
    edit(view.input, '25')
    await settle()
    expect(view.input.value).toBe('10')
  })

  it('does not write after the machine stops', async () => {
    const view = mount({ value: '10' })
    view.input.focus()
    edit(view.input, '1.', 1)
    view.service.stop()
    await settle()
    expect(view.input.value).toBe('1.')
  })
})
