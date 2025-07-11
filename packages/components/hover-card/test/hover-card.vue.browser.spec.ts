import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './hover-card.spec'
import HoverCard from './fixtures/HoverCard.vue'

describe('hover-card vue browser tests', () => {
  it('renders correctly', async () => {
    render(HoverCard)
    await Tests.RendersCorrectly()
  })
})