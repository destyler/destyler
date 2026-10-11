import type { ReadonlyFixture } from './readonly-keyboard.fixture'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createReadonlyFixture } from './readonly-keyboard.fixture'
import './readonly-keyboard.cases'

const fixtures: ReadonlyFixture[] = []
function setup(...args: Parameters<typeof createReadonlyFixture>) {
  const fixture = createReadonlyFixture(...args)
  fixtures.push(fixture)
  return fixture
}
afterEach(() => fixtures.splice(0).reverse().forEach(fixture => fixture.cleanup()))

describe('oTP trusted native keyboard defaults', () => {
  for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
    for (const key of ['Backspace', 'Delete']) {
      it(`${ownership}: native ${key} cannot edit readonly values`, async () => {
        const view = setup(ownership)
        view.focus()
        await userEvent.keyboard(`{${key}}`)
        const event = view.keyboardEvents.at(-1)!
        expect(event.isTrusted).toBe(true)
        expect(event.defaultPrevented).toBe(false)
        expect(view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
        expect(view.api().value).toEqual(['1', '2', '3'])
        expect(view.changes).toEqual([])
        expect(view.hidden.value).toBe('123')
      })
    }
  }
  it('native editable deletion and readonly arrows/Enter remain functional', async () => {
    const view = setup('uncontrolled', { readOnly: false })
    view.focus()
    await userEvent.keyboard('{Backspace}')
    await expect.poll(() => view.inputs[1].value).toBe('')
    expect(view.keyboardEvents.at(-1)?.isTrusted).toBe(true)
    expect(view.changes).toHaveLength(1)
    view.api().setValue(['1', '2', '3'])
    view.service.setContext({ readOnly: true })
    await expect.poll(() => view.inputs[1].readOnly).toBe(true)
    await userEvent.keyboard('{ArrowRight}')
    await expect.poll(() => document.activeElement).toBe(view.inputs[2])
    await userEvent.keyboard('{Enter}')
    expect(view.submissions()).toBe(1)
    expect(view.keyboardEvents.at(-1)?.isTrusted).toBe(true)
    expect(view.changes).toHaveLength(2)
  })
  it('disabled inputs remain unfocusable and receive no native editing keys', async () => {
    const view = setup('uncontrolled', { disabled: true, readOnly: false })
    const outside = document.createElement('button')
    view.form.append(outside)
    outside.focus()
    view.focus()
    expect(document.activeElement).toBe(outside)
    await userEvent.keyboard('{Backspace}{Delete}')
    expect(view.keyboardEvents).toEqual([])
    expect(view.inputs.every(input => input.disabled)).toBe(true)
    expect(view.api().value).toEqual(['1', '2', '3'])
    expect(view.changes).toEqual([])
  })
})
