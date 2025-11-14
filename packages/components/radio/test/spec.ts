import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class RadioTestSuite extends TestSuite {
  async expectToBeChecked(id: string) {
    await expect.element(page.getByTestId(`radio-${id}`)).toHaveAttribute('data-state', 'checked')
    await expect.element(page.getByTestId(`control-${id}`)).toHaveAttribute('data-state', 'checked')
    await expect.element(page.getByTestId(`label-${id}`)).toHaveAttribute('data-state', 'checked')
  }

  async toggleDisabled() {
    await userEvent.click(page.getByTestId('disabled'))
  }

  async toggleReadonly() {
    await userEvent.click(page.getByTestId('readOnly'))
  }

  async ShouldHaveAriaLabelledByOnRoot() {
    await expect.element(this.rootEl()).toHaveAttribute('id')
    await expect.element(this.rootEl()).toHaveAttribute('aria-labelledby')
  }

  async ShouldBeCheckedWhenClicked() {
    await userEvent.click(page.getByTestId('radio-apple'))
    await this.expectToBeChecked('apple')

    await userEvent.click(page.getByTestId('radio-grape'))
    await this.expectToBeChecked('grape')
  }

  async ShouldBeFocusedWhenPageIsTabbed() {
    await userEvent.click(page.getByTestId('radio-click'))
    await userEvent.tab()

    await expect.element(page.getByTestId('input-apple')).toHaveFocus()
    await expect.element(page.getByTestId('control-apple')).toHaveAttribute('data-focus', '')
  }

  async ShouldBeCheckedWhenSpacebarIsPressedWhileFocused() {
    await userEvent.click(page.getByTestId('radio-click'))
    await userEvent.tab()
    await this.pressKey('Space')

    await this.expectToBeChecked('apple')
  }

  async ShouldHaveDisabledAttributesWhenDisabled() {
    await this.toggleDisabled()

    await expect.element(page.getByTestId('control-apple')).toHaveAttribute('data-disabled', '')
    await expect.element(page.getByTestId('input-apple')).toBeDisabled()
  }

  async ShouldNotBeFocusableWhenDisabled() {
    await this.toggleDisabled()

    await userEvent.click(page.getByTestId('radio-click'))
    await userEvent.tab()

    await expect.element(page.getByTestId('input-apple')).not.toHaveFocus()
  }

  async ShouldBeFocusableWhenReadonly() {
    await this.toggleReadonly()

    await userEvent.click(page.getByTestId('radio-click'))
    await userEvent.tab()

    await expect.element(page.getByTestId('input-apple')).toHaveFocus()
  }

  async ShouldBeFocusedOnActiveRadioItemWhenPageIsTabbed() {
    await userEvent.click(page.getByTestId('radio-grape'))
    await this.expectToBeChecked('grape')

    await userEvent.click(page.getByTestId('radio-click'))
    await userEvent.tab()
    await expect.element(page.getByTestId('input-grape')).toHaveFocus()
    await expect.element(page.getByTestId('control-grape')).toHaveAttribute('data-focus', '')
  }

  async ShouldCheckItemsWhenNavigatingByArrows() {
    await userEvent.click(page.getByTestId('radio-apple'))
    await this.expectToBeChecked('apple')

    await this.pressKey('ArrowDown', 3)

    await this.expectToBeChecked('grape')
  }
}
