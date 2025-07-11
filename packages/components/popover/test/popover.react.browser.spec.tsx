import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Popover from './fixtures/Popover.react.tsx'
import { RendersCorrectly } from './popover.spec'

describe('popover react browser tests', () => {
  it('renders correctly', async () => {
    render(<Popover />)
    await RendersCorrectly()
  })
})
