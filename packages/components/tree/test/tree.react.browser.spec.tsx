import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Tree from './fixtures/Tree.react.tsx'
import { RendersCorrectly } from './tree.spec'

describe('tree react browser tests', () => {
  it('renders correctly', async () => {
    render(<Tree />)
    await RendersCorrectly()
  })
})
