// @vitest-environment happy-dom
import type { ChannelSliderProps, Context } from '../index'
import { parseColor } from '@destyler/color'
import { normalizeProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const services: Array<ReturnType<typeof machine>> = []

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
})

function setup(context: Partial<Context> = {}) {
  const service = machine({ id: 'keyboard-color', defaultOpen: true, ...context })
  services.push(service)
  service.start()
  const api = () => connect(service.state, service.send, normalizeProps)
  const press = (props: ChannelSliderProps, key: string, options: KeyboardEventInit = {}, canceled = false) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
    if (canceled)
      event.preventDefault()
    api().getChannelSliderThumbProps(props).onkeydown(event)
    return event
  }
  return { service, api, press }
}

describe('color-picker channel slider keyboard routes', () => {
  it('edits the displayed channel space for default, HSL, HSB, and RGB sliders', () => {
    const cases = [
      { seed: '#FF0000', props: { channel: 'hue' }, expected: { h: 1, s: 100, b: 100, a: 1 } },
      { seed: 'hsba(120,50%,50%,1)', props: { channel: 'saturation', format: 'hsla' }, expected: { h: 120, s: 34, l: 37.5, a: 1 } },
      { seed: 'hsl(0,100%,20%)', props: { channel: 'brightness', format: 'hsba' }, expected: { h: 0, s: 100, b: 41, a: 1 } },
      { seed: 'hsl(0,100%,50%)', props: { channel: 'blue', format: 'rgba' }, expected: { r: 255, g: 0, b: 1, a: 1 } },
    ] as const

    for (const { seed, props, expected } of cases) {
      const onValueChange = vi.fn()
      const onValueChangeEnd = vi.fn()
      const onFormatChange = vi.fn()
      const { api, press } = setup({ defaultValue: parseColor(seed), onValueChange, onValueChangeEnd, onFormatChange })
      expect(press(props, 'ArrowRight').defaultPrevented).toBe(true)
      expect(api().value.toJSON()).toEqual(expected)
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith({
        value: api().value.toFormat('rgba'),
        valueAsString: api().valueAsString,
      })
      expect(api().format).toBe('rgba')
      expect(onFormatChange).not.toHaveBeenCalled()
      expect(onValueChangeEnd).not.toHaveBeenCalled()
    }
  })

  it('uses the rendered HSL area when no slider format is provided', () => {
    const { api, press } = setup({ format: 'hsla', defaultValue: parseColor('hsba(120,50%,50%,1)') })
    press({ channel: 'saturation' }, 'ArrowRight')
    expect(api().value.toJSON()).toEqual({ h: 120, s: 34, l: 37.5, a: 1 })
  })

  it('uses finite page steps and retains unrelated fractional channels for alpha edits', () => {
    const onValueChange = vi.fn()
    const { api, press } = setup({ defaultValue: parseColor('rgba(12.5,25.25,50.125,0.5)'), onValueChange })
    const slider = { channel: 'alpha' } as const
    press(slider, 'PageUp')
    expect(api().value.toJSON()).toEqual({ r: 12.5, g: 25.25, b: 50.125, a: 0.6 })
    press(slider, 'PageDown')
    expect(api().alpha).toBe(0.5)
    press(slider, 'ArrowRight', { shiftKey: true })
    expect(api().alpha).toBe(0.6)
    press(slider, 'Home')
    expect(api().alpha).toBe(0)
    press(slider, 'ArrowLeft')
    expect(api().alpha).toBe(0)
    press(slider, 'End')
    expect(api().alpha).toBe(1)
    press(slider, 'ArrowRight')
    expect(api().alpha).toBe(1)
    expect(onValueChange).toHaveBeenCalledTimes(5)
    expect(api().value.toJSON()).toEqual({ r: 12.5, g: 25.25, b: 50.125, a: 1 })
  })

  it('applies Home, End, and page keys to the explicit RGB space and its range', () => {
    const { api, press } = setup({ defaultValue: parseColor('hsl(120,100%,50%)') })
    const slider = { channel: 'red', format: 'rgba' } as const
    const props = api().getChannelSliderThumbProps(slider)
    expect(props['aria-valuemin']).toBe(0)
    expect(props['aria-valuemax']).toBe(255)
    press(slider, 'PageUp')
    expect(api().value.getChannelValue('red')).toBe(10)
    press(slider, 'PageDown')
    expect(api().value.getChannelValue('red')).toBe(0)
    press(slider, 'End')
    expect(api().value.getChannelValue('red')).toBe(255)
    press(slider, 'Home')
    expect(api().value.getChannelValue('red')).toBe(0)
  })

  it('does not change color for canceled, disabled, read-only, or unrelated keys', () => {
    for (const context of [{}, { disabled: true }, { readOnly: true }]) {
      const onValueChange = vi.fn()
      const { api, press } = setup({ defaultValue: parseColor('#FF0000'), onValueChange, ...context })
      const original = api().value.toJSON()
      press({ channel: 'hue' }, 'ArrowRight', {}, true)
      if (context.disabled || context.readOnly)
        expect(press({ channel: 'hue' }, 'ArrowRight').defaultPrevented).toBe(false)
      expect(press({ channel: 'hue' }, 'a').defaultPrevented).toBe(false)
      expect(api().value.toJSON()).toEqual(original)
      expect(onValueChange).not.toHaveBeenCalled()
    }
  })

  it('defers controlled channel proposals until acceptance without end or format callbacks', () => {
    let proposed = parseColor('#FF0000')
    let service: ReturnType<typeof machine>
    let accept = false
    const log: Array<{ type: string, value: string }> = []
    const { api, press, service: running } = setup({
      format: 'hsba',
      value: proposed,
      onValueChange: (details) => {
        proposed = details.value
        log.push({ type: 'change', value: details.valueAsString })
        if (accept)
          service.setContext({ value: proposed })
      },
      onValueChangeEnd: () => log.push({ type: 'end', value: '' }),
      onFormatChange: () => log.push({ type: 'format', value: '' }),
    })
    service = running
    press({ channel: 'hue' }, 'ArrowRight')
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(proposed.toJSON()).toEqual({ h: 1, s: 100, b: 100, a: 1 })
    expect(log).toEqual([{ type: 'change', value: 'hsba(1, 100%, 100%, 1)' }])

    // A vetoed proposal does not become the base for the next key press.
    press({ channel: 'hue' }, 'ArrowRight')
    expect(proposed.getChannelValue('hue')).toBe(1)
    service.setContext({ value: proposed })
    expect(api().value.getChannelValue('hue')).toBe(1)
    expect(log).toHaveLength(2)

    accept = true
    press({ channel: 'hue' }, 'ArrowRight')
    expect(api().value.getChannelValue('hue')).toBe(2)
    expect(log).toEqual([
      { type: 'change', value: 'hsba(1, 100%, 100%, 1)' },
      { type: 'change', value: 'hsba(1, 100%, 100%, 1)' },
      { type: 'change', value: 'hsba(2, 100%, 100%, 1)' },
    ])
  })
})
