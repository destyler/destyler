import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import Carousel from '../model/Carousel.vue'

describe('carousel vue browser tests', () => {
  it('renders correctly', async () => {
    render(Carousel)
    const items = page.getByArticle(part('item'))
    expect(items.all().length).toBe(2)
    await expect.element(page.getByArticle(part('indicator')).nth(0)).toHaveAttribute('data-current', '')
    await expect.element(items.nth(0)).toHaveAttribute('data-inview', '')
    await expect.element(items.nth(1)).not.toHaveAttribute('data-inview', '')
  })

  it('next/prev buttons navigate carousel', async () => {
    render(Carousel)
    const prevTrigger = page.getByArticle(part('prev-trigger'))
    await expect.element(prevTrigger).toBeDisabled()
    const nextTrigger = page.getByArticle(part('next-trigger'))
    await nextTrigger.click()
    await expect.element(page.getByArticle(part('indicator')).nth(1)).toHaveAttribute('data-current', '')
    await expect.element(prevTrigger).toBeEnabled()
  })

  it('autoplay start/stop', async () => {
    render(Carousel)
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
  })

  it('clicking indicator scrolls to correct slide', async () => {
    render(Carousel)
    const indicator = page.getByArticle(part('indicator'))
    await indicator.nth(1).click()
    await expect.element(indicator.nth(1)).toHaveAttribute('data-current', '')

    await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
  })

  it('scroll to a specific index via button', async () => {
    render(Carousel)

    await page.getByRole('button', { name: 'Scroll to 1' }).click()
    await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
  })

  it('indicator keyboard navigation', async () => {
    render(Carousel)
    const indicator = page.getByArticle(part('indicator'))
    await userEvent.type(indicator.nth(0), '{arrowright}')
    await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
  })

  it('[loop=true] should loop slides', async () => {
    render(Carousel)

    await page.getByTestId('loop').click()
    const prevTrigger = page.getByArticle(part('prev-trigger'))
    await expect.element(prevTrigger).toBeEnabled()

    const nextTrigger = page.getByArticle(part('next-trigger'))
    await nextTrigger.click()
    await nextTrigger.click()
    await expect.element(page.getByArticle(part('item')).nth(0)).toHaveAttribute('data-inview', '')

    await nextTrigger.click()
    await expect.element(page.getByArticle(part('item')).nth(1)).toHaveAttribute('data-inview', '')
  })
})
