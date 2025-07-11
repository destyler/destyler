import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import QrCode from './fixtures/QrCode.react'
import { RendersCorrectly } from './qr-code.spec'

describe('qr-code react browser tests', () => {
  it('renders correctly', async () => {
    render(<QrCode />)
    await RendersCorrectly()
  })
})
