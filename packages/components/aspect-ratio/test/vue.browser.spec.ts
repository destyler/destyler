import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import AspectRatio from '../examples/AspectRatio.vue'
import { AspectRatioTestSuite } from './spec'

let Tests: AspectRatioTestSuite

describe('vue browser tests', () => {
  beforeEach(async () => {
    render(AspectRatio)
    Tests = new AspectRatioTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
