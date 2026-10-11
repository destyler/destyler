import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Window } from 'happy-dom'

const site = fileURLToPath(new URL('../document/dist/', import.meta.url))
const index = resolve(site, 'pagefind')
const basePath = pathToFileURL(index + sep).href
const window = new Window({
  url: 'https://docs.example/',
  settings: {
    disableJavaScriptEvaluation: true,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
  },
})
globalThis.window = window
globalThis.document = window.document
document.documentElement.lang = 'en'

// Load the real generated search index without starting a preview server.
globalThis.fetch = async (input) => {
  const url = new URL(String(input), basePath)
  assert.equal(url.protocol, 'file:')
  const file = fileURLToPath(url)
  assert.ok(file.startsWith(index + sep), `Unexpected search request: ${url}`)
  return new Response(await readFile(file), {
    headers: { 'content-type': file.endsWith('.json') ? 'application/json' : 'application/octet-stream' },
  })
}

const pagefind = await import(pathToFileURL(join(index, 'pagefind.js')).href)
try {
  await pagefind.options({ basePath, baseUrl: '/' })
  const cases = [
    ['Checkbox', 'Checkbox', '/components/checkbox/', /checkbox/i],
    ['indeterminate', 'Checkbox', '/components/checkbox/', /indeterminate/i],
    ['Dialog', 'Dialog', '/components/dialog/', /dialog/i],
    ['Checkbox', 'Checkbox', '/components/checkbox/', /checkbox/i],
  ]
  for (const [query, title, url, text] of cases) {
    const response = await pagefind.search(query)
    assert.ok(response.results.length > 0, `No results for ${query}`)
    const results = await Promise.all(response.results.slice(0, 20).map(result => result.data()))
    const result = results.find(result => result.url === url)
    assert.ok(result, `Missing ${url} in results for ${query}`)
    assert.equal(result.meta.title, title, `Incorrect title for ${url}`)
    assert.match(result.content, text, `Missing indexed content for ${query}`)
    assert.match(result.excerpt, text, `Missing search excerpt for ${query}`)
    await access(join(site, url, 'index.html'))
    console.log(JSON.stringify({ query, url, title: result.meta.title, excerpt: result.excerpt }))
  }
}
finally {
  await pagefind.destroy()
  await window.happyDOM.close()
}
