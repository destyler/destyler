import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Tooltip from '~/react/tooltip'
import { TooltipTestSuite } from './spec'

let Tests: TooltipTestSuite

describe('tooltip react browser tests', () => {
  beforeEach(async () => {
    render(<Tooltip />)
    Tests = new TooltipTestSuite()
  })

  it('should show on hover', async () => {
    await Tests.ShouldShowOnHover()
  })

  it('should hide on unhover', async () => {
    await Tests.ShouldHideOnUnhover()
  })

  it('should show on focus', async () => {
    await Tests.ShouldShowOnFocus()
  })

  it('should hide on blur', async () => {
    await Tests.ShouldHideOnBlur()
  })

  it('should hide on escape', async () => {
    await Tests.ShouldHideOnEscape()
  })

  it('should respect delay', async () => {
    await Tests.ShouldRespectDelay()
  })

  it('should be focusable with tab', async () => {
    await Tests.ShouldBeFocusableWithTab()
  })

  it('should have correct aria attributes', async () => {
    await Tests.ShouldHaveCorrectAriaAttributes()
  })

  it('should position correctly', async () => {
    await Tests.ShouldPositionCorrectly()
  })

  it('should not show when disabled', async () => {
    await Tests.ShouldNotShowWhenDisabled()
  })

  it('should follow pointer', async () => {
    await Tests.ShouldFollowPointer()
  })
})
