import type { UserDefinedContext } from '../src/types'
import type { KeyboardFixture } from './keyboard.fixture'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createKeyboardFixture, settleKeyboard } from './keyboard.fixture'

const fixtures: KeyboardFixture[] = []
const axes = [
  { orientation: 'horizontal', dir: 'ltr', next: 'ArrowRight', prev: 'ArrowLeft', cross: ['ArrowUp', 'ArrowDown'] },
  { orientation: 'horizontal', dir: 'rtl', next: 'ArrowLeft', prev: 'ArrowRight', cross: ['ArrowUp', 'ArrowDown'] },
  { orientation: 'vertical', dir: 'ltr', next: 'ArrowDown', prev: 'ArrowUp', cross: ['ArrowLeft', 'ArrowRight'] },
  { orientation: 'vertical', dir: 'rtl', next: 'ArrowDown', prev: 'ArrowUp', cross: ['ArrowLeft', 'ArrowRight'] },
] as const

function setup(context: Partial<UserDefinedContext> = {}, items?: Parameters<typeof createKeyboardFixture>[1]) {
  const fixture = createKeyboardFixture(context, items)
  fixtures.push(fixture)
  return fixture
}

async function expectTab(fixture: KeyboardFixture, focused: string, selected: string) {
  await settleKeyboard()
  expect(document.activeElement).toBe(fixture.triggers.get(focused))
  expect(fixture.api().focusedValue).toBe(focused)
  expect(fixture.api().value).toBe(selected)
  expect(fixture.triggers.get(selected)?.getAttribute('aria-selected')).toBe('true')
  expect(fixture.triggers.get(selected)?.tabIndex).toBe(0)
  expect(fixture.panels.get(selected)?.hidden).toBe(false)
}

afterEach(async () => {
  for (const fixture of fixtures.splice(0).reverse())
    await fixture.cleanup()
})

describe.each(axes)('tabs keyboard $orientation $dir', (axis) => {
  it.each(axis.cross)('leaves %s uncanceled without focus, selection, or callback changes', async (key) => {
    const onValueChange = vi.fn()
    const onFocusChange = vi.fn()
    const fixture = setup({ ...axis, onValueChange, onFocusChange })
    fixture.focus('a')
    await settleKeyboard()
    onFocusChange.mockClear()
    fixture.sent.length = 0
    const event = fixture.key(key)
    await expectTab(fixture, 'a', 'a')
    expect(event.defaultPrevented).toBe(false)
    expect(fixture.sent).toEqual([])
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onFocusChange).not.toHaveBeenCalled()
  })

  it.each(['automatic', 'manual'] as const)('%s navigation skips disabled tabs in both directions', async (activationMode) => {
    const fixture = setup({ ...axis, activationMode })
    fixture.focus('a')
    expect(fixture.key(axis.next).defaultPrevented).toBe(true)
    await expectTab(fixture, 'b', activationMode === 'automatic' ? 'b' : 'a')
    expect(fixture.key(axis.prev).defaultPrevented).toBe(true)
    await expectTab(fixture, 'a', 'a')
    expect(fixture.triggers.get('disabled')?.disabled).toBe(true)
    expect(fixture.triggers.get('disabled')?.getAttribute('aria-disabled')).toBe('true')
    expect(fixture.triggers.get('disabled')?.tabIndex).toBe(-1)
  })

  it.each([true, false])('honors loopFocus=%s at the enabled endpoints', async (loopFocus) => {
    const fixture = setup({ ...axis, loopFocus })
    fixture.focus('a')
    fixture.key(axis.prev)
    await expectTab(fixture, loopFocus ? 'c' : 'a', loopFocus ? 'c' : 'a')
    fixture.focus('c')
    fixture.key(axis.next)
    await expectTab(fixture, loopFocus ? 'a' : 'c', loopFocus ? 'a' : 'c')
  })

  it.each(['automatic', 'manual'] as const)('%s Home/End use enabled endpoints', async (activationMode) => {
    const fixture = setup({ ...axis, activationMode, defaultValue: 'b' }, [
      { value: 'disabled-first', disabled: true },
      { value: 'a' },
      { value: 'b' },
      { value: 'c' },
      { value: 'disabled-last', disabled: true },
    ])
    fixture.focus('b')
    expect(fixture.key('Home').defaultPrevented).toBe(true)
    await expectTab(fixture, 'a', activationMode === 'automatic' ? 'a' : 'b')
    expect(fixture.key('End').defaultPrevented).toBe(true)
    await expectTab(fixture, 'c', activationMode === 'automatic' ? 'c' : 'b')
  })
})

describe('tabs keyboard event and context controls', () => {
  it.each(['ArrowRight', 'Home', 'End', 'Enter'])('respects consumer cancellation of %s before the list handler', async (key) => {
    const fixture = setup({ activationMode: 'manual' })
    fixture.focus('b')
    fixture.sent.length = 0
    fixture.triggers.get('b')!.addEventListener('keydown', event => event.preventDefault(), { once: true })
    expect(fixture.key(key).defaultPrevented).toBe(true)
    await expectTab(fixture, 'b', 'a')
    expect(fixture.sent).toEqual([])
  })

  it.each(['ArrowRight', 'Home', 'End', 'Enter'])('ignores a composing %s event without canceling it', async (key) => {
    const fixture = setup({ activationMode: 'manual' })
    fixture.focus('b')
    fixture.sent.length = 0
    expect(fixture.key(key, { isComposing: true }).defaultPrevented).toBe(false)
    await expectTab(fixture, 'b', 'a')
    expect(fixture.sent).toEqual([])
  })

  it('uses event.key, keeps the original event/current target, and handles a trigger descendant', async () => {
    const fixture = setup()
    fixture.focus('a')
    const child = document.createElement('span')
    fixture.triggers.get('a')!.append(child)
    const event = fixture.key('ArrowRight', { code: 'ArrowUp' }, child)
    await expectTab(fixture, 'b', 'b')
    expect(fixture.keyboardEvents[0]).toEqual({ event, target: child, currentTarget: fixture.list, defaultPrevented: true })
    expect(fixture.sent).toContainEqual({ type: 'ARROW_NEXT', key: 'ArrowRight' })
  })

  it.each([
    { orientation: 'horizontal', dir: 'ltr', key: 'Right', expected: 'b' },
    { orientation: 'horizontal', dir: 'rtl', key: 'Left', expected: 'b' },
    { orientation: 'vertical', dir: 'rtl', key: 'Down', expected: 'b' },
  ] as const)('normalizes legacy $key in $orientation $dir', async ({ orientation, dir, key, expected }) => {
    const fixture = setup({ orientation, dir })
    fixture.focus('a')
    expect(fixture.key(key).defaultPrevented).toBe(true)
    await expectTab(fixture, expected, expected)
  })

  it.each([
    { orientation: 'horizontal', key: 'Up' },
    { orientation: 'horizontal', key: 'Down' },
    { orientation: 'vertical', key: 'Left' },
    { orientation: 'vertical', key: 'Right' },
  ] as const)('preserves the native default of cross-axis legacy $key', async ({ orientation, key }) => {
    const fixture = setup({ orientation })
    fixture.focus('a')
    expect(fixture.key(key).defaultPrevented).toBe(false)
    await expectTab(fixture, 'a', 'a')
  })

  it('reconnects orientation, direction, activation mode, and loopFocus changes', async () => {
    const fixture = setup()
    fixture.focus('a')
    fixture.key('ArrowRight')
    await expectTab(fixture, 'b', 'b')
    fixture.service.setContext({ orientation: 'vertical', dir: 'rtl', activationMode: 'manual', loopFocus: false })
    await settleKeyboard()
    expect(fixture.list.getAttribute('aria-orientation')).toBe('vertical')
    expect(fixture.key('ArrowRight').defaultPrevented).toBe(false)
    fixture.key('ArrowDown')
    await expectTab(fixture, 'c', 'b')
    fixture.key('ArrowDown')
    await expectTab(fixture, 'c', 'b')
    expect(fixture.key('Enter').defaultPrevented).toBe(true)
    await expectTab(fixture, 'c', 'c')
    fixture.service.setContext({ orientation: 'horizontal', activationMode: 'automatic', loopFocus: true })
    await settleKeyboard()
    expect(fixture.key('ArrowDown').defaultPrevented).toBe(false)
    fixture.key('ArrowLeft')
    await expectTab(fixture, 'a', 'a')
  })

  it('uses the current disabled DOM state when the next tab changes', async () => {
    const items = [{ value: 'a' }, { value: 'b', disabled: false }, { value: 'c' }]
    const fixture = setup({}, items)
    fixture.focus('a')
    items[1].disabled = true
    fixture.render()
    fixture.key('ArrowRight')
    await expectTab(fixture, 'c', 'c')
    items[1].disabled = false
    fixture.render()
    fixture.key('ArrowLeft')
    await expectTab(fixture, 'b', 'b')
  })

  it('keeps focus on the only enabled tab for arrows and endpoints', async () => {
    const fixture = setup({}, [{ value: 'disabled', disabled: true }, { value: 'a' }])
    fixture.focus('a')
    for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End']) {
      expect(fixture.key(key).defaultPrevented).toBe(true)
      await expectTab(fixture, 'a', 'a')
    }
  })

  it('detaches fixture event listeners before actor stop and repeated disposal', async () => {
    const fixture = setup()
    fixture.focus('a')
    await fixture.cleanup()
    await fixture.cleanup()
    const before = fixture.sent.slice()
    const trigger = fixture.triggers.get('a')!
    trigger.dispatchEvent(new FocusEvent('focus'))
    trigger.click()
    fixture.key('ArrowRight', {}, trigger)
    expect(fixture.sent).toEqual(before)
    expect(fixture.root.isConnected).toBe(false)
  })

  it.each([' ', 'Tab', 'PageDown', 'Escape', 'x'])('leaves the existing unmapped %s behavior unchanged', async (key) => {
    const fixture = setup({ activationMode: 'manual' })
    fixture.focus('b')
    fixture.sent.length = 0
    expect(fixture.key(key).defaultPrevented).toBe(false)
    await expectTab(fixture, 'b', 'a')
    expect(fixture.sent).toEqual([])
  })
})
