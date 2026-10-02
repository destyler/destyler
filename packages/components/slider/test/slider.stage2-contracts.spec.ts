import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const cleanups: Array<() => void> = []

afterEach(async () => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  // Drain the existing uncancelled focus RAF after detached fixtures are removed.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  vi.restoreAllMocks()
})

function start(props: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'stage2-slider', thumbAlignment: 'center', ...props })
  service.start()
  cleanups.push(() => service.stop())
  const api = () => connect(service.getState(), service.send, normalize)
  return { service, api }
}

function mount(props: Partial<UserDefinedContext> = {}, doc = document) {
  const root = doc.createElement('div')
  root.id = 'slider:stage2-slider'
  const control = doc.createElement('div')
  control.id = 'slider:stage2-slider:control'
  control.style.cssText = 'position:relative;width:200px;height:200px;'
  root.append(control)
  doc.body.append(root)
  cleanups.push(() => root.remove())
  const result = start({ ...props, getRootNode: () => doc })
  const thumbs = (props.value ?? props.defaultValue ?? [0]).map((_, index) => {
    const thumb = doc.createElement('div')
    thumb.id = `slider:stage2-slider:thumb:${index}`
    thumb.tabIndex = 0
    thumb.setAttribute('role', 'slider')
    const input = doc.createElement('input')
    input.id = `slider:stage2-slider:input:${index}`
    input.hidden = true
    input.value = String(result.api().value[index])
    thumb.append(input)
    control.append(thumb)
    thumb.addEventListener('focus', event => result.api().getThumbProps({ index }).onFocus(event))
    thumb.addEventListener('blur', event => result.api().getThumbProps({ index }).onBlur(event))
    thumb.addEventListener('keydown', event => result.api().getThumbProps({ index }).onKeyDown(event))
    thumb.addEventListener('pointerdown', event => result.api().getThumbProps({ index }).onPointerDown(event))
    return thumb
  })
  control.addEventListener('pointerdown', event => result.api().getControlProps().onPointerDown(event))
  return { ...result, root, control, thumbs }
}

function trackPointerListeners(doc: Document) {
  const add = vi.spyOn(doc, 'addEventListener')
  const remove = vi.spyOn(doc, 'removeEventListener')
  const types = ['pointermove', 'pointerup', 'pointercancel', 'contextmenu']
  const registrations = () => add.mock.calls.filter(([type]) => types.includes(type))
  cleanups.push(() => {
    registrations().forEach(([type, callback, options]) => doc.removeEventListener(type, callback, options))
  })
  return () => {
    expect(registrations().map(([type]) => type).sort()).toEqual([...types].sort())
    for (const [type, callback, options] of registrations()) {
      expect(options).toBe(false)
      expect(remove.mock.calls.filter(([removedType, removedCallback, removedOptions]) => (
        removedType === type && removedCallback === callback && removedOptions === options
      ))).toHaveLength(1)
    }
  }
}

function key(thumb: HTMLElement, value: string, shiftKey = false) {
  thumb.dispatchEvent(new KeyboardEvent('keydown', { key: value, shiftKey, bubbles: true, cancelable: true }))
}

function pointer(target: EventTarget, type: string, x: number, y: number) {
  target.dispatchEvent(new PointerEvent(type, {
    clientX: x,
    clientY: y,
    pointerType: 'touch',
    pointerId: 1,
    bubbles: true,
    cancelable: true,
  }))
}

describe('slider step-scaled thumb constraints and owner controls', () => {
  it('preserves parent ownership across controlled veto, delayed acceptance and shorter arrays', () => {
    const onValueChange = vi.fn()
    const original = [20, 60]
    const { service, api } = start({ value: original, onValueChange })
    api().setThumbValue(1, 70)
    api().setThumbValue(0, 25)
    expect(api().value).toEqual([20, 60])
    expect(original).toEqual([20, 60])
    expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual([[20, 70], [25, 60]])
    service.setContext({ value: [20, 70] })
    api().setThumbValue(0, 25)
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [25, 70] })
    api().setValue([40])
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [40] })
    expect(api().value).toEqual([20, 70])
    service.setContext({ value: [40] })
    expect(api().value).toEqual([40])
    api().setValue([])
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [] })
    expect(api().value).toEqual([40])
    service.setContext({ value: [] })
    expect(api().value).toEqual([])
  })

  it.each([
    { step: 5, values: [20, 60], gap: 2, firstMax: 50, secondMin: 30 },
    { step: 0.25, values: [1, 4], gap: 2, firstMax: 3.5, secondMin: 1.5 },
    { step: 1, values: [20, 60], gap: 0, firstMax: 60, secondMin: 20 },
    { step: 1, values: [20, 60], gap: 2, firstMax: 58, secondMin: 22 },
    { step: 5, values: [-60, -20], min: -100, gap: 2, firstMax: -30, secondMin: -50 },
  ])('uses $gap steps of size $step for adjacent thumb bounds', ({ step, values, min = 0, gap, firstMax, secondMin }) => {
    const { api } = start({ defaultValue: values, min, step, minStepsBetweenThumbs: gap })
    expect(api().value).toEqual(values)
    expect(api().getThumbMax(0)).toBe(firstMax)
    expect(api().getThumbMin(1)).toBe(secondMin)
    expect(api().getThumbProps({ index: 0 })['aria-valuemax']).toBe(firstMax)
    expect(api().getThumbProps({ index: 1 })['aria-valuemin']).toBe(secondMin)
    api().setThumbValue(0, 100)
    expect(api().value).toEqual([firstMax, values[1]])
    api().setValue(values)
    api().setThumbPercent(1, 0)
    expect(api().value).toEqual([values[0], secondMin])
  })

  it('clamps both keyboard directions and Home/End to the step-scaled neighbour bounds', () => {
    const { api, thumbs } = mount({ defaultValue: [20, 60], step: 5, minStepsBetweenThumbs: 2 })
    thumbs[0].focus()
    key(thumbs[0], 'End')
    expect(api().value).toEqual([50, 60])
    key(thumbs[0], 'ArrowRight')
    expect(api().value).toEqual([50, 60])
    api().setValue([20, 60])
    thumbs[1].focus()
    key(thumbs[1], 'Home')
    expect(api().value).toEqual([20, 30])
    key(thumbs[1], 'ArrowLeft')
    expect(api().value).toEqual([20, 30])
  })

  it.each([
    { dir: 'ltr' as const, orientation: 'horizontal' as const, up: 'ArrowRight', down: 'ArrowLeft' },
    { dir: 'rtl' as const, orientation: 'horizontal' as const, up: 'ArrowLeft', down: 'ArrowRight' },
    { dir: 'rtl' as const, orientation: 'vertical' as const, up: 'ArrowUp', down: 'ArrowDown' },
  ])('keeps $orientation/$dir keyboard increments and focus on the active thumb', ({ dir, orientation, up, down }) => {
    const { api, thumbs } = mount({ defaultValue: [20, 60], step: 5, dir, orientation })
    thumbs[1].focus()
    key(thumbs[1], up)
    expect(api().value).toEqual([20, 65])
    key(thumbs[1], down)
    expect(api().value).toEqual([20, 60])
    expect(document.activeElement).toBe(thumbs[1])
  })

  it.each(['disabled', 'readOnly'] as const)('blocks pointer and keyboard value requests when initially %s', (prop) => {
    const onValueChange = vi.fn()
    const { api, control, thumbs } = mount({ defaultValue: [20, 60], [prop]: true, onValueChange })
    thumbs[0].focus()
    key(thumbs[0], 'ArrowRight')
    pointer(thumbs[0], 'pointerdown', 20, 20)
    pointer(control, 'pointerdown', 150, 20)
    pointer(document, 'pointermove', 180, 20)
    pointer(document, 'pointerup', 180, 20)
    expect(api().value).toEqual([20, 60])
    expect(api().dragging).toBe(false)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('constrains dragging and removes document listeners after pointer cancellation', () => {
    const onValueChangeEnd = vi.fn()
    const { api, control, thumbs } = mount({ defaultValue: [20, 60], step: 5, minStepsBetweenThumbs: 2, onValueChangeEnd })
    const assertListenersReleased = trackPointerListeners(document)
    const { x, y } = control.getBoundingClientRect()
    pointer(thumbs[0], 'pointerdown', x + 40, y + 20)
    expect(api().dragging).toBe(true)
    pointer(document, 'pointermove', x + 190, y + 20)
    expect(api().value).toEqual([50, 60])
    pointer(document, 'pointercancel', x + 190, y + 20)
    expect(api().dragging).toBe(false)
    assertListenersReleased()
    expect(onValueChangeEnd).toHaveBeenCalledExactlyOnceWith({ value: [50, 60] })
    pointer(document, 'pointermove', x + 10, y + 20)
    expect(api().value).toEqual([50, 60])
  })

  it('tracks the owning document and releases its drag listener when stopped', () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    cleanups.push(() => iframe.remove())
    const doc = iframe.contentDocument!
    const { service, api, control, thumbs } = mount({ defaultValue: [20, 60] }, doc)
    const assertListenersReleased = trackPointerListeners(doc)
    const { x, y } = control.getBoundingClientRect()
    pointer(thumbs[1], 'pointerdown', x + 120, y + 20)
    pointer(document, 'pointermove', x + 180, y + 20)
    expect(api().value).toEqual([20, 60])
    pointer(doc, 'pointermove', x + 180, y + 20)
    expect(api().value).toEqual([20, 90])
    service.stop()
    assertListenersReleased()
    pointer(doc, 'pointermove', x + 150, y + 20)
    expect(api().value).toEqual([20, 90])
  })
})
