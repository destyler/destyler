import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const consumer = fileURLToPath(new URL('.', import.meta.url))
const names = JSON.parse(await readFile(new URL('public-packages.json', import.meta.url), 'utf8'))
assert.ok(names.length > 0)
for (const name of names) {
  const directory = path.join(consumer, 'node_modules', name)
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'))
  assert.equal(manifest.name, name)
  // Wildcards also expose package metadata and declarations, which are not runtime
  // entry points. Explicit public entries and legacy main/module are all executed.
  const entries = Object.keys(manifest.exports).filter(entry => !entry.includes('*'))
  assert.ok(entries.includes('.'), `${name}: missing root entry`)
  for (const entry of entries) {
    const specifier = entry === '.' ? name : `${name}/${entry.slice(2)}`
    const imported = await import(specifier)
    const required = require(specifier)
    for (const key of Object.keys(imported))
      assert.equal(required[key], imported[key], `${specifier}: import and require disagree on ${key}`)
  }
  for (const field of ['main', 'module']) {
    if (manifest[field])
      await import(pathToFileURL(path.join(directory, manifest[field])).href)
  }
  console.log(`${name}: public import/require and legacy main/module entries passed`)
}
