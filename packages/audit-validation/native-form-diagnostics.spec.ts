// Validation-only: normative baseline diagnostics, intentionally expected to fail.
// No production behavior change. Do not merge this diagnostic branch.
import { afterEach, expect, it, vi } from 'vitest'
import { connect as checkboxConnect } from '../components/checkbox/src/connect'
import { machine as checkboxMachine } from '../components/checkbox/src/machine'
import { connect as radioConnect } from '../components/radio/src/connect'
import { machine as radioMachine } from '../components/radio/src/machine'
import { connect as switchConnect } from '../components/switch/src/connect'
import { machine as switchMachine } from '../components/switch/src/machine'
import { trackFormControl } from '../shareds/dom/src/form'
import { createNormalizer } from '../types/index'

const normalize = createNormalizer<any>(props => props)
const cleanups: Array<() => void> = []
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))
afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
})
function mountToggle(kind: 'checkbox' | 'switch', context: any = {}) {
  const make: any = kind === 'checkbox' ? checkboxMachine : switchMachine
  const connect: any = kind === 'checkbox' ? checkboxConnect : switchConnect
  const service = make({ id: `probe-${kind}`, name: 'flag', ...context })
  const form = document.createElement('form')
  const root = document.createElement('label')
  const input = document.createElement('input')
  const api = () => connect(service.getState(), service.send, normalize)
  const rp = api().getRootProps()
  root.id = rp.id
  root.htmlFor = rp.htmlFor
  root.addEventListener('click', rp.onClick)
  const ip = api().getHiddenInputProps()
  Object.assign(input, { id: ip.id, type: ip.type, name: ip.name, value: ip.value, defaultChecked: ip.defaultChecked, disabled: !!ip.disabled })
  input.addEventListener('click', ip.onClick)
  root.append(input)
  form.append(root)
  document.body.append(form)
  service.start()
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { service, form, input, api }
}
function mountRadio(context: any = {}) {
  const service = radioMachine({ id: 'probe-radio', name: 'choice', ...context })
  const form = document.createElement('form')
  const root = document.createElement('div')
  const api = () => radioConnect(service.getState(), service.send, normalize)
  root.id = api().getRootProps().id
  const inputs = ['a', 'b'].map((value) => {
    const input = document.createElement('input')
    const p = api().getItemHiddenInputProps({ value })
    Object.assign(input, { id: p.id, type: p.type, name: p.name, value: p.value, defaultChecked: p.defaultChecked, disabled: !!p.disabled })
    input.setAttribute('data-ownedby', p['data-ownedby'])
    input.addEventListener('click', p.onClick)
    root.append(input)
    return input
  })
  form.append(root)
  document.body.append(form)
  service.start()
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { service, form, inputs, api }
}
it.each(['checkbox', 'switch'] as const)('%s keeps native/form state at the accepted value after a controlled veto', async (kind) => {
  const onCheckedChange = vi.fn()
  const { service, form, input } = mountToggle(kind, { checked: false, onCheckedChange })
  input.click()
  await settle()
  expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith({ checked: true })
  expect(service.state.context.checked).toBe(false)
  expect({ checked: input.checked, submitted: new FormData(form).get('flag') }).toEqual({ checked: false, submitted: null })
})
it.each(['checkbox', 'switch'] as const)('%s accepts an uncontrolled native click', async (kind) => {
  const { service, input, form } = mountToggle(kind)
  input.click()
  await settle()
  expect(service.state.context.checked).toBe(true)
  expect(input.checked).toBe(true)
  expect(new FormData(form).get('flag')).toBe('on')
})
it('radio keeps native/form selection at the accepted value after a controlled veto', async () => {
  const onValueChange = vi.fn()
  const { service, form, inputs } = mountRadio({ value: 'a', onValueChange })
  inputs[1].click()
  await settle()
  expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  expect(service.state.context.value).toBe('a')
  expect({ checked: inputs.map(input => input.checked), submitted: new FormData(form).get('choice') }).toEqual({ checked: [true, false], submitted: 'a' })
})
it('radio accepts an uncontrolled native click', async () => {
  const { service, inputs, form } = mountRadio({ defaultValue: 'a' })
  inputs[1].click()
  await settle()
  expect(service.state.context.value).toBe('b')
  expect(inputs.map(input => input.checked)).toEqual([false, true])
  expect(new FormData(form).get('choice')).toBe('b')
})
it('checkbox initializes the native indeterminate property from its default', () => {
  const { service, input } = mountToggle('checkbox', { defaultChecked: 'indeterminate' })
  expect(service.state.context.checked).toBe('indeterminate')
  expect(input.indeterminate).toBe(true)
  expect(input.checked).toBe(false)
})
it('checkbox API preserves indeterminate rather than feeding its synthetic click back as false', async () => {
  const onCheckedChange = vi.fn()
  const { service, input, api } = mountToggle('checkbox', { onCheckedChange })
  api().setChecked('indeterminate')
  await settle()
  expect(service.state.context.checked).toBe('indeterminate')
  expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith({ checked: 'indeterminate' })
  expect(input.indeterminate).toBe(true)
})
it('checkbox reset-event callback requests its original indeterminate state', async () => {
  const onCheckedChange = vi.fn()
  const { service, form } = mountToggle('checkbox', { defaultChecked: 'indeterminate', onCheckedChange })
  service.setContext({ checked: false })
  await settle()
  onCheckedChange.mockClear()
  form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))
  await settle()
  expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith({ checked: 'indeterminate' })
  expect(service.state.context.checked).toBe('indeterminate')
})

it.each(['checkbox', 'switch'] as const)('%s accepts a synchronous controlled parent update', async (kind) => {
  let mounted: ReturnType<typeof mountToggle>
  const onCheckedChange = vi.fn(({ checked }) => mounted.service.setContext({ checked }))
  mounted = mountToggle(kind, { checked: false, onCheckedChange })
  mounted.input.click()
  await settle()
  expect(mounted.service.state.context.checked).toBe(true)
  expect(mounted.input.checked).toBe(true)
  expect(onCheckedChange).toHaveBeenCalledTimes(1)
})
it('radio accepts a synchronous controlled parent update', async () => {
  let mounted: ReturnType<typeof mountRadio>
  const onValueChange = vi.fn(({ value }) => mounted.service.setContext({ value }))
  mounted = mountRadio({ value: 'a', onValueChange })
  mounted.inputs[1].click()
  await settle()
  expect(mounted.service.state.context.value).toBe('b')
  expect(mounted.inputs.map(input => input.checked)).toEqual([false, true])
  expect(onValueChange).toHaveBeenCalledTimes(1)
})

it('platform: executes in actual Chromium', () => {
  console.warn('NATIVE_FORM_PLATFORM', navigator.userAgent)
  expect(navigator.userAgent).toMatch(/(?:HeadlessChrome|Chrome)\/\d+/)
})
it('platform: generic Event is explicitly untrusted', () => {
  expect(new Event('click').isTrusted).toBe(false)
})
function platformForm(html = '<input type="checkbox">') {
  const form = document.createElement('form')
  form.innerHTML = html
  document.body.append(form)
  cleanups.push(() => form.remove())
  return { form, input: form.querySelector('input')! }
}
it('platform: canceled native reset leaves checkedness unchanged', () => {
  const { form, input } = platformForm()
  input.checked = true
  form.addEventListener('reset', event => event.preventDefault())
  form.reset()
  expect(input.checked).toBe(true)
})
it('platform: native reset event precedes the reset default action', () => {
  const { form, input } = platformForm()
  input.checked = true
  let during: boolean | undefined
  form.addEventListener('reset', () => {
    during = input.checked
  })
  form.reset()
  expect({ during, after: input.checked }).toEqual({ during: true, after: false })
})
it('platform: inherited disabled controls do not contribute successful values', () => {
  const { form, input } = platformForm('<fieldset disabled><input type="checkbox" name="flag" value="on" checked></fieldset>')
  expect(input.matches(':disabled')).toBe(true)
  expect(new FormData(form).has('flag')).toBe(false)
})
it('platform: the first legend exempts its controls from its disabled fieldset', () => {
  const { form, input } = platformForm('<fieldset disabled><legend><input type="checkbox" name="flag" value="on" checked></legend></fieldset>')
  expect(input.matches(':disabled')).toBe(false)
  expect(new FormData(form).get('flag')).toBe('on')
})
it('checkbox native form.reset restores its original indeterminate state', async () => {
  const onCheckedChange = vi.fn()
  const { service, form, input } = mountToggle('checkbox', { defaultChecked: 'indeterminate', onCheckedChange })
  service.setContext({ checked: false })
  await settle()
  onCheckedChange.mockClear()
  form.reset()
  await settle()
  expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith({ checked: 'indeterminate' })
  expect({ model: service.state.context.checked, checked: input.checked, indeterminate: input.indeterminate, submitted: new FormData(form).get('flag') })
    .toEqual({ model: 'indeterminate', checked: false, indeterminate: true, submitted: null })
})
it.each([true, false])('control: checkbox native reset restores the boolean default %s', async (initial) => {
  const { service, form, input, api } = mountToggle('checkbox', { defaultChecked: initial })
  api().setChecked(!initial)
  await settle()
  form.reset()
  await settle()
  expect(service.state.context.checked).toBe(initial)
  expect(input.checked).toBe(initial)
})
function track(input: HTMLInputElement) {
  const onFormReset = vi.fn()
  const onFieldsetDisabledChange = vi.fn()
  const stop = trackFormControl(input, { onFormReset, onFieldsetDisabledChange })
  if (stop)
    cleanups.push(stop)
  return { onFormReset, onFieldsetDisabledChange }
}
it('form helper respects a later listener canceling native reset', async () => {
  const { form, input } = platformForm()
  input.checked = true
  const { onFormReset } = track(input)
  form.addEventListener('reset', event => event.preventDefault())
  form.reset()
  await settle()
  expect(input.checked).toBe(true)
  expect(onFormReset).not.toHaveBeenCalled()
})
it('form helper respects an ancestor canceling native reset during bubbling', async () => {
  const { form, input } = platformForm()
  input.checked = true
  const { onFormReset } = track(input)
  const cancel = (event: Event) => event.preventDefault()
  document.body.addEventListener('reset', cancel)
  cleanups.push(() => document.body.removeEventListener('reset', cancel))
  form.reset()
  await settle()
  expect(input.checked).toBe(true)
  expect(onFormReset).not.toHaveBeenCalled()
})
it('fieldset tracking agrees with the native first-legend exemption', () => {
  const { input } = platformForm('<fieldset disabled><legend><input type="checkbox"></legend></fieldset>')
  const { onFieldsetDisabledChange } = track(input)
  expect(input.matches(':disabled')).toBe(false)
  expect(onFieldsetDisabledChange).toHaveBeenLastCalledWith(false)
})
it('fieldset tracking includes a disabled outer ancestor', () => {
  const { input } = platformForm('<fieldset disabled><fieldset><input type="checkbox"></fieldset></fieldset>')
  const { onFieldsetDisabledChange } = track(input)
  expect(input.matches(':disabled')).toBe(true)
  expect(onFieldsetDisabledChange).toHaveBeenLastCalledWith(true)
})
it('fieldset tracking observes changes to an outer ancestor', async () => {
  const { form, input } = platformForm('<fieldset><fieldset><input type="checkbox"></fieldset></fieldset>')
  const { onFieldsetDisabledChange } = track(input)
  expect(onFieldsetDisabledChange).toHaveBeenLastCalledWith(false)
  form.querySelector('fieldset')!.disabled = true
  await settle()
  expect(input.matches(':disabled')).toBe(true)
  expect(onFieldsetDisabledChange).toHaveBeenLastCalledWith(true)
})
