import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import usteps from '~/solid/steps'
import { ustepsTestSuite } from './spec'

let Tests: ustepsTestSuite

describe('steps solid browser tests', () => {
  beforeEach(async () => {
    render(usteps)
    Tests = new ustepsTestSuite()
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
