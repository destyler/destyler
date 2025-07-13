import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import ColorPicker from '~/vue/color-picker.vue'
import * as Tests from './color-picker.spec'

describe('color-picker vue browser tests', () => {
  it('typing the same native css colors switch show hex', async () => {
    render(ColorPicker)
    await Tests.TypeingTheSameNativeCssColorsSwitchShowHex()
  })

  it('typing different native css colors should update color', async () => {
    render(ColorPicker)
    await Tests.TypeingDifferentNativeCssColorsShouldUpdateColor()
  })

  it('typing in alpha should update color', async () => {
    render(ColorPicker)
    await Tests.TypingInAlphaShouldUpdateColor()
  })

  it('click on trigger should open picker', async () => {
    render(ColorPicker)
    await Tests.ClickOnTriggerShouldOpenPicker()
  })

  it('should re-focus trigger on outside click', async () => {
    render(ColorPicker)
    await Tests.ShouldReFocusTriggerOnOutsideClick()
  })

  it('opening the picker should focus area', async ()=>{
    render(ColorPicker)
    await Tests.OpeningThePickerShouldFocusArea()
  })

  it('keyboard focus movement', async ()=>{
    render(ColorPicker)
    await Tests.keyboardFocusMovement()
  })
})
