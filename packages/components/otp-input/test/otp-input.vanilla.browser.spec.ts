import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './otp-input.spec'
import { OtpInput } from './fixtures/OtpInput.ts'

describe('otp-input vanilla browser tests', () => {
  it('renders correctly', async () => {
    new OtpInput({ root: document.body })
    await Tests.RendersCorrectly()
  })
})