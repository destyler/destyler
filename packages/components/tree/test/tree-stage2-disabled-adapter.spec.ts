import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { setupDisabledAdapter } from './tree-stage2-disabled-adapter.cases'

describe.each(['item', 'branch'] as const)('native collection-disabled %s', (part) => {
  it.each([false, true])('honors adapter disabled=%s over the opposite raw field', async (disabled) => {
    const { target, service, onSelectionChange, onExpandedChange } = setupDisabledAdapter(part, disabled, 'override')
    const clicks: boolean[] = []
    const keydowns: boolean[] = []
    target.addEventListener('click', event => clicks.push(event.isTrusted))
    target.addEventListener('keydown', event => keydowns.push(event.isTrusted))
    // ARIA-disabled is application-managed; force a real pointer event to test its guard.
    await userEvent.click(target, { force: true })
    expect(clicks).toEqual([true])
    expect(service.state.context.selectedValue).toEqual(disabled ? [] : ['target'])
    expect(service.state.context.expandedValue).toEqual(!disabled && part === 'branch' ? ['target'] : [])
    target.focus()
    await userEvent.keyboard('{Enter} *{ArrowRight}')
    expect(keydowns.length).toBeGreaterThanOrEqual(4)
    expect(keydowns.every(Boolean)).toBe(true)
    expect(service.state.context.selectedValue).toEqual(disabled ? [] : ['target'])
    expect(service.state.context.expandedValue).toEqual(!disabled && part === 'branch' ? ['target'] : [])
    expect(onSelectionChange).toHaveBeenCalledTimes(disabled ? 0 : 1)
    expect(onExpandedChange).toHaveBeenCalledTimes(!disabled && part === 'branch' ? 3 : 0)
  })
})
