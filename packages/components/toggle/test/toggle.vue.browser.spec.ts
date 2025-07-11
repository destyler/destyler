import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './toggle.spec'
import Toggle from './fixtures/Toggle.vue'

describe('toggle vue browser tests', () => {
  it('renders correctly', async () => {
    render(Toggle)
    await Tests.RendersCorrectly()
  })
})