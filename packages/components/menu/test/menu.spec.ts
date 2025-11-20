import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Menu'

let mount: HTMLElement | null = null

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
    document.querySelectorAll('[data-testid="menu:content"]').forEach((node) => {
      node.parentElement?.remove()
    })
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
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
})
