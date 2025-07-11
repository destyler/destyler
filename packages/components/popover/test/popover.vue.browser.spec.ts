import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Popover from '~/vue/popover.vue'
import * as Tests from './popover.spec'

describe('popover vue browser tests', () => {
  it('renders correctly', async () => {
    render(Popover)
    await Tests.RendersCorrectly()
  })
})
