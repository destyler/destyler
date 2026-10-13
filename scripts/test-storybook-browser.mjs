import assert from 'node:assert/strict'
import { once } from 'node:events'
import { readFile, realpath, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from 'playwright/test'

// Exercise the production Astro/Vite output, including the bounded Lit Babel preset.
const site = await realpath(fileURLToPath(new URL('../storybook/dist/', import.meta.url)))
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' }
const failures = []
const server = createServer(async (request, response) => {
  try {
    assert.ok(['GET', 'HEAD'].includes(request.method), 'Only static reads are supported')
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    let path = resolve(site, `.${pathname}`)
    assert.ok(path === site || path.startsWith(site + sep), 'Path escapes storybook/dist')
    if ((await stat(path)).isDirectory())
      path = join(path, 'index.html')
    path = await realpath(path)
    assert.ok(path.startsWith(site + sep), 'Resolved path escapes storybook/dist')
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
  const context = await browser.newContext()
  const page = await context.newPage()
  page.on('pageerror', error => failures.push({ type: 'pageerror', url: page.url(), error: error.stack || String(error) }))
  page.on('console', (message) => {
    if (message.type() === 'error')
      failures.push({ type: 'console', text: message.text(), location: message.location() })
  })
  context.on('requestfailed', request => failures.push({ type: 'requestfailed', url: request.url(), error: request.failure() }))
  context.on('response', (response) => {
    if (response.status() >= 400)
      failures.push({ type: 'http', url: response.url(), status: response.status() })
  })

  const litRoute = '/stories/switch/storybook/lit/default/'
  await page.goto(origin + litRoute)
  const host = page.locator('destyler-switch')
  const toolbar = host.locator('destyler-toolbar')
  const visualizer = host.locator('destyler-state-visualizer')
  const input = host.locator('input[data-switch-hidden]')
  const root = host.locator('[data-scope="switch"][data-part="root"]')
  await expect(root).toBeVisible()
  await expect(toolbar.getByRole('button', { name: 'Controls', exact: true })).toBeVisible()
  await expect(input).not.toBeChecked()
  await expect(root).toHaveAttribute('data-state', 'unchecked')

  const semantics = await host.evaluate(async (element) => {
    await element.updateComplete
    const tags = ['destyler-switch', 'destyler-layout', 'destyler-toolbar', 'destyler-state-visualizer']
    const registeredWithStyles = tags.every((tag) => {
      const constructor = customElements.get(tag)
      return constructor && typeof constructor.styles?.cssText === 'string' && constructor.styles.cssText.length > 0
    })
    const Toolbar = customElements.get('destyler-toolbar')
    const Visualizer = customElements.get('destyler-state-visualizer')
    const freshToolbar = new Toolbar()
    const freshVisualizer = new Visualizer()
    const initialized = freshToolbar.viz === false && freshToolbar.controls === undefined && freshToolbar.activeIndex === 0
      && freshVisualizer.state === undefined && freshVisualizer.label === undefined && freshVisualizer.omit === undefined
    const properties = [[freshToolbar, ['viz', 'controls', 'activeIndex']], [freshVisualizer, ['state', 'label', 'omit']]]
    const privateAccessors = properties.every(([instance, names]) => names.every((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(instance), name)
      if (Object.hasOwn(instance, name) || typeof descriptor?.get !== 'function' || typeof descriptor?.set !== 'function')
        return false
      try {
        descriptor.get.call({})
        return false
      }
      catch (error) {
        return error instanceof TypeError
      }
    }))
    const fixtures = document.createElement('div')
    fixtures.hidden = true
    fixtures.append(freshToolbar, freshVisualizer)
    let booleanConversion, noReflection, attributeOptions
    try {
      document.body.append(fixtures)
      await Promise.all([freshToolbar.updateComplete, freshVisualizer.updateComplete])
      freshToolbar.setAttribute('viz', '')
      booleanConversion = freshToolbar.viz === true
      await freshToolbar.updateComplete
      freshToolbar.viz = false
      freshVisualizer.label = 'property label'
      await Promise.all([freshToolbar.updateComplete, freshVisualizer.updateComplete])
      // Check after connected updates: these actual decorators have reflect:false/default.
      noReflection = freshToolbar.hasAttribute('viz') && !freshVisualizer.hasAttribute('label')
      freshVisualizer.setAttribute('label', 'attribute label')
      freshToolbar.setAttribute('controls', 'ignored')
      freshVisualizer.setAttribute('state', 'ignored')
      attributeOptions = freshVisualizer.label === 'attribute label'
        && freshToolbar.controls === undefined && freshVisualizer.state === undefined
      await Promise.all([freshToolbar.updateComplete, freshVisualizer.updateComplete])
    }
    finally {
      fixtures.remove()
    }
    const activeToolbar = element.shadowRoot.querySelector('destyler-toolbar')
    await activeToolbar.updateComplete
    const controllerInitialization = typeof activeToolbar.controls?.subscribe === 'function'
      && activeToolbar.activeIndex === 0 && !activeToolbar.hasAttribute('controls')
    return { registeredWithStyles, initialized, privateAccessors, booleanConversion, noReflection, attributeOptions, controllerInitialization }
  })
  for (const [name, passed] of Object.entries(semantics))
    assert.equal(passed, true, `Built Lit semantics: ${name}`)

  await root.click()
  await expect(input).toBeChecked()
  await expect(root).toHaveAttribute('data-state', 'checked')
  await expect(root).toContainText('Feature is enabled')
  await input.press('Space')
  await expect(input).not.toBeChecked()
  await expect(root).toHaveAttribute('data-state', 'unchecked')
  const disabled = toolbar.getByTestId('disabled')
  await disabled.check()
  await expect(input).toBeDisabled()
  await disabled.uncheck()
  await expect(input).toBeEnabled()
  await root.click()
  await expect(input).toBeChecked()
  await toolbar.getByRole('button', { name: 'Visualizer', exact: true }).click()
  await expect(visualizer.locator('.state')).toBeVisible()
  await visualizer.evaluate(async (element) => {
    element.setAttribute('label', 'Browser state')
    await element.updateComplete
  })
  await expect(visualizer.locator('summary')).toHaveText('Browser state')
  await expect(visualizer.locator('.state')).toContainText(/"checked":\s*true/)
  await input.press('Space')
  await expect(input).not.toBeChecked()
  await expect(root).toHaveAttribute('data-state', 'unchecked')
  await expect(visualizer.locator('.state')).toContainText(/"checked":\s*false/)
  await toolbar.getByRole('button', { name: 'Controls', exact: true }).click()
  await expect(disabled).toBeVisible()
  await host.evaluate(async (element) => {
    const parent = element.parentNode
    const next = element.nextSibling
    element.remove()
    parent.insertBefore(element, next)
    await element.updateComplete
  })
  await expect(root).toBeVisible()
  await expect(input).toBeEnabled()
  const reconnectedChecked = await input.isChecked()
  await expect(root).toHaveAttribute('data-state', reconnectedChecked ? 'checked' : 'unchecked')
  await root.click()
  await expect(input).toBeChecked({ checked: !reconnectedChecked })
  await expect(root).toHaveAttribute('data-state', reconnectedChecked ? 'unchecked' : 'checked')
  assert.deepEqual(failures, [], 'Built Lit story must have no runtime or request failures')
  console.log(JSON.stringify({ route: litRoute, semantics, pointer: true, keyboard: true, controls: true, visualizer: true, reconnect: true, failures }))

  const reactRoute = '/stories/checkbox/storybook/react/default/'
  await page.goto(origin + reactRoute)
  const island = page.locator('astro-island[component-url*="/Checkbox.react."]')
  await expect(island).toHaveAttribute('client', 'only')
  await expect(island).not.toHaveAttribute('ssr')
  const checkbox = island.getByTestId('hidden-input')
  const checkboxRoot = island.locator('[data-scope="checkbox"][data-part="root"]')
  await expect(checkboxRoot).toBeVisible()
  const initiallyChecked = await checkbox.isChecked()
  await expect(checkboxRoot).toHaveAttribute('data-state', initiallyChecked ? 'checked' : 'unchecked')
  await checkboxRoot.click()
  await expect(checkbox).toBeChecked({ checked: !initiallyChecked })
  await expect(checkboxRoot).toHaveAttribute('data-state', initiallyChecked ? 'unchecked' : 'checked')
  await checkbox.press('Space')
  await expect(checkbox).toBeChecked({ checked: initiallyChecked })
  await expect(checkboxRoot).toHaveAttribute('data-state', initiallyChecked ? 'checked' : 'unchecked')
  assert.deepEqual(failures, [], 'Built Storybook must have no runtime or request failures')
  console.log(JSON.stringify({ route: reactRoute, clientOnlyMounted: true, initiallyChecked, pointer: true, keyboard: true, failures }))
}
catch (error) {
  console.error(JSON.stringify({ failures }))
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
