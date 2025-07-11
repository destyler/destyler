import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Collapsible from '~/vue/collapsible.vue'
import * as Tests from './collapsible.spec'

describe('collapsible vue browser tests', () => {
  it('renders correctly', async () => {
    render(Collapsible)
    await Tests.RendersCorrectly()
  })
})
