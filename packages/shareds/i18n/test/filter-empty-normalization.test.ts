import { describe, expect, it } from 'vitest'
import { filter } from '../index'

describe('filter normalized empty substrings', () => {
  it.each(['-', '...', '—?!', '、。'])('matches the normalized empty suffix %s', (substring) => {
    const search = filter({ locale: 'en-US', ignorePunctuation: true })
    for (const string of ['abc', '', '!?']) {
      expect(search.startsWith(string, substring)).toBe(true)
      expect(search.contains(string, substring)).toBe(true)
      expect(search.endsWith(string, substring)).toBe(true)
    }
  })

  it('keeps empty raw substring matching independently of punctuation options', () => {
    for (const ignorePunctuation of [true, false]) {
      const search = filter({ ignorePunctuation })
      expect(search.startsWith('abc', '')).toBe(true)
      expect(search.contains('abc', '')).toBe(true)
      expect(search.endsWith('abc', '')).toBe(true)
    }
  })

  it('does not remove punctuation when it is significant', () => {
    const search = filter({ ignorePunctuation: false })
    expect(search.endsWith('abc', '-')).toBe(false)
    expect(search.endsWith('abc-', '-')).toBe(true)
  })

  it('still normalizes canonical equivalents and honors sensitivity for nonempty suffixes', () => {
    const search = filter({ locale: 'fr-FR', sensitivity: 'base', ignorePunctuation: true })
    expect(search.endsWith('cafe\u0301!', 'É.')).toBe(true)
    expect(search.endsWith('café', 'x')).toBe(false)
    expect(search.endsWith('ab', 'longer')).toBe(false)
    expect(search.endsWith('', 'a')).toBe(false)
  })
})
