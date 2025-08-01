import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class TabsTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldSwitchTabsWhenClicked() {
    const firstTab = page.getByRole('tab').first()
    const secondTab = page.getByRole('tab').nth(1)
    const firstPanel = page.getByRole('tabpanel').first()
    const secondPanel = page.getByRole('tabpanel').nth(1)

    // First tab should be selected by default
    await expect.element(firstTab).toHaveAttribute('aria-selected', 'true')
    await expect.element(firstPanel).toBeVisible()

    // Click second tab
    await userEvent.click(secondTab)
    await expect.element(secondTab).toHaveAttribute('aria-selected', 'true')
    await expect.element(firstTab).toHaveAttribute('aria-selected', 'false')
    await expect.element(secondPanel).toBeVisible()
    await expect.element(firstPanel).not.toBeVisible()
  }

  async ShouldNavigateTabsWithArrowKeys() {
    const firstTab = page.getByRole('tab').first()
    const secondTab = page.getByRole('tab').nth(1)

    // Focus first tab
    await userEvent.click(firstTab)
    await expect.element(firstTab).toHaveFocus()

    // Navigate with arrow right
    await this.pressKey('ArrowRight')
    await expect.element(secondTab).toHaveFocus()
    await expect.element(secondTab).toHaveAttribute('aria-selected', 'true')

    // Navigate with arrow left
    await this.pressKey('ArrowLeft')
    await expect.element(firstTab).toHaveFocus()
    await expect.element(firstTab).toHaveAttribute('aria-selected', 'true')
  }

  async ShouldNavigateTabsWithHomeAndEnd() {
    const firstTab = page.getByRole('tab').first()
    const lastTab = page.getByRole('tab').last()

    // Focus first tab
    await userEvent.click(firstTab)

    // Press End to go to last tab
    await this.pressKey('End')
    await expect.element(lastTab).toHaveFocus()
    await expect.element(lastTab).toHaveAttribute('aria-selected', 'true')

    // Press Home to go to first tab
    await this.pressKey('Home')
    await expect.element(firstTab).toHaveFocus()
    await expect.element(firstTab).toHaveAttribute('aria-selected', 'true')
  }

  async ShouldBeFocusableWithTab() {
    await userEvent.tab()
    const firstTab = page.getByRole('tab').first()
    await expect.element(firstTab).toHaveFocus()
  }

  async ShouldSkipDisabledTabs() {
    const tabs = page.getByRole('tab')
    const enabledTabs = tabs.filter({ hasNot: page.locator('[aria-disabled="true"]') })

    if (enabledTabs.all().length > 1) {
      await userEvent.click(enabledTabs.first())
      await this.pressKey('ArrowRight')

      // Should skip disabled tabs and focus next enabled tab
      const focusedTab = page.locator(':focus')
      await expect.element(focusedTab).not.toHaveAttribute('aria-disabled', 'true')
    }
  }

  async ShouldActivateTabWithSpaceKey() {
    const secondTab = page.getByRole('tab').nth(1)
    const secondPanel = page.getByRole('tabpanel').nth(1)

    // Focus second tab but don't click
    await userEvent.tab()
    await this.pressKey('ArrowRight')
    await expect.element(secondTab).toHaveFocus()

    // Activate with space
    await this.pressKey('Space')
    await expect.element(secondTab).toHaveAttribute('aria-selected', 'true')
    await expect.element(secondPanel).toBeVisible()
  }

  async ShouldActivateTabWithEnterKey() {
    const secondTab = page.getByRole('tab').nth(1)
    const secondPanel = page.getByRole('tabpanel').nth(1)

    // Focus second tab but don't click
    await userEvent.tab()
    await this.pressKey('ArrowRight')
    await expect.element(secondTab).toHaveFocus()

    // Activate with enter
    await this.pressKey('Enter')
    await expect.element(secondTab).toHaveAttribute('aria-selected', 'true')
    await expect.element(secondPanel).toBeVisible()
  }

  async ShouldMaintainTabPanelAssociation() {
    const tabs = page.getByRole('tab')
    const panels = page.getByRole('tabpanel')

    for (let i = 0; i < tabs.all().length; i++) {
      const tab = tabs.nth(i)
      const panel = panels.nth(i)

      await userEvent.click(tab)

      const tabId = await tab.getAttribute('id')
      const panelControls = await panel.getAttribute('aria-labelledby')

      expect(panelControls).toBe(tabId)
    }
  }
}
