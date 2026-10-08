import { createMachine } from '@destyler/xstate'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { actionOptionsConfig } from '../../test/action-options'
import { useMachine } from '../src/hooks/use-machine'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine<typeof fixture.config.context>(fixture.config, { actions: fixture.defaultActions }) }
}

describe('react server action options', () => {
  it.each([true, false])('runs the selected created action before SSR without starting (override: %s)', (override) => {
    const { service, calls, actions } = actionOptionsFixture()
    function View() {
      useMachine(() => service, { context: { value: 3 }, actions: override ? actions : undefined })
      return null
    }
    renderToString(createElement(View))
    expect(calls).toEqual([`${override ? '' : 'default '}created:3`])
    expect(service.status).toBe('Not Started')
  })
})
