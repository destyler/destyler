import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { setupRangeAnchor } from './tree-stage2-range-anchor.cases'

describe.each(['first', 'branch'] as const)('native shift click on %s anchor', (anchor) => {
  it('contracts selection without selecting later nodes or expanding branches', async () => {
    const fixture = setupRangeAnchor({ defaultSelectedValue: [anchor, 'last'] })
    const events: { trusted: boolean, shift: boolean }[] = []
    fixture.elements.get(anchor)!.addEventListener('click', event => events.push({ trusted: event.isTrusted, shift: event.shiftKey }))
    await userEvent.keyboard('{Shift>}')
    try {
      await userEvent.click(fixture.elements.get(anchor)!)
    }
    finally {
      await userEvent.keyboard('{/Shift}')
    }
    expect(events).toEqual([{ trusted: true, shift: true }])
    expect(fixture.service.state.context.selectedValue).toEqual([anchor])
    expect(fixture.service.state.context.expandedValue).toEqual([])
    expect(fixture.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [anchor], focusedValue: null })
    expect(fixture.onExpandedChange).not.toHaveBeenCalled()
  })
})
