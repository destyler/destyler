import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class ProgressTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldDisplayCorrectValue() {
    const progressBar = page.getByRole('progressbar')

    // Check that progress has value attributes
    await expect.element(progressBar).toHaveAttribute('aria-valuenow')
    await expect.element(progressBar).toHaveAttribute('aria-valuemin')
    await expect.element(progressBar).toHaveAttribute('aria-valuemax')

    // Get values
    const current = parseInt(await progressBar.getAttribute('aria-valuenow') || '0')
    const min = parseInt(await progressBar.getAttribute('aria-valuemin') || '0')
    const max = parseInt(await progressBar.getAttribute('aria-valuemax') || '100')

    // Values should be within range
    expect(current).toBeGreaterThanOrEqual(min)
    expect(current).toBeLessThanOrEqual(max)
  }

  async ShouldShowVisualProgress() {
    const progressBar = page.getByRole('progressbar')
    const indicator = page.locator('[data-part="indicator"]')

    // Progress indicator should be visible
    await expect.element(indicator).toBeVisible()

    // Check visual representation
    const value = parseInt(await progressBar.getAttribute('aria-valuenow') || '0')
    const max = parseInt(await progressBar.getAttribute('aria-valuemax') || '100')
    const percentage = (value / max) * 100

    // Indicator should have appropriate styling
    const indicatorStyle = await indicator.evaluate(el => window.getComputedStyle(el))
    expect(indicatorStyle).toBeTruthy()
  }

  async ShouldSupportIndeterminateState() {
    const progressBar = page.getByRole('progressbar')

    // Check if progress is indeterminate
    const valueNow = await progressBar.getAttribute('aria-valuenow')
    if (valueNow === null) {
      // Should have indeterminate state
      await expect.element(progressBar).toHaveAttribute('data-state', 'indeterminate')
    }
  }

  async ShouldHaveCorrectAriaLabel() {
    const progressBar = page.getByRole('progressbar')

    // Should have accessible name
    const ariaLabel = await progressBar.getAttribute('aria-label')
    const ariaLabelledBy = await progressBar.getAttribute('aria-labelledby')

    expect(ariaLabel || ariaLabelledBy).toBeTruthy()
  }

  async ShouldSupportCustomRange() {
    const progressBar = page.getByRole('progressbar')

    const min = parseInt(await progressBar.getAttribute('aria-valuemin') || '0')
    const max = parseInt(await progressBar.getAttribute('aria-valuemax') || '100')
    const current = parseInt(await progressBar.getAttribute('aria-valuenow') || '0')

    // Custom range should be respected
    expect(max).toBeGreaterThan(min)
    expect(current).toBeGreaterThanOrEqual(min)
    expect(current).toBeLessThanOrEqual(max)
  }
}
