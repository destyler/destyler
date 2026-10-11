// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
function setup(context: Partial<UserDefinedContext> = {}) {
  const control = document.createElement('div')
  control.id = 'signature-control-events'
  control.setPointerCapture = vi.fn()
  control.getBoundingClientRect = () => DOMRect.fromRect({ x: 20, y: 30, width: 300, height: 160 })
  document.body.appendChild(control)
  const service = machine({ id: 'events', ...context }).start()
  services.push(service)
  const api = () => connect(service.state, service.send, normalize)
  const pointerDown = (extra: Record<string, unknown> = {}) => api().getControlProps().onPointerDown({
    defaultPrevented: false,
    button: 0,
    pointerType: 'pen',
    pointerId: 1,
    pressure: 0.5,
    clientX: 30,
    clientY: 40,
    currentTarget: control,
    target: control,
    ...extra,
  })
  const draw = () => {
    pointerDown()
    document.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'pen', pointerId: 1, button: -1, buttons: 1, clientX: 80, clientY: 70, pressure: 0.5 }))
    document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'pen', pointerId: 1 }))
  }
  return { service, control, api, pointerDown, draw }
}
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
})

describe('signature user event guards', () => {
  it('does not capture or draw a default-prevented pointer down', () => {
    const { api, pointerDown, control } = setup()
    pointerDown({ defaultPrevented: true })
    expect(control.setPointerCapture).not.toHaveBeenCalled()
    expect(api().drawing).toBe(false)
    expect(api().currentPath).toBeNull()
  })

  it.each([{ button: 1 }, { button: 2 }, { ctrlKey: true }, { metaKey: true }, { altKey: true }])('ignores ineligible pointer input %s', (extra) => {
    const { api, pointerDown, control } = setup()
    pointerDown(extra)
    expect(control.setPointerCapture).not.toHaveBeenCalled()
    expect(api().drawing).toBe(false)
  })

  it.each(['disabled', 'readOnly'] as const)('prevents new strokes and clear-trigger edits when %s', (key) => {
    const onDrawEnd = vi.fn()
    const { service, api, draw, pointerDown } = setup({ onDrawEnd })
    draw()
    const paths = [...api().paths]
    expect(paths).toHaveLength(1)
    onDrawEnd.mockClear()
    service.setContext({ [key]: true })
    pointerDown()
    expect(api().drawing).toBe(false)
    const clear = api().getClearTriggerProps()
    expect(clear.disabled).toBe(true)
    clear.onClick({ defaultPrevented: false })
    expect(api().paths).toEqual(paths)
    expect(onDrawEnd).not.toHaveBeenCalled()
  })

  it('preserves completed paths when clear click was default-prevented', () => {
    const onDrawEnd = vi.fn()
    const { api, draw } = setup({ onDrawEnd })
    draw()
    const paths = [...api().paths]
    onDrawEnd.mockClear()
    api().getClearTriggerProps().onClick({ defaultPrevented: true })
    expect(api().paths).toEqual(paths)
    expect(onDrawEnd).not.toHaveBeenCalled()
  })

  it('still allows the imperative clear API when the pad is read-only', () => {
    const { service, api, draw } = setup()
    draw()
    service.setContext({ readOnly: true })
    api().clear()
    expect(api().paths).toEqual([])
  })
})
