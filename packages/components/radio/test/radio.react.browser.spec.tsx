import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Radio from './fixtures/Radio.react.tsx'
import { RendersCorrectly } from './radio.spec'

describe('radio react browser tests', () => {
  it('renders correctly', async () => {
    render(<Radio />)
    await RendersCorrectly()
  })
})
