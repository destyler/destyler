import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './floating-panel.spec'
import { FloatingPanel } from './fixtures/FloatingPanel.ts'

describe('floating-panel vanilla browser tests', () => {
  it('renders correctly', async () => {
    new FloatingPanel({ root: document.body })
    await Tests.RendersCorrectly()
  })
})