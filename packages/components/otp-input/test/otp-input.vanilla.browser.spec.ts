import { describe, it } from 'vitest'
import { OtpInput } from './fixtures/OtpInput.ts'
// Vanilla JS - no render import needed
import * as Tests from './otp-input.spec'

describe('otp-input vanilla browser tests', () => {
  it('renders correctly', async () => {
    new OtpInput({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
