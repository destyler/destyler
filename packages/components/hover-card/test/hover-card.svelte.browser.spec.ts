import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './hover-card.spec'
import HoverCard from './fixtures/HoverCard.svelte'

describe('hover-card svelte browser tests', () => {
  it('renders correctly', async () => {
    render(HoverCard)
    await Tests.RendersCorrectly()
  })
})