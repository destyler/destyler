import type { UserDefinedContext } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))

const services: Array<ReturnType<typeof machine>> = []
const groups: HTMLElement[] = []

afterEach(async () => {
  services.splice(0).forEach(service => service.stop())
  await Promise.resolve()
  groups.splice(0).forEach(group => group.remove())
  vi.useRealTimers()
})

async function start(context: Partial<UserDefinedContext> = {}) {
  const horizontal = context.orientation !== 'vertical'
  const count = 3
  const group = document.createElement('div')
  group.id = 'carousel:scroll-test:item-group'
  for (const side of ['left', 'right', 'top', 'bottom'])
    group.style.setProperty(`scroll-padding-${side}`, '0px')
  Object.defineProperties(group, {
    scrollWidth: { value: horizontal ? count * 300 : 300 },
    offsetWidth: { value: 300 },
    scrollHeight: { value: horizontal ? 300 : count * 300 },
    offsetHeight: { value: 300 },
    scrollLeft: { value: 0, writable: true },
    scrollTop: { value: 0, writable: true },
  })
  group.getBoundingClientRect = () => new DOMRect(0, 0, 300, 300)
  const scrollTo = vi.fn()
  group.scrollTo = scrollTo

  for (let index = 0; index < count; index++) {
    const item = document.createElement('div')
    item.dataset.part = 'item'
    item.dataset.index = String(index)
    item.style.scrollSnapAlign = 'start'
    item.getBoundingClientRect = () => new DOMRect(horizontal ? index * 300 : 0, horizontal ? 0 : index * 300, 300, 300)
    group.appendChild(item)
  }
  document.body.appendChild(group)
  groups.push(group)

  const service = machine({ id: 'scroll-test', slideCount: count, ...context })
  services.push(service)
  service.start()
  // Entry snap-point measurement and context watchers run in microtasks.
  await Promise.resolve()
  await Promise.resolve()
  expect(service.state.context.pageSnapPoints).toEqual([0, 300, 600])
  scrollTo.mockClear()
  return { service, group, scrollTo }
}

describe('carousel parent writes cancel stale scroll completion', () => {
  it.each(['horizontal', 'vertical'] as const)('keeps a parent page write while its %s smooth scroll starts', async (orientation) => {
    const onPageChange = vi.fn()
    const { service, group, scrollTo } = await start({ page: 0, orientation, onPageChange })
    service.send({ type: 'INVIEW.SET', slidesInView: [0] })
    // The previous native scroll is almost through its 150 ms quiet period.
    group.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(149)

    service.setContext({ page: 1 })
    await Promise.resolve()
    expect(scrollTo).toHaveBeenLastCalledWith({
      [orientation === 'horizontal' ? 'left' : 'top']: 300,
      behavior: 'smooth',
    })
    // Smooth scrolling has been requested but has not moved in the next frame.
    vi.advanceTimersByTime(1)
    expect(onPageChange).not.toHaveBeenCalled()
    expect(service.state.context.page).toBe(1)
  })

  it('does not write the old scroll position back through a bound parent setter', async () => {
    const onPageChange = vi.fn()
    const { service, group } = await start({ page: 0, onPageChange })
    onPageChange.mockImplementation(({ page }: { page: number }) => service.setContext({ page }))
    service.send({ type: 'INVIEW.SET', slidesInView: [0] })
    group.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(149)

    service.setContext({ page: 1 })
    await Promise.resolve()
    vi.advanceTimersByTime(1)
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('preserves controlled requests without scrolling before parent acceptance', async () => {
    const onPageChange = vi.fn()
    const { service, group, scrollTo } = await start({ page: 0, onPageChange })
    service.send({ type: 'INVIEW.SET', slidesInView: [1] })
    group.scrollLeft = 300
    group.dispatchEvent(new Event('scroll'))
    service.send({ type: 'PAGE.SET', index: 2, instant: true })
    await Promise.resolve()
    vi.advanceTimersByTime(150)
    expect(service.state.context.page).toBe(0)
    expect(scrollTo).not.toHaveBeenCalled()
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSnapPoint: 600 })
  })

  it('keeps subsequent native scrolling observable after the parent write', async () => {
    const onPageChange = vi.fn()
    const { service, group } = await start({ page: 0, onPageChange })
    service.send({ type: 'INVIEW.SET', slidesInView: [0] })
    group.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(149)
    service.setContext({ page: 1 })
    await Promise.resolve()
    vi.advanceTimersByTime(1)
    onPageChange.mockClear()

    group.scrollLeft = 600
    service.send({ type: 'INVIEW.SET', slidesInView: [2] })
    group.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(149)
    expect(onPageChange).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSnapPoint: 600 })
  })
})
