import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Tour from './fixtures/Tour.react.tsx'
import { RendersCorrectly } from './tour.spec'

describe('tour react browser tests', () => {
  it('renders correctly', async () => {
    render(<Tour />)
    await RendersCorrectly()
  })
})
