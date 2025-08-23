import { describe, expect, it } from 'vitest'
import {
  clampPercent,
  clampValue,
  decrementValue,
  getClosestValue,
  getClosestValueIndex,
  getPercentValue,
  getValuePercent,
  incrementValue,
  isNaN,
  isValueAtMax,
  isValueAtMin,
  isValueWithinRange,
  mod,
  nan,
  roundToStepPrecision,
  roundValue,
  setValueAtIndex,
  snapValueToStep,
  toFixedNumber,
  wrap,
} from '../index'

describe('number', () => {
  it('increment', () => {
    expect(incrementValue(1.123, 0.004)).toBe(1.127)
    expect(incrementValue(12.01, 0.04)).toBe(12.05)
    expect(incrementValue(12.05, 0.05)).toBe(12.1)
    expect(incrementValue(0, 1)).toBe(1)
    expect(incrementValue(-5, 3)).toBe(-2)
  })

  it('decrement', () => {
    expect(decrementValue(12.015, 0.004)).toBe(12.011)
    expect(decrementValue(5, 2)).toBe(3)
    expect(decrementValue(1.5, 0.5)).toBe(1)
    expect(decrementValue(-2, 3)).toBe(-5)
  })

  describe('isNaN', () => {
    it('should detect NaN values', () => {
      expect(isNaN(Number.NaN)).toBe(true)
      expect(isNaN(Number.NaN)).toBe(true)
      expect(isNaN(0)).toBe(false)
      expect(isNaN(1.5)).toBe(false)
      expect(isNaN(-10)).toBe(false)
    })
  })

  describe('nan', () => {
    it('should convert NaN to 0', () => {
      expect(nan(Number.NaN)).toBe(0)
      expect(nan(5)).toBe(5)
      expect(nan(-3.14)).toBe(-3.14)
      expect(nan(0)).toBe(0)
    })
  })

  describe('mod', () => {
    it('should compute modulo correctly', () => {
      expect(mod(5, 3)).toBe(2)
      expect(mod(-5, 3)).toBe(1)
      expect(mod(7, 7)).toBe(0)
      expect(mod(2.5, 1)).toBe(0.5)
    })
  })

  describe('wrap', () => {
    it('should wrap values correctly', () => {
      expect(wrap(5, 3)).toBe(2)
      expect(wrap(-1, 5)).toBe(4)
      expect(wrap(10, 10)).toBe(0)
      expect(wrap(0, 5)).toBe(0)
    })
  })

  describe('clampValue', () => {
    it('should clamp values to range', () => {
      expect(clampValue(5, 0, 10)).toBe(5)
      expect(clampValue(-5, 0, 10)).toBe(0)
      expect(clampValue(15, 0, 10)).toBe(10)
      expect(clampValue(7.5, 5, 8)).toBe(7.5)
    })
  })

  describe('clampPercent', () => {
    it('should clamp to 0-1 range', () => {
      expect(clampPercent(0.5)).toBe(0.5)
      expect(clampPercent(-0.5)).toBe(0)
      expect(clampPercent(1.5)).toBe(1)
      expect(clampPercent(0)).toBe(0)
      expect(clampPercent(1)).toBe(1)
    })
  })

  describe('getValuePercent', () => {
    it('should calculate percentage correctly', () => {
      expect(getValuePercent(5, 0, 10)).toBe(0.5)
      expect(getValuePercent(0, 0, 10)).toBe(0)
      expect(getValuePercent(10, 0, 10)).toBe(1)
      expect(getValuePercent(25, 20, 30)).toBe(0.5)
    })
  })

  describe('getPercentValue', () => {
    it('should convert percentage to value', () => {
      expect(getPercentValue(0.5, 0, 10, 1)).toBe(5)
      expect(getPercentValue(0, 0, 10, 1)).toBe(0)
      expect(getPercentValue(1, 0, 10, 1)).toBe(10)
      expect(getPercentValue(0.25, 0, 100, 5)).toBe(25)
    })
  })

  describe('roundToStepPrecision', () => {
    it('should round to step precision', () => {
      expect(roundToStepPrecision(1.123456, 0.01)).toBe(1.123)
      expect(roundToStepPrecision(5.789, 0.1)).toBe(5.79)
      expect(roundToStepPrecision(10.5, 1)).toBe(10.5)
    })
  })

  describe('snapValueToStep', () => {
    it('should snap value to nearest step', () => {
      expect(snapValueToStep(5.3, 0, 10, 1)).toBe(5)
      expect(snapValueToStep(5.7, 0, 10, 1)).toBe(6)
      expect(snapValueToStep(2.25, 0, 10, 0.5)).toBe(2.5)
      expect(snapValueToStep(-1, 0, 10, 1)).toBe(0)
    })
  })

  describe('setValueAtIndex', () => {
    it('should update value at index', () => {
      expect(setValueAtIndex([1, 2, 3], 1, 5)).toEqual([1, 5, 3])
      expect(setValueAtIndex([1, 2, 3], 0, 0)).toEqual([0, 2, 3])
      expect(setValueAtIndex([1, 2, 3], 2, 10)).toEqual([1, 2, 10])
    })

    it('should return same array if value unchanged', () => {
      const arr = [1, 2, 3]
      expect(setValueAtIndex(arr, 1, 2)).toBe(arr)
    })
  })

  describe('getClosestValueIndex', () => {
    it('should find closest value index', () => {
      expect(getClosestValueIndex([1, 3, 5, 7], 4)).toBe(2)
      expect(getClosestValueIndex([1, 3, 5, 7], 6)).toBe(3)
      expect(getClosestValueIndex([1, 3, 5, 7], 0)).toBe(0)
      expect(getClosestValueIndex([1, 3, 5, 7], 10)).toBe(3)
    })
  })

  describe('getClosestValue', () => {
    it('should find closest value', () => {
      expect(getClosestValue([1, 3, 5, 7], 4)).toBe(5)
      expect(getClosestValue([1, 3, 5, 7], 6)).toBe(7)
      expect(getClosestValue([1, 3, 5, 7], 0)).toBe(1)
      expect(getClosestValue([1, 3, 5, 7], 10)).toBe(7)
    })
  })

  describe('toFixedNumber', () => {
    it('should fix number to decimal places', () => {
      expect(toFixedNumber(3.14159, 2)).toBe(3.14)
      expect(toFixedNumber(2.7, 0)).toBe(3)
      expect(toFixedNumber(1.005, 2)).toBe(1)
    })

    it('should work with different bases', () => {
      expect(toFixedNumber(10, 1, 2)).toBe(10) // 基数为2时，10*2^1/2^1 = 10
    })
  })

  describe('value range checks', () => {
    it('isValueAtMax', () => {
      expect(isValueAtMax(10, 10)).toBe(true)
      expect(isValueAtMax(15, 10)).toBe(true)
      expect(isValueAtMax(5, 10)).toBe(false)
      expect(isValueAtMax(Number.NaN, 10)).toBe(false)
    })

    it('isValueAtMin', () => {
      expect(isValueAtMin(0, 0)).toBe(true)
      expect(isValueAtMin(-5, 0)).toBe(true)
      expect(isValueAtMin(5, 0)).toBe(false)
      expect(isValueAtMin(Number.NaN, 0)).toBe(true)
    })

    it('isValueWithinRange', () => {
      expect(isValueWithinRange(5, 0, 10)).toBe(true)
      expect(isValueWithinRange(0, 0, 10)).toBe(true)
      expect(isValueWithinRange(10, 0, 10)).toBe(true)
      expect(isValueWithinRange(-1, 0, 10)).toBe(false)
      expect(isValueWithinRange(11, 0, 10)).toBe(false)
    })
  })

  describe('roundValue', () => {
    it('should round value to step', () => {
      expect(roundValue(5.7, 0, 1)).toBe(6)
      expect(roundValue(5.3, 0, 1)).toBe(5)
      expect(roundValue(2.75, 0, 0.5)).toBe(3)
      expect(roundValue(2.25, 0, 0.5)).toBe(2.5)
    })
  })
})
