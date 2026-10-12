import assert from 'node:assert/strict'
import { once } from 'node:events'
import { readFile, realpath, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from 'playwright/test'

const site = await realpath(fileURLToPath(new URL('../document/dist/', import.meta.url)))
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}
const failures = []
const warnings = []
const server = createServer(async (request, response) => {
  try {
    assert.ok(['GET', 'HEAD'].includes(request.method), 'Only static reads are supported')
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    let path = resolve(site, `.${pathname}`)
    assert.ok(path === site || path.startsWith(site + sep), 'Path escapes document/dist')
    if ((await stat(path)).isDirectory())
      path = join(path, 'index.html')
    path = await realpath(path)
    assert.ok(path.startsWith(site + sep), 'Resolved path escapes document/dist')
    const content = await readFile(path)
    response.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' })
    response.end(request.method === 'HEAD' ? undefined : content)
  }
  catch (error) {
    failures.push({ type: 'server', url: request.url, error: String(error) })
    response.writeHead(404)
    response.end('Not found')
  }
})

let browser
try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch()
  const context = await browser.newContext({
    // Seed storage before any client script, without resetting the value on reload.
    storageState: {
      cookies: [],
      origins: [{ origin, localStorage: [{ name: 'destyler-framework', value: 'vue' }] }],
    },
  })
  context.setDefaultTimeout(5000)
  const page = await context.newPage()
  page.on('pageerror', error => failures.push({ type: 'pageerror', error: error.stack || String(error) }))
  page.on('console', (message) => {
    const entry = { type: message.type(), text: message.text(), location: message.location() }
    if (entry.type === 'error')
      failures.push(entry)
    if (entry.type === 'warning') {
      warnings.push(entry)
      // Keep every warning, and reject Pagefind worker fallback or hydration warnings.
      if (/pagefind|hydration/i.test(entry.text))
        failures.push(entry)
    }
  })
  context.on('requestfailed', request => failures.push({
    type: 'requestfailed',
    url: request.url(),
    error: request.failure(),
  }))
  context.on('response', (response) => {
    if (response.status() >= 400)
      failures.push({ type: 'http', url: response.url(), status: response.status() })
  })

  const controls = page.locator('.select-framework-root')
  const codeGroup = page.locator('astro-island[component-url*="/CodeGroup."]')
  async function checkFramework(framework, label, filename) {
    await expect(controls).toHaveCount(2)
    await expect(controls.locator('.selected-label')).toHaveText([label, label])
    await expect(controls.locator('.select-framework-item[data-selected="true"]')).toHaveCount(2)
    await expect(controls.locator(`.select-framework-item[data-value="${framework}"][data-selected="true"]`)).toHaveCount(2)
    await expect(codeGroup).toHaveCount(1)
    await expect(codeGroup).not.toHaveAttribute('ssr')
    await expect(codeGroup.getByRole('tab', { selected: true })).toHaveText(filename)
    const snippet = codeGroup.locator('.code-container:visible')
    await expect(snippet).toHaveCount(1)
    await expect(snippet).toContainText(`from '@destyler/${framework}'`)
    await expect(snippet).toContainText('checkbox.connect(')
    assert.equal(await page.evaluate(() => localStorage.getItem('destyler-framework')), framework)
    console.log(JSON.stringify({ framework, filename, hydrated: true, visibleSnippet: true }))
  }

  await page.goto(`${origin}/components/checkbox/`)
  // Check every declared icon directly: browser favicon selection can be deferred
  // until after this smoke test's ordinary page and search interactions finish.
  const iconLinks = await page.locator('link[rel~="icon"]').evaluateAll(links => links.map(link => ({
    rel: link.getAttribute('rel'),
    href: link.getAttribute('href'),
    type: link.getAttribute('type'),
    media: link.getAttribute('media'),
  })))
  const iconResponses = []
  for (const icon of iconLinks) {
    const url = new URL(icon.href, origin)
    assert.equal(url.origin, origin, 'Documentation icons must be local assets')
    const response = await context.request.get(url.href)
    const content = await response.text()
    iconResponses.push({ ...icon, status: response.status(), contentType: response.headers()['content-type'], svg: /<svg\s[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(content) })
  }
  console.log(JSON.stringify({ documentationIcons: iconResponses }))
  assert.deepEqual(iconLinks, [
    { rel: 'icon', href: '/logo-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
    { rel: 'icon', href: '/logo-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    { rel: 'shortcut icon', href: '/logo-light.svg', type: 'image/svg+xml', media: null },
  ])
  assert(iconResponses.every(icon => icon.status === 200 && icon.contentType === 'image/svg+xml' && icon.svg), 'Every declared documentation icon must serve its real SVG asset')
  await checkFramework('vue', 'Vue', 'Checkbox.vue')
  const visibleControl = page.locator('.select-framework-root:visible')
  await visibleControl.locator('.select-framework-trigger').click()
  await visibleControl.locator('.select-framework-item[data-value="react"]').click()
  await checkFramework('react', 'React', 'Checkbox.react.tsx')
  await page.reload()
  await checkFramework('react', 'React', 'Checkbox.react.tsx')

  const search = page.locator('site-search')
  const dialog = search.locator('dialog')
  const input = search.locator('.pagefind-ui__search-input')
  await search.locator('[data-open-modal]').click()
  await expect(dialog).toBeVisible()
  for (const title of ['Checkbox', 'Dialog', 'Checkbox']) {
    await input.fill('')
    await expect(search.locator('.pagefind-ui__result-link')).toHaveCount(0)
    await input.fill(title)
    const href = `/components/${title.toLowerCase()}/`
    const result = search.locator(`.pagefind-ui__result-title > a[href="${href}"]`).first()
    await expect(result).toBeVisible()
    await expect(result).toHaveText(title)
    console.log(JSON.stringify({ query: title, title, href }))
  }
  assert.ok(page.workers().some(worker => worker.url() === `${origin}/pagefind/pagefind-worker.js`), 'Pagefind must use its native worker')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(page.locator('body')).not.toHaveAttribute('data-search-modal-open')
  await search.locator('[data-open-modal]').click()
  await expect(dialog).toBeVisible()
  await expect(input).toHaveValue('')
  await expect(search.locator('.pagefind-ui__result-link')).toHaveCount(0)
  await input.fill('Checkbox')
  const reopenedResult = search.locator('.pagefind-ui__result-title > a[href="/components/checkbox/"]').first()
  await expect(reopenedResult).toBeVisible()
  await expect(reopenedResult).toHaveText('Checkbox')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  assert.deepEqual(failures, [], 'Served documentation must have no runtime or request failures')
  console.log(JSON.stringify({ worker: '/pagefind/pagefind-worker.js', reopenedSearch: true, warnings, failures }))
}
catch (error) {
  console.error(JSON.stringify({ warnings, failures }))
  throw error
}
finally {
  try {
    await browser?.close()
  }
  finally {
    server.closeAllConnections()
    if (server.listening)
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
}
