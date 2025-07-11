import { describe, it } from 'vitest'
import { Popover } from './fixtures/Popover.ts'
// Vanilla JS - no render import needed
import * as Tests from './popover.spec'

describe('popover vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Popover({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
