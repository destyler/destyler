import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './popover.spec'
import { Popover } from './fixtures/Popover.ts'

describe('popover vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Popover({ root: document.body })
    await Tests.RendersCorrectly()
  })
})