import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './aspect-ratio.spec'
import AspectRatio from './fixtures/AspectRatio.react'

describe('aspect-ratio vue browser tests', () => {
  it('renders correctly', async () => {
    render(<AspectRatio />)
    await RendersCorrectly()
  })
})
