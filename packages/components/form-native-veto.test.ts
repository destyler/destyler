// @vitest-environment happy-dom
import type { PropTypes } from '../types'
import type { CheckedChangeDetails, CheckedState } from './checkbox/src/types'
import type { ValueChangeDetails } from './radio/src/types'
import { afterEach, expect, it, vi } from 'vitest'
import { createNormalizer } from '../types'
import { connect as checkboxConnect } from './checkbox/src/connect'
import { machine as checkboxMachine } from './checkbox/src/machine'
import { connect as radioConnect } from './radio/src/connect'
import { machine as radioMachine } from './radio/src/machine'
import { connect as switchConnect } from './switch/src/connect'
import { machine as switchMachine } from './switch/src/machine'

interface RootProps {
  id: string
  htmlFor?: string
  onClick?: EventListener
}
interface InputProps {
  'id': string
  'type': string
  'name': string
  'value': string
  'defaultChecked': boolean
  'disabled'?: boolean
  'data-ownedby'?: string
  'onClick': EventListener
}
type NativeProps = Omit<PropTypes, 'label' | 'input' | 'element'> & {
  label: RootProps
  element: RootProps
  input: InputProps
}
type Ownership = 'uncontrolled' | 'accept' | 'veto'
type Halt = 'none' | 'stop' | 'restart'

const normalize = createNormalizer<NativeProps>(props => props)
const cleanups: Array<() => void> = []
export const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
})

function inputFrom(props: InputProps) {
  const input = document.createElement('input')
  Object.assign(input, {
    id: props.id,
    type: props.type,
    name: props.name,
    value: props.value,
    defaultChecked: props.defaultChecked,
    disabled: !!props.disabled,
  })
  if (props['data-ownedby'])
    input.setAttribute('data-ownedby', props['data-ownedby'])
  input.addEventListener('click', props.onClick)
  return input
}

export function mountToggle(kind: 'checkbox' | 'switch', initial: CheckedState, ownership: Ownership, halt: Halt = 'none') {
  const changes = vi.fn<(details: CheckedChangeDetails) => void>()
  const syncEvents: string[] = []
  let access: {
    start: () => unknown
    stop: () => unknown
    read: () => CheckedState | undefined
    accept: (value: CheckedState) => void
    props: () => { root: RootProps, input: InputProps }
  }
  const onCheckedChange = (details: CheckedChangeDetails) => {
    changes(details)
    if (ownership === 'accept')
      access.accept(details.checked)
    if (halt !== 'none')
      access.stop()
    if (halt === 'restart')
      access.start()
  }
  if (kind === 'checkbox') {
    const service = checkboxMachine({
      id: 'native-veto-checkbox',
      name: 'flag',
      ...(ownership === 'uncontrolled' ? { defaultChecked: initial } : { checked: initial }),
      onCheckedChange,
    })
    if (halt !== 'none') {
      const synchronize = service.options.actions?.syncInputElement
      if (!synchronize)
        throw new Error('Missing default synchronization action')
      service.setOptions({
        actions: {
          syncInputElement(ctx, event, meta) {
            syncEvents.push(event.type)
            synchronize(ctx, event, meta)
          },
        },
      })
    }
    access = {
      start: () => service.start(),
      stop: () => service.stop(),
      read: () => service.state.context.checked,
      accept: checked => service.setContext({ checked }),
      props: () => {
        const api = checkboxConnect(service.getState(), service.send, normalize)
        return { root: api.getRootProps(), input: api.getHiddenInputProps() }
      },
    }
  }
  else {
    if (typeof initial !== 'boolean')
      throw new TypeError('Switch fixtures require a boolean initial state')
    const service = switchMachine({
      id: 'native-veto-switch',
      name: 'flag',
      ...(ownership === 'uncontrolled' ? { defaultChecked: initial } : { checked: initial }),
      onCheckedChange,
    })
    if (halt !== 'none') {
      const synchronize = service.options.actions?.syncInputElement
      if (!synchronize)
        throw new Error('Missing default synchronization action')
      service.setOptions({
        actions: {
          syncInputElement(ctx, event, meta) {
            syncEvents.push(event.type)
            synchronize(ctx, event, meta)
          },
        },
      })
    }
    access = {
      start: () => service.start(),
      stop: () => service.stop(),
      read: () => service.state.context.checked,
      accept: (checked) => {
        if (typeof checked !== 'boolean')
          throw new TypeError('Switch fixtures require boolean parent values')
        service.setContext({ checked })
      },
      props: () => {
        const api = switchConnect(service.getState(), service.send, normalize)
        return { root: api.getRootProps(), input: api.getHiddenInputProps() }
      },
    }
  }
  const props = access.props()
  const form = document.createElement('form')
  const root = document.createElement('label')
  root.id = props.root.id
  root.htmlFor = props.root.htmlFor ?? ''
  if (props.root.onClick)
    root.addEventListener('click', props.root.onClick)
  const input = inputFrom(props.input)
  // Mounted-state contract only; initialization timing is a separate finding.
  input.indeterminate = initial === 'indeterminate'
  root.append(input)
  form.append(root)
  document.body.append(form)
  access.start()
  cleanups.push(() => {
    access.stop()
    form.remove()
  })
  return { form, root, input, changes, syncEvents, read: access.read, accept: access.accept }
}

export function mountRadio(initial: string | null, ownership: Ownership, halt: Halt = 'none', disabledValues: string[] = []) {
  const changes = vi.fn<(details: ValueChangeDetails) => void>()
  const syncEvents: string[] = []
  const service = radioMachine({
    id: 'native-veto-radio',
    name: 'choice',
    ...(ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }),
    onValueChange(details) {
      changes(details)
      if (ownership === 'accept')
        service.setContext({ value: details.value })
      if (halt !== 'none')
        service.stop()
      if (halt === 'restart')
        service.start()
    },
  })
  if (halt !== 'none') {
    const synchronize = service.options.actions?.syncInputElements
    if (!synchronize)
      throw new Error('Missing default synchronization action')
    service.setOptions({
      actions: {
        syncInputElements(ctx, event, meta) {
          syncEvents.push(event.type)
          synchronize(ctx, event, meta)
        },
      },
    })
  }
  const api = () => radioConnect(service.getState(), service.send, normalize)
  const form = document.createElement('form')
  const root = document.createElement('div')
  root.id = api().getRootProps().id
  const inputs = ['a', 'b'].map(value => inputFrom(api().getItemHiddenInputProps({ value, disabled: disabledValues.includes(value) })))
  root.append(...inputs)
  form.append(root)
  document.body.append(form)
  service.start()
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { form, root, inputs, changes, syncEvents, api, read: () => service.state.context.value, accept: (value: string | null) => service.setContext({ value }) }
}

for (const kind of ['checkbox', 'switch'] as const) {
  for (const initial of [false, true]) {
    for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
      it(`${kind}: ${ownership} native toggle from ${initial} serializes only the accepted value`, async () => {
        const view = mountToggle(kind, initial, ownership)
        view.input.click()
        await settle()
        const accepted = ownership === 'veto' ? initial : !initial
        expect(view.changes.mock.calls).toEqual([[{ checked: !initial }]])
        expect(view.read()).toBe(accepted)
        expect({ checked: view.input.checked, submitted: new FormData(view.form).get('flag') })
          .toEqual({ checked: accepted, submitted: accepted ? 'on' : null })
      })
    }
    it(`${kind}: repeated veto from ${initial} can later be accepted without duplicate proposals`, async () => {
      const view = mountToggle(kind, initial, 'veto')
      view.input.click()
      await settle()
      expect(view.input.checked).toBe(initial)
      view.input.click()
      await settle()
      expect(view.changes.mock.calls).toEqual([[{ checked: !initial }], [{ checked: !initial }]])
      view.accept(!initial)
      await settle()
      expect(view.input.checked).toBe(!initial)
      expect(view.changes).toHaveBeenCalledTimes(2)
    })
  }
}

for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  it(`checkbox: ${ownership} indeterminate activation retains the accepted tri-state`, async () => {
    const view = mountToggle('checkbox', 'indeterminate', ownership)
    view.input.click()
    await settle()
    const veto = ownership === 'veto'
    expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
    expect(view.read()).toBe(veto ? 'indeterminate' : true)
    expect({ checked: view.input.checked, indeterminate: view.input.indeterminate, submitted: new FormData(view.form).get('flag') })
      .toEqual({ checked: !veto, indeterminate: veto, submitted: veto ? null : 'on' })
  })
  for (const initial of ['a', 'b', null]) {
    it(`radio: ${ownership} selection from ${initial} serializes only the accepted value`, async () => {
      const view = mountRadio(initial, ownership)
      const proposed = initial === 'a' ? 'b' : 'a'
      view.inputs[proposed === 'a' ? 0 : 1].click()
      await settle()
      const accepted = ownership === 'veto' ? initial : proposed
      expect(view.changes.mock.calls).toEqual([[{ value: proposed }]])
      expect(view.read()).toBe(accepted)
      expect(view.inputs.map(input => input.checked)).toEqual([accepted === 'a', accepted === 'b'])
      expect(new FormData(view.form).get('choice')).toBe(accepted)
    })
  }
}

it('radio restores an accepted disabled item without submitting it', async () => {
  const view = mountRadio('a', 'veto', 'none', ['a'])
  view.inputs[1].click()
  await settle()
  expect(view.changes.mock.calls).toEqual([[{ value: 'b' }]])
  expect(view.read()).toBe('a')
  expect(view.inputs.map(input => input.checked)).toEqual([true, false])
  expect(new FormData(view.form).get('choice')).toBe(null)
})

it('radio synchronization includes a disabled parent value while dispatch and focus stay filtered', async () => {
  const view = mountRadio('a', 'uncontrolled', 'none', ['b'])
  const disabledClick = vi.fn()
  view.inputs[1].addEventListener('click', disabledClick)
  view.api().setValue('b')
  await settle()
  expect(view.read()).toBe('b')
  expect(view.inputs.map(input => input.checked)).toEqual([false, true])
  expect(new FormData(view.form).get('choice')).toBe(null)
  expect(disabledClick).not.toHaveBeenCalled()
  view.api().focus()
  expect(document.activeElement).toBe(view.inputs[0])
})

it('radio keeps disabled dispatch and focus filters unchanged independently of synchronization', async () => {
  const view = mountRadio('a', 'uncontrolled', 'none', ['b'])
  const disabledClick = vi.fn()
  view.inputs[1].addEventListener('click', disabledClick)
  view.api().setValue('b')
  await settle()
  expect(disabledClick).not.toHaveBeenCalled()
  view.api().focus()
  expect(document.activeElement).toBe(view.inputs[0])
})

for (const halt of ['stop', 'restart'] as const) {
  it.each(['checkbox', 'switch'] as const)(`%s abandons old synchronization when a proposal callback requests ${halt}`, async (kind) => {
    const view = mountToggle(kind, false, 'veto', halt)
    view.input.click()
    await settle()
    expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
    expect(view.read()).toBe(false)
    // Observe the ended event's action, allowing any legitimate new-start
    // initialization to evolve independently of this lifecycle regression.
    expect(view.syncEvents).not.toContain('CHECKED.SET')
  })
  it(`radio abandons old synchronization when a proposal callback requests ${halt}`, async () => {
    const view = mountRadio('a', 'veto', halt)
    view.inputs[1].click()
    await settle()
    expect(view.changes.mock.calls).toEqual([[{ value: 'b' }]])
    expect(view.read()).toBe('a')
    expect(view.syncEvents).not.toContain('SET_VALUE')
  })
}
