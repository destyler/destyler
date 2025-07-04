import { part, testid } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const root = part('root')
const label = part('label')
const control = part('control')
const input = testid('hidden-input')
const disabledCheck = testid('disabled')

export async function ShouldBeCheckedWhenClicked() {
  const rootEL = page.getByArticle(root)
  await rootEL.click()
  await expect.element(page.getByArticle(root)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(label)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(control)).toHaveAttribute('data-state', 'checked')
}

export async function ShouldBeFocusedWhenPageIsTabbed() {
  await userEvent.click(document.body)
  await userEvent.tab()
  await expect.element(page.getByArticle(input)).toHaveFocus()
  await expect.element(page.getByArticle(control)).toHaveAttribute('data-focus', '')
}

export async function ShouldBeCheckedWhenSpacebarIsPressedWhileFocused() {
  await userEvent.click(document.body)
  await userEvent.tab()
  await userEvent.keyboard('{space}')
  await expect.element(page.getByArticle(root)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(label)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(control)).toHaveAttribute('data-state', 'checked')
}

export async function ShouldHaveDisabledAttributesWhenDisabled() {
  const disabledEl = page.getByArticle(disabledCheck)
  await disabledEl.click()
  await expect.element(page.getByArticle(input)).toBeDisabled()
}

export async function ShouldNotBeFocusableWhenDisabled() {
  const disabledEl = page.getByArticle(disabledCheck)
  await disabledEl.click()
  await userEvent.click(document.body)
  await userEvent.tab()
  await expect.element(page.getByArticle(input)).toHaveFocus()
}
