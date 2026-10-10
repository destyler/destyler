import type { PropTypes } from '@destyler/types'
import type { CheckedChangeDetails, CheckedState } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface NativeInputProps {
  id: string
  type: string
  name: string
  value: string
  defaultChecked: boolean
  onClick: EventListener
}
type NativeProps = Omit<PropTypes, 'input'> & { input: NativeInputProps }
type Ownership = 'uncontrolled' | 'accept' | 'veto'

const normalize = createNormalizer<NativeProps>(props => props)
const cleanups: Array<() => void> = []
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))
const values: CheckedState[] = [false, true, 'indeterminate']

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
})

function mount(initial: CheckedState, mode: Ownership, readOnly = false) {
  let service: ReturnType<typeof machine>
  const changes = vi.fn(({ checked }: CheckedChangeDetails) => {
    if (mode === 'accept')
      service.setContext({ checked })
  })
  service = machine({
    id: 'tristate-events',
    name: 'flag',
    ...(mode === 'uncontrolled' ? { defaultChecked: initial } : { checked: initial }),
    onCheckedChange: changes,
    readOnly,
  })
  const form = document.createElement('form')
  const input = document.createElement('input')
  const api = () => connect(service.getState(), service.send, normalize)
  const props = api().getHiddenInputProps()
  Object.assign(input, {
    id: props.id,
    type: props.type,
    name: props.name,
    value: props.value,
    defaultChecked: props.defaultChecked,
  })
  // API/reset contract only: pre-synchronize the mounted input explicitly.
  // This fixture does not claim initialization or adapter mount-order coverage.
  input.indeterminate = initial === 'indeterminate'
  input.addEventListener('click', props.onClick)
  form.append(input)
  document.body.append(form)
  service.start()
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { service, input, form, api, changes }
}

function native(input: HTMLInputElement, form: HTMLFormElement) {
  return {
    checked: input.checked,
    indeterminate: input.indeterminate,
    submitted: new FormData(form).get('flag'),
  }
}

function expected(checked: CheckedState) {
  return {
    checked: checked === true,
    indeterminate: checked === 'indeterminate',
    submitted: checked === true ? 'on' : null,
  }
}

for (const mode of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const initial of values) {
    for (const proposed of values) {
      it(`${mode}: API ${initial} to ${proposed} preserves accepted tri-state and a single proposal`, async () => {
        const { service, input, form, api, changes } = mount(initial, mode)
        const clicks = vi.fn()
        input.addEventListener('click', clicks)
        api().setChecked(proposed)
        await settle()
        const accepted = mode === 'veto' ? initial : proposed
        expect(service.state.context.checked).toBe(accepted)
        expect(native(input, form)).toEqual(expected(accepted))
        expect(changes.mock.calls).toEqual(initial === proposed ? [] : [[{ checked: proposed }]])
        expect(clicks).toHaveBeenCalledTimes(1)
      })
    }
  }
}

for (const reset of ['event', 'native'] as const) {
  function resetForm(form: HTMLFormElement) {
    if (reset === 'native')
      form.reset()
    else
      form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))
  }

  for (const initial of values) {
    it(`uncontrolled ${reset} reset restores exact ${initial}`, async () => {
      const { service, input, form, api, changes } = mount(initial, 'uncontrolled')
      api().setChecked(initial === false)
      await settle()
      changes.mockClear()
      resetForm(form)
      await settle()
      expect(service.state.context.checked).toBe(initial)
      expect(native(input, form)).toEqual(expected(initial))
      expect(changes.mock.calls).toEqual([[{ checked: initial }]])
    })

    it(`controlled ${reset} reset proposes exact ${initial}, preserving veto and later acceptance`, async () => {
      const { service, input, form, changes } = mount(initial, 'veto')
      const current = initial === false
      service.setContext({ checked: current })
      await settle()
      resetForm(form)
      await settle()
      expect(changes.mock.calls).toEqual([[{ checked: initial }]])
      expect(service.state.context.checked).toBe(current)
      expect(native(input, form)).toEqual(expected(current))
      service.setContext({ checked: initial })
      await settle()
      expect(service.state.context.checked).toBe(initial)
      expect(native(input, form)).toEqual(expected(initial))
      expect(changes).toHaveBeenCalledTimes(1)
    })
  }
}

it('native activation clears indeterminate before the connector proposes true', async () => {
  const { service, input, form, changes } = mount('indeterminate', 'uncontrolled')
  input.click()
  await settle()
  expect(service.state.context.checked).toBe(true)
  expect(native(input, form)).toEqual(expected(true))
  expect(changes.mock.calls).toEqual([[{ checked: true }]])
})

it.each(values)('readOnly native activation preserves accepted %s without a proposal', async (initial) => {
  const { service, input, form, changes } = mount(initial, 'uncontrolled', true)
  input.click()
  await settle()
  expect(service.state.context.checked).toBe(initial)
  expect(native(input, form)).toEqual(expected(initial))
  expect(changes).not.toHaveBeenCalled()
})
