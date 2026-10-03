// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { flush, setup } from './tour.test-helper'

describe('tour navigation contracts', () => {
  it('routes setStep by a named identifier', async () => {
    const { api, service } = setup()
    api().start()
    await flush()
    expect(service.state.context.stepId).toBe('a')
    api().setStep('c')
    await flush()
    expect(service.state.context.stepId).toBe('c')
    expect(api().open).toBe(true)
  })

  it('routes custom action goto by a named identifier', async () => {
    const { api, service } = setup()
    api().start()
    await flush()
    api().getActionTriggerProps({ action: { label: 'Jump', action: actions => actions.goto('c') } }).onClick()
    await flush()
    expect(service.state.context.stepId).toBe('c')
  })

  it('allows RTL keyboard forward from the first step and backward from the last', async () => {
    const { api, service } = setup({ dir: 'rtl' })
    api().start()
    await flush()
    api().getContentProps().onKeyDown({ key: 'ArrowLeft', defaultPrevented: false })
    await flush()
    expect(service.state.context.stepId).toBe('b')
    api().next()
    await flush()
    expect(service.state.context.stepId).toBe('c')
    api().getContentProps().onKeyDown({ key: 'ArrowRight', defaultPrevented: false })
    await flush()
    expect(service.state.context.stepId).toBe('b')
  })

  it('uses a non-submitting close button', () => {
    const { api } = setup()
    expect(api().getCloseTriggerProps().type).toBe('button')
  })
})
