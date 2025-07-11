import { describe, it } from 'vitest'
import { Tooltip } from './fixtures/Tooltip.ts'
// Vanilla JS - no render import needed
import * as Tests from './tooltip.spec'

describe('tooltip vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tooltip({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
