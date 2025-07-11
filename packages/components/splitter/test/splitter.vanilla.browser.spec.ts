import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './splitter.spec'
import { Splitter } from './fixtures/Splitter.ts'

describe('splitter vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Splitter({ root: document.body })
    await Tests.RendersCorrectly()
  })
})