import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Tooltip from './fixtures/Tooltip.react.tsx'
import { RendersCorrectly } from './tooltip.spec'

describe('tooltip react browser tests', () => {
  it('renders correctly', async () => {
    render(<Tooltip />)
    await RendersCorrectly()
  })
})
