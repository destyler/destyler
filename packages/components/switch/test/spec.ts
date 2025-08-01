import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class SwitchTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldToggleWhenClicked() {
    const switchElement = page.getByRole('switch')

    // Get initial state
    const initialChecked = await switchElement.getAttribute('aria-checked')

    // Click to toggle
    await userEvent.click(switchElement)

    // State should have changed
    const newChecked = await switchElement.getAttribute('aria-checked')
    expect(newChecked).not.toBe(initialChecked)

    // Data attribute should also reflect the state
    if (newChecked === 'true') {
      await expect.element(switchElement).toHaveAttribute('data-state', 'checked')
    } else {
      await expect.element(switchElement).toHaveAttribute('data-state', 'unchecked')
    }
  }

  async ShouldToggleWithSpaceKey() {
    const switchElement = page.getByRole('switch')

    // Focus the switch
    await userEvent.click(switchElement)
    await expect.element(switchElement).toHaveFocus()

    // Get initial state
    const initialChecked = await switchElement.getAttribute('aria-checked')

    // Toggle with space key
    await this.pressKey('Space')

    // State should have changed
    const newChecked = await switchElement.getAttribute('aria-checked')
    expect(newChecked).not.toBe(initialChecked)
  }

  async ShouldToggleWithEnterKey() {
    const switchElement = page.getByRole('switch')

    // Focus the switch
    await userEvent.click(switchElement)
    await expect.element(switchElement).toHaveFocus()

    // Get initial state
    const initialChecked = await switchElement.getAttribute('aria-checked')

    // Toggle with enter key
    await this.pressKey('Enter')

    // State should have changed
    const newChecked = await switchElement.getAttribute('aria-checked')
    expect(newChecked).not.toBe(initialChecked)
  }

  async ShouldBeFocusableWithTab() {
    await userEvent.tab()
    const switchElement = page.getByRole('switch')
    await expect.element(switchElement).toHaveFocus()
  }

  async ShouldHaveCorrectAriaAttributes() {
    const switchElement = page.getByRole('switch')

    // Check required ARIA attributes
    await expect.element(switchElement).toHaveAttribute('role', 'switch')
    await expect.element(switchElement).toHaveAttribute('aria-checked')
    await expect.element(switchElement).toHaveAttribute('tabindex', '0')

    // Check aria-checked is either 'true' or 'false'
    const ariaChecked = await switchElement.getAttribute('aria-checked')
    expect(['true', 'false']).toContain(ariaChecked)
  }

  async ShouldNotToggleWhenDisabled() {
    const switchElement = page.getByRole('switch')

    // Check if switch is disabled
    const isDisabled = await switchElement.getAttribute('data-disabled')
    if (isDisabled === 'true' || await switchElement.getAttribute('aria-disabled') === 'true') {
      // Get initial state
      const initialChecked = await switchElement.getAttribute('aria-checked')

      // Try to click (should not work)
      await userEvent.click(switchElement)

      // State should not have changed
      const newChecked = await switchElement.getAttribute('aria-checked')
      expect(newChecked).toBe(initialChecked)

      // Should not be focusable when disabled
      await expect.element(switchElement).toHaveAttribute('tabindex', '-1')
    }
  }

  async ShouldHaveVisualStateIndicators() {
    const switchElement = page.getByRole('switch')
    const thumb = page.locator('[data-part="thumb"]')

    // Check initial visual state
    const isChecked = await switchElement.getAttribute('aria-checked') === 'true'

    if (isChecked) {
      await expect.element(switchElement).toHaveAttribute('data-state', 'checked')
      await expect.element(thumb).toHaveAttribute('data-state', 'checked')
    } else {
      await expect.element(switchElement).toHaveAttribute('data-state', 'unchecked')
      await expect.element(thumb).toHaveAttribute('data-state', 'unchecked')
    }

    // Toggle and check visual state changes
    await userEvent.click(switchElement)

    const newChecked = await switchElement.getAttribute('aria-checked') === 'true'

    if (newChecked) {
      await expect.element(switchElement).toHaveAttribute('data-state', 'checked')
      await expect.element(thumb).toHaveAttribute('data-state', 'checked')
    } else {
      await expect.element(switchElement).toHaveAttribute('data-state', 'unchecked')
      await expect.element(thumb).toHaveAttribute('data-state', 'unchecked')
    }
  }

  async ShouldHaveFocusVisualIndicator() {
    const switchElement = page.getByRole('switch')

    // Focus the switch
    await userEvent.tab()
    await expect.element(switchElement).toHaveFocus()
    await expect.element(switchElement).toHaveAttribute('data-focus-visible', 'true')

    // Blur the switch
    await userEvent.tab()
    await expect.element(switchElement).not.toHaveFocus()
  }

  async ShouldHandleFormIntegration() {
    const switchElement = page.getByRole('switch')
    const hiddenInput = page.locator('input[type="checkbox"][data-part="hidden-input"]')

    // If there's a hidden input for form integration
    if (hiddenInput.all().length > 0) {
      // Get initial states
      const initialSwitchChecked = await switchElement.getAttribute('aria-checked')
      const initialInputChecked = await hiddenInput.isChecked()

      // Toggle switch
      await userEvent.click(switchElement)

      // Both should be in sync
      const newSwitchChecked = await switchElement.getAttribute('aria-checked')
      const newInputChecked = await hiddenInput.isChecked()

      expect(newSwitchChecked === 'true').toBe(newInputChecked)
      expect(initialSwitchChecked === 'true').toBe(initialInputChecked)
    }
  }

  async ShouldPreventDefaultKeyHandling() {
    const switchElement = page.getByRole('switch')

    // Focus the switch
    await userEvent.click(switchElement)
    await expect.element(switchElement).toHaveFocus()

    // Test that arrow keys don't affect the switch (they're not handled)
    const initialChecked = await switchElement.getAttribute('aria-checked')

    await this.pressKey('ArrowUp')
    let currentChecked = await switchElement.getAttribute('aria-checked')
    expect(currentChecked).toBe(initialChecked)

    await this.pressKey('ArrowDown')
    currentChecked = await switchElement.getAttribute('aria-checked')
    expect(currentChecked).toBe(initialChecked)

    await this.pressKey('ArrowLeft')
    currentChecked = await switchElement.getAttribute('aria-checked')
    expect(currentChecked).toBe(initialChecked)

    await this.pressKey('ArrowRight')
    currentChecked = await switchElement.getAttribute('aria-checked')
    expect(currentChecked).toBe(initialChecked)
  }

  async ShouldSupportLabelAssociation() {
    const switchElement = page.getByRole('switch')

    // Check if switch has associated label
    const ariaLabelledBy = await switchElement.getAttribute('aria-labelledby')
    const ariaLabel = await switchElement.getAttribute('aria-label')

    // Should have either aria-labelledby or aria-label
    expect(ariaLabelledBy || ariaLabel).toBeTruthy()

    // If there's a label element, clicking it should toggle the switch
    if (ariaLabelledBy) {
      const label = page.locator(`#${ariaLabelledBy}`)
      if (label.all().length > 0) {
        const initialChecked = await switchElement.getAttribute('aria-checked')

        await userEvent.click(label)

        const newChecked = await switchElement.getAttribute('aria-checked')
        expect(newChecked).not.toBe(initialChecked)
      }
    }
  }
}
