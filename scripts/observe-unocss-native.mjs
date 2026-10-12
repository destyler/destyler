// Temporary two-route upgrade evidence. Remove after candidate/main evidence is accepted.
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const baselineCommit = '6e5c746f6d9ab545b09cd72c530fe567b14106a5'
const baselineTree = '2c4eef668328c3635a16b6e20b8e38baefa61e4a'
const cleanCandidateTree = '73ce3e03b89022da1e895e893019f97921df8c11'
const scriptPath = 'scripts/observe-unocss-native.mjs'
const workflowPath = '.github/workflows/ci.yml'
const dependencies = {
  'document/package.json': '06930fc6aeb498e1f02546714185fcca25e5bb44',
  'package.json': '33edec5c81e6243c2b0aae61a64590a19f839dc6',
  'pnpm-lock.yaml': 'e182327761e3d16e93e5fd7646791621b0ba4e30',
  'pnpm-workspace.yaml': 'd591ed8186e69edd285b48fc34725ef371547823',
}
const temporarySteps = `      - name: Observe temporary UnoCSS native comparison
        if: matrix.node == 22
        run: >-
          pnpm exec node scripts/observe-unocss-native.mjs
          --baseline 6e5c746f6d9ab545b09cd72c530fe567b14106a5
          --candidate "$(git rev-parse HEAD)"
          --output "$RUNNER_TEMP/core-unocss-native-evidence"

      - name: Upload temporary UnoCSS native evidence
        if: always() && matrix.node == 22
        uses: actions/upload-artifact@v6
        with:
          name: core-unocss-native-evidence
          path: \${{ runner.temp }}/core-unocss-native-evidence
          if-no-files-found: error

`
const repo = process.cwd()
const args = {}
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i]
  assert(['--baseline', '--candidate', '--output'].includes(key) && !(key in args) && process.argv[i + 1], 'use --baseline SHA --candidate SHA --output NEW_DIRECTORY')
  args[key] = process.argv[i + 1]
}
assert(args['--output'], 'a new output directory is required')
const out = path.resolve(args['--output'])
await fs.mkdir(out) // Refuse to overwrite evidence from an earlier attempt.
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const blob = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
const sides = ['baseline', 'candidate']
const themes = ['light', 'dark']
const routes = ['checkbox', 'hover-card']
const manifest = { started: new Date().toISOString(), argv: process.argv, result: 'collection-failed', commands: [], sides: {}, cleanupErrors: [], failures: [], tools: { node: process.version, executable: process.execPath, platform: process.platform, arch: process.arch, osRelease: os.release() } }
const worktrees = []
const servers = []
let temporaryRoot
let browser
let expect

async function write(name, value) {
  const file = path.join(out, name)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(`${file}.tmp`, `${JSON.stringify(value, null, 2)}\n`)
  await fs.rename(`${file}.tmp`, file)
}
async function persist(stage) {
  manifest.stage = stage
  manifest.updated = new Date().toISOString()
  await write('manifest.json', manifest)
}
async function command(argv, cwd = repo, label = `command-${manifest.commands.length}`, timeout = 60000, extraEnv = {}) {
  const entry = { argv, cwd, label, timeout, started: new Date().toISOString() }
  manifest.commands.push(entry)
  await persist(`running:${label}`)
  const stdout = createWriteStream(path.join(out, `${label}.stdout`))
  const stderr = createWriteStream(path.join(out, `${label}.stderr`))
  const child = spawn(argv[0], argv.slice(1), { cwd, env: { ...process.env, ...extraEnv }, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] })
  let result = ''
  child.stdout.on('data', (bytes) => {
    stdout.write(bytes)
    result += bytes
  })
  child.stderr.on('data', bytes => stderr.write(bytes))
  const timer = setTimeout(() => {
    entry.timedOut = true
    try {
      if (process.platform === 'win32')
        child.kill('SIGKILL')
      else if (child.pid)
        process.kill(-child.pid, 'SIGKILL')
    }
    catch (error) {
      if (error.code !== 'ESRCH')
        entry.terminationError = String(error)
    }
  }, timeout)
  try {
    entry.exitCode = await new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('close', (code, signal) => {
        entry.signal = signal
        resolve(code)
      })
    })
  }
  catch (error) {
    entry.error = String(error)
    throw error
  }
  finally {
    clearTimeout(timer)
    await Promise.all([new Promise(resolve => stdout.end(resolve)), new Promise(resolve => stderr.end(resolve))])
    entry.finished = new Date().toISOString()
    await persist(`finished:${label}`)
  }
  assert.equal(entry.exitCode, 0, `${label} failed; raw stdout/stderr retained`)
  assert(!entry.timedOut, `${label} timed out`)
  return result.trimEnd()
}
async function cleanup(label, action) {
  let timer
  try {
    await Promise.race([action(), new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('cleanup timeout')), 30000)
    })])
  }
  catch (error) {
    manifest.cleanupErrors.push({ label, error: error.stack || String(error) })
    process.exitCode = 1
  }
  finally { clearTimeout(timer) }
}
async function fileHash(file) {
  const digest = createHash('sha256')
  for await (const bytes of createReadStream(file)) digest.update(bytes)
  return digest.digest('hex')
}
async function filesUnder(root, prefix = '') {
  const names = []
  for (const entry of await fs.readdir(path.join(root, prefix), { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) {
      names.push(...await filesUnder(root, name))
    }
    else {
      assert(entry.isFile(), `unexpected output type: ${name}`)
      names.push(name)
    }
  }
  return names.sort()
}
async function hashInputs(checkout, entries, verify = false) {
  const records = {}
  for (const { name, mode, oid } of entries) {
    const file = path.join(checkout, name)
    const stat = await fs.lstat(file)
    const bytes = stat.isSymbolicLink() ? Buffer.from(await fs.readlink(file)) : await fs.readFile(file)
    const actualMode = stat.isSymbolicLink() ? '120000' : stat.mode & 0o111 ? '100755' : '100644'
    records[name] = { mode: actualMode, blob: blob(bytes), sha256: hash(bytes) }
    if (verify) {
      assert.equal(actualMode, mode, name)
      assert.equal(records[name].blob, oid, name)
    }
  }
  return records
}
async function serve(site, side) {
  const root = await fs.realpath(site)
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }
  const server = createServer(async (request, response) => {
    try {
      assert(['GET', 'HEAD'].includes(request.method), 'Only static reads are supported')
      let file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`)
      assert(file === root || file.startsWith(root + path.sep), 'path escapes document/dist')
      if ((await fs.stat(file)).isDirectory())
        file = path.join(file, 'index.html')
      file = await fs.realpath(file)
      assert(file.startsWith(root + path.sep), 'resolved path escapes document/dist')
      const bytes = await fs.readFile(file)
      response.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' })
      response.end(request.method === 'HEAD' ? undefined : bytes)
    }
    catch (error) {
      manifest.failures.push({ side, type: 'static-server', url: request.url, error: error.stack || String(error) })
      response.writeHead(404)
      response.end('Not found')
    }
  })
  servers.push(server)
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  return `http://127.0.0.1:${server.address().port}`
}

// Fixed expected samples. Feature samples are conditional and never count as a pass when absent.
const inventory = []
for (const theme of themes) {
  for (const state of ['unchecked', 'checked', 'unchecked-again']) {
    for (const target of ['root', 'control', 'input', 'label']) inventory.push(`checkbox/${theme}/${state}/${target}`)
  }
  inventory.push(`checkbox/${theme}/checked/icon`)
  for (const target of ['panel', 'pre', 'tab', 'content', 'scrollbar-hide', 'syntax-span']) inventory.push(`checkbox/${theme}/code/${target}`)
  inventory.push(`checkbox/${theme}/code/line-hover`, `checkbox/${theme}/code/pre-scrolled`)
  for (const state of ['closed', 'open', 'closed-again']) inventory.push(`hover-card/${theme}/${state}/trigger`)
  inventory.push(`hover-card/${theme}/open/content`, `hover-card/${theme}/open/positioner`)
}
const conditionalInventory = themes.flatMap(theme => [`checkbox/${theme}/feature/flip`, `checkbox/${theme}/feature/icon`])
const screenshotInventory = themes.flatMap(theme => [`checkbox/${theme}/checked`, `checkbox/${theme}/code`, `hover-card/${theme}/open`])

async function visit(side, origin, route, theme, result) {
  const id = `${route}/${theme}`
  const visitRecord = { side, id, errors: [], console: [], requests: [], unmeasured: [], samples: {}, screenshots: [], transitions: [], counts: {}, stylesheetEvents: [] }
  result.visits.push(visitRecord)
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light' })
  context.setDefaultTimeout(10000)
  context.setDefaultNavigationTimeout(30000)
  const page = await context.newPage()
  page.on('pageerror', error => visitRecord.errors.push({ type: 'pageerror', error: error.stack || String(error) }))
  page.on('console', message => visitRecord.console.push({ type: message.type(), text: message.text(), location: message.location() }))
  context.on('requestfailed', request => visitRecord.requests.push({ type: 'requestfailed', url: request.url(), resourceType: request.resourceType(), error: request.failure(), local: request.url().startsWith(origin) }))
  context.on('response', (response) => {
    if (response.status() >= 400)
      visitRecord.requests.push({ type: 'http', url: response.url(), status: response.status(), resourceType: response.request().resourceType(), local: response.url().startsWith(origin) })
  })
  const cdp = await context.newCDPSession(page)
  const sheets = new Map()
  cdp.on('CSS.styleSheetAdded', ({ header }) => {
    sheets.set(header.styleSheetId, header)
    visitRecord.stylesheetEvents.push({ type: 'added', header })
  })
  cdp.on('CSS.styleSheetRemoved', ({ styleSheetId }) => {
    sheets.delete(styleSheetId)
    visitRecord.stylesheetEvents.push({ type: 'removed', styleSheetId })
  })
  async function save() {
    await write(`${side}.json`, result)
  }
  async function capture(key, locator, visible = true) {
    await expect(locator).toHaveCount(1)
    if (visible)
      await expect(locator).toBeVisible()
    const sample = await locator.evaluate((element) => {
      const cssPath = (node) => {
        const parts = []
        for (let el = node; el?.nodeType === 1; el = el.parentElement) {
          let index = 1
          for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
            if (sibling.localName === el.localName)
              index++
          }
          parts.unshift(`${CSS.escape(el.localName)}:nth-of-type(${index})`)
        }
        return parts.join(' > ')
      }
      const style = getComputedStyle(element)
      const properties = ['width', 'height', 'color', 'background-color', 'background-image', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-radius', 'box-shadow', 'font-family', 'font-size', 'font-weight', 'line-height', 'display', 'visibility', 'opacity', 'overflow-x', 'overflow-y', 'position', 'z-index', 'transform', 'max-height', 'scrollbar-width', 'scrollbar-color', 'mask-image', '-webkit-mask-image']
      const styles = Object.fromEntries(properties.map(name => [name, style.getPropertyValue(name)]))
      const rect = element.getBoundingClientRect()
      const pseudo = {}
      for (const name of ['::-webkit-scrollbar', '::-webkit-scrollbar-thumb', '::-webkit-scrollbar-track']) {
        const supported = CSS.supports(`selector(${name})`)
        pseudo[name] = { supported, values: supported ? Object.fromEntries(['width', 'height', 'display', 'background-color', 'border-radius'].map(property => [property, getComputedStyle(element, name).getPropertyValue(property)])) : null }
      }
      const styleSheets = [...document.styleSheets].map((sheet, order) => {
        const record = { order, href: sheet.href, disabled: sheet.disabled, media: sheet.media.mediaText, ownerPath: sheet.ownerNode ? cssPath(sheet.ownerNode) : null }
        try {
          record.rules = [...sheet.cssRules].map((rule, ruleOrder) => ({ ruleOrder, type: rule.type, cssText: rule.cssText }))
        }
        catch (error) { record.unmeasured = String(error) }
        return record
      })
      return { path: cssPath(element), html: element.outerHTML, tag: element.localName, classes: [...element.classList], styles, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, documentRect: { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height }, checked: 'checked' in element ? element.checked : null, state: element.getAttribute('data-state'), scroll: Object.fromEntries(['clientWidth', 'scrollWidth', 'clientHeight', 'scrollHeight', 'scrollTop', 'scrollLeft'].map(k => [k, element[k]])), layout: { width: element.offsetWidth, height: element.offsetHeight }, shikiDark: style.getPropertyValue('--shiki-dark'), pseudo, styleSheets, inlineStyle: element.getAttribute('style'), hover: element.matches(':hover'), animations: element.getAnimations().map(animation => ({ playState: animation.playState, currentTime: animation.currentTime })) }
    })
    // Chromium's matching engine handles nesting, pseudo selectors, inherited rules and at-rules.
    // Full raw protocol responses and ordered CSSOM sheets remain available for review.
    try {
      const { root } = await cdp.send('DOM.getDocument', { depth: 0 })
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sample.path })
      assert(nodeId, 'CDP target missing')
      sample.matchedStyles = await cdp.send('CSS.getMatchedStylesForNode', { nodeId })
      for (const sheet of sample.styleSheets) {
        if (!sheet.ownerPath) {
          sheet.unmeasured ||= 'stylesheet has no document owner'
          continue
        }
        const owner = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sheet.ownerPath })
        const { node } = await cdp.send('DOM.describeNode', { nodeId: owner.nodeId })
        sheet.backendNodeId = node.backendNodeId
      }
      sample.protocolSheets = []
      for (const header of sheets.values()) {
        const match = sample.styleSheets.find(sheet => sheet.backendNodeId === header.ownerNode)
        const entry = { ...header, documentOrder: match?.order ?? null }
        if (!match && header.origin === 'regular')
          entry.unmeasured = 'author stylesheet has no verified document-order mapping'
        try {
          const { text } = await cdp.send('CSS.getStyleSheetText', { styleSheetId: header.styleSheetId })
          entry.sha256 = hash(text)
          entry.file = `styles/${entry.sha256}.css`
          await fs.mkdir(path.join(out, 'styles'), { recursive: true })
          await fs.writeFile(path.join(out, entry.file), text)
        }
        catch (error) { entry.unmeasured = error.stack || String(error) }
        sample.protocolSheets.push(entry)
      }
    }
    catch (error) {
      sample.matchingRulesUnmeasured = error.stack || String(error)
      visitRecord.unmeasured.push({ key, area: 'matching-css', error: sample.matchingRulesUnmeasured })
    }
    for (const [pseudo, measurement] of Object.entries(sample.pseudo)) {
      if (!measurement.supported)
        visitRecord.unmeasured.push({ key, area: 'pseudo-element', pseudo, reason: 'browser reports unsupported selector' })
    }
    sample.ruleOrder = (sample.matchedStyles?.matchedCSSRules || []).map(({ rule, matchingSelectors }) => {
      const sheet = sample.protocolSheets?.find(sheet => sheet.styleSheetId === rule.styleSheetId)
      return { origin: rule.origin, documentOrder: sheet?.documentOrder ?? null, sourceURL: sheet?.sourceURL ?? null, styleSheetId: rule.styleSheetId, range: rule.style.range, selectorList: rule.selectorList, matchingSelectors, nestingSelectors: rule.nestingSelectors, media: rule.media, supports: rule.supports, layers: rule.layers, scopes: rule.scopes, containerQueries: rule.containerQueries, declarations: rule.style.cssProperties }
    }).sort((a, b) => (a.documentOrder ?? -1) - (b.documentOrder ?? -1) || (a.range?.startLine ?? -1) - (b.range?.startLine ?? -1) || (a.range?.startColumn ?? -1) - (b.range?.startColumn ?? -1))
    for (const sheet of sample.styleSheets) {
      if (sheet.unmeasured)
        visitRecord.unmeasured.push({ key, area: 'cssom', sheet: sheet.order, error: sheet.unmeasured })
    }
    for (const sheet of sample.protocolSheets || []) {
      if (sheet.unmeasured)
        visitRecord.unmeasured.push({ key, area: 'cdp-stylesheet', sheet: sheet.styleSheetId, error: sheet.unmeasured })
    }
    visitRecord.samples[key] = sample
    result.samples[key] = sample
    await save()
    return sample
  }
  async function screenshot(key, locator) {
    const name = `${side}-${key.replaceAll('/', '-')}.png`
    await locator.screenshot({ path: path.join(out, name) }) // Do not freeze animations or inject CSS.
    visitRecord.screenshots.push({ key, file: name, sha256: await fileHash(path.join(out, name)) })
    await save()
  }
  try {
    await save()
    await cdp.send('DOM.enable')
    await cdp.send('CSS.enable')
    await page.goto(`${origin}/components/${route}/`)
    const code = page.locator('astro-island[component-url*="/CodeGroup."]')
    await expect(code).toHaveCount(1)
    await expect(code).not.toHaveAttribute('ssr')
    const title = route === 'checkbox' ? 'Checkbox' : 'HoverCard'
    const tab = code.getByRole('tab', { selected: true })
    await expect(tab).toHaveText(`${title}.react.tsx`)
    const before = await tab.textContent()
    await page.locator('button[aria-label="Select theme"]').click()
    await page.locator(`button[data-theme-value="${theme}"]`).click()
    await page.locator('.popover-close').click()
    await expect(page.locator('html')).toHaveClass(new RegExp(`(?:^|\\s)${theme}(?:\\s|$)`))
    const picker = page.locator('.select-framework-root:visible')
    await expect(picker).toHaveCount(1)
    await picker.locator('.select-framework-trigger').click()
    await picker.locator('.select-framework-item[data-value="vue"]').click()
    await expect(picker.locator('.selected-label')).toHaveText('Vue')
    await expect(tab).toHaveText(`${title}.vue`)
    const preview = page.locator('.framework-layout').first().locator('.framework-content[data-framework="vue"]')
    await expect(preview).toBeVisible()
    await expect(preview.locator('astro-island[ssr]')).toHaveCount(0)
    await page.waitForFunction(() => document.fonts.status === 'loaded')
    visitRecord.fonts = await page.evaluate(() => [...document.fonts].map(font => ({ family: font.family, style: font.style, weight: font.weight, status: font.status })))
    visitRecord.transitions.push({ from: before, to: await tab.textContent(), framework: await page.evaluate(() => localStorage.getItem('destyler-framework')), theme: await page.evaluate(() => localStorage.getItem('theme')) })
    visitRecord.counts = await page.evaluate(() => Object.fromEntries(['.file-group-label', '.code-container .shiki', '.shiki .line', '.scrollbar-hide', '.framework-layout', 'astro-island[component-url*="/FeatureItem."]'].map(selector => [selector, document.querySelectorAll(selector).length])))
    visitRecord.hydratedDOM = await page.content()
    if (route === 'checkbox') {
      const root = preview.locator('[data-scope="checkbox"][data-part="root"]')
      const control = root.locator('[data-part="control"]')
      const input = root.locator('input[type="checkbox"]')
      const label = root.locator('[data-part="label"]')
      await root.scrollIntoViewIfNeeded()
      for (const state of ['unchecked', 'checked', 'unchecked-again']) {
        if (state !== 'unchecked')
          await label.click()
        const expected = state === 'checked'
        await expect(input).toBeChecked({ checked: expected })
        await expect(root).toHaveAttribute('data-state', expected ? 'checked' : 'unchecked')
        await expect(control).toHaveAttribute('data-state', expected ? 'checked' : 'unchecked')
        await page.mouse.move(0, 0)
        for (const [target, locator] of Object.entries({ root, control, input, label })) await capture(`${id}/${state}/${target}`, locator, target !== 'input')
        if (expected) {
          const icon = control.locator(':scope > div')
          const sample = await capture(`${id}/${state}/icon`, icon)
          assert(sample.rect.width > 0 && sample.rect.height > 0, 'check icon has no dimensions')
          assert(['mask-image', '-webkit-mask-image', 'background-image'].some(name => sample.styles[name] && sample.styles[name] !== 'none'), 'check icon has no CSS painting source')
          await screenshot(`${id}/checked`, preview)
        }
        else {
          await expect(control.locator(':scope > div')).toHaveCount(0)
        }
      }
      const panel = code.locator('.code-container:visible')
      const pre = panel.locator('pre.shiki')
      await panel.scrollIntoViewIfNeeded()
      const targets = { panel, pre, tab, 'content': code.locator('[data-scope="tabs"][data-part="content"]:visible'), 'scrollbar-hide': code.locator('.scrollbar-hide'), 'syntax-span': pre.locator('span[style*="--shiki-dark"]').first() }
      for (const [target, locator] of Object.entries(targets)) {
        const sample = await capture(`${id}/code/${target}`, locator)
        if (target === 'syntax-span')
          assert(sample.shikiDark.trim(), 'the real syntax span must expose --shiki-dark')
      }
      const line = pre.locator('.line').first()
      await line.hover()
      const hovered = await capture(`${id}/code/line-hover`, line)
      assert(hovered.hover, 'line must actually be hovered')
      await pre.evaluate((element) => {
        element.scrollTop = element.scrollHeight
      })
      await expect.poll(() => pre.evaluate(element => Math.abs(element.scrollTop - Math.max(0, element.scrollHeight - element.clientHeight)))).toBeLessThanOrEqual(1)
      const scrolled = await capture(`${id}/code/pre-scrolled`, pre)
      assert(Math.abs(scrolled.scroll.scrollTop - Math.max(0, scrolled.scroll.scrollHeight - scrolled.scroll.clientHeight)) <= 1, 'pre did not reach its actual scroll bottom')
      visitRecord.codeScrollExercised = scrolled.scroll.scrollHeight > scrolled.scroll.clientHeight
      if (!visitRecord.codeScrollExercised)
        visitRecord.unmeasured.push({ area: 'code-scroll', reason: 'actual code block does not overflow; no synthetic overflow added' })
      await screenshot(`${id}/code`, code)
      const feature = page.locator('astro-island[component-url*="/FeatureItem."]').first()
      await feature.scrollIntoViewIfNeeded()
      await expect(feature).not.toHaveAttribute('ssr')
      const flip = feature.locator('li > div:first-child > div:first-child')
      await expect(flip).toHaveCount(1)
      const deadline = Date.now() + 5000
      let found = false
      while (Date.now() < deadline) {
        found = await flip.evaluate(element => element.classList.contains('flip') && element.getAnimations().every(animation => animation.playState === 'finished'))
        if (found)
          break
        await page.waitForTimeout(100)
      }
      visitRecord.feature = { observedFlip: found, html: await feature.innerHTML(), waitBoundMs: 5000, reason: 'natural random timing; no state override or retry' }
      if (found) {
        const flipped = await capture(`${id}/feature/flip`, flip, false)
        if (!flipped.classes.includes('flip') || flipped.animations.some(animation => animation.playState !== 'finished'))
          visitRecord.unmeasured.push({ area: 'feature', reason: 'random state changed during capture' })
        const icon = await capture(`${id}/feature/icon`, flip.locator(':scope > div'), false)
        assert(icon.layout.width > 0 && icon.layout.height > 0, 'feature icon has no layout')
        const stillSettled = await flip.evaluate(element => element.classList.contains('flip') && element.getAnimations().every(animation => animation.playState === 'finished'))
        const comparable = stillSettled && flipped.classes.includes('flip') && flipped.animations.every(animation => animation.playState === 'finished')
        flipped.conditionalComparable = comparable
        icon.conditionalComparable = comparable
        visitRecord.feature.comparable = comparable
        if (!comparable)
          visitRecord.unmeasured.push({ area: 'feature', reason: 'the fixed icon did not remain in the same settled .flip state through capture' })
      }
      else {
        visitRecord.unmeasured.push({ area: 'feature', reason: 'fixed icon did not enter a settled .flip state within the observation bound' })
      }
    }
    else {
      const trigger = preview.locator('[data-scope="hover-card"][data-part="trigger"]')
      await trigger.scrollIntoViewIfNeeded()
      const triggerId = await trigger.getAttribute('id')
      assert.match(triggerId || '', /^hover-card:.+:trigger$/)
      const contentId = `${triggerId.slice(0, -'trigger'.length)}content`
      const content = page.locator(`[id=${JSON.stringify(contentId)}]`)
      await page.mouse.move(0, 0)
      await expect(content).toHaveCount(0)
      await capture(`${id}/closed/trigger`, trigger)
      await trigger.hover()
      await expect(trigger).toHaveAttribute('data-state', 'open')
      await expect(content).toBeVisible()
      await expect(content).toHaveAttribute('data-state', 'open')
      const positioner = content.locator('..')
      await expect(positioner).toHaveAttribute('data-part', 'positioner')
      assert(await positioner.evaluate(element => element.parentElement === document.body), 'selected popup must be teleported to body')
      await expect.poll(() => content.evaluate(element => element.getAnimations({ subtree: true }).filter(a => a.effect?.getTiming().iterations !== Infinity).every(a => a.playState === 'finished'))).toBe(true)
      await expect.poll(() => content.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
      for (const [target, locator] of Object.entries({ trigger, content, positioner })) await capture(`${id}/open/${target}`, locator)
      visitRecord.popup = { triggerId, contentId, externalAvatar: await content.locator('img').getAttribute('src') }
      await screenshot(`${id}/open`, positioner)
      await page.mouse.move(0, 0)
      await expect(content).toHaveCount(0)
      await expect(trigger).toHaveAttribute('data-state', 'closed')
      await capture(`${id}/closed-again/trigger`, trigger)
      visitRecord.popup.closedAgain = true
    }
    await page.waitForLoadState('networkidle')
    assert.equal(new URL(page.url()).pathname, `/components/${route}/`)
    visitRecord.completed = true
  }
  catch (error) {
    visitRecord.errors.push({ type: 'observation', error: error.stack || String(error) })
    visitRecord.completed = false
  }
  finally {
    await save()
    await cleanup(`context:${side}:${id}`, () => context.close())
    visitRecord.errors.push(...visitRecord.console.filter(entry => entry.type === 'error' || (entry.type === 'warning' && /pagefind|hydration/i.test(entry.text))))
    visitRecord.errors.push(...visitRecord.requests)
    await save()
  }
}

function compare(results) {
  const differences = []
  const expectedObservations = []
  const ruleOrderPairs = []
  const unresolved = (id, field, before, after) => differences.push({ id, field, before, after, classification: 'unresolved' })
  for (const id of [...inventory, ...conditionalInventory]) {
    const a = results.baseline.samples[id]
    const b = results.candidate.samples[id]
    if (!a || !b) {
      unresolved(id, 'sample-missing', Boolean(a), Boolean(b))
      continue
    }
    if (id.includes('/feature/') && (!a.conditionalComparable || !b.conditionalComparable)) {
      unresolved(id, 'conditional-state-unmeasured', a.conditionalComparable, b.conditionalComparable)
      continue
    }
    const featureIcon = id.endsWith('/feature/icon')
    ruleOrderPairs.push({ id, baseline: a.ruleOrder, candidate: b.ruleOrder, classification: 'raw-order-evidence-for-review' })
    if (featureIcon) {
      expectedObservations.push({ id, classification: 'expected', reason: 'natural rotating icon animation; compare untransformed layout dimensions, retain instantaneous transform/rectangles', baseline: { transform: a.styles.transform, rect: a.rect, documentRect: a.documentRect }, candidate: { transform: b.styles.transform, rect: b.rect, documentRect: b.documentRect } })
    }
    for (const key of Object.keys(a.styles)) {
      // The rotating icon's instantaneous animation transform is intentionally recorded only.
      if (featureIcon && key === 'transform')
        continue
      if (a.styles[key] !== b.styles[key])
        unresolved(id, `styles.${key}`, a.styles[key], b.styles[key])
    }
    for (const area of ['rect', 'documentRect']) {
      if (featureIcon)
        continue
      for (const key of ['x', 'y', 'width', 'height']) {
        if (Math.abs(a[area][key] - b[area][key]) > 0.5)
          unresolved(id, `${area}.${key}`, a[area][key], b[area][key])
      }
    }
    for (const key of ['checked', 'state', 'shikiDark', 'scroll', 'layout', 'pseudo']) {
      if (JSON.stringify(a[key]) !== JSON.stringify(b[key]))
        unresolved(id, key, a[key], b[key])
    }
  }
  return { differences, expectedObservations, ruleOrderPairs, geometryTolerancePx: 0.5, classification: differences.length ? 'unresolved-observed-differences' : 'no-observed-style-layout-difference', ruleOrder: 'Raw Chromium matching rules, nested contexts, stylesheet text and document order retained per live target; no selector/scope normalization or cascade-equivalence claim.', expectedNondeterminism: 'Feature source random states/timing and the rotating icon instantaneous transform are retained as observations, not equality assertions.', screenshots: 'Paired raw element screenshots retained for review; no automatic pixel-equality claim.' }
}

try {
  manifest.scriptSHA256 = await fileHash(fileURLToPath(import.meta.url))
  await write('coverage.json', { routes, themes, viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, inventory, conditionalInventory, screenshotInventory, visitsPerSide: 4, scope: 'Vue preview after real React-to-Vue switch; no other routes or frameworks' })
  assert.equal(args['--baseline'], baselineCommit)
  for (const side of sides) assert.match(args[`--${side}`] || '', /^[a-f0-9]{40}$/)
  assert.equal(args['--candidate'], await command(['git', 'rev-parse', 'HEAD']))
  assert.equal(await command(['git', 'rev-parse', `${baselineCommit}^{tree}`]), baselineTree)
  await command(['git', 'merge-base', '--is-ancestor', baselineCommit, args['--candidate']])
  const candidateTree = await command(['git', 'rev-parse', `${args['--candidate']}^{tree}`])
  const changed = (await command(['git', 'diff', '--name-only', '--no-renames', baselineCommit, args['--candidate']])).split('\n').filter(Boolean).sort()
  const temporaryValidation = candidateTree !== cleanCandidateTree
  assert.deepEqual(changed, [...Object.keys(dependencies), ...(temporaryValidation ? [scriptPath, workflowPath] : [])].sort())
  for (const [name, oid] of Object.entries(dependencies)) assert.equal(await command(['git', 'rev-parse', `${args['--candidate']}:${name}`]), oid, name)
  if (temporaryValidation) {
    const committedHelper = await command(['git', 'show', `${args['--candidate']}:${scriptPath}`])
    assert.equal(hash(`${committedHelper}\n`), manifest.scriptSHA256, 'running helper must equal the committed helper')
    const original = `${await command(['git', 'show', `${baselineCommit}:${workflowPath}`])}\n`
    const marker = '      - name: Report Coverage\n'
    assert.equal(original.split(marker).length, 2)
    assert.equal(`${await command(['git', 'show', `${args['--candidate']}:${workflowPath}`])}\n`, original.replace(marker, temporarySteps + marker), 'only the reviewed temporary steps may alter CI')
    const indexEnv = { GIT_INDEX_FILE: path.join(out, 'validation-strip.index') }
    await command(['git', 'read-tree', args['--candidate']], repo, undefined, 60000, indexEnv)
    await command(['git', 'update-index', '--force-remove', scriptPath], repo, undefined, 60000, indexEnv)
    const workflowBlob = await command(['git', 'rev-parse', `${baselineCommit}:${workflowPath}`])
    await command(['git', 'update-index', '--cacheinfo', '100644', workflowBlob, workflowPath], repo, undefined, 60000, indexEnv)
    assert.equal(await command(['git', 'write-tree', '--missing-ok'], repo, undefined, 60000, indexEnv), cleanCandidateTree)
  }
  else {
    assert.equal(candidateTree, cleanCandidateTree)
  }
  manifest.binding = { baselineCommit, baselineTree, candidateCommit: args['--candidate'], candidateTree, cleanCandidateTree, temporaryValidation, changed }
  manifest.tools.pnpm = await command(['pnpm', '--version'])
  assert.equal(manifest.tools.pnpm, '10.26.1')
  temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'core-unocss-native-'))
  manifest.temporaryRoot = temporaryRoot
  for (const side of sides) {
    const checkout = path.join(temporaryRoot, side)
    const commit = args[`--${side}`]
    worktrees.push(checkout)
    await command(['git', 'worktree', 'add', '--detach', '--no-checkout', checkout, commit])
    await command(['git', 'sparse-checkout', 'set', '--no-cone', '/*', '!/.specstory/'], checkout)
    await command(['git', 'checkout', '--detach', commit], checkout)
    assert.equal(await command(['git', 'status', '--porcelain'], checkout), '')
    const entries = (await command(['git', 'ls-files', '--stage', '-z'], checkout)).split('\0').filter(Boolean).map((line) => {
      const match = /^(\d{6}) ([a-f0-9]{40}) 0\t([\s\S]+)$/.exec(line)
      assert(match, 'unsupported or unmerged index entry')
      return { mode: match[1], oid: match[2], name: match[3] }
    })
    const materialized = []
    const excluded = []
    for (const entry of entries) {
      try {
        await fs.lstat(path.join(checkout, entry.name))
        materialized.push(entry)
      }
      catch (error) {
        assert(error.code === 'ENOENT' && entry.name.startsWith('.specstory/'))
        excluded.push(entry)
      }
    }
    const before = await hashInputs(checkout, materialized, true)
    const info = { commit, tree: await command(['git', 'rev-parse', `${commit}^{tree}`]), checkout, materialized, excluded, before }
    manifest.sides[side] = info
    await persist(`source-bound:${side}`)
    await command(['pnpm', 'install', '--frozen-lockfile'], checkout, `${side}-install`, 600000)
    assert.deepEqual(await hashInputs(checkout, materialized), before, 'install changed tracked source')
    await command(['pnpm', 'run', 'build'], checkout, `${side}-build`, 900000)
    await command(['pnpm', 'run', 'docs:build'], checkout, `${side}-docs`, 600000)
    info.afterBuild = await hashInputs(checkout, materialized)
    const mutationNames = Object.keys(before).filter(name => JSON.stringify(before[name]) !== JSON.stringify(info.afterBuild[name]))
    info.generatedMutations = mutationNames
    assert(mutationNames.every(name => ['packages/docs/data/api.json', 'packages/docs/data/data-attr.json'].includes(name)), 'unexpected tracked source change after normal build')
    for (const name of mutationNames) {
      const destination = path.join(out, 'generated', side, name)
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.copyFile(path.join(checkout, name), destination)
    }
    info.dist = path.join(checkout, 'document/dist')
    info.assets = {}
    for (const name of await filesUnder(info.dist)) info.assets[name] = await fileHash(path.join(info.dist, name))
    for (const name of Object.keys(info.assets).filter(name => /\.(?:html|css)$/.test(name))) {
      const destination = path.join(out, 'built', side, name)
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.copyFile(path.join(info.dist, name), destination)
    }
    await command(['pnpm', 'exec', 'node', 'scripts/test-docs-search.mjs'], checkout, `${side}-docs-search`, 60000)
    await command(['pnpm', 'exec', 'node', 'scripts/test-docs-browser.mjs'], checkout, `${side}-permanent-smoke`, 180000)
    await persist(`built:${side}`)
  }
  const runtimes = sides.map(side => createRequire(path.join(manifest.sides[side].checkout, 'package.json')))
  const versions = runtimes.map(require => require('playwright/package.json').version)
  assert.equal(versions[0], versions[1], 'paired browser library versions must agree')
  const { chromium, expect: assertions } = runtimes[1]('playwright/test')
  expect = assertions
  manifest.tools.playwright = versions[1]
  manifest.tools.nodeExecutableSHA256 = await fileHash(process.execPath)
  manifest.tools.chromiumExecutable = chromium.executablePath()
  manifest.tools.chromiumExecutableSHA256 = await fileHash(chromium.executablePath())
  browser = await chromium.launch({ headless: true, executablePath: manifest.tools.chromiumExecutable })
  manifest.tools.chromiumVersion = browser.version()
  const results = {}
  for (const side of sides) {
    const origin = await serve(manifest.sides[side].dist, side)
    results[side] = { origin, samples: {}, visits: [] }
    for (const theme of themes) {
      for (const route of routes) await visit(side, origin, route, theme, results[side])
    }
  }
  const comparison = compare(results)
  const visits = sides.flatMap(side => results[side].visits)
  const missing = sides.flatMap(side => inventory.filter(id => !results[side].samples[id]).map(id => ({ side, id })))
  const missingScreenshots = sides.flatMap(side => screenshotInventory.filter(key => !results[side].visits.flatMap(visit => visit.screenshots).some(screenshot => screenshot.key === key)).map(key => ({ side, key })))
  const unmeasured = visits.flatMap(visit => visit.unmeasured.map(item => ({ side: visit.side, visit: visit.id, ...item })))
  manifest.failures.push(...visits.flatMap(visit => visit.errors.map(error => ({ side: visit.side, visit: visit.id, ...error }))))
  await write('comparison.json', { ...comparison, missing, missingScreenshots, unmeasured })
  manifest.result = manifest.failures.length || missing.length || missingScreenshots.length ? 'collection-failed' : comparison.differences.length || unmeasured.length ? 'collected-unresolved-review-required' : 'collected-no-observed-style-layout-difference'
  process.exitCode = manifest.result === 'collection-failed' ? 1 : manifest.result === 'collected-unresolved-review-required' ? 2 : 0
}
catch (error) {
  manifest.error = error.stack || String(error)
  manifest.result = 'collection-failed'
  process.exitCode = 1
}
finally {
  for (const [side, info] of Object.entries(manifest.sides)) {
    try {
      info.finalInputs = await hashInputs(info.checkout, info.materialized)
      info.finalDiff = await command(['git', 'diff', '--binary'], info.checkout, `${side}-final-diff`)
      await write(`${side}-final-inputs.json`, info.finalInputs)
      for (const [name, record] of Object.entries(info.finalInputs)) {
        if (JSON.stringify(record) === JSON.stringify(info.before[name]))
          continue
        const destination = path.join(out, 'final-mutated-source', side, name)
        await fs.mkdir(path.dirname(destination), { recursive: true })
        await fs.copyFile(path.join(info.checkout, name), destination)
      }
      info.evidenceRetained = true
    }
    catch (error) {
      manifest.failures.push({ side, type: 'evidence-retention', error: error.stack || String(error) })
      process.exitCode = 1
    }
  }
  await persist('retained-before-cleanup')
  if (browser)
    await cleanup('browser', () => browser.close())
  for (const server of servers) {
    await cleanup('server', () => new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
      server.closeAllConnections()
    }))
  }
  for (const checkout of worktrees.toReversed()) {
    assert(temporaryRoot && path.dirname(checkout) === temporaryRoot)
    const info = Object.values(manifest.sides).find(info => info.checkout === checkout)
    if (info && !info.evidenceRetained) {
      manifest.cleanupErrors.push({ checkout, reason: 'worktree preserved because evidence retention failed' })
      continue
    }
    await cleanup(`worktree:${checkout}`, () => command(['git', 'worktree', 'remove', '--force', checkout], repo, undefined, 20000))
  }
  if (temporaryRoot && !manifest.cleanupErrors.some(error => error.checkout))
    await cleanup('temporary-root', () => fs.rmdir(temporaryRoot))
  if (manifest.cleanupErrors.length || manifest.failures.length || process.exitCode === 1)
    manifest.result = 'collection-failed'
  manifest.finished = new Date().toISOString()
  await persist('finished')
  const hashes = {}
  for (const name of await filesUnder(out)) hashes[name] = await fileHash(path.join(out, name))
  await write('SHA256SUMS.json', hashes)
  console.log(manifest.result, manifest.error || '')
}
