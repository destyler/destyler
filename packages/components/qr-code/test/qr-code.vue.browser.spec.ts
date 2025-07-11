import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import QrCode from '~/vue/qr-code.vue'
import * as Tests from './qr-code.spec'

describe('qr-code vue browser tests', () => {
  it('renders correctly', async () => {
    render(QrCode)
    await Tests.RendersCorrectly()
  })
})
