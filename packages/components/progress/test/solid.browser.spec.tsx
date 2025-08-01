import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import uprogress from '~/solid/progress'
import { uprogressTestSuite } from './spec'

let Tests: uprogressTestSuite

describe('progress solid browser tests', () => {
  beforeEach(async () => {
    render(uprogress)
    Tests = new uprogressTestSuite()
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
