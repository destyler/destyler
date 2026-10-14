import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise the packed consumer runtime selection outside browser tests.
import { test } from 'node:test'

const script = `import { consumerNode } from ${JSON.stringify(new URL('../consumer-runtime.mjs', import.meta.url).href)}; console.log(consumerNode)`

function probe(overrides = {}) {
  const env = { ...process.env }
  for (const key of ['DESTYLER_CONSUMER_NODE', 'DESTYLER_CONSUMER_NPM', 'DESTYLER_CONSUMER_NODE_VERSION'])
    delete env[key]
  return spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...env, ...overrides }, encoding: 'utf8' })
}

test('ordinary packed checks keep their invoking Node runtime', () => {
  const result = probe()
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout.trim(), process.execPath)
})

test('a partial or relative consumer selection fails instead of using development Node', () => {
  for (const env of [
    { DESTYLER_CONSUMER_NODE: process.execPath },
    { DESTYLER_CONSUMER_NPM: '/missing/npm-cli.js', DESTYLER_CONSUMER_NODE_VERSION: '20.19.0' },
    { DESTYLER_CONSUMER_NODE: 'node', DESTYLER_CONSUMER_NPM: '/missing/npm-cli.js', DESTYLER_CONSUMER_NODE_VERSION: '20.19.0' },
  ]) {
    const result = probe(env)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /configured together|absolute paths/)
  }
})

test('a wrong consumer Node version fails before npm or any package can run', () => {
  const result = probe({
    DESTYLER_CONSUMER_NODE: process.execPath,
    DESTYLER_CONSUMER_NPM: '/missing/npm-cli.js',
    DESTYLER_CONSUMER_NODE_VERSION: '0.0.0',
  })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Wrong consumer Node runtime/)
  assert.ok(!result.stderr.includes('Cannot find module'))
})

function probePnpm(executable, args, cwd, overrides = {}) {
  const env = { ...process.env, ...overrides }
  for (const key of ['DESTYLER_CONSUMER_NODE', 'DESTYLER_CONSUMER_NPM', 'DESTYLER_CONSUMER_NODE_VERSION', 'npm_execpath'])
    delete env[key]
  if (executable !== undefined)
    env.npm_execpath = executable
  const script = `
    import { pnpmCommand } from ${JSON.stringify(new URL('../consumer-runtime.mjs', import.meta.url).href)}
    import { spawnSync } from 'node:child_process'
    const [command, args] = pnpmCommand(${JSON.stringify(args)})
    const result = spawnSync(command, args, { cwd: ${JSON.stringify(cwd)}, env: process.env, encoding: 'utf8' })
    console.log(JSON.stringify({ command, args, status: result.status, error: result.error?.code, stdout: result.stdout, stderr: result.stderr }))
  `
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], { env, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('JavaScript pnpm launchers use the invoking Node and preserve arguments and output', (t) => {
  const directory = realpathSync(mkdtempSync(path.join(tmpdir(), 'destyler-pnpm-script-')))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const args = ['pack', '--pack-destination', 'directory with spaces']
  for (const extension of ['js', 'cjs', 'mjs']) {
    const executable = path.join(directory, `pnpm.${extension}`)
    writeFileSync(executable, 'console.log(JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd(), node: process.execPath })); console.error("launcher stderr")')
    const result = probePnpm(executable, args, directory)
    assert.equal(result.command, process.execPath)
    assert.deepEqual(result.args, [executable, ...args])
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: directory, node: process.execPath })
    assert.equal(result.stderr.trim(), 'launcher stderr')
  }
})

test('native pnpm launchers execute directly and retain successful and failing exit statuses', (t) => {
  const directory = realpathSync(mkdtempSync(path.join(tmpdir(), 'destyler-pnpm-native-')))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  // The current Node binary is a real native executable, so routing it through Node fails.
  for (const status of [0, 23]) {
    const args = ['-e', `console.log(JSON.stringify({ args: process.argv.slice(1), cwd: process.cwd() })); console.error('native stderr'); process.exitCode = ${status}`, '--', 'argument with spaces']
    const result = probePnpm(process.execPath, args, directory)
    assert.equal(result.status, status, result.stderr)
    assert.equal(result.command, process.execPath)
    assert.deepEqual(result.args, args)
    assert.deepEqual(JSON.parse(result.stdout), { args: ['argument with spaces'], cwd: directory })
    assert.equal(result.stderr.trim(), 'native stderr')
  }
})

test('a missing configured pnpm executable fails without falling back', (t) => {
  const directory = realpathSync(mkdtempSync(path.join(tmpdir(), 'destyler-pnpm-missing-')))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const executable = path.join(directory, 'missing-pnpm')
  const result = probePnpm(executable, ['--version'], directory)
  assert.equal(result.status, null)
  assert.equal(result.error, 'ENOENT')
  assert.equal(result.command, executable)
})

test('an unset npm_execpath retains the platform pnpm fallback', (t) => {
  const directory = realpathSync(mkdtempSync(path.join(tmpdir(), 'destyler-pnpm-fallback-')))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  if (process.platform !== 'win32')
    symlinkSync(process.execPath, path.join(directory, 'pnpm'))
  const result = probePnpm(undefined, ['--version'], directory, { PATH: directory })
  assert.equal(result.command, process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm')
  assert.deepEqual(result.args, ['--version'])
  if (process.platform !== 'win32') {
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stdout.trim(), process.version)
  }
})
