import type { FileMimeTypeGroup } from '../src/types'
import { describe, expect, it } from 'vitest'
import { getAcceptAttrString } from '../src/get-accept-attr'
import { isValidFileType } from '../src/is-valid-file-type'

const groups: FileMimeTypeGroup[] = ['image/*', 'audio/*', 'video/*', 'text/*', 'application/*', 'font/*']

describe('file accept MIME groups', () => {
  it.each(groups)('preserves %s consistently for strings, arrays and records', (group) => {
    for (const accept of [group, [group], { [group]: [] }]) {
      const attribute = getAcceptAttrString(accept)
      expect(attribute).toBe(group)
      const matching = { name: 'fixture.bin', type: group.replace('*', 'test') } as File
      const other = { name: 'fixture.bin', type: 'other/test' } as File
      expect(isValidFileType(matching, attribute)).toEqual([true, null])
      expect(isValidFileType(other, attribute)).toEqual([false, 'FILE_INVALID_TYPE'])
    }
  })

  it('retains exact types and extensions while filtering invalid list entries', () => {
    expect(getAcceptAttrString(['image/png', '.pdf', 'invalid'])).toBe('image/png,.pdf')
    expect(getAcceptAttrString({ 'application/*': ['.pdf', 'invalid'], 'font/*': ['.woff2'] })).toBe('application/*,.pdf,font/*,.woff2')
    expect(isValidFileType({ name: 'REPORT.PDF', type: '' } as File, '.pdf')).toEqual([true, null])
    expect(isValidFileType({ name: 'REPORT.TXT', type: 'text/plain' } as File, 'image/png,.pdf')).toEqual([false, 'FILE_INVALID_TYPE'])
  })

  it('preserves absent and empty accept behavior', () => {
    expect(getAcceptAttrString(undefined)).toBeUndefined()
    expect(getAcceptAttrString('')).toBeUndefined()
    expect(getAcceptAttrString([])).toBe('')
    expect(isValidFileType({ name: 'fixture.bin', type: '' } as File, undefined)).toEqual([true, null])
  })
})
