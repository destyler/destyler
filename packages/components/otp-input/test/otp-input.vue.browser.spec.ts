import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import OtpInput from '~/vue/otp-input.vue'
import * as Tests from './otp-input.spec'

describe('otp-input vue browser tests', () => {
  it('renders correctly', async () => {
    render(OtpInput)
    await Tests.RendersCorrectly()
  })
})
