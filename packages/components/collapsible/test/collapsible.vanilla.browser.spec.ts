import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './collapsible.spec'
import { Collapsible } from './fixtures/Collapsible.ts'

describe('collapsible vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Collapsible({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
