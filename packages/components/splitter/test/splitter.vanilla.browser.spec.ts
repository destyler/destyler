import { describe, it } from 'vitest'
import { Splitter } from './fixtures/Splitter.ts'
// Vanilla JS - no render import needed
import * as Tests from './splitter.spec'

describe('splitter vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Splitter({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
