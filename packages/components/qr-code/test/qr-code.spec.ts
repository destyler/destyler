import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/QRCode'

const { getDataUrlMock } = vi.hoisted(() => ({
  getDataUrlMock: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
}))

vi.mock('@destyler/dom', async () => {
  const actual = await vi.importActual<typeof import('@destyler/dom')>('@destyler/dom')
  return {
    ...actual,
    getDataUrl: getDataUrlMock,
  }
})

let mount: HTMLElement | null = null

function getPartEl<T extends Element = Element>(part: string) {
  return document.querySelector<T>(`[data-scope="qr-code"][data-part="${part}"]`)
}

function getPatternPath() {
  return getPartEl<SVGPathElement>('pattern')
}

function getVisualizerText() {
  return document.querySelector('.viz')?.textContent ?? ''
}

describe('qr-code browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
    getDataUrlMock.mockClear()
  })

  it('renders all qr-code parts with computed styles', () => {
    const root = getPartEl<HTMLElement>('root')
    const frame = getPartEl<SVGSVGElement>('frame')
    const pattern = getPatternPath()
    const overlay = getPartEl<HTMLElement>('overlay')

    expect(root).not.toBeNull()
    expect(root!.style.getPropertyValue('--qrcode-pixel-size')).toBe('10px')
    expect(root!.style.getPropertyValue('--qrcode-width')).not.toBe('')

    expect(frame).not.toBeNull()
    expect(frame!.tagName.toLowerCase()).toBe('svg')

    expect(pattern).not.toBeNull()
    expect(pattern!.getAttribute('d')).toMatch(/^M/)

    expect(overlay).not.toBeNull()
    expect(overlay!.style.position).toBe('absolute')
  })

  it('updates pattern path when the value control changes', async () => {
    const pattern = getPatternPath()
    expect(pattern).not.toBeNull()

    const initialPath = pattern!.getAttribute('d') ?? ''
    const valueInput = page.getByTestId('value')

    await valueInput.click()
    await valueInput.fill('https://destyler.org/docs')
    await testHook.pressKey('Enter')
    await testHook.waitFor()

    const nextPath = pattern!.getAttribute('d') ?? ''
    expect(nextPath).not.toBe(initialPath)
  })

  it('reflects encoding.ecc changes in the visualized state', async () => {
    expect(getVisualizerText()).toContain('"ecc": "H"')

    await page.getByTestId('encoding.ecc').selectOptions('L')

    await vi.waitFor(() => {
      expect(getVisualizerText()).toContain('"ecc": "L"')
    })
  })

  it('boostEcc toggle updates the visualized state', async () => {
    expect(getVisualizerText()).toContain('"boostEcc": false')

    await page.getByTestId('encoding.boostEcc').click()

    await vi.waitFor(() => {
      expect(getVisualizerText()).toContain('"boostEcc": true')
    })
  })

  it('download trigger requests a data url', async () => {
    const downloadTrigger = page.getByTestId('qr-code:download')

    await downloadTrigger.click()

    await vi.waitFor(() => {
      expect(getDataUrlMock).toHaveBeenCalledTimes(1)
    })

    const [svgEl, options] = getDataUrlMock.mock.calls[0]

    expect(svgEl).toBeInstanceOf(SVGSVGElement)
    expect(options).toMatchObject({ type: 'image/png', quality: 0.92 })
  })
})
