import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
})

async function setup(context: Partial<UserDefinedContext> = {}) {
  const onValueChange = vi.fn()
  const onInputValueChange = vi.fn()
  const service = machine({ id: 'edit-blur', value: ['Alpha', 'Beta'], inputValue: 'Pending', onValueChange, onInputValueChange, ...context })
  const api = () => connect(service.getState(), service.send, normalize)
  services.push(service)
  const root = document.createElement('div')
  root.id = 'dynamic:edit-blur'
  const input = document.createElement('input')
  input.id = 'dynamic:edit-blur:input'
  input.value = 'Pending'
  const outside = document.createElement('button')
  const preview = document.createElement('div')
  const item = { index: 0, value: 'Alpha' }
  preview.id = `dynamic:edit-blur:tag:Alpha:0`
  preview.dataset.part = 'item-preview'
  preview.dataset.value = 'Alpha'
  const edit = document.createElement('input')
  edit.id = `${preview.id}:input`
  edit.value = 'Alpha'
  edit.addEventListener('blur', event => api().getItemInputProps(item).onBlur(event))
  edit.addEventListener('keydown', event => api().getItemInputProps(item).onKeyDown(event))
  root.append(input, preview, edit)
  document.body.append(root, outside)
  service.start()
  service.send({ type: 'DOUBLE_CLICK_TAG', id: preview.id })
  // Happy DOM does not focus an input on select(); focus this fixture explicitly.
  edit.focus()
  expect(document.activeElement).toBe(edit)
  expect(service.state.value).toBe('editing:tag')
  onValueChange.mockClear()
  onInputValueChange.mockClear()
  return { service, api, input, edit, outside, onValueChange, onInputValueChange }
}

describe('dynamic edit blur destinations', () => {
  it('returns to its entry input without adding the pending draft', async () => {
    const { service, api, input, edit, onValueChange, onInputValueChange } = await setup({ blurBehavior: 'add' })
    service.send({ type: 'TAG_INPUT_TYPE', value: 'Uncommitted edit' })
    edit.dispatchEvent(new FocusEvent('blur', { relatedTarget: input }))
    expect(service.state.value).toBe('navigating:tag')
    expect(api().value).toEqual(['Alpha', 'Beta'])
    expect(service.state.context.inputValue).toBe('Pending')
    expect(service.state.context.editedTagId).toBeNull()
    expect(service.state.context.editedTagValue).toBe('')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onInputValueChange).not.toHaveBeenCalled()
  })

  it('keeps a pending draft when returning internally with clear-on-blur', async () => {
    const { service, input, edit, onInputValueChange } = await setup({ blurBehavior: 'clear' })
    edit.dispatchEvent(new FocusEvent('blur', { relatedTarget: input }))
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(service.state.value).toBe('navigating:tag')
    expect(service.state.context.inputValue).toBe('Pending')
    expect(input.value).toBe('Pending')
    expect(onInputValueChange).not.toHaveBeenCalled()
  })

  it('preserves external add-on-blur and discards the uncommitted item edit', async () => {
    const { service, api, edit, outside, onValueChange } = await setup({ blurBehavior: 'add' })
    service.send({ type: 'TAG_INPUT_TYPE', value: 'Uncommitted edit' })
    edit.dispatchEvent(new FocusEvent('blur', { relatedTarget: outside }))
    expect(service.state.value).toBe('idle')
    expect(api().value).toEqual(['Alpha', 'Beta', 'Pending'])
    expect(onValueChange.mock.calls).toEqual([[{ value: ['Alpha', 'Beta', 'Pending'] }]])
    expect(service.state.context.editedTagId).toBeNull()
    expect(service.state.context.editedTagValue).toBe('')
  })

  it('treats a null blur destination as external', async () => {
    const { service, edit, onInputValueChange } = await setup({ blurBehavior: 'clear' })
    edit.dispatchEvent(new FocusEvent('blur', { relatedTarget: null }))
    await vi.waitFor(() => expect(service.state.context.inputValue).toBe(''))
    expect(service.state.value).toBe('idle')
    expect(onInputValueChange.mock.calls).toEqual([[{ inputValue: '' }]])
  })

  it('adds the pending draft after actual editor blur when the entry input was removed', async () => {
    const { service, api, input, edit, onValueChange, onInputValueChange } = await setup({ blurBehavior: 'add' })
    const onBlur = vi.fn()
    edit.addEventListener('blur', onBlur)
    input.remove()
    expect(input.isConnected).toBe(false)
    expect(edit.isConnected).toBe(true)
    expect(document.activeElement).toBe(edit)
    edit.blur()
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(onBlur.mock.calls[0][0].relatedTarget).toBeNull()
    expect(service.state.value).toBe('idle')
    expect(api().value).toEqual(['Alpha', 'Beta', 'Pending'])
    expect(onValueChange.mock.calls).toEqual([[{ value: ['Alpha', 'Beta', 'Pending'] }]])
    expect(service.state.context.editedTagId).toBeNull()
    expect(service.state.context.editedTagValue).toBe('')
    await vi.waitFor(() => expect(service.state.context.inputValue).toBe(''))
    expect(onInputValueChange.mock.calls).toEqual([[{ inputValue: '' }]])
  })

  it('clears the pending draft after actual editor blur when the entry input was removed', async () => {
    const { service, api, input, edit, onValueChange, onInputValueChange } = await setup({ blurBehavior: 'clear' })
    const onBlur = vi.fn()
    edit.addEventListener('blur', onBlur)
    input.remove()
    expect(input.isConnected).toBe(false)
    expect(edit.isConnected).toBe(true)
    expect(document.activeElement).toBe(edit)
    edit.blur()
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(onBlur.mock.calls[0][0].relatedTarget).toBeNull()
    expect(service.state.value).toBe('idle')
    expect(api().value).toEqual(['Alpha', 'Beta'])
    expect(onValueChange).not.toHaveBeenCalled()
    expect(service.state.context.editedTagId).toBeNull()
    expect(service.state.context.editedTagValue).toBe('')
    await vi.waitFor(() => expect(service.state.context.inputValue).toBe(''))
    expect(onInputValueChange.mock.calls).toEqual([[{ inputValue: '' }]])
  })

  it('does not submit cancelled or composing Enter and still accepts the next ordinary Enter', async () => {
    const { service, api, edit, onValueChange } = await setup()
    service.send({ type: 'TAG_INPUT_TYPE', value: 'Accepted' })
    const cancelled = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    cancelled.preventDefault()
    edit.dispatchEvent(cancelled)
    edit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, cancelable: true }))
    expect(service.state.value).toBe('editing:tag')
    expect(api().value).toEqual(['Alpha', 'Beta'])
    expect(onValueChange).not.toHaveBeenCalled()
    const accepted = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    edit.dispatchEvent(accepted)
    expect(accepted.defaultPrevented).toBe(true)
    expect(api().value).toEqual(['Accepted', 'Beta'])
    expect(onValueChange.mock.calls).toEqual([[{ value: ['Accepted', 'Beta'] }]])
  })
})
