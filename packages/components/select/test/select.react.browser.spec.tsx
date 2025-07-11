import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Select from './fixtures/Select.react.tsx'
import { RendersCorrectly } from './select.spec'

describe('select react browser tests', () => {
  it('renders correctly', async () => {
    render(<Select />)
    await RendersCorrectly()
  })
})
