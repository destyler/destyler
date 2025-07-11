import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './select.spec'
import Select from './fixtures/Select.vue'

describe('select vue browser tests', () => {
  it('renders correctly', async () => {
    render(Select)
    await Tests.RendersCorrectly()
  })
})