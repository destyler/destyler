import { describe, expect, it } from 'vitest'
import { getMonthNames } from '../index'

describe('getMonthNames', () => {
  it('en / returns the list of month names', () => {
    expect(getMonthNames('en')).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ])
  })

  it('en / returns the list of month names in short format', () => {
    expect(getMonthNames('en', 'short')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ])
  })

  it('ru / returns the list of month names in Russian', () => {
    expect(getMonthNames('ru')).toMatchInlineSnapshot(`
      [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
      ]
    `)
  })

  it('en / returns the list of month names in narrow format', () => {
    expect(getMonthNames('en', 'narrow')).toMatchInlineSnapshot(`
      [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D",
      ]
    `)
  })

  it('en / returns the list of month names in numeric format', () => {
    expect(getMonthNames('en', 'numeric')).toMatchInlineSnapshot(`
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ]
    `)
  })

  it('en / returns the list of month names in 2-digit format', () => {
    expect(getMonthNames('en', '2-digit')).toMatchInlineSnapshot(`
      [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ]
    `)
  })

  it('de / returns German month names', () => {
    expect(getMonthNames('de')).toMatchInlineSnapshot(`
      [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ]
    `)
  })

  it('fr / returns French month names', () => {
    expect(getMonthNames('fr')).toMatchInlineSnapshot(`
      [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ]
    `)
  })

  it('ja / returns Japanese month names', () => {
    expect(getMonthNames('ja')).toMatchInlineSnapshot(`
      [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ]
    `)
  })

  it('ar / returns Arabic month names', () => {
    expect(getMonthNames('ar')).toMatchInlineSnapshot(`
      [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ]
    `)
  })

  it('zh-CN / returns Chinese month names', () => {
    expect(getMonthNames('zh-CN')).toMatchInlineSnapshot(`
      [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ]
    `)
  })

  it('es / returns Spanish month names', () => {
    expect(getMonthNames('es')).toMatchInlineSnapshot(`
      [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ]
    `)
  })

  it('pt / returns Portuguese month names', () => {
    expect(getMonthNames('pt')).toMatchInlineSnapshot(`
      [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ]
    `)
  })

  it('always returns exactly 12 months', () => {
    const locales = ['en', 'de', 'fr', 'ja', 'ar', 'zh-CN', 'es', 'pt', 'ru']
    const formats: Intl.DateTimeFormatOptions['month'][] = ['long', 'short', 'narrow', 'numeric', '2-digit']

    locales.forEach((locale) => {
      formats.forEach((format) => {
        const months = getMonthNames(locale, format)
        expect(months).toHaveLength(12)
      })
    })
  })

  it('returns unique month names for most locales and formats', () => {
    const locales = ['en', 'de', 'fr', 'es', 'pt']
    const formats: Intl.DateTimeFormatOptions['month'][] = ['long', 'short']

    locales.forEach((locale) => {
      formats.forEach((format) => {
        const months = getMonthNames(locale, format)
        const uniqueMonths = new Set(months)
        expect(uniqueMonths.size).toBe(12)
      })
    })
  })

  it('returns consistent results for multiple calls', () => {
    const firstCall = getMonthNames('en', 'long')
    const secondCall = getMonthNames('en', 'long')
    expect(firstCall).toEqual(secondCall)
  })

  it('returns non-empty strings for all months', () => {
    const locales = ['en', 'de', 'fr', 'ja', 'ar']
    const formats: Intl.DateTimeFormatOptions['month'][] = ['long', 'short', 'narrow']

    locales.forEach((locale) => {
      formats.forEach((format) => {
        const months = getMonthNames(locale, format)
        months.forEach((month) => {
          expect(month).toBeTruthy()
          expect(typeof month).toBe('string')
          expect(month.length).toBeGreaterThan(0)
        })
      })
    })
  })

  it('handles fallback locale correctly', () => {
    // Test with invalid locale - should fallback gracefully
    const months = getMonthNames('invalid-locale')
    expect(months).toHaveLength(12)
    months.forEach((month) => {
      expect(typeof month).toBe('string')
      expect(month.length).toBeGreaterThan(0)
    })
  })

  it('default format is long', () => {
    const defaultFormat = getMonthNames('en')
    const explicitLong = getMonthNames('en', 'long')
    expect(defaultFormat).toEqual(explicitLong)
  })

  it('numeric format returns string numbers', () => {
    const months = getMonthNames('en', 'numeric')
    months.forEach((month, index) => {
      expect(month).toBe((index + 1).toString())
    })
  })

  it('2-digit format returns zero-padded numbers', () => {
    const months = getMonthNames('en', '2-digit')
    months.forEach((month, index) => {
      const expectedMonth = (index + 1).toString().padStart(2, '0')
      expect(month).toBe(expectedMonth)
    })
  })
})
