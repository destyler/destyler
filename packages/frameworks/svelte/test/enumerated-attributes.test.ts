import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { expect, it } from 'vitest'

const run = promisify(execFile)
it('renders, updates, and hydrates supported enumerated attributes using the actual Svelte compiler/runtime', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'destyler-svelte-enumerated-'))
  const fixture = fileURLToPath(new URL('./fixtures/enumerated-attributes.mjs', import.meta.url))
  try {
    for (const mode of ['server', 'client']) {
      const conditions = mode === 'client' ? ['--conditions=browser'] : []
      const { stdout } = await run(process.execPath, [...conditions, '--test', fixture], {
        timeout: 20000,
        env: { ...process.env, AUDIT_ENUM_MODE: mode, AUDIT_ENUM_HYDRATION_FILE: join(directory, 'hydration.json') },
      })
      expect(stdout).toContain('# fail 0')
    }
  }
  catch (error) {
    const failure = error as Error & { stdout?: string, stderr?: string }
    throw new Error([failure.message, failure.stdout || '', failure.stderr || ''].join('\n'), { cause: error })
  }
  finally {
    await rm(directory, { recursive: true, force: true })
  }
}, 50000)
