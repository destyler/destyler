import { describe, expect, it } from 'vitest'
import { createRect, expand, inset, shrink } from '../index'

function expectedRect(x: number, y: number, width: number, height: number) {
  return {
    x,
    y,
    width,
    height,
    minX: x,
    maxX: x + width,
    midX: x + width / 2,
    minY: y,
    maxY: y + height,
    midY: y + height / 2,
    center: { x: x + width / 2, y: y + height / 2 },
  }
}

describe('numeric shrink', () => {
  const source = createRect({ x: -10, y: 20, width: 80, height: 60 })

  it.each([
    { amount: 5, x: -5, y: 25, width: 70, height: 50 },
    { amount: 2.5, x: -7.5, y: 22.5, width: 75, height: 55 },
    { amount: 0, x: -10, y: 20, width: 80, height: 60 },
    { amount: -2.5, x: -12.5, y: 17.5, width: 85, height: 65 },
    { amount: -5, x: -15, y: 15, width: 90, height: 70 },
  ])('insets every edge by $amount and recomputes all derived geometry', ({ amount, x, y, width, height }) => {
    expect(shrink(source, amount)).toStrictEqual(expectedRect(x, y, width, height))
  })

  it.each([5, 2.5, 0, -2.5, -5])('agrees with an equal symmetric inset of %s', (amount) => {
    expect(shrink(source, amount)).toStrictEqual(inset(source, { dx: amount, dy: amount }))
    expect(shrink(source, amount)).toStrictEqual(shrink(source, { dx: amount, dy: amount }))
  })

  it.each([5, 2.5, 0, -2.5, -5])('is the inverse of numeric expand for %s', (amount) => {
    expect(shrink(expand(source, amount), amount)).toStrictEqual(source)
    expect(expand(shrink(source, amount), amount)).toStrictEqual(source)
    expect(shrink(source, amount)).toStrictEqual(expand(source, -amount))
  })

  it('leaves existing directional symmetric shrink behavior intact', () => {
    expect(shrink(source, { dx: 5 })).toStrictEqual(expectedRect(-5, 20, 70, 60))
    expect(shrink(source, { dy: 2.5 })).toStrictEqual(expectedRect(-10, 22.5, 80, 55))
  })

  it('does not mutate its input rectangle or symmetric inset', () => {
    const frozenSource = Object.freeze({ ...source, center: Object.freeze({ ...source.center }) })
    const symmetric = Object.freeze({ dx: 5, dy: 2.5 })
    const numericResult = shrink(frozenSource, 5)
    const symmetricResult = shrink(frozenSource, symmetric)

    expect(numericResult).not.toBe(frozenSource)
    expect(numericResult.center).not.toBe(frozenSource.center)
    expect(symmetricResult).toStrictEqual(expectedRect(-5, 22.5, 70, 55))
    expect(frozenSource).toStrictEqual(expectedRect(-10, 20, 80, 60))
    expect(symmetric).toStrictEqual({ dx: 5, dy: 2.5 })
  })
})
