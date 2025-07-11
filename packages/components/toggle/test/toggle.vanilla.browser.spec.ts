import { describe, it } from 'vitest'
import { Toggle } from './fixtures/Toggle.ts'
// Vanilla JS - no render import needed
import * as Tests from './toggle.spec'

describe('toggle vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Toggle({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
