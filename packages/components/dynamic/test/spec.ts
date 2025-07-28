import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

function input() {
  return page.getByArticle(part('input'))
}

async function paste(value: string) {
  const inputEl = input()
  await inputEl.click()
  navigator.clipboard.writeText(value)
  await userEvent.paste()
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

async function getTagClose(value: string) {
  return page.getByTestId(`${value.toLowerCase()}-delete-trigger`)
}

async function getTagInput(value: string) {
  return page.getByTestId(`${value.toLowerCase()}-item-input`)
}

async function clickTagClose(value: string) {
  const tagClose = await getTagClose(value)
  await userEvent.click(tagClose, {
    force: true,
  })
}

async function focusInput() {
  const inputEl = input()
  await userEvent.click(inputEl)
}

async function deleteLastTag() {
  for (let i = 0; i < 2; i++) {
    await userEvent.keyboard('{Backspace}')
    await userEvent.keyboard('{/Backspace}')
  }
}

async function seeTag(value: string) {
  const tag = await getTag(value)

  await expect.element(tag).toBeVisible()
}

async function dontSeeTag(value: string) {
  const tag = await getTag(value)
  await expect.element(tag).not.toBeInTheDocument()
}

async function dontSeeTagInput(value: string) {
  const tagInput = await getTagInput(value)
  await expect.element(tagInput).not.toBeVisible()
}

async function seeInputHasValue(value: string) {
  const inputEl = input()
  await expect.element(inputEl).toHaveValue(value)
}

async function seeInputIsFocused() {
  const inputEl = input()
  await expect.element(inputEl).toHaveFocus()
}

async function seeTagInputIsFocused(value: string) {
  const tagInputEl = await getTagInput(value)
  await expect.element(tagInputEl).toHaveFocus()
}

async function editTag(tag: string, value: string) {
  const tagInputEl = await getTagInput(tag)
  await userEvent.fill(tagInputEl, value)
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')
}

async function seeTagIsHighlighted(value: string) {
  const tag = await getTag(value)
  await expect.element(tag).toHaveAttribute('data-highlighted', '')
}

async function expectNoTagToBeHighlighted() {
  const el = page.locatoring('[data-part=item][data-selected]')
  expect(el.all().length).toBe(0)
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

export async function DeletesTagWithBackspaceWhenInputValueIsEmpty() {
  await addTag('Svelte')

  await userEvent.keyboard('{Backspace}')
  await seeTagIsHighlighted('Svelte')

  await userEvent.keyboard('{Backspace}')
  await userEvent.keyboard('{/Backspace}')
  await dontSeeTag('Svelte')

  await seeInputIsFocused()
}

export async function DeleteTagByClearingItsContentAndHitEnter() {
  await focusInput()
  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await userEvent.keyboard('{Backspace}')
  await userEvent.keyboard('{/Backspace}')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await seeInputIsFocused()
  await dontSeeTag('Vue')
}

export async function DeleteTagWithDeleteKeyShowAllowKeyboardNavigation() {
  await focusInput()

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await userEvent.keyboard('{Delete}')
  await userEvent.keyboard('{/Delete}')

  await seeInputIsFocused()
  await dontSeeTag('Vue')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await seeTagIsHighlighted('React')
}

export async function DeleteTagWithPointerShowAllowKeyboardNavigation() {
  await clickTagClose('Vue')

  await seeInputIsFocused()

  await dontSeeTag('Vue')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await seeTagIsHighlighted('React')
}

export async function WhenTagIsEmptyNoVisibleTagsEnterPressedShouldNotEnterEditingState() {
  await focusInput()

  await deleteLastTag()
  await deleteLastTag()

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await addTag('Svelte')
  await seeTag('Svelte')

  await seeInputHasValue('')
  await seeInputIsFocused()
}

export async function ShouldNavigateTagsWithArrowKeys() {
  await addTag('Svelte')
  await addTag('Solid')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await seeTagIsHighlighted('Solid')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')
  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await seeTagIsHighlighted('Vue')

  await userEvent.keyboard('{ArrowRight}')
  await userEvent.keyboard('{/ArrowRight}')

  await seeTagIsHighlighted('Svelte')
}

export async function ShouldClearFocusedTagOnBlur() {
  await addTag('Svelte')
  await addTag('Solid')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await userEvent.click(document.body, {
    force: true,
  })

  await expectNoTagToBeHighlighted()
}

export async function RemovesTagOnCloseButtonClick() {
  await clickTagClose('Vue')
  await dontSeeTag('Vue')
  await seeInputIsFocused()
}

export async function EditTagWithEnterKey() {
  await addTag('Svelte')
  await addTag('Solid')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')
  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await seeTagInputIsFocused('Svelte')

  await editTag('Svelte', 'PReact')

  await seeTag('PReact')

  await seeInputIsFocused()
}

export async function EditTagWithDoubleClick() {
  await addTag('Svelte')

  const tagEl = await getTag('Svelte')
  await userEvent.dblClick(tagEl)

  await seeTagInputIsFocused('Svelte')

  await editTag('Svelte', 'PReact')

  await seeTag('PReact')
  await dontSeeTagInput('PReact')
}

export async function ClearsHighlightedTagOnEscapePress() {
  await addTag('Svelte')

  await userEvent.keyboard('{ArrowLeft}')
  await userEvent.keyboard('{/ArrowLeft}')

  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{/Escape}')

  await expectNoTagToBeHighlighted()
}

export async function DeleteTagWithBackspaceWhenInputValueIsEmpty() {
  await addTag('Svelte')
  await addTag('Solid')

  const VueTagEl = await getTag('Vue')
  await userEvent.click(VueTagEl)

  await userEvent.keyboard('{Delete}')
  await userEvent.keyboard('{/Delete}')

  await seeTagIsHighlighted('Svelte')
  await dontSeeTag('Vue')

  await userEvent.keyboard('{Delete}')
  await userEvent.keyboard('{/Delete}')

  await seeTagIsHighlighted('Solid')
  await dontSeeTag('Svelte')

  await userEvent.keyboard('{Delete}')
  await userEvent.keyboard('{/Delete}')
  await dontSeeTag('Solid')

  await expectNoTagToBeHighlighted()

  await userEvent.keyboard('{Backspace}')
  await userEvent.keyboard('{/Backspace}')
  await seeTagIsHighlighted('React')

  await userEvent.keyboard('{Backspace}')
  await userEvent.keyboard('{/Backspace}')
  await dontSeeTag('React')

  await expectNoTagToBeHighlighted()
}

export async function AddOnPasteFalsePastingShouldWorkEveryTime() {
  await paste('Svelte')
  await seeInputHasValue('Svelte')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await seeTag('Svelte')

  await userEvent.keyboard('{Backspace}')
  await userEvent.keyboard('{/Backspace}')
  await userEvent.keyboard('{Backspace}')
  await userEvent.keyboard('{/Backspace}')

  await paste('Svelte')
  await seeInputHasValue('Svelte')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')
  await seeTag('Svelte')
}

export async function AddOnPasteFalsePastingEnterShouldWork() {
  await paste('Svelte')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await seeTag('Svelte')
}

export async function AddOnPasteTruePastingShouldAddTags() {
  const addOnPasteEl = page.getByTestId('addOnPaste')
  await userEvent.click(addOnPasteEl)

  await paste('Svelte, Solid')

  await seeTag('Svelte')
  await seeTag('Solid')
}

export async function AddOnPasteTrueWhenInputIsEmptyShouldWork() {
  const addOnPasteEl = page.getByTestId('addOnPaste')
  await userEvent.click(addOnPasteEl)

  await deleteLastTag()
  await deleteLastTag()

  await paste('Svelte, Solid')
  await seeTag('Svelte')
}
