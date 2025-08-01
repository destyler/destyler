import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import usignature from '~/svelte/signature.svelte'
import { usignatureTestSuite } from './spec'

let Tests: usignatureTestSuite

describe('signature svelte browser tests', () => {
  beforeEach(async () => {
    render(usignature)
    Tests = new usignatureTestSuite()
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
