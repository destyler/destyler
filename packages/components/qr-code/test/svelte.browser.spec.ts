import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import uqrcode from '~/svelte/qr-code.svelte'
import { uqrcodeTestSuite } from './spec'

let Tests: uqrcodeTestSuite

describe('qr-code svelte browser tests', () => {
  beforeEach(async () => {
    render(uqrcode)
    Tests = new uqrcodeTestSuite()
  })

  it('should render correctly', async () => {
    await Tests.ShouldRenderCorrectly?.()
  })

  it('should have correct attributes', async () => {
    await Tests.ShouldHaveCorrectAttributes?.()
  })

  it('should be focusable when required', async () => {
    await Tests.ShouldBeFocusableWhenRequired?.()
  })

  it('should handle keyboard navigation', async () => {
    await Tests.ShouldHandleKeyboardNavigation?.()
  })

  it('should support disabled state', async () => {
    await Tests.ShouldSupportDisabledState?.()
  })
})
