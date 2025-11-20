import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/Dialog'

let el: HTMLElement

async function seeCloseIsFocused() {
  const closeButton = testHook.getInputEl('dialog')
  await expect.element(closeButton).toHaveFocus()
}

async function dontSeeContent() {
  const contentEl = testHook.getContent('dialog')
  await expect.element(contentEl).not.toBeInTheDocument()
}

async function seeTriggerIsFocused() {
  const triggerEl = testHook.getTrigger('dialog')
  await expect.element(triggerEl).toHaveFocus()
}

describe('dialog browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('should focus on close button when dialog is open', async () => {
    await testHook.clickTrigger('dialog')
    await seeCloseIsFocused()

    await testHook.pressKey('Escape')

    await dontSeeContent()
    await seeTriggerIsFocused()
  })
})
