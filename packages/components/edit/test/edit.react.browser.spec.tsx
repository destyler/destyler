import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './edit.spec'
import Edit from './fixtures/Edit.react.tsx'

describe('edit react browser tests', () => {
  it('renders correctly', async () => {
    render(<Edit />)
    await RendersCorrectly()
  })
})
