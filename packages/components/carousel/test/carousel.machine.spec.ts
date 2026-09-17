import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function installCarouselDom(id: string) {
  const group = document.createElement('div')
  group.id = `carousel:${id}:item-group`
  Object.defineProperty(group, 'scrollWidth', { value: 500 })
  Object.defineProperty(group, 'offsetWidth', { value: 100 })
  Object.defineProperty(group, 'scrollHeight', { value: 100 })
  Object.defineProperty(group, 'offsetHeight', { value: 100 })
  group.scrollTo = vi.fn() as any
  group.scrollBy = vi.fn() as any
  group.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    width: 100,
    height: 100,
    toJSON() {},
  })
  document.body.appendChild(group)
  return () => {
    group.remove()
  }
}

function createCarousel(ctx: Record<string, unknown> = {}) {
  const id = 'carousel-test'
  return machine({
    id,
    slideCount: 5,
    getRootNode: () => document,
    ...ctx,
  } as any)
}

describe('carousel controllable page (Phase 1)', () => {
  const services: Array<ReturnType<typeof machine>> = []
  const cleanups: Array<() => void> = []

  afterEach(async () => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore
      }
    }
    // flush entry/watch microtasks that touch DOM
    await Promise.resolve()
    await Promise.resolve()
    while (cleanups.length)
      cleanups.pop()?.()
  })

  function start(ctx: Record<string, unknown> = {}) {
    cleanups.push(installCarouselDom('carousel-test'))
    const service = createCarousel(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultPage seeds page', () => {
    const service = start({ defaultPage: 2 })
    expect(service.state.context.page).toBe(2)
  })

  it('uncontrolled: legacy page seed (compat)', () => {
    const service = start({ page: 1 })
    expect(service.state.context.page).toBe(1)
  })

  it('uncontrolled: neither starts 0', () => {
    const service = start({})
    expect(service.state.context.page).toBe(0)
  })

  it('uncontrolled: defaultPage preferred over page seed', () => {
    const service = start({ defaultPage: 2, page: 0 })
    expect(service.state.context.page).toBe(2)
  })

  it('legacy: page alone still mutates on PAGE.SET', () => {
    const onPageChange = vi.fn()
    const service = start({ page: 0, onPageChange })
    service.send({ type: 'PAGE.SET', index: 2 })
    expect(service.state.context.page).toBe(2)
    expect(onPageChange).toHaveBeenCalled()
    expect(onPageChange.mock.calls[0][0].page).toBe(2)
  })

  it('controlled: page.controlled defers until parent syncs', () => {
    const onPageChange = vi.fn()
    const service = start({
      'page': 0,
      'page.controlled': true,
      onPageChange,
    })
    service.send({ type: 'PAGE.SET', index: 3 })
    expect(service.state.context.page).toBe(0)
    expect(onPageChange.mock.calls[0][0].page).toBe(3)
    service.setContext({ page: 3 })
    expect(service.state.context.page).toBe(3)
  })

  it('connect scrollTo still sends PAGE.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.scrollTo(1)
    expect(service.state.context.page).toBe(1)
  })
})
