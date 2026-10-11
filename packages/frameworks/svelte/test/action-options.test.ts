import { execFile } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const run = promisify(execFile)

describe('svelte initial action options', () => {
  it.each(['client', 'server'])('passes %s action-option regressions against source hooks', async (mode) => {
    // Isolate Svelte export conditions without modifying the shared Vitest projects.
    const fixture = fileURLToPath(new URL(`./fixtures/action-options-${mode}.mjs`, import.meta.url))
    const conditions = mode === 'client' ? ['--conditions=browser'] : []
    const { stdout } = await run(process.execPath, [...conditions, '--test', '--test-reporter=tap', fixture], { timeout: 20000 })
      .catch((error) => {
        throw new Error([error.message, error.stdout, error.stderr].filter(Boolean).join('\n'))
      })
    expect(stdout).toContain('# fail 0')
  }, 30000)
})
