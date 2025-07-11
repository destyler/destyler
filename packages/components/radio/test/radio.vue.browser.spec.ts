import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './radio.spec'
import Radio from './fixtures/Radio.vue'

describe('radio vue browser tests', () => {
  it('renders correctly', async () => {
    render(Radio)
    await Tests.RendersCorrectly()
  })
})