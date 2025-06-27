import type {FormatBytesOptions} from "../index";
import { describe, expect, it } from "vitest";
import { formatBytes } from '../index'

describe('formatBytes', () => {
  it('should return empty string for NaN', () => {
    const result = formatBytes(Number.NaN)
    expect(result).toMatchInlineSnapshot(`""`)
  })

  it('should return \'0 B\' for 0 bytes', () => {
    const result = formatBytes(0)
    expect(result).toMatchInlineSnapshot(`"0 B"`)
  })

  it('should format bytes correctly', () => {
    const options: FormatBytesOptions = { unit: 'byte', unitDisplay: 'short' }
    const result = formatBytes(1500, 'en-US', options)
    expect(result).toMatchInlineSnapshot(`"1.5 kB"`)
  })

  it('should format bits correctly', () => {
    const options: FormatBytesOptions = { unit: 'bit', unitDisplay: 'short' }
    const result = formatBytes(1500, 'en-US', options)
    expect(result).toMatchInlineSnapshot(`"1.5 kb"`)
  })

  it('should handle large byte values', () => {
    const options: FormatBytesOptions = { unit: 'byte', unitDisplay: 'short' }
    const result = formatBytes(1500000000, 'en-US', options)
    expect(result).toMatchInlineSnapshot(`"1.5 GB"`)
  })

  it('sink', () => {
    expect(formatBytes(1024)).toMatchInlineSnapshot(`"1.02 kB"`)
    expect(formatBytes(1048576)).toMatchInlineSnapshot(`"1.05 MB"`)
    expect(formatBytes(1073741824)).toMatchInlineSnapshot(`"1.07 GB"`)
    expect(formatBytes(1099511627776)).toMatchInlineSnapshot(`"1.1 TB"`)
    expect(formatBytes(1023)).toMatchInlineSnapshot(`"1.02 kB"`)
    expect(formatBytes(1048575)).toMatchInlineSnapshot(`"1.05 MB"`)
    expect(formatBytes(1073741823)).toMatchInlineSnapshot(`"1.07 GB"`)
    expect(formatBytes(1099511627775)).toMatchInlineSnapshot(`"1.1 TB"`)
  })
})
