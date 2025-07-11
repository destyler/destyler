import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Tabs from './fixtures/Tabs.react.tsx'
import { RendersCorrectly } from './tabs.spec'

describe('tabs react browser tests', () => {
  it('renders correctly', async () => {
    render(<Tabs />)
    await RendersCorrectly()
  })
})
