import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './clipboard.spec'
import Clipboard from './fixtures/Clipboard.react.tsx'

describe('clipboard react browser tests', () => {
  it('renders correctly', async () => {
    render(<Clipboard />)
    await RendersCorrectly()
  })
})
