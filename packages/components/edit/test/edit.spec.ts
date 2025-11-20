import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Edit'

let el: HTMLElement

function previewEl() {
  return page.getByTestId('edit:preview')
}

async function dblClickPreview() {
  await userEvent.dblClick(previewEl())
}

async function focusPreview() {
  await previewEl().click()
  await testHook.waitFor()
}

async function seeInput() {
  const inputEl = testHook.getInputEl('edit')
  await expect.element(inputEl).toBeVisible()
}

async function seeInputFocused() {
  const inputEl = testHook.getInputEl('edit')
  await expect.element(inputEl).toHaveFocus()
}

async function seeInputHasValue(value: string) {
  return expect.element(testHook.getInputEl('edit')).toHaveValue(value)
}

async function seePreviewHasValue(value: string) {
  return expect.element(previewEl()).toHaveTextContent(value)
}

async function dontSeeInput() {
  const inputEl = testHook.getInputEl('edit')
  await expect.element(inputEl).not.toBeVisible()
}

async function inputMaxLength(maxLength: number) {
  const maxLengthEl = page.getByTestId('maxLength')
  await maxLengthEl.fill(maxLength.toString())
  await testHook.pressKey('Enter')
}

async function selectActivationMode(value: string) {
  const activationModeEl = page.getByTestId('activationMode')
  await activationModeEl.selectOptions(value)
}

describe('edit browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('on focus, input should be visible and focus', async () => {
    await focusPreview()
    await seeInput()
    await seeInputFocused()
  })

  it('on focus and blur, should retain current value', async () => {
    await focusPreview()
    await testHook.pressKey('Escape')
    await seeInputHasValue('Hello World')
  })

  it('on type, should commit input value', async () => {
    await focusPreview()
    await testHook.type('edit', 'World!')
    await testHook.pressKey('Enter')

    await seePreviewHasValue('World!')
    await dontSeeInput()
  })

  it('on type and esc, should revert value', async () => {
    await focusPreview()
    await testHook.type('edit', 'World!')
    await testHook.pressKey('Escape')

    await seePreviewHasValue('Hello World')
    await dontSeeInput()
  })

  it('on type and click submit, should commit value', async () => {
    await focusPreview()

    await testHook.type('edit', 'World!')
    await testHook.clickTriggerById('edit:save')

    await seePreviewHasValue('World!')
  })

  it('on type and click outside, should commit value', async () => {
    await focusPreview()

    await testHook.type('edit', 'World!')
    await testHook.clickOutside()

    await seePreviewHasValue('World!')
  })

  it('[maxLength=4] should respect maxLength', async () => {
    await inputMaxLength(4)

    await focusPreview()

    await userEvent.keyboard('Worlds')

    await seeInputHasValue('Worl')

    await testHook.pressKey('Backspace')

    await testHook.type('edit', 'd')

    await seeInputHasValue('Word')
  })

  it('[activationMode=dblclick] on focus and blur, should retain current value', async () => {
    await selectActivationMode('dblclick')

    await dblClickPreview()

    await testHook.pressKey('Escape')

    await seePreviewHasValue('Hello World')
  })

  it('on click edit, should enter edit mode', async () => {
    await testHook.clickTriggerById('edit')

    await seeInput()

    await seeInputFocused()
  })
})
