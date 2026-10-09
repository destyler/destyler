import type { PasteFixture } from './paste.fixture'
import { afterEach, expect, it, vi } from 'vitest'
import { createPasteFixture } from './paste.fixture'

const views: PasteFixture[] = []
const frames = new Map<number, FrameRequestCallback>()
let handle = 0
function flushFrame() {
  const work = Array.from(frames.values())
  frames.clear()
  work.forEach(callback => callback(0))
}
function fixture(context: Parameters<typeof createPasteFixture>[1] = {}) {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++handle, callback)
    return handle
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  const view = createPasteFixture('uncontrolled', context)
  views.push(view)
  return view
}
afterEach(() => {
  views.splice(0).reverse().forEach(view => view.cleanup())
  frames.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
it('keeps live paste timing, pre-frame text and request intact', () => {
  const view = fixture()
  view.paste(0, '987')
  expect(view.changes).toEqual([])
  expect(view.inputs.map(input => input.value)).toEqual(['9', '2', '3'])
  flushFrame()
  expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
})
it('cancels queued paste when the actor stops', () => {
  const view = fixture()
  view.paste(0, '987')
  view.service.stop()
  flushFrame()
  expect(view.changes).toEqual([])
  expect(view.api().value).toEqual(['1', '2', '3'])
})
it('restarts with a fresh queue and preserves new work only', () => {
  const view = fixture()
  view.paste(0, '987')
  view.service.stop()
  view.service.start()
  view.paste(1, '56')
  flushFrame()
  expect(view.changes).toEqual([{ value: ['1', '5', '6'], valueAsString: '156' }])
})
it('invalidates a dequeued old focus callback when paste restarts the actor', () => {
  const view = fixture()
  view.service.setContext({ onValueChange(details) {
    view.changes.push(details)
    view.service.stop()
    view.service.start()
    view.service.send({ type: 'INPUT.FOCUS', index: 1 })
  } })
  view.paste(0, '987')
  flushFrame()
  expect(view.changes).toHaveLength(1)
  expect(view.service.state.context.focusedIndex).toBe(1)
})
it('keeps a sibling actor queue independent', () => {
  const first = fixture()
  const second = fixture()
  first.paste(0, '987')
  second.paste(0, '456')
  first.service.stop()
  flushFrame()
  expect(first.changes).toEqual([])
  expect(second.changes).toEqual([{ value: ['4', '5', '6'], valueAsString: '456' }])
})
it('preserves live selection and cancels selection after stop', async () => {
  const view = fixture({ selectOnFocus: true })
  const first = vi.spyOn(view.inputs[0], 'select')
  view.focus(0)
  await Promise.resolve()
  flushFrame()
  expect(first).toHaveBeenCalledTimes(1)
  const second = vi.spyOn(view.inputs[1], 'select')
  view.focus(1)
  await Promise.resolve()
  view.service.stop()
  flushFrame()
  expect(second).not.toHaveBeenCalled()
})
it('cancels complete blur after stop', async () => {
  const view = fixture({ defaultValue: ['', '', ''], blurOnComplete: true })
  view.focus(0)
  const blur = vi.spyOn(view.inputs[0], 'blur')
  view.api().setValue(['1', '2', '3'])
  await Promise.resolve()
  view.service.stop()
  flushFrame()
  expect(blur).not.toHaveBeenCalled()
})
it('preserves the existing direct-event focus fallback', () => {
  const view = fixture()
  view.focus(1)
  view.service.send({ type: 'INPUT.PASTE', value: '98' })
  flushFrame()
  expect(view.api().value).toEqual(['1', '9', '8'])
})
