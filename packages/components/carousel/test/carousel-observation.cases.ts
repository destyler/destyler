import type { UserDefinedContext } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

const services: Array<ReturnType<typeof machine>> = []
const nodes: HTMLElement[] = []
const frames = new Map<number, FrameRequestCallback>()
let nextFrame = 0

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] })
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++nextFrame, callback)
    return nextFrame
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id)
  })
  vi.stubGlobal('IntersectionObserver', class {
    root = null
    rootMargin = '0px'
    thresholds = [0]
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  })
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

afterEach(async () => {
  services.splice(0).forEach(service => service.stop())
  await Promise.resolve()
  frames.clear()
  nodes.splice(0).forEach(node => node.remove())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function flushFrames() {
  const pending = Array.from(frames.values())
  frames.clear()
  pending.forEach(callback => callback(0))
}

async function start(context: Partial<UserDefinedContext> = {}, doc = document) {
  const id = `lifecycle-${services.length}`
  const horizontal = context.orientation !== 'vertical'
  const group = doc.createElement('div')
  group.id = `carousel:${id}:item-group`
  group.style.scrollSnapType = horizontal ? 'x mandatory' : 'y mandatory'
  for (const side of ['left', 'right', 'top', 'bottom'])
    group.style.setProperty(`scroll-padding-${side}`, '0px')
  Object.defineProperties(group, {
    scrollWidth: { value: horizontal ? 900 : 300, configurable: true },
    offsetWidth: { value: 300 },
    scrollHeight: { value: horizontal ? 300 : 900, configurable: true },
    offsetHeight: { value: 300 },
    scrollLeft: { value: 0, writable: true },
    scrollTop: { value: 0, writable: true },
  })
  group.getBoundingClientRect = () => new DOMRect(0, 0, 300, 300)
  const scrollTo = vi.fn()
  const scrollBy = vi.fn()
  group.scrollTo = scrollTo
  group.scrollBy = scrollBy
  const indicators: HTMLButtonElement[] = []
  for (let index = 0; index < 3; index++) {
    const item = doc.createElement('div')
    item.dataset.part = 'item'
    item.dataset.index = String(index)
    item.style.scrollSnapAlign = 'start'
    item.getBoundingClientRect = () => new DOMRect(
      horizontal ? index * 300 - group.scrollLeft : 0,
      horizontal ? 0 : index * 300 - group.scrollTop,
      300,
      300,
    )
    group.appendChild(item)
    const indicator = doc.createElement('button')
    indicator.id = `carousel:${id}:indicator:${index}`
    doc.body.appendChild(indicator)
    indicators.push(indicator)
    nodes.push(indicator)
  }
  doc.body.appendChild(group)
  nodes.push(group)
  const service = machine({ id, slideCount: 3, getRootNode: () => doc, ...context })
  services.push(service)
  service.start()
  await Promise.resolve()
  await Promise.resolve()
  expect(service.state.context.pageSnapPoints).toEqual([0, 300, 600])
  scrollTo.mockClear()
  return { service, group, scrollTo, scrollBy, indicators }
}

describe('carousel activity ownership', () => {
  it('keeps the autoplay deadline and emits no stop when slides enter view', async () => {
    const onAutoplayStatusChange = vi.fn()
    const { service } = await start({ autoplay: { delay: 1000 }, loop: true, onAutoplayStatusChange })
    vi.advanceTimersByTime(900)
    service.send({ type: 'INVIEW.SET', slidesInView: [0] })
    expect(service.state.context.slidesInView).toEqual([0])
    expect(onAutoplayStatusChange).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(service.state.context.page).toBe(1)
    expect(onAutoplayStatusChange).toHaveBeenCalledExactlyOnceWith({ type: 'autoplay', isPlaying: true, page: 1 })
    service.send({ type: 'INVIEW.SET', slidesInView: [1] })
    vi.advanceTimersByTime(1000)
    expect(service.state.context.page).toBe(2)
    service.send('AUTOPLAY.PAUSE')
    expect(onAutoplayStatusChange).toHaveBeenLastCalledWith({ type: 'autoplay.stop', isPlaying: false, page: 2 })
    vi.advanceTimersByTime(5000)
    expect(service.state.context.page).toBe(2)
  })

  it('keeps controlled autoplay requests pending until the parent accepts and cancels on navigation', async () => {
    const onPageChange = vi.fn()
    const { service, scrollTo } = await start({ page: 0, autoplay: { delay: 1000 }, onPageChange })
    vi.advanceTimersByTime(1000)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSnapPoint: 300 })
    expect(service.state.context.page).toBe(0)
    expect(scrollTo).not.toHaveBeenCalled()
    service.setContext({ page: 2 })
    await Promise.resolve()
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 600, behavior: 'smooth' })
    service.send({ type: 'PAGE.SET', index: 1 })
    expect(service.state.matches('idle')).toBe(true)
    onPageChange.mockClear()
    vi.advanceTimersByTime(3000)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('does not reinstall drag listeners or overwrite snap restoration state for visibility updates', async () => {
    const onDragStatusChange = vi.fn()
    const { service, group } = await start({ onDragStatusChange })
    service.send('DRAGGING.START')
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    const savedSnapType = group.dataset.scrollSnapType
    for (const slidesInView of [[0], [0, 1], [1], [1, 2]])
      service.send({ type: 'INVIEW.SET', slidesInView })
    expect(service.state.context.slidesInView).toEqual([1, 2])
    expect(group.dataset.scrollSnapType).toBe(savedSnapType)
    expect(add).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
    expect(onDragStatusChange.mock.calls.map(([details]) => details.type)).toEqual(['dragging.start'])
    service.send('DRAGGING.END')
    flushFrames()
    expect(onDragStatusChange.mock.calls.map(([details]) => details.type)).toEqual(['dragging.start', 'dragging.end'])
  })

  it('keeps one timer through repeated visibility updates and explicit pause/resume cycles', async () => {
    const onAutoplayStatusChange = vi.fn()
    const { service } = await start({ autoplay: { delay: 1000 }, loop: true, onAutoplayStatusChange })
    for (let cycle = 0; cycle < 3; cycle++) {
      for (let update = 0; update < 4; update++) {
        vi.advanceTimersByTime(200)
        service.send({ type: 'INVIEW.SET', slidesInView: [update % 3] })
      }
      vi.advanceTimersByTime(200)
      expect(service.state.context.page).toBe((cycle + 1) % 3)
      service.send('AUTOPLAY.PAUSE')
      vi.advanceTimersByTime(2000)
      expect(service.state.context.page).toBe((cycle + 1) % 3)
      service.send('AUTOPLAY.START')
      service.send('AUTOPLAY.START')
    }
    expect(onAutoplayStatusChange.mock.calls.map(([details]) => details.type)).toEqual([
      'autoplay',
      'autoplay.stop',
      'autoplay.start',
      'autoplay',
      'autoplay.stop',
      'autoplay.start',
      'autoplay',
      'autoplay.stop',
      'autoplay.start',
    ])
    service.stop()
    const count = onAutoplayStatusChange.mock.calls.length
    vi.advanceTimersByTime(5000)
    expect(onAutoplayStatusChange).toHaveBeenCalledTimes(count)
  })
})
