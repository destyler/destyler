import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Check release tooling independently of browser tests.
import { test } from 'node:test'
import { inflateRawSync } from 'node:zlib'

const scriptUrl = new URL('../zip.ts', import.meta.url).href

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'destyler-zip-'))
  mkdirSync(join(directory, 'input'))
  writeFileSync(join(directory, 'input', 'message.txt'), 'Archive contents survive.\n')
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  return directory
}

function run(directory, source, destination) {
  // Isolate an unhandled stream error so it fails an assertion instead of
  // crashing the entire contract-test process.
  const code = `
    import { readFileSync } from 'node:fs';
    import { zipDirectory } from ${JSON.stringify(scriptUrl)};
    process.chdir(${JSON.stringify(directory)});
    try {
      const path = await zipDirectory(${JSON.stringify(source)}, ${JSON.stringify(destination)});
      let observation;
      try { observation = { bytes: readFileSync(path).toString('base64') }; }
      catch (error) { observation = { readError: error.code }; }
      console.log(JSON.stringify({ result: 'resolved', path, ...observation }));
    } catch (error) {
      console.log(JSON.stringify({ result: 'rejected', code: error.code, message: error.message }));
    }
  `
  const child = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '--eval', code], {
    encoding: 'utf8',
    timeout: 10000,
  })
  assert.equal(child.error, undefined, child.error?.message)
  assert.equal(child.status, 0, child.stderr)
  return JSON.parse(child.stdout.trim())
}

test('archive completes before resolving and preserves file contents', (t) => {
  const directory = fixture(t)
  const result = run(directory, 'input', 'archive')
  assert.equal(result.result, 'resolved')
  assert.equal(result.path, join(directory, 'archive.zip'))
  assert.equal(result.readError, undefined)
  // These are the bytes read inside the child immediately after awaiting the
  // promise, not after process exit has had a chance to finish pending writes.
  const data = Buffer.from(result.bytes, 'base64')
  const end = data.length - 22
  assert.equal(data.readUInt32LE(end), 0x06054B50)
  assert.equal(data.readUInt16LE(end + 10), 1)
  const central = data.readUInt32LE(end + 16)
  assert.equal(data.readUInt32LE(central), 0x02014B50)
  const compressedSize = data.readUInt32LE(central + 20)
  const local = data.readUInt32LE(central + 42)
  assert.equal(data.readUInt32LE(local), 0x04034B50)
  const method = data.readUInt16LE(local + 8)
  assert.ok(method === 0 || method === 8)
  const start = local + 30 + data.readUInt16LE(local + 26) + data.readUInt16LE(local + 28)
  const compressed = data.subarray(start, start + compressedSize)
  const contents = method === 0 ? compressed : inflateRawSync(compressed)
  assert.equal(contents.toString(), 'Archive contents survive.\n')
})

test('rejects a missing source through the returned promise', (t) => {
  const result = run(fixture(t), 'missing-input', 'archive')
  assert.equal(result.result, 'rejected')
  assert.match(result.message, /Source directory not found/)
})

test('rejects an output directory through the returned promise', (t) => {
  const directory = fixture(t)
  mkdirSync(join(directory, 'occupied.zip'))
  const result = run(directory, 'input', 'occupied.zip')
  assert.equal(result.result, 'rejected')
  assert.equal(result.code, 'EISDIR')
})

test('rejects an unavailable output parent through the returned promise', (t) => {
  const result = run(fixture(t), 'input', 'missing-parent/archive.zip')
  assert.equal(result.result, 'rejected')
  assert.equal(result.code, 'ENOENT')
})
