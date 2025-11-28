import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Radio'

let mount: HTMLElement | null = null

async function expectToBeChecked(id: string) {
  await expect.element(page.getByTestId(`radio-${id}`)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByTestId(`control-${id}`)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByTestId(`label-${id}`)).toHaveAttribute('data-state', 'checked')
}

async function toggleDisabled() {
  await userEvent.click(page.getByTestId('disabled'))
}

async function toggleReadonly() {
  await userEvent.click(page.getByTestId('readOnly'))
}

describe('radio browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('should have aria-labelledby on root', async () => {
    await expect.element(testHook.getRootEl()).toHaveAttribute('id')
    await expect.element(testHook.getRootEl()).toHaveAttribute('aria-labelledby')
  })

  it('should be checked when clicked', async () => {
    await userEvent.click(page.getByTestId('radio-apple'))
    await expectToBeChecked('apple')

    await userEvent.click(page.getByTestId('radio-grape'))
    await expectToBeChecked('grape')
  })

  it('should be focused when page is tabbed', async () => {
    await testHook.clickOutside()
    await userEvent.tab()

    await expect.element(page.getByTestId('input-apple')).toHaveFocus()
    await expect.element(page.getByTestId('control-apple')).toHaveAttribute('data-focus', '')
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await testHook.clickOutside()
    await userEvent.tab()
    await testHook.pressKey('Space')

    await expectToBeChecked('apple')
  })

  it('should have disabled attributes when disabled', async () => {
    await toggleDisabled()

    await expect.element(page.getByTestId('control-apple')).toHaveAttribute('data-disabled', '')
    await expect.element(page.getByTestId('input-apple')).toBeDisabled()
  })

  it('should not be focusable when disabled', async () => {
    await toggleDisabled()

    await testHook.clickOutside()
    await userEvent.tab()

    await expect.element(page.getByTestId('input-apple')).not.toHaveFocus()
  })

  it('should be focusable when readonly', async () => {
    await toggleReadonly()

    await testHook.clickOutside()
    await userEvent.tab()

    await expect.element(page.getByTestId('input-apple')).toHaveFocus()
  })

  it('should be focused on active radio item when page is tabbed', async () => {
    await userEvent.click(page.getByTestId('radio-grape'))
    await expectToBeChecked('grape')

    await testHook.clickOutside()
    await userEvent.tab()
    await expect.element(page.getByTestId('input-grape')).toHaveFocus()
    await expect.element(page.getByTestId('control-grape')).toHaveAttribute('data-focus', '')
  })

  it('should check items when navigating by arrows', async () => {
    await userEvent.click(page.getByTestId('radio-apple'))
    await expectToBeChecked('apple')

    await testHook.pressKey('ArrowDown', 3)

    await expectToBeChecked('grape')
  })
})
