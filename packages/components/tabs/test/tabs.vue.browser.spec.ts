import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Tabs from '~/vue/tabs.vue'
import * as Tests from './tabs.spec'

describe('tabs vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tabs)
    await Tests.RendersCorrectly()
  })
})
