import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import OtpInput from './fixtures/OtpInput.react.tsx'
import { RendersCorrectly } from './otp-input.spec'

describe('otp-input react browser tests', () => {
  it('renders correctly', async () => {
    render(<OtpInput />)
    await RendersCorrectly()
  })
})
