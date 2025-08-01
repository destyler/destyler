import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import utimer from '~/react/timer'
import { utimerTestSuite } from './spec'

let Tests: utimerTestSuite

describe('timer react browser tests', () => {
  beforeEach(async () => {
    render(<utimer />)
    Tests = new utimerTestSuite()
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
