import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Select'

let mount: HTMLElement | null = null
let cleanup: (() => void) | undefined

async function seeTriggerIsFocused() {
  await expect.element(testHook.getTrigger('select')).toHaveFocus()
}

async function seeDropdown() {
  await expect.element(testHook.getContent('select')).toBeVisible()
}

async function dontSeeDropdown() {
  await expect.element(testHook.getContent('select')).not.toBeVisible()
}

async function clickDeselectable() {
  const deselectable = page.getByTestId('deselectable')
  await deselectable.click()
}

async function seeTriggerHasText(text: string) {
  await expect.element(testHook.getTrigger('select')).toHaveTextContent(text)
}

async function seeItemIsHighlighted(item: string) {
  await expect.element(testHook.getItem(item)).toHaveAttribute('data-highlighted', '')
}

async function clickCloseOnSelect() {
  const closeOnSelect = page.getByTestId('closeOnSelect')
  await closeOnSelect.click()
}

async function seeItemIsChecked(item: string) {
  const itemEl = testHook.getItem(item)
  await expect.element(itemEl).toHaveAttribute('data-state', 'checked')
}

describe('select browser tests', () => {
  beforeEach(() => {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
  })

  afterEach(async () => {
    cleanup?.()
    cleanup = undefined

    if (mount && mount.parentElement) {
      document.body.removeChild(mount)
    }

    mount = null
  })

  it('clicking the label should focus control', async () => {
    await testHook.clickLabel('select')
    await seeTriggerIsFocused()
  })

  it('should toggle select', async () => {
    await testHook.clickTrigger('select')
    await seeDropdown()

    await testHook.clickTrigger('select')
    await dontSeeDropdown()
  })

  it('should deselect', async () => {
    await clickDeselectable()

    await testHook.clickTrigger('select')
    await testHook.clickItem('Albania')
    await seeTriggerHasText('Albania')

    await testHook.clickTrigger('select')
    await testHook.clickItem('Albania')
    await seeTriggerHasText('Select option')
  })

  it('clicking clear trigger should return focus', async () => {
    await testHook.clickTrigger('select')
    await testHook.clickItem('Albania')
    await seeTriggerHasText('Albania')

    await testHook.clickTrigger('select-clear')

    await seeTriggerIsFocused()
    await seeTriggerHasText('Select option')
  })

  it('should highlight on hover', async () => {
    await testHook.clickTrigger('select')

    await testHook.hoverItem('Albania')
    await seeItemIsHighlighted('Albania')

    await testHook.hoverItem('Algeria')
    await seeItemIsHighlighted('Algeria')
  })

  it('should navigate on arrow down', async () => {
    await testHook.clickTrigger('select')
    await testHook.pressKey('ArrowDown', 3)
    await seeItemIsHighlighted('Afghanistan')
  })

  it('should navigate on arrow up', async () => {
    await testHook.clickTrigger('select')
    await testHook.pressKey('ArrowUp', 3)
    await seeItemIsHighlighted('South Africa')
  })

  it('should navigate on home/end', async () => {
    await testHook.clickTrigger('select')
    await testHook.pressKey('End')

    await seeItemIsHighlighted('Zimbabwe')

    await testHook.pressKey('Home')
    await seeItemIsHighlighted('Andorra')
  })

  it('should navigate on typeahead', async () => {
    await testHook.clickTrigger('select')
    await userEvent.keyboard('Ca')
    await seeItemIsHighlighted('Canada')
  })

  it('should loop through the options when loop is enabled', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('Enter')

    await testHook.pressKey('ArrowUp')
    await seeItemIsHighlighted('Zimbabwe')

    await testHook.pressKey('ArrowDown')
    await seeItemIsHighlighted('Andorra')
  })

  it('should close on escape', async () => {
    await testHook.clickTrigger('select')
    await seeDropdown()

    await testHook.pressKey('Escape')
    await dontSeeDropdown()
  })

  it('should select on enter', async () => {
    await testHook.clickTrigger('select')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('Enter')
    await seeTriggerHasText('Andorra')
    await seeTriggerIsFocused()
  })

  it('should close on select', async () => {
    await testHook.clickTrigger('select')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('Enter')
    await dontSeeDropdown()
    await seeTriggerIsFocused()
  })

  it('should not close on closeOnSelect = false', async () => {
    await clickCloseOnSelect()
    await testHook.clickTrigger('select')
    await testHook.pressKey('ArrowDown')
    await testHook.pressKey('Enter')

    await seeDropdown()
  })

  it('should close on outside click', async () => {
    await testHook.clickTrigger('select')
    await seeDropdown()

    await testHook.clickOutside()
    await dontSeeDropdown()
  })

  it('should close on blur - no selection', async () => {
    await testHook.clickTrigger('select')
    await testHook.pressKey('ArrowDown', 3)
    await testHook.clickOutside()
    await dontSeeDropdown()
    await seeTriggerHasText('Select option')
  })

  it('should open the select with enter key', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('Enter')
    await seeDropdown()
  })

  it('should open with down arrow keys + highlight first option', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('ArrowDown')
    await seeDropdown()
    await seeItemIsHighlighted('Andorra')
  })

  it('should open with up arrow keys  + highlight last option', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('ArrowUp')
    await seeDropdown()
    await seeItemIsHighlighted('Zimbabwe')
  })

  it('should select last option on arrow left', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('ArrowLeft')
    await seeItemIsChecked('Zimbabwe')
  })

  it('should select first option on arrow right', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('ArrowRight')
    await seeItemIsChecked('Andorra')
  })

  it('should select next options on arrow right', async () => {
    await testHook.clickLabel('select')
    await testHook.pressKey('ArrowRight')
    await seeItemIsChecked('Andorra')

    await testHook.pressKey('ArrowRight')
    await seeItemIsChecked('United Arab Emirates')

    await testHook.pressKey('ArrowRight')
    await seeItemIsChecked('Afghanistan')
  })

  it('should select with typeahead', async () => {
    await testHook.clickLabel('select')
    await userEvent.keyboard('Nigeri')
    await seeItemIsChecked('Nigeria')
  })
})
