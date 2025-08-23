import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Tooltip from '~/vue/tooltip.vue'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('tooltip vue browser tests', () => {
  beforeEach(async () => {
    render(Tooltip)
    Tests = new ComponentTestSuite()
  })

  it("should open tooltip on hover interaction", async () => {
    await Tests.ShouldOpenTooltipOnHoverInteraction()
  })

  it("should show only one tooltip at a time", async () => {
    await Tests.ShouldShowOnlyOneTooltipAtATime()
  })

  it("should work with focus/blur", async () => {
    await Tests.ShouldWorkWithFocusBlur()
  })

  it("should work with focus/blur for multiple tooltips", async () => {
    await Tests.ShouldWorkWithFocusBlurForMultipleTooltips()
  })

  it("closes on esc press", async () => {
    await Tests.ClosesOnEscPress()
  })

})
