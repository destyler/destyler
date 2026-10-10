// @vitest-environment happy-dom
import type { ColorFormat } from '@destyler/color'
import { parseColor } from '@destyler/color'
import { normalizeProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const services: Array<ReturnType<typeof machine>> = []

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
})

function setup(context: Parameters<typeof machine>[0]) {
  const service = machine(context)
  services.push(service)
  service.start()
  return { service, api: () => connect(service.state, service.send, normalizeProps) }
}

describe('color-picker public format API', () => {
  it('routes format changes through the same notification as the format controls', () => {
    const onValueChange = vi.fn()
    const onValueChangeEnd = vi.fn()
    const observed: Array<{ format: ColorFormat, current: ColorFormat }> = []
    const color = parseColor('rgba(25, 50, 75, 0.1234)')
    const { api } = setup({
      id: 'format-api',
      defaultValue: color,
      onValueChange,
      onValueChangeEnd,
      onFormatChange: ({ format }) => observed.push({ format, current: api().format }),
    })
    const original = color.toJSON()

    for (const format of ['hsla', 'hsba', 'rgba'] as const) {
      api().setFormat(format)
      expect(api().format).toBe(format)
      expect(api().value.toJSON()).toEqual(original)
      expect(api().valueAsString).toBe(color.toString(format))
    }

    expect(observed).toEqual([
      { format: 'hsla', current: 'hsla' },
      { format: 'hsba', current: 'hsba' },
      { format: 'rgba', current: 'rgba' },
    ])
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()

    // The other private assertFormat caller retains the same valid behavior.
    observed.length = 0
    const select = document.createElement('select')
    for (const format of ['rgba', 'hsla', 'hsba']) {
      const option = document.createElement('option')
      option.value = format
      select.append(option)
    }
    select.addEventListener('input', event => api().getFormatSelectProps().oninput(event))
    for (const format of ['hsla', 'hsba', 'rgba'] as const) {
      select.value = format
      select.dispatchEvent(new Event('input', { bubbles: true }))
      expect(api().format).toBe(format)
      expect(api().value.toJSON()).toEqual(original)
      expect(api().valueAsString).toBe(color.toString(format))
    }
    expect(observed).toEqual([
      { format: 'hsla', current: 'hsla' },
      { format: 'hsba', current: 'hsba' },
      { format: 'rgba', current: 'rgba' },
    ])
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })

  it('does not notify for any current format', () => {
    for (const format of ['rgba', 'hsla', 'hsba'] as const) {
      const onFormatChange = vi.fn()
      const onValueChange = vi.fn()
      const onValueChangeEnd = vi.fn()
      const { api } = setup({ id: `same-format-${format}`, format, onFormatChange, onValueChange, onValueChangeEnd })
      const original = api().value.toJSON()
      api().setFormat(format)
      expect(onFormatChange).not.toHaveBeenCalled()
      expect(onValueChange).not.toHaveBeenCalled()
      expect(onValueChangeEnd).not.toHaveBeenCalled()
      expect(api().format).toBe(format)
      expect(api().value.toJSON()).toEqual(original)
    }
  })

  it('rejects invalid JavaScript formats before sending or mutating state', () => {
    const invalidFormats = [
      'hex',
      'bogus',
      'RGBA',
      'rgba ',
      ' hsla',
      'hsba\n',
      '',
      undefined,
      null,
      ['rgba'],
      { toString: () => 'hsla' },
      new Object('rgba'),
    ]
    for (const format of ['rgba', 'hsla', 'hsba'] as const) {
      const onFormatChange = vi.fn()
      const onValueChange = vi.fn()
      const onValueChangeEnd = vi.fn()
      const { service, api } = setup({
        id: `invalid-format-${format}`,
        format,
        defaultValue: parseColor('rgba(25, 50, 75, 0.1234)'),
        onFormatChange,
        onValueChange,
        onValueChangeEnd,
      })
      const before = service.getState()
      const send = vi.fn(service.send)
      const currentApi = connect(service.state, send, normalizeProps)
      const original = currentApi.value.toJSON()
      for (const invalidFormat of invalidFormats) {
        // JavaScript consumers can pass values outside the TypeScript union.
        expect(() => currentApi.setFormat(invalidFormat as ColorFormat)).toThrow()
        expect(service.getState()).toEqual(before)
        expect(service.status).toBe('Running')
        expect(send).not.toHaveBeenCalled()
        expect(onFormatChange).not.toHaveBeenCalled()
        expect(onValueChange).not.toHaveBeenCalled()
        expect(onValueChangeEnd).not.toHaveBeenCalled()
        expect(api().format).toBe(format)
        expect(api().value.toJSON()).toEqual(original)
        expect(api().valueAsString).toBe(before.context.valueAsString)
      }
      const nextFormat = format === 'rgba' ? 'hsla' : 'rgba'
      currentApi.setFormat(nextFormat)
      expect(send).toHaveBeenCalledExactlyOnceWith({ type: 'FORMAT.SET', format: nextFormat, src: 'set-format' })
      expect(onFormatChange).toHaveBeenCalledExactlyOnceWith({ format: nextFormat })
      expect(api().format).toBe(nextFormat)
      expect(api().value.toJSON()).toEqual(original)
      expect(onValueChange).not.toHaveBeenCalled()
      expect(onValueChangeEnd).not.toHaveBeenCalled()
    }
  })

  it('changes format independently of controlled value acceptance', () => {
    const log: Array<{ type: string, value: string }> = []
    const onValueChangeEnd = vi.fn()
    let proposed = parseColor('#FF0000')
    const { api, service } = setup({
      id: 'controlled-format',
      value: proposed,
      onFormatChange: ({ format }) => log.push({ type: 'format', value: format }),
      onValueChange: ({ value, valueAsString }) => {
        proposed = value
        log.push({ type: 'value', value: valueAsString })
      },
      onValueChangeEnd,
    })

    api().setFormat('hsla')
    expect(api().format).toBe('hsla')
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(log).toEqual([{ type: 'format', value: 'hsla' }])

    api().setValue('#0000FF')
    expect(proposed.getFormat()).toBe('hsla')
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(log).toEqual([
      { type: 'format', value: 'hsla' },
      { type: 'value', value: 'hsla(240, 100%, 50%, 1)' },
    ])

    service.setContext({ value: proposed })
    expect(api().value.toString('hex')).toBe('#0000FF')
    expect(api().format).toBe('hsla')
    expect(log).toHaveLength(2)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })
})
