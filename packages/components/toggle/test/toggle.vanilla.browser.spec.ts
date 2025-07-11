import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './toggle.spec'
import { Toggle } from './fixtures/Toggle.ts'

describe('toggle vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Toggle({ root: document.body })
    await Tests.RendersCorrectly()
  })
})