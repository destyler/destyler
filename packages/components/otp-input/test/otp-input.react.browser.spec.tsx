import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './otp-input.spec'
import OtpInput from './fixtures/OtpInput.react.tsx'

describe('otp-input react browser tests', () => {
  it('renders correctly', async () => {
    render(<OtpInput />)
    await RendersCorrectly()
  })
})
