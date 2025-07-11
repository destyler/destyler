import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './tooltip.spec'
import Tooltip from './fixtures/Tooltip.vue'

describe('tooltip vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tooltip)
    await Tests.RendersCorrectly()
  })
})