import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Slider from '~/react/slider'
import { SliderTestSuite } from './spec'

let Tests: SliderTestSuite

describe('slider react browser tests', () => {
  beforeEach(async () => {
    render(<Slider />)
    Tests = new SliderTestSuite()
  })

  it('should change value on drag', async () => {
    await Tests.ShouldChangeValueOnDrag()
  })

  it('should change value with arrow keys', async () => {
    await Tests.ShouldChangeValueWithArrowKeys()
  })

  it('should jump to min with home', async () => {
    await Tests.ShouldJumpToMinWithHome()
  })

  it('should jump to max with end', async () => {
    await Tests.ShouldJumpToMaxWithEnd()
  })

  it('should change value with page keys', async () => {
    await Tests.ShouldChangeValueWithPageKeys()
  })

  it('should be focusable with tab', async () => {
    await Tests.ShouldBeFocusableWithTab()
  })

  it('should have correct aria attributes', async () => {
    await Tests.ShouldHaveCorrectAriaAttributes()
  })

  it('should respect min max constraints', async () => {
    await Tests.ShouldRespectMinMaxConstraints()
  })

  it('should be disabled when required', async () => {
    await Tests.ShouldBeDisabledWhenRequired()
  })

  it('should click on track to set value', async () => {
    await Tests.ShouldClickOnTrackToSetValue()
  })

  it('should handle multiple thumbs in range', async () => {
    await Tests.ShouldHandleMultipleThumbsInRange()
  })
})