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

  it('[keyboard] should work with arrow left/right keys', async () => {
    await Tests.KeyboardShouldWorkWithArrowLeftRightKeys()
  })

  it('[keyboard] should work with home/end keys', async () => {
    await Tests.KeyboardShouldWorkWithHomeAndEndKeys()
  })

  it('[keyboard] should work with shift key', async () => {
    await Tests.KeyboardShouldWorkWithShiftKey()
  })

  it('[keyboard] should work with page up/down keys', async () => {
    await Tests.KeyboardShouldWorkWithPageUpAndDownKeys()
  })

  it('[pointer] should set value on click track', async () => {
    await Tests.PointerShouldSetValueOnClickTrack()
  })

  it('[pointer] should set the value on drag', async () => {
    await Tests.PointerShouldSetValueOnDrag()
  })
})
