/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Popover from '~/solid/popover'
import { PopoverTestSuite } from './spec'

let Tests: PopoverTestSuite

describe('solid browser tests', () => {
  beforeEach(() => {
    render(() => <Popover />)
    Tests = new PopoverTestSuite()
  })

  it('[autoFocus=true] should move focus inside the popover content to the first focusable element', async () => {
    await Tests.AutoFocusShouldMoveFocusInsideThePopoverContentToTheFirstFocusableElement()
  })

  it('[autoFocus=false] should not focus the content', async () => {
    await Tests.AutoFocusFalseShouldNotFocusTheContent()
  })

  it('[keyboard] should open the Popover on press `Enter`', async () => {
    await Tests.KeyboardShouldOpenThePopoverOnPressEnter()
  })

  it('[keyboard] should close the Popover on press `Escape`', async () => {
    await Tests.KeyboardShouldCloseThePopoverOnPressEscape()
  })

  it('[keyboard / modal] on tab: should trap focus within popover content', async () => {
    await Tests.KeyboardModalOnTabShouldTrapFocusWithinPopoverContent()
  })

  it('[keyboard / non-modal] on tab outside: should move focus to next tabbable element after button', async () => {
    await Tests.KeyboardNonModalOnTabShouldMoveFocusToNextTabbableElementAfterButton()
  })

  it('[keyboard / non-modal] on shift-tab outside: should move focus to trigger', async () => {
    await Tests.KeyboardNonModalOnShiftTabShouldMoveFocusToTrigger()
  })

  it('[pointer] close the popover on click close button', async () => {
    await Tests.PointerCloseThePopoverOnClickCloseButton()
  })

  it('[pointer] should to open/close a popover on trigger click', async () => {
    await Tests.PointerShouldToOPenOrCloseAPopoverOnTriggerClick()
  })

  it('[pointer] when clicking outside on focusable element, should not re-focus the button', async () => {
    await Tests.PointerWhenClickingOutsideOnFocusableElementShouldNotReFocusTheButton()
  })
})
