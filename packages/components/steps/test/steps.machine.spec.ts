import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createSteps(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'steps-test',
    count: 3,
    ...ctx,
  } as any)
}

describe('steps controllable step (Phase 3)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore activity cleanup errors
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = createSteps(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultStep seeds step', () => {
    const service = start({ defaultStep: 2 })
    expect(service.state.context.step).toBe(2)
  })

  it('uncontrolled: legacy step seed (compat)', () => {
    const service = start({ step: 1 })
    expect(service.state.context.step).toBe(1)
  })

  it('uncontrolled: neither defaultStep nor step starts 0', () => {
    const service = start({})
    expect(service.state.context.step).toBe(0)
  })

  it('uncontrolled: defaultStep preferred over step seed for initial', () => {
    const service = start({ defaultStep: 2, step: 1 })
    expect(service.state.context.step).toBe(2)
  })

  it('phase 3 presence: step alone (no flag) defers mutation until parent syncs', () => {
    const onStepChange = vi.fn()
    const service = start({ step: 0, onStepChange })
    service.send({ type: 'STEP.SET', value: 1 })
    expect(service.state.context.step).toBe(0)
    expect(onStepChange).toHaveBeenCalledWith({ step: 1 })

    service.setContext({ step: 1 })
    expect(service.state.context.step).toBe(1)
  })


  it('controlled: with step presence, STEP.SET only invokes until parent syncs', () => {
    const onStepChange = vi.fn()
    const service = start({
      'step': 0,
      onStepChange,
    })
    expect(service.state.context.step).toBe(0)

    service.send({ type: 'STEP.SET', value: 2 })
    expect(service.state.context.step).toBe(0)
    expect(onStepChange).toHaveBeenCalledWith({ step: 2 })

    service.setContext({ step: 2 })
    expect(service.state.context.step).toBe(2)
  })

  it('connect setStep still sends STEP.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.value).toBe(0)
    api.setStep(1)
    expect(service.state.context.step).toBe(1)
  })
})
