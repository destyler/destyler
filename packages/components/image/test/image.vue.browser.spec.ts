import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Image from '~/vue/image.vue'
import * as Tests from './image.spec'

describe('image vue browser tests', () => {
  it('renders correctly', async () => {
    render(Image)
    await Tests.RendersCorrectly()
  })
})
