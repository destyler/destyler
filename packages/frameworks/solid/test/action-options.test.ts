import { execFile } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { createMachine } from '@destyler/xstate'
import { renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { actionOptionsConfig } from '../../test/action-options'
import { useMachine } from '../src/hooks/use-machine'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine<typeof fixture.config.context>(fixture.config, { actions: fixture.defaultActions }) }
}

const run = promisify(execFile)

describe('solid initial action options', () => {
  it('passes client regressions with a single browser-conditioned Solid runtime', async () => {
    // Node conditions apply to both the hooks and Solid itself, avoiding a mixed
    // server/client runtime when executing this DOM-only suite outside Chromium.
    const fixture = fileURLToPath(new URL('./fixtures/action-options-client.mjs', import.meta.url))
    const { stdout } = await run(process.execPath, ['--conditions=browser', '--import=tsx', '--test', '--test-reporter=tap', fixture], { timeout: 20000 })
      .catch((error) => {
        throw new Error([error.message, error.stdout, error.stderr].filter(Boolean).join('\n'))
      })
    expect(stdout).toContain('# fail 0')
  }, 30000)

  it.each([true, false])('runs the selected created action before SSR without starting (override: %s)', (override) => {
    const { service, calls, actions } = actionOptionsFixture()
    renderToString(() => {
      useMachine(() => service, { context: () => ({ value: 3 }), actions: override ? actions : undefined })
      return ''
    })
    expect(calls).toEqual([`${override ? '' : 'default '}created:3`])
    expect(service.status).toBe('Not Started')
  })
})
