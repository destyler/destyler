import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const services: ReturnType<typeof machine>[] = []
afterEach(() => services.splice(0).forEach(service => service.stop()))

function setup(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'item-state', count: 3, defaultStep: 1, ...context }).start()
  services.push(service)
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

const stateAttrs = ['data-complete', 'data-current', 'data-incomplete'] as const
function expectedAttrs(index: number, step: number) {
  return {
    'data-complete': index < step ? '' : undefined,
    'data-current': index === step ? '' : undefined,
    'data-incomplete': index > step ? '' : undefined,
  }
}

describe('steps item state attributes', () => {
  it.each([0, 1, 2])('publishes exactly the derived state for item %i', (index) => {
    const { api } = setup()
    const props = api().getItemProps({ index })
    expect(props).toMatchObject(expectedAttrs(index, 1))
    expect(stateAttrs.filter(attr => props[attr] === '')).toHaveLength(1)
    expect(props['aria-current']).toBe(index === 1 ? 'step' : undefined)
  })

  it('uses the same state predicates as the existing indicator and separator controls', () => {
    const { api } = setup()
    for (const index of [0, 1, 2]) {
      expect(api().getIndicatorProps({ index })).toMatchObject(expectedAttrs(index, 1))
      expect(api().getSeparatorProps({ index })).toMatchObject(expectedAttrs(index, 1))
    }
  })

  it('keeps accepted controlled state until a delayed parent update without callback echo', () => {
    const onStepChange = vi.fn()
    const { service, api } = setup({ defaultStep: undefined, step: 0, onStepChange })
    api().setStep(2)
    expect(onStepChange).toHaveBeenCalledExactlyOnceWith({ step: 2 })
    expect(api().getItemProps({ index: 0 })).toMatchObject(expectedAttrs(0, 0))
    expect(api().getItemProps({ index: 2 })).toMatchObject(expectedAttrs(2, 0))
    service.setContext({ step: 2 })
    for (const index of [0, 1, 2])
      expect(api().getItemProps({ index })).toMatchObject(expectedAttrs(index, 2))
    expect(onStepChange).toHaveBeenCalledTimes(1)
  })

  it('updates item attributes through next, previous, completion, and reset', () => {
    const { api } = setup({ defaultStep: 0 })
    for (const step of [1, 2, 3]) {
      api().goToNextStep()
      for (const index of [0, 1, 2])
        expect(api().getItemProps({ index })).toMatchObject(expectedAttrs(index, step))
    }
    api().goToPrevStep()
    expect(api().getItemProps({ index: 2 })).toMatchObject(expectedAttrs(2, 2))
    api().resetStep()
    expect(api().getItemProps({ index: 0 })).toMatchObject(expectedAttrs(0, 0))
    expect(api().getItemProps({ index: 2 })).toMatchObject(expectedAttrs(2, 0))
  })

  it('passes state attributes through element normalization without mutating caller props', () => {
    const { service } = setup()
    const element = vi.fn(value => value)
    const api = connect(service.getState(), service.send, { ...normalize, element })
    const input = Object.freeze({ index: 1 })
    const props = api.getItemProps(input)
    expect(element).toHaveBeenCalledExactlyOnceWith(expect.objectContaining(expectedAttrs(1, 1)))
    expect(input).toEqual({ index: 1 })
    expect(Reflect.ownKeys(input)).toEqual(['index'])
    expect(props['data-current']).toBe('')
    expect(service.getState().context.step).toBe(1)
  })

  it('retains anatomy, direction, orientation, and existing accessibility metadata', () => {
    const { api } = setup({ dir: 'rtl', orientation: 'vertical' })
    expect(api().getItemProps({ index: 1 })).toMatchObject({
      'data-scope': 'steps',
      'data-part': 'item',
      'data-orientation': 'vertical',
      'dir': 'rtl',
      'aria-current': 'step',
    })
  })
})
