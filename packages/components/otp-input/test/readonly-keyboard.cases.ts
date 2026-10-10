import type { Ownership, ReadonlyFixture } from './readonly-keyboard.fixture'
import { afterEach, describe, expect, it } from 'vitest'
import { createReadonlyFixture } from './readonly-keyboard.fixture'

const fixtures: ReadonlyFixture[] = []
function setup(ownership?: Ownership, context?: Parameters<typeof createReadonlyFixture>[1]) {
  const fixture = createReadonlyFixture(ownership, context)
  fixtures.push(fixture)
  fixture.focus()
  return fixture
}
afterEach(() => fixtures.splice(0).reverse().forEach(fixture => fixture.cleanup()))

describe('OTP readonly keyboard editing', () => {
  for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
    for (const key of ['Backspace', 'Delete']) {
      it(`${ownership}: ${key} leaves readonly values, requests and native defaults alone`, async () => {
        const view = setup(ownership)
        expect(view.inputs[1].readOnly).toBe(true)
        const event = view.key(key)
        expect(event.defaultPrevented).toBe(false)
        expect(view.api().value).toEqual(['1', '2', '3'])
        expect(view.changes).toEqual([])
        await expect.poll(() => view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
        expect(view.hidden.value).toBe('123')
      })
    }
    it(`${ownership}: programmatic setters still work when readonly`, () => {
      const view = setup(ownership)
      view.api().setValue(['4', '5', '6'])
      expect(view.changes).toEqual([{ value: ['4', '5', '6'], valueAsString: '456' }])
      expect(view.api().value).toEqual(ownership === 'veto' ? ['1', '2', '3'] : ['4', '5', '6'])
    })
  }
  for (const key of ['Backspace', 'Delete']) {
    it(`${key} retains editable deletion`, async () => {
      const view = setup('uncontrolled', { readOnly: false })
      expect(view.key(key).defaultPrevented).toBe(true)
      expect(view.api().value).toEqual(['1', '', '3'])
      expect(view.changes).toEqual([{ value: ['1', '', '3'], valueAsString: '13' }])
      await expect.poll(() => view.inputs[1].value).toBe('')
    })
  }
  it('readonly navigation still moves focus without changing values', async () => {
    const view = setup()
    expect(view.key('ArrowRight').defaultPrevented).toBe(true)
    await expect.poll(() => document.activeElement).toBe(view.inputs[2])
    expect(view.key('ArrowLeft').defaultPrevented).toBe(true)
    await expect.poll(() => document.activeElement).toBe(view.inputs[1])
    expect(view.changes).toEqual([])
  })
  it('readonly Enter still requests submission for a complete named value', () => {
    const view = setup()
    expect(view.key('Enter').defaultPrevented).toBe(true)
    expect(view.submissions()).toBe(1)
    expect(view.changes).toEqual([])
  })
  for (const init of [{ isComposing: true }, { ctrlKey: true }, { metaKey: true }, { altKey: true }]) {
    it(`preserves composing/modifier guards ${JSON.stringify(init)}`, () => {
      const view = setup('uncontrolled', { readOnly: false })
      expect(view.key('Backspace', init).defaultPrevented).toBe(false)
      expect(view.api().value).toEqual(['1', '2', '3'])
      expect(view.changes).toEqual([])
    })
  }
  it('respects consumer cancellation on an editable input', () => {
    const view = setup('uncontrolled', { readOnly: false })
    expect(view.key('Delete', {}, true).defaultPrevented).toBe(true)
    expect(view.changes).toEqual([])
    expect(view.api().value).toEqual(['1', '2', '3'])
  })
  it('responds to readonly context changes without remounting', async () => {
    const view = setup()
    view.service.setContext({ readOnly: false })
    await expect.poll(() => view.inputs[1].readOnly).toBe(false)
    view.key('Delete')
    expect(view.api().value).toEqual(['1', '', '3'])
    view.service.setContext({ readOnly: true })
    await expect.poll(() => view.inputs[1].readOnly).toBe(true)
    expect(view.key('Backspace').defaultPrevented).toBe(false)
    expect(view.api().value).toEqual(['1', '', '3'])
    expect(view.changes).toHaveLength(1)
  })
})
