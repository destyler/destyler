import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/NavigationMenu'

let mount: HTMLElement | null = null
let cleanup: (() => void) | undefined

// Page locator functions for assertions
function getTrigger(id: string) {
  return page.getByTestId(`${id}:trigger`)
}

function getContent(id: string) {
  return page.getByTestId(`${id}:content`)
}

function getItem(id: string) {
  return page.getByTestId(`${id}:item`)
}

function getLink(id: string) {
  return page.getByTestId(`${id}:link`)
}

// DOM helper functions for focus operations
function getTriggerEl(id: string) {
  const el = document.querySelector<HTMLButtonElement>(`[data-testid="${id}:trigger"]`)
  if (!el)
    throw new Error(`Expected trigger element for id ${id} to exist`)
  return el
}

async function waitForStability(interval = 350) {
  await vi.waitFor(async () => true, {
    timeout: 5000,
    interval,
  })
}

async function clickTrigger(id: string) {
  const trigger = getTrigger(id)
  await userEvent.click(trigger)
}

async function hoverTrigger(id: string) {
  const trigger = getTrigger(id)
  await userEvent.hover(trigger)
}

async function unhoverTrigger(id: string) {
  const trigger = getTrigger(id)
  await userEvent.unhover(trigger)
}

async function expectContentVisible(id: string) {
  await waitForStability()
  const content = getContent(id)
  await expect.element(content).toBeVisible()
}

async function expectContentNotVisible(id: string) {
  await waitForStability()
  const content = getContent(id)
  await expect.element(content).not.toBeInTheDocument()
}

async function expectTriggerState(id: string, state: 'open' | 'closed') {
  const trigger = getTrigger(id)
  await expect.element(trigger).toHaveAttribute('data-state', state)
}

async function expectTriggerFocused(id: string) {
  const trigger = getTrigger(id)
  await expect.element(trigger).toHaveFocus()
}

async function expectItemState(id: string, state: 'open' | 'closed') {
  const item = getItem(id)
  await expect.element(item).toHaveAttribute('data-state', state)
}

describe('[navigation-menu] browser tests', () => {
  beforeEach(() => {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined

    if (mount && mount.parentElement) {
      document.body.removeChild(mount)
    }

    mount = null
  })

  describe('click interactions', () => {
    it('should open menu when trigger is clicked', async () => {
      await clickTrigger('getting-started')
      await waitForStability()

      await expectTriggerState('getting-started', 'open')
      await expectItemState('getting-started', 'open')
      await expectContentVisible('getting-started')
    })

    it('should close menu when clicking the same trigger again', async () => {
      await clickTrigger('getting-started')
      await waitForStability()
      await expectContentVisible('getting-started')

      await clickTrigger('getting-started')
      await waitForStability()

      await expectTriggerState('getting-started', 'closed')
      await expectContentNotVisible('getting-started')
    })

    it('should switch between menu items when clicking different triggers', async () => {
      await clickTrigger('getting-started')
      await waitForStability()
      await expectContentVisible('getting-started')

      await clickTrigger('components')
      await waitForStability()

      await expectTriggerState('getting-started', 'closed')
      await expectTriggerState('components', 'open')
      await expectContentVisible('components')
    })
  })

  describe('hover interactions', () => {
    it('should open menu when hovering over trigger', async () => {
      await hoverTrigger('getting-started')
      await waitForStability()

      await expectTriggerState('getting-started', 'open')
      await expectContentVisible('getting-started')
    })

    it('should close menu when unhovering trigger', async () => {
      await hoverTrigger('getting-started')
      await waitForStability()
      await expectContentVisible('getting-started')

      await unhoverTrigger('getting-started')
      await waitForStability()

      await expectTriggerState('getting-started', 'closed')
      await expectContentNotVisible('getting-started')
    })

    it('should switch between menu items when hovering different triggers', async () => {
      await hoverTrigger('getting-started')
      await waitForStability()
      await expectContentVisible('getting-started')

      await hoverTrigger('components')
      await waitForStability()

      await expectTriggerState('components', 'open')
      await expectContentVisible('components')
    })

    it('should keep menu open when moving from trigger to content', async () => {
      await hoverTrigger('getting-started')
      await waitForStability()

      const content = getContent('getting-started')
      await userEvent.hover(content)
      await waitForStability()

      await expectContentVisible('getting-started')
    })
  })

  describe('keyboard navigation', () => {
    it('should navigate to next trigger with ArrowRight', async () => {
      await clickTrigger('getting-started')
      await waitForStability()

      await testHook.pressKey('ArrowRight')
      await expectTriggerFocused('components')
    })

    it('should navigate to previous trigger with ArrowLeft', async () => {
      await clickTrigger('components')
      await waitForStability()

      await testHook.pressKey('ArrowLeft')
      await expectTriggerFocused('getting-started')
    })

    it('should navigate to first trigger with Home key', async () => {
      await clickTrigger('components')
      await waitForStability()

      await testHook.pressKey('Home')
      await expectTriggerFocused('getting-started')
    })

    it('should navigate to last trigger with End key', async () => {
      await clickTrigger('getting-started')
      await waitForStability()

      await testHook.pressKey('End')
      // docs is a link, not a trigger button, so End should focus the last trigger button (components)
      await expectTriggerFocused('components')
    })

    it('should open menu with Enter key on trigger', async () => {
      const trigger = getTrigger('getting-started')
      await trigger.click()
      await waitForStability()

      // Close the menu first
      await clickTrigger('getting-started')
      await waitForStability()
      await expectContentNotVisible('getting-started')

      // Focus and press Enter using DOM element
      const triggerEl = getTriggerEl('getting-started')
      triggerEl.focus()
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(triggerEl)
      })
      await testHook.pressKey('Enter')
      await waitForStability()

      await expectContentVisible('getting-started')
    })

    it('should open menu with Space key on trigger', async () => {
      // Focus using DOM element
      const triggerEl = getTriggerEl('components')
      triggerEl.focus()
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(triggerEl)
      })

      await testHook.pressKey('Space')
      await waitForStability()

      await expectContentVisible('components')
    })

    it('should open menu with ArrowDown on horizontal trigger', async () => {
      // Focus using DOM element
      const triggerEl = getTriggerEl('getting-started')
      triggerEl.focus()
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(triggerEl)
      })

      await testHook.pressKey('ArrowDown')
      await waitForStability()

      await expectContentVisible('getting-started')
    })
  })

  describe('content behavior', () => {
    it('should display correct content for each menu item', async () => {
      await clickTrigger('getting-started')
      await waitForStability()

      const gettingStartedContent = getContent('getting-started')
      await expect.element(gettingStartedContent).toBeVisible()

      await clickTrigger('components')
      await waitForStability()

      const componentsContent = getContent('components')
      await expect.element(componentsContent).toBeVisible()
    })

    it('should show links inside content', async () => {
      await clickTrigger('getting-started')
      await waitForStability()

      const introLink = getLink('intro')
      await expect.element(introLink).toBeInTheDocument()
    })
  })

  describe('link interactions', () => {
    it('should have docs link always visible', async () => {
      const docsLink = getLink('docs')
      await expect.element(docsLink).toBeVisible()
    })
  })

  describe('data attributes', () => {
    it('should set data-state on trigger', async () => {
      await expectTriggerState('getting-started', 'closed')

      await clickTrigger('getting-started')
      await waitForStability()

      await expectTriggerState('getting-started', 'open')
    })

    it('should set data-state on item', async () => {
      await expectItemState('getting-started', 'closed')

      await clickTrigger('getting-started')
      await waitForStability()

      await expectItemState('getting-started', 'open')
    })

    it('should set aria-expanded on trigger when open', async () => {
      await waitForStability()

      // Click to open the menu
      await clickTrigger('getting-started')
      await waitForStability()

      const trigger = getTrigger('getting-started')
      await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('motion attribute', () => {
    it('should set data-motion attribute on content for animation direction', async () => {
      await clickTrigger('getting-started')
      await waitForStability()

      const gettingStartedContent = getContent('getting-started')
      await expect.element(gettingStartedContent).toHaveAttribute('data-motion')

      await clickTrigger('components')
      await waitForStability()

      const componentsContent = getContent('components')
      await expect.element(componentsContent).toHaveAttribute('data-motion')
    })
  })
})
