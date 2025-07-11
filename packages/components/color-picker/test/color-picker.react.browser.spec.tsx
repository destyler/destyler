import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './color-picker.spec'
import ColorPicker from './fixtures/ColorPicker.react.tsx'

describe('color-picker react browser tests', () => {
  it('renders correctly', async () => {
    render(<ColorPicker />)
    await RendersCorrectly()
  })
})
