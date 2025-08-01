import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class MenuTestSuite extends TestSuite {
  positioner = testid('positioner')
  
  async ShouldOpenWhenTriggerIsClicked() {
    await this.clickTrigger()
    await expect.element(this.contentEl()).toBeVisible()
    await expect.element(this.triggerEl()).toHaveAttribute('data-state', 'open')
  }

  async ShouldCloseWhenClickedOutside() {
    await this.clickTrigger()
    await expect.element(this.contentEl()).toBeVisible()
    
    await this.clickOutside()
    await expect.element(this.contentEl()).not.toBeVisible()
    await expect.element(this.triggerEl()).toHaveAttribute('data-state', 'closed')
  }

  async ShouldNavigateItemsWithKeyboard() {
    await this.clickTrigger()
    await expect.element(this.contentEl()).toBeVisible()
    
    // Press Arrow Down to navigate
    await this.pressKey('ArrowDown')
    const firstItem = page.getByRole('menuitem').first()
    await expect.element(firstItem).toHaveAttribute('data-highlighted', '')
    
    // Press Arrow Down again
    await this.pressKey('ArrowDown')
    const secondItem = page.getByRole('menuitem').nth(1)
    await expect.element(secondItem).toHaveAttribute('data-highlighted', '')
  }

  async ShouldSelectItemWhenClicked() {
    await this.clickTrigger()
    await expect.element(this.contentEl()).toBeVisible()
    
    const firstItem = page.getByRole('menuitem').first()
    await userEvent.click(firstItem)
    
    // Menu should close after selection
    await expect.element(this.contentEl()).not.toBeVisible()
    await expect.element(this.triggerEl()).toHaveAttribute('data-state', 'closed')
  }

  async ShouldSelectItemWithEnterKey() {
    await this.clickTrigger()
    await expect.element(this.contentEl()).toBeVisible()
    
    // Navigate to first item
    await this.pressKey('ArrowDown')
    const firstItem = page.getByRole('menuitem').first()
    await expect.element(firstItem).toHaveAttribute('data-highlighted', '')
    
    // Press Enter to select
    await this.pressKey('Enter')
    
    // Menu should close after selection
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async ShouldCloseWithEscapeKey() {
    await this.clickTrigger()
    await expect.element(this.contentEl()).toBeVisible()
    
    await this.pressKey('Escape')
    await expect.element(this.contentEl()).not.toBeVisible()
    await expect.element(this.triggerEl()).toHaveAttribute('data-state', 'closed')
  }

  async ShouldBeFocusableWithTab() {
    await userEvent.tab()
    await expect.element(this.triggerEl()).toHaveFocus()
  }

  async ShouldOpenWithSpace() {
    await userEvent.tab()
    await expect.element(this.triggerEl()).toHaveFocus()
    
    await this.pressKey('Space')
    await expect.element(this.contentEl()).toBeVisible()
    await expect.element(this.triggerEl()).toHaveAttribute('data-state', 'open')
  }
}