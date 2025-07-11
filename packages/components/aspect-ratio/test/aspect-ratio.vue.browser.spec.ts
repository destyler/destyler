import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './aspect-ratio.spec'
import AspectRatio from './fixtures/AspectRatio.vue'

describe('aspect-ratio vue browser tests', () => {
  it('renders correctly', async () => {
    render(AspectRatio)
    await Tests.RendersCorrectly()
  })
})