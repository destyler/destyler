// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

const services: Array<ReturnType<typeof machine>> = []

afterEach(async () => {
  services.splice(0).forEach(service => service.stop())
  await Promise.resolve()
  document.body.replaceChildren()
})

async function start(context: Partial<UserDefinedContext> = {}, snapEvery = 1) {
  const horizontal = context.orientation !== 'vertical'
  const count = snapEvery === 1 ? 3 : 5
  const group = document.createElement('div')
  group.id = 'carousel:scroll-test:item-group'
  for (const side of ['left', 'right', 'top', 'bottom'])
    group.style.setProperty(`scroll-padding-${side}`, '0px')
  Object.defineProperties(group, {
    scrollWidth: { value: horizontal ? count * 300 : 300 },
    offsetWidth: { value: 300 },
    scrollHeight: { value: horizontal ? 300 : count * 300 },
    offsetHeight: { value: 300 },
  })
  group.getBoundingClientRect = () => new DOMRect(0, 0, 300, 300)
  const scrollTo = vi.fn()
  group.scrollTo = scrollTo

  for (let index = 0; index < count; index++) {
    const item = document.createElement('div')
    item.dataset.part = 'item'
    item.dataset.index = String(index)
    item.style.scrollSnapAlign = index % snapEvery === 0 ? 'start' : 'none'
    item.getBoundingClientRect = () => new DOMRect(horizontal ? index * 300 : 0, horizontal ? 0 : index * 300, 300, 300)
    group.appendChild(item)
  }
  document.body.appendChild(group)

  const service = machine({ id: 'scroll-test', slideCount: count, ...context })
  services.push(service)
  service.start()
  // Entry snap-point measurement and context watchers run in microtasks.
  await Promise.resolve()
  await Promise.resolve()
  expect(service.state.context.pageSnapPoints).toEqual([0, 300 * snapEvery, 600 * snapEvery])
  scrollTo.mockClear()
  return { service, scrollTo }
}

describe('carousel scroll follows the current page', () => {
  it.each(['horizontal', 'vertical'] as const)('uses a parent page write after repeated requests (%s)', async (orientation) => {
    const onPageChange = vi.fn()
    const { service, scrollTo } = await start({ page: 0, orientation, onPageChange })
    const axis = orientation === 'horizontal' ? 'left' : 'top'

    for (const page of [1, 0, 1, 0]) {
      service.send({ type: 'PAGE.SET', index: page })
      expect(onPageChange).toHaveBeenLastCalledWith({ page, pageSnapPoint: page * 300 })
      service.setContext({ page })
      await Promise.resolve()
      expect(scrollTo).toHaveBeenLastCalledWith({ [axis]: page * 300, behavior: 'smooth' })
    }

    scrollTo.mockClear()
    // No new event accompanies an external controlled-prop update.
    service.setContext({ page: 1 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ [axis]: 300, behavior: 'smooth' })
  })

  it('uses the page accepted by the parent rather than the requested page', async () => {
    const onPageChange = vi.fn()
    const { service, scrollTo } = await start({ page: 0, onPageChange })
    service.send({ type: 'PAGE.SET', index: 2 })
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSnapPoint: 600 })
    await Promise.resolve()
    expect(scrollTo).not.toHaveBeenCalled()

    service.setContext({ page: 1 })
    await Promise.resolve()
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 300, behavior: 'smooth' })
  })

  it('does not reuse the last requested index when an uncontrolled context changes', async () => {
    const { service, scrollTo } = await start()
    service.send({ type: 'PAGE.SET', index: 1 })
    await Promise.resolve()
    service.send({ type: 'PAGE.SET', index: 0 })
    await Promise.resolve()
    scrollTo.mockClear()

    service.setContext({ page: 2 })
    await Promise.resolve()
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 600, behavior: 'smooth' })
  })

  it('scrolls to the matching page when a slide index differs from its page index', async () => {
    const { service, scrollTo } = await start({}, 2)
    service.send({ type: 'INDEX.SET', index: 2 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 600, behavior: 'smooth' })
  })

  it.each([false, true])('preserves the requested scroll behavior (instant=%s)', async (instant) => {
    const { service, scrollTo } = await start()
    service.send({ type: 'PAGE.SET', index: 1, instant })
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 300, behavior: instant ? 'instant' : 'smooth' })
  })
})
