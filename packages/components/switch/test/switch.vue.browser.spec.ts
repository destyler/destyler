import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './switch.spec'
import Switch from './fixtures/Switch.vue'

describe('switch vue browser tests', () => {
  it('renders correctly', async () => {
    render(Switch)
    await Tests.RendersCorrectly()
  })
})