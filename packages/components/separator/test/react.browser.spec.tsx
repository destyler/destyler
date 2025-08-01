import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import udivider from '~/react/divider'
import { udividerTestSuite } from './spec'

let Tests: udividerTestSuite

describe('divider react browser tests', () => {
  beforeEach(async () => {
    render(<udivider />)
    Tests = new udividerTestSuite()
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
