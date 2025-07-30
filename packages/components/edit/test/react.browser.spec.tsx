import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Edit from '~/react/edit'
import { EditTestSuite } from './spec'

let Tests: EditTestSuite

describe('svelte browser tests', () => {
  beforeEach(() => {
    render(<Edit />)
    Tests = new EditTestSuite()
  })

  it('on focus, input should be visible and focus', async () => {
    await Tests.OnFocusInputShouldBeVisibleAndFocus()
  })

  it('on focus and blur, should retain current value', async () => {
    await Tests.OnFocusAndBlurShouldRetaionCurrentValue()
  })

  it('on type, should commit input value', async () => {
    await Tests.OnTypeShouldCommitInputValue()
  })

  it('on type and esc, should revert value', async () => {
    await Tests.OnTypeAndEscShouldRevertValue()
  })

  it('on type and click submit, should commit value', async () => {
    await Tests.OnTypeAndClickSubmitShouldCommitValue()
  })

  it('on type and click outside, should commit value', async () => {
    await Tests.OnTypeAndClickOutsideShouldCommitValue()
  })

  it('[maxLength=4] should respect maxLength', async () => {
    await Tests.MaxLength4ShouldRespectMaxLength()
  })

  it('[activationMode=dblclick] on focus and blur, should retain current value', async () => {
    await Tests.ActivationModeDblClickOnFocusAndBlurShouldRetainCurrentValue()
  })

  it('on click edit, should enter edit mode', async () => {
    await Tests.OnClickEditShouldEnterEditMode()
  })
})
