import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RendersCorrectly } from './aspect-ratio.spec'
import AspectRatio from './fixtures/AspectRatio.vue'

describe('aspect-ratio vue browser tests', () => {
  it('renders correctly', async () => {
    render(AspectRatio)
    await RendersCorrectly()
  })
})
