import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '../examples/vanilla/Slider'

const cleanups: VoidFunction[] = []
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

async function settle() {
  await Promise.resolve()
  await nextFrame()
  await nextFrame()
}

function fixture() {
  const mount = document.createElement('div')
  document.body.appendChild(mount)
  const cleanup = render(mount)
  cleanups.push(() => {
    cleanup()
    mount.remove()
  })
  const root = mount.querySelector<HTMLElement>('[data-slider-root]')!
  const thumb = mount.querySelector<HTMLElement>('[data-part="thumb"]')!
  return { mount, root, thumb, cleanup }
}

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})

describe('vanilla slider example lifetime', () => {
  it('keeps live measurements and controls working, then releases the thumb observer and subscriptions', async () => {
    const observe = vi.spyOn(window.ResizeObserver.prototype, 'observe')
    const disconnect = vi.spyOn(window.ResizeObserver.prototype, 'disconnect')
    const { mount, root, thumb, cleanup } = fixture()
    mount.id = 'slider-lifecycle-resize'
    const size = document.createElement('style')
    mount.appendChild(size)
    const resize = (width: number) => {
      size.textContent = `#${mount.id} [data-part="thumb"] { width: ${width}px; height: ${width}px; }`
    }

    await settle()
    const observation = observe.mock.calls.findIndex(([target]) => target === thumb)
    expect(observation).toBeGreaterThanOrEqual(0)
    const observer = observe.mock.contexts[observation]

    resize(36)
    await vi.waitFor(() => {
      expect(thumb.getBoundingClientRect().width).toBe(36)
      expect(root.style.getPropertyValue('--slider-thumb-offset-0')).toContain('18px')
    })

    thumb.focus()
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await vi.waitFor(() => expect(mount.querySelector('[data-slider-value-text]')?.textContent).toBe('1'))
    const orientation = mount.querySelector<HTMLSelectElement>('[data-testid="orientation"]')!
    orientation.value = 'vertical'
    orientation.dispatchEvent(new Event('change', { bubbles: true }))
    await vi.waitFor(() => expect(root.dataset.orientation).toBe('vertical'))
    await settle()

    const disconnectsBefore = disconnect.mock.contexts.filter(context => context === observer).length
    cleanup()
    cleanup()
    expect(disconnect.mock.contexts.filter(context => context === observer)).toHaveLength(disconnectsBefore + 1)

    const observationsAfter = observe.mock.calls.length
    const rootStyle = root.getAttribute('style')
    const visualizer = mount.querySelector('.viz')
    const retainedOrientation = mount.querySelector<HTMLSelectElement>('[data-testid="orientation"]')!
    retainedOrientation.value = 'horizontal'
    retainedOrientation.dispatchEvent(new Event('change', { bubbles: true }))
    resize(52)
    await settle()

    expect(thumb.getBoundingClientRect().width).toBe(52)
    expect(root.getAttribute('style')).toBe(rootStyle)
    expect(root.dataset.orientation).toBe('vertical')
    expect(mount.querySelector('[data-slider-value-text]')?.textContent).toBe('1')
    expect(mount.querySelector('.viz')).toBe(visualizer)
    expect(observe.mock.calls).toHaveLength(observationsAfter)

    mount.remove()
    await settle()
    expect(observe.mock.calls).toHaveLength(observationsAfter)
    expect(disconnect.mock.contexts.filter(context => context === observer)).toHaveLength(disconnectsBefore + 1)
  })

  it('cleans up a fixture before its first observer delivery and lets the next fixture update', async () => {
    const observe = vi.spyOn(window.ResizeObserver.prototype, 'observe')
    const disconnect = vi.spyOn(window.ResizeObserver.prototype, 'disconnect')
    const first = fixture()
    const observation = observe.mock.calls.findIndex(([target]) => target === first.thumb)
    expect(observation).toBeGreaterThanOrEqual(0)
    const observer = observe.mock.contexts[observation]
    const disconnectsBefore = disconnect.mock.contexts.filter(context => context === observer).length
    first.cleanup()
    first.mount.remove()
    expect(disconnect.mock.contexts.filter(context => context === observer)).toHaveLength(disconnectsBefore + 1)
    const firstObservations = observe.mock.calls.filter(([target]) => target === first.thumb).length

    const second = fixture()
    await settle()
    second.thumb.focus()
    second.thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await vi.waitFor(() => expect(second.mount.querySelector('[data-slider-value-text]')?.textContent).toBe('1'))
    expect(first.mount.querySelector('[data-slider-value-text]')?.textContent).toBe('0')
    expect(observe.mock.calls.filter(([target]) => target === first.thumb)).toHaveLength(firstObservations)
  })

  it('keeps retained thumb events from reaching a disposed machine while live events still work', async () => {
    const warn = vi.spyOn(console, 'warn')
    const { mount, root, thumb, cleanup } = fixture()
    const focusTarget = document.createElement('button')
    mount.appendChild(focusTarget)
    await settle()

    thumb.focus()
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await vi.waitFor(() => expect(mount.querySelector('[data-slider-value-text]')?.textContent).toBe('1'))
    focusTarget.focus()
    await vi.waitFor(() => expect(thumb.hasAttribute('data-focus')).toBe(false))
    thumb.focus()
    await vi.waitFor(() => expect(thumb.hasAttribute('data-focus')).toBe(true))

    const rootStyle = root.getAttribute('style')
    const visualizer = mount.querySelector('.viz')
    cleanup()
    cleanup()
    expect(mount.isConnected).toBe(true)
    focusTarget.focus()
    thumb.focus()
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    thumb.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }))
    thumb.blur()
    await settle()

    expect(mount.querySelector('[data-slider-value-text]')?.textContent).toBe('1')
    expect(root.getAttribute('style')).toBe(rootStyle)
    expect(mount.querySelector('.viz')).toBe(visualizer)
    mount.remove()
    await settle()
    expect(warn.mock.calls.filter(([message]) => message === '[@destyler/xstate > transition] Cannot transition a stopped machine')).toHaveLength(0)
  })
})
