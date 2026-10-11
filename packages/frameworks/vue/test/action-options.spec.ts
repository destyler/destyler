import type { StateSchema } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive, ref } from 'vue'
import { actionOptionsConfig } from '../../test/action-options'
import { useActor } from '../src/composition/actor'
import { useMachine } from '../src/composition/machine'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine<typeof fixture.config.context>(fixture.config, { actions: fixture.defaultActions }) }
}

describe('vue initial action options', () => {
  it.each(['instance', 'factory'] as const)('initializes %s actions before created and hydrated entry', async (source) => {
    const { service, calls, actions, defaultActions } = actionOptionsFixture()
    const factory = vi.fn(() => service)
    const options = Object.freeze({ actions, context: ref({ value: 2 }), state: { value: 'hydrated', context: { ...service.contextSnapshot, value: 7 } } })
    const app = createApp({
      setup() {
        const [, , current] = useMachine<typeof service.state.context, StateSchema>(source === 'factory' ? factory : service, options)
        expect(current).toBe(service)
        return () => h('div')
      },
    })
    try {
      app.mount(document.createElement('div'))
      await nextTick()
      expect(calls).toEqual(['created:2', 'entry:2', 'hydrated:7'])
      expect(service.state.value).toBe('hydrated')
      expect(service.options.actions?.created).toBe(defaultActions.created)
      expect(options.actions.created).toBe(actions.created)
      if (source === 'factory')
        expect(factory).toHaveBeenCalledTimes(1)
    }
    finally {
      app.unmount()
    }
  })

  it('merges partial overrides and later reactive actions without recreating or restarting', async () => {
    const { service, calls, requests, actions } = actionOptionsFixture()
    const factory = vi.fn(() => service)
    const start = vi.spyOn(service, 'start')
    const context = ref({ value: 0 })
    const report = vi.fn()
    const actionMap = reactive({ report: actions.report, request: actions.request })
    const app = createApp({
      setup() {
        useMachine(factory, { actions: actionMap, context })
        return () => h('div')
      },
    })
    try {
      app.mount(document.createElement('div'))
      await nextTick()
      expect(calls).toEqual(['default created:0', 'default entry:0'])
      actionMap.report = report
      await nextTick()
      service.send('REPORT')
      service.send('REQUEST')
      expect(report).toHaveBeenCalledTimes(1)
      expect(requests).toEqual([1])
      expect(service.contextSnapshot.value).toBe(0)
      context.value = { value: 1 }
      await nextTick()
      expect(service.contextSnapshot.value).toBe(1)
      expect(start).toHaveBeenCalledTimes(1)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(calls).toEqual(['default created:0', 'default entry:0'])
    }
    finally {
      app.unmount()
    }
  })

  it('leaves externally owned actor actions and lifecycle intact', async () => {
    const { service, calls } = actionOptionsFixture()
    const report = vi.fn()
    service.setOptions({ actions: { report } })
    service.start()
    const app = createApp({
      setup() {
        useActor(service)
        return () => h('div')
      },
    })
    try {
      app.mount(document.createElement('div'))
      await nextTick()
      app.unmount()
      service.send('REPORT')
      expect(report).toHaveBeenCalledTimes(1)
      expect(calls).toEqual(['default entry:0'])
      expect(service.status).toBe('Running')
    }
    finally {
      service.stop()
    }
  })
})
