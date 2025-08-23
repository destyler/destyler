/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import OtpInput from '~/solid/otp-input'
import { OtpInputTestSuite } from './spec'

let Tests: OtpInputTestSuite

describe('solid browser tests', () => {
  beforeEach(() => {
    render(() => <OtpInput />)
    Tests = new OtpInputTestSuite()
  })

  it('on type: should move focus to the next input', async () => {
    await Tests.OnTypeShouldMoveFocusToTHeNextInput()
  })

  it('on type: should not allow multiple keys at once ', async () => {
    await Tests.OnTypeShouldNotAllowMultipleKeysAtOnce()
  })

  it('on backspace: should clear value and move focus to prev input', async () => {
    await Tests.OnBackspaceShouldClearValueAndMoveFocusToPrevInput()
  })

  it('on arrow: should change focus between inputs', async () => {
    await Tests.OnArrowShouldChangeFocusBetweenInputs()
  })

  it('on clear: should clear values and focus first', async () => {
    await Tests.OnClearShouldClearValuesAndFocusFirst()
  })

  it('on paste: should autofill all fields', async () => {
    await Tests.OnPasteShouldAutofillAllFields()
  })

  it('on paste: should autofill all fields if focused field is not empty', async () => {
    await Tests.OnPasteShouldAutofillAllFieldsIfFocusedFieldIsNotEmpty()
  })

  it('[different] should allow only single character', async () => {
    await Tests.DifferentShouldAllowOnlySingleCharacter()
  })

  it('[same] should allow only single character', async () => {
    await Tests.SameShouldAllowOnlySingleCharacter()
  })
})
