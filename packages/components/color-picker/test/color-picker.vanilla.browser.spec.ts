import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './color-picker.spec'
import { ColorPicker } from './fixtures/ColorPicker.ts'

describe('color-picker vanilla browser tests', () => {
  it('renders correctly', async () => {
    new ColorPicker({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
