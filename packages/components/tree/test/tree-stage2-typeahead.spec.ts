import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { expectFocus, setupTypeahead } from './tree-stage2-typeahead.cases'

describe('native Tree typeahead keyboard interactions', () => {
  it('keeps interleaved actors focused on their own custom-label matches', async () => {
    const first = setupTypeahead()
    const second = setupTypeahead()
    first.focus('start')
    await userEvent.keyboard('b')
    second.focus('start')
    await userEvent.keyboard('c')
    first.focus('berry')
    await userEvent.keyboard('l')
    expectFocus(first, 'berry')
    second.focus('cedar')
    await userEvent.keyboard('e')
    expectFocus(second, 'cedar')
    expect(first.keys()).toBe('bl')
    expect(second.keys()).toBe('ce')
    expect(first.api().selectedValue).toEqual([])
    expect(second.api().selectedValue).toEqual([])
  })

  it.each([false, true])('uses Space inside a multiword query, branch=%s', async (branch) => {
    const fixture = setupTypeahead({}, branch)
    const spaces: KeyboardEvent[] = []
    fixture.tree.addEventListener('keydown', (event) => {
      if (event.key === ' ')
        spaces.push(event)
    })
    await userEvent.keyboard('blue s')
    expectFocus(fixture, 'sky')
    expect(spaces).toHaveLength(1)
    expect(spaces[0].isTrusted).toBe(true)
    expect(spaces[0].defaultPrevented).toBe(true)
    expect(fixture.keys()).toBe('blue s')
    expect(fixture.api().selectedValue).toEqual([])
    expect(fixture.api().expandedValue).toEqual([])
    await vi.advanceTimersByTimeAsync(350)
    await userEvent.keyboard(' ')
    expect(fixture.api().selectedValue).toEqual(['sky'])
  })

  it('expires native keyboard queries under real platform timers', async () => {
    vi.useRealTimers()
    const fixture = setupTypeahead()
    await userEvent.keyboard('blue s')
    expectFocus(fixture, 'sky')
    expect(fixture.api().selectedValue).toEqual([])
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(fixture.keys()).toBe('')
    await userEvent.keyboard(' ')
    expect(fixture.api().selectedValue).toEqual(['sky'])
  })

  it('restores native Space selection after typeahead is disabled live', async () => {
    const fixture = setupTypeahead()
    await userEvent.keyboard('b')
    fixture.service.setContext({ typeahead: false })
    await userEvent.keyboard(' ')
    expectFocus(fixture, 'berry')
    expect(fixture.api().selectedValue).toEqual(['berry'])
    expect(fixture.keys()).toBe('b')
  })

  it('leaves a disabled node unchanged on native Space during a query', async () => {
    const fixture = setupTypeahead()
    await userEvent.keyboard('b')
    fixture.focus('disabled')
    await userEvent.keyboard(' ')
    expectFocus(fixture, 'disabled')
    expect(fixture.api().selectedValue).toEqual([])
    expect(fixture.keys()).toBe('b')
  })

  it('keeps native cancelled Space and modified characters out of the query', async () => {
    const fixture = setupTypeahead()
    await userEvent.keyboard('b')
    await userEvent.keyboard('{Control>}c{/Control}')
    fixture.tree.addEventListener('keydown', event => event.preventDefault(), { capture: true })
    await userEvent.keyboard(' ')
    expect(fixture.keys()).toBe('b')
    expectFocus(fixture, 'berry')
    expect(fixture.api().selectedValue).toEqual([])
  })
})
