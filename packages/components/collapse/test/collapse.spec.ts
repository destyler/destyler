import { testHook } from '@destyler/shared-private/test'
import { page } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/Collapse'

let el: HTMLElement

describe('[collapse] browser tests - single / keyboard', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  it('arrow down, focus next trigger', async () => {
    render(el)
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await testHook.pressKey('ArrowDown')
    await expect.element(testHook.getTrigger('automobiles')).toHaveFocus()
  })

  it('arrow up, focus previous trigger', async () => {
    render(el)
    const trigger = testHook.getTrigger('automobiles')
    await trigger.click()
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('ArrowUp')
    await expect.element(trigger).toHaveFocus()
  })

  it('home key, focus first trigger', async () => {
    render(el)
    const trigger = testHook.getTrigger('automobiles')
    await trigger.click()
    await testHook.pressKey('Home')

    await expect.element(testHook.getTrigger('watercraft')).toHaveFocus()
  })

  it('end key, focus last trigger', async () => {
    render(el)
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await testHook.pressKey('End')

    await expect.element(testHook.getTrigger('aircraft')).toHaveFocus()
  })
})

describe('[collapse] browser tests - single / pointer', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  it('should show content', async () => {
    render(el)
    const trigger = testHook.getTrigger('watercraft')
    await trigger.click()
    await expect.element(testHook.getContent('watercraft')).toBeVisible()
  })

  it('then clicking the same trigger again: should not close the content', async () => {
    render(el)
    const trigger = testHook.getTrigger('watercraft')
    await trigger.dblClick()

    await expect.element(testHook.getContent('watercraft')).not.toBeVisible()
  })

  it('then clicking another trigger: should close the previous content', async () => {
    render(el)
    await testHook.getTrigger('watercraft').click()
    await testHook.getTrigger('automobiles').click()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
    await expect.element(testHook.getContent('watercraft')).not.toBeVisible()
  })
})

describe('[collapse] browser tests - multiple / keyboard', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  it('[multiple=true] on arrow down, focus next trigger', async () => {
    render(el)
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
    render(el)

    await page.getByTestId('multiple').click()
    await testHook.getTrigger('watercraft').click()
    await testHook.getTrigger('automobiles').click()

    await expect.element(testHook.getContent('watercraft')).toBeVisible()
    await expect.element(testHook.getContent('automobiles')).toBeVisible()
  })
})
