import type { ChannelSliderProps } from '../index'
import { parseColor } from '@destyler/color'
import { normalizeProps, spreadProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const cleanups: Array<() => void> = []

afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
})

function renderSlider(seed: string, props: ChannelSliderProps) {
  const root = document.createElement('div')
  const slider = document.createElement('div')
  const thumb = document.createElement('div')
  slider.append(thumb)
  root.append(slider)
  document.body.append(root)

  const onValueChange = vi.fn()
  const onValueChangeEnd = vi.fn()
  const service = machine({
    id: 'keyboard-dom',
    defaultOpen: true,
    openAutoFocus: false,
    defaultValue: parseColor(seed),
    onValueChange,
    onValueChangeEnd,
  }).start()
  const api = () => connect(service.state, service.send, normalizeProps)
  const unsubscribe = service.subscribe(() => {
    const current = api()
    spreadProps(root, current.getRootProps())
    spreadProps(slider, current.getChannelSliderProps(props))
    spreadProps(thumb, current.getChannelSliderThumbProps(props))
  })
  cleanups.push(() => {
    unsubscribe()
    service.stop()
    spreadProps(thumb, {})
    spreadProps(slider, {})
    root.remove()
  })

  const press = (key: string) => {
    expect(document.activeElement).toBe(thumb)
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    expect(thumb.dispatchEvent(event)).toBe(false)
    expect(event.defaultPrevented).toBe(true)
  }
  return { api, thumb, press, onValueChange, onValueChangeEnd }
}

describe('color-picker channel slider DOM keyboard wiring', () => {
  it('updates the focused default hue thumb from an RGB seed across repeated keys', async () => {
    const { api, thumb, press, onValueChange, onValueChangeEnd } = renderSlider('#FF0000', { channel: 'hue' })
    expect(thumb.getAttribute('role')).toBe('slider')
    expect(thumb.getAttribute('aria-valuenow')).toBe('0')
    expect(thumb.getAttribute('aria-valuemax')).toBe('360')
    thumb.focus()
    press('ArrowRight')
    await expect.poll(() => thumb.getAttribute('aria-valuenow')).toBe('1')
    expect(api().value.toJSON()).toEqual({ h: 1, s: 100, b: 100, a: 1 })
    press('ArrowRight')
    await expect.poll(() => thumb.getAttribute('aria-valuenow')).toBe('2')
    expect(api().value.toJSON()).toEqual({ h: 2, s: 100, b: 100, a: 1 })
    expect(document.activeElement).toBe(thumb)
    expect(onValueChange).toHaveBeenCalledTimes(2)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })

  it('applies Page keys through the focused alpha thumb and refreshes rendered props', async () => {
    const { api, thumb, press, onValueChange, onValueChangeEnd } = renderSlider(
      'rgba(12.5,25.25,50.125,0.5)',
      { channel: 'alpha', format: 'rgba' },
    )
    expect(thumb.getAttribute('aria-valuemin')).toBe('0')
    expect(thumb.getAttribute('aria-valuemax')).toBe('1')
    expect(thumb.getAttribute('aria-valuenow')).toBe('0.5')
    expect(thumb.style.left).toBe('50%')
    thumb.focus()
    press('PageUp')
    await expect.poll(() => thumb.getAttribute('aria-valuenow')).toBe('0.6')
    expect(thumb.style.left).toBe('60%')
    expect(api().value.toJSON()).toEqual({ r: 12.5, g: 25.25, b: 50.125, a: 0.6 })
    press('PageDown')
    await expect.poll(() => thumb.getAttribute('aria-valuenow')).toBe('0.5')
    expect(thumb.style.left).toBe('50%')
    expect(api().value.toJSON()).toEqual({ r: 12.5, g: 25.25, b: 50.125, a: 0.5 })
    expect(document.activeElement).toBe(thumb)
    expect(onValueChange).toHaveBeenCalledTimes(2)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })
})
