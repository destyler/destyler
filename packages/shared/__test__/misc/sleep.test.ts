import { describe, expect, it, vi } from 'vitest'
import { sleep } from '../../src'

describe('sleep', () => {
  it('works', () => {
    let ok = false
    sleep(100).then(() => (ok = true))
    setTimeout(() => {
      expect(ok).toEqual(false)
    }, 0)
    setTimeout(() => {
      expect(ok).toEqual(true)
    }, 200)
  })
})
