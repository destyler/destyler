import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './label.spec'
import Label from './fixtures/Label.vue'

describe('label vue browser tests', () => {
  it('renders correctly', async () => {
    render(Label)
    await Tests.RendersCorrectly()
  })
})