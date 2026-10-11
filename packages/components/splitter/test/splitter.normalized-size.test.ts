// @vitest-environment happy-dom
import type { Context, Service } from '../index'
import { useService } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../index'

const services: Service[] = []

function start(context: Omit<Context, 'id'> = {}) {
  const service = machine({ id: 'normalized-size', ...context })
  services.push(service)
  useService({}, service)
  return service
}

async function flush() {
  for (let i = 0; i < 6; i++)
    await Promise.resolve()
}

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
})

describe('splitter normalized size invariant', () => {
  it.each([
    { name: 'omitted size', context: {} },
    { name: 'own undefined size', context: { size: undefined } },
  ])('normalizes $name to an empty panel array', ({ context }) => {
    const service = start(context)

    expect(service.state.context.size).toEqual([])
    expect(service.state.context.panels).toEqual([])
    expect(service.state.context.previousPanels).toEqual([])
    expect(service.state.context.initialSize).toEqual([])
  })

  it('distributes unspecified panel sizes and keeps default sizes uncontrolled', async () => {
    const defaultSize = [{ id: 'a', size: 30, minSize: 10, maxSize: 70 }, { id: 'b' }]
    const onSizeChange = vi.fn()
    const service = start({ defaultSize, onSizeChange })

    expect(service.state.context.panels).toEqual([
      { id: 'a', size: 30, minSize: 10, maxSize: 70, start: 0, end: 30, remainingSize: 20 },
      { id: 'b', size: 70, minSize: 0, maxSize: 100, start: 30, end: 100, remainingSize: 70 },
    ])
    expect(onSizeChange).not.toHaveBeenCalled()

    service.send({ type: 'SET_PANEL_SIZE', id: 'a', size: 40 })
    await flush()

    expect(service.state.context.size).toEqual([{ ...defaultSize[0], size: 40 }, { id: 'b' }])
    expect(service.state.context.panels.map(panel => panel.size)).toEqual([40, 60])
    expect(onSizeChange).toHaveBeenCalledOnce()
    expect(defaultSize).toEqual([{ id: 'a', size: 30, minSize: 10, maxSize: 70 }, { id: 'b' }])
  })

  it('keeps an own undefined size controlled when defaultSize supplies the initial panels', async () => {
    const defaultSize = [{ id: 'a', size: 30 }, { id: 'b', size: 70 }]
    const onSizeChange = vi.fn()
    const service = start({ size: undefined, defaultSize, onSizeChange })

    service.send({ type: 'FOCUS', id: 'a:b' })
    service.send({ type: 'ARROW_RIGHT', step: 5 })

    expect(onSizeChange).toHaveBeenCalledExactlyOnceWith({
      size: [{ id: 'a', size: 35 }, { id: 'b', size: 65 }],
      activeHandleId: 'a:b',
    })
    expect(service.state.context.size).toEqual(defaultSize)
    expect(service.state.context.panels.map(panel => panel.size)).toEqual([30, 70])

    service.setContext({ size: [{ id: 'a', size: 35 }, { id: 'b', size: 65 }] })
    await flush()

    expect(service.state.context.panels.map(panel => panel.size)).toEqual([35, 65])
    expect(service.state.context.previousPanels.map(panel => panel.size)).toEqual([35, 65])
    expect(onSizeChange).toHaveBeenCalledOnce()
  })

  it('prefers defaultSize initially and uses parent synchronization for later controlled proposals', async () => {
    const defaultSize = [{ id: 'a', size: 30 }, { id: 'b', size: 70 }]
    const size = [{ id: 'a', size: 40 }, { id: 'b', size: 60 }]
    const onSizeChange = vi.fn()
    const service = start({ defaultSize, size, onSizeChange })

    expect(service.state.context.size).toEqual(defaultSize)
    expect(service.state.context.panels.map(panel => panel.size)).toEqual([30, 70])

    service.send({ type: 'FOCUS', id: 'a:b' })
    service.send({ type: 'ARROW_RIGHT', step: 1 })
    expect(onSizeChange).toHaveBeenNthCalledWith(1, {
      size: [{ id: 'a', size: 31 }, { id: 'b', size: 69 }],
      activeHandleId: 'a:b',
    })
    expect(service.state.context.size).toEqual(defaultSize)

    service.setContext({ size })
    await flush()
    service.send({ type: 'ARROW_RIGHT', step: 1 })

    expect(onSizeChange).toHaveBeenNthCalledWith(2, {
      size: [{ id: 'a', size: 41 }, { id: 'b', size: 59 }],
      activeHandleId: 'a:b',
    })
    expect(onSizeChange).toHaveBeenCalledTimes(2)
    expect(service.state.context.size).toEqual(size)
    expect(service.state.context.panels.map(panel => panel.size)).toEqual([40, 60])
  })

  it.each(['defaultSize', 'size'] as const)('preserves a normalized %s value through an undefined context patch', async (key) => {
    const size = [{ id: 'a', size: 25 }, { id: 'b', size: 75 }]
    const onSizeChange = vi.fn()
    const service = start({ [key]: size, onSizeChange })
    const previousSize = service.state.context.size
    const previousPanels = service.state.context.panels

    service.setContext({ size: undefined })
    await flush()

    expect(service.state.context.size).toBe(previousSize)
    expect(service.state.context.panels).toEqual(previousPanels)
    expect(service.state.context.panels.map(panel => panel.size)).toEqual([25, 75])
    expect(onSizeChange).not.toHaveBeenCalled()
  })

  it('rejects a context corrupted after construction instead of inventing empty panels', () => {
    const service = machine({ id: 'invalid-normalized-size' })
    service.state.context.size = undefined

    expect(() => service.state.context.panels).toThrow(TypeError)
  })
})
