import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import OtpInput from './fixtures/OtpInput.svelte'
import * as Tests from './otp-input.spec'

describe('otp-input svelte browser tests', () => {
  it('renders correctly', async () => {
    render(OtpInput)
    await Tests.RendersCorrectly()
  })
})
