import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './separator.spec'
import { Separator } from './fixtures/Separator.ts'

describe('separator vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Separator({ root: document.body })
    await Tests.RendersCorrectly()
  })
})