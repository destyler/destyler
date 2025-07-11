import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Radio from '~/vue/radio.vue'
import * as Tests from './radio.spec'

describe('radio vue browser tests', () => {
  it('renders correctly', async () => {
    render(Radio)
    await Tests.RendersCorrectly()
  })
})
