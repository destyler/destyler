import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Presence from './fixtures/Presence.react.tsx'
import { RendersCorrectly } from './presence.spec'

describe('presence react browser tests', () => {
  it('renders correctly', async () => {
    render(<Presence />)
    await RendersCorrectly()
  })
})
