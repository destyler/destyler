import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Radio from '~/svelte/radio.svelte'
import { RadioTestSuite } from './spec'

let Tests: RadioTestSuite

describe('svelte browser tests', () => {
  beforeEach(() => {
    render(Radio)
    Tests = new RadioTestSuite()
  })

  it("should have aria-labelledby on root", async () => {
    await Tests.ShouldHaveAriaLabelledByOnRoot()
  })

  it("should be checked when clicked", async () => {
    await Tests.ShouldBeCheckedWhenClicked()
  })

  it("should be focused when page is tabbed", async () => {
    await Tests.ShouldBeFocusedWhenPageIsTabbed()
  })

  it("should be checked when spacebar is pressed while focused", async () => {
    await Tests.ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it("should have disabled attributes when disabled", async () => {
    await Tests.ShouldHaveDisabledAttributesWhenDisabled()
  })

  it("should not be focusable when disabled", async () => {
    await Tests.ShouldNotBeFocusableWhenDisabled()
  })

  it("should be focusable when readonly", async () => {
    await Tests.ShouldBeFocusableWhenReadonly()
  })

  it("should be focused on active radio item when page is tabbed", async () => {
    await Tests.ShouldBeFocusedOnActiveRadioItemWhenPageIsTabbed()
  })

  it("should check items when navigating by arrows", async () => {
    await Tests.ShouldCheckItemsWhenNavigatingByArrows()
  })
})
