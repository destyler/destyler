import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Tooltip from '~/vue/tooltip.vue'
import * as Tests from './tooltip.spec'

describe('tooltip vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tooltip)
    await Tests.RendersCorrectly()
  })
})
