import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import {
  ShouldBeCheckedWhenClicked,
  ShouldBeCheckedWhenSpacebarIsPressedWhileFocused,
  ShouldBeFocusedWhenPageIsTabbed,
  ShouldHaveDisabledAttributesWhenDisabled,
  ShouldNotBeFocusableWhenDisabled,
} from './checkbox.spec'
import Checkbox from './fixtures/Checkbox.svelte'

describe('checkbox svelte browser tests', () => {
  it('should be checked when clicked', async () => {
    render(Checkbox)
    await ShouldBeCheckedWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    render(Checkbox)
    await ShouldBeFocusedWhenPageIsTabbed()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    render(Checkbox)
    await ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it('should have disabled attributes when disabled', async () => {
    render(Checkbox)
    await ShouldHaveDisabledAttributesWhenDisabled()
  })

  it('should not be focusable when disabled', async () => {
    render(Checkbox)
    await ShouldNotBeFocusableWhenDisabled()
  })
})
