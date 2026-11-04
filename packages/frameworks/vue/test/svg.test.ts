// @vitest-environment happy-dom
import type { App } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { computed, createApp, createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
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

describe('vue QR SVG attributes', () => {
  it.each(['mount', 'hydrate'])('preserves the real QR viewBox through %s, updates, and SVG export', async (mode) => {
    let updateValue!: (value: string) => void
    let exportSvg!: () => Promise<string>
    let encodedSize = 0
    const component = defineComponent({
      setup() {
        const [state, send] = useMachine(qrCode.machine({ id: `vue-qr-${mode}`, value: 'https://destyler.org' }))
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
    })

    host = document.createElement('div')
    document.body.appendChild(host)
    if (mode === 'hydrate') {
      const html = await renderToString(createSSRApp(component))
      expect(html).toContain(`viewBox="0 0 ${encodedSize} ${encodedSize}"`)
      expect(html).not.toContain('viewbox=')
      host.innerHTML = html
      app = createSSRApp(component)
    }
    else {
      app = createApp(component)
    }
    app.mount(host)
    await nextTick()

    const svg = host.querySelector('svg')!
    const path = svg.querySelector('path')!
    const initialPath = path.getAttribute('d')
    const initialSize = encodedSize
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${encodedSize} ${encodedSize}`)
    expect(svg.hasAttribute('viewbox')).toBe(false)
    expect(initialPath).toBeTruthy()

    updateValue(`https://destyler.org/${'larger-qr-payload/'.repeat(12)}`)
    await nextTick()
    await expect.poll(() => encodedSize).toBeGreaterThan(initialSize)
    expect(path.getAttribute('d')).not.toBe(initialPath)
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${encodedSize} ${encodedSize}`)
    expect(svg.hasAttribute('viewbox')).toBe(false)

    const dataUrl = await exportSvg()
    const xml = new DOMParser().parseFromString(decodeURIComponent(dataUrl.split(',')[1]), 'image/svg+xml')
    expect(xml.documentElement.getAttribute('viewBox')).toBe(`0 0 ${encodedSize} ${encodedSize}`)
    expect(xml.documentElement.hasAttribute('viewbox')).toBe(false)
    expect(xml.querySelector('path')!.getAttribute('d')).toBe(path.getAttribute('d'))
  })
})
