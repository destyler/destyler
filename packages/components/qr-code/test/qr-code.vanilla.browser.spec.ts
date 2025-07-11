import { describe, it } from 'vitest'
import { QrCode } from './fixtures/QrCode.ts'
// Vanilla JS - no render import needed
import * as Tests from './qr-code.spec'

describe('qr-code vanilla browser tests', () => {
  it('renders correctly', async () => {
    new QrCode({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
