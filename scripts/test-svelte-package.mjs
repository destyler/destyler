import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const temporaryDir = await realpath(await mkdtemp(path.join(tmpdir(), 'destyler-svelte-adapter-packed-')))
const runtimeFields = ['dependencies', 'optionalDependencies', 'peerDependencies']
const unpublishedVersion = '9999.0.0-destyler-prepublish-check.0'

function run(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8',
  })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
  return result.stdout
}

function pnpm(args, cwd = root, capture = false) {
  if (process.env.npm_execpath)
    return run(process.execPath, [process.env.npm_execpath, ...args], cwd, capture)
  return run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, cwd, capture)
}

async function readManifest(directory) {
  return JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'))
}

async function runtimeClosure() {
  const workspaces = new Map()
  for (const workspace of JSON.parse(pnpm(['-r', 'list', '--depth', '-1', '--json'], root, true)))
    workspaces.set(workspace.name, { directory: workspace.path, manifest: await readManifest(workspace.path) })
  const closure = new Map()
  function visit(name) {
    if (closure.has(name))
      return
    const workspace = workspaces.get(name)
    assert.ok(workspace, `Missing workspace ${name}`)
    assert.ok(!workspace.manifest.private, `Runtime dependency ${name} must be publishable`)
    closure.set(name, workspace)
    for (const field of runtimeFields) {
      for (const [dependency, specifier] of Object.entries(workspace.manifest[field] ?? {})) {
        if (specifier.startsWith('workspace:'))
          assert.ok(workspaces.has(dependency), `Missing workspace dependency ${dependency}`)
        if (workspaces.has(dependency))
          visit(dependency)
      }
    }
  }
  visit('@destyler/svelte')
  return [...closure.values()]
}

async function packClosure(packages, destination) {
  await mkdir(destination, { recursive: true })
  const packed = new Map()
  for (const { directory, manifest } of packages) {
    const packageDestination = path.join(destination, manifest.name.replace('/', '-'))
    await mkdir(packageDestination)
    pnpm(['pack', '--pack-destination', packageDestination], directory)
    const tarballs = (await readdir(packageDestination)).filter(name => name.endsWith('.tgz'))
    assert.equal(tarballs.length, 1, `Expected one tarball for ${manifest.name}`)
    const tarball = path.join(packageDestination, tarballs[0])
    const integrity = `sha512-${createHash('sha512').update(await readFile(tarball)).digest('base64')}`
    packed.set(manifest.name, { manifest, tarball, integrity })
  }
  return packed
}

async function assertProvenance(consumerDir, packed) {
  // Read the public lockfile, which records tarball origins as well as nested installs.
  const packageLock = JSON.parse(await readFile(path.join(consumerDir, 'package-lock.json'), 'utf8'))
  assert.ok(packageLock.packages)
  for (const [location, entry] of Object.entries(packageLock.packages)) {
    const name = location.match(/(?:^|\/)node_modules\/(@destyler\/[^/]+)$/)?.[1]
    if (!name)
      continue
    assert.ok(packed.has(name), `Unexpected registry/workspace dependency ${name}`)
    assert.equal(location, `node_modules/${name}`, `Unexpected nested dependency ${name}`)
    assert.equal(entry.link, undefined, `${name} must be unpacked, not linked`)
  }
  for (const [name, { manifest: source, tarball, integrity }] of packed) {
    const installedDir = path.join(consumerDir, 'node_modules', name)
    assert.equal((await lstat(installedDir)).isSymbolicLink(), false, `${name} must not be a workspace symlink`)
    assert.equal(await realpath(installedDir), path.join(await realpath(consumerDir), 'node_modules', name))
    const installed = await readManifest(installedDir)
    assert.equal(installed.name, name)
    assert.equal(installed.version, source.version, `${name} must use this checkout's version`)
    const entry = packageLock.packages[`node_modules/${name}`]
    assert.ok(entry, `Missing locked package ${name}`)
    assert.equal(entry.version, source.version)
    assert.ok(entry.resolved?.startsWith('file:'), `${name} must come from a local tarball`)
    assert.equal(path.resolve(consumerDir, entry.resolved.slice('file:'.length)), tarball)
    assert.equal(entry.integrity, integrity, `${name} must match the packed bytes`)
    const require = createRequire(path.join(installedDir, 'package.json'))
    for (const field of runtimeFields) {
      for (const dependency of Object.keys(source[field] ?? {})) {
        if (!packed.has(dependency))
          continue
        assert.equal(installed[field][dependency], packed.get(dependency).manifest.version)
        const resolved = require.resolve(dependency)
        const expectedDir = path.join(consumerDir, 'node_modules', dependency)
        assert.ok(resolved.startsWith(`${expectedDir}${path.sep}`), `${name} must resolve ${dependency} from its tarball`)
      }
    }
  }
}

async function checkConsumers(packages, destination, label) {
  const packed = await packClosure(packages, path.join(destination, 'tarballs'))
  for (const version of ['5.0.0', '5.46.0']) {
    const consumerDir = path.join(destination, `svelte-${version}`)
    await cp(path.join(root, 'scripts/fixtures/svelte-package'), consumerDir, { recursive: true })
    await writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
      name: 'svelte-adapter-packed-consumer',
      private: true,
      type: 'module',
      dependencies: {
        ...Object.fromEntries([...packed].map(([name, { tarball }]) => [name, `file:${tarball}`])),
        'svelte': version,
        'typescript': '5.9.3',
        'happy-dom': '20.3.3',
      },
    }, null, 2))
    // A missing workspace tarball must never be silently replaced by a registry release.
    await writeFile(path.join(consumerDir, '.npmrc'), '@destyler:registry=http://127.0.0.1:9/\nfetch-retries=0\n')
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=true'], consumerDir)
    await assertProvenance(consumerDir, packed)
    const installedDir = path.join(consumerDir, 'node_modules/@destyler/svelte')
    const manifest = await readManifest(installedDir)
    for (const target of Object.values(manifest.exports).flatMap(conditions => Object.values(conditions)))
      await readFile(path.join(installedDir, target))
    for (const resolution of ['Bundler', 'NodeNext'])
      run(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json', '--moduleResolution', resolution, '--module', resolution === 'Bundler' ? 'ESNext' : 'NodeNext'], consumerDir)
    for (const condition of ['node', 'browser', 'svelte'])
      run(process.execPath, [`--conditions=${condition}`, 'imports.mjs'], consumerDir)
    console.log(`Packed Svelte adapter (${label}, Svelte ${version}): local runtime closure, strict Bundler/NodeNext and runtime entry imports passed`)
  }
}

async function unpublishedFixture(packages) {
  const fixtureRoot = path.join(temporaryDir, 'unpublished-workspace')
  await mkdir(fixtureRoot)
  const rootManifest = await readManifest(root)
  await writeFile(path.join(fixtureRoot, 'package.json'), JSON.stringify({ private: true, packageManager: rootManifest.packageManager }))
  await cp(path.join(root, 'pnpm-workspace.yaml'), path.join(fixtureRoot, 'pnpm-workspace.yaml'))
  const fixturePackages = []
  for (const { directory, manifest } of packages) {
    const fixtureDir = path.join(fixtureRoot, path.relative(root, directory))
    await cp(directory, fixtureDir, { recursive: true, filter: source => path.basename(source) !== 'node_modules' })
    const fixtureManifest = { ...manifest, version: unpublishedVersion }
    await writeFile(path.join(fixtureDir, 'package.json'), JSON.stringify(fixtureManifest, null, 2))
    fixturePackages.push({ directory: fixtureDir, manifest: fixtureManifest })
  }
  // pnpm pack resolves workspace: versions through the normal workspace links.
  // These links stay in staging; consumers install and verify only .tgz files.
  const byName = new Map(fixturePackages.map(workspace => [workspace.manifest.name, workspace]))
  for (const { directory, manifest } of fixturePackages) {
    const dependencies = new Set([...runtimeFields, 'devDependencies'].flatMap(field => Object.keys(manifest[field] ?? {})))
    for (const dependency of dependencies) {
      const target = byName.get(dependency)
      if (!target)
        continue
      const link = path.join(directory, 'node_modules', dependency)
      await mkdir(path.dirname(link), { recursive: true })
      await symlink(target.directory, link, 'junction')
    }
  }
  return fixturePackages
}

try {
  const packages = await runtimeClosure()
  pnpm(['--filter', '@destyler/svelte...', '-r', 'run', 'build'])
  await checkConsumers(packages, path.join(temporaryDir, 'checkout'), 'checkout')
  // Exercise the real pack/install/type/runtime path after a disposable lockstep bump.
  // This would fail if any unpublished workspace dependency were fetched from npm.
  await checkConsumers(await unpublishedFixture(packages), path.join(temporaryDir, 'unpublished'), unpublishedVersion)
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
