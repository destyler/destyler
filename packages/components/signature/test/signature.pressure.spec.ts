// Native companion: snapshot event pressure before dispatch; preserve the original source fixture.
import type { UserDefinedContext } from '../src/types'
import getStroke from 'perfect-freehand'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'
import { getSvgPathFromStroke } from '../src/utils/get-svg-path'

const services: ReturnType<typeof machine>[] = []
const controls: HTMLElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any

function createSignature(context: Partial<UserDefinedContext> = {}) {
  const control = document.createElement('div')
  control.id = 'signature-control-pressure'
  control.getBoundingClientRect = () => DOMRect.fromRect({ x: 20, y: 30, width: 300, height: 160 })
  control.setPointerCapture = () => {}
  document.body.appendChild(control)
  controls.push(control)
  const service = machine({ id: 'pressure', drawing: { size: 10 }, ...context }).start()
  services.push(service)
  return { service, control, api: () => connect(service.state, service.send, normalize) }
}

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const control of controls.splice(0)) control.remove()
})

describe('signature pointer pressure', () => {
  it.each([['pen', 0], ['pen', 0.2], ['pen', 0.9], ['touch', 0.4], ['mouse', 0.5]] as const)('preserves %s pressure %s in initial and moving samples', (pointerType, pressure) => {
    const { service, control, api } = createSignature()
    const points = [{ x: 10, y: 10, pressure }, { x: 70, y: 45, pressure }, { x: 140, y: 80, pressure }]
    api().getControlProps().onPointerDown({
      button: 0,
      pointerId: 1,
      pointerType,
      pressure,
      clientX: 30,
      clientY: 40,
      currentTarget: control,
      target: control,
    })
    expect(service.state.context.currentPoints).toEqual(points.slice(0, 1))
    const expectedPoints: { x: number, y: number, pressure: number }[] = [points[0]]
    for (const point of points.slice(1)) {
      const event = new PointerEvent('pointermove', {
        pointerId: 1,
        pointerType,
        button: -1,
        buttons: 1,
        clientX: point.x + 20,
        clientY: point.y + 30,
        pressure: point.pressure,
      })
      expectedPoints.push({ x: point.x, y: point.y, pressure: event.pressure })
      document.dispatchEvent(event)
    }
    expect(service.state.context.currentPoints).toEqual(expectedPoints)
    const expectedPath = getSvgPathFromStroke(getStroke(expectedPoints, service.state.context.drawing))
    expect(api().currentPath).toBe(expectedPath)
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, pointerType }))
    expect(api().paths).toEqual([expectedPath])
  })

  it.each([false, true])('passes the simulatePressure option to the stroke generator (simulatePressure=%s)', (simulatePressure) => {
    const { service, control, api } = createSignature({ drawing: { size: 10, simulatePressure } })
    const draw = (pressure: number) => {
      const expectedPoints = [{ x: 10, y: 10, pressure }]
      api().getControlProps().onPointerDown({
        button: 0,
        pointerId: 1,
        pointerType: 'pen',
        pressure,
        clientX: 30,
        clientY: 40,
        currentTarget: control,
        target: control,
      })
      for (const [clientX, clientY] of [[100, 70], [170, 100]]) {
        const event = new PointerEvent('pointermove', {
          pointerId: 1,
          pointerType: 'pen',
          button: -1,
          buttons: 1,
          clientX,
          clientY,
          pressure,
        })
        expectedPoints.push({ x: clientX - 20, y: clientY - 30, pressure: event.pressure })
        document.dispatchEvent(event)
      }
      expect(service.state.context.currentPoints).toEqual(expectedPoints)
      document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, pointerType: 'pen' }))
      const expected = getSvgPathFromStroke(getStroke(expectedPoints, service.state.context.drawing))
      expect(api().paths.at(-1)).toBe(expected)
      return api().paths.at(-1)
    }
    const light = draw(0.1)
    const heavy = draw(0.9)
    // The generator also uses the supplied initial pressure while simulating.
    // Do not normalize or discard it in either mode.
    expect(light).not.toBe(heavy)
  })
})
