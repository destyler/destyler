import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Combobox from '~/vue/combobox.vue'
import * as Tests from './combobox.spec'

describe('combobox vue browser tests', () => {
  it('renders correctly', async () => {
    render(Combobox)
    await Tests.RendersCorrectly()
  })
})
