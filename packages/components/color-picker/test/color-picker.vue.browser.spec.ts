import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './color-picker.spec'
import ColorPicker from './fixtures/ColorPicker.vue'

describe('color-picker vue browser tests', () => {
  it('renders correctly', async () => {
    render(ColorPicker)
    await Tests.RendersCorrectly()
  })
})