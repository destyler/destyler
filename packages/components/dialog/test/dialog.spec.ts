import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Dialog'

let mount: HTMLElement | null = null
let cleanup: (() => void) | undefined

function removeOrphanDialogPortals() {
  document.querySelectorAll('[data-scope="dialog"][data-part="backdrop"], [data-scope="dialog"][data-part="positioner"]').forEach((node) => {
    node.remove()
  })
}

async function seeContent() {
  await expect.element(testHook.getContent('dialog')).toBeVisible()
}

async function dontSeeContent() {
  await expect.element(testHook.getContent('dialog')).not.toBeInTheDocument()
}

async function seeFirstFocusableIsFocused() {
  const inputEl = testHook.getInputEl('dialog')
  await expect.element(inputEl).toHaveFocus()
}

async function seeTriggerIsFocused() {
  const triggerEl = testHook.getTrigger('dialog')
  await expect.element(triggerEl).toHaveFocus()
}

async function toggleControl(id: string) {
  await page.getByTestId(id).click()
}

async function setSelectControl(id: string, value: string) {
  await page.getByTestId(id).selectOptions(value)
}

describe('dialog browser tests', () => {
  beforeEach(() => {
    removeOrphanDialogPortals()
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined
    removeOrphanDialogPortals()

    if (mount && mount.parentElement)
      document.body.removeChild(mount)

    mount = null
  })

  it('should focus first focusable when open and return focus to trigger on Escape', async () => {
    await testHook.clickTrigger('dialog')
    await seeFirstFocusableIsFocused()

    await testHook.pressKey('Escape')

    await dontSeeContent()
    await seeTriggerIsFocused()
  })

  it('should show content when open', async () => {
    await dontSeeContent()
    await testHook.clickTrigger('dialog')
    await seeContent()
    await expect.element(testHook.getContent('dialog')).toHaveAttribute('data-state', 'open')
  })

  it('should set aria-modal=true by default', async () => {
    await testHook.clickTrigger('dialog')
    await seeContent()
    await expect.element(testHook.getContent('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('[modal=false] should set aria-modal=false', async () => {
    await toggleControl('modal')
    await testHook.clickTrigger('dialog')
    await seeContent()
    // spreadProps omits false boolean attrs, so aria-modal should be absent/falsey
    const content = await testHook.getContent('dialog').element()
    expect(content.getAttribute('aria-modal')).not.toBe('true')
  })

  it('should close when clicking the close trigger', async () => {
    await testHook.clickTrigger('dialog')
    await seeContent()

    await testHook.getClearEl('dialog').click()

    await dontSeeContent()
    await seeTriggerIsFocused()
  })

  it('should mark trigger as expanded while open', async () => {
    const trigger = testHook.getTrigger('dialog')

    await testHook.clickTrigger('dialog')
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')

    await testHook.pressKey('Escape')
    await dontSeeContent()
  })

  it('[closeOnInteractOutside=true] should close when interacting outside content', async () => {
    await toggleControl('closeOnInteractOutside')
    await testHook.clickTrigger('dialog')
    await seeContent()

    // interact-outside registers pointerdown on a timeout(0); wait a frame first
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const positioner = await page.getByArticle('[data-scope="dialog"][data-part="positioner"]').element()
    positioner.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: 1,
      clientY: 1,
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
    }))

    await dontSeeContent()
  })

  it('[closeOnEscape=false] should keep dialog open on Escape', async () => {
    await toggleControl('closeOnEscape')
    await testHook.clickTrigger('dialog')
    await seeContent()

    await testHook.pressKey('Escape')
    await seeContent()
  })

  it('[role=alertdialog] should set role and focus the close trigger', async () => {
    await setSelectControl('role', 'alertdialog')
    await testHook.clickTrigger('dialog')
    await seeContent()

    await expect.element(testHook.getContent('dialog')).toHaveAttribute('role', 'alertdialog')
    await expect.element(testHook.getClearEl('dialog')).toHaveFocus()
  })

  it('[trapFocus=false] should allow Tab to leave the dialog content', async () => {
    await toggleControl('trapFocus')
    await testHook.clickTrigger('dialog')
    await seeContent()

    // Land on the last focusable inside content, then Tab past it
    await page.getByTestId('dialog:save').click()
    await expect.element(page.getByTestId('dialog:save')).toHaveFocus()
    await testHook.pressKey('Tab') // close trigger
    await testHook.pressKey('Tab') // should leave content (no trap)

    const content = await testHook.getContent('dialog').element()
    await expect.poll(() => {
      const active = document.activeElement
      return !!active && !content.contains(active)
    }).toBe(true)
  })

  it('[preventScroll=true] should lock body scroll while open', async () => {
    await testHook.clickTrigger('dialog')
    await seeContent()
    expect(document.body.hasAttribute('data-scroll-lock')).toBe(true)

    await testHook.pressKey('Escape')
    await dontSeeContent()
    expect(document.body.hasAttribute('data-scroll-lock')).toBe(false)
  })

  it('[preventScroll=false] should not lock body scroll while open', async () => {
    await toggleControl('preventScroll')
    await testHook.clickTrigger('dialog')
    await seeContent()
    expect(document.body.hasAttribute('data-scroll-lock')).toBe(false)
  })

  it('[useInitialFocusEl] should focus the configured initial focus element', async () => {
    await toggleControl('useInitialFocusEl')
    await testHook.clickTrigger('dialog')
    await seeContent()
    await expect.element(page.getByTestId('dialog:save')).toHaveFocus()
  })

  it('[useFinalFocusEl] should return focus to the configured final focus element', async () => {
    await toggleControl('useFinalFocusEl')
    await testHook.clickTrigger('dialog')
    await seeContent()

    await testHook.pressKey('Escape')
    await dontSeeContent()
    await expect.element(page.getByTestId('dialog:final-focus')).toHaveFocus()
  })
})
