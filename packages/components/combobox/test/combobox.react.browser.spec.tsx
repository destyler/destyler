import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './combobox.spec'
import Combobox from './fixtures/Combobox.react.tsx'

describe('combobox react browser tests', () => {
  it('renders correctly', async () => {
    render(<Combobox />)
    await RendersCorrectly()
  })
})
