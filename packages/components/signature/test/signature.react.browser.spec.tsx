import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Signature from './fixtures/Signature.react.tsx'
import { RendersCorrectly } from './signature.spec'

describe('signature react browser tests', () => {
  it('renders correctly', async () => {
    render(<Signature />)
    await RendersCorrectly()
  })
})
