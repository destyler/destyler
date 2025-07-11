import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './image.spec'
import Image from './fixtures/Image.vue'

describe('image vue browser tests', () => {
  it('renders correctly', async () => {
    render(Image)
    await Tests.RendersCorrectly()
  })
})