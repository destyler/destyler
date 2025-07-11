import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Splitter from './fixtures/Splitter.react.tsx'
import { RendersCorrectly } from './splitter.spec'

describe('splitter react browser tests', () => {
  it('renders correctly', async () => {
    render(<Splitter />)
    await RendersCorrectly()
  })
})
