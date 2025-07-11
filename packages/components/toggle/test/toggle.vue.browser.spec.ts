import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Toggle from '~/vue/toggle.vue'
import * as Tests from './toggle.spec'

describe('toggle vue browser tests', () => {
  it('renders correctly', async () => {
    render(Toggle)
    await Tests.RendersCorrectly()
  })
})
