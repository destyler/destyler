import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Slider from '~/vue/slider.vue'
import * as Tests from './slider.spec'

describe('slider vue browser tests', () => {
  it('renders correctly', async () => {
    render(Slider)
    await Tests.RendersCorrectly()
  })
})
