import type { AnyEventObject, HookOptions, StateSchema } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { actionOptionsConfig } from '../../test/action-options'
import { useActor } from '../src/hooks/use-actor'
import { useMachine } from '../src/hooks/use-machine'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine<typeof fixture.config.context>(fixture.config, { actions: fixture.defaultActions }) }
}

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('react initial action options', () => {
  it.each(['instance', 'factory'] as const)('initializes %s actions before created and hydrated entry', async (source) => {
    const { service, calls, actions, defaultActions } = actionOptionsFixture()
    const factory = vi.fn(() => service)
    const options = Object.freeze({ actions, context: { value: 2 }, state: { value: 'hydrated', context: { ...service.contextSnapshot, value: 7 } } })
    const root = createRoot(document.createElement('div'))
    function View() {
      const [, , current] = useMachine<typeof service.state.context, StateSchema>(source === 'factory' ? factory : service, options)
      expect(current).toBe(service)
      return null
    }
    try {
      await act(async () => root.render(createElement(View)))
      expect(calls).toEqual(['created:2', 'entry:2', 'hydrated:7'])
      expect(service.state.value).toBe('hydrated')
      expect(service.options.actions?.created).toBe(defaultActions.created)
      expect(options.actions.created).toBe(actions.created)
      if (source === 'factory')
        expect(factory).toHaveBeenCalledTimes(1)
    }
    finally {
      await act(async () => root.unmount())
    }
  })

  it('keeps unspecified defaults and updates actions without recreating or restarting', async () => {
    const { service, calls, requests, actions } = actionOptionsFixture()
    const factory = vi.fn(() => service)
    const start = vi.spyOn(service, 'start')
    const root = createRoot(document.createElement('div'))
    type Options = HookOptions<typeof service.state.context, StateSchema, AnyEventObject>
    function View({ options }: { options?: Options }) {
      useMachine(factory, options)
      return null
    }
    try {
      await act(async () => root.render(createElement(View)))
      expect(calls).toEqual(['default created:0', 'default entry:0'])
      const report = vi.fn()
      await act(async () => root.render(createElement(View, { options: { actions: { report, request: actions.request } } })))
      await act(async () => {
        service.send('REPORT')
        service.send('REQUEST')
      })
      expect(report).toHaveBeenCalledTimes(1)
      expect(requests).toEqual([1])
      expect(service.contextSnapshot.value).toBe(0)
      await act(async () => root.render(createElement(View, { options: { context: { value: 1 } } })))
      expect(service.contextSnapshot.value).toBe(1)
      await act(async () => service.send('REPORT'))
      expect(report).toHaveBeenCalledTimes(2)
      expect(start).toHaveBeenCalledTimes(1)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(calls).toEqual(['default created:0', 'default entry:0'])
    }
    finally {
      await act(async () => root.unmount())
    }
  })

  it('leaves externally owned actor actions and lifecycle intact', async () => {
    const { service, calls } = actionOptionsFixture()
    const report = vi.fn()
    service.setOptions({ actions: { report } })
    service.start()
    const root = createRoot(document.createElement('div'))
    function View() {
      useActor(service)
      return null
    }
    try {
      await act(async () => root.render(createElement(View)))
      await act(async () => root.unmount())
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
