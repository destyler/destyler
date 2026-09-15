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

  it('then clicking the same trigger again: should not close the content', async () => {
    const trigger = testHook.getTrigger('watercraft')
    await trigger.dblClick()

    await expect.element(testHook.getContent('watercraft')).not.toBeVisible()
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

describe('[collapse] browser tests - multiple / keyboard', () => {
  beforeEach(mount)
  afterEach(unmount)

  it('[multiple=true] on arrow down, focus next trigger', async () => {
    await page.getByTestId('multiple').click()
    const trigger = testHook.getTrigger('watercraft')

    await trigger.dblClick()

    await testHook.pressKey('Enter')

    await testHook.pressKey('ArrowDown')

    await testHook.pressKey('Enter')

    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
  })

  it('[multiple=true] clicking another trigger, should close the previous content', async () => {
    await page.getByTestId('multiple').click()
    await testHook.getTrigger('watercraft').click()
    await testHook.getTrigger('automobiles').click()

    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
  })
})
