import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/OtpInput'

let mount: HTMLElement | null = null

const first = testHook.testid('input-1')
const second = testHook.testid('input-2')
const third = testHook.testid('input-3')

async function paste(value: string) {
  const copyTextEl = page.getByTestId('copy-text')
  await userEvent.fill(copyTextEl, value)
  await userEvent.tripleClick(copyTextEl)
  await userEvent.copy()
}

describe('otp input browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('on type: should move focus to the next input', async () => {
    await page.locatoring(first).fill('1')
    await expect.element(page.locatoring(second)).toHaveFocus()
    await page.locatoring(second).fill('2')
    await expect.element(page.locatoring(third)).toHaveFocus()
    await page.locatoring(third).fill('3')
  })

  it('on type: should not allow multiple keys at once ', async () => {
    await page.locatoring(first).fill('12')
    await expect.element(page.locatoring(first)).toHaveValue('2')
  })

  it('on backspace: should clear value and move focus to prev input', async () => {
    await page.locatoring(first).fill('1')
    await expect.element(page.locatoring(second)).toHaveFocus()
    await page.locatoring(second).fill('2')
    await expect.element(page.locatoring(third)).toHaveFocus()
    await testHook.pressKey('Backspace')
    await expect.element(page.locatoring(second)).toHaveFocus()
    await expect.element(page.locatoring(second)).toHaveValue('')
  })

  it('on arrow: should change focus between inputs', async () => {
    // fill out all fields
    await page.locatoring(first).fill('1')
    await page.locatoring(second).fill('2')
    await page.locatoring(third).fill('3')

    // navigate with arrow keys
    await testHook.pressKey('ArrowLeft')
    await expect.element(page.locatoring(second)).toHaveFocus()
    await testHook.pressKey('ArrowRight')
    await expect.element(page.locatoring(third)).toHaveFocus()
  })

  it('on clear: should clear values and focus first', async () => {
    // fill out all fields
    await page.locatoring(first).fill('1')
    await page.locatoring(second).fill('2')
    await page.locatoring(third).fill('3')

    // click clear
    await testHook.clickTrigger('clear')
    await expect.element(page.locatoring(first)).toHaveFocus()
    await expect.element(page.locatoring(first)).toHaveValue('')
    await expect.element(page.locatoring(second)).toHaveValue('')
    await expect.element(page.locatoring(third)).toHaveValue('')
  })

  it('on paste: should autofill all fields', async () => {
    await paste('123')
    await page.locatoring(first).click()

    await userEvent.paste()

    await expect.element(page.locatoring(first)).toHaveValue('1')
    await expect.element(page.locatoring(second)).toHaveValue('2')
    await expect.element(page.locatoring(third)).toHaveValue('3')
    await expect.element(page.locatoring(third)).toHaveFocus()
  })

  it('on paste: should autofill all fields if focused field is not empty', async () => {
    await paste('123')
    await page.locatoring(first).fill('1')

    await testHook.clickTrigger('focus')

    await userEvent.paste()

    await expect.element(page.locatoring(first)).toHaveValue('1')
    await expect.element(page.locatoring(second)).toHaveValue('2')
    await expect.element(page.locatoring(third)).toHaveValue('3')
    await expect.element(page.locatoring(third)).toHaveFocus()
  })

  it('[different] should allow only single character', async () => {
    await page.locatoring(first).fill('1')
    await page.locatoring(second).fill('2')
    await testHook.clickTrigger('focus')
    await page.locatoring(first).fill('3')
    await expect.element(page.locatoring(first)).toHaveValue('3')
  })

  it('[same] should allow only single character', async () => {
    await page.locatoring(first).fill('1')
    await page.locatoring(first).click()
    await page.locatoring(first).fill('1')
    await expect.element(page.locatoring(first)).toHaveValue('1')
  })
})
