import type { PasteFixture } from './paste.fixture'
import { afterEach, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import * as otpInput from '../index'
import { createPasteFixture } from './paste.fixture'
import './paste-origin.cases'

const nativeViews: PasteFixture[] = []
afterEach(() => nativeViews.splice(0).reverse().forEach(view => view.cleanup()))

async function settle() {
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

for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const { name, initial, index, paste, expected, start, end } of [
    { name: 'focus moves after input', initial: ['1', '2', '3'], index: 0, paste: '987', expected: ['9', '8', '7'], start: 0, end: 1 },
    { name: 'initially empty slots retain controlled ownership', initial: ['', '', ''], index: 0, paste: '987', expected: ['9', '8', '7'], start: 0, end: 0 },
    { name: 'sparse values truncate only at the end', initial: ['1', '', '3'], index: 2, paste: '987', expected: ['1', '', '9'], start: 0, end: 1 },
    { name: 'a short paste retains the suffix with selected text', initial: ['1', '2', '3'], index: 0, paste: '9', expected: ['9', '2', '3'], start: 0, end: 1 },
    { name: 'a short paste retains the suffix with a collapsed caret at the start', initial: ['1', '2', '3'], index: 0, paste: '9', expected: ['9', '2', '3'], start: 0, end: 0 },
    { name: 'a short paste retains the suffix with a collapsed caret at the end', initial: ['1', '2', '3'], index: 0, paste: '9', expected: ['9', '2', '3'], start: 1, end: 1 },
  ]) {
    it(`trusted clipboard ${ownership}: ${name}`, async () => {
      const context = ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }
      const view = createPasteFixture(ownership, context, otpInput)
      nativeViews.push(view)
      await copy(view, paste)
      const beforeInputs: Array<{ trusted: boolean, data: string | null, start: number | null, end: number | null }> = []
      view.inputs[index].addEventListener('beforeinput', (event) => {
        const input = view.inputs[index]
        beforeInputs.push({ trusted: event.isTrusted, data: (event as InputEvent).data, start: input.selectionStart, end: input.selectionEnd })
      }, { capture: true })
      let movedBeforeRequest = false
      view.afterInput(() => {
        view.focus(1)
        movedBeforeRequest = view.changes.length === 0 && document.activeElement === view.inputs[1]
      })
      view.focus(index)
      view.inputs[index].setSelectionRange(start, end)
      await userEvent.paste()
      await settle()
      // Clipboard input is separate from the untrusted InputEvent cases above.
      expect(view.inputEvents).toHaveLength(1)
      expect(view.inputEvents[0].isTrusted).toBe(true)
      expect(view.inputEvents[0].inputType).toBe('insertFromPaste')
      expect(view.inputEvents[0].data).toBe(paste)
      expect(view.inputEvents[0].target).toBe(view.inputs[index])
      expect(beforeInputs).toEqual([{ trusted: true, data: paste, start, end }])
      expect(movedBeforeRequest).toBe(true)
      expect(view.changes).toEqual([{ value: expected, valueAsString: expected.join('') }])
      const accepted = ownership === 'veto' ? initial : expected
      expect(view.api().value).toEqual(accepted)
      expect(view.inputs.map(input => input.value)).toEqual(accepted)
      if (ownership === 'veto') {
        view.focus(1)
        view.service.setContext({ value: expected })
        await settle()
        expect(view.api().value).toEqual(expected)
        expect(view.inputs.map(input => input.value)).toEqual(expected)
        expect(view.service.state.context.focusedIndex).toBe(1)
        expect(document.activeElement).toBe(view.inputs[1])
        expect(view.changes).toHaveLength(1)
      }
    })
  }
}
