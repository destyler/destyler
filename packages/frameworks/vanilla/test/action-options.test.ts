import type { StateSchema } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { actionOptionsConfig } from '../../test/action-options'
import { useActor } from '../src/hooks/use-actor'
import { useService } from '../src/hooks/use-service'
import { useSnapshot } from '../src/hooks/use-snapshot'
import { useMachine } from '../src/use-machine'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine<typeof fixture.config.context>(fixture.config, { actions: fixture.defaultActions }) }
}

describe('vanilla initial action options', () => {
  it.each(['instance', 'factory'] as const)('initializes %s actions before created and hydrated entry', (source) => {
    const { service, calls, actions, defaultActions } = actionOptionsFixture()
    const factory = vi.fn(() => service)
    const options = Object.freeze({ actions, context: { value: 2 }, state: { value: 'hydrated', context: { ...service.contextSnapshot, value: 7 } } })
    try {
      const result = useMachine<typeof service.state.context, StateSchema>(source === 'factory' ? factory : service, options)
      expect(result.service).toBe(service)
      expect(calls).toEqual(['created:2', 'entry:2', 'hydrated:7'])
      expect(service.state.value).toBe('hydrated')
      expect(service.options.actions?.created).toBe(defaultActions.created)
      expect(options.actions.created).toBe(actions.created)
      if (source === 'factory')
        expect(factory).toHaveBeenCalledTimes(1)
    }
    finally {
      service.stop()
    }
  })

  it('preserves absent actions and later snapshot updates without recreating or restarting', () => {
    const { service, calls, requests, actions } = actionOptionsFixture()
    const factory = vi.fn(() => service)
    const start = vi.spyOn(service, 'start')
    const target = {}
    try {
      useService(target, factory)
      useSnapshot(target, service)
      expect(calls).toEqual(['default created:0', 'default entry:0'])
      const report = vi.fn()
      useSnapshot(target, service, { actions: { report, request: actions.request } })
      service.send('REPORT')
      service.send('REQUEST')
      expect(report).toHaveBeenCalledTimes(1)
      expect(requests).toEqual([1])
      expect(service.contextSnapshot.value).toBe(0)
      useSnapshot(target, service, { context: { value: 1 } })
      expect(service.contextSnapshot.value).toBe(1)
      service.send('REPORT')
      expect(report).toHaveBeenCalledTimes(2)
      expect(useService(target, factory)).toBe(service)
      expect(start).toHaveBeenCalledTimes(1)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(calls).toEqual(['default created:0', 'default entry:0'])
    }
    finally {
      service.stop()
    }
  })

  it('leaves externally owned actor actions and lifecycle intact', () => {
    const { service, calls } = actionOptionsFixture()
    const report = vi.fn()
    service.setOptions({ actions: { report } })
    service.start()
    try {
      const [, send] = useActor({}, service)
      send('REPORT')
      expect(report).toHaveBeenCalledTimes(1)
      expect(calls).toEqual(['default entry:0'])
      expect(service.status).toBe('Running')
    }
    finally {
      service.stop()
    }
  })
})
