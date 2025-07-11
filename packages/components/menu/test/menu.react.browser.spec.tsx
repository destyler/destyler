import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Menu from './fixtures/Menu.react.tsx'
import { RendersCorrectly } from './menu.spec'

describe('menu react browser tests', () => {
  it('renders correctly', async () => {
    render(<Menu />)
    await RendersCorrectly()
  })
})
