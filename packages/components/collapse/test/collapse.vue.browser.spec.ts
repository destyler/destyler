import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './collapse.spec'
import Collapse from './fixtures/Collapse.vue'

describe('collapse vue browser tests', () => {
  it('renders correctly', async () => {
    render(Collapse)
    await Tests.RendersCorrectly()
  })
})