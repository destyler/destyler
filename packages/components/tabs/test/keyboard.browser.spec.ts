import type { KeyboardFixture } from './keyboard.fixture'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createKeyboardFixture, settleKeyboard } from './keyboard.fixture'

const fixtures: KeyboardFixture[] = []
const wrappers: HTMLElement[] = []

function setup(context: Parameters<typeof createKeyboardFixture>[0] = {}, items?: Parameters<typeof createKeyboardFixture>[1]) {
  const fixture = createKeyboardFixture(context, items)
  fixtures.push(fixture)
  return fixture
}

async function expectTab(fixture: KeyboardFixture, focused: string, selected: string) {
  await expect.poll(() => document.activeElement).toBe(fixture.triggers.get(focused))
  await expect.poll(() => fixture.api().value).toBe(selected)
  expect(fixture.triggers.get(selected)?.getAttribute('aria-selected')).toBe('true')
  expect(fixture.panels.get(selected)?.hidden).toBe(false)
}

afterEach(async () => {
  for (const fixture of fixtures.splice(0).reverse())
    await fixture.cleanup()
  wrappers.splice(0).forEach(wrapper => wrapper.remove())
})

describe('tabs native keyboard defaults', () => {
  it.each([
    { orientation: 'horizontal', key: 'ArrowDown', dimension: 'scrollTop', sign: 1 },
    { orientation: 'horizontal', key: 'ArrowUp', dimension: 'scrollTop', sign: -1 },
    { orientation: 'vertical', key: 'ArrowRight', dimension: 'scrollLeft', sign: 1 },
    { orientation: 'vertical', key: 'ArrowLeft', dimension: 'scrollLeft', sign: -1 },
  ] as const)('$orientation $key keeps focus and lets the browser scroll', async ({ orientation, key, dimension, sign }) => {
    const fixture = setup({ orientation })
    const scroller = document.createElement('div')
    scroller.style.cssText = 'width: 260px; height: 180px; overflow: auto; scroll-behavior: auto; position: relative;'
    fixture.root.style.cssText = 'width: 1800px; height: 1800px;'
    fixture.list.style.cssText = 'position: sticky; left: 0; top: 0; width: 240px;'
    scroller.append(fixture.root)
    document.body.append(scroller)
    wrappers.push(scroller)
    fixture.focus('a')
    scroller.scrollTop = 500
    scroller.scrollLeft = 500
    await settleKeyboard()
    const before = scroller[dimension]
    expect(before).toBe(500)
    await userEvent.keyboard(`{${key}}`)
    await expect.poll(() => sign * (scroller[dimension] - before)).toBeGreaterThan(0)
    await expectTab(fixture, 'a', 'a')
    expect(fixture.keyboardEvents.at(-1)?.defaultPrevented).toBe(false)
    expect(fixture.keyboardEvents.at(-1)?.event.isTrusted).toBe(true)
  })

  it.each([
    { orientation: 'horizontal', dir: 'ltr', next: 'ArrowRight', prev: 'ArrowLeft' },
    { orientation: 'horizontal', dir: 'rtl', next: 'ArrowLeft', prev: 'ArrowRight' },
    { orientation: 'vertical', dir: 'ltr', next: 'ArrowDown', prev: 'ArrowUp' },
    { orientation: 'vertical', dir: 'rtl', next: 'ArrowDown', prev: 'ArrowUp' },
  ] as const)('$orientation $dir native arrows skip disabled tabs and remain canceled', async ({ orientation, dir, next, prev }) => {
    const fixture = setup({ orientation, dir })
    fixture.focus('a')
    await userEvent.keyboard(`{${next}}`)
    await expectTab(fixture, 'b', 'b')
    expect(fixture.keyboardEvents.at(-1)?.defaultPrevented).toBe(true)
    expect(fixture.keyboardEvents.at(-1)?.event.isTrusted).toBe(true)
    await userEvent.keyboard(`{${prev}}`)
    await expectTab(fixture, 'a', 'a')
    expect(fixture.keyboardEvents.at(-1)?.defaultPrevented).toBe(true)
  })

  it('manual native navigation keeps selection until Enter and honors disabled endpoints', async () => {
    const fixture = setup({ activationMode: 'manual', loopFocus: false }, [
      { value: 'disabled-first', disabled: true },
      { value: 'a' },
      { value: 'disabled-middle', disabled: true },
      { value: 'b' },
      { value: 'disabled-last', disabled: true },
    ])
    fixture.focus('a')
    await userEvent.keyboard('{End}')
    await expectTab(fixture, 'b', 'a')
    await userEvent.keyboard('{ArrowRight}')
    await expectTab(fixture, 'b', 'a')
    await userEvent.keyboard('{Enter}')
    await expectTab(fixture, 'b', 'b')
    await userEvent.keyboard('{Home}')
    await expectTab(fixture, 'a', 'b')
    await userEvent.keyboard('{ArrowLeft}')
    await expectTab(fixture, 'a', 'b')
  })

  it('consumer cancellation of a native arrow leaves focus and selection unchanged', async () => {
    const fixture = setup()
    fixture.focus('a')
    fixture.triggers.get('a')!.addEventListener('keydown', event => event.preventDefault(), { once: true })
    await userEvent.keyboard('{ArrowRight}')
    await settleKeyboard()
    await expectTab(fixture, 'a', 'a')
    expect(fixture.keyboardEvents.at(-1)?.defaultPrevented).toBe(true)
    expect(fixture.keyboardEvents.at(-1)?.event.isTrusted).toBe(true)
  })
})
