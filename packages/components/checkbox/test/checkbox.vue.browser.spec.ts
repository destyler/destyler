import { render } from 'vitest-browser-vue'
import { describe, it } from 'vitest'
import {
  ShouldBeCheckedWhenClicked,
  ShouldBeCheckedWhenSpacebarIsPressedWhileFocused,
  ShouldBeFocusedWhenPageIsTabbed,
  ShouldHaveDisabledAttributesWhenDisabled,
  ShouldNotBeFocusableWhenDisabled,
} from './checkbox.spec'
import Checkbox from './fixtures/Checkbox.vue'


describe('checkbox vue browser tests', () => {

  it('should be checked when clicked', async () => {
    render(Checkbox)
    await ShouldBeCheckedWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    render(Checkbox)
    await ShouldBeFocusedWhenPageIsTabbed()
  })

  it.skip('should be checked when spacebar is pressed while focused', async () => {
    render(Checkbox)
    await ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it('should have disabled attributes when disabled', async () => {
    render(Checkbox)
    await ShouldHaveDisabledAttributesWhenDisabled()
  })

  it.skip('should not be focusable when disabled', async () => {
    render(Checkbox)
    await ShouldNotBeFocusableWhenDisabled()
  })
})
