import { normalizeProps, spreadProps } from '@destyler/vanilla'
import { expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

it('updates native navigation buttons as a controlled collection empties and refills', () => {
  const onPageChange = vi.fn()
  const service = machine({
    id: 'pagination-native-boundaries',
    count: 0,
    page: 1,
    onPageChange(details) {
      onPageChange(details)
      service.setContext({ page: details.page })
    },
  }).start()
  const root = document.createElement('nav')
  const previous = document.createElement('button')
  const next = document.createElement('button')
  root.append(previous, next)
  document.body.appendChild(root)
  const update = () => {
    const api = connect(service.getState(), service.send, normalizeProps)
    spreadProps(previous, api.getPrevTriggerProps())
    spreadProps(next, api.getNextTriggerProps())
  }

  try {
    update()
    expect(previous.disabled).toBe(true)
    expect(next.disabled).toBe(true)
    previous.click()
    next.click()
    expect(onPageChange).not.toHaveBeenCalled()

    service.setContext({ count: 30 })
    update()
    expect(previous.disabled).toBe(true)
    expect(next.disabled).toBe(false)
    next.click()
    expect(service.state.context.page).toBe(2)
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 })
    update()
    expect(previous.disabled).toBe(false)
    expect(next.disabled).toBe(false)

    service.setContext({ count: 0 })
    update()
    expect(previous.disabled).toBe(true)
    expect(next.disabled).toBe(true)
    previous.click()
    next.click()
    expect(service.state.context.page).toBe(2)
    expect(onPageChange).toHaveBeenCalledTimes(1)
  }
  finally {
    service.stop()
    root.remove()
  }
})
