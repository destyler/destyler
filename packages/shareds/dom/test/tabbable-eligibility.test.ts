// @vitest-environment happy-dom
import { beforeEach, vi } from 'vitest'
import './tabbable-eligibility.cases'

// happy-dom has no layout engine. Only the node wrapper supplies box geometry;
// the identical browser cases use real rendered client rectangles in Chromium.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function (this: HTMLElement) {
    return (this.style.display === 'none' ? [] : [new DOMRect(0, 0, 100, 30)]) as unknown as DOMRectList
  })
})
