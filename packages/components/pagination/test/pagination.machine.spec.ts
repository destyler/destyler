import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createPagination(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'pagination-test',
    count: 100,
    ...ctx,
  } as any)
}

describe('pagination controllable page (Phase 3)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = createPagination(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultPage seeds page', () => {
    const service = start({ defaultPage: 3 })
    expect(service.state.context.page).toBe(3)
  })

  it('uncontrolled: legacy page seed (compat)', () => {
    const service = start({ page: 4 })
    expect(service.state.context.page).toBe(4)
  })

  it('uncontrolled: neither starts page 1 / pageSize 10', () => {
    const service = start({})
    expect(service.state.context.page).toBe(1)
    expect(service.state.context.pageSize).toBe(10)
  })

  it('uncontrolled: defaultPage preferred over page seed', () => {
    const service = start({ defaultPage: 2, page: 5 })
    expect(service.state.context.page).toBe(2)
  })

  it('uncontrolled: defaultPageSize seeds pageSize', () => {
    const service = start({ defaultPageSize: 25 })
    expect(service.state.context.pageSize).toBe(25)
  })

  it('phase 3 presence: page alone (no flag) defers mutation until parent syncs', () => {
    const onPageChange = vi.fn()
    const service = start({ page: 1, onPageChange })
    service.send({ type: 'SET_PAGE', page: 3 })
    expect(service.state.context.page).toBe(1)
    expect(onPageChange).toHaveBeenCalledWith({ page: 3, pageSize: 10 })

    service.setContext({ page: 3 })
    expect(service.state.context.page).toBe(3)
  })

  it('controlled: page presence defers until parent syncs', () => {
    const onPageChange = vi.fn()
    const service = start({
      page: 1,
      onPageChange,
    })
    service.send({ type: 'SET_PAGE', page: 4 })
    expect(service.state.context.page).toBe(1)
    expect(onPageChange).toHaveBeenCalledWith({ page: 4, pageSize: 10 })
    service.setContext({ page: 4 })
    expect(service.state.context.page).toBe(4)
  })

  it('controlled: pageSize presence defers until parent syncs', () => {
    const onPageSizeChange = vi.fn()
    const service = start({
      pageSize: 10,
      onPageSizeChange,
    })
    service.send({ type: 'SET_PAGE_SIZE', size: 20 })
    expect(service.state.context.pageSize).toBe(10)
    expect(onPageSizeChange).toHaveBeenCalledWith({ pageSize: 20 })
    service.setContext({ pageSize: 20 })
    expect(service.state.context.pageSize).toBe(20)
  })

  it('connect setPage still sends SET_PAGE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setPage(2)
    expect(service.state.context.page).toBe(2)
  })
})
