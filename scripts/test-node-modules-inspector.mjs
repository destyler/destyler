import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { once } from 'node:events'
import { closeSync, createReadStream, existsSync, openSync } from 'node:fs'
import { mkdir, readdir, readFile, realpath, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, extname, join, resolve, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { expect as baseExpect, chromium } from 'playwright/test'
import { parseDocument } from 'yaml'

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)))
const artifacts = join(root, 'node_modules/.cache/inspector-smoke')
await mkdir(artifacts, { recursive: true })
const networkLog = join(artifacts, `network-${process.pid}.jsonl`)
const guard = fileURLToPath(new URL('./test/inspector-offline.mjs', import.meta.url))
const registry = join(root, 'node_modules/.cache/node-modules-inspector/instances')
const globalRegistry = join(homedir(), '.devframe/instances')
const depth = 8
const timeout = 20_000
const expect = baseExpect.configure({ timeout })
const failures = []
const diagnostics = { requestsBlocked: [], rpcMethods: [], views: [] }
const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const lockDocument = parseDocument(await readFile(join(root, 'pnpm-lock.yaml'), 'utf8'))
assert.deepEqual(lockDocument.errors, [], 'Lockfile must parse without duplicate keys')
const lock = lockDocument.toJS()
const inspectorVersion = lock.catalogs.visual['node-modules-inspector'].version
assert.equal(inspectorVersion, '2.7.0', 'Review the exact dependency patch and this smoke on every Inspector upgrade')
// Review exact upstream bytes on every upgrade; remove this patch once upstream
// supports explicitly disabling automatic MCP through its public CLI/config.
const inspectorEntry = await realpath(fileURLToPath(import.meta.resolve('node-modules-inspector')))
const installedLock = parseDocument(await readFile(join(root, 'node_modules/.pnpm/lock.yaml'), 'utf8'))
assert.deepEqual(installedLock.errors, [])
assert.deepEqual(installedLock.toJS().importers, lock.importers, 'Run the full frozen workspace install before this smoke')
assert.deepEqual(installedLock.toJS().patchedDependencies, lock.patchedDependencies)
const inspectorRoot = resolve(dirname(inspectorEntry), '..')
const inspectorRequire = createRequire(inspectorEntry)
const { structuredCloneParse } = await import(pathToFileURL(inspectorRequire.resolve('devframe/utils/structured-clone')))
const { parseJsonStreamWithConcatArrays } = await import(pathToFileURL(join(dirname(inspectorRequire.resolve('node-modules-tools')), 'chunks/json-parse-stream.mjs')))
const patch = lock.patchedDependencies[`node-modules-inspector@${inspectorVersion}`]
assert.ok(patch, 'The default-off Inspector patch must be locked')
assert.equal(createHash('sha256').update(await readFile(join(root, patch.path))).digest('hex'), patch.hash)
assert.match(await readFile(join(inspectorRoot, 'dist/cli.mjs'), 'utf8'), /createDevServer\(devframe, \{\s+host,\s+port,\s+mcp: false,/)
assert.equal(packageJson.scripts['node-modules:dev'], 'cross-env DEVFRAME_DISABLE_INSTANCE_REGISTRY=1 DEVFRAME_INSTANCES_DIR=node_modules/.cache/node-modules-inspector/instances node-modules-inspector --host 127.0.0.1')
assert.equal(packageJson.scripts['node-modules:build'], 'node-modules-inspector build')

const childEnv = {
  ...process.env,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${pathToFileURL(guard).href}`.trim(),
  INSPECTOR_SMOKE_NETWORK_LOG: networkLog,
}
const children = new Set()
const handles = new Set()
function start(args, label, env = process.env) {
  const fd = openSync(join(artifacts, `${label}.log`), 'w')
  const child = spawn('pnpm', args, { cwd: root, env, stdio: ['ignore', fd, fd], detached: process.platform !== 'win32' })
  child.logFd = fd
  child.completion = new Promise((resolveExit, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => resolveExit({ code, signal }))
  })
  // A startup failure is reported by the awaiting operation, never unhandled.
  child.completion.catch(() => {})
  children.add(child)
  return child
}
async function bounded(promise, milliseconds, label) {
  let timer
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out`)), milliseconds)
    })])
  }
  finally { clearTimeout(timer) }
}
async function stop(child) {
  try {
    if (child.pid && child.exitCode === null && child.signalCode === null) {
      const kill = (signal) => {
        try {
          if (process.platform === 'win32')
            child.kill(signal)
          else process.kill(-child.pid, signal)
        }
        catch (error) {
          if (error.code !== 'ESRCH')
            throw error
        }
      }
      kill('SIGTERM')
      try {
        await bounded(child.completion, 5000, 'Child termination')
      }
      catch {
        kill('SIGKILL')
        await bounded(child.completion, 5000, 'Child kill')
      }
    }
  }
  finally {
    closeSync(child.logFd)
    children.delete(child)
  }
}
async function run(args, label, env = process.env, milliseconds = 180_000) {
  const child = start(args, label, env)
  let primaryError
  try {
    const result = await bounded(child.completion, milliseconds, label)
    assert.equal(result.code, 0, `${label} failed; inspect ${artifacts}/${label}.log`)
    return join(artifacts, `${label}.log`)
  }
  catch (error) {
    primaryError = error
    throw error
  }
  finally { await cleanupPreservingError(stop(child), primaryError, `${label} child`) }
}
async function cleanupPreservingError(promise, primaryError, label) {
  try {
    await promise
  }
  catch (error) {
    failures.push({ type: 'cleanup', label, error: String(error) })
    if (!primaryError)
      throw error
    console.error(`Secondary cleanup failure (${label}):`, error)
  }
}
async function directoryNames(path) {
  try {
    return (await readdir(path)).sort()
  }
  catch (error) {
    if (error.code === 'ENOENT')
      return []
    throw error
  }
}
async function listen(server) {
  handles.add(server)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  return server.address().port
}
async function close(server) {
  server.closeAllConnections?.()
  await bounded(new Promise((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose())), 5000, 'Server close')
  handles.delete(server)
}
const initialRegistry = await directoryNames(registry)
assert.deepEqual(initialRegistry, [], 'Smoke must not run beside an existing discovery record')
const initialGlobalRegistry = await directoryNames(globalRegistry)

// Match node-modules-tools' pnpm collector: configured depth, monorepo roots,
// dependency aliases and name/version aggregation rather than lock snapshots.
const inventoryLog = await run(['ls', '--json', '--depth', String(depth), '--recursive'], 'installed-inventory')
const inventory = await bounded(parseJsonStreamWithConcatArrays(createReadStream(inventoryLog), 'pnpm ls'), timeout, 'Installed inventory parsing')
const workspaceByPath = new Map(inventory.map(pkg => [pkg.path, pkg.version || '0.0.0']))
const expected = new Set(inventory.map(pkg => `${pkg.name}@${workspaceByPath.get(pkg.path)}`))
function visit(pkg, name = pkg.name) {
  const version = pkg.version.includes(':') && workspaceByPath.has(pkg.path)
    ? workspaceByPath.get(pkg.path)
    : pkg.version
  const spec = `${name}@${version}`
  if (expected.has(spec))
    return
  expected.add(spec)
  for (const [alias, dependency] of Object.entries(pkg.dependencies || {}))
    visit(dependency, alias)
}
for (const pkg of inventory) {
  for (const field of ['dependencies', 'devDependencies']) {
    for (const [name, dependency] of Object.entries(pkg[field] || {}))
      visit(dependency, name)
  }
}
const selectedWorkspace = inventory.find(pkg => pkg.name === '@destyler/checkbox')
assert.ok(selectedWorkspace, 'Known checkbox workspace must be installed')
assert.ok(expected.has(`node-modules-inspector@${inspectorVersion}`))
assert.ok(expected.size > inventory.length, 'A fully installed dependency graph is required')
function checkPayload(payload) {
  assert.equal(payload.config.name, '@destyler/everything')
  assert.equal(payload.packageManager, 'pnpm')
  assert.equal(payload.packageManagerVersion, packageJson.packageManager.split('@')[1])
  assert.ok(payload.packages instanceof Map)
  assert.deepEqual([...payload.packages.keys()].sort(), [...expected].sort(), 'Graph must match the installed pnpm traversal')
  assert.equal(payload.packages.get(`${selectedWorkspace.name}@${selectedWorkspace.version}`).workspace, true)
  for (const pkg of payload.packages.values()) {
    for (const dependency of pkg.dependencies)
      assert.ok(payload.packages.has(dependency), `${pkg.spec} has a dangling graph edge`)
  }
}
function decode(message) {
  const text = typeof message === 'string' ? message : message.toString('utf8')
  return text.startsWith('s:') ? structuredCloneParse(text.slice(2)) : JSON.parse(text)
}
function forbidden(method) {
  return /^(?:nmi:report-|devframes:service:open:|devframe:agent:)/.test(method || '')
}
async function serveStatic(folder) {
  const site = await realpath(folder)
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.wasm': 'application/wasm', '.woff2': 'font/woff2' }
  const server = createServer(async (request, response) => {
    try {
      assert.ok(['GET', 'HEAD'].includes(request.method))
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      let file = resolve(site, `.${pathname}`)
      assert.ok(file === site || file.startsWith(site + sep))
      if (!extname(file) && !existsSync(file))
        file = join(site, 'index.html')
      if ((await stat(file)).isDirectory())
        file = join(file, 'index.html')
      file = await realpath(file)
      assert.ok(file.startsWith(site + sep))
      response.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
      response.end(request.method === 'HEAD' ? undefined : await readFile(file))
    }
    catch (error) {
      failures.push({ type: 'static-server', path: request.url, error: String(error) })
      response.writeHead(404).end('Not found')
    }
  })
  return { server, origin: `http://127.0.0.1:${await listen(server)}` }
}
let browser
async function exercise(origin, mode, staticPayloadPaths = new Set()) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  context.setDefaultTimeout(timeout)
  context.setDefaultNavigationTimeout(timeout)
  let payloads = 0
  let primaryError
  try {
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url())
      if (url.origin !== origin || url.pathname === '/__mcp') {
        diagnostics.requestsBlocked.push(url.href)
        failures.push({ type: 'forbidden-http', url: url.href })
        return route.abort()
      }
      return route.continue()
    })
    await context.routeWebSocket('**/*', (socket) => {
      const url = new URL(socket.url())
      if (mode !== 'dev' || url.origin !== origin.replace('http:', 'ws:') || url.pathname !== '/__ws') {
        failures.push({ type: 'forbidden-websocket', url: url.href })
        socket.close()
        return
      }
      const upstream = socket.connectToServer()
      const pending = new Map()
      socket.onMessage((message) => {
        try {
          const frame = decode(message)
          assert.ok(!forbidden(frame.m), `Forbidden browser RPC ${frame.m}`)
          if (frame.t === 'q') {
            diagnostics.rpcMethods.push(frame.m)
            pending.set(frame.i, frame.m)
          }
          upstream.send(message)
        }
        catch (error) {
          failures.push({ type: 'outbound-rpc', error: String(error) })
          socket.close()
        }
      })
      upstream.onMessage((message) => {
        try {
          const frame = decode(message)
          if (frame.t === 's') {
            const method = pending.get(frame.i)
            pending.delete(frame.i)
            assert.ok(!frame.e, `RPC ${method} failed: ${String(frame.e)}`)
            if (method === 'nmi:get-payload') {
              checkPayload(frame.r)
              payloads++
            }
          }
          socket.send(message)
        }
        catch (error) {
          failures.push({ type: 'inbound-rpc', error: String(error) })
          socket.close()
        }
      })
    })
    const page = await context.newPage()
    page.on('pageerror', error => failures.push({ type: 'pageerror', error: String(error) }))
    page.on('console', (message) => {
      if (message.type() === 'error')
        failures.push({ type: 'console', error: message.text() })
    })
    context.on('requestfailed', request => failures.push({ type: 'requestfailed', url: request.url(), error: request.failure() }))
    context.on('response', (response) => {
      if (response.status() >= 400)
        failures.push({ type: 'http', url: response.url(), status: response.status() })
      if (mode === 'static' && staticPayloadPaths.has(new URL(response.url()).pathname)) {
        response.text().then((text) => {
          checkPayload(structuredCloneParse(text).output)
          payloads++
        }).catch(error => failures.push({ type: 'static-payload', error: String(error) }))
      }
    })
    const assertRoute = async (route) => {
      await expect(page).toHaveURL(new RegExp(`${route.replaceAll('/', '\\/')}(?:#.*)?$`))
      if (route === '/graph') {
        await expect(page.getByTitle('Toggle Graph Render Mode', { exact: true })).toBeVisible()
        await expect.poll(() => page.locator('svg[z-graph-link] path').count(), { timeout }).toBeGreaterThan(0)
      }
      else if (route === '/grid/depth') {
        await expect(page.getByText('Workspace Packages', { exact: true })).toBeVisible()
        await expect(page.locator('details[open] button').filter({ hasText: selectedWorkspace.name }).first()).toBeVisible()
      }
      else {
        await expect(page.getByRole('button', { name: 'Treemap', exact: true })).toBeVisible()
        await expect.poll(() => page.locator('canvas').evaluateAll(canvases => canvases.some((canvas) => {
          if (!canvas.width || !canvas.height)
            return false
          const pixels = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data
          if (!pixels)
            return false
          const colors = new Set()
          for (let offset = 0; offset < pixels.length; offset += Math.max(4, Math.floor(pixels.length / 4096 / 4) * 4)) {
            if (pixels[offset + 3])
              colors.add(`${pixels[offset]},${pixels[offset + 1]},${pixels[offset + 2]}`)
            if (colors.size > 1)
              return true
          }
          return false
        })), { timeout }).toBe(true)
      }
      diagnostics.views.push({ mode, route })
      assert.deepEqual(failures, [], 'Inspector emitted browser/transport errors')
    }
    const clickView = async (title, route) => {
      const control = page.getByTitle(title, { exact: true })
      await expect(control).toHaveCount(1)
      await expect(control).toBeVisible()
      await control.click()
      await assertRoute(route)
    }
    await page.goto(origin)
    await expect(page).toHaveTitle('Node Modules Inspector')
    await expect(page.getByText('@destyler/everything', { exact: true })).toBeVisible()
    await expect.poll(() => payloads, { timeout: 90_000 }).toBeGreaterThan(0)
    await clickView('Graph View', '/graph')
    await clickView('Grid View', '/grid/depth')
    await clickView('Chart View', '/chart')
    await page.getByRole('button', { name: 'Treemap', exact: true }).click()
    await assertRoute('/chart/treemap')
    await clickView('Graph View', '/graph')
    if (mode === 'dev') {
      const input = page.getByPlaceholder('Goto', { exact: true })
      const popup = page.locator('.v-popper__popper--shown').filter({ hasText: selectedWorkspace.name })
      await input.fill(selectedWorkspace.name)
      await expect(popup).toBeVisible()
      await input.locator('..').getByRole('button').click()
      await expect(input).toHaveValue('')
      await expect(popup).toBeHidden()
      for (let i = 0; i < 2; i++) {
        await input.fill(selectedWorkspace.name)
        await expect(popup).toBeVisible()
        await input.press('Enter')
        await expect(input).toHaveValue('')
        const details = page.getByRole('button', { name: 'Focus', exact: true }).locator('xpath=../..')
        await expect(details).toContainText(selectedWorkspace.name)
        await expect(details).toContainText(selectedWorkspace.version)
        await expect(details.getByText('Workspace', { exact: true })).toBeVisible()
      }
      const filters = page.getByTitle('Filters', { exact: true })
      for (let i = 0; i < 2; i++) {
        await filters.click()
        await expect(page.getByPlaceholder('Filter by Text', { exact: true })).toBeVisible()
        await filters.click()
        await expect(page.getByPlaceholder('Filter by Text', { exact: true })).toBeHidden()
      }
    }
    // Establish route history after selection/filter state changes.
    await clickView('Grid View', '/grid/depth')
    await clickView('Graph View', '/graph')
    await page.goBack()
    await assertRoute('/grid/depth')
    await page.goForward()
    await assertRoute('/graph')
    await page.mouse.move(0, 0)
    await expect(page.locator('.v-popper__popper--shown')).toHaveCount(0)
    await expect(page.getByPlaceholder('Filter by Text', { exact: true })).toBeHidden()
    await page.getByTitle('Toggle Graph Render Mode', { exact: true }).click({ trial: true })
    const beforeReload = payloads
    await page.reload()
    await assertRoute('/graph')
    await expect.poll(() => payloads, { timeout: 90_000 }).toBeGreaterThan(beforeReload)
    assert.deepEqual(failures, [])
  }
  catch (error) {
    primaryError = error
    const page = context.pages()[0]
    if (page)
      await page.screenshot({ path: join(artifacts, `${mode}-failure.png`), fullPage: true }).catch(() => {})
    throw error
  }
  finally { await cleanupPreservingError(bounded(context.close(), 10_000, 'Context close'), primaryError, `${mode} context`) }
}
let primaryError
let cleanupErrors = []
try {
  const reservation = createServer()
  const port = await listen(reservation)
  await close(reservation)
  const origin = `http://127.0.0.1:${port}`
  const dev = start(['run', 'node-modules:dev', '--port', String(port), '--no-open'], 'dev', childEnv)
  await bounded(Promise.race([(async () => {
    for (;;) {
      assert.equal(dev.exitCode, null, 'Inspector exited before readiness')
      assert.equal(dev.signalCode, null, 'Inspector terminated before readiness')
      try {
        const response = await fetch(`${origin}/__connection.json`, { signal: AbortSignal.timeout(1000) })
        if (response.ok) {
          const connection = await response.json()
          assert.equal(connection.backend, 'websocket')
          assert.equal(connection.mcp, undefined, 'Automatic MCP must be disabled')
          break
        }
      }
      catch (error) {
        if (error.name === 'AssertionError')
          throw error
      }
      await new Promise(resolveWait => setTimeout(resolveWait, 100))
    }
  })(), dev.completion.then(({ code, signal }) => {
    throw new Error(`Inspector exited before readiness: code=${code}, signal=${signal}`)
  })]), 90_000, 'Inspector readiness')
  assert.deepEqual(await directoryNames(registry), [])
  browser = await chromium.launch()
  await exercise(origin, 'dev')
  await stop(dev)
  await run(['run', 'node-modules:build'], 'build', childEnv)
  const output = join(root, 'dist/__node-modules-inspector')
  const connection = JSON.parse(await readFile(join(output, '__connection.json'), 'utf8'))
  assert.equal(connection.backend, 'static')
  assert.equal(connection.mcp, undefined)
  const dump = JSON.parse(await readFile(join(output, '__rpc-dump/index.json'), 'utf8'))
  const query = dump['nmi:get-payload']
  assert.ok(query, 'Static payload must have a recorded query')
  const records = [...new Set([...Object.values(query.records), query.fallback].filter(Boolean))]
  assert.ok(records.length, 'Static payload must have a recorded response')
  for (const record of records) {
    assert.ok(resolve(output, record).startsWith(output + sep), 'Static record must stay inside build output')
    checkPayload(structuredCloneParse(await readFile(join(output, record), 'utf8')).output)
  }
  const staticSite = await serveStatic(output)
  await exercise(staticSite.origin, 'static', new Set(records.map(record => `/${record}`)))
  await close(staticSite.server)
  const attempts = existsSync(networkLog) ? (await readFile(networkLog, 'utf8')).trim().split('\n').filter(Boolean).map(line => JSON.parse(line)) : []
  assert.ok(attempts.every(attempt => attempt.expectedMetadata), 'Unexpected child network request')
  assert.deepEqual(await directoryNames(registry), [])
  assert.deepEqual(await directoryNames(globalRegistry), initialGlobalRegistry)
  console.log(JSON.stringify({ inspector: inspectorVersion, workspaces: inventory.length, packages: expected.size, views: diagnostics.views, metadataAttemptsBlocked: attempts.length, mcp: 'disabled', discovery: 'disabled' }))
}
catch (error) {
  primaryError = error
  throw error
}
finally {
  const cleanup = await Promise.allSettled([
    browser ? bounded(browser.close(), 10_000, 'Browser close') : Promise.resolve(),
    ...[...children].map(child => stop(child)),
    ...[...handles].map(server => close(server)),
  ])
  cleanupErrors = cleanup.filter(result => result.status === 'rejected').map(result => String(result.reason))
  await cleanupPreservingError(writeFile(join(artifacts, 'diagnostics.json'), `${JSON.stringify({ primaryError: primaryError?.stack, failures, cleanupErrors, ...diagnostics }, null, 2)}\n`), primaryError, 'diagnostic write')
  if (primaryError && cleanupErrors.length)
    console.error('Secondary Inspector cleanup failures:', cleanupErrors)
}
if (cleanupErrors.length)
  throw new AggregateError(cleanupErrors, 'Inspector smoke cleanup failed')
