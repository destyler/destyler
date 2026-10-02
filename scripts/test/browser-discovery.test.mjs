import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise actual Vitest discovery without launching a browser.
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repository = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(import.meta.url)
const cli = path.join(path.dirname(require.resolve('vitest/package.json')), 'vitest.mjs')
const config = path.join(repository, 'vitest.browser.config.ts')
const canonicalFiles = [
  'packages/components/button/test/button.spec.ts',
  'packages/shareds/utility/test/contract.spec.ts',
]

function withFixture(callback) {
  const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'destyler-browser-discovery-')))
  try {
    const files = [
      ...canonicalFiles,
      'packages/shareds/utility/.git/ignored.spec.ts',
      'packages/frameworks/react/test/react.browser.spec.tsx',
    ]
    for (const file of files) {
      const target = path.join(root, file)
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, '// Discovery fixture: listing must not execute this file.\n')
    }
    const link = path.join(root, 'packages/components/button/node_modules/@destyler/utility')
    mkdirSync(path.dirname(link), { recursive: true })
    symlinkSync(path.join(root, 'packages/shareds/utility'), link, 'junction')
    writeFileSync(path.join(root, 'package.json'), '{"private":true,"type":"module"}\n')
    callback(root)
  }
  finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function discover(root, configFile = config) {
  const result = spawnSync(process.execPath, [cli, 'list', '--root', root, '--config', configFile, '--filesOnly', '--json'], {
    cwd: repository,
    env: process.env,
    encoding: 'utf8',
  })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return JSON.parse(result.stdout).map(({ file }) => file)
}

function assertCanonical(files, root) {
  const relative = files.map(file => path.relative(root, file).split(path.sep).join('/')).sort()
  assert.deepEqual(relative, canonicalFiles)
  assert.equal(new Set(files.map(file => realpathSync(file))).size, files.length, 'Each physical test file must be collected only once')
}

test('browser discovery retains canonical specs while excluding pnpm aliases, git internals, and reserved adapter specs', () => {
  withFixture(root => assertCanonical(discover(root), root))
})

for (const [label, filter] of [
  ['missing default excludes', 'pattern => !pattern.includes("node_modules") && !pattern.includes(".git")'],
  ['missing reserved adapter excludes', 'pattern => !pattern.includes(".browser.spec")'],
]) {
  test(`discovery contract rejects ${label}`, () => {
    withFixture((root) => {
      const mutant = path.join(root, 'mutant.config.ts')
      writeFileSync(mutant, `import config from ${JSON.stringify(pathToFileURL(config).href)}\nexport default { ...config, test: { ...config.test, exclude: config.test.exclude.filter(${filter}) } }\n`)
      const files = discover(root, mutant)
      assert.throws(() => assertCanonical(files, root), assert.AssertionError)
    })
  })
}
