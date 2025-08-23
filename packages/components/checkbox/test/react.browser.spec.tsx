import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Checkbox from '~/react/checkbox'
import { CheckboxTestSuite } from './spec'

let Tests: CheckboxTestSuite

describe('checkbox react browser tests', () => {
  beforeEach(async () => {
    render(<Checkbox />)
    Tests = new CheckboxTestSuite()
  })

  it('should be checked when clicked', async () => {
    await Tests.ShouldBeCheckedWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    await Tests.ShouldBeFocusedWhenPageIsTabbed()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await Tests.ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it('should have disabled attributes when disabled', async () => {
    await Tests.ShouldHaveDisabledAttributesWhenDisabled()
  })

  it('should not be focusable when disabled', async () => {
    await Tests.ShouldNotBeFocusableWhenDisabled()
  })
})
