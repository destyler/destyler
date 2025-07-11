import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Pagination from './fixtures/Pagination.react.tsx'
import { RendersCorrectly } from './pagination.spec'

describe('pagination react browser tests', () => {
  it('renders correctly', async () => {
    render(<Pagination />)
    await RendersCorrectly()
  })
})
