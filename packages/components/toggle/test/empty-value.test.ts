// @vitest-environment happy-dom
import type { PropTypes } from '@destyler/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

type NativeProps = Omit<PropTypes, 'button'> & { button: {
  'disabled'?: boolean
  'aria-checked'?: boolean
  'aria-pressed'?: boolean
  'data-state': string
  'onClick': (event: MouseEvent) => void
} }
const normalize = createNormalizer<NativeProps>(props => props)
const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

function setup(multiple: boolean, ownership: 'uncontrolled' | 'accept' | 'veto', initial: string[], value = '', disabled = false) {
  const changes = vi.fn()
  const service = machine({
    id: 'empty-toggle',
    multiple,
    ...(ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }),
    onValueChange(details) {
      changes(details)
      if (ownership === 'accept')
        service.setContext({ value: details.value })
    },
  })
  const api = () => connect(service.getState(), service.send, normalize)
  const props = () => api().getItemProps({ value, disabled })
  const button = document.createElement('button')
  button.disabled = !!props().disabled
  button.addEventListener('click', event => props().onClick(event))
  document.body.append(button)
  service.start()
  cleanups.push(() => {
    service.stop()
    button.remove()
  })
  return { service, api, props, button, changes }
}

for (const multiple of [false, true]) {
  for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
    for (const initiallyPressed of [false, true]) {
      it(`toggles an empty-string item without losing other selections (multiple=${multiple}, ownership=${ownership}, pressed=${initiallyPressed})`, () => {
        const initial = multiple ? initiallyPressed ? ['a', ''] : ['a'] : initiallyPressed ? [''] : []
        const view = setup(multiple, ownership, initial)
        view.button.click()
        const next = initiallyPressed ? initial.filter(value => value !== '') : [...initial, '']
        expect(view.changes.mock.calls).toEqual([[{ value: next }]])
        const accepted = ownership === 'veto' ? initial : next
        expect(view.api().value).toEqual(accepted)
        expect(view.api().getItemState({ value: '' }).pressed).toBe(accepted.includes(''))
        expect(view.props()['data-state']).toBe(accepted.includes('') ? 'on' : 'off')
        expect(view.props()[multiple ? 'aria-pressed' : 'aria-checked']).toBe(accepted.includes(''))
        if (ownership === 'veto') {
          view.service.setContext({ value: next })
          expect(view.api().getItemState({ value: '' }).pressed).toBe(!initiallyPressed)
          expect(view.changes).toHaveBeenCalledTimes(1)
        }
      })
    }
    it(`keeps ordinary nonempty click behavior (multiple=${multiple}, ownership=${ownership})`, () => {
      const view = setup(multiple, ownership, [], 'a')
      view.button.click()
      expect(view.changes.mock.calls).toEqual([[{ value: ['a'] }]])
      expect(view.api().value).toEqual(ownership === 'veto' ? [] : ['a'])
    })
  }
  it(`preserves disabled empty-string items (multiple=${multiple})`, () => {
    const view = setup(multiple, 'uncontrolled', [], '', true)
    view.button.click()
    expect(view.changes).not.toHaveBeenCalled()
    expect(view.api().value).toEqual([])
  })
}

it.each([null, undefined])('keeps missing scalar values inert (%s)', (value) => {
  const view = setup(true, 'uncontrolled', ['a'])
  view.service.send({ type: 'TOGGLE.CLICK', value })
  expect(view.api().value).toEqual(['a'])
  expect(view.changes).not.toHaveBeenCalled()
})

for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  it(`replaces an existing single selection with the empty string (ownership=${ownership})`, () => {
    const view = setup(false, ownership, ['a'])
    view.button.click()
    expect(view.changes.mock.calls).toEqual([[{ value: [''] }]])
    expect(view.api().value).toEqual(ownership === 'veto' ? ['a'] : [''])
    expect(view.api().getItemState({ value: 'a' }).pressed).toBe(ownership === 'veto')
    expect(view.api().getItemState({ value: '' }).pressed).toBe(ownership !== 'veto')
  })
}
