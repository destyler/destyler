import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Select from '~/vue/select.vue'
import * as Tests from './select.spec'

describe('select vue browser tests', () => {
  it('renders correctly', async () => {
    render(Select)
    await Tests.RendersCorrectly()
  })
})
