import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('generated documentation JSON', () => {
  it.each(['api.json', 'data-attr.json'])('%s keeps the required final newline', (filename) => {
    const contents = readFileSync(new URL(`../data/${filename}`, import.meta.url), 'utf8')

    expect(() => JSON.parse(contents)).not.toThrow()
    expect(contents.endsWith('\n')).toBe(true)
  })
})
