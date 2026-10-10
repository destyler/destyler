import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const normalize = { element: (p: any) => p, input: (p: any) => p, label: (p: any) => p, button: (p: any) => p }
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
describe('dynamic auto-resize literal text boundary', () => {
  it('dynamic item edit public route measures raw tag input text literally', () => {
    const service = machine({ id: 'audit-dynamic', value: ['plain'] } as any)
    const root = document.createElement('div')
    root.id = 'dynamic:audit-dynamic'
    const preview = document.createElement('span')
    preview.id = 'dynamic:audit-dynamic:tag:plain:0'
    preview.dataset.part = 'item-preview'
    preview.dataset.value = 'plain'
    const input = document.createElement('input')
    input.id = `${preview.id}:input`
    input.value = 'plain'
    root.append(preview, input)
    document.body.append(root)
    const api = () => connect(service.getState(), service.send, normalize as any)
    preview.addEventListener('dblclick', () => (api().getItemPreviewProps({ value: 'plain', index: 0 }) as any).onDoubleClick())
    input.addEventListener('input', event => (api().getItemInputProps({ value: 'plain', index: 0 }) as any).onInput(event))
    service.start()
    cleanups.push(() => service.stop())
    preview.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    expect(service.state.matches('editing:tag')).toBe(true)
    expect(document.querySelector('#ghost')).not.toBeNull()
    flushFrames()
    const ghost = document.querySelector('#ghost')!
    expect(ghost.textContent).toBe('plain')
    expect(frames.size).toBe(0)
    const text = '<b data-audit-sentinel="dynamic">typed text</b>'
    input.value = text
    input.dispatchEvent(new InputEvent('input', { bubbles: true }))
    expect(ghost.textContent).toBe('plain')
    expect(frames.size).toBe(1)
    flushFrames()
    expect(service.state.context.editedTagValue).toBe(text)
    expect(document.querySelector('[data-audit-sentinel="dynamic"]')).toBeNull()
    expect(document.querySelector('#ghost')?.textContent).toBe(text)
  })
})
