import { describe, it } from 'vitest'
import { HoverCard } from './fixtures/HoverCard.ts'
// Vanilla JS - no render import needed
import * as Tests from './hover-card.spec'

describe('hover-card vanilla browser tests', () => {
  it('renders correctly', async () => {
    new HoverCard({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
