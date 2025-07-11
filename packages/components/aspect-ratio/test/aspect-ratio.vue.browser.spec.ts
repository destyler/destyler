import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import AspectRatio from '~/vue/aspect-ratio.vue'
import * as Tests from './aspect-ratio.spec'

describe('aspect-ratio vue browser tests', () => {
  it('renders correctly', async () => {
    render(AspectRatio)
    await Tests.RendersCorrectly()
  })
})
