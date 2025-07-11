import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Toggle from './fixtures/Toggle.react.tsx'
import { RendersCorrectly } from './toggle.spec'

describe('toggle react browser tests', () => {
  it('renders correctly', async () => {
    render(<Toggle />)
    await RendersCorrectly()
  })
})
