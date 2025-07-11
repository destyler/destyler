import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './collapsible.spec'
import Collapsible from './fixtures/Collapsible.react.tsx'

describe('collapsible react browser tests', () => {
  it('renders correctly', async () => {
    render(<Collapsible />)
    await RendersCorrectly()
  })
})
