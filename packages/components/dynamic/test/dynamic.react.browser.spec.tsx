import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './dynamic.spec'
import Dynamic from './fixtures/Dynamic.react.tsx'

describe('dynamic react browser tests', () => {
  it('renders correctly', async () => {
    render(<Dynamic />)
    await RendersCorrectly()
  })
})
