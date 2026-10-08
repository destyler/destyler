import { expect, it, vi } from 'vitest'
import { getWindowFrames } from '../src/frame-utils'

it('cleans the original native iframe document after srcDoc navigation', async () => {
  const frame = document.createElement('iframe')
  const loaded = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }))
  frame.srcdoc = '<p>first document</p>'
  document.body.append(frame)
  await loaded
  const original = frame.contentDocument!
  const remove = vi.spyOn(original, 'removeEventListener')
  const callback = vi.fn()
  const cleanup = getWindowFrames(window).addEventListener('audit', callback, true)
  try {
    original.dispatchEvent(new Event('audit'))
    expect(callback).toHaveBeenCalledTimes(1)
    const navigated = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }))
    frame.srcdoc = '<p>second document</p>'
    await navigated
    expect(frame.contentDocument).not.toBe(original)
    cleanup()
    expect(remove).toHaveBeenCalledWith('audit', callback, true)
    original.dispatchEvent(new Event('audit'))
    frame.contentDocument!.dispatchEvent(new Event('audit'))
    expect(callback).toHaveBeenCalledTimes(1)
  }
  finally {
    cleanup()
    remove.mockRestore()
    frame.remove()
  }
})
