import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './combobox.spec'
import Combobox from './fixtures/Combobox.vue'

describe('combobox vue browser tests', () => {
  it('renders correctly', async () => {
    render(Combobox)
    await Tests.RendersCorrectly()
  })
})