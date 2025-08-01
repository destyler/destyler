import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import uimage from '~/vue/image.vue'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('image vue browser tests', () => {
  beforeEach(async () => {
    render(uimage)
    Tests = new ComponentTestSuite()
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
