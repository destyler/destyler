import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './floating-panel.spec'
import FloatingPanel from './fixtures/FloatingPanel.react.tsx'

describe('floating-panel react browser tests', () => {
  it('renders correctly', async () => {
    render(<FloatingPanel />)
    await RendersCorrectly()
  })
})
