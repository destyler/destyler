// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
function createSignature() {
  const control = document.createElement('div')
  control.id = 'signature-control-clear'
  control.tabIndex = 0
  control.setPointerCapture = () => {}
  document.body.appendChild(control)
  const onDraw = vi.fn()
  const onDrawEnd = vi.fn()
  const service = machine({ id: 'clear', onDraw, onDrawEnd }).start()
  services.push(service)
  return { service, control, onDraw, onDrawEnd, api: () => connect(service.state, service.send, normalize) }
}
function beginStroke(service: ReturnType<typeof machine>) {
  const api = connect(service.state, service.send, normalize)
  const control = document.getElementById('signature-control-clear')!
  api.getControlProps().onPointerDown({
    button: 0,
    pointerType: 'pen',
    pointerId: 1,
    pressure: 0.5,
    clientX: 10,
    clientY: 10,
    target: control,
    currentTarget: control,
  })
  document.dispatchEvent(new PointerEvent('pointermove', {
    pointerType: 'pen',
    pointerId: 1,
    button: -1,
    buttons: 1,
    clientX: 80,
    clientY: 30,
    pressure: 0.5,
  }))
}
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

describe('signature clear interruption', () => {
  it('clears an in-progress stroke and ignores the interrupted gesture until the next pointer down', async () => {
    const { service, api, onDraw, onDrawEnd, control } = createSignature()
    beginStroke(service)
    const interruptedPath = api().currentPath
    expect(interruptedPath).toBeTruthy()
    expect(onDraw).toHaveBeenCalledTimes(1)
    api().clear()
    expect(api().drawing).toBe(false)
    expect(api().empty).toBe(true)
    expect(api().currentPath).toBeNull()
    expect(api().paths).toEqual([])
    expect(service.state.context.currentPoints).toEqual([])
    expect(onDrawEnd).toHaveBeenCalledTimes(1)
    expect(onDrawEnd.mock.calls[0][0].paths).toEqual([])
    await expect(onDrawEnd.mock.calls[0][0].getDataUrl('image/svg+xml')).resolves.toBe('')
    onDraw.mockClear()
    service.send({ type: 'POINTER_MOVE', point: { x: 100, y: 40 }, pressure: 0.5 })
    service.send({ type: 'POINTER_UP' })
    document.dispatchEvent(new PointerEvent('pointerup'))
    expect(api().paths).toEqual([])
    expect(onDraw).not.toHaveBeenCalled()
    expect(onDrawEnd).toHaveBeenCalledTimes(1)
    await Promise.resolve()
    expect(document.activeElement).toBe(control)
    beginStroke(service)
    service.send({ type: 'POINTER_UP' })
    expect(api().paths).toEqual([interruptedPath])
    expect(onDrawEnd).toHaveBeenCalledTimes(2)
  })

  it('removes document listeners when clearing and does not accumulate them on repeated gestures', () => {
    const { service, api, onDrawEnd } = createSignature()
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')
    for (let i = 0; i < 2; i++) {
      beginStroke(service)
      const installed = add.mock.calls.filter(([type]) => type === 'pointermove' || type === 'pointerup')
      expect(installed).toHaveLength((i + 1) * 2)
      api().clear()
      for (const [type, callback, options] of installed)
        expect(remove).toHaveBeenCalledWith(type, callback, options)
    }
    expect(onDrawEnd).toHaveBeenCalledTimes(2)
    expect(api().currentPath).toBeNull()
    add.mockRestore()
    remove.mockRestore()
  })

  it('still clears completed strokes and supports repeated idle clears', () => {
    const { service, api, onDrawEnd } = createSignature()
    beginStroke(service)
    service.send({ type: 'POINTER_UP' })
    expect(api().empty).toBe(false)
    api().clear()
    api().clear()
    expect(api().paths).toEqual([])
    expect(api().currentPath).toBeNull()
    expect(api().drawing).toBe(false)
    expect(onDrawEnd.mock.calls.map(([details]) => details.paths.length)).toEqual([1, 0, 0])
  })
})
