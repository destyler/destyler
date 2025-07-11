import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './number-input.spec'
import NumberInput from './fixtures/NumberInput.vue'

describe('number-input vue browser tests', () => {
  it('renders correctly', async () => {
    render(NumberInput)
    await Tests.RendersCorrectly()
  })
})