// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { dataURItoBlob } from '../src/data-url-to-blob'
import { downloadFile } from '../src/download-file'
import { getFileDataUrl } from '../src/get-file-data-url'
import { getTotalFileSize } from '../src/get-total-file-size'
import { isFileEqual } from '../src/is-file-equal'

function decode(blob: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsText(blob)
  })
}
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  document.querySelectorAll('a').forEach(anchor => anchor.remove())
  document.body.replaceChildren()
})
describe('file resource helpers', () => {
  it('round-trips generated file data without changing bytes or type', async () => {
    const file = new File(['generated fixture'], 'fixture.txt', { type: 'text/plain' })
    const url = await getFileDataUrl(file)
    expect(url).toBe('data:text/plain;base64,Z2VuZXJhdGVkIGZpeHR1cmU=')
    const blob = dataURItoBlob(url!)
    expect(blob.type).toBe('text/plain')
    expect(await decode(blob)).toBe('generated fixture')
  })
  it('rejects reader errors and aborts the failing reader', async () => {
    const abort = vi.fn()
    vi.stubGlobal('FileReader', class {
      onerror?: () => void
      abort = abort
      readAsDataURL() { this.onerror?.() }
    })
    await expect(getFileDataUrl(new Blob(['fixture']))).rejects.toThrow('There was an error reading a file')
    expect(abort).toHaveBeenCalledTimes(1)
  })
  it('rejects a non-DataURL reader result', async () => {
    vi.stubGlobal('FileReader', class {
      onloadend?: () => void
      result = new ArrayBuffer(0)
      readAsDataURL() { this.onloadend?.() }
    })
    await expect(getFileDataUrl(new Blob(['fixture']))).rejects.toThrow('Expected DataURL as string')
  })
  it('totals file byte sizes and preserves the existing metadata equality contract', () => {
    const first = new File(['A'], 'same.txt', { type: 'text/plain', lastModified: 1 })
    const other = new File(['B'], 'same.txt', { type: 'text/plain', lastModified: 2 })
    expect(getTotalFileSize([])).toBe(0)
    expect(getTotalFileSize([first, other])).toBe(2)
    expect(isFileEqual(first, other)).toBe(true)
    expect(isFileEqual(first, new File(['AA'], 'same.txt', { type: 'text/plain' }))).toBe(false)
    expect(isFileEqual(first, new File(['A'], 'other.txt', { type: 'text/plain' }))).toBe(false)
    expect(isFileEqual(first, new File(['A'], 'same.txt', { type: 'image/png' }))).toBe(false)
  })
  it('clicks the exact owned anchors with the exact Blob bytes and releases only their URLs', async () => {
    vi.useFakeTimers()
    const peerUrl = 'blob:another-consumer'
    const active = new Set([peerUrl])
    const peerAnchor = document.createElement('a')
    peerAnchor.href = peerUrl
    document.body.append(peerAnchor)
    const created: Array<{ url: string, blob: Blob }> = []
    const create = vi.spyOn(window.URL, 'createObjectURL').mockImplementation((blob) => {
      const url = `blob:download-${created.length}`
      created.push({ url, blob: blob as Blob })
      active.add(url)
      return url
    })
    const revoke = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation((url) => {
      active.delete(url)
    })
    const clicks: Array<{ node: HTMLAnchorElement, connected: boolean, url: string, name: string, rel: string }> = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push({ node: this, connected: this.isConnected, url: this.href, name: this.download, rel: this.rel })
    })
    const file = new File(['file bytes'], 'original.txt', { type: 'text/plain' })
    const blob = new Blob(['blob bytes'], { type: 'application/octet-stream' })
    downloadFile({ file: 'string bytes', type: 'text/plain', name: 'generated.txt', win: window })
    downloadFile({ file, type: 'text/plain', win: window })
    downloadFile({ file: blob, type: 'application/octet-stream', win: window })

    expect(create).toHaveBeenCalledTimes(3)
    expect(created[0].blob.type).toBe('text/plain')
    expect(await created[0].blob.text()).toBe('string bytes')
    expect(created[1].blob).toBe(file)
    expect(await created[1].blob.text()).toBe('file bytes')
    expect(created[2].blob).toBe(blob)
    expect(await created[2].blob.text()).toBe('blob bytes')
    const ownedAnchors = Array.from(document.querySelectorAll('a')).filter(anchor => anchor !== peerAnchor)
    expect(ownedAnchors).toHaveLength(3)
    expect(clicks).toHaveLength(3)
    expect(clicks.map(click => click.node)).toEqual(ownedAnchors)
    expect(clicks.map(({ connected, url, name, rel }) => ({ connected, url, name, rel }))).toEqual([
      { connected: true, url: created[0].url, name: 'generated.txt', rel: 'noopener' },
      { connected: true, url: created[1].url, name: 'original.txt', rel: 'noopener' },
      { connected: true, url: created[2].url, name: 'file-download', rel: 'noopener' },
    ])
    expect(revoke).not.toHaveBeenCalled()
    expect(active).toEqual(new Set([peerUrl, ...created.map(value => value.url)]))
    vi.runAllTimers()
    expect(revoke.mock.calls).toEqual(created.map(value => [value.url]))
    expect(active).toEqual(new Set([peerUrl]))
    expect(ownedAnchors.every(anchor => !anchor.isConnected)).toBe(true)
    expect(peerAnchor.isConnected).toBe(true)
    expect(document.querySelectorAll('a')).toHaveLength(1)
  })
})
