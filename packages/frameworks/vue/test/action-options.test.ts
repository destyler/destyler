import { createMachine } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { actionOptionsConfig } from '../../test/action-options'
import { useMachine } from '../src/composition/machine'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine<typeof fixture.config.context>(fixture.config, { actions: fixture.defaultActions }) }
}

describe('vue server action options', () => {
  it.each([true, false])('runs the selected created action before SSR without starting (override: %s)', async (override) => {
    const { service, calls, actions } = actionOptionsFixture()
    await renderToString(createSSRApp({
      setup() {
        useMachine(() => service, { context: ref({ value: 3 }), actions: override ? actions : undefined })
        return () => h('div')
      },
    }))
    expect(calls).toEqual([`${override ? '' : 'default '}created:3`])
    expect(service.status).toBe('Not Started')
  })
})
