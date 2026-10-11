// @vitest-environment happy-dom
import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
const normalize = createNormalizer<PropTypes>(props => props)
type Ownership = 'uncontrolled' | 'accept' | 'veto'

function setup(multiple: boolean, ownership: Ownership, initial = ['a']) {
  const changes = vi.fn()
  let service: ReturnType<typeof machine>
  const context: UserDefinedContext = {
    id: 'toggle-api',
    loopFocus: true,
    orientation: 'horizontal',
    multiple,
    ...(ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }),
    onValueChange(details) {
      changes(details)
      if (ownership === 'accept')
        service.setContext({ value: details.value })
    },
  }
  service = machine(context)
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  return { service, api, changes }
}

afterEach(() => services.splice(0).reverse().forEach(service => service.stop()))

describe('toggleGroup imperative value replacement', () => {
  for (const multiple of [false, true]) {
    for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
      for (const clear of [false, true]) {
        it(`replaces or clears a flat array (multiple=${multiple}, ownership=${ownership}, clear=${clear})`, () => {
          const view = setup(multiple, ownership)
          const requested = clear ? [] : multiple ? ['b', 'c'] : ['b']
          view.api().setValue(requested)
          const accepted = ownership === 'veto' ? ['a'] : requested
          expect(view.changes.mock.calls).toEqual([[{ value: requested }]])
          expect(view.api().value).toEqual(accepted)
          expect(view.api().value.every(value => typeof value === 'string')).toBe(true)
          expect(['a', 'b', 'c'].map(value => view.api().getItemState({ value }).pressed))
            .toEqual(['a', 'b', 'c'].map(value => accepted.includes(value)))
          if (ownership === 'veto') {
            view.service.setContext({ value: requested })
            expect(view.api().value).toEqual(requested)
            expect(view.changes).toHaveBeenCalledTimes(1)
          }
        })
      }
      it(`preserves scalar click toggle semantics (multiple=${multiple}, ownership=${ownership})`, () => {
        const view = setup(multiple, ownership)
        view.service.send({ type: 'TOGGLE.CLICK', value: 'b' })
        const next = multiple ? ['a', 'b'] : ['b']
        expect(view.changes.mock.calls).toEqual([[{ value: next }]])
        expect(view.api().value).toEqual(ownership === 'veto' ? ['a'] : next)
      })
    }
    it(`equal arrays do not toggle selection or emit another request (multiple=${multiple})`, () => {
      const view = setup(multiple, 'uncontrolled')
      view.api().setValue(['a'])
      expect(view.api().value).toEqual(['a'])
      expect(view.changes).not.toHaveBeenCalled()
    })
    it(`repeated controlled veto stays flat until a parent accepts (multiple=${multiple})`, () => {
      const view = setup(multiple, 'veto')
      view.api().setValue(['b'])
      view.api().setValue(['b'])
      expect(view.changes.mock.calls).toEqual([[{ value: ['b'] }], [{ value: ['b'] }]])
      expect(view.api().value).toEqual(['a'])
      view.service.setContext({ value: ['b'] })
      view.api().setValue(['b'])
      expect(view.changes).toHaveBeenCalledTimes(2)
      expect(view.api().value).toEqual(['b'])
    })
  }
  it('does not mutate the caller array when later clicks toggle a member', () => {
    const view = setup(true, 'uncontrolled', [])
    const requested = ['a', 'b']
    view.api().setValue(requested)
    view.service.send({ type: 'TOGGLE.CLICK', value: 'a' })
    expect(requested).toEqual(['a', 'b'])
    expect(view.api().value).toEqual(['b'])
    expect(view.changes.mock.calls).toEqual([[{ value: ['a', 'b'] }], [{ value: ['b'] }]])
  })
  it('keeps the accepted selection separate from mutation of a callback payload', () => {
    const view = setup(true, 'uncontrolled', [])
    view.api().setValue(['a', 'b'])
    view.changes.mock.calls[0][0].value.push('c')
    expect(view.api().value).toEqual(['a', 'b'])
  })
  it('preserves the shared named-action override for imperative and click events', () => {
    const view = setup(false, 'uncontrolled')
    const events: string[] = []
    view.service.setOptions({ actions: {
      setValue(_ctx, event) {
        events.push(event.type)
      },
    } })
    view.api().setValue(['b'])
    view.service.send({ type: 'TOGGLE.CLICK', value: 'b' })
    expect(events).toEqual(['VALUE.SET', 'TOGGLE.CLICK'])
    expect(view.api().value).toEqual(['a'])
    expect(view.changes).not.toHaveBeenCalled()
  })
})
