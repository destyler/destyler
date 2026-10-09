import { execFile } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const run = promisify(execFile)

describe('svelte portal source-action lifetime', () => {
  it('passes with the real Svelte client runtime', async () => {
    const fixture = fileURLToPath(new URL('./fixtures/portal-lifetimes-client.mjs', import.meta.url))
    try {
      const { stdout } = await run(process.execPath, ['--conditions=browser', '--test', '--test-reporter=tap', fixture], { timeout: 20000 })
      expect(stdout).toContain('# fail 0')
    }
    catch (error) {
      const failure = error as Error & { stdout?: string, stderr?: string }
      throw new Error([failure.message, failure.stdout, failure.stderr].filter(Boolean).join('\n'), { cause: error })
    }
  }, 30000)
})
