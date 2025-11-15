import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Collapsible'

let el: HTMLElement

describe('[collapsible] browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('should be open when clicked', async () => {
    const triggerEl = testHook.getTrigger('collapsible')
    await triggerEl.click()

    const contentEl = testHook.getContent('collapsible')
    await expect.element(contentEl).toBeVisible()

    await triggerEl.click()
    await expect.element(contentEl).not.toBeVisible()
  })

  it('content should not be reachable via tab key', async () => {
    const triggerEl = testHook.getTrigger('collapsible')
    await triggerEl.click()
    await triggerEl.click()

    await userEvent.tab()

    await expect.element(page.getByRole('button', { name: 'Open' })).toHaveFocus()
  })
})
