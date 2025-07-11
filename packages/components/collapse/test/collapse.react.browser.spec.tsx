import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './collapse.spec'
import Collapse from './fixtures/Collapse.react.tsx'

describe('collapse react browser tests', () => {
  it('renders correctly', async () => {
    render(<Collapse />)
    await RendersCorrectly()
  })
})
