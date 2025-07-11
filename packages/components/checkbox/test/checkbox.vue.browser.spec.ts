import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './checkbox.spec'
import Checkbox from './fixtures/Checkbox.vue'

describe('checkbox vue browser tests', () => {
  it('renders correctly', async () => {
    render(Checkbox)
    await Tests.RendersCorrectly()
  })
})