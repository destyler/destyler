import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
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
