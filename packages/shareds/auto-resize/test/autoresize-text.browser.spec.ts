import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { autoResizeInput } from '../index'

let frames: Map<number, FrameRequestCallback>
let nextFrame: number
const cleanups: Array<() => void> = []
function flushFrames() {
  const work = [...frames.values()]
  frames.clear()
  work.forEach(fn => fn(0))
}
beforeEach(() => {
  frames = new Map()
  nextFrame = 0
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
    frames.set(++nextFrame, fn)
    return nextFrame
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id)
  })
})
afterEach(() => {
  cleanups.splice(0).reverse().forEach(fn => fn())
  document.body.replaceChildren()
  vi.restoreAllMocks()
})
function setupInput(value: string) {
  const input = document.createElement('input')
  input.value = value
  document.body.append(input)
  const cleanup = autoResizeInput(input)!
  cleanups.push(cleanup)
  return input
}
describe('auto-resize literal text boundary', () => {
  it('measures literal text rather than parsing user text as HTML', () => {
    const text = '  <b data-audit-sentinel="literal">A & B</b>  '
    setupInput(text)
    flushFrames()
    const ghost = document.querySelector('#ghost')!
    expect(ghost.childElementCount).toBe(0)
    expect(ghost.textContent).toBe(text)
  })
  it.each(['ordinary text', '  spaced   words  ', '&amp; &lt; & >', '<b>literal</b>', 'a < b > c', '', '日本語 😀 é', 'first\nsecond\r\nthird'])('preserves the literal input value %j', (value) => {
    const input = setupInput(value)
    flushFrames()
    const ghost = document.querySelector('#ghost')!
    expect(ghost.textContent).toBe(input.value)
    expect(ghost.childElementCount).toBe(0)
    expect(input.value).toBe(value.replace(/[\r\n]/g, ''))
    expect((ghost as HTMLElement).style.whiteSpace).toBe('pre')
  })
  it('does not parse or substitute a placeholder for an empty input', () => {
    const input = setupInput('')
    input.placeholder = '<i data-placeholder-sentinel="literal">&amp;  placeholder</i>'
    flushFrames()
    expect(document.querySelector('#ghost')?.textContent).toBe('')
    expect(document.querySelector('[data-placeholder-sentinel]')).toBeNull()
    expect(input.placeholder).toBe('<i data-placeholder-sentinel="literal">&amp;  placeholder</i>')
  })
})
