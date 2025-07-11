import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import NumberInput from '~/vue/number-input.vue'
import * as Tests from './number-input.spec'

describe('number-input vue browser tests', () => {
  it('renders correctly', async () => {
    render(NumberInput)
    await Tests.RendersCorrectly()
  })
})
