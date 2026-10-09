import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { anatomy, connect, machine, props, splitProps } from '../index'

const normalize = createNormalizer(value => value)

describe('steps connector contracts', () => {
  const services: Array<ReturnType<typeof machine>> = []
  afterEach(() => services.splice(0).reverse().forEach(service => service.stop()))

  function start(context: Partial<UserDefinedContext> = {}) {
    const service = machine({ id: 'contract', count: 3, ...context }).start()
    services.push(service)
    return { service, api: () => connect(service.getState(), service.send, normalize) }
  }

  it('normalizes all three trigger kinds as non-submit buttons', () => {
    const { service } = start()
    const button = vi.fn(value => value)
    const api = connect(service.getState(), service.send, { ...normalize, button })
    api.getTriggerProps({ index: 0 })
    api.getNextTriggerProps()
    api.getPrevTriggerProps()
    expect(button).toHaveBeenCalledTimes(3)
    expect(button.mock.calls.map(([value]) => value.type)).toEqual(['button', 'button', 'button'])
  })

  it('preserves default IDs and matching trigger/content relationships', () => {
    const { api } = start()
    expect(api().getRootProps().id).toBe('steps:contract')
    expect(api().getListProps()).toMatchObject({
      'id': 'steps:contract:list',
      'role': 'tablist',
      'aria-owns': 'steps:contract:trigger:0 steps:contract:trigger:1 steps:contract:trigger:2',
    })
    for (let index = 0; index < 3; index++) {
      expect(api().getTriggerProps({ index })).toMatchObject({
        'id': `steps:contract:trigger:${index}`,
        'role': 'tab',
        'aria-controls': `steps:contract:content:${index}`,
        'aria-selected': index === 0,
      })
      expect(api().getContentProps({ index })).toMatchObject({
        'id': `steps:contract:content:${index}`,
        'role': 'tabpanel',
        'aria-labelledby': `steps:contract:trigger:${index}`,
        'hidden': index !== 0,
      })
    }
  })

  it('preserves caller IDs, direction, orientation, and computed progress', () => {
    const { api } = start({
      defaultStep: 1,
      count: 4,
      dir: 'rtl',
      orientation: 'vertical',
      ids: { root: 'root', list: 'list', triggerId: index => `trigger-${index}`, contentId: index => `panel-${index}` },
    })
    expect(api().getRootProps()).toMatchObject({
      'id': 'root',
      'dir': 'rtl',
      'data-orientation': 'vertical',
      'style': { '--percent': '25%' },
    })
    expect(api().getListProps()).toMatchObject({
      'id': 'list',
      'aria-owns': 'trigger-0 trigger-1 trigger-2 trigger-3',
      'aria-orientation': 'vertical',
    })
    expect(api().getTriggerProps({ index: 1 })['aria-controls']).toBe('panel-1')
    expect(api().getContentProps({ index: 1 })['aria-labelledby']).toBe('trigger-1')
    expect(api().getProgressProps()).toMatchObject({
      'role': 'progressbar',
      'aria-valuenow': 25,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuetext': '25% complete',
    })
  })

  it('derives current, completed, incomplete, and end-item states without mutation', () => {
    const { api } = start({ defaultStep: 1 })
    expect(api().getItemState({ index: 0 })).toMatchObject({ current: false, completed: true, incomplete: false, first: true, last: false })
    expect(api().getItemState({ index: 1 })).toMatchObject({ current: true, completed: false, incomplete: false, first: false, last: false })
    expect(api().getItemState({ index: 2 })).toMatchObject({ current: false, completed: false, incomplete: true, first: false, last: true })
    expect(api().getItemProps({ index: 1 })['aria-current']).toBe('step')
    expect(api().getIndicatorProps({ index: 0 })['data-complete']).toBe('')
    expect(api().getIndicatorProps({ index: 1 })['data-current']).toBe('')
    expect(api().getSeparatorProps({ index: 2 })['data-incomplete']).toBe('')
    expect(api().value).toBe(1)
  })

  it('handles next, previous, set, reset, and terminal no-ops with one change each', () => {
    const onStepChange = vi.fn()
    const onStepComplete = vi.fn()
    const { api } = start({ onStepChange, onStepComplete })
    api().goToPrevStep()
    api().goToNextStep()
    api().setStep(3)
    api().goToNextStep()
    expect(api()).toMatchObject({ value: 3, percent: 100, hasNextStep: false, hasPrevStep: true, isCompleted: true })
    expect(api().getProgressProps()['data-complete']).toBe('')
    expect(onStepComplete).toHaveBeenCalledTimes(1)
    api().goToPrevStep()
    api().resetStep()
    api().resetStep()
    expect(api()).toMatchObject({ value: 0, percent: 0, hasNextStep: true, hasPrevStep: false, isCompleted: false })
    expect(onStepChange.mock.calls).toEqual([[{ step: 1 }], [{ step: 3 }], [{ step: 2 }], [{ step: 0 }]])
    expect(onStepComplete).toHaveBeenCalledTimes(1)
  })

  it('keeps controlled proposals separate from parent synchronization', () => {
    const onStepChange = vi.fn()
    const { api, service } = start({ step: 0, onStepChange })
    api().setStep(2)
    expect(api().value).toBe(0)
    expect(onStepChange.mock.calls).toEqual([[{ step: 2 }]])
    service.setContext({ step: 2 })
    expect(api().value).toBe(2)
    api().setStep(2)
    expect(onStepChange).toHaveBeenCalledTimes(1)
  })

  it('publishes each declared part and splits public context from caller props', () => {
    const { api } = start()
    const parts = [api().getRootProps(), api().getListProps(), api().getItemProps({ index: 0 }), api().getTriggerProps({ index: 0 }), api().getIndicatorProps({ index: 0 }), api().getSeparatorProps({ index: 0 }), api().getContentProps({ index: 0 }), api().getNextTriggerProps(), api().getPrevTriggerProps(), api().getProgressProps()]
    expect(parts.map(part => part['data-part'])).toEqual(['root', 'list', 'item', 'trigger', 'indicator', 'separator', 'content', 'next-trigger', 'prev-trigger', 'progress'])
    expect(parts.every(part => part['data-scope'] === 'steps')).toBe(true)
    expect(anatomy.keys()).toHaveLength(parts.length)
    const [context, rest] = splitProps({ id: 'consumer', count: 3, defaultStep: 1, title: 'Caller title' })
    expect(context).toEqual({ id: 'consumer', count: 3, defaultStep: 1 })
    expect(rest).toEqual({ title: 'Caller title' })
    expect(props).toContain('step')
    expect(props).toContain('defaultStep')
  })
})
