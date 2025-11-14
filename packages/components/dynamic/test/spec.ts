import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class DynamicTestSuite extends TestSuite {
  async paste(value: string) {
    const copyTextEl = page.getByTestId('copy-text')
    await userEvent.fill(copyTextEl, value)
    await userEvent.tripleClick(copyTextEl)
    await userEvent.copy()
    const inputEl = this.inputEl()
    await inputEl.click()
    await userEvent.paste()
  }

  async addTag(value: string) {
    const inputEl = this.inputEl()
    await inputEl.fill(value)
    await this.pressKey('Enter')
  }

  async getTag(value: string) {
    return page.getByTestId(`${value.toLowerCase()}-input`)
  }

  async getTagClose(value: string) {
    return page.getByTestId(`${value.toLowerCase()}-delete-trigger`)
  }

  async getTagInput(value: string) {
    return page.getByTestId(`${value.toLowerCase()}-item-input`)
  }

  async clickTagClose(value: string) {
    const tagClose = await this.getTagClose(value)
    await userEvent.click(tagClose, {
      force: true,
    })
  }

  async focusInput() {
    const inputEl = this.inputEl()
    await userEvent.click(inputEl)
  }

  async deleteLastTag() {
    for (let i = 0; i < 2; i++) {
      await userEvent.keyboard('{Backspace}')
      await userEvent.keyboard('{/Backspace}')
    }
  }

  async seeTag(value: string) {
    const tag = await this.getTag(value)
    await expect.element(tag).toBeVisible()
  }

  async dontSeeTag(value: string) {
    const tag = await this.getTag(value)
    await expect.element(tag).not.toBeInTheDocument()
  }

  async dontSeeTagInput(value: string) {
    const tagInput = await this.getTagInput(value)
    await expect.element(tagInput).not.toBeVisible()
  }

  async seeInputHasValue(value: string) {
    const inputEl = this.inputEl()
    await expect.element(inputEl).toHaveValue(value)
  }

  async seeInputIsFocused() {
    const inputEl = this.inputEl()
    await expect.element(inputEl).toHaveFocus()
  }

  async seeTagInputIsFocused(value: string) {
    const tagInputEl = await this.getTagInput(value)
    await expect.element(tagInputEl).toHaveFocus()
  }

  async editTag(tag: string, value: string) {
    const tagInputEl = await this.getTagInput(tag)
    await userEvent.fill(tagInputEl, value)
    await this.pressKey('Enter')
  }

  async seeTagIsHighlighted(value: string) {
    const tag = await this.getTag(value)
    await expect.element(tag).toHaveAttribute('data-highlighted', '')
  }

  async expectNoTagToBeHighlighted() {
    const el = page.locatoring('[data-part=item][data-selected]')
    expect(el.all().length).toBe(0)
  }

  async ShouldAddNewTagValue() {
    await this.addTag('Svelte')
    await this.seeTag('Svelte')

    await this.seeInputHasValue('')
    await this.seeInputIsFocused()
  }

  async WhenInputIsEmptyBackspaceHighlightsLastTag() {
    await this.focusInput()
    await userEvent.keyboard('{Backspace}')

    await this.seeTagIsHighlighted('Vue')
  }

  async DeletesTagWithBackspaceWhenInputValueIsEmpty() {
    await this.addTag('Svelte')

    await userEvent.keyboard('{Backspace}')
    await this.seeTagIsHighlighted('Svelte')

    await this.pressKey('Backspace')
    await this.dontSeeTag('Svelte')

    await this.seeInputIsFocused()
  }

  async DeleteTagByClearingItsContentAndHitEnter() {
    await this.focusInput()

    await this.pressKey('ArrowLeft')

    await this.pressKey('Enter')

    await this.pressKey('Backspace')

    await this.pressKey('Enter')

    await this.seeInputIsFocused()
    await this.dontSeeTag('Vue')
  }

  async DeleteTagWithDeleteKeyShowAllowKeyboardNavigation() {
    await this.focusInput()

    await this.pressKey('ArrowLeft')

    await this.pressKey('Delete')

    await this.seeInputIsFocused()
    await this.dontSeeTag('Vue')

    await this.pressKey('ArrowLeft')

    await this.seeTagIsHighlighted('React')
  }

  async DeleteTagWithPointerShowAllowKeyboardNavigation() {
    await this.clickTagClose('Vue')

    await this.seeInputIsFocused()

    await this.dontSeeTag('Vue')

    await this.pressKey('ArrowLeft')

    await this.seeTagIsHighlighted('React')
  }

  async WhenTagIsEmptyNoVisibleTagsEnterPressedShouldNotEnterEditingState() {
    await this.focusInput()

    await this.deleteLastTag()
    await this.deleteLastTag()

    await this.pressKey('Enter')

    await this.addTag('Svelte')
    await this.seeTag('Svelte')

    await this.seeInputHasValue('')
    await this.seeInputIsFocused()
  }

  async ShouldNavigateTagsWithArrowKeys() {
    await this.addTag('Svelte')
    await this.addTag('Solid')

    await this.pressKey('ArrowLeft')

    await this.seeTagIsHighlighted('Solid')

    await this.pressKey('ArrowLeft', 2)

    await this.seeTagIsHighlighted('Vue')

    await this.pressKey('ArrowRight')

    await this.seeTagIsHighlighted('Svelte')
  }

  async ShouldClearFocusedTagOnBlur() {
    await this.addTag('Svelte')
    await this.addTag('Solid')

    await this.pressKey('ArrowLeft')

    await userEvent.click(document.body, {
      force: true,
    })

    await this.expectNoTagToBeHighlighted()
  }

  async RemovesTagOnCloseButtonClick() {
    await this.clickTagClose('Vue')
    await this.dontSeeTag('Vue')
    await this.seeInputIsFocused()
  }

  async EditTagWithEnterKey() {
    await this.addTag('Svelte')
    await this.addTag('Solid')

    await this.pressKey('ArrowLeft', 2)

    await this.pressKey('Enter')

    await this.seeTagInputIsFocused('Svelte')

    await this.editTag('Svelte', 'PReact')

    await this.seeTag('PReact')

    await this.seeInputIsFocused()
  }

  async EditTagWithDoubleClick() {
    await this.addTag('Svelte')

    const tagEl = await this.getTag('Svelte')
    await userEvent.dblClick(tagEl)

    await this.seeTagInputIsFocused('Svelte')

    await this.editTag('Svelte', 'PReact')

    await this.seeTag('PReact')
    await this.dontSeeTagInput('PReact')
  }

  async ClearsHighlightedTagOnEscapePress() {
    await this.addTag('Svelte')

    await this.pressKey('ArrowLeft')

    await this.pressKey('Escape')

    await this.expectNoTagToBeHighlighted()
  }

  async DeleteTagWithBackspaceWhenInputValueIsEmpty() {
    await this.addTag('Svelte')
    await this.addTag('Solid')

    const VueTagEl = await this.getTag('Vue')
    await userEvent.click(VueTagEl)

    await this.pressKey('Delete')

    await this.seeTagIsHighlighted('Svelte')
    await this.dontSeeTag('Vue')

    await this.pressKey('Delete')

    await this.seeTagIsHighlighted('Solid')
    await this.dontSeeTag('Svelte')

    await this.pressKey('Delete')
    await this.dontSeeTag('Solid')

    await this.expectNoTagToBeHighlighted()

    await this.pressKey('Backspace')
    await this.seeTagIsHighlighted('React')

    await this.pressKey('Backspace')
    await this.dontSeeTag('React')

    await this.expectNoTagToBeHighlighted()
  }

  async AddOnPasteFalsePastingShouldWorkEveryTime() {
    await this.paste('Svelte')
    await this.seeInputHasValue('Svelte')

    await this.pressKey('Enter')

    await this.seeTag('Svelte')

    await this.pressKey('Backspace', 2)

    await this.paste('Svelte')
    await this.seeInputHasValue('Svelte')

    await this.pressKey('Enter')
    await this.seeTag('Svelte')
  }

  async AddOnPasteFalsePastingEnterShouldWork() {
    await this.paste('Svelte')

    await this.pressKey('Enter')

    await this.seeTag('Svelte')
  }

  async AddOnPasteTruePastingShouldAddTags() {
    const addOnPasteEl = page.getByTestId('addOnPaste')
    await userEvent.click(addOnPasteEl)

    await this.paste('Svelte, Solid')

    await this.seeTag('Svelte')
    await this.seeTag('Solid')
  }

  async AddOnPasteTrueWhenInputIsEmptyShouldWork() {
    const addOnPasteEl = page.getByTestId('addOnPaste')
    await userEvent.click(addOnPasteEl)

    await this.deleteLastTag()
    await this.deleteLastTag()

    await this.paste('Svelte, Solid')
    await this.seeTag('Svelte')
  }
}
