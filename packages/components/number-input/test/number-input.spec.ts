import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/NumberInput'

let mount: HTMLElement | null = null

async function seeInputHasValue(value: string) {
  const inputEl = testHook.getInputEl('number-input')
  await expect.element(inputEl).toHaveValue(value)
}

async function seeInputIsInvalid() {
  const inputEl = testHook.getInputEl('number-input')
  await expect.element(inputEl).toHaveAttribute('aria-invalid', 'true')
}

async function changeStep(step: string) {
  const stepInput = page.getByTestId('step')
  await stepInput.fill(step)
  await testHook.pressKey('Enter')
}

describe('number input browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('should allow typing empty string value', async () => {
    await testHook.type('number-input', '12')
    await testHook.pressKey('Backspace', 2)
    await seeInputHasValue('')
  })

  it('should clamp value when blurred', async () => {
    await testHook.type('number-input', '200')
    await seeInputIsInvalid()
    await testHook.clickOutside()
    await seeInputHasValue('100')
  })

  it('should clamp value when input is empty', async () => {
    await testHook.type('number-input', '5')
    await testHook.pressKey('Backspace')
    await testHook.clickOutside()
    await seeInputHasValue('')
  })

  it('should increment with arrow up', async () => {
    await testHook.type('number-input', '5')
    await testHook.pressKey('ArrowUp')
    await seeInputHasValue('6')
  })

  it('clicking increment', async () => {
    await testHook.clickTrigger('inc')
    await seeInputHasValue('1')
  })

  it('should decrement the value', async () => {
    await testHook.type('number-input', '5')
    await testHook.pressKey('ArrowDown', 2)
    await seeInputHasValue('3')
  })

  it('clicking decrement', async () => {
    await testHook.type('number-input', '5')
    await testHook.clickTrigger('dec')
    await seeInputHasValue('4')
  })

  it('pressing enter should make up/down still work', async () => {
    await testHook.type('number-input', '5')
    await testHook.pressKey('Enter')
    await testHook.pressKey('ArrowDown')
    await seeInputHasValue('4')

    await testHook.pressKey('ArrowUp')
    await seeInputHasValue('5')
  })

  it('should set value to min/max on home/end keys', async () => {
    await testHook.type('number-input', '5')
    await testHook.pressKey('Home')
    await seeInputHasValue('0')

    await testHook.pressKey('End')
    await seeInputHasValue('100')
  })

  it('shift+arrowup: should change 10 steps', async () => {
    await testHook.type('number-input', '0')

    await testHook.pressKey('ArrowUp')
    await seeInputHasValue('1')

    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}')
    await seeInputHasValue('11')

    await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}')
    await seeInputHasValue('1')

    await testHook.pressKey('ArrowDown')
    await seeInputHasValue('0')
  })

  it('ctrl+arrowup: should change for 0.1 steps', async () => {
    await changeStep('0.1')
    await testHook.waitFor()

    await testHook.type('number-input', '0.1')

    await userEvent.keyboard('{Control>}{ArrowUp}{/Control}')
    await seeInputHasValue('0.11')

    await userEvent.keyboard('{Control>}{ArrowDown}{/Control}')
    await seeInputHasValue('0.1')

    await testHook.pressKey('ArrowDown')
    await seeInputHasValue('0')
  })

  it('inc click: should increment value', async () => {
    await testHook.clickTrigger('inc')
    await seeInputHasValue('1')
  })

  it('dec click: should increment value', async () => {
    await testHook.type('number-input', '5')
    await testHook.clickTrigger('dec')
    await seeInputHasValue('4')
  })
})
