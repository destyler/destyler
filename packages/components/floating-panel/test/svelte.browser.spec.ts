import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import ufloatingpanel from '~/svelte/floating-panel.svelte'
import { ufloatingpanelTestSuite } from './spec'

let Tests: ufloatingpanelTestSuite

describe('floating-panel svelte browser tests', () => {
  beforeEach(async () => {
    render(ufloatingpanel)
    Tests = new ufloatingpanelTestSuite()
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
