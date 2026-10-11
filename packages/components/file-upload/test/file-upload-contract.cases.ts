import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})
function file(name = 'test.txt', contents = 'A', type = 'text/plain') {
  return new File([contents], name, { type, lastModified: 123 })
}
function start(props: Partial<UserDefinedContext> = {}) {
  const input = document.createElement('input')
  input.type = 'file'
  input.id = 'file-upload:test:input'
  input.name = 'attachment'
  document.body.append(input)
  const onFileChange = vi.fn()
  const service = machine({ id: 'test', preventDocumentDrop: false, onFileChange, ...props }).start()
  services.push(service)
  const api = () => connect(service.getState(), service.send, normalize)
  return { input, service, api, onFileChange }
}
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('file-upload validation and ownership', () => {
  it('appends multiple selections, then removes and clears', async () => {
    const { api, input } = start({ maxFiles: 2 })
    const a = file('a.txt')
    const b = file('b.txt')
    api().setFiles([a])
    await settle()
    api().setFiles([b])
    await settle()
    expect(api().acceptedFiles).toEqual([a, b])
    expect(Array.from(input.files!)).toEqual([a, b])
    api().deleteFile(a)
    await settle()
    expect(api().acceptedFiles).toEqual([b])
    expect(Array.from(input.files!)).toEqual([b])
    api().clearFiles()
    await settle()
    expect(api().acceptedFiles).toEqual([])
    expect(Array.from(input.files!)).toEqual([])
  })
  it('rejects overflow without partially accepting the new batch', () => {
    const { api } = start({ maxFiles: 2 })
    const a = file('a.txt')
    const b = file('b.txt')
    const c = file('c.txt')
    api().setFiles([a])
    api().setFiles([b, c])
    expect(api().acceptedFiles).toEqual([a])
    expect(api().rejectedFiles).toEqual([b, c].map(value => ({ file: value, errors: ['TOO_MANY_FILES'] })))
  })
  it('retains type, size and consumer validation errors independently', () => {
    const { api } = start({ accept: 'image/*', minFileSize: 2, maxFileSize: 4, validate: () => ['CUSTOM'] })
    const a = file('a.txt')
    api().setFiles([a])
    expect(api().acceptedFiles).toEqual([])
    expect(api().rejectedFiles).toEqual([{ file: a, errors: ['FILE_INVALID_TYPE', 'FILE_TOO_SMALL', 'CUSTOM'] }])
  })
  it.each(['application/*', 'font/*'])('retains the typed accept group %s in array form', (group) => {
    const { api } = start({ accept: [group] })
    expect(api().getHiddenInputProps().accept).toBe(group)
    api().setFiles([file()])
    expect(api().acceptedFiles).toEqual([])
    expect(api().rejectedFiles[0].errors).toEqual(['FILE_INVALID_TYPE'])
  })

  it('replaces the single-file selection with the newer file', async () => {
    const { api, input } = start()
    const a = file('a.txt')
    const b = file('b.txt')
    api().setFiles([a])
    await settle()
    api().setFiles([b])
    await settle()
    expect(api().acceptedFiles).toEqual([b])
    expect(Array.from(input.files!)).toEqual([b])
  })
  it.each([0, 1, 2, 3, 4])('enforces inclusive size bounds for %i-byte fixtures', (size) => {
    const { api } = start({ minFileSize: 1, maxFileSize: 3 })
    const value = file('size.txt', 'x'.repeat(size))
    api().setFiles([value])
    if (size >= 1 && size <= 3) {
      expect(api().acceptedFiles).toEqual([value])
      expect(api().rejectedFiles).toEqual([])
    }
    else {
      expect(api().acceptedFiles).toEqual([])
      expect(api().rejectedFiles).toEqual([{ file: value, errors: [size < 1 ? 'FILE_TOO_SMALL' : 'FILE_TOO_LARGE'] }])
    }
  })
  it('preserves rejection ownership when only rejected files are cleared', () => {
    const { api } = start({ accept: 'text/plain' })
    const a = file()
    const b = file('b.png', 'B', 'image/png')
    api().setFiles([a])
    api().setFiles([b])
    expect(api().acceptedFiles).toEqual([a])
    expect(api().rejectedFiles).toHaveLength(1)
    api().clearRejectedFiles()
    expect(api().acceptedFiles).toEqual([a])
    expect(api().rejectedFiles).toEqual([])
  })
  it('deletes only the specified File object when metadata match', () => {
    const { api } = start({ maxFiles: 2 })
    const a = file()
    const b = file()
    api().setFiles([a, b])
    api().deleteFile(a)
    expect(api().acceptedFiles).toHaveLength(1)
    expect(api().acceptedFiles[0]).toBe(b)
  })
  it('keeps UI input/drop/paste paths disabled while retaining explicit API mutation', () => {
    const { api } = start({ disabled: true })
    const value = file()
    const data = new DataTransfer()
    data.items.add(value)
    expect(api().getHiddenInputProps().disabled).toBe(true)
    expect(api().getTriggerProps().disabled).toBe(true)
    expect(api().getItemDeleteTriggerProps({ file: value }).disabled).toBe(true)
    expect(api().getDropzoneProps().tabIndex).toBeUndefined()
    expect(api().setClipboardFiles(data)).toBe(false)
    api().getHiddenInputProps().onInput?.({ currentTarget: { files: [value] } } as any)
    api().getDropzoneProps().onDrop?.({ dataTransfer: data } as any)
    expect(api().acceptedFiles).toEqual([])
    api().setFiles([value])
    expect(api().acceptedFiles).toEqual([value])
    api().clearFiles()
    expect(api().acceptedFiles).toEqual([])
  })
  it('ignores text-only clipboard data and accepts file entries', () => {
    const { api } = start()
    expect(api().setClipboardFiles(null)).toBe(false)
    const data = new DataTransfer()
    data.items.add('text', 'text/plain')
    expect(api().setClipboardFiles(data)).toBe(false)
    const value = file()
    data.items.add(value)
    expect(api().setClipboardFiles(data)).toBe(true)
    expect(api().acceptedFiles).toEqual([value])
  })
  it('returns a cleanup for the preview URL owned by each call', () => {
    const { api } = start()
    const create = vi.spyOn(window.URL, 'createObjectURL').mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second')
    const revoke = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {})
    const first = vi.fn()
    const second = vi.fn()
    const a = file('a.png', 'A', 'image/png')
    const b = file('b.png', 'B', 'image/png')
    const releaseFirst = api().createFileUrl(a, first)
    const releaseSecond = api().createFileUrl(b, second)
    expect(create.mock.calls).toEqual([[a], [b]])
    expect(first).toHaveBeenCalledWith('blob:first')
    expect(second).toHaveBeenCalledWith('blob:second')
    releaseFirst()
    expect(revoke.mock.calls).toEqual([['blob:first']])
    releaseSecond()
    expect(revoke.mock.calls).toEqual([['blob:first'], ['blob:second']])
  })
})
