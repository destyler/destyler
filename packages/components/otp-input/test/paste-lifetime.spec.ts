import type { PasteFixture } from './paste.fixture'

import { afterEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createPasteFixture } from './paste.fixture'
import './paste-lifetime.cases'

const nativeViews: PasteFixture[] = []
afterEach(() => {
  nativeViews.splice(0).reverse().forEach(view => view.cleanup())
  vi.restoreAllMocks()
})
async function nativeSettle() {
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}
async function copy(view: PasteFixture, value: string) {
  const source = document.createElement('textarea')
  source.dataset.testid = `${view.root.id}-copy`
  view.root.append(source)
  const target = page.getByTestId(source.dataset.testid)
  await userEvent.fill(target, value)
  await userEvent.tripleClick(target)
  await userEvent.copy()
}
for (const ownership of ['uncontrolled', 'accept'] as const) {
  it(`trusted live ${ownership} paste preserves the current request and caret timing`, async () => {
    const view = createPasteFixture(ownership)
    nativeViews.push(view)
    await copy(view, '987')
    view.focus(0)
    await userEvent.paste()
    await nativeSettle()
    expect(view.inputEvents[0].isTrusted).toBe(true)
    expect(view.timeline.map(row => row.phase)).toEqual(['input-before', 'input-after', 'request'])
    expect(view.timeline[1].values).toEqual(['9', '2', '3'])
    expect(view.timeline[1].caret).toBe(1)
    expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
    expect(view.api().value).toEqual(['9', '8', '7'])
  })
}
it('trusted paste stopped before the frame cannot change accepted values', async () => {
  const view = createPasteFixture()
  nativeViews.push(view)
  await copy(view, '987')
  view.afterInput(() => view.service.stop())
  view.focus(0)
  await userEvent.paste()
  await nativeSettle()
  expect(view.inputEvents[0].isTrusted).toBe(true)
  expect(view.changes).toEqual([])
  expect(view.api().value).toEqual(['1', '2', '3'])
})
it('trusted stop/restart preserves only a newly queued paste', async () => {
  const view = createPasteFixture()
  nativeViews.push(view)
  await copy(view, '987')
  let restarted = false
  view.afterInput(() => {
    if (restarted)
      return
    restarted = true
    view.service.stop()
    view.service.start()
    view.paste(1, '56')
  })
  view.focus(0)
  await userEvent.paste()
  await nativeSettle()
  expect(view.inputEvents[0].isTrusted).toBe(true)
  expect(view.changes).toEqual([{ value: ['1', '5', '6'], valueAsString: '156' }])
})
it('real queued selection and complete blur remain owned by their live run', async () => {
  const view = createPasteFixture('uncontrolled', { selectOnFocus: true, blurOnComplete: true, defaultValue: ['', '', ''] })
  nativeViews.push(view)
  view.focus(0)
  await nativeSettle()
  view.inputs[0].value = '1'
  view.focus(1)
  await Promise.resolve()
  const select = vi.spyOn(view.inputs[1], 'select')
  const blur = vi.spyOn(view.inputs[1], 'blur')
  view.api().setValue(['1', '2', '3'])
  await Promise.resolve()
  view.service.stop()
  await nativeSettle()
  expect(select).not.toHaveBeenCalled()
  expect(blur).not.toHaveBeenCalled()
})
