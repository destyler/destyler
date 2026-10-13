import { describe, expect, it } from 'vitest'
import { machine } from '../index'
import { createFormatter, createParser, formatValue, parseValue } from '../src/utils'

describe('number-input formatter and parser contracts', () => {
  it.each(['en-US', 'de-DE', 'ar-EG'])('keeps the native Intl formatter for %s', (locale) => {
    const options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 }
    const actual = createFormatter(locale, options)
    const native = new Intl.NumberFormat(locale, options)
    expect(actual).toBeInstanceOf(Intl.NumberFormat)
    for (const value of [0, -0, 1234.567, -1234.567, Number.NaN, Infinity, -Infinity]) {
      expect(actual.format(value)).toBe(native.format(value))
      expect(actual.formatToParts(value)).toEqual(native.formatToParts(value))
    }
    expect(actual.resolvedOptions()).toEqual(native.resolvedOptions())
    expect(actual.formatRange(1, 2)).toBe(native.formatRange(1, 2))
    expect(actual.formatRangeToParts(1, 2)).toEqual(native.formatRangeToParts(1, 2))
    expect(() => actual.formatRange(Number.NaN, 2)).toThrow(RangeError)
  })

  it('keeps unformatted parseFloat and string conversion behavior', () => {
    const ctx = machine({ id: 'plain-number' }).contextSnapshot
    expect(ctx.formatter).toBeInstanceOf(Intl.NumberFormat)
    expect(parseValue(ctx, '12suffix')).toBe(12)
    expect(parseValue(ctx, '1,234.5')).toBe(1)
    expect(parseValue(ctx, '')).toBeNaN()
    expect(formatValue(ctx, Number.NaN)).toBe('')
    expect(formatValue(ctx, -0)).toBe('0')
    expect(formatValue(ctx, Infinity)).toBe('Infinity')
  })

  it.each([
    ['en-US', '1,234.5'],
    ['de-DE', '1.234,5'],
    ['fr-FR', '1\u202F234,5'],
    ['ar-EG', '\u0661\u066C\u0662\u0663\u0664\u066B\u0665'],
  ])('keeps localized parse/format behavior for %s', (locale, value) => {
    const ctx = machine({ id: 'localized-number', locale, formatOptions: {} }).contextSnapshot
    expect(parseValue(ctx, value)).toBe(1234.5)
    expect(formatValue(ctx, 1234.5)).toBe(new Intl.NumberFormat(locale).format(1234.5))
    expect(parseValue(ctx, 'invalid')).toBeNaN()
    expect(formatValue(ctx, Number.NaN)).toBe('')
  })

  it('keeps percent, accounting, partial input and numbering methods', () => {
    expect(createParser('en-US', { style: 'percent' }).parse('12.5%')).toBe(0.13)
    expect(createParser('en-US', { style: 'currency', currency: 'USD', currencySign: 'accounting' }).parse('($1,234.50)')).toBe(-1234.5)
    const parser = createParser('en-US')
    expect(parser.isValidPartialNumber('-')).toBe(true)
    expect(parser.isValidPartialNumber('-', 0)).toBe(false)
    expect(parser.isValidPartialNumber('+', undefined, 0)).toBe(false)
    expect(parser.getNumberingSystem('123')).toBe('latn')
  })

  it('exposes the upstream numeral-free unit parsing fix', () => {
    const formatOptions: Intl.NumberFormatOptions = { style: 'unit', unit: 'meter', unitDisplay: 'long' }
    const ctx = machine({ id: 'unit-number', locale: 'ar', defaultValue: '\u0645\u062A\u0631', formatOptions }).contextSnapshot
    expect(ctx.valueAsNumber).toBe(1)
    expect(ctx.formattedValue).toBe(new Intl.NumberFormat('ar', formatOptions).format(1))
    expect(ctx.isOutOfRange).toBe(false)
  })
})
