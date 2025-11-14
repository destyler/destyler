import { testHook } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/Carousel'

let el: HTMLElement

describe('[carousel] browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  it('renders correctly', async () => {
    render(el)
    const items = testHook.getItemEls()
    expect(items.all().length).toBe(5)
    await expect.element(testHook.getIndicatorEl().nth(0)).toHaveAttribute('data-current', '')
    await expect.element(items.nth(0)).toHaveAttribute('data-inview', 'true')
    await expect.element(items.nth(1)).toHaveAttribute('data-inview', 'false')
  })
  it('autoplay start/stop', async () => {
    render(el)
    const autoplayTrigger = testHook.getAutoPlayEl()
    await autoplayTrigger.click()
    await expect.element(autoplayTrigger).toHaveTextContent('Stop')
    await testHook.waitFor()

    await expect.element(testHook.getIndicatorEl().nth(1)).toHaveAttribute('data-current', '')
    await autoplayTrigger.click()
    await expect.element(autoplayTrigger).toHaveTextContent('Play')
    await expect.element(testHook.getIndicatorEl().nth(1)).toHaveAttribute('data-current', '')
  })

  it('clicking indicator scrolls to correct slide', async () => {
    render(el)
    const indicator = testHook.getIndicatorEl()
    await indicator.nth(1).click()
    await expect.element(indicator.nth(1)).toHaveAttribute('data-current', '')

    await expect.element(testHook.getItemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  })

  it('scroll to a specific index via button', async () => {
    render(el)
    await page.getByRole('button', { name: 'Scroll to 1' }).click()
    await expect.element(testHook.getItemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  })

  it('indicator keyboard navigation', async () => {
    render(el)
    const indicator = testHook.getIndicatorEl()
    await userEvent.type(indicator.nth(0), '{arrowright}')
    await expect.element(testHook.getItemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  })

  it('[loop=true] should loop slides', async () => {
    render(el)
    await page.getByTestId('loop').click()
    const prevTrigger = testHook.getPrevEl()
    await expect.element(prevTrigger).toBeEnabled()

    const nextTrigger = testHook.getNextEl()
    await nextTrigger.click()
    await nextTrigger.click()
    await expect.element(testHook.getItemEls().nth(0)).toHaveAttribute('data-inview', 'true')

    await nextTrigger.click()
    await expect.element(testHook.getItemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  })

  it('next and prev buttons navigate carousel', async () => {
    render(el)
    const prevTrigger = testHook.getPrevEl()
    await expect.element(prevTrigger).toBeDisabled()
    const nextTrigger = testHook.getNextEl()
    await expect.element(nextTrigger).toBeEnabled()
    await nextTrigger.click()
    await expect.element(testHook.getIndicatorEl().nth(1)).toHaveAttribute('data-current', '')
    await expect.element(prevTrigger).toBeEnabled()
  })
})
