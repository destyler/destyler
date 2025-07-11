import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Switch from '~/vue/switch.vue'
import * as Tests from './switch.spec'

describe('switch vue browser tests', () => {
  it('renders correctly', async () => {
    render(Switch)
    await Tests.RendersCorrectly()
  })
})
