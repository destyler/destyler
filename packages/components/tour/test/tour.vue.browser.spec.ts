import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Tour from '~/vue/tour.vue'
import * as Tests from './tour.spec'

describe('tour vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tour)
    await Tests.RendersCorrectly()
  })
})
