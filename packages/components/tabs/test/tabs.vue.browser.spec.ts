import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './tabs.spec'
import Tabs from './fixtures/Tabs.vue'

describe('tabs vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tabs)
    await Tests.RendersCorrectly()
  })
})