import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(props => props)
const services: Array<ReturnType<typeof machine>> = []

function start(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'pagination-bounds', count: 100, ...context }).start()
  services.push(service)
  return service
}

function api(service: ReturnType<typeof machine>) {
  return connect(service.getState(), service.send, normalize)
}

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
})

describe('pagination navigation boundaries', () => {
  it.each(['button', 'link'] as const)('marks both empty navigation triggers disabled (%s)', (type) => {
    const onPageChange = vi.fn()
    const service = start({ count: 0, type, onPageChange })
    const value = api(service)

    expect(value.pages).toEqual([])
    expect(value.previousPage).toBeNull()
    expect(value.nextPage).toBeNull()
    expect(value.getPrevTriggerProps()['data-disabled']).toBe('')
    expect(value.getNextTriggerProps()['data-disabled']).toBe('')
    if (type === 'button') {
      expect(value.getPrevTriggerProps().disabled).toBe(true)
      expect(value.getNextTriggerProps().disabled).toBe(true)
    }

    value.goToPrevPage()
    value.goToNextPage()
    expect(onPageChange).not.toHaveBeenCalled()
    expect(service.state.context.page).toBe(1)
  })

  it('disables empty navigation while the parent still owns an old page', () => {
    const onPageChange = vi.fn()
    const service = start({ page: 5, onPageChange })
    service.setContext({ count: 0 })
    const value = api(service)

    expect(value.page).toBe(5)
    expect(value.previousPage).toBeNull()
    expect(value.nextPage).toBeNull()
    expect(value.getPrevTriggerProps().disabled).toBe(true)
    expect(value.getNextTriggerProps().disabled).toBe(true)
    value.goToPrevPage()
    value.goToNextPage()
    expect(service.state.context.page).toBe(5)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it.each([
    { page: 1, previous: null, next: 2 },
    { page: 5, previous: 4, next: 6 },
    { page: 10, previous: 9, next: null },
  ])('matches available neighbors at page $page', ({ page, previous, next }) => {
    const service = start({ defaultPage: page })
    const value = api(service)

    expect(value.previousPage).toBe(previous)
    expect(value.nextPage).toBe(next)
    expect(value.getPrevTriggerProps().disabled).toBe(previous === null)
    expect(value.getNextTriggerProps().disabled).toBe(next === null)
  })

  it('exposes the same previous-page candidate that a bounded proposal will request', () => {
    const onPageChange = vi.fn()
    const service = start({ page: 8, onPageChange })
    service.setContext({ count: 25 })
    const value = api(service)

    expect(value.totalPages).toBe(3)
    expect(value.page).toBe(8)
    expect(value.previousPage).toBe(3)
    expect(value.nextPage).toBeNull()
    expect(value.getNextTriggerProps().disabled).toBe(true)
    value.goToPrevPage()
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: value.previousPage, pageSize: 10 })
    expect(service.state.context.page).toBe(8)

    service.setContext({ page: 3 })
    const accepted = api(service)
    expect(accepted.previousPage).toBe(2)
    expect(accepted.nextPage).toBeNull()
    expect(onPageChange).toHaveBeenCalledTimes(1)
  })

  it('enables next navigation again when an empty collection receives items', () => {
    const service = start({ count: 0 })
    expect(api(service).getNextTriggerProps().disabled).toBe(true)

    service.setContext({ count: 20 })
    const value = api(service)
    expect(value.getPrevTriggerProps().disabled).toBe(true)
    expect(value.getNextTriggerProps().disabled).toBe(false)
    expect(value.nextPage).toBe(2)
    value.goToNextPage()
    expect(service.state.context.page).toBe(2)
  })
})

it.each([
  { page: 1.5, previous: 1, next: 2.5 },
  { page: 9.5, previous: 8.5, next: 10 },
])('advertises the same clamped neighbor that navigation proposes at page $page', ({ page, previous, next }) => {
  const onPageChange = vi.fn()
  const service = start({ page, onPageChange })
  const value = api(service)

  expect(value.previousPage).toBe(previous)
  expect(value.nextPage).toBe(next)
  value.goToPrevPage()
  expect(onPageChange).toHaveBeenLastCalledWith({ page: previous, pageSize: 10 })
  value.goToNextPage()
  expect(onPageChange).toHaveBeenLastCalledWith({ page: next, pageSize: 10 })
  expect(service.state.context.page).toBe(page)
})
