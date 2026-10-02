// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'
import { getWindowFrames } from '../src/frame-utils'

function createDocuments() {
  return [document.implementation.createHTMLDocument('first'), document.implementation.createHTMLDocument('second')]
}

describe('frame listener target ownership', () => {
  it('detaches from the subscribed document after a frame document changes', () => {
    const [first, second] = createDocuments()
    let current = first
    const frame = {
      get document() {
        return current
      },
    }
    const callback = vi.fn()
    const cleanup = getWindowFrames({ frames: [frame] } as unknown as Window).addEventListener('audit', callback, true)
    first.dispatchEvent(new Event('audit'))
    expect(callback).toHaveBeenCalledTimes(1)
    current = second
    cleanup()
    first.dispatchEvent(new Event('audit'))
    second.dispatchEvent(new Event('audit'))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('detaches from a frame that was removed from the window collection', () => {
    const [first] = createDocuments()
    const frames = [{ document: first }]
    const callback = vi.fn()
    const cleanup = getWindowFrames({ frames } as unknown as Window).addEventListener('audit', callback)
    frames.length = 0
    cleanup()
    first.dispatchEvent(new Event('audit'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('does not remove a same-identity listener independently added to a later frame', () => {
    const [first, second] = createDocuments()
    const frames = [{ document: first }]
    const callback = vi.fn()
    const cleanup = getWindowFrames({ frames } as unknown as Window).addEventListener('audit', callback)
    second.addEventListener('audit', callback)
    frames.push({ document: second })
    cleanup()
    first.dispatchEvent(new Event('audit'))
    second.dispatchEvent(new Event('audit'))
    expect(callback).toHaveBeenCalledTimes(1)
    second.removeEventListener('audit', callback)
  })

  it('does not remove a listener from a document that was inaccessible during setup', () => {
    const [first] = createDocuments()
    let accessible = false
    const frame = { get document() {
      if (!accessible)
        throw new DOMException('Blocked frame', 'SecurityError')
      return first
    } }
    const callback = vi.fn()
    const cleanup = getWindowFrames({ frames: [frame] } as unknown as Window).addEventListener('audit', callback)
    accessible = true
    first.addEventListener('audit', callback)
    cleanup()
    first.dispatchEvent(new Event('audit'))
    expect(callback).toHaveBeenCalledTimes(1)
    first.removeEventListener('audit', callback)
  })

  it('preserves capture identity, other listeners, and repeated cleanup for a stable frame', () => {
    const [first] = createDocuments()
    const callback = vi.fn()
    const external = vi.fn()
    first.addEventListener('audit', external, true)
    const cleanup = getWindowFrames({ frames: [{ document: first }] } as unknown as Window).addEventListener('audit', callback, true)
    cleanup()
    cleanup()
    first.dispatchEvent(new Event('audit'))
    expect(callback).not.toHaveBeenCalled()
    expect(external).toHaveBeenCalledTimes(1)
    first.removeEventListener('audit', external, true)
  })
})
