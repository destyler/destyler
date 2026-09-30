import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cp, lstat, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const packageDir = path.join(root, 'packages/frameworks/svelte')
const temporaryDir = await mkdtemp(path.join(tmpdir(), 'destyler-svelte-adapter-packed-'))
function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, { cwd, env: { ...process.env, ...env }, stdio: 'inherit' })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
}
function pnpm(args) {
  if (process.env.npm_execpath)
    run(process.execPath, [process.env.npm_execpath, ...args], packageDir)
  else
    run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, packageDir)
}
try {
  pnpm(['--filter', '@destyler/svelte...', '-r', 'run', 'build'])
  pnpm(['pack', '--pack-destination', temporaryDir])
  const tarballs = (await readdir(temporaryDir)).filter(name => name.endsWith('.tgz'))
  assert.equal(tarballs.length, 1)
  for (const version of ['5.0.0', '5.46.0']) {
    const consumerDir = path.join(temporaryDir, version)
    await cp(path.join(root, 'scripts/fixtures/svelte-package'), consumerDir, { recursive: true })
    await writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
      name: 'svelte-adapter-packed-consumer',
      private: true,
      type: 'module',
      dependencies: { '@destyler/svelte': `file:${path.join(temporaryDir, tarballs[0])}`, 'svelte': version, 'typescript': '5.9.3', 'happy-dom': '20.3.3' },
    }, null, 2))
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], consumerDir)
    const installedDir = path.join(consumerDir, 'node_modules/@destyler/svelte')
    assert.equal((await lstat(installedDir)).isSymbolicLink(), false)
    const manifest = JSON.parse(await readFile(path.join(installedDir, 'package.json'), 'utf8'))
    for (const target of Object.values(manifest.exports).flatMap(conditions => Object.values(conditions)))
      await readFile(path.join(installedDir, target))
    for (const resolution of ['Bundler', 'NodeNext'])
      run(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json', '--moduleResolution', resolution, '--module', resolution === 'Bundler' ? 'ESNext' : 'NodeNext'], consumerDir)
    for (const condition of ['node', 'browser', 'svelte'])
      run(process.execPath, [`--conditions=${condition}`, 'imports.mjs'], consumerDir)
    console.log(`Packed Svelte adapter ${version}: strict Bundler/NodeNext and runtime entry imports passed`)
  }
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
