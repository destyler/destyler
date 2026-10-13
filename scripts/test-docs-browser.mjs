import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
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
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text) => { globalThis.__docsCopiedText = text } },
    })
  })
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
    const code = snippet.locator('pre.shiki > code')
    await expect(code).toContainText('<input')
    await expect(code.locator('script, input, label, template')).toHaveCount(0)
    const source = await code.textContent()
    await page.evaluate(() => {
      globalThis.__docsCopiedText = null
    })
    await codeGroup.locator('button[aria-label="复制代码"]:visible, button[aria-label="已复制"]:visible').click()
    await expect.poll(() => page.evaluate(() => globalThis.__docsCopiedText)).toBe(source)
    for (const theme of ['light', 'dark']) {
      // Exercise the existing theme CSS against actual highlighted token output.
      await page.evaluate((theme) => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        document.documentElement.dataset.theme = theme
      }, theme)
      const colors = await code.evaluate((element, theme) => {
        const token = [...element.querySelectorAll('span[style]')].find(token =>
          token.style.color && token.style.getPropertyValue('--shiki-dark'))
        if (!token)
          return null
        const sample = document.createElement('span')
        sample.style.color = theme === 'light' ? token.style.color : token.style.getPropertyValue('--shiki-dark')
        document.body.append(sample)
        const expected = getComputedStyle(sample).color
        sample.remove()
        return { expected, actual: getComputedStyle(token).color }
      }, theme)
      assert.ok(colors, `${framework}: both theme token colors are present`)
      assert.equal(colors.actual, colors.expected, `${framework}: ${theme} token CSS is applied`)
    }
    assert.equal(await page.evaluate(() => localStorage.getItem('destyler-framework')), framework)
    console.log(JSON.stringify({ framework, filename, hydrated: true, visibleSnippet: true, escaped: true, copyText: true, themes: ['light', 'dark'] }))
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
  for (const [framework, label, filename] of [
    ['solid', 'Solid', 'Checkbox.solid.tsx'],
    ['svelte', 'Svelte', 'Checkbox.svelte'],
    ['react', 'React', 'Checkbox.react.tsx'],
  ]) {
    await visibleControl.locator('.select-framework-trigger').click()
    await visibleControl.locator(`.select-framework-item[data-value="${framework}"]`).click()
    await checkFramework(framework, label, filename)
  }
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
  await page.goto(`${origin}/`)
  console.log(JSON.stringify({ homepage: true }))
  const homeSnippets = page.locator('.home-code')
  await expect(homeSnippets).toHaveCount(4)
  for (const [framework, label, lang, filename, sha256] of [
    ['vue', 'Vue', 'vue', 'Dialog.vue', '52f1b2a8a4fad9a67ca6e9ae2956a74a25ffae17073b3678fc64858d7d62d989'],
    ['solid', 'Solid', 'tsx', 'Dialog.tsx', '3a840c297b60fea93af8168a2432039fc9c1f053bd07ed49e889d02575d5887b'],
    ['svelte', 'Svelte', 'svelte', 'Dialog.svelte', 'abb4edd6b0c70ff88a0bd7430bebe984a16923741760a7ed1e81694f6b8175d9'],
    ['react', 'React', 'tsx', 'Dialog.tsx', '258babafd735d29f4790fc339dd4201470fd533f37fe2f320ed9bc1cdf4b713b'],
  ]) {
    // The docs selector persists the framework used by the homepage examples.
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto(`${origin}/components/checkbox/`)
    await expect(visibleControl).toHaveCount(1)
    await visibleControl.locator('.select-framework-trigger').click()
    await visibleControl.locator(`.select-framework-item[data-value="${framework}"]`).click()
    await expect(visibleControl.locator('.selected-label')).toHaveText(label)
    assert.equal(await page.evaluate(() => localStorage.getItem('destyler-framework')), framework)
    await page.goto(`${origin}/`)
    await expect(homeSnippets).toHaveCount(4)
    await expect(page.locator('.home-code:visible')).toHaveCount(1)
    const snippet = page.locator(`.framework-content[data-framework="${framework}"] .home-code`)
    await expect(snippet).toBeVisible()
    await expect(snippet.locator('.expressive-code')).toHaveClass(/\bmy-0!($|\s)/)
    await expect(snippet.locator('.title')).toHaveText(filename)
    const pre = snippet.locator('pre')
    await expect(pre).toHaveAttribute('data-language', lang)
    await expect(pre).toHaveAttribute('aria-label', `${filename} source code`)
    await expect(pre).toHaveAttribute('tabindex', '0')
    await expect(pre).toHaveAttribute('role', 'region')
    const button = snippet.locator('button[data-code]')
    const canonical = (await button.getAttribute('data-code')).replace(/\u007F/g, '\n')
    // These hashes bind the text to the old copy payload, including its exact whitespace.
    assert.equal(createHash('sha256').update(canonical).digest('hex'), sha256, `${framework}: canonical copy text`)
    // EC uses a newline as the visual placeholder for an otherwise empty line.
    assert.equal(await pre.locator('.ec-line .code').evaluateAll(lines => lines.map(line => line.textContent === '\n' ? '' : line.textContent).join('\n')), canonical)
    await expect(pre.locator('script, input, button, template')).toHaveCount(0)
    await page.evaluate(() => {
      globalThis.__docsCopiedText = null
    })
    await button.click()
    await expect.poll(() => page.evaluate(() => globalThis.__docsCopiedText)).toBe(canonical)
    await expect(snippet.locator('.copy [aria-live="polite"] .feedback')).toHaveText('Copied!')
    for (const viewport of [{ width: 1600, height: 900 }, { width: 390, height: 844 }]) {
      // Observe the real keyboard attempt without changing its actions or timeout.
      let keyboardTrace
      const diagnosticGaps = []
      try {
        keyboardTrace = await pre.evaluateHandle((element) => {
          const events = []
          const gaps = []
          let dropped = 0
          let droppedGaps = 0
          let controller
          let observer
          let boundary
          const started = performance.now()
          const identify = target => ({ tag: target?.tagName || null, pre: target === element })
          const attempt = (stage, action) => {
            try {
              action()
              return true
            }
            catch (error) {
              if (gaps.length < 8)
                gaps.push({ stage, error: String(error) })
              else
                droppedGaps++
              return false
            }
          }
          const record = (type, detail = {}) => {
            events.push({ at: performance.now() - started, type, focused: document.activeElement === element, ...detail })
            if (events.length > 64) {
              events.shift()
              dropped++
            }
          }
          const recordMutations = (records, delivery) => {
            for (const mutation of records)
              record('attribute', { delivery, target: identify(mutation.target), name: mutation.attributeName, oldValue: mutation.oldValue, value: mutation.target.getAttribute(mutation.attributeName) })
          }
          const stop = (reason) => {
            if (boundary)
              return
            boundary = { reason, at: performance.now() - started, drainedRecords: null, laterEventsCaptured: false }
            attempt('drain', () => {
              const records = observer?.takeRecords() || []
              boundary.drainedRecords = records.length
              recordMutations(records, 'tail-drain')
            })
            attempt('disconnect', () => observer?.disconnect())
            attempt('remove-listeners', () => controller?.abort())
          }
          const observeEvent = (event) => {
            if (boundary)
              return
            if (!attempt('event', () => record(event.type, { event, target: identify(event.target), key: event.key, defaultPreventedAtCapture: event.defaultPrevented, trusted: event.isTrusted, scrollTop: element.scrollTop, pageY: scrollY })))
              stop('event-gap')
          }
          if (!attempt('setup', () => {
            controller = new AbortController()
            for (const type of ['keydown', 'keyup', 'focusin', 'focusout', 'scroll', 'resize'])
              window.addEventListener(type, observeEvent, { capture: true, passive: true, signal: controller.signal })
            observer = new MutationObserver((records) => {
              if (boundary)
                return
              if (!attempt('mutations', () => recordMutations(records, 'callback')))
                stop('mutation-gap')
            })
            const attributes = { attributes: true, attributeOldValue: true, attributeFilter: ['tabindex', 'role', 'style', 'class', 'hidden', 'inert'] }
            observer.observe(element, attributes)
            observer.observe(element.closest('.framework-content'), attributes)
            record('installed')
          })) {
            stop('setup-gap')
          }
          return {
            finish() {
              stop('finish')
              const trace = { events: events.map(({ event, ...entry }) => ({ ...entry, defaultPreventedAtFinish: event?.defaultPrevented })), dropped, gaps, droppedGaps, boundary }
              attempt('snapshot', () => {
                const style = getComputedStyle(element)
                trace.final = {
                  connected: element.isConnected,
                  focus: { pre: document.activeElement === element, active: identify(document.activeElement), document: document.hasFocus() },
                  document: { visibility: document.visibilityState, fonts: document.fonts.status },
                  attributes: { tabindex: element.getAttribute('tabindex'), role: element.getAttribute('role') },
                  scroll: { top: element.scrollTop, left: element.scrollLeft, height: element.scrollHeight, width: element.scrollWidth },
                  client: { height: element.clientHeight, width: element.clientWidth },
                  bounds: element.getBoundingClientRect().toJSON(),
                  page: { x: scrollX, y: scrollY, width: innerWidth, height: innerHeight },
                  style: { overflowY: style.overflowY, display: style.display, visibility: style.visibility, scrollBehavior: style.scrollBehavior },
                }
              })
              trace.droppedGaps = droppedGaps
              return trace
            },
          }
        })
      }
      catch (error) {
        diagnosticGaps.push({ stage: 'install', error: String(error) })
      }
      try {
        await page.setViewportSize(viewport)
        const layout = await pre.evaluate((element) => {
          const style = getComputedStyle(element)
          return {
            maxHeight: Number.parseFloat(style.maxHeight),
            expectedMaxHeight: Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 35,
            overflowY: style.overflowY,
            height: element.getBoundingClientRect().height,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
          }
        })
        assert.equal(layout.maxHeight, layout.expectedMaxHeight, `${framework}: 35rem pre limit`)
        assert.equal(layout.overflowY, 'auto', `${framework}: pre owns vertical scrolling`)
        assert.ok(layout.height <= layout.maxHeight + 1, `${framework}: bounded code height`)
        assert.ok(layout.scrollHeight > layout.clientHeight, `${framework}: code scrolls vertically`)
        await expect(pre).toHaveAttribute('tabindex', '0')
        await expect(pre).toHaveAttribute('role', 'region')
        await pre.evaluate(element => element.scrollTop = 0)
        await pre.focus()
        await expect(pre).toBeFocused()
        const headerY = (await snippet.locator('.header').boundingBox()).y
        await page.keyboard.press('ArrowDown')
        await expect.poll(() => pre.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
        assert.equal((await snippet.locator('.header').boundingBox()).y, headerY, `${framework}: title stays outside the scroll area`)
      }
      finally {
        let trace
        try {
          trace = await keyboardTrace?.evaluate(trace => trace.finish())
        }
        catch (error) {
          diagnosticGaps.push({ stage: 'read', error: String(error) })
        }
        try {
          await keyboardTrace?.dispose()
        }
        catch (error) {
          diagnosticGaps.push({ stage: 'dispose', error: String(error) })
        }
        try {
          console.log(JSON.stringify({ homepageKeyboardScroll: { framework, filename, viewport, browser: browser.version(), trace, diagnosticGaps } }))
        }
        catch {
          // Diagnostic output must never replace the original assertion failure.
        }
      }
    }
    await page.setViewportSize({ width: 1280, height: 720 })
    assert.equal(await page.evaluate(() => localStorage.getItem('destyler-framework')), framework)
    console.log(JSON.stringify({ homepageFramework: framework, filename, sha256, copyText: true, feedback: true, keyboardScroll: true }))
  }
  const homeAssets = await homeSnippets.locator('link[rel="stylesheet"][href], script[src]').evaluateAll(elements => elements.map(element => element.getAttribute('href') || element.getAttribute('src')))
  assert.ok(homeAssets.some(url => url.endsWith('.css')), 'Homepage Code must include its current stylesheet')
  assert.ok(homeAssets.some(url => url.endsWith('.js')), 'Homepage Code must include its current runtime')
  for (const asset of new Set(homeAssets)) {
    const url = new URL(asset, origin)
    assert.equal(url.origin, origin, 'Homepage Code assets must be local')
    const response = await context.request.get(url.href)
    assert.equal(response.status(), 200, `Homepage Code asset must exist: ${url.pathname}`)
    assert.match(response.headers()['content-type'], url.pathname.endsWith('.css') ? /^text\/css/ : /^text\/javascript/)
  }
  await page.reload()
  await expect(page.locator('.framework-content[data-framework="react"] .home-code')).toBeVisible()
  await expect(page.locator('.home-code:visible')).toHaveCount(1)
  const buildCard = page.locator('a[href="https://github.com/destyler/ui"]').filter({ has: page.locator('.build-image') })
  await expect(buildCard).toHaveCount(1)
  await expect(buildCard.locator('h3')).toHaveText('Destyler')
  await expect(buildCard).toContainText('Build scalable design systems with unstyled, accessible UI components')
  const buildImage = buildCard.getByRole('img', { name: 'Destyler logo', exact: true })
  await expect(buildImage).toHaveAttribute('src', '/logo-light.svg')
  const imageSource = new URL(await buildImage.getAttribute('src'), origin)
  assert.equal(imageSource.origin, origin, 'The homepage showcase image must be local')
  const imageResponse = await context.request.get(imageSource.href)
  assert.equal(imageResponse.status(), 200, 'The homepage showcase image must serve successfully')
  assert.equal(imageResponse.headers()['content-type'], 'image/svg+xml')
  const decodedImage = await buildImage.evaluate(async (image) => {
    await image.decode()
    return { complete: image.complete, width: image.naturalWidth, height: image.naturalHeight, src: image.currentSrc }
  })
  assert.ok(decodedImage.complete && decodedImage.width > 0 && decodedImage.height > 0, 'The homepage showcase image must decode')
  assert.equal(decodedImage.src, imageSource.href)
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
      document.documentElement.dataset.theme = theme
    }, theme)
    for (const viewport of [{ width: 1600, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      await expect(buildImage).toBeVisible()
      const imageLayout = await buildImage.evaluate((image) => {
        const bounds = image.getBoundingClientRect()
        const container = image.parentElement.getBoundingClientRect()
        const style = getComputedStyle(image)
        return {
          width: bounds.width,
          height: bounds.height,
          left: bounds.left,
          right: bounds.right,
          top: bounds.top,
          bottom: bounds.bottom,
          container: { width: container.width, height: container.height, left: container.left, right: container.right, top: container.top, bottom: container.bottom },
          rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
          objectFit: style.objectFit,
          filter: style.filter,
        }
      })
      assert.ok(imageLayout.width > 0 && imageLayout.height > 0, 'The showcase logo must have visible dimensions')
      assert.ok(imageLayout.width <= 10 * imageLayout.rootFontSize + 1 && imageLayout.height <= 10 * imageLayout.rootFontSize + 1, 'The showcase logo must stay within 10rem')
      assert.ok(imageLayout.container.height <= 13 * imageLayout.rootFontSize + 1, 'The showcase image area must stay within 13rem')
      assert.ok(imageLayout.left >= imageLayout.container.left && imageLayout.right <= imageLayout.container.right, 'The showcase logo must fit horizontally')
      assert.ok(imageLayout.top >= imageLayout.container.top && imageLayout.bottom <= imageLayout.container.bottom, 'The showcase logo must fit vertically')
      assert.equal(imageLayout.objectFit, 'contain')
      assert.equal(imageLayout.filter, theme === 'dark' ? 'invert(1)' : 'none', `The showcase logo must match the ${theme} theme`)
    }
  }
  await page.setViewportSize({ width: 1280, height: 720 })
  console.log(JSON.stringify({ homepageShowcaseImage: decodedImage, local: true, themes: ['light', 'dark'], bounded: true }))
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
