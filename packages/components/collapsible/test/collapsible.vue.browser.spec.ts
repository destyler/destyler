import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './collapsible.spec'
import Collapsible from './fixtures/Collapsible.vue'

describe('collapsible vue browser tests', () => {
  it('renders correctly', async () => {
    render(Collapsible)
    await Tests.RendersCorrectly()
  })
})