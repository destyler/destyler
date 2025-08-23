import { describe, expect, it } from 'vitest'
import { formatDate } from '../index'

const date = new Date(2022, 0, 1, 4, 15, 30)
const run = (format: string, timeZone?: string) => formatDate(date, format, 'en-US', timeZone)

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(run('yyyy-MM-DD')).toMatchInlineSnapshot(`"2022-01-01"`)
  })

  it('should handle different locales', () => {
    expect(run('EEEE, MMMM D, yyyy')).toMatchInlineSnapshot(`"Saturday, January 1, 2022"`)
  })

  it('should replace all format keys in the format string', () => {
    const date = new Date(2022, 0, 1, 13, 15, 30)
    const result = formatDate(date, 'yyyy-MM-DD HH:mm:ss', 'en-US')
    expect(result).toMatchInlineSnapshot(`"2022-01-01 13:15:30"`)
  })

  it('format day', () => {
    expect(run('d')).toMatchInlineSnapshot(`"1"`)
    expect(run('do')).toMatchInlineSnapshot(`"1st"`)
    expect(run('dd')).toMatchInlineSnapshot(`"01"`)
    expect(run('ddd')).toMatchInlineSnapshot(`"ddd"`)
    expect(run('dddd')).toMatchInlineSnapshot(`"dddd"`)

    expect(run('D')).toMatchInlineSnapshot(`"1"`)
    expect(run('Do')).toMatchInlineSnapshot(`"1st"`)
    expect(run('DD')).toMatchInlineSnapshot(`"01"`)
    expect(run('DDD')).toMatchInlineSnapshot(`"001"`)
    expect(run('DDDD')).toMatchInlineSnapshot(`"DDDD"`)
  })

  it('format month', () => {
    expect(run('M')).toMatchInlineSnapshot(`"1"`)
    expect(run('Mo')).toMatchInlineSnapshot(`"1st"`)
    expect(run('MM')).toMatchInlineSnapshot(`"01"`)
    expect(run('MMM')).toMatchInlineSnapshot(`"Jan"`)
    expect(run('MMMM')).toMatchInlineSnapshot(`"January"`)
    expect(run('MMMMM')).toMatchInlineSnapshot(`"J"`)
  })

  it('format year', () => {
    expect(run('y')).toMatchInlineSnapshot(`"2022"`)
    expect(run('yo')).toMatchInlineSnapshot(`"2022nd"`)
    expect(run('yy')).toMatchInlineSnapshot(`"22"`)
    expect(run('yyyy')).toMatchInlineSnapshot(`"2022"`)
    expect(run('Y')).toMatchInlineSnapshot(`"2022"`)
    expect(run('Yo')).toMatchInlineSnapshot(`"2022nd"`)
    expect(run('YY')).toMatchInlineSnapshot(`"22"`)
    expect(run('YYY')).toMatchInlineSnapshot(`"2022"`)
    expect(run('YYYY')).toMatchInlineSnapshot(`"2022"`)
  })

  it('format hour', () => {
    expect(run('h')).toMatchInlineSnapshot(`"4 AM"`)
    expect(run('ho')).toMatchInlineSnapshot(`"4th"`)
    expect(run('hh')).toMatchInlineSnapshot(`"04 AM"`)
    expect(run('H')).toMatchInlineSnapshot(`"04"`)
    expect(run('Ho')).toMatchInlineSnapshot(`"4th"`)
    expect(run('HH')).toMatchInlineSnapshot(`"04"`)
  })

  it('format minute', () => {
    expect(run('m')).toMatchInlineSnapshot(`"15"`)
    expect(run('mo')).toMatchInlineSnapshot(`"15th"`)
    expect(run('mm')).toMatchInlineSnapshot(`"15"`)
  })

  it('format quarter', () => {
    expect(run('Q')).toMatchInlineSnapshot(`"1"`)
    expect(run('Qo')).toMatchInlineSnapshot(`"1st"`)
    expect(run('QQ')).toMatchInlineSnapshot(`"01"`)
    expect(run('QQQQ')).toMatchInlineSnapshot(`"1st quarter"`)
    expect(run('QQQQQ')).toMatchInlineSnapshot(`"1"`)
  })

  it('format week', () => {
    expect(run('w')).toMatchInlineSnapshot(`"1"`)
    expect(run('wo')).toMatchInlineSnapshot(`"1st"`)
    expect(run('ww')).toMatchInlineSnapshot(`"01"`)
  })

  it('format weekday', () => {
    expect(run('E')).toMatchInlineSnapshot(`"Sat"`)
    expect(run('EE')).toMatchInlineSnapshot(`"Sat"`)
    expect(run('EEE')).toMatchInlineSnapshot(`"Sat"`)
    expect(run('EEEE')).toMatchInlineSnapshot(`"Saturday"`)
    expect(run('EEEEE')).toMatchInlineSnapshot(`"S"`)
    expect(run('EEEEEE')).toMatchInlineSnapshot(`"Sa"`)
  })
})
