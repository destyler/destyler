import type { HAlign, VAlign } from '../index'
import { describe, expect, it } from 'vitest'
import { alignRect, containsPoint, createRect, getRectCorners } from '../index'

const horizontal: [HAlign, number][] = [
  ['left-inside', 100],
  ['left-outside', 60],
  ['center', 125],
  ['right-inside', 150],
  ['right-outside', 190],
]
const vertical: [VAlign, number][] = [
  ['top-inside', 200],
  ['top-outside', 180],
  ['center', 220],
  ['bottom-inside', 240],
  ['bottom-outside', 260],
]

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

describe('alignRect', () => {
  const source = createRect({ x: -60, y: -30, width: 40, height: 20 })
  const reference = createRect({ x: 100, y: 200, width: 90, height: 60 })

  it.each(horizontal.flatMap(([h, x]) => vertical.map(([v, y]) => ({ h, v, x, y }))))(
    'aligns unequal rectangles at $h / $v with consistent bounds and center',
    ({ h, v, x, y }) => {
      expect(alignRect(source, reference, { h, v })).toStrictEqual(expectedRect(x, y, 40, 20))
    },
  )

  it.each<{ h: HAlign, v: VAlign, x: number, y: number }>([
    { h: 'left-inside', v: 'top-inside', x: 25.5, y: -60.25 },
    { h: 'left-outside', v: 'top-outside', x: -95, y: -140.75 },
    { h: 'center', v: 'center', x: -19.5, y: -90.25 },
    { h: 'right-inside', v: 'bottom-inside', x: -64.5, y: -120.25 },
    { h: 'right-outside', v: 'bottom-outside', x: 56, y: -39.75 },
  ])('preserves fractional geometry when the source is larger at $h / $v', ({ h, v, x, y }) => {
    const large = createRect({ x: -3.25, y: 10.5, width: 120.5, height: 80.5 })
    const small = createRect({ x: 25.5, y: -60.25, width: 30.5, height: 20.5 })
    expect(alignRect(large, small, { h, v })).toStrictEqual(expectedRect(x, y, 120.5, 80.5))
  })

  it('does not mutate either rectangle or its center', () => {
    const frozenSource = Object.freeze({ ...source, center: Object.freeze({ ...source.center }) })
    const frozenReference = Object.freeze({ ...reference, center: Object.freeze({ ...reference.center }) })
    const result = alignRect(frozenSource, frozenReference, { h: 'center', v: 'center' })

    expect(result).not.toBe(frozenSource)
    expect(result.center).not.toBe(frozenSource.center)
    expect(result.center).not.toBe(frozenReference.center)
    expect(frozenSource).toStrictEqual(expectedRect(-60, -30, 40, 20))
    expect(frozenReference).toStrictEqual(expectedRect(100, 200, 90, 60))
  })

  it('returns bounds that can be consumed by containment, corners, and further alignment', () => {
    const first = alignRect(source, reference, { h: 'right-outside', v: 'bottom-outside' })
    expect(containsPoint(first, { x: 210, y: 270 })).toBe(true)
    expect(containsPoint(first, { x: -40, y: -20 })).toBe(false)
    expect(getRectCorners(first)).toStrictEqual({
      top: { x: 190, y: 260 },
      right: { x: 230, y: 260 },
      bottom: { x: 230, y: 280 },
      left: { x: 190, y: 280 },
    })
    const next = createRect({ x: 0, y: 0, width: 10, height: 6 })
    expect(alignRect(next, first, { h: 'center', v: 'center' })).toStrictEqual(expectedRect(205, 267, 10, 6))
  })

  it('keeps an already aligned rectangle stable across repeated alignment', () => {
    const first = alignRect(source, reference, { h: 'center', v: 'center' })
    const second = alignRect(first, reference, { h: 'center', v: 'center' })
    expect(second).toStrictEqual(expectedRect(125, 220, 40, 20))
    expect(second).toStrictEqual(first)
    expect(alignRect(reference, reference, { h: 'center', v: 'center' })).toStrictEqual(reference)
  })
})
