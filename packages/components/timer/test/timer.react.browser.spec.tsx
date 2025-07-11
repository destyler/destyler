import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Timer from './fixtures/Timer.react.tsx'
import { RendersCorrectly } from './timer.spec'

describe('timer react browser tests', () => {
  it('renders correctly', async () => {
    render(<Timer />)
    await RendersCorrectly()
  })
})
