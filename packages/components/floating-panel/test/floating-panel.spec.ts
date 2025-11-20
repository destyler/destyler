import type { Locator } from 'vitest/browser'
import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/FloatingPanel'

const PANEL_ID = 'floating-panel'

let mount: HTMLElement

function getContent(): Locator {
  return testHook.getContent(PANEL_ID)
}

function getTrigger(): Locator {
  return testHook.getTrigger(PANEL_ID)
}

function getBody(): Locator {
  return testHook.getPart('body')
}

function getDragTrigger(): Locator {
  return testHook.getPart('drag-trigger')
}

function getMinimizeTrigger(): Locator {
  return testHook.getPart('minimize-trigger')
}

function getMaximizeTrigger(): Locator {
  return testHook.getPart('maximize-trigger')
}

function getRestoreTrigger(): Locator {
  return testHook.getPart('restore-trigger')
}

function getCloseTrigger(): Locator {
  return testHook.getPart('close-trigger')
}

function getResizeTrigger(axis: string): Locator {
  return page.getByArticle(`${testHook.part('resize-trigger')}[data-axis="${axis}"]`)
}

function getPersistRectControl(): Locator {
  return page.getByTestId('persistRect')
}

function getResizableControl(): Locator {
  return page.getByTestId('resizable')
}

function getDraggableControl(): Locator {
  return page.getByTestId('draggable')
}

async function openPanel() {
  await getTrigger().click()
  await expect.element(getContent()).toHaveAttribute('data-state', 'open')
}

async function closePanel() {
  await getCloseTrigger().click()
  await expect.element(getContent()).toHaveAttribute('data-state', 'closed')
}

async function focusPanel() {
  await getContent().click()
}

async function getPositionerCoords() {
  const node = document.querySelector<HTMLElement>(testHook.part('positioner'))
  if (!node)
    return { x: 0, y: 0 }

  const style = getComputedStyle(node)
  const parse = (value: string) => Number.parseFloat(value || '0')
  return {
    x: parse(style.getPropertyValue('--x')),
    y: parse(style.getPropertyValue('--y')),
  }
}

describe('floating-panel browser tests', () => {
  beforeEach(async () => {
    if (mount)
      mount.remove()

    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('opens via trigger and closes via close button', async () => {
    await openPanel()
    await closePanel()
  })

  it('closes on escape when focused', async () => {
    await openPanel()
    await focusPanel()

    await testHook.pressKey('Escape')

    await expect.element(getContent()).toHaveAttribute('data-state', 'closed')
  })

  it('minimize hides body until restored', async () => {
    await openPanel()

    const body = getBody()
    const restoreTrigger = getRestoreTrigger()
    const minimizeTrigger = getMinimizeTrigger()
    const maximizeTrigger = getMaximizeTrigger()

    await expect.element(body).not.toHaveAttribute('hidden')
    await expect.element(restoreTrigger).toHaveAttribute('hidden')
    await expect.element(minimizeTrigger).not.toHaveAttribute('hidden')
    await expect.element(maximizeTrigger).not.toHaveAttribute('hidden')

    await minimizeTrigger.click()

    await expect.element(body).toHaveAttribute('hidden')
    await expect.element(restoreTrigger).not.toHaveAttribute('hidden')
    await expect.element(minimizeTrigger).toHaveAttribute('hidden')
    await expect.element(maximizeTrigger).toHaveAttribute('hidden')

    await restoreTrigger.click()

    await expect.element(body).not.toHaveAttribute('hidden')
    await expect.element(restoreTrigger).toHaveAttribute('hidden')
    await expect.element(minimizeTrigger).not.toHaveAttribute('hidden')
    await expect.element(maximizeTrigger).not.toHaveAttribute('hidden')
  })

  it('double clicking drag area toggles maximize and restore', async () => {
    await openPanel()

    const dragTrigger = getDragTrigger()
    const restoreTrigger = getRestoreTrigger()

    await dragTrigger.dblClick()
    await expect.element(restoreTrigger).not.toHaveAttribute('hidden')

    await dragTrigger.dblClick()
    await expect.element(restoreTrigger).toHaveAttribute('hidden')
  })

  it('arrow keys move the panel position', async () => {
    await openPanel()
    await focusPanel()

    const initial = await getPositionerCoords()

    await testHook.pressKey('ArrowRight')
    await testHook.pressKey('ArrowDown')

    const next = await getPositionerCoords()

    expect(next.x).toBe(initial.x + 1)
    expect(next.y).toBe(initial.y + 1)
  })

  it('resets rect on close when persistRect is disabled', async () => {
    await openPanel()
    await focusPanel()

    const initial = await getPositionerCoords()

    await testHook.pressKey('ArrowRight', 5)
    await testHook.pressKey('ArrowDown', 3)

    const moved = await getPositionerCoords()
    expect(moved.x).toBeGreaterThan(initial.x)
    expect(moved.y).toBeGreaterThan(initial.y)

    await closePanel()
    await openPanel()

    const reopened = await getPositionerCoords()
    expect(reopened.x).toBe(initial.x)
    expect(reopened.y).toBe(initial.y)
  })

  it('preserves rect when persistRect is enabled', async () => {
    await getPersistRectControl().click()

    await openPanel()
    await focusPanel()

    await testHook.pressKey('ArrowRight', 4)
    await testHook.pressKey('ArrowDown', 2)

    const moved = await getPositionerCoords()

    await closePanel()
    await openPanel()

    const reopened = await getPositionerCoords()
    expect(reopened.x).toBe(moved.x)
    expect(reopened.y).toBe(moved.y)
  })

  it('disables resize handles when resizable is false', async () => {
    await getResizableControl().click()
    await openPanel()

    await expect.element(getResizeTrigger('e')).toHaveAttribute('data-disabled', '')
  })

  it('disables drag trigger when draggable is false', async () => {
    await getDraggableControl().click()
    await openPanel()

    await expect.element(getDragTrigger()).toHaveAttribute('data-disabled', '')
  })
})
