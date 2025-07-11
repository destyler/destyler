import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './otp-input.spec'
import OtpInput from './fixtures/OtpInput.svelte'

describe('otp-input svelte browser tests', () => {
  it('renders correctly', async () => {
    render(OtpInput)
    await Tests.RendersCorrectly()
  })
})