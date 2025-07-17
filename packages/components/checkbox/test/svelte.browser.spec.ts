import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Checkbox from '~/svelte/checkbox.svelte'
import * as Tests from './spec'

describe('checkbox svelte browser tests', () => {
  it('should be checked when clicked', async () => {
    render(Checkbox)
    await Tests.ShouldBeCheckedWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    render(Checkbox)
    await Tests.ShouldBeFocusedWhenPageIsTabbed()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    render(Checkbox)
    await Tests.ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it('should have disabled attributes when disabled', async () => {
    render(Checkbox)
    await Tests.ShouldHaveDisabledAttributesWhenDisabled()
  })

  it('should not be focusable when disabled', async () => {
    render(Checkbox)
    await Tests.ShouldNotBeFocusableWhenDisabled()
  })
})
