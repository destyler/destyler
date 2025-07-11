import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import HoverCard from './fixtures/HoverCard.react.tsx'
import { RendersCorrectly } from './hover-card.spec'

describe('hover-card react browser tests', () => {
  it('renders correctly', async () => {
    render(<HoverCard />)
    await RendersCorrectly()
  })
})
