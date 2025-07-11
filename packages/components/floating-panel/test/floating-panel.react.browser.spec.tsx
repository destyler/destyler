import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import FloatingPanel from './fixtures/FloatingPanel.react.tsx'
import { RendersCorrectly } from './floating-panel.spec'

describe('floating-panel react browser tests', () => {
  it('renders correctly', async () => {
    render(<FloatingPanel />)
    await RendersCorrectly()
  })
})
