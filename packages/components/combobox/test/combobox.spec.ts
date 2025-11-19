import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Combobox'

let el: HTMLElement

async function clickClearTrigger() {
  const clearTriggerEl = testHook.getClearEl('combobox')
  await clearTriggerEl.click()
}

function getItem(text: string) {
  return testHook.getItemEls().filter({ hasText: text })
}

async function hoverItem(text: string) {
  const itemEl = getItem(text)
  await itemEl.hover()
}

async function clickItem(text: string) {
  const itemEl = getItem(text)
  await itemEl.click()
}

async function seeDropdown() {
  const contentEl = testHook.getContent('combobox')
  await expect.element(contentEl).toBeVisible()
}

async function dontSeeDropdown() {
  const contentEl = testHook.getContent('combobox')
  await expect.element(contentEl).not.toBeVisible()
}

async function seeInputIsFocused() {
  const inputEl = testHook.getInputEl('combobox')

  await expect.element(inputEl).toHaveFocus()
}

async function seeItemIsHighlighted(text: string) {
  const itemEl = getItem(text)

  await expect.element(itemEl).toHaveAttribute('data-highlighted', '')
}

async function seeInputHasValue(text: string) {
  const inputEl = testHook.getInputEl('combobox')
  await expect.element(inputEl).toHaveValue(text)
}

async function seeItemIsChecked(text: string) {
  const itemEl = getItem(text)
  await expect.element(itemEl).toHaveAttribute('data-state', 'checked')
}

async function seeItemIsNotChecked(text: string) {
  const itemEl = getItem(text)
  await expect.element(itemEl).not.toHaveAttribute('data-state', 'checked')
}

describe('combobox browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('should open combobox menu when arrow is clicked', async () => {
    await testHook.clickTrigger()

    await seeDropdown()

    await seeInputIsFocused()
  })

  it('escape should close content', async () => {
    await testHook.clickTrigger()

    await seeDropdown()

    await testHook.pressKey('Escape')

    await dontSeeDropdown()
  })

  it('should open combobox menu when typing', async () => {
    await testHook.type('combobox', 'can')
    await seeDropdown()
    await seeItemIsHighlighted('Canada')

    await testHook.pressKey('Enter')
    await seeInputHasValue('Canada')
    await dontSeeDropdown()
  })

  it('pointer / selection', async () => {
    await testHook.clickTrigger()

    await hoverItem('Zambia')

    await seeItemIsHighlighted('Zambia')

    await clickItem('Zambia')

    await seeInputHasValue('Zambia')

    await dontSeeDropdown()
  })

  it('select and select again', async () => {
    await testHook.clickTrigger()

    await clickItem('Zambia')
    await seeInputHasValue('Zambia')

    await testHook.clickTrigger()
    await clickItem('Canada')
    await seeInputHasValue('Canada')
  })

  it('[loop] on arrow down, open and highlight first enabled option', async () => {
    await testHook.focusInput('combobox')

    await testHook.pressKey('ArrowDown')

    await seeDropdown()
    await seeItemIsHighlighted('Zambia')

    await testHook.pressKey('ArrowUp')
    await seeItemIsHighlighted('Tunisia')
  })

  it('[no-loop] on arrow down, open and highlight first enabled option', async () => {
    await page.getByTestId('loopFocus').click()

    await testHook.focusInput('combobox')

    await testHook.pressKey('ArrowDown')

    await seeDropdown()
    await seeItemIsHighlighted('Zambia')

    await testHook.pressKey('ArrowUp')
    await seeItemIsHighlighted('Zambia')
  })

  it('[loop] on arrow up, open and highlight last enabled option', async () => {
    await testHook.focusInput('combobox')

    await testHook.pressKey('ArrowUp')

    await seeDropdown()
    await seeItemIsHighlighted('Tunisia')
  })

  it('[no-loop] on arrow up, open and highlight last enabled option', async () => {
    await page.getByTestId('loopFocus').click()

    await testHook.focusInput('combobox')

    await testHook.pressKey('ArrowUp')

    await seeDropdown()
    await seeItemIsHighlighted('Tunisia')
  })

  it('on home and end, when open, focus first and last option', async () => {
    await testHook.clickTrigger()

    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')

    await seeItemIsHighlighted('Canada')

    await testHook.pressKey('Home')
    await seeItemIsHighlighted('Zambia')

    await testHook.pressKey('End')
    await seeItemIsHighlighted('Tunisia')
  })

  it('keyboard / arrowdown / loop', async () => {
    await testHook.type('combobox', 'mal')

    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')

    await seeItemIsHighlighted('Malta')

    await testHook.pressKey('ArrowDown')
    await seeItemIsHighlighted('Malawi')
  })

  it('keyboard / arrowdown / no-loop', async () => {
    await page.getByTestId('loopFocus').click()

    await testHook.type('combobox', 'mal')

    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowDown')

    await seeItemIsHighlighted('Malta')

    await testHook.pressKey('ArrowDown')
    await seeItemIsHighlighted('Malta')
  })

  it('keyboard / arrowup / loop', async () => {
    await testHook.type('combobox', 'mal')

    await testHook.pressKey('ArrowUp')
    await seeItemIsHighlighted('Malta')
  })

  it('keyboard / arrowup / no-loop', async () => {
    await page.getByTestId('loopFocus').click()

    await testHook.type('combobox', 'mal')

    await testHook.pressKey('ArrowUp')
    await seeItemIsHighlighted('Malawi')
  })

  it('[pointer / open-on-click]', async () => {
    await page.getByTestId('openOnClick').click()

    await testHook.clickInput('combobox')

    await seeDropdown()
  })

  it('selects value on click', async () => {
    await testHook.clickTrigger()
    await clickItem('Zambia')

    await seeItemIsChecked('Zambia')
  })

  it('can clear value', async () => {
    await testHook.clickTrigger()
    await clickItem('Zambia')

    await testHook.clickTrigger()
    await clickClearTrigger()
    await seeInputHasValue('')
    await seeItemIsNotChecked('Zambia')
  })

  it('[selection=clear] should clear input value', async () => {
    const selectionBehaviorEl = page.getByTestId('selectionBehavior')
    await selectionBehaviorEl.selectOptions('clear')

    await testHook.type('combobox', 'mal')
    await testHook.pressKey('Enter')
    await seeInputHasValue('')
  })

  it('[no value] enter behavior for custom values', async () => {
    const selectionBehaviorEl = page.getByTestId('inputBehavior')
    await selectionBehaviorEl.selectOptions('none')

    await testHook.type('combobox', 'foo')
    await testHook.pressKey('Enter')
    await seeInputHasValue('')
  })
})
