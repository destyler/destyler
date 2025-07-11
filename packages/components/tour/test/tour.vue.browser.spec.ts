import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './tour.spec'
import Tour from './fixtures/Tour.vue'

describe('tour vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tour)
    await Tests.RendersCorrectly()
  })
})