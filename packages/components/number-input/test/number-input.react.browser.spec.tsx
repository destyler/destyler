import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import NumberInput from './fixtures/NumberInput.react.tsx'
import { RendersCorrectly } from './number-input.spec'

describe('number-input react browser tests', () => {
  it('renders correctly', async () => {
    render(<NumberInput />)
    await RendersCorrectly()
  })
})
