import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './slider.spec'
import Slider from './fixtures/Slider.vue'

describe('slider vue browser tests', () => {
  it('renders correctly', async () => {
    render(Slider)
    await Tests.RendersCorrectly()
  })
})