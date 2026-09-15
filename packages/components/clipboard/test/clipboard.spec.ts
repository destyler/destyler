import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Clipboard'
import { dom } from '../src/dom'

let el: HTMLElement | null = null
let copySpy: ReturnType<typeof vi.spyOn> | undefined

describe('[clipboard] browser tests', () => {
  beforeEach(() => {
    copySpy?.mockRestore()
    copySpy = vi.spyOn(dom, 'writeToClipboard').mockResolvedValue(undefined)

    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  afterEach(() => {
    copySpy?.mockRestore()
    copySpy = undefined
    if (el && el.parentElement)
      document.body.removeChild(el)
    el = null
  })

  it('renders default clipboard state', async () => {
    await expect.element(testHook.getRootEl()).toBeVisible()
    const trigger = page.locatoring('[data-part=trigger]')
    await expect.element(trigger).toHaveTextContent('Copy')
    await expect.element(trigger).toHaveAttribute('aria-label', 'Copy to clipboard')
    await expect.element(page.locatoring('[data-part=input]')).toHaveValue('https://destyler.org')

    await expect.element(page.locatoring('[data-clipboard-indicator][data-copied="true"]')).not.toBeVisible()
    await expect.element(page.locatoring('[data-clipboard-indicator][data-copied="false"]')).toBeVisible()
  })

  it('copies value when trigger is clicked', async () => {
    const trigger = page.locatoring('[data-part=trigger]')
    await trigger.click()

    expect(copySpy).toHaveBeenCalledTimes(1)
    await expect.element(trigger).toHaveTextContent('Copied')
    await expect.element(trigger).toHaveAttribute('aria-label', 'Copied to clipboard')
    await expect.element(trigger).toHaveAttribute('data-copied', '')
    await expect.element(page.locatoring('[data-clipboard-indicator][data-copied="true"]')).toBeVisible()
    await expect.element(page.locatoring('[data-clipboard-indicator][data-copied="false"]')).not.toBeVisible()
  })

  it('copies when trigger is activated with Enter', async () => {
    const trigger = page.locatoring('[data-part=trigger]')
    const node = await trigger.element()
    ;(node as HTMLElement).focus()
    await testHook.pressKey('Enter')

    expect(copySpy).toHaveBeenCalledTimes(1)
    await expect.element(trigger).toHaveTextContent('Copied')
    await expect.element(trigger).toHaveAttribute('aria-label', 'Copied to clipboard')
  })

  it('enters copied state when the input emits a copy event', async () => {
    const input = el!.querySelector<HTMLInputElement>('[data-part="input"]')
    expect(input).not.toBeNull()
    input?.dispatchEvent(new Event('copy', { bubbles: true }))

    expect(copySpy).not.toHaveBeenCalled()
    await expect.element(page.locatoring('[data-part=trigger]')).toHaveTextContent('Copied')
    await expect.element(page.locatoring('[data-clipboard-indicator][data-copied="true"]')).toBeVisible()
    await expect.element(page.locatoring('[data-clipboard-indicator][data-copied="false"]')).not.toBeVisible()
  })
})
