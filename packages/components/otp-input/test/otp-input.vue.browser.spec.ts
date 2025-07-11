import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './otp-input.spec'
import OtpInput from './fixtures/OtpInput.vue'

describe('otp-input vue browser tests', () => {
  it('renders correctly', async () => {
    render(OtpInput)
    await Tests.RendersCorrectly()
  })
})