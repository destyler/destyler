import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Tabs'

let el: HTMLElement

function getTabPanel(id: string) {
  return page.getByTestId(`${id}:panel`)
}

async function seeTabIsFocused(id: string) {
  const el = testHook.getTrigger(id)
  await expect.element(el).toHaveFocus()
}

async function seeTabContent(id: string) {
  const el = getTabPanel(id)
  await expect.element(el).toBeVisible()
}

async function dontSeeTabContent(id: string) {
  const el = getTabPanel(id)
  await expect.element(el).not.toBeVisible()
}

async function clickDeselect() {
  const el = page.getByTestId('deselectable')
  await userEvent.click(el)
}

async function selectManual(value: string) {
  const el = page.getByTestId('activationMode')
  await userEvent.selectOptions(el, value)
}

async function clickLoopFocus() {
  const el = page.getByTestId('loopFocus')
  await userEvent.click(el)
}

describe('[tabs] browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('on home key, select first tab', async () => {
    await testHook.clickTrigger('agnes')
    await testHook.pressKey('Home')

    await seeTabIsFocused('nils')
    await seeTabContent('nils')
  })

  it('on end key, select last tab', async () => {
    await testHook.clickTrigger('agnes')
    await testHook.pressKey('End')

    await seeTabIsFocused('joke')
    await seeTabContent('joke')
  })

  it('click tab, select tab', async () => {
    await testHook.clickTrigger('agnes')
    await seeTabContent('agnes')
  })

  it('should deselect', async () => {
    await clickDeselect()

    await testHook.clickTrigger('agnes')
    await seeTabContent('agnes')

    await testHook.clickTrigger('agnes')
    await dontSeeTabContent('agnes')

    await testHook.clickTrigger('agnes')
    await seeTabContent('agnes')
  })

  it('automatic: should select the correct tab on click', async () => {
    await testHook.clickTrigger('nils')
    await seeTabContent('nils')

    await testHook.clickTrigger('agnes')
    await seeTabContent('agnes')

    await testHook.clickTrigger('joke')
    await seeTabContent('joke')
  })

  it('automatic: on arrow right, select + focus next tab', async () => {
    await testHook.clickTrigger('nils')
    await testHook.pressKey('ArrowRight')

    await seeTabIsFocused('agnes')
    await seeTabContent('agnes')
  })

  it('automatic: on arrow right, loop focus + selection', async () => {
    await testHook.clickTrigger('joke')
    await testHook.pressKey('ArrowRight', 3)

    await seeTabIsFocused('joke')
    await seeTabContent('joke')
  })

  it('automatic: on arrow left, select + focus the previous tab', async () => {
    await testHook.clickTrigger('nils')
    await testHook.pressKey('ArrowLeft')

    await seeTabIsFocused('joke')
    await seeTabContent('joke')
  })

  it('manual: on arrow right, focus but not select tab', async () => {
    await selectManual('manual')

    await testHook.clickTrigger('nils')
    await testHook.pressKey('ArrowRight')

    await seeTabIsFocused('agnes')
    await dontSeeTabContent('agnes')
  })

  it('manual: on home key, focus but not select tab', async () => {
    await selectManual('manual')

    await testHook.clickTrigger('agnes')
    await testHook.pressKey('Home')

    await seeTabIsFocused('nils')
    await dontSeeTabContent('nils')
  })

  it('manual: on navigate, select on enter', async () => {
    await selectManual('manual')

    await testHook.clickTrigger('nils')
    await testHook.pressKey('ArrowRight')
    await testHook.pressKey('Enter')

    await seeTabIsFocused('agnes')
    await seeTabContent('agnes')
  })

  it('loopFocus=false', async () => {
    await clickLoopFocus()

    await testHook.clickTrigger('joke')
    await testHook.pressKey('ArrowRight')

    await seeTabIsFocused('joke')
    await seeTabContent('joke')
  })
})
