import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const temporaryDir = await realpath(await mkdtemp(path.join(tmpdir(), 'destyler-package-entries-')))
const entries = ['@destyler/navigation-menu', '@destyler/scroll-area']
const runtimeFields = ['dependencies', 'optionalDependencies', 'peerDependencies']

function execute(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  })
  if (result.error)
    throw result.error
  return result
}

function run(command, args, cwd, capture = false) {
  const result = execute(command, args, cwd, capture)
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`)
  return result.stdout
}

function pnpm(args, cwd = root, capture = false) {
  if (process.env.npm_execpath)
    return run(process.execPath, [process.env.npm_execpath, ...args], cwd, capture)
  return run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, cwd, capture)
}

async function manifest(directory) {
  return JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'))
}

async function runtimeClosure() {
  const workspaces = new Map()
  for (const workspace of JSON.parse(pnpm(['-r', 'list', '--depth', '-1', '--json'], root, true)))
    workspaces.set(workspace.name, { directory: workspace.path, manifest: await manifest(workspace.path) })
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
  entries.forEach(visit)
  return [...closure.values()]
}

async function packClosure(packages) {
  const packed = new Map()
  for (const { directory, manifest: source } of packages) {
    const destination = path.join(temporaryDir, 'tarballs', source.name.replace('/', '-'))
    await mkdir(destination, { recursive: true })
    pnpm(['pack', '--pack-destination', destination], directory)
    const files = (await readdir(destination)).filter(name => name.endsWith('.tgz'))
    assert.equal(files.length, 1)
    const tarball = path.join(destination, files[0])
    const integrity = `sha512-${createHash('sha512').update(await readFile(tarball)).digest('base64')}`
    packed.set(source.name, { source, tarball, integrity })
  }
  return packed
}

async function assertProvenance(consumer, packed) {
  const lock = JSON.parse(await readFile(path.join(consumer, 'package-lock.json'), 'utf8'))
  for (const [location, entry] of Object.entries(lock.packages)) {
    const name = location.match(/(?:^|\/)node_modules\/(@destyler\/[^/]+)$/)?.[1]
    if (!name)
      continue
    assert.ok(packed.has(name), `Unexpected registry/workspace package ${name}`)
    assert.equal(location, `node_modules/${name}`, `Unexpected nested dependency ${name}`)
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
    const require = createRequire(path.join(installed, 'package.json'))
    for (const field of runtimeFields) {
      for (const dependency of Object.keys(source[field] ?? {})) {
        if (!packed.has(dependency))
          continue
        assert.equal(installedManifest[field][dependency], packed.get(dependency).source.version)
        assert.ok(require.resolve(dependency).startsWith(`${path.join(consumer, 'node_modules', dependency)}${path.sep}`))
      }
    }
  }
}

const compilerArgs = resolution => ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json', '--moduleResolution', resolution, '--module', resolution === 'NodeNext' ? 'NodeNext' : 'ESNext']

async function assertRejectsBrokenEntries(consumer) {
  for (const name of entries) {
    const filename = path.join(consumer, 'node_modules', name, 'package.json')
    const original = await readFile(filename, 'utf8')
    const source = JSON.parse(original)
    try {
      // Each mutation runs in a fresh consumer process to avoid resolver caching.
      await writeFile(filename, JSON.stringify({ ...source, main: 'dist/missing-entry.cjs' }))
      const runtime = execute(process.execPath, ['imports.mjs', '--legacy'], consumer, true)
      assert.notEqual(runtime.status, 0, `${name}: legacy runtime must reject broken main`)
      assert.ok(runtime.stderr.includes('MODULE_NOT_FOUND') && runtime.stderr.includes(name))
      await writeFile(filename, JSON.stringify({ ...source, types: 'dist/missing-entry.d.ts' }))
      const types = execute(process.execPath, compilerArgs('Node10'), consumer, true)
      assert.notEqual(types.status, 0, `${name}: Node10 consumer must reject broken types`)
      assert.ok(types.stdout.includes('TS7016') && types.stdout.includes(name), types.stdout + types.stderr)
    }
    finally {
      await writeFile(filename, original)
    }
  }
}

try {
  const packages = await runtimeClosure()
  pnpm([...entries.flatMap(name => ['--filter', `${name}...`]), '-r', 'run', 'build'])
  const packed = await packClosure(packages)
  const consumer = path.join(temporaryDir, 'consumer')
  await cp(path.join(root, 'scripts/fixtures/package-entries'), consumer, { recursive: true })
  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'destyler-package-entry-consumer',
    private: true,
    type: 'module',
    dependencies: {
      ...Object.fromEntries([...packed].map(([name, { tarball }]) => [name, `file:${tarball}`])),
      typescript: '5.9.3',
    },
  }, null, 2))
  // No @destyler runtime dependency may silently fall back to a published version.
  await writeFile(path.join(consumer, '.npmrc'), '@destyler:registry=http://127.0.0.1:9/\nfetch-retries=0\n')
  run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=true'], consumer)
  await assertProvenance(consumer, packed)
  const probes = [
    ['modern runtime', ['imports.mjs']],
    ['legacy main runtime', ['imports.mjs', '--legacy']],
    ...['Bundler', 'NodeNext', 'Node10'].map(resolution => [`${resolution} types`, compilerArgs(resolution)]),
  ]
  const failures = []
  for (const [label, args] of probes) {
    const result = execute(process.execPath, args, consumer, true)
    console.log(`${label}: ${result.status === 0 ? 'PASS' : 'FAIL'}`)
    if (result.status !== 0)
      failures.push(`${label}\n${result.stdout}${result.stderr}`)
  }
  assert.deepEqual(failures, [], failures.join('\n'))
  await assertRejectsBrokenEntries(consumer)
  run(process.execPath, ['imports.mjs', '--legacy'], consumer)
  run(process.execPath, compilerArgs('Node10'), consumer)
  console.log('Packed package entries: local tarball provenance, modern/legacy runtime, strict Bundler/NodeNext/Node10 types, and four negative controls passed')
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
