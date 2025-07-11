import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Slider from './fixtures/Slider.react.tsx'
import { RendersCorrectly } from './slider.spec'

describe('slider react browser tests', () => {
  it('renders correctly', async () => {
    render(<Slider />)
    await RendersCorrectly()
  })
})
