import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Toggle'

let mountEl: HTMLElement | null = null

type Item = 'bold' | 'italic' | 'underline'

function getItem(item: Item) {
  return page.locatoring(testHook.part('item')).nth(['bold', 'italic', 'underline'].indexOf(item))
}

async function clickItem(item: Item) {
  await getItem(item).click()
}

async function seeSelected(item: Item) {
  await expect.element(getItem(item)).toHaveAttribute('data-state', 'on')
}

async function seeNotSelected(item: Item) {
  await expect.element(getItem(item)).toHaveAttribute('data-state', 'off')
}

async function seeItemIsSelected(items: Item[]) {
  await Promise.all(items.map(item => seeSelected(item)))
}

async function seeItemIsNotSelected(items: Item[]) {
  await Promise.all(items.map(item => seeNotSelected(item)))
}

async function clickMultiple() {
  await userEvent.click(page.getByTestId('multiple'))
}

describe('[toggle] browser tests', () => {
  beforeEach(() => {
    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
    render(mountEl)
  })

  afterEach(() => {
    if (mountEl && mountEl.parentElement)
      document.body.removeChild(mountEl)
    mountEl = null
  })

  it('[single] exposes radiogroup semantics', async () => {
    await expect.element(testHook.getRootEl()).toHaveAttribute('role', 'radiogroup')
    await expect.element(getItem('bold')).toHaveAttribute('role', 'radio')
    await expect.element(getItem('bold')).toHaveAttribute('data-state', 'off')
  })

  it('[single] should select on click', async () => {
    await clickItem('bold')
    await seeItemIsSelected(['bold'])
    await expect.element(getItem('bold')).toHaveAttribute('aria-checked', 'true')

    await clickItem('italic')
    await seeItemIsSelected(['italic'])
    await seeItemIsNotSelected(['bold'])
    // false boolean attrs are omitted by spreadProps
    const bold = await getItem('bold').element()
    expect(bold.getAttribute('aria-checked')).not.toBe('true')
    await expect.element(getItem('italic')).toHaveAttribute('aria-checked', 'true')
  })

  it('[single] should select and deselect', async () => {
    await clickItem('bold')
    await seeItemIsSelected(['bold'])

    await clickItem('bold')
    await seeItemIsNotSelected(['bold'])
  })

  it('[single] should toggle with Space when focused', async () => {
    await getItem('bold').click()
    await seeItemIsSelected(['bold'])

    await testHook.pressKey('Space')
    await seeItemIsNotSelected(['bold'])
  })

  it('[multiple] should select multiple with aria-pressed', async () => {
    await clickMultiple()
    await expect.element(testHook.getRootEl()).toHaveAttribute('role', 'group')

    await clickItem('bold')
    await clickItem('italic')

    await seeItemIsSelected(['bold', 'italic'])
    await expect.element(getItem('bold')).toHaveAttribute('aria-pressed', 'true')
    await expect.element(getItem('italic')).toHaveAttribute('aria-pressed', 'true')
    const underline = await getItem('underline').element()
    expect(underline.getAttribute('aria-pressed')).not.toBe('true')
  })

  it('[disabled] marks items disabled', async () => {
    await page.getByTestId('disabled').click()
    await expect.element(testHook.getRootEl()).toHaveAttribute('data-disabled', '')
    await expect.element(getItem('bold')).toBeDisabled()
    await expect.element(getItem('bold')).toHaveAttribute('data-disabled', '')
    await seeItemIsNotSelected(['bold'])
  })

  it('[roving] ArrowRight / Home / End move focus', async () => {
    await getItem('bold').click()
    await expect.element(getItem('bold')).toHaveFocus()

    await testHook.pressKey('ArrowRight')
    await expect.element(getItem('italic')).toHaveFocus()

    await testHook.pressKey('End')
    await expect.element(getItem('underline')).toHaveFocus()

    await testHook.pressKey('Home')
    await expect.element(getItem('bold')).toHaveFocus()
  })

  it('[roving][loopFocus] wraps from last to first', async () => {
    // loopFocus defaults true
    await getItem('underline').click()
    await expect.element(getItem('underline')).toHaveFocus()
    await testHook.pressKey('ArrowRight')
    await expect.element(getItem('bold')).toHaveFocus()
  })

  it('[rovingFocus=false] does not move focus on ArrowRight', async () => {
    await page.getByTestId('rovingFocus').click()
    await getItem('bold').click()
    await expect.element(getItem('bold')).toHaveFocus()
    await testHook.pressKey('ArrowRight')
    await expect.element(getItem('bold')).toHaveFocus()
  })
})
