import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './hover-card.spec'
import HoverCard from './fixtures/HoverCard.react.tsx'

describe('hover-card react browser tests', () => {
  it('renders correctly', async () => {
    render(<HoverCard />)
    await RendersCorrectly()
  })
})
