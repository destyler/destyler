import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './collapse.spec'
import { Collapse } from './fixtures/Collapse.ts'

describe('collapse vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Collapse({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
