// Native companion: use fixture-owned nodes without changing the original source fixture.
import { describe, expect, it } from 'vitest'
import { flush, setup } from './splitter.native-test-helper'

const limits = [
  { before: { minSize: 0, maxSize: 30 }, after: { minSize: 0, maxSize: 80 } },
  { before: { minSize: 10, maxSize: 80 }, after: { minSize: 50, maxSize: 80 } },
  { before: { minSize: 20, maxSize: 20 }, after: { minSize: 60, maxSize: 60 } },
]
describe('splitter feasible constraint conservation', () => {
  it.each([
    { orientation: 'horizontal', dir: 'ltr' },
    { orientation: 'horizontal', dir: 'rtl' },
    { orientation: 'vertical', dir: 'ltr' },
    { orientation: 'vertical', dir: 'rtl' },
  ] as const)('preserves an adjacent pair and its sibling for %j', async (axis) => {
    for (const bounds of limits) {
      const { service } = setup({ ...axis, defaultSize: [
        { id: 'a', size: 20 },
        { id: 'b', size: 20, ...bounds.before },
        { id: 'c', size: 60, ...bounds.after },
      ] })
      service.send({ type: 'FOCUS', id: 'b:c' })
      service.send({ type: 'POINTER_DOWN', id: 'b:c', point: { x: 500, y: 500 } })
      for (const delta of [-2000, -50, 0, 50, 2000, 0]) {
        const sign = axis.orientation === 'horizontal' && axis.dir === 'rtl' ? -1 : 1
        const point = axis.orientation === 'horizontal' ? { x: 500 + delta * sign, y: 500 } : { x: 500, y: 500 + delta }
        service.send({ type: 'POINTER_MOVE', point })
        await flush()
        const sizes = service.state.context.size!.map(panel => panel.size!)
        const min = Math.max(bounds.before.minSize, 80 - bounds.after.maxSize)
        const max = Math.min(bounds.before.maxSize, 80 - bounds.after.minSize)
        const expectedBefore = Math.max(min, Math.min(max, 20 + delta / 10))
        expect(sizes).toEqual([20, expectedBefore, 80 - expectedBefore])
        expect(sizes[1] + sizes[2]).toBe(80)
        expect(sizes[1]).toBeGreaterThanOrEqual(bounds.before.minSize)
        expect(sizes[1]).toBeLessThanOrEqual(bounds.before.maxSize)
        expect(sizes[2]).toBeGreaterThanOrEqual(bounds.after.minSize)
        expect(sizes[2]).toBeLessThanOrEqual(bounds.after.maxSize)
      }
      service.send({ type: 'POINTER_UP' })
      service.stop()
    }
  })
})
