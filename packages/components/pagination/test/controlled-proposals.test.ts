import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

const services: Array<ReturnType<typeof machine>> = []

function start(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'pagination-proposals', count: 100, ...context }).start()
  services.push(service)
  return service
}

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
})

describe('pagination controlled proposals', () => {
  it('repeats a rejected next-page proposal from the last accepted page', () => {
    const onPageChange = vi.fn()
    const service = start({ page: 2, onPageChange })

    service.send('NEXT_PAGE')
    service.send('NEXT_PAGE')
    expect(service.state.context.page).toBe(2)
    expect(onPageChange.mock.calls).toEqual([[{ page: 3, pageSize: 10 }], [{ page: 3, pageSize: 10 }]])

    service.setContext({ page: 3 })
    expect(onPageChange).toHaveBeenCalledTimes(2)
    service.send('NEXT_PAGE')
    expect(onPageChange).toHaveBeenLastCalledWith({ page: 4, pageSize: 10 })
    expect(service.state.context.page).toBe(3)
  })

  it('accepts a proposal synchronously without echoing its callback', () => {
    const accepted: number[] = []
    const service = start({
      page: 1,
      onPageChange({ page }) {
        accepted.push(page)
        service.setContext({ page })
      },
    })

    service.send('NEXT_PAGE')
    service.send('NEXT_PAGE')
    expect(accepted).toEqual([2, 3])
    expect(service.state.context.page).toBe(3)
  })

  it('keeps page and pageSize proposals separate until each controlled value is accepted', async () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    const service = start({ page: 8, pageSize: 10, onPageChange, onPageSizeChange })

    service.send({ type: 'SET_PAGE_SIZE', size: 25 })
    await Promise.resolve()
    expect(service.state.context.pageSize).toBe(10)
    expect(service.state.context.page).toBe(8)
    expect(onPageSizeChange).toHaveBeenCalledExactlyOnceWith({ pageSize: 25 })
    expect(onPageChange).not.toHaveBeenCalled()

    service.setContext({ pageSize: 25 })
    await Promise.resolve()
    expect(service.state.context.pageSize).toBe(25)
    expect(service.state.context.page).toBe(8)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 25 })
    expect(onPageSizeChange).toHaveBeenCalledTimes(1)

    service.setContext({ page: 1 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(onPageChange).toHaveBeenCalledTimes(1)
  })

  it('does not emit an intermediate reset when parent page and size arrive together', async () => {
    const onPageChange = vi.fn()
    const service = start({ page: 8, pageSize: 10, onPageChange })

    service.setContext({ pageSize: 25, page: 2 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(2)
    expect(service.state.context.pageSize).toBe(25)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('coalesces parent size changes before deciding whether to propose a page reset', async () => {
    const onPageChange = vi.fn()
    const service = start({ page: 8, pageSize: 10, onPageChange })

    service.setContext({ pageSize: 25 })
    service.setContext({ pageSize: 5 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(8)
    expect(service.state.context.pageSize).toBe(5)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('mutates only the uncontrolled page when a controlled size is accepted', async () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    const service = start({ defaultPage: 8, pageSize: 10, onPageChange, onPageSizeChange })

    service.send({ type: 'SET_PAGE_SIZE', size: 25 })
    expect(service.state.context.page).toBe(8)
    expect(service.state.context.pageSize).toBe(10)
    service.setContext({ pageSize: 25 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 25 })
    expect(onPageSizeChange).toHaveBeenCalledTimes(1)
  })

  it('keeps a controlled page unchanged when an uncontrolled size invalidates it', async () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    const service = start({ page: 8, defaultPageSize: 10, onPageChange, onPageSizeChange })

    service.send({ type: 'SET_PAGE_SIZE', size: 25 })
    await Promise.resolve()
    expect(service.state.context.pageSize).toBe(25)
    expect(service.state.context.page).toBe(8)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 25 })
    expect(onPageSizeChange).toHaveBeenCalledExactlyOnceWith({ pageSize: 25 })
  })

  it('retains machine-layer presence ownership when the initial page is explicitly undefined', () => {
    const onPageChange = vi.fn()
    const service = start({ page: undefined, onPageChange })

    service.send('NEXT_PAGE')
    expect(service.state.context.page).toBe(1)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 })
  })

  it('does not infer controlled ownership from a later unstamped context patch', () => {
    const onPageChange = vi.fn()
    const service = start({ defaultPage: 1, onPageChange })

    service.setContext({ page: 2 })
    service.send('NEXT_PAGE')
    expect(service.state.context.page).toBe(3)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 3, pageSize: 10 })
  })

  it('drops pending reset proposals on stop and installs one fresh watcher on restart', async () => {
    const onPageChange = vi.fn()
    const service = start({ page: 8, pageSize: 10, onPageChange })

    service.setContext({ pageSize: 25 })
    service.stop()
    await Promise.resolve()
    expect(onPageChange).not.toHaveBeenCalled()

    service.start()
    service.setContext({ pageSize: 50 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(8)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 50 })
  })
})

describe('pagination count changes', () => {
  it.each([false, true])('resets an out-of-range page using the new page count (controlled: %s)', (controlled) => {
    const onPageChange = vi.fn()
    const service = start({ ...(controlled ? { page: 5 } : { defaultPage: 5 }), defaultPageSize: 10, onPageChange })

    service.send({ type: 'SET_COUNT', count: 20 })
    expect(service.state.context.count).toBe(20)
    expect(service.state.context.totalPages).toBe(2)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 10 })
    expect(service.state.context.page).toBe(controlled ? 5 : 1)

    if (controlled) {
      service.setContext({ page: 1 })
      expect(service.state.context.page).toBe(1)
      expect(onPageChange).toHaveBeenCalledTimes(1)
    }
  })

  it.each([20, 100, 200])('keeps a page that still fits when item count becomes %s', (count) => {
    const onPageChange = vi.fn()
    const service = start({ defaultPage: 2, defaultPageSize: 10, onPageChange })

    service.send({ type: 'SET_COUNT', count })
    expect(service.state.context.page).toBe(2)
    expect(service.state.context.count).toBe(count)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it.each([false, true])('uses the first-page sentinel instead of page zero when count becomes zero (controlled: %s)', (controlled) => {
    const onPageChange = vi.fn()
    const service = start({ ...(controlled ? { page: 5 } : { defaultPage: 5 }), onPageChange })

    service.send({ type: 'SET_COUNT', count: 0 })
    expect(service.state.context.totalPages).toBe(0)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 1, pageSize: 10 })
    expect(service.state.context.page).toBe(controlled ? 5 : 1)
  })

  it('keeps empty pagination on page one without spurious first/last/reset callbacks', async () => {
    const onPageChange = vi.fn()
    const service = start({ count: 0, onPageChange })

    service.send('FIRST_PAGE')
    service.send('LAST_PAGE')
    service.send({ type: 'SET_COUNT', count: 0 })
    service.send({ type: 'SET_PAGE_SIZE', size: 20 })
    await Promise.resolve()
    expect(service.state.context.page).toBe(1)
    expect(service.state.context.totalPages).toBe(0)
    expect(onPageChange).not.toHaveBeenCalled()
  })
})
