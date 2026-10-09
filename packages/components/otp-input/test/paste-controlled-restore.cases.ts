import type { PasteFixture } from './paste.fixture'
import { afterEach, expect, it, vi } from 'vitest'
import { createPasteFixture } from './paste.fixture'

const views: PasteFixture[] = []
let frames: FrameRequestCallback[] = []
function clock() {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback)
    return frames.length
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
}
function flushFrame() {
  const work = frames
  frames = []
  work.forEach(callback => callback(0))
}
afterEach(() => {
  views.splice(0).reverse().forEach(view => view.cleanup())
  frames = []
  vi.unstubAllGlobals()
})
for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const empty of [false, true]) {
    it(`${ownership}, empty=${empty}: keeps pre-request behavior and restores accepted controlled fields afterward`, async () => {
      clock()
      const initial = empty ? ['', '', ''] : ['1', '2', '3']
      const view = createPasteFixture(ownership, ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial })
      views.push(view)
      view.paste(0, '987')
      const before = ['9', ...initial.slice(1)]
      expect(view.changes).toEqual([])
      expect(view.inputs.map(input => input.value)).toEqual(before)
      expect(view.inputs[0].selectionStart).toBe(1)
      flushFrame()
      await Promise.resolve()
      const accepted = ownership === 'veto' ? initial : ['9', '8', '7']
      expect(view.timeline[2].values).toEqual(before)
      expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
      expect(view.api().value).toEqual(accepted)
      expect(view.inputs.map(input => input.value)).toEqual(accepted)
    })
  }
}
it('repeated veto restores the dirty field even when another input has focus', () => {
  clock()
  const view = createPasteFixture('veto')
  views.push(view)
  for (let i = 0; i < 2; i++) {
    view.paste(0, '987')
    view.focus(2)
    flushFrame()
    expect(view.api().value).toEqual(['1', '2', '3'])
    expect(view.inputs.map(input => input.value)).toEqual(['1', '2', '3'])
  }
  expect(view.changes).toHaveLength(2)
})
it('reconciles the current parent value rather than the proposed array', async () => {
  clock()
  const view = createPasteFixture('veto')
  views.push(view)
  view.service.setContext({ onValueChange(details) {
    view.changes.push(details)
    view.service.setContext({ value: ['4', '5', '6'] })
  } })
  view.paste(0, '987')
  flushFrame()
  await Promise.resolve()
  expect(view.changes).toHaveLength(1)
  expect(view.api().value).toEqual(['4', '5', '6'])
  expect(view.inputs.map(input => input.value)).toEqual(['4', '5', '6'])
})
for (const restart of [false, true]) {
  it(`preserves caller DOM when a request callback stops with restart=${restart}`, () => {
    clock()
    const view = createPasteFixture('veto')
    views.push(view)
    view.service.setContext({ onValueChange(details) {
      view.changes.push(details)
      view.service.stop()
      if (restart)
        view.service.start()
      view.inputs[0].value = 'caller-owned'
    } })
    view.paste(0, '987')
    flushFrame()
    expect(view.inputs[0].value).toBe('caller-owned')
    expect(view.changes).toHaveLength(1)
  })
}
it('rechecks ownership after the caller root resolver restarts the actor', () => {
  clock()
  let armed = false
  let resolved = false
  const view = createPasteFixture('veto', { getRootNode() {
    if (armed) {
      armed = false
      resolved = true
      view.service.stop()
      view.service.start()
      view.inputs[0].value = 'caller-owned'
    }
    return document
  } })
  views.push(view)
  view.service.setContext({ onValueChange(details) {
    view.changes.push(details)
    armed = true
  } })
  view.paste(0, '987')
  flushFrame()
  expect(resolved).toBe(true)
  expect(view.inputs[0].value).toBe('caller-owned')
  expect(view.changes).toHaveLength(1)
})
