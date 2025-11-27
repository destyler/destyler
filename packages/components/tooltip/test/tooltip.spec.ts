import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Tooltip'

let mountEl: HTMLElement
let cleanup: (() => void) | undefined

async function seeContent(id: string) {
  await expect.element(testHook.getContent(id).first()).toBeVisible()
}

async function dontSeeContent(id: string) {
  await expect.element(testHook.getContent(id).first()).not.toBeVisible()
}

async function focusPage() {
  await userEvent.click(page.getByTestId('focus'))
}

async function seeTriggerIsFocused(id: string) {
  await expect.element(testHook.getTrigger(id)).toHaveFocus()
}

describe('[tooltip] browser tests', () => {
  beforeEach(() => {
    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
    cleanup = render(mountEl)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined

    if (mountEl && mountEl.parentElement) {
      document.body.removeChild(mountEl)
    }
  })

  it('should open tooltip on hover interaction', async () => {
    await testHook.hoverTrigger('tip-1')
    await seeContent('tip-1')
    await testHook.unhoverTrigger('tip-1')
    await dontSeeContent('tip-1')
  })

  it('should show only one tooltip at a time', async () => {
    await testHook.hoverTrigger('tip-1')
    await testHook.hoverTrigger('tip-2')
    await dontSeeContent('tip-1')
    await seeContent('tip-2')
  })

  it('should work with focus/blur', async () => {
    await focusPage()
    await testHook.pressKey('Tab')

    await seeContent('tip-1')

    await testHook.clickOutside()
    await dontSeeContent('tip-1')
  })

  it('should work with focus/blur for multiple tooltips', async () => {
    await focusPage()
    await testHook.pressKey('Tab')

    await seeContent('tip-1')

    await testHook.pressKey('Tab')
    await seeTriggerIsFocused('tip-2')

    await dontSeeContent('tip-1')
    await seeContent('tip-2')
  })

  it('closes on esc press', async () => {
    await focusPage()
    await testHook.pressKey('Tab')

    await seeContent('tip-1')

    await testHook.pressKey('Escape')
    await dontSeeContent('tip-1')
  })
})
