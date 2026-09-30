import { afterEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { renderGroupedCombobox } from './grouped'

let cleanup: VoidFunction | undefined
afterEach(() => {
  cleanup?.()
  cleanup = undefined
})

describe.each([true, false])('grouped combobox accessibility (composite=%s)', (composite) => {
  it('exposes named groups with their options through repeated open/close', async () => {
    const fixture = renderGroupedCombobox(composite)
    cleanup = fixture.cleanup

    for (let cycle = 0; cycle < 2; cycle++) {
      fixture.api().setOpen(true)
      const listbox = page.getByRole('listbox', { name: 'Animal' })
      await expect.element(listbox).toBeVisible()
      const land = listbox.getByRole('group', { name: 'Land' })
      const water = listbox.getByRole('group', { name: 'Water' })
      await expect.element(land.getByRole('option', { name: 'Cat' })).toBeVisible()
      await expect.element(land.getByRole('option', { name: 'Dog' })).toBeVisible()
      await expect.element(water.getByRole('option', { name: 'Dolphin' })).toBeVisible()
      await expect.element(water.getByRole('option', { name: 'Eel' })).toBeVisible()
      fixture.api().setOpen(false)
      await expect.poll(() => fixture.content.hidden).toBe(true)
    }
  })

  it('keeps keyboard highlight and selection working across group boundaries', async () => {
    const fixture = renderGroupedCombobox(composite)
    cleanup = fixture.cleanup
    fixture.api().setOpen(true)
    await expect.element(page.getByRole('listbox')).toBeVisible()
    fixture.input.focus()

    await userEvent.keyboard('{Home}')
    await expect.element(page.getByRole('option', { name: 'Cat' })).toHaveAttribute('data-highlighted', '')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(page.getByRole('option', { name: 'Dog' })).toHaveAttribute('data-highlighted', '')
    await userEvent.keyboard('{ArrowDown}')
    const dolphin = page.getByRole('option', { name: 'Dolphin' })
    await expect.element(dolphin).toHaveAttribute('data-highlighted', '')
    expect(fixture.input.getAttribute('aria-activedescendant')).toBe(dolphin.element().id)
    await expect.element(page.getByRole('combobox')).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect.poll(() => fixture.api().value).toEqual(['Dolphin'])
    await expect.poll(() => fixture.content.hidden).toBe(true)
    fixture.api().setOpen(true)
    await expect.element(page.getByRole('option', { name: 'Dolphin' })).toHaveAttribute('data-state', 'checked')
  })
})
