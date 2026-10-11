import { describe, expect, it } from 'vitest'
import { parse } from '../index'

describe('timer duration parsing', () => {
  it.each([0, 1, 250, 1000])('accepts milliseconds-only durations (%i)', (milliseconds) => {
    expect(parse({ milliseconds })).toBe(milliseconds)
  })

  it.each([
    [{ days: 1 }, 86_400_000],
    [{ hours: 1 }, 3_600_000],
    [{ minutes: 1 }, 60_000],
    [{ seconds: 1 }, 1000],
    [{ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }, 93_784_005],
    [{ seconds: 0, milliseconds: 250 }, 250],
  ] as const)('preserves conversion of existing duration fields (%j)', (duration, expected) => {
    expect(parse(duration)).toBe(expected)
  })

  it.each([-250, 1.5])('preserves existing mixed-field arithmetic for %s milliseconds', (milliseconds) => {
    expect(parse({ milliseconds })).toBe(parse({ seconds: 0, milliseconds }))
  })

  it('does not depend on field order or mutate its input', () => {
    const duration = Object.freeze({ milliseconds: 250, seconds: 1 })
    expect(parse(duration)).toBe(parse({ seconds: 1, milliseconds: 250 }))
    expect(duration).toEqual({ milliseconds: 250, seconds: 1 })
  })

  it('preserves date-string parsing', () => {
    expect(parse('2021-01-01T12:00:00Z')).toBe(1609502400000)
  })

  it('continues rejecting an object with no time parts', () => {
    expect(() => parse({})).toThrow('Invalid date')
  })
})
