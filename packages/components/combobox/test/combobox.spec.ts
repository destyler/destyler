import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

function trigger() {
  return page.locatoring('[data-part=trigger]')
}

function content() {
  return page.locatoring('[data-part=content]')
}

function input() {
  return page.locatoring('[data-part=input]')
}

function clearTrigger() {
  return page.locatoring('[data-part=clear-trigger]')
}

async function focusInput() {
  const inputEl = input()
  await inputEl.fill('')
}

async function type(text: string) {
  const inputEl = input()

  await userEvent.type(inputEl, text)
}

function getItem(text: string) {
  return page.locatoring(`[data-part=item]`).filter({ hasText: text })
}

async function hoverItem(text: string) {
  const itemEl = getItem(text)
  await itemEl.hover()
}

async function clickItem(text: string) {
  const itemEl = getItem(text)
  await itemEl.click()
}

async function clickTrigger() {
  const triggerEl = trigger()
  await triggerEl.click()
}

async function clickInput() {
  const inputEl = input()
  await inputEl.click()
}

async function clickClearTrigger() {
  const clearTriggerEl = clearTrigger()
  await clearTriggerEl.click()
}

async function seeDropdown() {
  const contentEl = content()
  await expect.element(contentEl).toBeVisible()
}
async function dontSeeDropdown() {
  const contentEl = content()
  await expect.element(contentEl).not.toBeVisible()
}

async function seeInputIsFocused() {
  const inputEl = input()

  await expect.element(inputEl).toHaveFocus()
}

async function seeItemIsHighlighted(text: string) {
  const itemEl = getItem(text)

  await expect.element(itemEl).toHaveAttribute('data-highlighted', '')
}

async function seeItemIsNotChecked(text: string) {
  const itemEl = getItem(text)
  await expect.element(itemEl).not.toHaveAttribute('data-state', 'checked')
}

async function seeInputHasValue(text: string) {
  const inputEl = input()
  await expect.element(inputEl).toHaveValue(text)
}

async function seeItemIsChecked(text: string) {
  const itemEl = getItem(text)
  await expect.element(itemEl).toHaveAttribute('data-state', 'checked')
}

async function pressKey(key: string) {
  await userEvent.keyboard(`{${key}}`)
  await userEvent.keyboard(`{/${key}}`)
}

export async function ShouldOpenComboboxMenuWhenArrowIsClicked() {
  await clickTrigger()

  await seeDropdown()

  await seeInputIsFocused()
}

export async function EscapeShouldCloseContent() {
  await clickTrigger()

  await seeDropdown()

  await pressKey('Escape')

  await dontSeeDropdown()
}

export async function ShouldOpenComboboxMenuWhenTyping() {
  await type('can')
  await seeDropdown()
  await seeItemIsHighlighted('Canada')

  await pressKey('Enter')
  await seeInputHasValue('Canada')
  await dontSeeDropdown()
}

export async function PointerAndSelection() {
  await clickTrigger()

  await hoverItem('Zambia')

  await seeItemIsHighlighted('Zambia')

  await clickItem('Zambia')

  await seeInputHasValue('Zambia')

  await dontSeeDropdown()
}

export async function SelectAndSelectAgain() {
  await clickTrigger()

  await clickItem('Zambia')
  await seeInputHasValue('Zambia')

  await clickTrigger()
  await clickItem('Canada')
  await seeInputHasValue('Canada')
}

export async function OnArrowDownOpenAndHighlightFirstEnabledOption() {
  await focusInput()

  await pressKey('ArrowDown')

  await seeDropdown()
  await seeItemIsHighlighted('Zambia')

  await pressKey('ArrowUp')
  await seeItemIsHighlighted('Tunisia')
}
export async function NoLoopOnArrowDownOpenAndHighlightFirstEnabledOption() {
  await page.getByTestId('loopFocus').click()

  await focusInput()

  await pressKey('ArrowDown')

  await seeDropdown()
  await seeItemIsHighlighted('Zambia')

  await pressKey('ArrowUp')
  await seeItemIsHighlighted('Zambia')
}

export async function OnArrowUpOpenAndHighlightLastEnabledOption() {
  await focusInput()

  await pressKey('ArrowUp')

  await seeDropdown()
  await seeItemIsHighlighted('Tunisia')
}

export async function NoLoopOnArrowUpOpenAndHighlightLastEnabledOption() {
  await page.getByTestId('loopFocus').click()

  await focusInput()

  await pressKey('ArrowUp')

  await seeDropdown()
  await seeItemIsHighlighted('Tunisia')
}

export async function OnHomeAndEndFocusFirstAndLastOption() {
  await clickTrigger()

  await pressKey('ArrowDown')
  await pressKey('ArrowDown')
  await pressKey('ArrowDown')

  await seeItemIsHighlighted('Canada')

  await pressKey('Home')
  await seeItemIsHighlighted('Zambia')

  await pressKey('End')
  await seeItemIsHighlighted('Tunisia')
}

export async function KeyBoardArrowDownLoop() {
  await type('mal')

  await pressKey('ArrowDown')
  await pressKey('ArrowDown')
  await pressKey('ArrowDown')
  await pressKey('ArrowDown')

  await seeItemIsHighlighted('Malta')

  await pressKey('ArrowDown')
  await seeItemIsHighlighted('Malawi')
}

export async function KeyBoardArrowDownNoLoop() {
  await page.getByTestId('loopFocus').click()

  await type('mal')

  await pressKey('ArrowDown')
  await pressKey('ArrowDown')
  await pressKey('ArrowDown')
  await pressKey('ArrowDown')

  await seeItemIsHighlighted('Malta')

  await pressKey('ArrowDown')
  await seeItemIsHighlighted('Malta')
}

export async function KeyBoardArrowUpLoop() {
  await type('mal')

  await pressKey('ArrowUp')
  await seeItemIsHighlighted('Malta')
}

export async function KeyBoardArrowUpNoLoop() {
  await page.getByTestId('loopFocus').click()

  await type('mal')

  await pressKey('ArrowUp')
  await seeItemIsHighlighted('Malawi')
}

export async function PointerOpenOnClick() {
  await page.getByTestId('openOnClick').click()

  await clickInput()

  await seeDropdown()
}

export async function SelectsValueOnClick() {
  await clickTrigger()
  await clickItem('Zambia')

  await seeItemIsChecked('Zambia')
}

export async function CanClearValue() {
  await clickTrigger()
  await clickItem('Zambia')

  await clickTrigger()
  await clickClearTrigger()
  await seeInputHasValue('')
  await seeItemIsNotChecked('Zambia')
}

export async function ShouldClearInputValue() {
  const selectionBehaviorEl = page.getByTestId('selectionBehavior')
  await selectionBehaviorEl.selectOptions('clear')

  await type('mal')
  await pressKey('Enter')
  await seeInputHasValue('')
}

export async function EnterBehaviorForCustomValues() {
  const selectionBehaviorEl = page.getByTestId('inputBehavior')
  await selectionBehaviorEl.selectOptions('none')

  await type('foo')
  await pressKey('Enter')
  await seeInputHasValue('')
}
