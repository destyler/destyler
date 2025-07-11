import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './number-input.spec'
import NumberInput from './fixtures/NumberInput.react.tsx'

describe('number-input react browser tests', () => {
  it('renders correctly', async () => {
    render(<NumberInput />)
    await RendersCorrectly()
  })
})
