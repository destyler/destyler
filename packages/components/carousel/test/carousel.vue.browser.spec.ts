import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './carousel.spec'
import Carousel from './fixtures/Carousel.vue'

describe('carousel vue browser tests', () => {
  it('renders correctly', async () => {
    render(Carousel)
    await Tests.RendersCorrectly()
  })
})