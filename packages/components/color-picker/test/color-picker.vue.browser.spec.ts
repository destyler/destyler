import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import ColorPicker from '~/vue/color-picker.vue'
import * as Tests from './color-picker.spec'

describe('color-picker vue browser tests', () => {
  it('renders correctly', async () => {
    render(ColorPicker)
    await Tests.RendersCorrectly()
  })
})
