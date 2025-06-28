import { describe, expect } from 'vitest'
import { normalizeYear } from '../index'

describe('normalize year', () => {
  it('with 2 digits', () => {
    expect(normalizeYear('23')).toBe('2023')
  })

  it('with 3 digits', () => {
    expect(normalizeYear('123')).toBe('1230')
  })

  it('with 4 digits', () => {
    expect(normalizeYear('2023')).toBe('2023')
  })

  it('handles 2-digit years at century boundary', () => {
    // Test years that should be in previous century
    expect(normalizeYear('99')).toBe('1999')
    expect(normalizeYear('95')).toBe('1995')
    expect(normalizeYear('80')).toBe('1980')
  })

  it('handles 2-digit years in current century', () => {
    const currentYear = new Date().getFullYear()
    const currentCentury = Math.floor(currentYear / 100) * 100

    // Test years that should be in current century
    expect(normalizeYear('00')).toBe((currentCentury).toString())
    expect(normalizeYear('01')).toBe((currentCentury + 1).toString())
    expect(normalizeYear('10')).toBe((currentCentury + 10).toString())
  })

  it('applies future year coercion correctly', () => {
    const currentYear = new Date().getFullYear()
    const currentTwoDigit = currentYear % 100
    const futureThreshold = currentTwoDigit + 10

    if (futureThreshold < 100) {
      // Test a year that's more than 10 years in the future
      const futureYear = (futureThreshold + 1).toString().padStart(2, '0')
      const normalizedYear = normalizeYear(futureYear)

      // 根据实际函数逻辑：如果年份超过当前年份+10，则减去100年
      const currentCentury = Math.floor(currentYear / 100) * 100
      const fullYear = currentCentury + (futureThreshold + 1)
      const expectedYear = fullYear - 100 // 因为超过了未来阈值，所以减去100年

      expect(normalizedYear).toBe(expectedYear.toString())
    }
  })

  it('handles 3-digit years with different patterns', () => {
    expect(normalizeYear('001')).toBe('0010')
    expect(normalizeYear('012')).toBe('0120')
    expect(normalizeYear('120')).toBe('1200')
    expect(normalizeYear('999')).toBe('9990')
  })

  it('handles 4-digit years unchanged', () => {
    const testYears = ['0001', '1000', '1999', '2000', '2024', '9999']
    testYears.forEach((year) => {
      expect(normalizeYear(year)).toBe(year)
    })
  })

  it('handles single digit input', () => {
    expect(normalizeYear('1')).toBe('1')
    expect(normalizeYear('5')).toBe('5')
    expect(normalizeYear('9')).toBe('9')
  })

  it('handles 5+ digit years unchanged', () => {
    expect(normalizeYear('12345')).toBe('12345')
    expect(normalizeYear('123456')).toBe('123456')
  })

  it('handles null and undefined input', () => {
    expect(normalizeYear(null)).toBeUndefined()
    expect(normalizeYear(undefined)).toBeUndefined()
  })

  it('handles empty string', () => {
    expect(normalizeYear('')).toBeUndefined()
  })

  it('handles leading zeros in 2-digit years', () => {
    expect(normalizeYear('01')).toBe('2001')
    expect(normalizeYear('05')).toBe('2005')
    expect(normalizeYear('09')).toBe('2009')
  })

  it('handles edge cases for 3-digit padding', () => {
    // Test that 3-digit years are padded with '0' at the end
    expect(normalizeYear('1')).toBe('1') // Single digit unchanged
    expect(normalizeYear('12')).toBe('2012') // 2-digit processed normally
    expect(normalizeYear('123')).toBe('1230') // 3-digit padded
    expect(normalizeYear('1234')).toBe('1234') // 4-digit unchanged
  })

  it('century transition logic is consistent', () => {
    const currentYear = new Date().getFullYear()
    const currentCentury = Math.floor(currentYear / 100) * 100

    // Test all 2-digit years from 00 to 99
    for (let i = 0; i < 100; i++) {
      const twoDigitYear = i.toString().padStart(2, '0')
      const normalized = normalizeYear(twoDigitYear)
      const normalizedNum = Number.parseInt(normalized!)

      // 根据未来年份强制转换逻辑
      const expectedYear = currentCentury + i
      if (expectedYear > currentYear + 10) {
        // 如果超过当前年份+10年，则应该在上个世纪
        expect(normalizedNum).toBe(currentCentury - 100 + i)
      }
      else {
        // 否则在当前世纪
        expect(normalizedNum).toBe(currentCentury + i)
      }
    }
  })

  it('handles boundary years correctly', () => {
    const currentYear = new Date().getFullYear()
    const currentTwoDigit = currentYear % 100

    // Test the exact boundary year (current year + 10)
    const boundaryYear = ((currentTwoDigit + 10) % 100).toString().padStart(2, '0')
    const normalized = normalizeYear(boundaryYear)

    // Should be handled according to future year coercion logic
    expect(normalized).toBeDefined()
    expect(normalized!.length).toBe(4)

    // 边界年份应该还在当前世纪（刚好等于currentYear + 10）
    const currentCentury = Math.floor(currentYear / 100) * 100
    const expectedYear = currentCentury + ((currentTwoDigit + 10) % 100)
    if (expectedYear <= currentYear + 10) {
      expect(normalized).toBe(expectedYear.toString())
    }
    else {
      expect(normalized).toBe((expectedYear - 100).toString())
    }
  })

  it('preserves year format for valid inputs', () => {
    // Test that the function doesn't modify valid 4-digit years
    const validYears = ['1900', '1950', '2000', '2023', '2100']
    validYears.forEach((year) => {
      expect(normalizeYear(year)).toBe(year)
    })
  })

  it('returns string format consistently', () => {
    const testInputs = ['1', '23', '456', '2023', '12345']
    testInputs.forEach((input) => {
      const result = normalizeYear(input)
      if (result !== undefined) {
        expect(typeof result).toBe('string')
      }
    })
  })

  it('handles extreme 2-digit cases', () => {
    const currentYear = new Date().getFullYear()
    const currentCentury = Math.floor(currentYear / 100) * 100

    // Test "00" - should be in current century
    const normalized00 = normalizeYear('00')
    expect(normalized00).toBe(currentCentury.toString())

    // Test "99" - likely in previous century due to future coercion
    const normalized99 = normalizeYear('99')
    const expected99 = currentCentury + 99
    if (expected99 > currentYear + 10) {
      expect(normalized99).toBe((expected99 - 100).toString())
    }
    else {
      expect(normalized99).toBe(expected99.toString())
    }
  })

  it('maintains backward compatibility', () => {
    // Test that common use cases still work as expected
    // 注意：这些期望值可能需要根据当前年份调整
    const currentYear = new Date().getFullYear()
    const currentCentury = Math.floor(currentYear / 100) * 100

    const commonCases = [
      { input: '23', expected: `${currentCentury + 23}` },
      { input: '01', expected: `${currentCentury + 1}` },
      { input: '123', expected: '1230' },
      { input: '2023', expected: '2023' },
    ]

    commonCases.forEach(({ input, expected }) => {
      const result = normalizeYear(input)
      if (input === '23') {
        // 对于 "23"，需要检查是否超过未来阈值
        const fullYear = currentCentury + 23
        if (fullYear > currentYear + 10) {
          expect(result).toBe((fullYear - 100).toString())
        }
        else {
          expect(result).toBe(fullYear.toString())
        }
      }
      else if (input === '01') {
        // 对于 "01"，通常在当前世纪
        expect(result).toBe((currentCentury + 1).toString())
      }
      else {
        expect(result).toBe(expected)
      }
    })
  })
})
