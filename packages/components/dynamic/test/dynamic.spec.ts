import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Dynamic'

let el: HTMLElement

async function paste(value: string) {
  const copyTextEl = page.getByTestId('copy-text')
  await userEvent.fill(copyTextEl, value)
  await userEvent.tripleClick(copyTextEl)
  await userEvent.copy()
  const inputEl = testHook.getInputEl('dynamic')
  await inputEl.click()
  await userEvent.paste()
}

async function addTag(value: string) {
  const inputEl = testHook.getInputEl('dynamic')
  await inputEl.fill(value)
  await testHook.pressKey('Enter')
}

function getTag(value: string) {
  return page.getByTestId(`${value.toLowerCase()}-input`)
}

function getTagClose(value: string) {
  return page.getByTestId(`${value.toLowerCase()}-delete-trigger`)
}

function getTagInput(value: string) {
  return page.getByTestId(`${value.toLowerCase()}-item-input`)
}

async function seeTag(value: string) {
  const tag = getTag(value)
  await expect.element(tag).toBeVisible()
}

async function dontSeeTag(value: string) {
  const tag = getTag(value)
  await expect.element(tag).not.toBeInTheDocument()
}

async function seeInputHasValue(value: string) {
  const inputEl = testHook.getInputEl('dynamic')
  await expect.element(inputEl).toHaveValue(value)
}

async function seeInputIsFocused() {
  const inputEl = testHook.getInputEl('dynamic')
  await expect.element(inputEl).toHaveFocus()
}

async function focusInput() {
  const inputEl = testHook.getInputEl('dynamic')
  await userEvent.click(inputEl)
}

async function seeTagIsHighlighted(value: string) {
  const tag = getTag(value)
  await expect.element(tag).toHaveAttribute('data-highlighted', '')
}

async function clickTagClose(value: string) {
  const tagClose = await getTagClose(value)
  await userEvent.click(tagClose, {
    force: true,
  })
}

async function deleteLastTag() {
  for (let i = 0; i < 2; i++) {
    await userEvent.keyboard('{Backspace}')
    await userEvent.keyboard('{/Backspace}')
  }
}

async function expectNoTagToBeHighlighted() {
  const el = page.locatoring('[data-part=item][data-selected]')
  expect(el.all().length).toBe(0)
}

async function seeTagInputIsFocused(value: string) {
  const tagInputEl = getTagInput(value)
  await expect.element(tagInputEl).toHaveFocus()
}

async function editTag(tag: string, value: string) {
  const tagInputEl = getTagInput(tag)
  await userEvent.fill(tagInputEl, value)
  await testHook.pressKey('Enter')
}

async function dontSeeTagInput(value: string) {
  const tagInput = getTagInput(value)
  await expect.element(tagInput).not.toBeVisible()
}

describe('dynamic browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('should add new tag value', async () => {
    await addTag('Svelte')
    await seeTag('Svelte')

    await seeInputHasValue('')
    await seeInputIsFocused()
  })

  it('when input is empty backspace highlights the last tag', async () => {
    await focusInput()
    await userEvent.keyboard('{Backspace}')

    await seeTagIsHighlighted('Vue')
  })

  it('deletes tag with backspace when input value is empty', async () => {
    await addTag('Svelte')

    await userEvent.keyboard('{Backspace}')
    await seeTagIsHighlighted('Svelte')

    await testHook.pressKey('Backspace')
    await dontSeeTag('Svelte')

    await seeInputIsFocused()
  })

  it('delete tag by clearing its content and hit enter', async () => {
    await focusInput()

    await testHook.pressKey('ArrowLeft')

    await testHook.pressKey('Enter')

    await testHook.pressKey('Backspace')

    await testHook.pressKey('Enter')

    await seeInputIsFocused()
    await dontSeeTag('Vue')
  })

  it('delete tag with delete key, show allow keyboard navigation', async () => {
    await focusInput()

    await testHook.pressKey('ArrowLeft')

    await testHook.pressKey('Delete')

    await seeInputIsFocused()
    await dontSeeTag('Vue')

    await testHook.pressKey('ArrowLeft')

    await seeTagIsHighlighted('React')
  })

  it('delete tag with pointer, show allow keyboard navigation', async () => {
    await clickTagClose('Vue')

    await seeInputIsFocused()

    await dontSeeTag('Vue')

    await testHook.pressKey('ArrowLeft')

    await seeTagIsHighlighted('React')
  })

  it('when tag is empty + no visible tags + enter pressed, should not enter editing state', async () => {
    await focusInput()

    await deleteLastTag()
    await deleteLastTag()

    await testHook.pressKey('Enter')

    await addTag('Svelte')
    await seeTag('Svelte')

    await seeInputHasValue('')
    await seeInputIsFocused()
  })

  it('should navigate tags with arrow keys', async () => {
    await addTag('Svelte')
    await addTag('Solid')

    await testHook.pressKey('ArrowLeft')

    await seeTagIsHighlighted('Solid')

    await testHook.pressKey('ArrowLeft', 2)

    await seeTagIsHighlighted('Vue')

    await testHook.pressKey('ArrowRight')

    await seeTagIsHighlighted('Svelte')
  })

  it('should clear focused tag on blur', async () => {
    await addTag('Svelte')
    await addTag('Solid')

    await testHook.pressKey('ArrowLeft')

    await userEvent.click(document.body, {
      force: true,
    })

    await expectNoTagToBeHighlighted()
  })

  it('removes tag on close button click', async () => {
    await clickTagClose('Vue')
    await dontSeeTag('Vue')
    await seeInputIsFocused()
  })

  it('edit tag with enter key', async () => {
    await addTag('Svelte')
    await addTag('Solid')

    await testHook.pressKey('ArrowLeft', 2)

    await testHook.pressKey('Enter')

    await seeTagInputIsFocused('Svelte')

    await editTag('Svelte', 'PReact')

    await seeTag('PReact')

    await seeInputIsFocused()
  })

  it('edit with double click', async () => {
    await addTag('Svelte')

    const tagEl = getTag('Svelte')
    await userEvent.dblClick(tagEl)

    await seeTagInputIsFocused('Svelte')

    await editTag('Svelte', 'PReact')

    await seeTag('PReact')
    await dontSeeTagInput('PReact')
  })

  it('clears highlighted tag on escape press', async () => {
    await addTag('Svelte')

    await testHook.pressKey('ArrowLeft')

    await testHook.pressKey('Escape')

    await expectNoTagToBeHighlighted()
  })

  it('delete + backspace interaction', async () => {
    await addTag('Svelte')
    await addTag('Solid')

    const VueTagEl = getTag('Vue')
    await userEvent.click(VueTagEl)

    await testHook.pressKey('Delete')

    await seeTagIsHighlighted('Svelte')
    await dontSeeTag('Vue')

    await testHook.pressKey('Delete')

    await seeTagIsHighlighted('Solid')
    await dontSeeTag('Svelte')

    await testHook.pressKey('Delete')
    await dontSeeTag('Solid')

    await expectNoTagToBeHighlighted()

    await testHook.pressKey('Backspace')
    await seeTagIsHighlighted('React')

    await testHook.pressKey('Backspace')
    await dontSeeTag('React')

    await expectNoTagToBeHighlighted()
  })

  it('[addOnPaste: false] pasting should work every time', async () => {
    await paste('Svelte')
    await seeInputHasValue('Svelte')

    await testHook.pressKey('Enter')

    await seeTag('Svelte')

    await testHook.pressKey('Backspace', 2)

    await paste('Svelte')
    await seeInputHasValue('Svelte')

    await testHook.pressKey('Enter')
    await seeTag('Svelte')
  })

  it('[addOnPaste: false] pasting + enter should work', async () => {
    await paste('Svelte')

    await testHook.pressKey('Enter')

    await seeTag('Svelte')
  })

  it('[addOnPaste: true] pasting should add tags', async () => {
    const addOnPasteEl = page.getByTestId('addOnPaste')
    await userEvent.click(addOnPasteEl)

    await paste('Svelte, Solid')

    await seeTag('Svelte')
    await seeTag('Solid')
  })

  it('[addOnPaste: true] when input is empty, should work', async () => {
    const addOnPasteEl = page.getByTestId('addOnPaste')
    await userEvent.click(addOnPasteEl)

    await deleteLastTag()
    await deleteLastTag()

    await paste('Svelte, Solid')
    await seeTag('Svelte')
  })
})
