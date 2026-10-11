// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { encode } from 'uqr'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
function createCode(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'qr-contract', ...context }).start()
  services.push(service)
  return { service, api: () => connect(service.state, service.send, normalize) }
}
function expectMatrix(api: ReturnType<typeof connect>, value: string, options?: UserDefinedContext['encoding']) {
  const matrix = encode(value, options)
  const cells = Array.from(api.getPatternProps().d.matchAll(/M(\d+),(\d+)h10v10h-10z/g), (match: RegExpMatchArray) => [Number(match[2]) / 10, Number(match[1]) / 10])
  const expected: number[][] = []
  matrix.data.forEach((row, y) => row.forEach((filled, x) => {
    if (filled)
      expected.push([y, x])
  }))
  expect(cells).toEqual(expected)
  expect(api.getFrameProps().viewBox).toBe(`0 0 ${matrix.size * 10} ${matrix.size * 10}`)
  expect(api.getRootProps().style['--qrcode-width']).toBe(`${matrix.size * 10}px`)
}
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('qr-code generation and export contracts', () => {
  it.each(['', 'HELLO WORLD', 'https://example.com?a=<tag>&q="quoted"', '签名 🖊️ café'])('encodes supported text without interpolating it into SVG markup: %s', (value) => {
    const { api } = createCode({ value })
    expect(api().value).toBe(value)
    expectMatrix(api(), value)
    expect(api().getPatternProps().d).toMatch(/^(?:M\d+,\d+h10v10h-10z)+$/)
  })

  it.each([{ ecc: 'H' as const, border: 4, maskPattern: 2 }, { ecc: 'Q' as const, boostEcc: false, invert: true }])('preserves supplied initial encoding %j', (encoding) => {
    const { api } = createCode({ value: 'custom options', encoding })
    expectMatrix(api(), 'custom options', encoding)
  })

  it.each([{}, { encoding: undefined }, { encoding: {} }, { encoding: { ecc: 'L' as const } }])('re-encodes value and encoding changes without spurious callbacks from initial %j', (initial) => {
    const onValueChange = vi.fn()
    const { service, api } = createCode({ value: 'initial', onValueChange, ...initial })
    api().setValue('initial')
    expect(onValueChange).not.toHaveBeenCalled()
    api().setValue('edited')
    expect(onValueChange.mock.calls).toEqual([[{ value: 'edited' }]])
    expectMatrix(api(), 'edited')
    const before = api().getPatternProps().d
    const encoding = { ecc: 'H' as const, boostEcc: false, maskPattern: 3, border: 4 }
    service.setContext({ encoding })
    expect(service.state.context.encoding).toEqual(encoding)
    expectMatrix(api(), 'edited', encoding)
    expect(api().getPatternProps().d).not.toBe(before)
    expect(onValueChange).toHaveBeenCalledTimes(1)
    const replacement = { ecc: 'M' as const, boostEcc: true, maskPattern: 5, border: 2 }
    service.setContext({ encoding: replacement })
    expectMatrix(api(), 'edited', replacement)
    service.setContext({ value: 'external' })
    expectMatrix(api(), 'external', replacement)
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('exports the scoped frame with custom IDs without mutating it or choosing a duplicate document ID', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const duplicate = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    duplicate.id = 'custom-frame'
    duplicate.setAttribute('data-sentinel', 'wrong-document-frame')
    document.body.appendChild(duplicate)
    const { api } = createCode({ value: '<script> & "🖊️"', getRootNode: () => shadow, ids: { root: 'custom-root', frame: 'custom-frame' } })
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const frameProps = api().getFrameProps()
    for (const [key, value] of Object.entries(frameProps)) svg.setAttribute(key, String(value))
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', api().getPatternProps().d)
    svg.appendChild(path)
    shadow.appendChild(svg)
    const before = svg.outerHTML
    const url = await api().getDataUrl('image/svg+xml')
    const xml = decodeURIComponent(url.slice(url.indexOf(',') + 1))
    const parsed = new DOMParser().parseFromString(xml, 'image/svg+xml')
    expect(api().getRootProps().id).toBe('custom-root')
    expect(parsed.documentElement.id).toBe('custom-frame')
    expect(parsed.querySelector('path')!.getAttribute('d')).toBe(api().getPatternProps().d)
    expect(xml).not.toContain('wrong-document-frame')
    expect(parsed.querySelector('script')).toBeNull()
    expect(svg.outerHTML).toBe(before)
    expect(svg.isConnected).toBe(true)
  })

  it('cancels default-prevented downloads and preserves each click filename', async () => {
    const { api } = createCode({ value: 'download' })
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = api().getFrameProps().id
    document.body.appendChild(svg)
    const downloaded: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloaded.push(this.download)
    })
    const cancelled = api().getDownloadTriggerProps({ mimeType: 'image/svg+xml', fileName: 'cancelled.svg' })
    expect(cancelled.type).toBe('button')
    cancelled.onClick({ defaultPrevented: true })
    await Promise.resolve()
    expect(downloaded).toEqual([])
    for (const fileName of ['first.svg', 'second.svg'])
      api().getDownloadTriggerProps({ mimeType: 'image/svg+xml', fileName }).onClick({ defaultPrevented: false })
    await vi.waitFor(() => expect(downloaded).toEqual(['first.svg', 'second.svg']))
  })
})
