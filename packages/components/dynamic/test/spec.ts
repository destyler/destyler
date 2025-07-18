import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

function input() {
  return page.getByArticle(part('input'))
}

async function addTag(value: string) {
  const inputEl = page.getByArticle(part('input'))
  await inputEl.fill(value)
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{\Enter}')
}

async function getTag(value: string) {
  return page.getByTestId(`${value.toLowerCase()}-input`)
}

async function focusInput() {
  const inputEl = input()
  await inputEl.fill('')
}

async function seeTag(value: string) {
  const tag = await getTag(value)
  await expect.element(tag).toBeVisible()
}

async function seeInputHasValue(value: string) {
  const inputEl = input()
  await expect.element(inputEl).toHaveValue(value)
}

async function seeInputIsFocused() {
  const inputEl = input()
  await expect.element(inputEl).toHaveFocus()
}

async function seeTagIsHighlighted(value: string) {
  const tag = await getTag(value)
  await expect.element(tag).toHaveAttribute('data-highlighted', '')
}

export async function ShouldAddNewTagValue() {
  await addTag('Svelte')
  await seeTag('Svelte')

  await seeInputHasValue('')
  await seeInputIsFocused()
}

export async function WhenInputIsEmptyBackspaceHighlightsLastTag() {
  await focusInput()
  await userEvent.keyboard('{Backspace}')

  await seeTagIsHighlighted('Vue')
}
