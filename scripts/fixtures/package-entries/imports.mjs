import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { assertDateRuntime } from './date-runtime.mjs'

const require = createRequire(import.meta.url)
const consumer = fileURLToPath(new URL('.', import.meta.url))
for (const name of ['@destyler/navigation-menu', '@destyler/scroll-area']) {
  const modern = await import(name)
  assert.equal(typeof modern.machine, 'function', `${name}: modern machine export`)
  assert.equal(typeof modern.connect, 'function', `${name}: modern connect export`)
  if (process.argv.includes('--legacy')) {
    // Resolving the installed package directory exercises Node's legacy main-field
    // resolver rather than exports. Loading its result still honors the ESM format.
    const entry = require.resolve(path.join(consumer, 'node_modules', name))
    const legacy = await import(pathToFileURL(entry).href)
    assert.equal(legacy.machine, modern.machine, `${name}: main and exports must agree`)
    assert.equal(legacy.connect, modern.connect, `${name}: main and exports must agree`)
  }
}

const date = await import('@destyler/date')
let dateEntry = date
if (process.argv.includes('--legacy')) {
  const entry = require.resolve(path.join(consumer, 'node_modules/@destyler/date'))
  dateEntry = await import(pathToFileURL(entry).href)
  assert.deepEqual(Object.keys(dateEntry), Object.keys(date))
  for (const name of Object.keys(date))
    assert.equal(dateEntry[name], date[name], `@destyler/date: ${name} main and exports must agree`)
}
assertDateRuntime(dateEntry)
