import type { App } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { computed, createApp, defineComponent, h, nextTick } from 'vue'
import * as qrCode from '../../../components/qr-code'
import { normalizeProps, useMachine } from '../index'

let app: App | undefined
let host: HTMLDivElement | undefined

afterEach(() => {
  app?.unmount()
  host?.remove()
  app = undefined
  host = undefined
})

function mount(component: ReturnType<typeof defineComponent>) {
  host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp(component)
  app.mount(host)
}

describe('vue SVG normalization', () => {
  it('renders and updates the real QR machine at its encoded viewBox and exports that viewBox', async () => {
    let updateValue!: (value: string) => void
    let exportSvg!: () => Promise<string>
    let encodedSize = 0
    mount(defineComponent({
      setup() {
        const [state, send] = useMachine(qrCode.machine({ id: 'vue-svg-qr', value: 'https://destyler.org' }))
        const api = computed(() => qrCode.connect(state.value, send, normalizeProps))
        updateValue = value => api.value.setValue(value)
        exportSvg = () => api.value.getDataUrl('image/svg+xml')
        return () => {
          encodedSize = state.value.context.encoded.size * state.value.context.pixelSize
          return h('div', api.value.getRootProps(), [
            h('svg', { ...api.value.getFrameProps(), width: 160, height: 160 }, [
              h('path', api.value.getPatternProps()),
            ]),
          ])
        }
      },
    }))
    await nextTick()

    const svg = host!.querySelector('svg')!
    const path = svg.querySelector('path')!
    const initialPath = path.getAttribute('d')
    const initialSize = encodedSize
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${encodedSize} ${encodedSize}`)
    expect(svg.hasAttribute('viewbox')).toBe(false)
    expect(svg.viewBox.baseVal.width).toBe(encodedSize)
    expect(svg.getScreenCTM()!.a).toBeCloseTo(160 / encodedSize)
    expect(initialPath).toBeTruthy()

    updateValue(`https://destyler.org/${'larger-qr-payload/'.repeat(12)}`)
    await nextTick()
    await expect.poll(() => encodedSize).toBeGreaterThan(initialSize)
    expect(path.getAttribute('d')).not.toBe(initialPath)
    expect(svg.viewBox.baseVal.width).toBe(encodedSize)
    expect(svg.getScreenCTM()!.a).toBeCloseTo(160 / encodedSize)

    const dataUrl = await exportSvg()
    const document = new DOMParser().parseFromString(decodeURIComponent(dataUrl.split(',')[1]), 'image/svg+xml')
    expect(document.documentElement.getAttribute('viewBox')).toBe(`0 0 ${encodedSize} ${encodedSize}`)
    expect(document.documentElement.hasAttribute('viewbox')).toBe(false)
    expect(document.querySelector('path')!.getAttribute('d')).toBe(path.getAttribute('d'))
  })

  it('uses native SVG spellings for aspect ratios, presentation attributes, and namespaced links', async () => {
    mount(defineComponent({
      setup: () => () => h('svg', normalizeProps.svg({
        viewBox: '0 0 100 100',
        preserveAspectRatio: 'none',
        width: 200,
        height: 100,
      }), [
        h('path', normalizeProps.path({
          id: 'normalized-path',
          d: 'M0 0h100v100H0z',
          stroke: 'black',
          strokeWidth: 4,
          strokeLinecap: 'round',
          fillRule: 'evenodd',
          clipRule: 'evenodd',
        })),
        h('use', normalizeProps.element({ xlinkHref: '#normalized-path' })),
      ]),
    }))
    await nextTick()

    const svg = host!.querySelector('svg')!
    const path = svg.querySelector('path')!
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none')
    expect(svg.getScreenCTM()!.a).toBe(2)
    expect(svg.getScreenCTM()!.d).toBe(1)
    expect(path.getAttribute('stroke-width')).toBe('4')
    expect(path.hasAttribute('strokewidth')).toBe(false)
    expect(getComputedStyle(path).strokeWidth).toBe('4px')
    expect(getComputedStyle(path).strokeLinecap).toBe('round')
    expect(getComputedStyle(path).fillRule).toBe('evenodd')
    expect(getComputedStyle(path).clipRule).toBe('evenodd')
    expect(svg.querySelector('use')!.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toBe('#normalized-path')
  })
})
