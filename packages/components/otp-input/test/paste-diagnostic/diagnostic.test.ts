// @vitest-environment happy-dom
import type { PasteFixture } from '../paste.fixture'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPasteFixture } from '../paste.fixture'
import { implementations } from './implementations'

const views: PasteFixture[] = []
const frames = new Map<number, FrameRequestCallback>()
let handle = 0
function flushFrame() {
  const work = Array.from(frames.values())
  frames.clear()
  work.forEach(callback => callback(0))
}
function clock() {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++handle, callback)
    return handle
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
}
afterEach(() => {
  views.splice(0).reverse().forEach(view => view.cleanup())
  frames.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
for (const implementation of implementations) {
  const fixed = implementation.name === 'candidate'
  describe(`diagnostic-only ${implementation.name}`, () => {
    for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
      for (const empty of [false, true]) {
        it(`${ownership}, empty=${empty}: measures accepted DOM and request-frame ordering`, async () => {
          clock()
          const initial = empty ? ['', '', ''] : ['1', '2', '3']
          const view = createPasteFixture(ownership, ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }, implementation)
          views.push(view)
          view.paste(0, '987')
          expect(view.changes).toEqual([])
          expect(view.timeline.map(row => row.phase)).toEqual(['input-before', 'input-after'])
          const firstFrame = fixed ? initial : ['9', ...initial.slice(1)]
          expect(view.inputs.map(input => input.value)).toEqual(firstFrame)
          expect(view.inputs[0].selectionStart).toBe(fixed ? initial[0].length : 1)
          flushFrame()
          expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
          const accepted = ownership === 'veto' ? initial : ['9', '8', '7']
          expect(view.api().value).toEqual(accepted)
          await expect.poll(() => view.inputs.map(input => input.value)).toEqual(ownership === 'veto' ? firstFrame : accepted)
          if (ownership === 'veto') {
            view.service.setContext({ value: ['9', '8', '7'] })
            await expect.poll(() => view.inputs.map(input => input.value)).toEqual(['9', '8', '7'])
            expect(view.changes).toHaveLength(1)
          }
        })
      }
      it(`${ownership}: records the actual nonfocused input event target`, () => {
        clock()
        const view = createPasteFixture(ownership, {}, implementation)
        views.push(view)
        view.focus(2)
        view.paste(0, '987', false)
        flushFrame()
        expect(view.changes[0].value).toEqual(fixed ? ['9', '8', '7'] : ['1', '2', '9'])
      })
      it(`${ownership}: records focus moved between input and its frame`, () => {
        clock()
        const view = createPasteFixture(ownership, {}, implementation)
        views.push(view)
        view.paste(0, '987')
        view.focus(2)
        flushFrame()
        expect(view.changes[0].value).toEqual(fixed ? ['9', '8', '7'] : ['1', '2', '9'])
      })
    }
    it('keeps direct machine callers without index on the focus fallback', () => {
      clock()
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      view.focus(1)
      view.service.send({ type: 'INPUT.PASTE', value: '98' })
      flushFrame()
      expect(view.api().value).toEqual(['1', '9', '8'])
    })
    it('records queued paste ownership after stop', () => {
      clock()
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      view.paste(0, '987')
      view.service.stop()
      flushFrame()
      expect(view.api().value).toEqual(fixed ? ['1', '2', '3'] : ['9', '8', '7'])
      expect(view.changes).toHaveLength(fixed ? 0 : 1)
    })
    it('records old and new generation work after a stop/restart', () => {
      clock()
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      view.paste(0, '987')
      view.service.stop()
      view.service.start()
      view.focus(1)
      view.paste(1, '56')
      flushFrame()
      expect(view.changes).toHaveLength(fixed ? 1 : 2)
      if (fixed)
        expect(view.api().value).toEqual(['1', '5', '6'])
    })
    it('rejects an already-dequeued callback from an earlier reentrant generation', () => {
      clock()
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      view.service.setContext({ onValueChange(details) {
        view.changes.push(details)
        view.service.stop()
        view.service.start()
        view.service.send({ type: 'INPUT.FOCUS', index: 1 })
      } })
      view.paste(0, '987')
      flushFrame()
      expect(view.changes).toHaveLength(1)
      expect(view.api().value).toEqual(['9', '8', '7'])
      expect(view.service.state.context.focusedIndex).toBe(fixed ? 1 : 2)
    })
    it('keeps another live instance scheduled when its sibling stops', () => {
      clock()
      const first = createPasteFixture('uncontrolled', {}, implementation)
      const second = createPasteFixture('uncontrolled', {}, implementation)
      views.push(first, second)
      first.paste(0, '987')
      second.paste(0, '456')
      first.service.stop()
      flushFrame()
      expect(first.changes).toHaveLength(fixed ? 0 : 1)
      expect(second.changes).toEqual([{ value: ['4', '5', '6'], valueAsString: '456' }])
    })
    it('records deferred select ownership while preserving live select', async () => {
      clock()
      const view = createPasteFixture('uncontrolled', { selectOnFocus: true }, implementation)
      views.push(view)
      const select = vi.spyOn(view.inputs[0], 'select')
      view.focus(0)
      await Promise.resolve()
      flushFrame()
      expect(select).toHaveBeenCalledTimes(1)
      view.focus(1)
      await Promise.resolve()
      const second = vi.spyOn(view.inputs[1], 'select')
      view.service.stop()
      flushFrame()
      expect(second).toHaveBeenCalledTimes(fixed ? 0 : 1)
    })
    it('records deferred complete-blur ownership', async () => {
      clock()
      const view = createPasteFixture('uncontrolled', { defaultValue: ['', '', ''], blurOnComplete: true }, implementation)
      views.push(view)
      view.focus(0)
      const blur = vi.spyOn(view.inputs[0], 'blur')
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
      view.api().setValue(['1', '2', '3'])
      await Promise.resolve()
      view.service.stop()
      flushFrame()
      expect(blur).toHaveBeenCalledTimes(fixed ? 0 : 1)
      expect(warning.mock.calls).toEqual(fixed ? [] : [['[@destyler/xstate > transition] Cannot transition a stopped machine']])
    })
  })
}
