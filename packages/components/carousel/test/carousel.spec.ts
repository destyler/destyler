import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect, vi } from 'vitest'

export async function RendersCorrectly() {
  const items = page.getByArticle(part('item'))
  expect(items.all().length).toBe(2)
  await expect.element(page.getByArticle(part('indicator')).nth(0)).toHaveAttribute('data-current', '')
  await expect.element(items.nth(0)).toHaveAttribute('data-inview', '')
  await expect.element(items.nth(1)).not.toHaveAttribute('data-inview', '')
}

export async function NextAndPrevButtonsNavigateCarousel() {
  const prevTrigger = page.getByArticle(part('prev-trigger'))
  await expect.element(prevTrigger).toBeDisabled()
  const nextTrigger = page.getByArticle(part('next-trigger'))
  await nextTrigger.click()
  await expect.element(page.getByArticle(part('indicator')).nth(1)).toHaveAttribute('data-current', '')
  await expect.element(prevTrigger).toBeEnabled()
}

export async function AutoplayStartAndStop() {
  const autoplayTrigger = page.getByArticle(part('autoplay-trigger'))
  await autoplayTrigger.click()
  await expect.element(autoplayTrigger).toHaveTextContent('Stop')
  await vi.waitFor(async () => {
    return true
  }, {
    timeout: 5000,
    interval: 50,
  })
  await expect.element(page.getByArticle(part('indicator')).nth(1)).toHaveAttribute('data-current', '')
  await autoplayTrigger.click()
  await expect.element(autoplayTrigger).toHaveTextContent('Play')
  await vi.waitFor(async () => {
    return true
  }, {
    timeout: 5000,
    interval: 50,
  })
  await expect.element(page.getByArticle(part('indicator')).nth(1)).toHaveAttribute('data-current', '')
}

export async function ClickingIndicatorScrollsToCorrectSlide() {
  const indicator = page.getByArticle(part('indicator'))
  await indicator.nth(1).click()
  await expect.element(indicator.nth(1)).toHaveAttribute('data-current', '')

  await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
}

export async function ScrollToSpecificIndexViaButton() {
  await page.getByRole('button', { name: 'Scroll to 1' }).click()
  await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
}

export async function IndicatorKeyboardNavigation() {
  const indicator = page.getByArticle(part('indicator'))
  await userEvent.type(indicator.nth(0), '{arrowright}')
  await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
}

export async function LoopShouldLoopSlides() {
  await page.getByTestId('loop').click()
  const prevTrigger = page.getByArticle(part('prev-trigger'))
  await expect.element(prevTrigger).toBeEnabled()

  const nextTrigger = page.getByArticle(part('next-trigger'))
  await nextTrigger.click()
  await nextTrigger.click()
  await expect.element(page.getByArticle(part('item')).nth(0)).toHaveAttribute('data-inview', '')

  await nextTrigger.click()
  await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
}
