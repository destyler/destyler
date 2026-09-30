import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, copyFileSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

// Manual usage: prepare <ui-root> <tarball> <extracted-package> <evidence-dir>,
// install the disposable override, then verify with the same arguments.
// Complete commands and pinned tools from the consumed one-shot workflow:
// https://github.com/destyler/destyler/blob/1a370290e9a360866302c435a50b648e2c7b03e0/.github/workflows/carousel-downstream.yml
// Successful observation: https://github.com/destyler/destyler/actions/runs/36755572953
const [mode, consumerArg, tarballArg, extractedArg, evidenceArg] = process.argv.slice(2)
assert(['prepare', 'verify'].includes(mode), 'Expected prepare or verify')
const consumer = path.resolve(consumerArg)
const tarball = path.resolve(tarballArg)
const extracted = path.resolve(extractedArg)
const evidence = path.resolve(evidenceArg)
const git = (...args) => execFileSync('git', ['-C', consumer, ...args], { encoding: 'utf8' }).trim()
const sha256 = filename => createHash('sha256').update(readFileSync(filename)).digest('hex')
const uiSha = 'ad7aca3ce9a19fd840cba9ade3fe1c17aa46a259'
assert.equal(git('rev-parse', 'HEAD'), uiSha, 'Unexpected UI reproducer revision')
mkdirSync(evidence, { recursive: true })

if (mode === 'prepare') {
  git('diff', '--exit-code', 'HEAD')
  const workspace = path.join(consumer, 'pnpm-workspace.yaml')
  assert(!/^overrides:/m.test(readFileSync(workspace, 'utf8')), 'Do not replace existing consumer overrides')
  copyFileSync(path.join(consumer, 'pnpm-lock.yaml'), path.join(evidence, 'ui-frozen-lock.yaml'))
  // Only this disposable checkout gets an override and a regenerated lock.
  // The release manifests and their frozen lockfile remain unchanged in Git.
  const locator = `file:${path.relative(consumer, tarball)}`
  appendFileSync(workspace, `\noverrides:\n  '@destyler/carousel': ${JSON.stringify(locator)}\n`)
  console.log(`Prepared ephemeral Carousel override: ${locator}`)
}
else {
  const changed = git('diff', '--name-only', 'HEAD').split('\n').sort()
  assert.deepEqual(changed, ['pnpm-lock.yaml', 'pnpm-workspace.yaml'])
  git('diff', '--exit-code', 'HEAD', '--', '.', ':(exclude)pnpm-lock.yaml', ':(exclude)pnpm-workspace.yaml')

  const require = createRequire(path.join(consumer, 'packages/svelte/package.json'))
  const entry = realpathSync(require.resolve('@destyler/carousel'))
  assert(entry.startsWith(`${realpathSync(path.join(consumer, 'node_modules/.pnpm'))}${path.sep}`), 'Carousel must resolve from the consumer installation')
  const installed = path.dirname(path.dirname(entry))
  const pkg = JSON.parse(readFileSync(path.join(installed, 'package.json'), 'utf8'))
  assert.equal(pkg.name, '@destyler/carousel')
  assert(Object.values(pkg.dependencies).every(version => !version.startsWith('workspace:')))
  for (const filename of ['package.json', 'dist/index.mjs', 'dist/index.d.mts']) {
    assert.deepEqual(readFileSync(path.join(installed, filename)), readFileSync(path.join(extracted, filename)), `Packed consumer mismatch: ${filename}`)
  }

  const result = {
    coreSha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    uiSha,
    node: process.version,
    tarballSha256: sha256(tarball),
    resolvedEntry: entry,
    installedEntrySha256: sha256(entry),
    changedConsumerFiles: changed,
    lockfilePurpose: 'Ephemeral packed-consumer override; not release frozen inputs',
  }
  writeFileSync(path.join(evidence, 'resolution.json'), `${JSON.stringify(result, null, 2)}\n`)
  writeFileSync(path.join(evidence, 'consumer-lock-adjustment.diff'), `${git('diff', 'HEAD', '--', 'pnpm-workspace.yaml', 'pnpm-lock.yaml')}\n`)
  copyFileSync(path.join(consumer, 'pnpm-lock.yaml'), path.join(evidence, 'ui-packed-consumer-lock.yaml'))
  console.log(JSON.stringify(result, null, 2))
}
