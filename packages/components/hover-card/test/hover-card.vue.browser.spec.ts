import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import HoverCard from '~/vue/hover-card.vue'
import * as Tests from './hover-card.spec'

describe('hover-card vue browser tests', () => {
  it('renders correctly', async () => {
    render(HoverCard)
    await Tests.RendersCorrectly()
  })
})
