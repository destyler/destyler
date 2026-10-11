import { afterEach, vi } from 'vitest'
import { parseColor } from '../shareds/color'
import { createNormalizer } from '../types'
import { connect as checkboxConnect } from './checkbox/src/connect'
import { machine as checkboxMachine } from './checkbox/src/machine'
import { connect as colorPickerConnect } from './color-picker/src/connect'
import { machine as colorPickerMachine } from './color-picker/src/machine'
import { connect as dynamicConnect } from './dynamic/src/connect'
import { machine as dynamicMachine } from './dynamic/src/machine'
import { connect as numberInputConnect } from './number-input/src/connect'
import { machine as numberInputMachine } from './number-input/src/machine'
import { connect as radioConnect } from './radio/src/connect'
import { machine as radioMachine } from './radio/src/machine'
import { collection } from './select/src/collection'
import { connect as selectConnect } from './select/src/connect'
import { machine as selectMachine } from './select/src/machine'
import { connect as sliderConnect } from './slider/src/connect'
import { machine as sliderMachine } from './slider/src/machine'
import { connect as switchConnect } from './switch/src/connect'
import { machine as switchMachine } from './switch/src/machine'

type Ownership = 'uncontrolled' | 'accept' | 'veto'
interface ResetDefinition {
  name: string
  make: (...args: any[]) => any
  connect: (...args: any[]) => any
  initial: () => any
  current: () => any
  key: 'value' | 'checked'
}

export const resetDefinitions: ResetDefinition[] = [
  { name: 'checkbox', make: checkboxMachine, connect: checkboxConnect, initial: () => true, current: () => false, key: 'checked' },
  { name: 'color-picker', make: colorPickerMachine, connect: colorPickerConnect, initial: () => parseColor('#FF0000'), current: () => parseColor('#0000FF'), key: 'value' },
  { name: 'dynamic', make: dynamicMachine, connect: dynamicConnect, initial: () => ['a'], current: () => ['b'], key: 'value' },
  { name: 'number-input', make: numberInputMachine, connect: numberInputConnect, initial: () => '10', current: () => '25', key: 'value' },
  { name: 'radio', make: radioMachine, connect: radioConnect, initial: () => 'a', current: () => 'b', key: 'value' },
  { name: 'select', make: selectMachine, connect: selectConnect, initial: () => ['a'], current: () => ['b'], key: 'value' },
  { name: 'slider', make: sliderMachine, connect: sliderConnect, initial: () => [10], current: () => [25], key: 'value' },
  { name: 'switch', make: switchMachine, connect: switchConnect, initial: () => true, current: () => false, key: 'checked' },
]

const normalize = createNormalizer<any>(props => props)
const cleanups: VoidFunction[] = []
export const nextResetTask = () => new Promise<void>(resolve => window.setTimeout(resolve, 0))

afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

// This fixture mounts the real connector's form controls and real machine
// activities. It covers reset notification/value ownership, not adapter renders.
export async function mountReset(definition: ResetDefinition, ownership: Ownership = 'uncontrolled') {
  const { name, key } = definition
  const initialValue = definition.initial()
  const currentValue = definition.current()
  const initialKey = ownership === 'uncontrolled' && name !== 'dynamic'
    ? (key === 'checked' ? 'defaultChecked' : 'defaultValue')
    : key
  let service: ReturnType<ResetDefinition['make']>
  const changes = vi.fn((details) => {
    if (ownership === 'accept')
      service.setContext({ [key]: details[key] })
  })
  service = definition.make({
    id: `reset-${name}`,
    name: 'value',
    [initialKey]: initialValue,
    [key === 'checked' ? 'onCheckedChange' : 'onValueChange']: changes,
    ...(name === 'select' ? { collection: collection({ items: ['a', 'b'] }) } : {}),
  })
  const api = () => definition.connect(service.getState(), service.send, normalize)
  const container = document.createElement('div')
  const form = document.createElement('form')
  const root = document.createElement('div')
  root.id = api().getRootProps().id
  form.append(root)
  container.append(form)
  document.body.append(container)
  cleanups.push(() => {
    service.stop()
    container.remove()
  })

  const appendInput = (props: any) => {
    const input = document.createElement('input')
    input.id = props.id
    input.type = props.type ?? 'text'
    input.name = props.name ?? 'value'
    if (props.value !== undefined)
      input.value = props.value
    if (props.defaultValue !== undefined)
      input.defaultValue = props.defaultValue
    if (props.defaultChecked !== undefined)
      input.defaultChecked = props.defaultChecked
    if (props['data-ownedby'])
      input.setAttribute('data-ownedby', props['data-ownedby'])
    root.append(input)
  }
  if (name === 'radio') {
    for (const value of ['a', 'b'])
      appendInput(api().getItemHiddenInputProps({ value }))
  }
  else if (name === 'select') {
    const props = api().getHiddenSelectProps()
    const select = document.createElement('select')
    select.id = props.id
    select.name = props.name
    for (const value of ['a', 'b']) {
      const option = document.createElement('option')
      option.value = value
      option.defaultSelected = value === 'a'
      select.append(option)
    }
    root.append(select)
  }
  else if (name === 'number-input') {
    appendInput(api().getInputProps())
  }
  else if (name === 'slider') {
    appendInput(api().getHiddenInputProps({ index: 0 }))
  }
  else {
    appendInput(api().getHiddenInputProps())
  }

  const resetButton = document.createElement('button')
  resetButton.type = 'reset'
  resetButton.textContent = `Reset ${name}`
  form.append(resetButton)
  service.start()
  service.setContext({ [key]: currentValue })
  // Drain pre-reset synchronization independently of the reset timer contract.
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  await nextResetTask()
  changes.mockClear()

  const snapshot = (value: any) => name === 'color-picker' ? value.toString('hex') : value
  return {
    name,
    container,
    form,
    resetButton,
    service,
    changes,
    read: () => snapshot(service.state.context[key]),
    proposed: () => changes.mock.calls.map(([details]) => snapshot(details[key])),
    initial: snapshot(initialValue),
    current: snapshot(currentValue),
    submitted: () => Array.from(new FormData(form).entries()),
  }
}
