import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Toggle'

let mountEl: HTMLElement

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
  const el = page.getByTestId('multiple')
  await userEvent.click(el)
}

describe('[toggle] browser tests', () => {
  beforeEach(() => {
    if (mountEl) {
      document.body.removeChild(mountEl)
    }
    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
    render(mountEl)
  })

  it('[single] should select on click', async () => {
    await clickItem('bold')
    await seeItemIsSelected(['bold'])

    await clickItem('italic')
    await seeItemIsSelected(['italic'])
    await seeItemIsNotSelected(['bold'])
  })

  it('[single] should select and deselect', async () => {
    await clickItem('bold')
    await seeItemIsSelected(['bold'])

    await clickItem('bold')
    await seeItemIsNotSelected(['bold'])
  })

  it('[multiple] should select multiple', async () => {
    await clickMultiple()
    await clickItem('bold')
    await clickItem('italic')

    await seeItemIsSelected(['bold', 'italic'])
  })
})
