import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './tooltip.spec'
import { Tooltip } from './fixtures/Tooltip.ts'

describe('tooltip vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tooltip({ root: document.body })
    await Tests.RendersCorrectly()
  })
})