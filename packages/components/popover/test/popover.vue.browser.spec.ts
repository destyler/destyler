import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './popover.spec'
import Popover from './fixtures/Popover.vue'

describe('popover vue browser tests', () => {
  it('renders correctly', async () => {
    render(Popover)
    await Tests.RendersCorrectly()
  })
})