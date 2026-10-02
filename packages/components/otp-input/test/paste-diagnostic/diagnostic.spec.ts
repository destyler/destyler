import type { PasteFixture } from '../paste.fixture'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createPasteFixture } from '../paste.fixture'
import { implementations } from './implementations'

const views: PasteFixture[] = []
afterEach(() => {
  views.splice(0).reverse().forEach(view => view.cleanup())
  vi.restoreAllMocks()
})
async function settle() {
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}
async function clipboard(view: PasteFixture, value: string) {
  const copy = document.createElement('textarea')
  copy.dataset.testid = `${view.root.id}-copy`
  view.root.append(copy)
  const target = page.getByTestId(copy.dataset.testid)
  await userEvent.fill(target, value)
  await userEvent.tripleClick(target)
  await userEvent.copy()
}
for (const implementation of implementations) {
  const fixed = implementation.name === 'candidate'
  describe(`diagnostic-only native ${implementation.name}`, () => {
    for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
      for (const empty of [false, true]) {
        it(`${ownership}, empty=${empty}: records trusted clipboard timing, caret and accepted DOM`, async () => {
          const initial = empty ? ['', '', ''] : ['1', '2', '3']
          const view = createPasteFixture(ownership, ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }, implementation)
          views.push(view)
          await clipboard(view, '987')
          view.focus(0)
          await userEvent.paste()
          await settle()
          expect(view.inputEvents).toHaveLength(1)
          expect(view.inputEvents[0].isTrusted).toBe(true)
          expect(view.inputEvents[0].inputType).toBe('insertFromPaste')
          expect(view.timeline.map(row => row.phase)).toEqual(['input-before', 'input-after', 'request'])
          const inputAfter = view.timeline[1]
          const firstFrame = fixed ? initial : ['9', ...initial.slice(1)]
          expect(inputAfter.values).toEqual(firstFrame)
          expect(inputAfter.accepted).toEqual(initial)
          expect(inputAfter.caret).toBe(fixed ? initial[0].length : 1)
          expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
          const accepted = ownership === 'veto' ? initial : ['9', '8', '7']
          expect(view.api().value).toEqual(accepted)
          expect(view.inputs.map(input => input.value)).toEqual(ownership === 'veto' ? firstFrame : accepted)
          view.observe('post-frame')
          if (ownership === 'veto') {
            view.service.setContext({ value: ['9', '8', '7'] })
            await settle()
            expect(view.inputs.map(input => input.value)).toEqual(['9', '8', '7'])
            expect(view.changes).toHaveLength(1)
            view.observe('parent-accepted')
          }
          // eslint-disable-next-line no-console -- This do-not-merge comparison persists native timing/caret observations in CI logs.
          console.info('OTP_PASTE_DIAGNOSTIC', JSON.stringify({ source: implementation.name, ownership, empty, timeline: view.timeline }))
        })
      }
    }
    it('routes trusted clipboard text when a consumer moves focus during the input event', async () => {
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      await clipboard(view, '987')
      view.afterInput(() => view.focus(2))
      view.focus(0)
      await userEvent.paste()
      await settle()
      expect(view.inputEvents[0].isTrusted).toBe(true)
      expect(view.changes[0].value).toEqual(fixed ? ['9', '8', '7'] : ['1', '2', '9'])
    })
    it('uses a programmatically delivered input event index while another input has focus', async () => {
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      view.focus(2)
      view.paste(0, '987', false)
      await settle()
      expect(view.inputEvents[0].isTrusted).toBe(false)
      expect(view.changes[0].value).toEqual(fixed ? ['9', '8', '7'] : ['1', '2', '9'])
    })
    it('records trusted paste ownership when the consumer stops before the first frame', async () => {
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      await clipboard(view, '987')
      view.afterInput(() => view.service.stop())
      view.focus(0)
      await userEvent.paste()
      await settle()
      expect(view.inputEvents[0].isTrusted).toBe(true)
      expect(view.changes).toHaveLength(fixed ? 0 : 1)
      expect(view.api().value).toEqual(fixed ? ['1', '2', '3'] : ['9', '8', '7'])
    })
    it('records queued selection with real frames and a live selection control', async () => {
      const view = createPasteFixture('uncontrolled', { selectOnFocus: true }, implementation)
      views.push(view)
      view.focus(0)
      await settle()
      expect([view.inputs[0].selectionStart, view.inputs[0].selectionEnd]).toEqual([0, 1])
      view.focus(1)
      await Promise.resolve()
      const before = [view.inputs[1].selectionStart, view.inputs[1].selectionEnd]
      view.service.stop()
      await settle()
      expect([view.inputs[1].selectionStart, view.inputs[1].selectionEnd]).toEqual(fixed ? before : [0, 1])
    })
    it('records queued completion blur on real frames', async () => {
      const view = createPasteFixture('uncontrolled', { defaultValue: ['', '', ''], blurOnComplete: true }, implementation)
      views.push(view)
      view.focus(0)
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
      view.api().setValue(['1', '2', '3'])
      await Promise.resolve()
      view.service.stop()
      await settle()
      expect(document.activeElement === view.inputs[0]).toBe(fixed)
      expect(warning.mock.calls).toEqual(fixed ? [] : [['[@destyler/xstate > transition] Cannot transition a stopped machine']])
    })
    it('records reentrant stop/restart without reviving an old queued focus callback', async () => {
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      view.service.setContext({ onValueChange(details) {
        view.changes.push(details)
        view.service.stop()
        view.service.start()
        view.service.send({ type: 'INPUT.FOCUS', index: 1 })
      } })
      view.paste(0, '987')
      await settle()
      expect(view.changes).toHaveLength(1)
      expect(view.api().value).toEqual(['9', '8', '7'])
      expect(view.service.state.context.focusedIndex).toBe(fixed ? 1 : 2)
    })
    it('records stop/restart generation ownership with a fresh subsequent request', async () => {
      const view = createPasteFixture('uncontrolled', {}, implementation)
      views.push(view)
      await clipboard(view, '987')
      let restarted = false
      view.afterInput(() => {
        if (restarted)
          return
        restarted = true
        view.service.stop()
        view.service.start()
        view.focus(1)
        view.paste(1, '56')
      })
      view.focus(0)
      await userEvent.paste()
      await settle()
      expect(view.inputEvents[0].isTrusted).toBe(true)
      expect(view.inputEvents[1].isTrusted).toBe(false)
      expect(view.changes).toHaveLength(fixed ? 1 : 2)
      if (fixed)
        expect(view.api().value).toEqual(['1', '5', '6'])
    })
  })
}
