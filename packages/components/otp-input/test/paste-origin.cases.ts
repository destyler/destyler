import type { PasteFixture, PasteOwnership } from './paste.fixture'
import { afterEach, expect, it, vi } from 'vitest'
import * as otpInput from '../index'
import { createPasteFixture } from './paste.fixture'

const views: PasteFixture[] = []
const frames = new Map<number, FrameRequestCallback>()
let handle = 0

function fixture(ownership: PasteOwnership = 'uncontrolled', initial = ['1', '2', '3']) {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++handle, callback)
    return handle
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  const context = ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }
  // Exercise the public source exports, never the frozen diagnostic copies.
  const view = createPasteFixture(ownership, context, otpInput)
  views.push(view)
  return view
}

function flushFrame() {
  const work = Array.from(frames.values())
  frames.clear()
  work.forEach(callback => callback(0))
}

function edit(view: PasteFixture, data: string, inputType: string, eventData: string | null = data, inputData = eventData) {
  const input = view.inputs[0]
  const before = new InputEvent('beforeinput', { inputType, data: eventData, bubbles: true, cancelable: true })
  // happy-dom otherwise turns explicit null into an empty string.
  if (eventData === null)
    Object.defineProperty(before, 'data', { value: null })
  input.dispatchEvent(before)
  if (!before.defaultPrevented) {
    // Synthetic default edit: honor the selection left by the public handler.
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? start
    input.value = input.value.slice(0, start) + data + input.value.slice(end)
    input.setSelectionRange(start + data.length, start + data.length)
    const event = new InputEvent('input', { inputType, data: inputData, bubbles: true })
    if (inputData === null)
      Object.defineProperty(event, 'data', { value: null })
    input.dispatchEvent(event)
  }
  return before
}

afterEach(() => {
  views.splice(0).reverse().forEach(view => view.cleanup())
  frames.clear()
  vi.unstubAllGlobals()
})

for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const caret of ['start', 'end', 'selected'] as const) {
    for (const data of ['9', null]) {
      it(`synthetic ${ownership}: short paste at ${caret} with event data ${data}`, async () => {
        const view = fixture(ownership)
        view.focus(0)
        view.inputs[0].setSelectionRange(caret === 'end' ? 1 : 0, caret === 'start' ? 0 : 1)
        const before = edit(view, '9', 'insertFromPaste', data)
        expect(before.defaultPrevented).toBe(false)
        expect(view.changes).toEqual([])
        expect(view.inputs.map(input => input.value)).toEqual(['9', '2', '3'])
        flushFrame()
        await Promise.resolve()
        expect(view.changes).toEqual([{ value: ['9', '2', '3'], valueAsString: '923' }])
        const accepted = ownership === 'veto' ? ['1', '2', '3'] : ['9', '2', '3']
        expect(view.api().value).toEqual(accepted)
        expect(view.inputs.map(input => input.value)).toEqual(accepted)
      })
    }
  }

  it(`synthetic ${ownership}: uses paste data when the input still contains old text`, async () => {
    const view = fixture(ownership)
    view.focus(0)
    view.inputs[0].value = '19'
    view.inputs[0].dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', data: '9', bubbles: true }))
    expect(view.changes).toEqual([])
    expect(view.inputs.map(input => input.value)).toEqual(['9', '2', '3'])
    flushFrame()
    await Promise.resolve()
    expect(view.changes).toEqual([{ value: ['9', '2', '3'], valueAsString: '923' }])
  })

  for (const timing of ['after input', 'before input'] as const) {
    it(`synthetic ${ownership}: keeps input 0 as origin when focus moves ${timing}`, async () => {
      const view = fixture(ownership)
      if (timing === 'after input') {
        view.afterInput(() => view.focus(2))
        view.paste(0, '987')
      }
      else {
        view.focus(2)
        view.paste(0, '987', false)
      }
      expect(view.inputEvents).toHaveLength(1)
      // happy-dom omits isTrusted; native browser synthetic events expose false.
      expect(view.inputEvents[0].isTrusted).not.toBe(true)
      expect(view.inputEvents[0].target).toBe(view.inputs[0])
      expect(view.service.state.context.focusedIndex).toBe(2)
      expect(view.changes).toEqual([])
      expect(view.inputs.map(input => input.value)).toEqual(['9', '2', '3'])
      flushFrame()
      await Promise.resolve()
      expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
      const accepted = ownership === 'veto' ? ['1', '2', '3'] : ['9', '8', '7']
      expect(view.api().value).toEqual(accepted)
      expect(view.inputs.map(input => input.value)).toEqual(accepted)
    })
  }

  for (const { name, initial, index, paste, expected } of [
    { name: 'empty slots before origin', initial: ['', '', '3'], index: 1, paste: '98', expected: ['', '9', '8'] },
    { name: 'empty middle slot and end truncation', initial: ['1', '', '3'], index: 2, paste: '987', expected: ['1', '', '9'] },
    { name: 'untouched suffix', initial: ['1', '2', '3'], index: 0, paste: '9', expected: ['9', '2', '3'] },
    { name: 'empty untouched suffix', initial: ['1', '', ''], index: 0, paste: '9', expected: ['9', '', ''] },
  ]) {
    it(`synthetic ${ownership}: preserves ${name}`, async () => {
      const view = fixture(ownership, initial)
      view.paste(index, paste)
      flushFrame()
      await Promise.resolve()
      expect(view.changes).toEqual([{ value: expected, valueAsString: expected.join('') }])
      const accepted = ownership === 'veto' ? initial : expected
      expect(view.api().value).toEqual(accepted)
      expect(view.inputs.map(input => input.value)).toEqual(accepted)
      expect(view.api().value).toHaveLength(initial.length)
    })
  }
}

for (const initial of [['1', '2', '3'], ['', '', '']]) {
  it(`accepts a parent update after a paste veto from ${initial.join('') || 'empty'} without another request`, async () => {
    const view = fixture('veto', initial)
    view.paste(0, '987')
    expect(view.changes).toEqual([])
    flushFrame()
    await Promise.resolve()
    expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
    expect(view.api().value).toEqual(initial)
    expect(view.inputs.map(input => input.value)).toEqual(initial)

    view.focus(1)
    view.service.setContext({ value: ['9', '8', '7'] })
    await Promise.resolve()
    flushFrame()
    await Promise.resolve()
    expect(view.api().value).toEqual(['9', '8', '7'])
    expect(view.inputs.map(input => input.value)).toEqual(['9', '8', '7'])
    expect(view.service.state.context.focusedIndex).toBe(1)
    expect(document.activeElement).toBe(view.inputs[1])
    expect(view.changes).toHaveLength(1)
  })
}

it('keeps ordinary typing immediate and single-slot', () => {
  const view = fixture()
  view.focus(0)
  view.inputs[0].setSelectionRange(1, 1)
  expect(edit(view, '9', 'insertText').defaultPrevented).toBe(false)
  expect(view.changes).toEqual([{ value: ['9', '2', '3'], valueAsString: '923' }])
  expect(view.service.state.context.focusedIndex).toBe(1)
  flushFrame()
  expect(view.changes).toHaveLength(1)
})

for (const inputType of ['insertText', 'insertFromPaste']) {
  it(`keeps invalid ${inputType} cancellation before the default edit`, () => {
    const view = fixture()
    const invalid = vi.fn()
    view.service.setContext({ onValueInvalid: invalid })
    view.focus(0)
    view.inputs[0].setSelectionRange(1, 1)
    expect(edit(view, 'x', inputType).defaultPrevented).toBe(true)
    expect(invalid).toHaveBeenCalledTimes(1)
    expect(view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
    flushFrame()
    expect(view.changes).toEqual([])
  })
}

it('preserves the non-paste beforeinput error boundary', () => {
  const view = fixture()
  view.service.setContext({ pattern: '[' })
  view.focus(0)
  const input = view.inputs[0]
  input.setSelectionRange(1, 1)
  const event = { currentTarget: input, data: '9', preventDefault: vi.fn() }
  expect(() => view.api().getInputProps({ index: 0 }).onBeforeInput?.(event as never)).not.toThrow()
  expect(event.preventDefault).not.toHaveBeenCalled()
  expect(input.selectionStart).toBe(1)
  expect(view.changes).toEqual([])
})

it('validates null-data paste after the default edit without scheduling a change', () => {
  const view = fixture()
  const invalid = vi.fn()
  view.service.setContext({ onValueInvalid: invalid })
  view.focus(0)
  view.inputs[0].setSelectionRange(1, 1)
  expect(edit(view, 'x', 'insertFromPaste', null).defaultPrevented).toBe(false)
  expect(invalid).toHaveBeenCalledWith({ value: 'x', index: 0 })
  expect(view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
  flushFrame()
  expect(view.changes).toEqual([])
})

it('validates paste data supplied only by the input event', () => {
  const view = fixture()
  const invalid = vi.fn()
  view.service.setContext({ onValueInvalid: invalid })
  view.focus(0)
  view.inputs[0].setSelectionRange(1, 1)
  expect(edit(view, 'x', 'insertFromPaste', null, 'x').defaultPrevented).toBe(false)
  expect(invalid).toHaveBeenCalledWith({ value: 'x', index: 0 })
  expect(view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
  flushFrame()
  expect(view.changes).toEqual([])
})

it('does not overwrite caller DOM after an invalid-paste callback stops the actor', () => {
  const view = fixture()
  view.service.setContext({ onValueInvalid() {
    view.service.stop()
    view.inputs[0].value = 'caller-owned'
  } })
  view.focus(0)
  edit(view, 'x', 'insertFromPaste', null)
  flushFrame()
  expect(view.inputs[0].value).toBe('caller-owned')
  expect(view.changes).toEqual([])
})

it('does not select caller DOM after a rejected beforeinput paste stops the actor', () => {
  const view = fixture()
  view.service.setContext({ onValueInvalid() {
    view.service.stop()
    view.inputs[0].value = 'caller-owned'
    view.inputs[0].setSelectionRange(3, 3)
  } })
  view.focus(0)
  expect(edit(view, 'x', 'insertFromPaste').defaultPrevented).toBe(true)
  expect(view.inputs[0].value).toBe('caller-owned')
  expect(view.inputs[0].selectionStart).toBe(3)
  expect(view.inputs[0].selectionEnd).toBe(3)
  flushFrame()
  expect(view.changes).toEqual([])
})

it('does not turn empty paste data into a request containing old DOM text', () => {
  const view = fixture()
  view.focus(0)
  view.inputs[0].value = '19'
  view.inputs[0].dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', data: '', bubbles: true }))
  flushFrame()
  expect(view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
  expect(view.changes).toEqual([])
})

it('keeps each queued paste origin when the first change callback moves focus', async () => {
  const view = fixture()
  view.service.setContext({ onValueChange(details) {
    view.changes.push(details)
    view.focus(2)
  } })
  view.paste(0, '98')
  view.paste(1, '76')
  flushFrame()
  await Promise.resolve()
  expect(view.changes).toEqual([
    { value: ['9', '8', '3'], valueAsString: '983' },
    { value: ['9', '7', '6'], valueAsString: '976' },
  ])
  expect(view.inputs.map(input => input.value)).toEqual(['9', '7', '6'])
})

it('preserves the current parent value outside the paste range', async () => {
  const view = fixture('accept')
  view.paste(1, '9')
  view.service.setContext({ value: ['4', '5', '6'] })
  flushFrame()
  await Promise.resolve()
  expect(view.changes).toEqual([{ value: ['4', '9', '6'], valueAsString: '496' }])
  expect(view.inputs.map(input => input.value)).toEqual(['4', '9', '6'])
})

it('captures focus at dispatch for direct paste events without an index', () => {
  const view = fixture()
  view.focus(1)
  view.service.send({ type: 'INPUT.PASTE', value: '98' })
  view.focus(2)
  flushFrame()
  expect(view.changes).toEqual([{ value: ['1', '9', '8'], valueAsString: '198' }])
})
