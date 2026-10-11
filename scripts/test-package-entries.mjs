import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('..', import.meta.url))
// Use the locked documentation bundler without adding a consumer dependency.
const astroRequire = createRequire(createRequire(import.meta.url).resolve('astro/package.json'))
const { build, normalizePath } = await import(pathToFileURL(astroRequire.resolve('vite')).href)
const temporaryDir = await realpath(await mkdtemp(path.join(tmpdir(), 'destyler-package-entries-')))
const entries = ['@destyler/navigation-menu', '@destyler/scroll-area', '@destyler/date']
const datePeers = ['3.0.0', '3.10.1', '3.12.4']
const runtimeFields = ['dependencies', 'optionalDependencies', 'peerDependencies']

function execute(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
  // Capturing output for assertions must not hide warnings or expected failures.
  if (capture) {
    process.stdout.write(result.stdout ?? '')
    process.stderr.write(result.stderr ?? '')
  }
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

async function assertProvenance(consumer, packed, datePeer) {
  const lock = JSON.parse(await readFile(path.join(consumer, 'package-lock.json'), 'utf8'))
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (location.endsWith('node_modules/@internationalized/date')) {
      assert.equal(location, 'node_modules/@internationalized/date', 'Unexpected nested Date peer')
      assert.equal(entry.version, datePeer)
      assert.equal(entry.link, undefined)
    }
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
    assert.equal(installedManifest.name, name)
    assert.equal(installedManifest.version, source.version)
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
  const peerDirectory = path.join(consumer, 'node_modules/@internationalized/date')
  assert.equal((await manifest(peerDirectory)).version, datePeer)
  assert.equal((await lstat(peerDirectory)).isSymbolicLink(), false)
  assert.equal(await realpath(peerDirectory), peerDirectory)
  assert.equal(lock.packages['node_modules/@internationalized/date'].version, datePeer)
  const dateRequire = createRequire(path.join(consumer, 'node_modules/@destyler/date/package.json'))
  assert.ok(dateRequire.resolve('@internationalized/date').startsWith(`${peerDirectory}${path.sep}`))
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

async function assertStaticDateImportControl(consumer, datePeer) {
  // Mutate only the disposable installed tarball, then restore its exact bytes.
  const require = createRequire(path.join(consumer, 'package.json'))
  const filename = require.resolve('@destyler/date')
  const original = await readFile(filename, 'utf8')
  try {
    await writeFile(filename, `import { CalendarDate as staticPeerCalendarDate } from '@internationalized/date'\nvoid staticPeerCalendarDate\n${original}`)
    const result = execute(process.execPath, ['imports.mjs'], consumer, true)
    if (datePeer === '3.0.0') {
      assert.notEqual(result.status, 0, 'Minimum peer must reject a restored static named import')
      assert.ok(result.stderr.includes('CalendarDate') && result.stderr.includes('not found') && result.stderr.includes('@internationalized/date'), result.stderr)
    }
    else {
      assert.equal(result.status, 0, 'Modern peers support the static named-import control')
    }
  }
  finally {
    await writeFile(filename, original)
  }
  run(process.execPath, ['imports.mjs'], consumer)
}

async function bundleDate(consumer, entry = 'date-browser-entry.mjs') {
  const require = createRequire(path.join(consumer, 'package.json'))
  const dateEntry = normalizePath(require.resolve('@destyler/date'))
  const peerDirectory = path.join(consumer, 'node_modules/@internationalized/date')
  const peerManifest = await manifest(peerDirectory)
  const peerEntry = normalizePath(path.resolve(peerDirectory, peerManifest.exports?.import ?? peerManifest.module))
  const source = await readFile(dateEntry, 'utf8')
  const optionalDefault = 'const optionalDefault = dateModule.default;'
  const optionalDefaultPosition = source.indexOf(optionalDefault) + optionalDefault.indexOf('.default') + 1
  const optionalDefaultWarnings = []
  const unexpectedMissingExports = []
  const result = await build({
    root: consumer,
    configFile: false,
    build: {
      write: false,
      lib: {
        entry: path.join(consumer, entry),
        formats: ['es'],
      },
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          // Preserve Vite's normal warning output, including expected controls.
          defaultHandler(warning)
          if (warning.code !== 'MISSING_EXPORT')
            return
          // Only this optional default probe is expected for the peer's ESM entry.
          if (warning.binding === 'default' && warning.id === dateEntry && warning.exporter === peerEntry && warning.loc?.file === dateEntry && source.split('\n')[warning.loc.line - 1] === optionalDefault && warning.pos === optionalDefaultPosition)
            optionalDefaultWarnings.push(warning)
          else
            unexpectedMissingExports.push(warning)
        },
      },
    },
  })
  assert.deepEqual(unexpectedMissingExports, [], 'Unexpected browser missing exports')
  assert.equal(optionalDefaultWarnings.length, 1, 'Expected the original optional-default probe warning')
  assert.ok(Array.isArray(result))
  assert.equal(result.length, 1)
  assert.equal(result[0].output.length, 1)
  const [chunk] = result[0].output
  assert.equal(chunk.type, 'chunk')
  assert.deepEqual(chunk.imports, [], 'Date browser bundle must include its dependencies')
  assert.deepEqual(chunk.dynamicImports, [])
  for (const name of ['@destyler/date', '@internationalized/date']) {
    const prefix = `${normalizePath(path.join(consumer, 'node_modules', name))}/`
    assert.ok(Object.keys(chunk.modules).some(id => id.startsWith(prefix)), `Browser bundle must use installed ${name}`)
  }
  return chunk.code
}

async function assertDateBrowserBundle(consumer, datePeer) {
  const code = await bundleDate(consumer)
  const date = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  for (const input of ['2024-03-10', '2024-02-29', '0099-12-31', '9999-12-31'])
    assert.equal(date.parseDateString(input, 'ja-JP', 'UTC').toString(), input)
  console.log(`Date peer ${datePeer}, Vite browser bundle parsing in Node: PASS`)
}

async function assertMissingDateExportControls(consumer, datePeer) {
  const require = createRequire(path.join(consumer, 'package.json'))
  const filename = require.resolve('@destyler/date')
  const original = await readFile(filename, 'utf8')
  try {
    const brokenNamespace = original.replace('dateModule.CalendarDate ??', 'dateModule.__missingCalendarDate ??')
    assert.notEqual(brokenNamespace, original, 'Missing namespace export control must change the installed bridge')
    await writeFile(filename, brokenNamespace)
    await assert.rejects(() => bundleDate(consumer), error => error.code === 'ERR_ASSERTION' && Array.isArray(error.actual) && error.actual.some(warning => warning.code === 'MISSING_EXPORT' && warning.binding === '__missingCalendarDate' && warning.id === normalizePath(filename)))
  }
  finally {
    await writeFile(filename, original)
  }
  try {
    await writeFile(filename, `import { __missingDateBinding } from '@internationalized/date'\nvoid __missingDateBinding\n${original}`)
    await assert.rejects(() => bundleDate(consumer), (error) => {
      console.error(error.message)
      return error.code === 'MISSING_EXPORT' && error.binding === '__missingDateBinding' && error.id === normalizePath(filename)
    })
  }
  finally {
    await writeFile(filename, original)
  }
  console.log(`Date peer ${datePeer}, missing namespace and named export controls: PASS`)
  await assertDateBrowserBundle(consumer, datePeer)
}

async function assertDateChromium(bundles) {
  const browser = await chromium.launch({ headless: true })
  try {
    for (const { datePeer, code } of bundles) {
      let parserAssertions = 0
      for (const timezoneId of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
        const page = await browser.newPage({ timezoneId })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('console', (message) => {
          if (message.type() === 'error')
            errors.push(message.text())
        })
        try {
          parserAssertions += await page.evaluate(async (url) => {
            const fixture = await import(url)
            return fixture.assertDateBrowserRuntime()
          }, `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
          assert.deepEqual(errors, [], `Date peer ${datePeer}, ${timezoneId}: browser errors`)
        }
        finally {
          await page.close()
        }
      }
      assert.equal(parserAssertions, 216)
      console.log(`Date peer ${datePeer}, Chromium: ${parserAssertions} ISO parser assertions and public format/range/mutation/month binding assertions passed`)
    }
  }
  finally {
    await browser.close()
  }
}

try {
  const packages = await runtimeClosure()
  pnpm([...entries.flatMap(name => ['--filter', `${name}...`]), '-r', 'run', 'build'])
  const packed = await packClosure(packages)
  const browserBundles = []
  for (const datePeer of datePeers) {
    const consumer = path.join(temporaryDir, `consumer-${datePeer}`)
    await cp(path.join(root, 'scripts/fixtures/package-entries'), consumer, { recursive: true })
    await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
      name: 'destyler-package-entry-consumer',
      private: true,
      type: 'module',
      dependencies: {
        ...Object.fromEntries([...packed].map(([name, { tarball }]) => [name, `file:${tarball}`])),
        '@internationalized/date': datePeer,
        'typescript': '5.9.3',
      },
    }, null, 2))
    // No @destyler runtime dependency may silently fall back to a published version.
    await writeFile(path.join(consumer, '.npmrc'), '@destyler:registry=http://127.0.0.1:9/\nfetch-retries=0\n')
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=true'], consumer)
    await assertProvenance(consumer, packed, datePeer)
    const probes = [
      ['modern runtime', ['imports.mjs']],
      ['legacy main runtime', ['imports.mjs', '--legacy']],
      ...['Bundler', 'NodeNext', 'Node10'].map(resolution => [`${resolution} types`, compilerArgs(resolution)]),
    ]
    const failures = []
    for (const [label, args] of probes) {
      const result = execute(process.execPath, args, consumer, true)
      console.log(`Date peer ${datePeer}, ${label}: ${result.status === 0 ? 'PASS' : 'FAIL'}`)
      if (result.status !== 0)
        failures.push(`${label}\n${result.stdout}${result.stderr}`)
    }
    assert.deepEqual(failures, [], failures.join('\n'))
    await assertRejectsBrokenEntries(consumer)
    run(process.execPath, ['imports.mjs', '--legacy'], consumer)
    run(process.execPath, compilerArgs('Node10'), consumer)
    await assertStaticDateImportControl(consumer, datePeer)
    await assertDateBrowserBundle(consumer, datePeer)
    await assertMissingDateExportControls(consumer, datePeer)
    browserBundles.push({ datePeer, code: await bundleDate(consumer, 'date-browser-runtime.mjs') })
  }
  await assertDateChromium(browserBundles)
  console.log('Packed package entries: local tarball provenance, exact Date peers 3.0.0/3.10.1/3.12.4, modern/legacy runtime, strict Bundler/NodeNext/Node10 types, six broken-entry controls per peer, static Date import controls, Vite browser bundles, missing Date export controls, and Chromium runtime passed')
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
