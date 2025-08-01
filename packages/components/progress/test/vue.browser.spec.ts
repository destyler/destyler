import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Progress from '~/vue/progress.vue'
import { ProgressTestSuite } from './spec'

let Tests: ProgressTestSuite

describe('progress vue browser tests', () => {
  beforeEach(async () => {
    render(Progress)
    Tests = new ProgressTestSuite()
  })

  it('should display correct value', async () => {
    await Tests.ShouldDisplayCorrectValue()
  })

  it('should show visual progress', async () => {
    await Tests.ShouldShowVisualProgress()
  })

  it('should support indeterminate state', async () => {
    await Tests.ShouldSupportIndeterminateState()
  })

  it('should have correct aria label', async () => {
    await Tests.ShouldHaveCorrectAriaLabel()
  })

  it('should support custom range', async () => {
    await Tests.ShouldSupportCustomRange()
  })
})
