import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Toggle from '~/react/tooltip'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('toggle react browser tests', () => {
  beforeEach(async () => {
    render(<Toggle />)
    Tests = new ComponentTestSuite()
  })

  it('should open tooltip on hover interaction', async () => {
    await Tests.ShouldOpenTooltipOnHoverInteraction()
  })

  it('should show only one tooltip at a time', async () => {
    await Tests.ShouldShowOnlyOneTooltipAtATime()
  })

  it('should work with focus/blur', async () => {
    await Tests.ShouldWorkWithFocusBlur()
  })

  it('should work with focus/blur for multiple tooltips', async () => {
    await Tests.ShouldWorkWithFocusBlurForMultipleTooltips()
  })

  it('closes on esc press', async () => {
    await Tests.ClosesOnEscPress()
  })
})
