import { execFile } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const run = promisify(execFile)

describe('svelte source-hook lifecycle', () => {
  it.each(['client', 'server'])('passes %s lifecycle regressions with the real Svelte runtime', async (mode) => {
    // Separate processes preserve Svelte's browser/server export conditions without
    // adding a framework transform to the shared utility/browser test projects.
    const fixture = fileURLToPath(new URL(`./fixtures/lifecycle-${mode}.mjs`, import.meta.url))
    const conditions = mode === 'client' ? ['--conditions=browser'] : []
    try {
      const { stdout } = await run(process.execPath, [...conditions, '--test', '--test-reporter=tap', fixture], { timeout: 20000 })
      expect(stdout).toContain('# fail 0')
    }
    catch (error) {
      const failure = error as Error & { stdout?: string, stderr?: string }
      throw new Error([
        `Svelte ${mode} lifecycle child failed on ${process.version}`,
        failure.message,
        'stdout:',
        failure.stdout || '(empty)',
        'stderr:',
        failure.stderr || '(empty)',
      ].join('\n'), { cause: error })
    }
  }, 30000)
})
