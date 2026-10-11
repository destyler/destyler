import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { setupEmptyAnchor } from './tree-stage2-empty-anchor.cases'

describe('native Shift-click on an empty-string leaf anchor', () => {
  it.each([false, true])('contracts the exact selection with controlled=%s', async (controlled) => {
    const f = setupEmptyAnchor(controlled ? { selectedValue: ['', 'last'] } : { defaultSelectedValue: ['', 'last'] })
    const target = f.elements.get('')!
    target.focus()
    expect(document.activeElement).toBe(target)
    const clicks: { trusted: boolean, shift: boolean }[] = []
    target.addEventListener('click', event => clicks.push({ trusted: event.isTrusted, shift: event.shiftKey }))
    await userEvent.keyboard('{Shift>}')
    try {
      await userEvent.click(target)
    }
    finally {
      await userEvent.keyboard('{/Shift}')
    }
    expect(clicks).toEqual([{ trusted: true, shift: true }])
    expect(f.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [''], focusedValue: '' })
    expect(f.api().selectedValue).toEqual(controlled ? ['', 'last'] : [''])
    expect(f.api().expandedValue).toEqual([])
  })
})
