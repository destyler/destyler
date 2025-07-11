import { describe, it } from 'vitest'
import { Separator } from './fixtures/Separator.ts'
// Vanilla JS - no render import needed
import * as Tests from './separator.spec'

describe('separator vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Separator({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
