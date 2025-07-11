import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import QrCode from './fixtures/QRCode.svelte'
import * as Tests from './qr-code.spec'

describe('qr-code svelte browser tests', () => {
  it('renders correctly', async () => {
    render(QrCode)
    await Tests.RendersCorrectly()
  })
})
