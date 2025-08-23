import { describe, expect, it } from 'vitest'
import { getDecadeRange } from '../index'

describe('getDecadeRange', () => {
  it('returns correct decade range for 2023', () => {
    expect(getDecadeRange(2023)).toMatchInlineSnapshot(`
      [
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
      ]
    `)
  })

  it('returns correct decade range for decade start year 2020', () => {
    expect(getDecadeRange(2020)).toMatchInlineSnapshot(`
      [
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
      ]
    `)
  })

  it('returns correct decade range for decade end year 2029', () => {
    expect(getDecadeRange(2029)).toMatchInlineSnapshot(`
      [
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
      ]
    `)
  })

  it('returns correct decade range for year ending in 0', () => {
    expect(getDecadeRange(2010)).toMatchInlineSnapshot(`
      [
        2009,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
      ]
    `)
  })

  it('returns correct decade range for year ending in 9', () => {
    expect(getDecadeRange(2019)).toMatchInlineSnapshot(`
      [
        2009,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
      ]
    `)
  })

  it('returns correct decade range for century transition year 2000', () => {
    expect(getDecadeRange(2000)).toMatchInlineSnapshot(`
      [
        1999,
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
      ]
    `)
  })

  it('returns correct decade range for early 20th century', () => {
    expect(getDecadeRange(1925)).toMatchInlineSnapshot(`
      [
        1919,
        1920,
        1921,
        1922,
        1923,
        1924,
        1925,
        1926,
        1927,
        1928,
        1929,
        1930,
      ]
    `)
  })

  it('returns correct decade range for late 19th century', () => {
    expect(getDecadeRange(1895)).toMatchInlineSnapshot(`
      [
        1889,
        1890,
        1891,
        1892,
        1893,
        1894,
        1895,
        1896,
        1897,
        1898,
        1899,
        1900,
      ]
    `)
  })

  it('returns correct decade range for year 1', () => {
    expect(getDecadeRange(1)).toMatchInlineSnapshot(`
      [
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `)
  })

  it('returns correct decade range for year 0', () => {
    expect(getDecadeRange(0)).toMatchInlineSnapshot(`
      [
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `)
  })

  it('always returns exactly 12 years', () => {
    const testYears = [1990, 2000, 2010, 2020, 2030, 1850, 2150]
    testYears.forEach((year) => {
      const range = getDecadeRange(year)
      expect(range).toHaveLength(12)
    })
  })

  it('ensures returned range is consecutive', () => {
    const range = getDecadeRange(2023)
    for (let i = 1; i < range.length; i++) {
      expect(range[i]).toBe(range[i - 1] + 1)
    }
  })

  it('ensures input year is always included in the range', () => {
    const testYears = [1990, 2000, 2010, 2020, 2030, 1850, 2150, 0, 1]
    testYears.forEach((year) => {
      const range = getDecadeRange(year)
      expect(range).toContain(year)
    })
  })
})
