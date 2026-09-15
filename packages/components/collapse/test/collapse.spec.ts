import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Collapse'

let el: HTMLElement | null = null

function mount() {
  el = document.createElement('div')
  document.body.appendChild(el)
  render(el)
}

function unmount() {
  if (el && el.parentElement)
    document.body.removeChild(el)
  el = null
}

describe('[collapse] browser tests - single / keyboard', () => {
  beforeEach(mount)
  afterEach(unmount)

  it('arrow down, focus next trigger', async () => {
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await testHook.pressKey('ArrowDown')
    await expect.element(testHook.getTrigger('automobiles')).toHaveFocus()
  })

  it('arrow up, focus previous trigger', async () => {
    const trigger = testHook.getTrigger('automobiles')
    await trigger.click()
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowUp')
    await expect.element(trigger).toHaveFocus()
  })

  it('home key, focus first trigger', async () => {
    const trigger = testHook.getTrigger('automobiles')
    await trigger.click()
    await testHook.pressKey('Home')

    await expect.element(testHook.getTrigger('watercraft')).toHaveFocus()
  })

  it('end key, focus last trigger', async () => {
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await testHook.pressKey('End')

    await expect.element(testHook.getTrigger('aircraft')).toHaveFocus()
  })
})

describe('[collapse] browser tests - single / pointer', () => {
  beforeEach(mount)
  afterEach(unmount)

  it('should show content with aria-expanded', async () => {
    const trigger = testHook.getTrigger('watercraft')
    const closed = await trigger.element()
    expect(closed.getAttribute('aria-expanded')).not.toBe('true')
    await trigger.click()
    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect.element(trigger).toHaveAttribute('data-state', 'open')
  })

  it('[collapsible=true] clicking the same open trigger closes the content', async () => {
    // controls default collapsible=true
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await trigger.click()
    await expect.element(testHook.getContent('watercraft')).not.toBeVisible()
  })

  it('[collapsible=false] clicking the same open trigger keeps content open', async () => {
    await page.getByTestId('collapsible').click()
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await trigger.click()
    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('then clicking another trigger: should close the previous content', async () => {
    await testHook.getTrigger('watercraft').click()
    await testHook.getTrigger('automobiles').click()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
    await expect.element(testHook.getContent('watercraft')).not.toBeVisible()
    const watercraft = await testHook.getTrigger('watercraft').element()
    expect(watercraft.getAttribute('aria-expanded')).not.toBe('true')
    await expect.element(testHook.getTrigger('automobiles')).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('[collapse] browser tests - multiple', () => {
  beforeEach(mount)
  afterEach(unmount)

  it('[multiple=true] keyboard can open two items at once', async () => {
    await page.getByTestId('multiple').click()
    const trigger = testHook.getTrigger('watercraft')

    await trigger.click()
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('Enter')

    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
  })

  it('[multiple=true] clicking another trigger keeps the previous content open', async () => {
    await page.getByTestId('multiple').click()
    await testHook.getTrigger('watercraft').click()
    await testHook.getTrigger('automobiles').click()

    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
  })
})

describe('[collapse] browser tests - orientation / disabled item', () => {
  beforeEach(mount)
  afterEach(unmount)

  it('[orientation=horizontal] uses ArrowRight/ArrowLeft for focus movement', async () => {
    await page.getByTestId('orientation').selectOptions('horizontal')
    await expect.element(testHook.getRootEl()).toHaveAttribute('data-orientation', 'horizontal')

    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await testHook.pressKey('ArrowRight')
    await expect.element(testHook.getTrigger('automobiles')).toHaveFocus()
    await testHook.pressKey('ArrowLeft')
    await expect.element(trigger).toHaveFocus()
  })

  it('[disabled item] aircraft trigger is not activatable', async () => {
    await page.getByTestId('disabledItem').click()
    const aircraft = testHook.getTrigger('aircraft')
    // Trigger uses disabled/aria-disabled; data-disabled lives on the item part.
    await expect.element(aircraft).toHaveAttribute('disabled', '')
    await expect.element(aircraft).toHaveAttribute('aria-disabled', 'true')
    await expect.element(page.locatoring('[data-collapse-item][data-value="aircraft"]')).toHaveAttribute('data-disabled', '')
    // Disabled buttons are not actionability-clickable in Playwright; content stays closed.
    await expect.element(testHook.getContent('aircraft')).not.toBeVisible()
  })
})
