// @vitest-environment happy-dom
import { beforeEach, vi } from 'vitest'
import './deferred-cleanup.cases'

// happy-dom omits the indexed window.frames collection and frameElement link.
// Browser cases use the native collection and original frame documents.
const getContentDocument = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument')!.get!

beforeEach(() => {
  vi.spyOn(HTMLIFrameElement.prototype, 'contentDocument', 'get').mockImplementation(function (this: HTMLIFrameElement) {
    const doc = getContentDocument.call(this) as Document | null
    if (doc?.defaultView)
      Object.defineProperty(doc.defaultView, 'frameElement', { configurable: true, value: this })
    return doc
  })
  vi.spyOn(window, 'frames', 'get').mockImplementation(() =>
    Array.from(document.querySelectorAll('iframe'), frame => frame.contentWindow) as unknown as Window,
  )
})
