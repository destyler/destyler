// @vitest-environment happy-dom
import type { ValueChangeDetails } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

type Direction = 'ltr' | 'rtl'
type Ownership = 'uncontrolled' | 'accept' | 'veto'
const services: Array<ReturnType<typeof machine>> = []
let originalStyles: Array<[HTMLElement, string | null]>

beforeEach(() => {
  originalStyles = [document.body, document.documentElement].map(element => [element, element.getAttribute('style')])
})

afterEach(() => {
  try {
    for (const service of services.splice(0).reverse())
      service.stop()
  }
  finally {
    // Scrubber style restoration is a separate known defect. Do not let these
    // direction tests erase styles owned by the browser runner or another test.
    for (const [element, style] of originalStyles) {
      if (style === null)
        element.removeAttribute('style')
      else
        element.setAttribute('style', style)
    }
  }
})

function start(dir: Direction, ownership: Ownership) {
  let service: ReturnType<typeof machine>
  const onValueChange = vi.fn(({ value }: ValueChangeDetails) => {
    if (ownership === 'accept')
      service.setContext({ value })
  })
  service = machine({
    id: 'scrubber-direction',
    dir,
    step: 2,
    focusInputOnChange: false,
    ...(ownership === 'uncontrolled' ? { defaultValue: '50' } : { value: '50' }),
    onValueChange,
  })
  // Pointer-lock permission is separate from direction mapping. Keep the real
  // mouse listener, cursor, and state transitions in both DOM environments.
  service.setOptions({ activities: { activatePointerLock() {} } })
  services.push(service)
  service.start()
  service.send({ type: 'SCRUBBER.PRESS_DOWN', point: { x: 100, y: 100 } })
  return { service, onValueChange }
}

function move(x: number, y = 2) {
  const event = new MouseEvent('mousemove', { bubbles: true })
  Object.defineProperties(event, {
    movementX: { value: x },
    movementY: { value: y },
  })
  document.dispatchEvent(event)
}

describe.each<Ownership>(['uncontrolled', 'accept', 'veto'])('scrubber direction with %s ownership', (ownership) => {
  it.each([
    ['ltr', 5, '52'],
    ['ltr', -5, '48'],
    ['ltr', 0, '50'],
    ['rtl', 5, '48'],
    ['rtl', -5, '52'],
    ['rtl', 0, '50'],
  ] as const)('%s movement %s proposes %s', (dir, x, value) => {
    const { service, onValueChange } = start(dir, ownership)
    move(x)

    expect(service.state.context.value).toBe(ownership === 'veto' ? '50' : value)
    if (x === 0) {
      expect(onValueChange).not.toHaveBeenCalled()
      expect(service.state.context.scrubberCursorPoint).toEqual({ x: 100, y: 100 })
    }
    else {
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value, valueAsNumber: Number(value) })
      // Direction changes numeric intent, not the physical cursor movement.
      expect(service.state.context.scrubberCursorPoint).toEqual({ x: 100 + x, y: 102 })
    }
  })
})

it('uses the current writing direction during a scrub', () => {
  const { service, onValueChange } = start('ltr', 'uncontrolled')
  move(5)
  service.setContext({ dir: 'rtl' })
  move(5)
  expect(service.state.context.value).toBe('50')
  expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['52', '50'])
  expect(service.state.context.scrubberCursorPoint).toEqual({ x: 110, y: 104 })
})

it.each(['release', 'stop'] as const)('stops interpreting movement after %s', (end) => {
  const { service, onValueChange } = start('rtl', 'uncontrolled')
  move(-5)
  if (end === 'release')
    document.dispatchEvent(new MouseEvent('mouseup'))
  else
    service.stop()
  move(5)
  expect(service.state.context.value).toBe('52')
  expect(onValueChange).toHaveBeenCalledTimes(1)
  expect(document.getElementById('number-input:scrubber-direction:cursor')).toBeNull()
})

it.each<Direction>(['ltr', 'rtl'])('ignores subpixel noise and follows repeated/sign-changing motion in %s', (dir) => {
  const { service, onValueChange } = start(dir, 'uncontrolled')
  const dpr = window.devicePixelRatio
  move(0.24 / dpr)
  move(-0.24 / dpr)
  expect(onValueChange).not.toHaveBeenCalled()
  move(0.75 / dpr)
  move(0.75 / dpr)
  move(-0.75 / dpr)
  const values = dir === 'ltr' ? ['52', '54', '52'] : ['48', '46', '48']
  expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(values)
  expect(service.state.context.value).toBe(values[2])
  expect(service.state.context.scrubberCursorPoint).toEqual({ x: 100 + 1 / dpr, y: 106 })
})
