import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { consumerNode, installConsumer } from './consumer-runtime.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const temporaryDir = await realpath(await mkdtemp(path.join(tmpdir(), 'destyler-public-runtime-')))
const runtimeFields = ['dependencies', 'optionalDependencies', 'peerDependencies']

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, env: process.env, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
  return result.stdout
}

function pnpm(args, cwd = root) {
  if (process.env.npm_execpath)
    return run(process.execPath, [process.env.npm_execpath, ...args], cwd)
  return run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, cwd)
}

const manifest = async directory => JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'))

try {
  const workspaces = JSON.parse(pnpm(['-r', 'list', '--depth', '-1', '--json']))
  const packages = []
  for (const workspace of workspaces) {
    const source = await manifest(workspace.path)
    if (!source.private && workspace.path.startsWith(path.join(root, 'packages') + path.sep))
      packages.push({ directory: workspace.path, source })
  }
  assert.ok(packages.length > 0, 'No public packages discovered')
  const names = new Set(packages.map(({ source }) => source.name))
  pnpm(['--filter', './packages/**', '-r', 'run', 'build'])
  const packed = new Map()
  const peers = {}
  for (const { directory, source } of packages) {
    for (const field of runtimeFields) {
      for (const [name, version] of Object.entries(source[field] ?? {})) {
        if (name.startsWith('@destyler/') || version.startsWith('workspace:'))
          assert.ok(names.has(name), `Missing public runtime package ${name}`)
      }
    }
    for (const name of Object.keys(source.peerDependencies ?? {})) {
      if (names.has(name))
        continue
      const version = (await manifest(path.join(directory, 'node_modules', name))).version
      if (peers[name])
        assert.equal(peers[name], version, `${name}: inconsistent development peer versions`)
      peers[name] = version
    }
    const destination = path.join(temporaryDir, 'tarballs', source.name.replace('/', '-'))
    await mkdir(destination, { recursive: true })
    pnpm(['pack', '--pack-destination', destination], directory)
    const files = (await readdir(destination)).filter(name => name.endsWith('.tgz'))
    assert.equal(files.length, 1)
    const tarball = path.join(destination, files[0])
    const integrity = `sha512-${createHash('sha512').update(await readFile(tarball)).digest('base64')}`
    packed.set(source.name, { source, tarball, integrity })
  }
  const consumer = path.join(temporaryDir, 'consumer')
  await mkdir(consumer)
  await cp(path.join(root, 'scripts/fixtures/package-entries/all-public-runtime.mjs'), path.join(consumer, 'all-public-runtime.mjs'))
  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
    dependencies: { ...peers, ...Object.fromEntries([...packed].map(([name, { tarball }]) => [name, `file:${tarball}`])) },
  }, null, 2))
  await writeFile(path.join(consumer, '.npmrc'), '@destyler:registry=http://127.0.0.1:9/\nfetch-retries=0\n')
  installConsumer(consumer)
  const lock = JSON.parse(await readFile(path.join(consumer, 'package-lock.json'), 'utf8'))
  for (const [location, entry] of Object.entries(lock.packages)) {
    const name = location.match(/(?:^|\/)node_modules\/(@destyler\/[^/]+)$/)?.[1]
    if (!name)
      continue
    assert.ok(packed.has(name), `Unexpected registry package ${name}`)
    assert.equal(location, `node_modules/${name}`, `Unexpected nested package ${name}`)
    assert.equal(entry.link, undefined)
  }
  for (const [name, { source, tarball, integrity }] of packed) {
    const installed = path.join(consumer, 'node_modules', name)
    assert.equal((await lstat(installed)).isSymbolicLink(), false)
    assert.equal(await realpath(installed), installed)
    const entry = lock.packages[`node_modules/${name}`]
    assert.equal(entry.version, source.version)
    assert.ok(entry.resolved.startsWith('file:'))
    assert.equal(path.resolve(consumer, entry.resolved.slice(5)), tarball)
    assert.equal(entry.integrity, integrity)
    const installedManifest = await manifest(installed)
    assert.equal(installedManifest.name, name)
    assert.equal(installedManifest.version, source.version)
    const require = createRequire(path.join(installed, 'package.json'))
    for (const field of runtimeFields) {
      for (const dependency of Object.keys(source[field] ?? {})) {
        if (!packed.has(dependency))
          continue
        assert.equal(installedManifest[field][dependency], packed.get(dependency).source.version)
        assert.ok(require.resolve(dependency).startsWith(path.join(consumer, 'node_modules', dependency) + path.sep))
      }
    }
  }
  await writeFile(path.join(consumer, 'public-packages.json'), JSON.stringify([...packed.keys()]))
  run(consumerNode, ['all-public-runtime.mjs'], consumer)
  // Prove a broken packed entry cannot turn into a false-positive import check.
  const control = path.join(consumer, 'node_modules/@destyler/anatomy/package.json')
  const original = await readFile(control, 'utf8')
  try {
    const broken = JSON.parse(original)
    broken.exports['.'] = './missing-runtime-entry.mjs'
    await writeFile(control, JSON.stringify(broken))
    const result = spawnSync(consumerNode, ['all-public-runtime.mjs'], { cwd: consumer, env: process.env, encoding: 'utf8' })
    assert.notEqual(result.status, 0, 'Broken public runtime entry must fail')
    assert.match(result.stderr, /ERR_MODULE_NOT_FOUND/)
    assert.match(result.stderr, /missing-runtime-entry\.mjs/)
  }
  finally {
    await writeFile(control, original)
  }
  run(consumerNode, ['all-public-runtime.mjs'], consumer)
  console.log(`All ${packed.size} packed public packages: isolated tarball provenance and Node import/require entries passed`)
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
