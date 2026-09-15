import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Menu'

let mount: HTMLElement | null = null
let cleanup: (() => void) | undefined

function getItem(text: string) {
  return testHook.getItemEls().filter({ hasText: text }).first()
}

async function clickItem(text: string) {
  await getItem(text).click()
}

async function hoverItem(text: string) {
  await getItem(text).hover()
}

async function expectMenuOpen() {
  await expect.element(testHook.getContent('menu')).toBeVisible()
}

async function expectMenuClosed() {
  await expect.element(testHook.getContent('menu')).not.toBeInTheDocument()
}

async function expectItemHighlighted(text: string) {
  await expect.element(getItem(text)).toHaveAttribute('data-highlighted', '')
}

async function expectIndicatorState(state: 'open' | 'closed') {
  await expect.element(testHook.getIndicatorEl()).toHaveAttribute('data-state', state)
}

async function openMenu() {
  await testHook.clickTrigger('menu')
  await expectMenuOpen()
}

async function focusTrigger() {
  await openMenu()
  await testHook.pressKey('Escape')
  await expectMenuClosed()
}

describe('menu browser tests', () => {
  beforeEach(() => {
    document.querySelectorAll('[data-testid="menu:content"], [data-testid="menu-share:content"]').forEach((node) => {
      node.parentElement?.remove()
    })
    if (mount?.parentElement)
      document.body.removeChild(mount)
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined
    if (mount?.parentElement)
      document.body.removeChild(mount)
    mount = null
  })

  it('opens the menu when the trigger is clicked', async () => {
    await openMenu()
    await expectIndicatorState('open')
  })

  it('closes on escape', async () => {
    await openMenu()
    await testHook.pressKey('Escape')
    await expectMenuClosed()
    await expectIndicatorState('closed')
  })

  it('closes on outside click', async () => {
    await openMenu()
    await testHook.clickOutside()
    await expectMenuClosed()
  })

  it('selecting an item closes the menu by default', async () => {
    await openMenu()
    await clickItem('Edit')
    await expectMenuClosed()
  })

  it('respects closeOnSelect=false', async () => {
    await page.getByTestId('closeOnSelect').click()

    await openMenu()
    await clickItem('Delete')
    await expectMenuOpen()
  })

  it('arrow down opens the menu and highlights the first item', async () => {
    await focusTrigger()

    await testHook.pressKey('ArrowDown')

    await expectMenuOpen()
    await expectItemHighlighted('Edit')
  })

  it('arrow up opens the menu and highlights the last item', async () => {
    await focusTrigger()

    await testHook.pressKey('ArrowUp')

    await expectMenuOpen()
    await expectItemHighlighted('Export...')
  })

  it('loopFocus=true wraps navigation', async () => {
    await page.getByTestId('loopFocus').click()

    await focusTrigger()

    await testHook.pressKey('ArrowDown')
    await expectItemHighlighted('Edit')

    await testHook.pressKey('ArrowUp')
    await expectItemHighlighted('Export...')
  })

  it('typeahead highlights matching items', async () => {
    await openMenu()

    await userEvent.keyboard('Du')

    await expectItemHighlighted('Duplicate')
  })

  it('enter selects the highlighted item', async () => {
    await openMenu()
    await hoverItem('Duplicate')
    await expectItemHighlighted('Duplicate')

    await testHook.pressKey('Enter')

    await expectMenuClosed()
  })

  it('opens submenu via trigger item + ArrowRight', async () => {
    await openMenu()
    await page.getByTestId('menu:share-trigger').hover()
    await expect.element(page.getByTestId('menu:share-trigger')).toHaveAttribute('data-highlighted', '')

    await testHook.pressKey('ArrowRight')

    await expect.element(testHook.getContent('menu-share')).toBeVisible()
    await expect.element(page.getByTestId('menu:share-trigger')).toHaveAttribute('data-state', 'open')
  })

  it('opens submenu on trigger item pointer hover', async () => {
    await openMenu()
    await page.getByTestId('menu:share-trigger').hover()

    await expect.element(testHook.getContent('menu-share')).toBeVisible()
  })

  it('opens context menu on contextmenu and sets anchor', async () => {
    const contextTrigger = page.getByTestId('menu:context-trigger')
    const el = await contextTrigger.element()
    el.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 80,
    }))

    await expectMenuOpen()
  })

  it('toggles checkbox option item via getOptionItemProps', async () => {
    await openMenu()
    const bold = page.getByTestId('menu:option-bold')
    await expect.element(bold).toHaveAttribute('role', 'menuitemcheckbox')
    // spreadProps omits false boolean attrs
    const boldEl = await bold.element()
    expect(boldEl.getAttribute('aria-checked')).not.toBe('true')
    await expect.element(bold).toHaveAttribute('data-state', 'unchecked')

    await bold.click()

    await expect.element(bold).toHaveAttribute('aria-checked', 'true')
    await expect.element(bold).toHaveAttribute('data-state', 'checked')
    await expect.element(page.getByTestId('option-status')).toHaveAttribute('data-bold', 'true')
    await expectMenuOpen()
  })

  it('selects radio option item and fires onCheckedChange', async () => {
    await openMenu()
    const left = page.getByTestId('menu:option-align-left')
    const center = page.getByTestId('menu:option-align-center')

    await expect.element(left).toHaveAttribute('role', 'menuitemradio')
    await expect.element(left).toHaveAttribute('aria-checked', 'true')
    await expect.element(center).toHaveAttribute('data-state', 'unchecked')

    await center.click()

    await expect.element(center).toHaveAttribute('aria-checked', 'true')
    await expect.element(center).toHaveAttribute('data-state', 'checked')
    const leftEl = await left.element()
    expect(leftEl.getAttribute('aria-checked')).not.toBe('true')
    await expect.element(left).toHaveAttribute('data-state', 'unchecked')
    await expect.element(page.getByTestId('option-status')).toHaveAttribute('data-align', 'center')
    await expectMenuOpen()
  })
})
