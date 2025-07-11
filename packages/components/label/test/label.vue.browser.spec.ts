import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Label from '~/vue/label.vue'
import * as Tests from './label.spec'

describe('label vue browser tests', () => {
  it('renders correctly', async () => {
    render(Label)
    await Tests.RendersCorrectly()
  })
})
