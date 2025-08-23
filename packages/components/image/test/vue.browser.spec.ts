import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Image from '~/vue/image.vue'
import { ImageTestSuite } from './spec'

let Tests: ImageTestSuite

describe('image vue browser tests', () => {
  beforeEach(async () => {
    render(Image)
    Tests = new ImageTestSuite()
  })

  it('should render correctly', async () => {
    await Tests.ShouldRenderCorrectly()
  })
})
